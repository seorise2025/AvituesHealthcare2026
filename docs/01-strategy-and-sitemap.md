# Aviteus Healthcare: Website Strategy, Audit and Sitemap

**Prepared:** 25 November 2026
**Site:** aviteushealthcare.co.uk
**Goal:** Turn the website into a lead engine for two audiences: care providers who book staff, and care workers who want shifts.

Confidence tags used throughout:
- **[Certain]** seen directly on the live site, in a document or on a public register.
- **[Likely]** strong inference from good evidence.
- **[Guessing]** filling a gap. Needs checking.

---

## 1. The hard truths first

1. **The live site is broken today, and it is a 10-minute fix.** [Certain]
   Every menu link (`/about-us`, `/contact-us`, `/candidates`, `/clients`, `/services`) returns an nginx 404. The pages are not gone. They load at `/about-us.html`, `/contact-us.html` and so on. The site is a Next.js static export, and nginx is not told to try the `.html` file. One line fixes it: `try_files $uri $uri.html $uri/ =404;` (see `nginx.conf.example`).
   **Do this before anything else.** Every day it stays broken, every employer who clicks "Contact" or "Book Now" hits a dead end.

2. **The report got this wrong.** It said "5 of 6 URLs return 404" and treated the pages as missing. They exist. That changes the plan: we redirect old URLs to new ones, we do not "restore" anything.

3. **The report pointed you at the wrong region.** It named Hampshire and Dorset as key markets and benchmarked Herd Care (Hampshire) and Lopen. [Certain] Aviteus is based in Harrow, North West London (Companies House, footer, carbon plan). Its client logos are national care groups (Bupa, HC-One, Four Seasons, Mencap, Sanctuary). There is **no evidence** of Hampshire or Dorset work. Location pages should start where you actually have shifts. That is London first, then wherever your CRM shows repeat bookings.

4. **Half the claims on the current site cannot be published yet.** "100% GRI pass rate", "90%+ fill rate", "most enquiries answered within 1 hour", doctors and surgeons, UAE and Australia expansion. None of these have evidence on file. A care buyer or a framework auditor who checks one false claim stops trusting all of them. Every unproven claim in the new template carries a `data-verify` flag. Add `?review=1` to any page URL to see them all highlighted.

5. **The privacy policy names the wrong legal entity.** It says "Aviteus Healthcare LLC". The company is Aviteus Healthcare **Ltd**, no. 13337393 [Certain]. For a business that handles candidate passports, DBS and health data, that is a UK GDPR risk. Fix this week.

---

## 2. What Aviteus does, and where

| Item | Finding | Confidence |
|---|---|---|
| Legal name | Aviteus Healthcare Ltd | [Certain] Companies House |
| Company no. | 13337393, incorporated 15 April 2021, active | [Certain] |
| Office | Suite 5, 3rd Floor, Alpha House, 296 Kenton Road, Harrow HA3 8DD | [Certain] |
| Director / PSC | Vikas Kumar Pandey | [Certain] Companies House, carbon plan sign-off |
| ICO number | ZB303299 | [Certain] site footer |
| Phone | 020 3488 8172 (old site writes it as "0203 4888 172": wrong grouping) | [Certain] |
| WhatsApp | +44 7418 347802 | [Certain] |
| Business model | Temporary and permanent healthcare staffing agency | [Certain] |
| Core roles | RGN, RMN, RNLD nurses, HCAs, support workers, senior carers, team leaders. Permanent: home managers, deputies, clinical leads | [Certain] services.html |
| Core settings | Care and nursing homes, supported living, learning disability, mental health, NHS | [Certain] |
| Frameworks | HealthTrust Europe and NHS Wales logos shown | [Likely]. Need award letters |
| Memberships | APSCo member since 7 March 2024, cert no. 7070 | [Certain] for 2024. 2025/26 renewal unknown |
| Security | Cyber Essentials certificate 2025 | [Certain] PDF on site |
| Sustainability | PPN 06/21 carbon plan. 493 tCO2e (2022) down to 348 tCO2e (2024). Net zero 2045 | [Certain] |
| Sponsor licence | Skilled Worker, A-rated | [Likely] third-party register copy. Check the Home Office register |
| Clients shown | Accord, Bupa, Community, Four Seasons, HC-One, Lifeways, Making Space, Mencap, Minster, Neuven, Riverside, Sanctuary, Turning Point | [Certain] logos shown. Permission unknown |
| Systems | Candidate portal `register.aviteushealthcare.co.uk`, CRM `app.aviteushealthcare.co.uk` | [Certain] |
| Geography claimed | "England, Scotland and Wales" | [Guessing]. Ask operations where shifts actually happen |

