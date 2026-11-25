# Sitemap, SEO and lead routing

## 1. Sitemap

Status: **Live** = built and in the production build today. **Gated** = built, but only published once its claim is approved. **Utility** = noindex.

```
/                                         Home                                   Live
├── /hire-staff/                          Services overview                      Live
│   ├── /hire-staff/emergency-cover/      Urgent and same-day cover              Live
│   ├── /hire-staff/temporary-staffing/   Temporary staffing                     Live
│   ├── /hire-staff/nursing-staff/        Agency nurses                          Live
│   └── /hire-staff/permanent-recruitment/ Permanent recruitment                 Gated: perm-process
├── /sectors/care-homes/                  Care and nursing homes                 Live
├── /sectors/supported-living/            Supported living                       Live
├── /sectors/mental-health/               Mental health                          Live
├── /sectors/nhs/                         NHS                                    Gated: nhs-supply
├── /request-staff/                       PRIMARY CONVERSION (employer form)     Live
├── /compliance/                          Compliance and company details         Live
├── /candidates/                          Candidate hub                          Live
│   ├── /candidates/register/             Candidate form                         Live
│   └── /candidates/timesheet/            Timesheets                             Utility
├── /jobs/                                Roles we recruit                       Live
│   ├── /jobs/healthcare-assistant/                                              Live
│   ├── /jobs/support-worker/                                                    Live
│   └── /jobs/registered-nurse/                                                  Live
├── /about-us/                            About                                  Live
├── /contact-us/                          Contact + general form                 Live
├── /resources/                           Guides                                 Live
│   ├── /resources/checks-before-booking-agency-staff/                           Live
│   ├── /resources/plan-for-staff-shortages/                                     Live
│   └── /resources/agency-registration-documents/                                Live
├── /privacy-policy/                      Privacy notice                         Live (blocker until approved)
├── /cookie-policy/                       Cookie notice                          Live
├── /accessibility/                       Accessibility statement                Live
├── /thank-you/employer/  /thank-you/candidate/  /thank-you/message/             Utility
├── /enquiry-problem/                     No-JavaScript error page               Utility
└── /404.html                             Custom 404                             Utility
```

**Not built, on purpose:**
- **Case studies and reviews pages.** No approved evidence exists yet.
- **Location pages.** The only verified location is the Harrow office. Build a town page only when the CRM shows regular work there and there is something useful and local to say.

## 2. Menus

- **Header:** Hire Staff (services and sectors dropdown), Find Work (dropdown), Compliance, About, Guides, Contact. Buttons: **Request Staff** (primary) and Find Work.
- **Mobile:** full-screen menu, plus a sticky bottom bar with Request Staff and Find Work on every page.
- **Top bar:** phone number on every page.
- **Footer:** all key links, company disclosures, privacy, cookies, accessibility.

## 3. SEO setup

| Item | How it is done |
|---|---|
| Titles and descriptions | Unique per page. Full table: [`seo-metadata-table.md`](seo-metadata-table.md), generated from the source by `tools/report.py` |
| URLs | Lower case, hyphens, trailing slash. Old URLs 301 to new ones (`deploy/nginx.conf`) |
| Headings | One H1 per page (tested on every page) |
| Canonical | Every page points to `https://aviteushealthcare.co.uk` + its path |
| Robots | Production: `index,follow`, except thank-you, problem, timesheet and 404 pages (`noindex`). **Staging preview and QA builds: every page `noindex,nofollow`, and robots.txt blocks everything** |
| Sitemap | `sitemap.xml` generated at build. Lists only indexable pages that were actually published |
| Structured data | `EmploymentAgency` with verified facts only (name, address, phone, email, founding date). Opening hours and area served are added **only** if the `h24` and `coverage` claims are approved. `FAQPage` is built from the FAQ text left on the published page. `BreadcrumbList` on inner pages |
| Internal links | Home to every service and sector; every service to request form, compliance and guides; guides to service pages; jobs to registration |
| Speed | 116 to 130 KB per page, no third-party requests, self-hosted fonts. LCP about 0.8 to 0.9 s on throttled mobile (see `test-results.json`) |
| Language | `lang="en-GB"`, `og:locale` `en_GB` (the old site had `uk_ua`) |

## 4. Lead routing

```
Visitor submits form
   │  (browser checks fields, shows an error summary if needed)
   ▼
POST /api/enquiry  ── nginx (rate limit 6/min/IP) ──►  server/lead_handler.py
   │
   ├─ origin, size, type checks ──────── fail → 403/413/415
   ├─ rate limit (5 per IP per 15 min) ─ fail → 429, visitor sees phone + email
   ├─ honeypot / filled in under 3 s ─── silently dropped, visitor sees thank-you
   ├─ optional Cloudflare Turnstile ──── (only if TURNSTILE_SECRET is set)
   ├─ server-side validation ────────── fail → 400 + field errors shown in the form
   │
   ├─ 1. SAVE to SQLite (outside web root) ── fail → 503, visitor sees phone + email
   ├─ 2. Visitor gets the thank-you page with a reference (AV-YYYYMMDD-XXXXX)
   │
   └─ 3. In the background:
        ├─ email the right inbox      employer → LEAD_TO_EMPLOYER  (subject starts "URGENT" for today/tomorrow)
        │                             candidate → LEAD_TO_CANDIDATE
        │                             general  → LEAD_TO_GENERAL
        ├─ POST JSON to CRM_WEBHOOK_URL (Bearer token)
        └─ only once the business has it: confirmation email to the visitor
           (reference, next steps, phone; no marketing; no copy of their notes)
```

**If delivery fails:** the lead is already saved, so it is never lost. Its status is `pending` (nothing delivered) or `partial` (email or CRM failed). A systemd timer (`deploy/aviteus-leads-maintenance.timer`) retries every 10 minutes and never sends the same email twice. Errors go to the system log (`journalctl -u aviteus-leads`) with the reference only, not personal details.

**Data kept:** form fields, page, referrer, UTM tags, marketing opt-in with the exact wording and time. IP addresses are **not** saved with the lead. Leads are deleted from the handler database after `LEAD_RETENTION_DAYS` (90 by default, to match the privacy notice).

**Credentials:** all in `/etc/aviteus/lead-handler.env` on the server (template: `server/lead-handler.env.example`). Nothing secret is in the repository or the website code.

**Urgent leads:** the email subject starts with "URGENT". Set up a mailbox rule, or a CRM rule, to push these to the on-call phone. That last step depends on Aviteus's phone and CRM setup and is **not built**.

## 5. Setup steps for the developer

1. Copy the repo to `/opt/aviteus`. Create user `aviteus` and folder `/var/lib/aviteus`.
2. Create `/etc/aviteus/lead-handler.env` from the template. Fill in SMTP, inbox and CRM details. `chmod 600`.
3. `python3 server/lead_handler.py --check-config` must say "Configuration looks complete."
4. Install `deploy/aviteus-leads.service` and the maintenance timer. Enable both.
5. Build: `python3 build.py --mode production`. Upload `dist/production/` to `/var/www/aviteus/current/`. Keep the old `/files/` and `/images/` folders.
6. Install `deploy/nginx.conf`, run `nginx -t` and reload.
7. Send a real test through each form. Check the inbox, the CRM and the confirmation email. Then approve the `lead-routing` claim.
