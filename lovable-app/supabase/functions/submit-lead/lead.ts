// submit-lead: checks a website form, stores it, then emails it.
//
// Secrets (Lovable Cloud > Secrets, or `supabase secrets set`):
//   RESEND_API_KEY      key for resend.com (leave unset to store only)
//   MAIL_FROM           a sender on a domain verified in Resend, e.g. website@aviteushealthcare.co.uk
//   LEAD_TO_EMPLOYER    inbox(es) for staff requests, comma separated
//   LEAD_TO_CANDIDATE   inbox(es) for registrations
//   LEAD_TO_GENERAL     inbox(es) for contact messages
//   ALLOWED_ORIGINS     optional, comma separated, e.g. https://aviteushealthcare.co.uk
//   IP_SALT             any long random string, used to hash visitor IPs for rate limiting
//   SEND_CONFIRMATION   "false" to stop the confirmation email to the visitor
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

type LeadType = "employer" | "candidate" | "general";
type Spec = {
  label: string;
  required: string[];
  optional: string[];
  choices: Record<string, Record<string, string>>;
};

const SETTINGS = ["", "Residential care home", "Nursing home", "Supported living", "Learning disability service",
  "Mental health service", "NHS trust or hospital", "Other"];
const FORMS: Record<LeadType, Spec> = {
  employer: {
    label: "Staff request",
    required: ["urgency", "name", "organisation", "phone", "email", "postcode"],
    optional: ["roles", "setting", "notes", "marketing_opt_in"],
    choices: {
      urgency: { urgent: "Today or tomorrow", temporary: "Shifts in the coming weeks" },
      roles: { RGN: "RGN nurse", RMN: "RMN nurse", RNLD: "RNLD nurse", "Senior carer": "Senior carer",
        HCA: "Healthcare assistant", "Support worker": "Support worker" },
      setting: Object.fromEntries(SETTINGS.map((s) => [s, ""])),
    },
  },
  candidate: {
    label: "Candidate registration",
    required: ["role", "name", "phone", "email", "postcode", "experience", "right_to_work"],
    optional: ["notes", "marketing_opt_in"],
    choices: {
      role: { HCA: "Healthcare assistant", "Support worker": "Support worker", "Senior carer": "Senior carer",
        Nurse: "Registered nurse" },
      experience: Object.fromEntries(["None yet", "Less than 6 months", "6 to 12 months", "1 to 3 years",
        "More than 3 years"].map((s) => [s, ""])),
      right_to_work: { Yes: "", No: "", "Not sure": "" },
    },
  },
  general: {
    label: "Website message",
    required: ["name", "email", "message"],
    optional: ["topic", "phone"],
    choices: {
      topic: Object.fromEntries(["General question", "Timesheet or pay", "Invoice", "Compliance file",
        "Complaint or feedback", "Data protection request", "Other"].map((s) => [s, ""])),
    },
  },
};
const MAX_LEN: Record<string, number> = { name: 100, organisation: 150, email: 254, phone: 30, postcode: 10,
  notes: 2000, message: 3000, setting: 60, topic: 60 };