**What the old site gets wrong about the business:**
- It sells **features** (uniforms, BLS courses, referral scheme) to **employers**. Employers buy reliability and compliance. Candidates care about uniforms.
- It mixes two eras of copy. `services.html` is newer and focused on care settings. `candidates.html` is older and lists doctors, surgeons, dentistry, radiology, AHPs and a "designated body" for doctor revalidation. These do not match the current business. [Likely]
- It mentions "Aviteus Global" twice. No such entity appears at Companies House under this site. Remove it.

---

## 3. Competitors: reconfirmed and corrected

### 3.1 The five from the report

| Competitor | Status | What I confirmed | Use it as |
|---|---|---|---|
| **Newcross Healthcare** | Confirmed [Certain] | National, app-led, strong role and guide content. Ranks for "healthcare assistant" (8,100/mo) and "jobs as a support worker" (4,400/mo) | Content and SEO benchmark. Do not copy their scale message |
| **Nurseplus** | Confirmed [Certain] | National branch network. Clear six-step onboarding | Candidate process benchmark |
| **OneCall24** | Confirmed [Certain] | Separate sector pages, e.g. learning disabilities. Two domains in use | Sector page benchmark |
| **Herd Care** | Confirmed, but **low relevance** [Certain] | "Hampshire-based care sector recruitment specialist". Booking form + job list | UX benchmark only. Not a direct rival |
| **Lopen Care Agency** | Confirmed [Certain] | UK-wide claim. Care homes, supported living, mental health, domiciliary | Messaging benchmark: "when to call us" scenarios |

### 3.2 Competitors the report missed (closer to Aviteus)

Found with Firecrawl search on London and framework terms.

| Competitor | Why it matters | Confidence |
|---|---|---|
| **Pure Healthcare Group** | London office. On HealthTrust Europe and NHS Workforce Alliance. 4.8 Google stars from 109 reviews. £250 referral after 100 hours. Same framework fight as Aviteus | [Certain] homepage |
| **Kome Care Staffing** | "Nursing Agency London & South East". RN and RMN focus. Short-notice cover. Same local market | [Certain] |
| **Novello Healthcare** | Care homes and supported living. Sells an app that plugs into rostering | [Certain] |
| **RHC360** | Supplies NHS trusts through NHS Workforce Alliance and HealthTrust Europe | [Likely] search snippet |
| **ESGO** | London 020 number, 24/7 response team, care staffing | [Likely] search snippet |

### 3.3 What this means for positioning

- [Likely] Aviteus cannot win on size (Newcross) or tech (Novello). It can win on **reliability you can check**: a person who answers at 3am, staff matched to the setting, and compliance files on demand.
- [Certain] Pure Healthcare shows 4.8 stars from 109 Google reviews. Aviteus shows none. **Reviews are the cheapest trust gap to close.** Start asking every client and worker for a Google review now.
- [Certain] Search intent splits two ways. Candidate terms have big volume (healthcare assistant jobs 9,900/mo, support worker jobs near me 5,400/mo). Employer terms are small but worth far more per lead (healthcare staffing agency 880/mo). Build both. Measure them separately.

**The positioning line:** *Safe, compliant care staff. When you need them.*

---

## 4. Firecrawl crawl: every existing URL

