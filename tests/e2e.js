/* Browser tests. Started by tests/run_e2e.py, which provides the servers. */
const { chromium, devices } = require("playwright");
const fs = require("fs");
const path = require("path");

const { BASE, ABASE, PBASE, INSPECT, DIST, OUT } = process.env;
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const SHOTS = path.join(OUT, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

const results = { ran_at: new Date().toISOString(), checks: [], axe: {}, links: {}, performance: {}, notes: [] };
let failures = 0;
function check(name, ok, detail) {
  results.checks.push({ name, ok: !!ok, detail: detail || "" });
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJSON(p) { const r = await fetch(INSPECT + p); return r.json(); }
async function waitFor(fn, ms = 8000) {
  const end = Date.now() + ms;
  while (Date.now() < end) { const v = await fn(); if (v) return v; await sleep(150); }
  return null;
}

function allPages(dir, root = dir) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (f !== "assets") out = out.concat(allPages(p, root)); }
    else if (f === "index.html") out.push("/" + path.relative(root, dir).split(path.sep).join("/") + (dir === root ? "" : "/"));
  }
  return out.map((u) => u.replace(/^\/\/$/, "/").replace(/^\/\//, "/"));
}

async function employerFlow(browser, label, device) {
  const ctx = await browser.newContext(device);
  const page = await ctx.newPage();
  const visitor = `visitor.${label}.${Date.now()}@example.com`;
  await page.goto(BASE + "/sectors/care-homes/");
  const cta = label === "mobile" ? page.locator(".action-bar a", { hasText: "Request Staff" }) : page.locator(".header-cta a", { hasText: "Request Staff" });
  check(`[${label}] primary call to action visible on a service page`, await cta.isVisible());
  await cta.click();
  await page.waitForURL("**/request-staff/");
  check(`[${label}] call to action opens the request page`, page.url().endsWith("/request-staff/"));

  // Empty submit
  await page.click('#request-form button[type="submit"]');
  const summary = page.locator("#request-form .error-summary");
  check(`[${label}] empty submit shows an error summary`, await summary.isVisible());
  const n = await summary.locator("li").count();
  check(`[${label}] error summary lists each missing field`, n >= 6, `${n} errors listed`);
  check(`[${label}] focus moves to the error summary`, await page.evaluate(() => document.activeElement.classList.contains("error-summary")));
  check(`[${label}] invalid fields marked aria-invalid`, (await page.locator('#request-form [aria-invalid="true"]').count()) >= 6);
  if (label === "desktop") await page.screenshot({ path: path.join(SHOTS, "form-errors-desktop.png"), fullPage: false });

  // Bad formats
  await page.click('label.option:has(input[name="urgency"][value="urgent"])');
  await page.fill("#e-name", "Sam Taylor");
  await page.fill("#e-org", "Oak House Care Home");
  await page.fill("#e-phone", "020 7946 0018");
  await page.fill("#e-email", "not-an-email");
  await page.fill("#e-postcode", "12345");
  await page.click('#request-form button[type="submit"]');
  check(`[${label}] bad email and postcode are caught`, (await summary.locator("li").count()) === 2);

  // Valid
  await page.fill("#e-email", visitor);
  await page.fill("#e-postcode", "HA3 8DD");
  await page.click('label.option:has(input[name="roles"][value="RGN"])');
  await page.selectOption("#e-setting", "Nursing home");
  await page.fill("#e-notes", "Two night shifts from Friday");
  await sleep(1200);
  await page.click('#request-form button[type="submit"]');
  await page.waitForURL("**/thank-you/employer/**", { timeout: 10000 });
  const ref = (await page.locator("[data-ref]").textContent()).trim();
  check(`[${label}] valid request lands on the thank-you page with a reference`, /^AV-\d{8}-[A-Z0-9]{5}$/.test(ref), ref);
  if (label === "mobile") await page.screenshot({ path: path.join(SHOTS, "thank-you-mobile.png"), fullPage: false });

  const mail = await waitFor(async () => {
    const m = await getJSON("/mail");
    const internal = m.find((x) => x.to.includes("bookings@test.example") && x.subject.includes(ref));
    const confirm = m.find((x) => x.to.includes(visitor) && x.subject.includes(ref));
    return internal && confirm ? { internal, confirm } : null;
  });
  check(`[${label}] request emailed to the bookings inbox`, mail && mail.internal.subject.startsWith("URGENT"), mail && mail.internal.subject);
  check(`[${label}] bookings email has Reply-To set to the visitor`, mail && mail.internal.reply_to === visitor);
  check(`[${label}] visitor receives a confirmation email`, !!(mail && mail.confirm));
  const hook = await waitFor(async () => (await getJSON("/hook")).find((h) => h.ref === ref));
  check(`[${label}] request posted to the CRM webhook`, hook && hook.lead_type === "employer" && hook.source.page_url === "/request-staff/");

  // Delivery failure: network down
  await page.goto(BASE + "/request-staff/");
  await page.route("**/api/enquiry", (r) => r.abort());
  await page.click('label.option:has(input[name="urgency"][value="temporary"])');
  for (const [s, v] of [["#e-name", "A"], ["#e-org", "B"], ["#e-phone", "02079460018"], ["#e-email", "a@example.com"], ["#e-postcode", "HA3 8DD"]]) await page.fill(s, v);
  await page.click('#request-form button[type="submit"]');
  await page.waitForSelector("#request-form .send-error.is-visible");
  check(`[${label}] network failure shows phone and email fallback`, await page.locator("#request-form .send-error").isVisible());
  check(`[${label}] button is usable again after a failure`, await page.locator('#request-form button[type="submit"]').isEnabled());
  await page.unroute("**/api/enquiry");
  await page.route("**/api/enquiry", (r) => r.fulfill({ status: 503, contentType: "application/json", body: '{"ok":false,"error":"server"}' }));
  await page.click('#request-form button[type="submit"]');
  await page.waitForSelector("#request-form .send-error.is-visible");
  check(`[${label}] server error (503) shows the fallback message`, true);
  await page.unroute("**/api/enquiry");

  // Storage and cookies
  const storage = await page.evaluate(() => localStorage.length + sessionStorage.length);
  const cookies = await ctx.cookies();
  check(`[${label}] no cookies or browser storage used`, storage === 0 && cookies.length === 0, `cookies=${cookies.length}, storage=${storage}`);
  await ctx.close();
}

async function candidateAndGeneral(browser) {
  const ctx = await browser.newContext(devices["iPhone 13"]);
  const page = await ctx.newPage();
  const visitor = `cand.${Date.now()}@example.com`;
  await page.goto(BASE + "/jobs/healthcare-assistant/");
  await page.locator(".page-head a", { hasText: "Register now" }).click();
  await page.waitForURL("**/candidates/register/");
  await page.click('label.option:has(input[name="role"][value="HCA"])');
  await page.fill("#c-name", "Ade Bello");
  await page.fill("#c-phone", "07700 900123");
  await page.fill("#c-email", visitor);
  await page.fill("#c-postcode", "HA1 1AA");
  await page.selectOption("#c-exp", "1 to 3 years");
  await page.selectOption("#c-rtw", "Yes");
  await sleep(1200);
  await page.click('#register-form button[type="submit"]');
  await page.waitForURL("**/thank-you/candidate/**");
  const ref = (await page.locator("[data-ref]").textContent()).trim();
  const m = await waitFor(async () => (await getJSON("/mail")).find((x) => x.to.includes("recruit@test.example") && x.subject.includes(ref)));
  check("[mobile] candidate registration reaches the recruitment inbox", !!m);
  const c = await waitFor(async () => (await getJSON("/mail")).find((x) => x.to.includes(visitor)));
  check("[mobile] candidate receives a confirmation email", !!c && c.body.includes("never charge"));

  await page.goto(BASE + "/contact-us/");
  await page.fill("#g-name", "Pat Jones");
  await page.fill("#g-email", "pat@example.com");
  await page.selectOption("#g-topic", "Invoice");
  await page.fill("#g-msg", "Please resend invoice 1234.");
  await sleep(1200);
  await page.click('#message-form button[type="submit"]');
  await page.waitForURL("**/thank-you/message/**");
  const g = await waitFor(async () => (await getJSON("/mail")).find((x) => x.to.includes("info@test.example")));
  check("[mobile] contact form message reaches the general inbox", !!g);
  await ctx.close();
}

async function keyboard(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/");
  await page.keyboard.press("Tab");
  check("[keyboard] first Tab reaches the skip link", await page.evaluate(() => document.activeElement.classList.contains("skip-link")));
  await page.keyboard.press("Enter");
  check("[keyboard] skip link jumps to main content", page.url().endsWith("#main"));
  await page.goto(BASE + "/");
  let found = false;
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(() => document.activeElement.textContent.trim() === "Hire Staff")) { found = true; break; }
  }
  check("[keyboard] Hire Staff menu reachable by Tab", found);
  await page.keyboard.press("Enter");
  check("[keyboard] Enter opens the dropdown", await page.locator(".dropdown--wide").isVisible());
  check("[keyboard] aria-expanded set to true", (await page.evaluate(() => document.activeElement.getAttribute("aria-expanded"))) === "true");
  await page.keyboard.press("Tab");
  check("[keyboard] Tab moves into the dropdown links", await page.evaluate(() => !!document.activeElement.closest(".dropdown")));
  await page.keyboard.press("Escape");
  await sleep(100);
  check("[keyboard] Escape closes the dropdown", !(await page.evaluate(() => document.querySelector(".menu > li.is-open"))));
  await ctx.close();

  const m = await browser.newContext(devices["iPhone 13"]);
  const mp = await m.newPage();
  await mp.goto(BASE + "/");
  await mp.click("[data-menu-open]");
  check("[mobile menu] opens", await mp.locator("#mobile-menu").isVisible());
  check("[mobile menu] focus moves to close button", await mp.evaluate(() => document.activeElement.hasAttribute("data-menu-close")));
  await mp.keyboard.press("Escape");
  check("[mobile menu] Escape closes it and returns focus", !(await mp.locator("#mobile-menu").isVisible()) && (await mp.evaluate(() => document.activeElement.hasAttribute("data-menu-open"))));
  await m.close();
}