const MESSAGES: Record<string, string> = {
  urgency: "Choose how soon you need staff.",
  name: "Enter your name.",
  organisation: "Enter your organisation.",
  phone: "Enter a UK phone number, for example 020 3488 8172.",
  email: "Enter an email address, for example name@example.co.uk.",
  postcode: "Enter a UK postcode, for example HA3 8DD.",
  role: "Choose the role you want.",
  experience: "Choose your experience.",
  right_to_work: "Choose an answer.",
  message: "Enter your message.",
};
const MARKETING_WORDING: Partial<Record<LeadType, string>> = {
  employer: "Send me occasional staffing updates from Aviteus Healthcare by email. I can unsubscribe at any time.",
  candidate: "Send me new shift and job alerts by email or text. I can opt out at any time.",
};
const UK_POSTCODE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;
const EMAIL = /^[^@\s<>"',;]{1,64}@[A-Za-z0-9.-]{1,253}\.[A-Za-z]{2,}$/;
const CONTEXT = ["page_url", "referrer", "utm_source", "utm_medium", "utm_campaign"];
const RATE_LIMIT = 5;
const RATE_WINDOW_MIN = 15;
const MIN_FILL_MS = 3000;
const PHONE = "020 3488 8172";

const env = (k: string) => (Deno.env.get(k) || "").trim();
const list = (k: string) => env(k).split(",").map((s) => s.trim()).filter(Boolean);

function cors(origin: string | null): Record<string, string> {
  const allowed = list("ALLOWED_ORIGINS");
  const ok = origin && (!allowed.length || allowed.includes(origin));
  return {
    "Access-Control-Allow-Origin": ok ? origin! : allowed[0] || "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(status: number, body: unknown, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

const clean = (v: unknown) => String(v ?? "").replace(/\r|\u0000/g, " ").replace(/[ \t]+/g, " ").trim();

export function validate(type: LeadType, raw: Record<string, unknown>) {
  const spec = FORMS[type];
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};
  for (const name of [...spec.required, ...spec.optional]) {
    const rawVal = raw[name];
    let val: string | string[] | boolean;
    if (name === "roles") {
      val = (Array.isArray(rawVal) ? rawVal : rawVal ? [rawVal] : []).map(clean).filter(Boolean);
    } else {
      val = clean(Array.isArray(rawVal) ? rawVal[0] : rawVal);
      if (name !== "notes" && name !== "message") val = val.replace(/\n/g, " ");
      const limit = MAX_LEN[name] ?? 200;
      if (val.length > limit) {
        errors[name] = `Keep this under ${limit} characters.`;
        continue;
      }
    }
    const empty = Array.isArray(val) ? val.length === 0 : val === "";
    if (spec.required.includes(name) && empty) {
      errors[name] = MESSAGES[name] || "This field is required.";
      continue;
    }
    if (!empty && spec.choices[name]) {
      const items = Array.isArray(val) ? val : [val as string];
      if (items.some((i) => !(i in spec.choices[name]))) {
        errors[name] = "Choose one of the options given.";
        continue;
      }
    }
    if (name === "email" && !empty && !EMAIL.test(val as string)) {
      errors[name] = MESSAGES.email;
      continue;
    }
    if (name === "phone" && !empty) {
      const digits = (val as string).replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15 || /[^\d\s()+-]/.test(val as string)) {
        errors[name] = MESSAGES.phone;
        continue;
      }
    }
    if (name === "postcode" && !empty) {
      if (!UK_POSTCODE.test(val as string)) {
        errors[name] = MESSAGES.postcode;
        continue;
      }
      val = (val as string).toUpperCase();
    }
    if (name === "marketing_opt_in") val = Boolean(val);
    data[name] = val;
  }
  return { data, errors };
}

function newRef(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `AV-${d}-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

function describe(type: LeadType, data: Record<string, unknown>): string {
  const spec = FORMS[type];
  const lines: string[] = [];
  for (const name of [...spec.required, ...spec.optional]) {
    let v = data[name];
    if (v === undefined || v === "" || v === false || (Array.isArray(v) && !v.length)) continue;
    if (Array.isArray(v)) v = v.map((x) => spec.choices.roles?.[x] || x).join(", ");
    else if (v === true) v = "Yes";
    else if (spec.choices[name]?.[v as string]) v = spec.choices[name][v as string];
    lines.push(`${name.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase())}: ${v}`);
  }
  return lines.join("\n");
}

async function sendEmail(to: string[], subject: string, text: string, replyTo?: string): Promise<void> {
  const key = env("RESEND_API_KEY");
  const from = env("MAIL_FROM");
  if (!key || !from || !to.length) throw new Error("email not configured");
  const r = await fetch(env("RESEND_API_URL") || "https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `Aviteus Healthcare <${from}>`, to, subject, text, reply_to: replyTo }),
  });
  if (!r.ok) throw new Error(`resend ${r.status}`);
}

export async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");
  const headers = cors(origin);
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json(405, { ok: false }, headers);
  const allowed = list("ALLOWED_ORIGINS");
  if (allowed.length && (!origin || !allowed.includes(origin))) return json(403, { ok: false }, headers);

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return json(400, { ok: false, errors: {} }, headers);
  }
  const type = raw.lead_type as LeadType;
  if (!(type in FORMS)) return json(400, { ok: false, errors: {} }, headers);

  // Spam traps: a filled hidden field, or a form sent too fast. Pretend it worked.
  const started = Number(raw.form_ts || 0);
  if (clean(raw.website) || !started || Date.now() - started < MIN_FILL_MS) {
    return json(200, { ok: true, ref: "" }, headers);
  }

  const { data, errors } = validate(type, raw);
  if (Object.keys(errors).length) return json(400, { ok: false, errors }, headers);

  const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const ipHash = ip ? await sha256(env("IP_SALT") + ip) : null;
  if (ipHash) {
    const since = new Date(Date.now() - RATE_WINDOW_MIN * 60_000).toISOString();
    const { count } = await db.from("leads").select("ref", { count: "exact", head: true })
      .eq("ip_hash", ipHash).gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT) return json(429, { ok: false }, headers);
  }

  const context = Object.fromEntries(CONTEXT.map((k) => [k, clean(raw[k]).slice(0, 300)]));
  const ref = newRef();
  const opt = Boolean(data.marketing_opt_in);
  const { error: insertError } = await db.from("leads").insert({
    ref, form_type: type, data, context, marketing_opt_in: opt,
    marketing_wording: opt ? MARKETING_WORDING[type] ?? null : null, ip_hash: ipHash,
  });
  if (insertError) {
    console.error("store failed", insertError.message);
    return json(500, { ok: false }, headers);
  }

  // The lead is safe in the database. Email failures are logged, not shown to the visitor.
  const spec = FORMS[type];
  const urgent = type === "employer" && data.urgency === "urgent";
  const who = (data.organisation || data.name) as string;
  const update: Record<string, unknown> = { status: "stored" };
  try {
    await sendEmail(
      list(`LEAD_TO_${type.toUpperCase()}`),
      `${urgent ? "URGENT " : ""}${spec.label}: ${who} (${ref})`,
      `${urgent ? "URGENT: cover needed today or tomorrow. Call back now.\n\n" : ""}` +
        `New ${spec.label.toLowerCase()} from the website.\nReference: ${ref}\n\n${describe(type, data)}\n\n` +
        `Page: ${context.page_url}\nReferrer: ${context.referrer}\n` +
        `Campaign: ${context.utm_source} ${context.utm_medium} ${context.utm_campaign}\n\n` +
        "Reply to this email to reach the sender directly.",
      data.email as string,
    );
    update.email_ok = true;
    update.status = "routed";
  } catch (e) {
    update.last_error = String(e);
  }
  if (env("SEND_CONFIRMATION") !== "false") {
    try {
      await sendEmail(
        [data.email as string],
        `We have your ${type === "general" ? "message" : type === "employer" ? "request" : "registration"} (${ref})`,
        `Hello ${data.name},\n\nThank you for contacting Aviteus Healthcare. Your reference is ${ref}.\n` +
          `A member of our team will be in touch.\n\nIf you need staff in the next few hours, please call ${PHONE}.\n\n` +
          "Aviteus Healthcare Ltd, Alpha House, 296 Kenton Road, Harrow, HA3 8DD",
      );
      update.confirm_ok = true;
    } catch (e) {
      update.last_error = `${update.last_error ?? ""} confirm: ${e}`.trim();
    }
  }
  await db.from("leads").update(update).eq("ref", ref);
  return json(200, { ok: true, ref }, headers);
}