| Old URL | Status | Content quality | Decision | New URL | Why |
|---|---|---|---|---|---|
| `/` | 200 | Weak. Title says "Candidates". Mixed audiences | **KEEP and rewrite** | `/` | Home holds most authority. Rebuilt employer-first with a clear candidate route |
| `/about-us` | 404 | Exists at `.html`. Generic copy | **KEEP and rewrite** | `/about-us/` | Buyers check "about" before booking. Add real team, real story |
| `/contact-us` | 404 | Exists at `.html`. Phone, email, empty form | **KEEP and rebuild** | `/contact-us/` | Split into three routes: book staff, find work, general |
| `/candidates` | 404 | Exists at `.html`. Long, outdated (doctors, AHPs, dentistry, UAE) | **KEEP URL, rewrite** | `/candidates/` | Keep the URL (shared on social). Cut to the roles you actually fill |
| `/clients` | 404 | Exists at `.html`. Thin. "Aviteus Global" | **MERGE** | `/hire-staff/` (301) | Same purpose as services. One strong hub beats two weak pages |
| `/services` | 404 | Exists at `.html`. Best copy on the site | **MERGE and expand** | `/hire-staff/` + sub-pages (301) | Its content becomes the hub plus four service pages |
| `/privacy-policy` | 200 at `.html` | Template text. Wrong entity (LLC) | **KEEP, rewrite** | `/privacy-policy/` | Legal need. Must cover candidate data, DBS, right to work, health data |
| `/files/*.pdf` (5 files) | 200 | Useful proof | **KEEP exact paths** | same | Indexed in Google. Linked from new compliance page |
| `/sitemap.xml` | 404 | Missing | **ADD** | generated by `build.py` | Google needs it |
| `/robots.txt` | 404 | Missing | **ADD** | `site/robots.txt` | Points to sitemap. Blocks timesheet page |
| `register.` subdomain | 200 | Worker login | **KEEP, link** | external | Linked from candidates and register pages |

### 4.1 Content to delete, and why

| Delete | Reason |
|---|---|
| Doctors, surgeons, GPs, dentistry, radiology lists | [Likely] not current business. Newer services page does not mention them. If you do supply locum doctors, keep them as a separate page later |
| AHP/HSS list (OT, SALT, physio, pharmacy, mortuary...) | Same as above. Dilutes the care focus |
| "Designated body" and Dr Ian Grant revalidation section | Doctor-specific. Possibly out of date. A false medical governance claim is serious. Remove unless confirmed current |
| "Expansion into UAE, Australia and the British Isles" | No evidence. Contradicts UK focus. Confuses candidates and buyers |
| "Aviteus Global" | Unknown entity. Legal and trust risk |
| "100% pass rate on GRI compliance" | No audit evidence. Publish only with records and a date |
| Service tiles "Learn More: click above" | Dead copy. No link |
| "Become an Aviteus Recruiter" | Moved to a small card on About. Not worth a main page yet |
| "GET TIMESHEET" in main menu | Worker utility. Moved to top bar, candidate menu and footer |

---

## 5. New sitemap

Status key: **Built** = in this repo as working HTML. **Copy** = full copy in `docs/03-copy-deck.md`, ready to build from a template. **Phase 2** = build once data exists.

```
/                                   Home                               Built
├── /hire-staff/                    Employer hub                       Built
│   ├── /hire-staff/emergency-cover/        24/7 urgent cover          Built
│   ├── /hire-staff/temporary-staffing/     Shifts and block bookings  Copy
│   ├── /hire-staff/permanent-recruitment/  Permanent hires            Copy
│   └── /hire-staff/nursing-staff/          Agency nurses              Copy
├── /sectors/
│   ├── /sectors/care-homes/                Care and nursing homes     Built (sector template)
│   ├── /sectors/supported-living/          LD and autism              Copy
│   ├── /sectors/mental-health/             Mental health              Copy
│   └── /sectors/nhs/                       NHS and frameworks         Copy
├── /request-staff/                 Employer form (main conversion)    Built
├── /compliance/                    Vetting + certificates             Built
├── /candidates/                    Candidate hub                      Built
│   ├── /candidates/register/       Candidate form + documents         Built
│   └── /candidates/timesheet/      Timesheet (noindex)                Built
├── /jobs/                          Jobs hub                           Built (needs live feed)
│   ├── /jobs/healthcare-assistant/ HCA role page                      Built (role template)
│   ├── /jobs/support-worker/       Support worker role page           Copy
│   └── /jobs/registered-nurse/     Agency nurse role page             Copy
├── /about-us/                      About                              Built
├── /contact-us/                    Contact                            Built
├── /resources/                     Guides hub                         Copy (8 article briefs)
├── /privacy-policy/                Privacy                            Rewrite needed (legal)
├── /cookie-policy/                 Cookies                            Phase 2
├── /accessibility/                 Accessibility statement            Phase 2
└── /404.html                       Helpful 404                        Built

Phase 2 (only with proof):
/locations/london/                  Only if CRM shows regular London shifts
/locations/[town]/                  Only where you have 5+ regular clients or live jobs
/candidates/international-applicants/   Only after sponsor licence and current rules are confirmed
```

