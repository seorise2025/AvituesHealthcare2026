// Run: npx deno@2.1.4 test --node-modules-dir=none --allow-env --allow-net supabase/functions/submit-lead/
// Uses a fake database (PostgREST) and a fake Resend, so nothing real is touched.
import { handler, validate } from "./lead.ts";

const assert = (c: unknown, msg: string) => {
  if (!c) throw new Error(msg);
};

type Rec = { method: string; path: string; body: string };
const seen: Rec[] = [];
let rateCount = 0;
const fake = Deno.serve({ port: 0, onListen() {} }, async (req) => {
  const u = new URL(req.url);
  const body = req.method === "HEAD" ? "" : await req.text();
  seen.push({ method: req.method, path: u.pathname, body });
  if (u.pathname === "/emails") return Response.json({ id: "e1" });
  if (u.pathname === "/rest/v1/leads") {
    if (req.method === "HEAD" || req.method === "GET") {
      return new Response(null, { status: 200, headers: { "Content-Range": `*/${rateCount}` } });
    }
    if (req.method === "POST") return new Response(null, { status: 201 });
    if (req.method === "PATCH") return new Response(null, { status: 204 });
  }
  return new Response("nope", { status: 404 });
});
const base = `http://127.0.0.1:${fake.addr.port}`;
Object.entries({
  SUPABASE_URL: base, SUPABASE_SERVICE_ROLE_KEY: "service", RESEND_API_KEY: "k", RESEND_API_URL: `${base}/emails`,
  MAIL_FROM: "website@test.example", LEAD_TO_EMPLOYER: "bookings@test.example", LEAD_TO_CANDIDATE: "recruit@test.example",
  LEAD_TO_GENERAL: "info@test.example", IP_SALT: "salt", ALLOWED_ORIGINS: "https://aviteushealthcare.co.uk",
}).forEach(([k, v]) => Deno.env.set(k, v));

const ORIGIN = "https://aviteushealthcare.co.uk";
const employer = {
  lead_type: "employer", urgency: "urgent", roles: ["RGN", "HCA"], name: "Sam Test", organisation: "Oak House",
  phone: "020 7946 0000", email: "sam@oak.example", postcode: "ha3 8dd", setting: "Nursing home",
  notes: "Two nights from Friday", website: "", form_ts: String(Date.now() - 10_000), page_url: "/request-staff/",
};
const call = (body: unknown, origin = ORIGIN, ip = "203.0.113.9") =>
  handler(new Request("http://fn/submit-lead", {
    method: "POST",
    headers: { "content-type": "application/json", origin, "x-forwarded-for": ip },
    body: JSON.stringify(body),
  }));
const opts = { sanitizeResources: false, sanitizeOps: false };

Deno.test("valid staff request is stored and emailed", opts, async () => {
  seen.length = 0;
  const r = await call(employer);
  const data = await r.json();
  assert(r.status === 200 && data.ok, `status ${r.status}`);
  assert(/^AV-\d{8}-[A-Z0-9]{5}$/.test(data.ref), "ref format");
  const insert = seen.find((s) => s.method === "POST" && s.path === "/rest/v1/leads");
  assert(insert, "inserted");
  const row = JSON.parse(insert!.body);
  assert(row.form_type === "employer" && row.data.postcode === "HA3 8DD", "row data");
  assert(row.ip_hash && row.ip_hash !== "203.0.113.9", "ip is hashed, not stored raw");
  const mails = seen.filter((s) => s.path === "/emails").map((s) => JSON.parse(s.body));
  assert(mails.length === 2, `two emails, got ${mails.length}`);
  assert(mails[0].subject.startsWith("URGENT Staff request: Oak House"), mails[0].subject);
  assert(mails[0].to[0] === "bookings@test.example" && mails[0].reply_to === "sam@oak.example", "routing");
  assert(mails[0].text.includes("RGN nurse, Healthcare assistant"), "roles described");
  assert(mails[1].to[0] === "sam@oak.example", "confirmation to visitor");
  const patch = seen.find((s) => s.method === "PATCH");
  assert(patch && JSON.parse(patch.body).email_ok === true, "status updated");
});

Deno.test("bad fields come back as field errors", opts, async () => {
  const r = await call({ ...employer, email: "nope", postcode: "XYZ", urgency: "permanent" });
  const data = await r.json();
  assert(r.status === 400, "400");
  assert(data.errors.email && data.errors.postcode && data.errors.urgency, JSON.stringify(data.errors));
});

Deno.test("honeypot and too-fast forms are dropped quietly", opts, async () => {
  seen.length = 0;
  const a = await call({ ...employer, website: "http://spam" });
  const b = await call({ ...employer, form_ts: String(Date.now()) });
  assert(a.status === 200 && b.status === 200, "look successful");
  assert(!seen.some((s) => s.method === "POST"), "nothing stored");
});

Deno.test("other websites cannot post", opts, async () => {
  const r = await call(employer, "https://evil.example");
  assert(r.status === 403, `403, got ${r.status}`);
});

Deno.test("rate limit", opts, async () => {
  rateCount = 5;
  const r = await call(employer);
  rateCount = 0;
  assert(r.status === 429, `429, got ${r.status}`);
});

Deno.test("candidate and contact rules", () => {
  const c = validate("candidate", { role: "Nurse", name: "A", phone: "07700 900123", email: "a@b.co.uk",
    postcode: "SW1A 1AA", experience: "1 to 3 years", right_to_work: "Yes" });
  assert(!Object.keys(c.errors).length, JSON.stringify(c.errors));
  const g = validate("general", { name: "", email: "a@b.co.uk", message: "x".repeat(3001) });
  assert(g.errors.name && g.errors.message, JSON.stringify(g.errors));
});

Deno.test("stop fake server", opts, async () => {
  await fake.shutdown();
});