async function crawl(browser) {
  const pages = allPages(DIST);
  results.links.pages = pages.length;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const external = new Set();
  page.on("request", (r) => { const u = new URL(r.url()); if (u.origin !== BASE) external.add(u.host); });
  const links = new Set();
  const axeAll = {};
  let pageErrors = 0;
  page.on("pageerror", () => pageErrors++);
  for (const p of pages) {
    const resp = await page.goto(BASE + p, { waitUntil: "load" });
    if (!resp || resp.status() !== 200) check(`page loads: ${p}`, false, String(resp && resp.status()));
    (await page.$$eval("a[href], img[src], link[href], script[src]", (els) => els.map((e) => e.getAttribute("href") || e.getAttribute("src"))))
      .filter((h) => h && h.startsWith("/")).forEach((h) => links.add(h.split("#")[0].split("?")[0]));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (overflow) check(`no sideways scroll: ${p}`, false);
    const h1 = await page.$$eval("h1", (h) => h.length);
    if (h1 !== 1) check(`exactly one h1: ${p}`, false, String(h1));
    await page.addScriptTag({ content: AXE });
    const v = await page.evaluate(async () => {
      const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
      return r.violations.map((x) => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, help: x.help }));
    });
    if (v.length) axeAll[p] = v;
  }
  results.axe = axeAll;
  check("all pages pass axe-core WCAG 2.2 A/AA rules", Object.keys(axeAll).length === 0, JSON.stringify(axeAll).slice(0, 400));
  check("no JavaScript errors on any page", pageErrors === 0, `${pageErrors} errors`);
  check("no requests to third-party servers", external.size === 0, [...external].join(", "));

  const serverAssets = [], broken = [];
  for (const l of links) {
    const r = await fetch(BASE + l);
    if (r.status !== 200) (/^\/(files|images)\/|^\/favicon\.ico$/.test(l) ? serverAssets : broken).push(`${l} ${r.status}`);
  }
  results.links.checked = links.size;
  results.links.carried_from_live_server = serverAssets;
  check("no broken internal links or assets", broken.length === 0, `${links.size} checked; broken: ${broken.join(", ")}`);
  results.notes.push(`Files expected from the live server (not in this repo): ${serverAssets.map((s) => s.split(" ")[0]).join(", ")}`);
  await ctx.close();
}