### 5.1 Why each new page exists

| Page | Keyword target (UK volume, SD) | Job it does |
|---|---|---|
| `/` | healthcare staffing agency (880, 24), healthcare recruitment agency (320, 50) | Route both audiences in 5 seconds |
| `/hire-staff/` | healthcare staffing solutions (70, 25) | Show every option. Push to request form |
| `/hire-staff/emergency-cover/` | emergency care staff, same day agency staff | Capture the most urgent, highest-value buyer. Phone first |
| `/hire-staff/temporary-staffing/` | temporary healthcare staffing (30, 16) | Block bookings = recurring revenue |
| `/hire-staff/permanent-recruitment/` | permanent healthcare recruitment | Higher fee per placement |
| `/hire-staff/nursing-staff/` | nursing agency (1,600, 54), agency nurses (1,300, 39) | Mixed intent. Serves buyers, links to nurse jobs |
| `/sectors/care-homes/` | care home staffing agency (0 recorded, SD 4) | Low volume, very high intent. Easy to rank. Do not skip because the tool says 0 |
| `/sectors/supported-living/` | supported living staffing | Mencap, Lifeways, Turning Point type clients |
| `/sectors/mental-health/` | mental health staffing, RMN agency | RMN gaps are hard to fill. High rates |
| `/sectors/nhs/` | NHS framework agency | Explains framework booking. Proof for procurement |
| `/request-staff/` | none | The money page. Every employer CTA lands here |
| `/compliance/` | agency staff vetting | Buyers and CQC. Also a strong page for AI answers |
| `/candidates/` | healthcare agency jobs | Candidate hub |
| `/jobs/healthcare-assistant/` | healthcare assistant jobs (9,900, 21), HCA agency jobs (70, 36) | Biggest candidate opportunity |
| `/jobs/support-worker/` | support worker jobs (4,400, 19), near me (5,400, 20) | Second biggest |
| `/jobs/registered-nurse/` | agency nurse jobs (1,600, 30) | Nurses are the hardest role to fill |
| `/candidates/register/` | how to register with a healthcare agency | Candidate conversion page |
| `/resources/` | informational | Earns links, answers AI search, feeds both funnels |

**De-target:** "healthcare assistant jobs with visa sponsorship" (590/mo). [Likely] Most HCA roles do not meet current Skilled Worker salary and skill rules. Ranking for it attracts applicants you cannot help, and some fall for scam "agents" using your name. Answer it honestly in an FAQ. Do not build a page that promises it.

---

## 6. Redirect map (301)

| From | To |
|---|---|
| `/about-us`, `/about-us.html` | `/about-us/` |
| `/contact-us`, `/contact-us.html` | `/contact-us/` |
| `/candidates`, `/candidates.html` | `/candidates/` |
| `/clients`, `/clients.html` | `/hire-staff/` |
| `/services`, `/services.html` | `/hire-staff/` |
| `/privacy-policy`, `/privacy-policy.html` | `/privacy-policy/` |
| `/index.html` | `/` |
| `http://` and `www.` | `https://aviteushealthcare.co.uk/` |

