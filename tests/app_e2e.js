// Browser checks for the React app. Started by tests/run_app_e2e.py.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const BASE = process.env.BASE;
const INSPECT = process.env.INSPECT;
const routesSrc = fs.readFileSync(path.join(__dirname, "..", "lovable-app", "src", "routes.ts"), "utf8");
const ROUTES = [...routesSrc.matchAll(/path: "([^"]+)"/g)].map((m) => m[1]);
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
}
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // The contact test sends a bad email on purpose; the 400 it gets back is expected.
  page.on("console", (m) => { if (m.type() === "error" && !/status of 400/.test(m.text())) errors.push(m.text()); });

  // 1. Every page loads directly by URL, has one h1, a title and a description.
  const linkTargets = new Set();
  let axeViolations = [];
  for (const r of ROUTES) {
    const before = errors.length;
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    await page.waitForSelector("main h1");
    const h1 = await page.locator("main h1").count();
    const title = await page.title();
    const desc = await page.getAttribute('meta[name="description"]', "content");
    const canon = await page.getAttribute('link[rel="canonical"]', "href");
    const notFound = await page.locator("text=Page not found").count();
    check(`page ${r}`, h1 === 1 && title.length > 10 && desc && canon.endsWith(r) && !notFound && errors.length === before,
      `h1=${h1} title="${title.slice(0, 40)}"`);
    (await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")))).forEach((h) => linkTargets.add(h));
    await page.addScriptTag({ content: AXE });
    const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] })).violations);
    v.forEach((x) => axeViolations.push(`${r}: ${x.id} (${x.nodes.length})`));
  }
  check("no accessibility violations (axe, WCAG 2.2 AA)", axeViolations.length === 0, axeViolations.slice(0, 6).join("; "));

  // 2. Every internal link points at a real page or file.
  const known = new Set(ROUTES);
  const bad = [...linkTargets].filter((h) => {
    const p = h.split("#")[0].split("?")[0];
    return !(known.has(p) || p.startsWith("/files/") || p === "/sitemap.xml");
  });
  check("all internal links resolve", bad.length === 0, bad.join(", "));

  // 3. Unknown address shows the 404 page.
  await page.goto(BASE + "/no-such-page/", { waitUntil: "networkidle" });
  check("unknown URL shows not-found page", (await page.locator("main h1").count()) === 1 &&
    (await page.getAttribute('meta[name="robots"]', "content")).startsWith("noindex"));

  // 4. Clicking around works without full page loads, and lands at the top.
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => { window.__spa = 1; window.scrollTo(0, 2000); });
  await page.locator(".site-header .header-cta a", { hasText: "Request Staff" }).click();
  await page.waitForURL("**/request-staff/");
  check("in-app navigation (no reload, scrolled to top)",
    (await page.evaluate(() => window.__spa)) === 1 && (await page.evaluate(() => window.scrollY)) < 5);

  // 5. Desktop dropdown opens by click and closes on Escape.
  await page.locator(".menu > li > button", { hasText: "Hire Staff" }).click();
  const open1 = await page.locator(".menu > li.is-open").count();
  await page.keyboard.press("Escape");
  check("dropdown opens and closes", open1 === 1 && (await page.locator(".menu > li.is-open").count()) === 0);

  // 6. Employer form: empty submit shows errors, then a real send.
  await page.goto(BASE + "/request-staff/", { waitUntil: "networkidle" });
  await page.locator("#request-form button[type=submit]").click();
  const summary = page.locator("#request-form .error-summary.is-visible li");
  check("empty form shows error summary", (await summary.count()) >= 5, `${await summary.count()} errors`);
  await page.locator("label.option:has(#e-urgency)").click();
  await page.fill("#e-name", "Sam Test");
  await page.fill("#e-org", "Oak House Care");
  await page.fill("#e-phone", "020 7946 0000");
  await page.fill("#e-email", "sam@oak.example");
  await page.fill("#e-postcode", "HA3 8DD");
  await page.selectOption("#e-setting", "Nursing home");
  await page.fill("#e-notes", "Two nights from Friday");
  await pause(1100);
  await page.locator("#request-form button[type=submit]").click();
  await page.waitForURL("**/thank-you/employer/?ref=*", { timeout: 10000 });
  const ref1 = await page.locator(".ref-line").textContent();
  check("staff request sends and shows reference", /^AV-\d{8}-[A-Z0-9]{5}$/.test(ref1), ref1);

  // 7. Candidate form.
  await page.goto(BASE + "/candidates/register/", { waitUntil: "networkidle" });
  await page.locator("label.option:has(#c-role)").click();
  await page.fill("#c-name", "Alex Carer");
  await page.fill("#c-phone", "07700 900123");
  await page.fill("#c-email", "alex@example.co.uk");
  await page.fill("#c-postcode", "SW1A 1AA");
  await page.selectOption("#c-exp", "1 to 3 years");
  await page.selectOption("#c-rtw", "Yes");
  const consent = page.locator("#register-form input[type=checkbox][required]");
  if (await consent.count()) await consent.check();
  await pause(1100);
  await page.locator("#register-form button[type=submit]").click();
  await page.waitForURL("**/thank-you/candidate/?ref=*", { timeout: 10000 });
  check("registration sends", true);

  // 8. Contact form, with a server-side error first (bad email that passes the browser).
  await page.goto(BASE + "/contact-us/", { waitUntil: "networkidle" });
  await page.fill("#g-name", "Jo Public");
  await page.fill("#g-email", "jo@example");
  await page.fill("#g-msg", "Question about a timesheet.");
  await pause(1100);
  await page.locator("#message-form button[type=submit]").click();
  await page.waitForSelector("#message-form .error-summary.is-visible");
  check("server field errors are shown", (await page.locator("#message-form .field.has-error #g-email").count()) === 1);
  await page.fill("#g-email", "jo@example.co.uk");
  await page.locator("#message-form button[type=submit]").click();
  await page.waitForURL("**/thank-you/message/?ref=*", { timeout: 10000 });
  check("contact message sends", true);

  // 9. Emails reached the right inboxes.
  await pause(800);
  const mail = await (await fetch(INSPECT)).json();
  const to = (addr) => mail.filter((m) => m.to.includes(addr));
  check("staff request emailed to bookings, marked urgent", to("bookings@test.example").some((m) => m.subject.startsWith("URGENT")));
  check("registration emailed to recruitment", to("recruit@test.example").length === 1);
  check("message emailed to info", to("info@test.example").length === 1);
  check("visitors got confirmation emails", to("sam@oak.example").length === 1 && to("alex@example.co.uk").length === 1);

  // 10. Phone width: no sideways scroll, menu opens and closes, focus returns.
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const m = await phone.newPage();
  let overflow = [];
  for (const r of ROUTES) {
    await m.goto(BASE + r, { waitUntil: "networkidle" });
    if (await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) overflow.push(r);
  }
  check("no sideways scroll at 390px", overflow.length === 0, overflow.join(", "));
  await m.goto(BASE + "/", { waitUntil: "networkidle" });
  await m.locator(".menu-toggle").click();
  const shown = await m.locator("#mobile-menu").isVisible();
  await m.locator("#mobile-menu a", { hasText: "Agency nurses" }).click();
  await m.waitForURL("**/hire-staff/nursing-staff/");
  check("mobile menu opens and closes on navigation", shown && !(await m.locator("#mobile-menu").isVisible()));
  await m.screenshot({ path: path.join(process.env.OUT, "screenshots", "app-mobile-nurses.png") });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(process.env.OUT, "screenshots", "app-home-desktop.png") });

  check("no script errors on any page", errors.length === 0, errors.slice(0, 3).join(" | "));
  await browser.close();
  const failed = results.filter((r) => !r.ok);
  fs.writeFileSync(path.join(process.env.OUT, "app-test-results.json"), JSON.stringify({ ran: new Date().toISOString(), passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`);
  process.exit(failed.length ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