async function consent(browser) {
  // Build with a GA4 ID set: banner must appear, and nothing loads before Accept.
  async function visit() {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const ga = [];
    await page.route(/googletagmanager\.com|google-analytics\.com/, (r) => { ga.push(r.request().url()); r.abort(); });
    await page.goto(ABASE + "/");
    return { ctx, page, ga };
  }
  let { ctx, page, ga } = await visit();
  check("[consent] banner shown when analytics is configured", await page.locator("#consent").isVisible());
  check("[consent] no analytics request before a choice", ga.length === 0);
  await page.screenshot({ path: path.join(SHOTS, "consent-banner.png") });
  await page.click('[data-consent="reject"]');
  await sleep(300);
  check("[consent] Reject hides the banner and loads nothing", !(await page.locator("#consent").isVisible()) && ga.length === 0);
  const c = (await ctx.cookies()).find((x) => x.name === "av_consent");
  check("[consent] choice remembered (denied)", c && c.value === "denied");
  await page.reload();
  check("[consent] no banner and no analytics after reload", !(await page.locator("#consent").isVisible()) && ga.length === 0);
  await ctx.close();
  ({ ctx, page, ga } = await visit());
  await page.click('[data-consent="accept"]');
  await sleep(500);
  check("[consent] Accept loads analytics", ga.length > 0);
  await ctx.close();
  // Default build: no banner at all
  const d = await browser.newContext();
  const dp = await d.newPage();
  await dp.goto(BASE + "/");
  check("[consent] default build has no banner and no consent script", (await dp.locator("#consent").count()) === 0 && !(await dp.content()).includes("consent.js"));
  await d.close();
}