Ubersuggest showed all six ranking keywords on an `http://` URL variant. [Certain] Force one https host.

All rules are ready in `nginx.conf.example`.

---

## 7. How the site turns visits into leads

### 7.1 Every page has one clear next step

| Visitor | Primary action | Backup action |
|---|---|---|
| Care provider | **Request Staff** (form) | Call 020 3488 8172 |
| Urgent care provider | **Call now** | Form |
| Care worker | **Register now** | See live jobs, WhatsApp |
| Existing worker | Portal login, timesheet | WhatsApp |

- Header: two buttons on every page. "Request Staff" (dark slate, primary) and "Find Work" (outline).
- Mobile: sticky bottom bar with the same two buttons. Thumb reach.
- Top bar: 24/7 phone line on every page.

### 7.2 Forms and CRM routing

Three forms, three lead types. Each sends a hidden `lead_type` field: `employer`, `candidate` or `general`.

| Form | Page | Required fields | Route to |
|---|---|---|---|
| Employer | `/request-staff/` | Urgency, name, organisation, setting, phone, email, postcode, consent | CRM employer pipeline + email/SMS alert to the on-call consultant |
| Candidate | `/candidates/register/` | Role, name, mobile, email, postcode, experience, right to work, consent | Candidate portal / ATS + recruitment team |
| General | `/contact-us/` | Name, email, message, consent | Shared inbox |

Every form also sends `page_url` and UTM tags (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`). This tells you which page and which campaign made each lead.

**To connect:** replace `data-endpoint="REPLACE_WITH_CRM_ENDPOINT"` in each form with your CRM webhook URL (`app.aviteushealthcare.co.uk` or a form service). Until then the forms run in template mode and show the success message without sending.

**Rule:** an urgent employer lead (urgency = "today or tomorrow") must ping a phone within 5 minutes, day or night. A 6am lead that waits until 9am is a lost booking.

### 7.3 What to measure

| KPI | Target to set after 90 days |
|---|---|
| Employer requests per month | Baseline first |
| Phone calls from site (call tracking number) | Baseline first |
| Employer lead to booked client rate | From CRM |
| Candidate registrations per month | Baseline first |
| Registration to compliant worker rate | From portal |
| Organic clicks to service and sector pages | Google Search Console |

Set up GA4 events: `lead_submit` (already fires in `main.js`), `click_to_call`, `whatsapp_click`, `portal_login_click`.

---

## 8. Search and AI-search basics built in

- One H1 per page. Title and meta description written for every built page.
- Clean URLs with trailing slash.
- `EmploymentAgency` schema with real address, phone and Companies House link on home, about and contact.
- `FAQPage` schema generated from each page's FAQ block.
- `BreadcrumbList` schema on inner pages.
- `lang="en-GB"`, `og:locale` fixed from `uk_ua` to `en_GB`.
- `sitemap.xml` and `robots.txt` generated.
- Short, direct answers in FAQs. These are what AI search tools quote.
- Job pages are ready for `JobPosting` schema once a live job feed is connected. Do not add it to fake or placeholder jobs. Google penalises that.

---

## 9. Launch plan

| Week | Task | Owner |
|---|---|---|
| **Now** | Add the one-line nginx fix to the live site | Developer |
| **Now** | Fix "LLC" in privacy policy | Management |
| 1 | Fill the verify register (`docs/04-verify-before-publishing.md`) | Aviteus team |
| 1 | Send logo files, team photos, client permissions | Aviteus team |
| 1 | Connect Google Search Console and GA4 | SEO lead |
| 2 | Build remaining pages from the copy deck | Developer |
| 2 | Connect forms to CRM, test both lead routes | Developer |
| 3 | Connect live job feed with expiry dates | Developer |
| 3 | Accessibility test (WCAG 2.2 AA), mobile test on real phones | QA |
| 3 | Go live with 301 redirects. Submit sitemap | SEO lead |
| 4+ | Publish 2 resource articles a month. Ask for Google reviews | Marketing |
| 8+ | Location pages, only where CRM data supports them | SEO lead |
