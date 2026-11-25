# Launch checklist

**Status on 25 November 2026: NOT READY TO PUBLISH.** The build is complete and tested. Three blockers and several approvals are open. The production build refuses to run until the blockers are approved, so it cannot be published by accident.

Run the tests yourself:

```bash
python3 -m unittest discover -s tests -v
```

```bash
python3 tests/run_e2e.py
```

Latest results: **15/15 handler tests passed. 62/62 browser checks passed.** Full output: [`test-results.json`](test-results.json).

## 1. Passed (tested in this session)

| Area | What was tested | Result |
|---|---|---|
| Employer path, desktop | Care homes page → header "Request Staff" → empty submit → bad email/postcode → valid submit → thank-you with reference | Pass |
| Employer path, mobile (iPhone 13) | Same, using the sticky bottom action bar | Pass |
| Delivery to destination | Lead emailed to the bookings inbox (URGENT subject, Reply-To = visitor). CRM webhook received JSON with Bearer token | Pass (test SMTP server and test webhook) |
| Visitor confirmation | Visitor receives a confirmation email with reference, phone and privacy link. No copy of their notes | Pass (test SMTP server) |
| Candidate and contact forms | Each reaches its own inbox, and the candidate gets a confirmation with the no-fee warning | Pass |
| Invalid inputs | Missing fields, bad email, postcode and phone, unknown options, text too long. Shown in the browser and enforced on the server | Pass |
| Submission failures | Network down and HTTP 503: fallback message with phone and email, button usable again | Pass |
| Email or CRM down | Lead kept, status pending/partial, no confirmation until the business has it, retry delivers without duplicates | Pass |
| Storage down | Visitor told it failed (JSON 503 or redirect to `/enquiry-problem/`) | Pass |
| Spam and abuse | Honeypot, too-fast submissions, wrong origin, wrong content type, oversize body, 5-per-IP rate limit, email header injection | Pass |
| No JavaScript | Form posts and redirects to the thank-you or problem page | Pass |
| Keyboard | Skip link, menus open with Enter and close with Escape, focus into the dropdown, mobile menu focus trap and return | Pass |
| Accessibility | axe-core WCAG 2.0/2.1/2.2 A and AA on all 30 crawled pages: **0 violations**. One H1 per page. No sideways scroll | Pass |
| Contrast | All text pairs at AA or better (`02-design-system.md`) | Pass |
| Links | 36 internal links and assets: 0 broken (excluding files carried over from the live server, below) | Pass |
| Privacy by default | 0 cookies, 0 browser storage, 0 third-party requests | Pass |
| Consent (if analytics is enabled) | Banner shown; nothing loads before a choice; Reject loads nothing and is remembered; Accept loads GA | Pass |
| Performance | Throttled mobile (4x CPU, 1.6 Mbps): LCP 0.8 to 0.9 s, CLS 0, 116 to 130 KB per page | Pass |
| Claims gate | Production with 0 approvals: 34 claims removed, 2 pages skipped, no placeholders, no broken links. All-approved build also valid | Pass |
| Staging kept out of search | Preview and QA builds: every page `noindex,nofollow`, robots.txt `Disallow: /` | Pass |
| Banned words and em dashes | Scan of all copy and docs | Pass |

## 2. Not tested (cannot be tested from here)

| Item | Why | Who / how |
|---|---|---|
| Real email delivery (SMTP provider, SPF, DKIM, DMARC, spam folders) | Tested only with a local test SMTP server | Developer: send real tests, check headers and junk folders |
| Real CRM | No CRM details supplied. Tested only with a test webhook | Developer: point `CRM_WEBHOOK_URL` at the CRM and map the JSON fields |
| Cloudflare Turnstile | Optional. Needs keys and network access | Only if spam becomes a problem |
| nginx config on the real server | No server access | Developer: `nginx -t`, then check redirects with `curl -I` |
| The real logo, favicon and `/files/` PDFs | Could not download them in this environment. Pages fall back to a text logo | Copy `/images/`, `/files/` and `favicon.ico` from the live server |
| Real phones and screen readers | Emulated only | Test on one iPhone and one Android phone, and with VoiceOver or NVDA |
| Testing with disabled users | Not done | Recommended |
| Lighthouse score | Not run. Equivalent measurements were taken instead | Optional |
| Google Search Console | No access | Verify the domain, submit `sitemap.xml` |
| Nurseplus competitor review | SSL error on their site | Re-check before launch |

## 3. Blocks publication

| # | Blocker | Owner | How to clear it |
|---|---|---|---|
| B1 | Privacy notice: processors, retention, transfers, log retention, approval date (`privacy-review`) | Director / adviser | Fill the `[TBC]` items in `src/pages/privacy-policy.html`, then approve |
| B2 | VAT status (`vat-status`) | Director | Add the number to `src/config.json` if registered, then approve |
| B3 | Live form delivery tested on the server (`lead-routing`) | Developer | Follow section 5 of `06-sitemap-seo-lead-routing.md` |
| B4 | **Scotland nurse agency question** (section 4.1 of the compliance checklist) | Director | Answer before publishing any Scotland wording. The site already hides it |
| B5 | Fix the live site's 404s now (`try_files` one-liner in `deploy/nginx.conf`) | Developer | Not a blocker for the new site, but the current site is losing enquiries today |

## 4. Approvals that add content back (optional for launch)

The site can launch without these. Each approval adds the matching content back. Full list: [`04-claims-register.md`](04-claims-register.md).

Highest value first:
1. `h24`: confirms the 24/7 line (top bar on every page, plus 4 pages)
2. `vetting`: restores the vetting table and check lists (12 places)
3. `frameworks`, `nhs-supply`: framework proof and the NHS page
4. Testimonials `t-*` and `clients`: the only social proof on the site
5. `pay-weekly`, `training-free`, `uniform`, `referral`: candidate benefits
6. `perm-process`: the permanent recruitment page

## 5. Go-live steps (once section 3 is clear)

1. `python3 build.py --mode production` (refuses if any blocker is open)
2. `python3 tests/run_e2e.py` (all checks must pass)
3. Upload `dist/production/`, keep `/files/` and `/images/`
4. Install the nginx config with redirects, reload
5. Submit one real enquiry per form and confirm delivery
6. Search Console: submit the sitemap, inspect the homepage
7. Watch `journalctl -u aviteus-leads` and the inbox for the first week