async function performance(browser) {
  for (const [p, label] of [["/", "home"], ["/request-staff/", "request-staff"], ["/sectors/care-homes/", "care-homes"]]) {
    const ctx = await browser.newContext(devices["Moto G4"] || devices["Pixel 5"]);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    let bytes = 0, requests = 0;
    cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength; requests++; });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: "layout-shift", buffered: true });
    });
    const t0 = Date.now();
    await page.goto(BASE + p, { waitUntil: "load" });
    const load = Date.now() - t0;
    await sleep(1500);
    const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: Number(window.__cls.toFixed(3)) }));
    results.performance[label] = { kb_transferred: Math.round(bytes / 1024), requests, load_ms: load, lcp_ms: m.lcp, cls: m.cls, profile: "mobile, 4x CPU slowdown, 1.6 Mbps, 150 ms latency" };
    check(`[performance] ${label}: LCP under 2.5s on slow mobile`, m.lcp > 0 && m.lcp < 2500, `LCP ${m.lcp}ms, CLS ${m.cls}, ${Math.round(bytes / 1024)} KB, ${requests} requests`);
    check(`[performance] ${label}: layout shift under 0.1`, m.cls < 0.1);
    await ctx.close();
  }
}

async function screenshots(browser) {
  const d = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await d.newPage();
  for (const [u, n] of [["/", "home-desktop"], ["/request-staff/", "request-staff-desktop"], ["/hire-staff/temporary-staffing/", "service-page-desktop"], ["/candidates/", "candidates-desktop"]]) {
    await p.goto(BASE + u, { waitUntil: "networkidle" });
    await p.screenshot({ path: path.join(SHOTS, n + ".png"), fullPage: true });
  }
  await p.goto(PBASE + "/", { waitUntil: "networkidle" });
  await p.screenshot({ path: path.join(SHOTS, "staging-preview-review-mode.png"), fullPage: false });
  await d.close();
  const m = await browser.newContext({ ...devices["iPhone 13"] });
  const mp = await m.newPage();
  await mp.goto(BASE + "/", { waitUntil: "networkidle" });
  await mp.screenshot({ path: path.join(SHOTS, "home-mobile.png"), fullPage: false });
  await m.close();
}

(async () => {
  const browser = await chromium.launch();
  try {
    await employerFlow(browser, "desktop", { viewport: { width: 1440, height: 900 } });
    await employerFlow(browser, "mobile", devices["iPhone 13"]);
    await candidateAndGeneral(browser);
    await keyboard(browser);
    await crawl(browser);
    await consent(browser);
    await performance(browser);
    await screenshots(browser);
  } catch (e) {
    check("test run completed without crashing", false, String(e.stack || e).slice(0, 500));
  }
  await browser.close();
  results.summary = { passed: results.checks.filter((c) => c.ok).length, failed: failures };
  fs.writeFileSync(path.join(OUT, "test-results.json"), JSON.stringify(results, null, 2));
  console.log(`\n${results.summary.passed} passed, ${failures} failed`);
  process.exit(failures ? 1 : 0);
})();
