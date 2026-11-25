# UK compliance and approvals checklist

**Business:** Aviteus Healthcare Ltd, employment agency and employment business supplying care and nursing staff.
**Audience:** care providers (business buyers) and care workers (individuals, including people new to the UK).
**Area:** office in England. **The director confirmed UK-wide coverage on 25 November 2026** (England, Scotland, Wales and Northern Ireland). The `coverage` claim is approved on that basis; a list of active sites by nation is still recommended.
**Data collected on the site:** contact details, postcode, role, care experience, a yes/no/not-sure answer on right to work, free-text notes, optional marketing consent. No special category data is requested.
**Checked:** all sources below were opened on **25 November 2026** unless marked otherwise.

> This is a structured review to help the business and its advisers. It is not legal advice. Items marked **Approval** need the business owner or a qualified adviser to sign them off. **The site must not be described as fully compliant while any item below is open.**

## Status key
- **Done:** handled in the build and tested.
- **Approval:** drafted, needs sign-off or business facts.
- **Open:** a question only the business can answer.

## 1. Data protection and privacy

| # | Requirement | Official source | How the site handles it | Status |
|---|---|---|---|---|
| 1.1 | Tell people what you collect, why, the lawful basis, who receives it, how long you keep it, and their rights (UK GDPR transparency) | ICO guidance on the right to be informed (ico.org.uk). Not re-opened this session | `/privacy-policy/` written around the three real forms, the handler and its 90-day deletion. Processors, retention periods, transfers and log retention are marked `[TBC]`, and the production build fails until they are filled | **Approval** (blocker `privacy-review`) |
| 1.2 | Name the correct legal entity | Companies House, company 13337393 | Uses "Aviteus Healthcare Ltd". The live site wrongly says "LLC" | **Done** |
| 1.3 | Data protection fee / ICO registration | ICO register entry ZB303299: https://ico.org.uk/ESDWebPages/Entry/ZB303299 | Shown in the footer and on the compliance page. **Expires 20 February 2027:** renew | **Done**, renewal due |
| 1.4 | Data protection complaints: controllers must have a way to receive complaints and acknowledge them | ICO, "New data protection complaints law now in force" (19 June 2026): https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/06/new-data-protection-complaints-law-now-in-force/ | Complaints section in the privacy notice: complain to us first, 30-day acknowledgement, then the ICO. Contact form has a "Data protection request" topic | **Approval:** the internal procedure must exist |
| 1.5 | Collect only what you need | UK GDPR data minimisation (ICO) | Employer form has 6 required fields. Candidate form 7. No date of birth, no nationality, no documents. Notes fields warn against health data and residents' details | **Done** |
| 1.6 | Use the right lawful basis for enquiries | ICO lawful basis guidance | No forced "consent" tick for enquiries (legitimate interests / pre-contract steps). Consent is used only for optional marketing | **Done** |
| 1.7 | Security of personal data | UK GDPR Article 32 (ICO security guidance) | HTTPS-only nginx config, strict security headers and CSP, leads stored outside the web root, secrets in a root-only env file, IPs not stored, no personal data in logs | **Approval:** server hardening, backups and access control are the host's responsibility |
| 1.8 | Right to work question must not discriminate | Home Office, Right to work checks: an employer's guide (1 Oct 2026): https://www.gov.uk/government/publications/right-to-work-checks-employers-guide | The question is asked of everyone, with "not sure" as an option and a note that checks apply to all | **Done** |

## 2. Cookies, tracking and marketing (PECR)

| # | Requirement | Official source | How the site handles it | Status |
|---|---|---|---|---|
| 2.1 | Consent before storing or reading information on a device, unless an exception applies | ICO, Guidance on the use of storage and access technologies, "What are the exceptions?" (updated April 2026 for the Data (Use and Access) Act): https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/ | **Default build sets no cookies and uses no browser storage** (tested: 0 cookies, 0 storage). Fonts are self-hosted, so no third-party requests | **Done** |
| 2.2 | If analytics is switched on: no analytics before consent, rejecting as easy as accepting | Same ICO guidance | Setting a GA4 ID adds a banner with equal Accept and Reject buttons. Nothing loads before a choice. Tested: Reject loads nothing, Accept loads analytics. The ICO "statistical purposes" exception was **not** relied on | **Done** (off by default) |
| 2.3 | Marketing emails and texts to individuals need consent (or a soft opt-in) | ICO, Electronic mail marketing: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/electronic-and-telephone-marketing/electronic-mail-marketing/ | Separate, optional, unticked boxes. Exact wording and time stored with the lead. Confirmation emails contain no marketing | **Approval:** whatever tool sends marketing must offer unsubscribe and honour opt-outs |
| 2.4 | Business contacts: sole traders count as individuals | ICO, Business-to-business marketing: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/business-to-business-marketing/ | The employer opt-in covers this | **Done** |

## 3. Employment agency rules (England, Wales and Scotland)

| # | Requirement | Official source | How the site handles it | Status |
|---|---|---|---|---|
| 3.1 | Adverts must give the agency's full name and say if a role is temporary or permanent | Conduct of Employment Agencies and Employment Businesses Regulations 2003, reg 27: https://www.legislation.gov.uk/uksi/2003/3319/regulation/27 | Each role page shows "Employer: Aviteus Healthcare Ltd" and "Type of work: Temporary agency work". No live job adverts are published | **Done**. Any future job feed must carry both |
| 3.2 | No fees to work-seekers for finding work | Employment Agencies Act 1973, s.6: https://www.legislation.gov.uk/ukpga/1973/35/section/6 | No-fee notice on home, candidate, registration, thank-you and guide pages | **Done** |
| 3.3 | Terms agreed with clients before supplying staff | GOV.UK, Overview of the Conduct Regulations 2003: https://www.gov.uk/government/publications/conduct-regulations-2003-guidance-for-employment-agencies-and-employment-businesses/overview-of-the-conduct-regulations-2003 | Copy says a short written agreement comes first | **Open:** confirm client terms exist and match the copy (rates, cancellation, transfer fees) |
| 3.4 | Key information document for agency workers | GOV.UK, Providing a "Key information document" for agency workers (7 April 2026), via https://www.gov.uk/government/organisations/employment-agency-standards-inspectorate | Candidate FAQ says workers receive terms and a key information document | **Open:** confirm this happens at onboarding |
| 3.5 | Enforcement body | Fair Work Agency, launched 7 April 2026: https://www.business.gov.uk/campaign/employment-changes/employers/fair-work-agency/ | For awareness. It replaced the Employment Agency Standards Inspectorate | Information |

## 4. Health and social care sector rules by nation

| # | Requirement | Official source | How the site handles it | Status |
|---|---|---|---|---|
| 4.1 | **Scotland:** a service that supplies registered nurses is a "nurse agency" care service and must be registered with the Care Inspectorate | Public Services Reform (Scotland) Act 2010, sch. 12 para 4: https://www.legislation.gov.uk/asp/2010/8/schedule/12 ; Care Inspectorate registration: https://www.careinspectorate.com/index.php/register-a-care-service | **No Care Inspectorate entry for Aviteus was found by web search.** Any Scotland coverage claim and the nurse FAQ answer stay off the site until `scotland-reg` is approved | **Open: material.** Does Aviteus supply nurses in Scotland? If yes, is it registered? |
| 4.2 | **Scotland:** PVG scheme membership required for regulated roles since 1 April 2025 | Disclosure Scotland: https://www.disclosure.gov.scot/news/2024/12/pvg-scheme-legal-requirement ; https://www.mygov.scot/pvg-scheme | Compliance and guide pages say "Enhanced DBS, or PVG in Scotland" | **Done** (copy). Process: **Open** |
| 4.3 | **Wales:** social care workers must register with Social Care Wales within six months; agencies are responsible for their workers registering | Social Care Wales, Information for recruitment agencies: https://socialcare.wales/registration/employers-and-heis-responsibilities/information-for-recruitment-agencies | Mentioned on compliance, support worker and guide pages | **Open:** does Aviteus place workers in Wales, and does it have SCW signatories? |
| 4.3a | **Northern Ireland:** an agency supplying nurses is a nursing agency and must be registered with RQIA | Nursing Agencies Regulations (Northern Ireland) 2005: https://www.legislation.gov.uk/nisr/2005/175 ; RQIA registration: https://www.rqia.org.uk/guidance/registration-guidance/ | Nurse supply in Northern Ireland is only claimed if `ni-reg` is approved. The nurse FAQ tells visitors that registration is required | **Open: material.** Do you supply nurses in Northern Ireland? Are you registered with RQIA? |
| 4.3b | **Northern Ireland:** social care workers must be registered with the Northern Ireland Social Care Council | NISCC: https://niscc.info/registration-matters/ | Mentioned on compliance, support worker and guide pages | **Open:** process for NISCC registration of agency workers |
| 4.3c | **Northern Ireland:** criminal record checks go through AccessNI | nidirect: https://www.nidirect.gov.uk/information-and-services/accessni-criminal-record-checks/apply-accessni-check | Compliance and guide pages say "Enhanced AccessNI check" in Northern Ireland | **Done** (copy). Process: **Open** |
| 4.3d | **Northern Ireland:** agency conduct rules and the fee ban come from Northern Ireland law, not the GB Act | Conduct of Employment Agencies and Employment Businesses Regulations (Northern Ireland) 2005: https://www.legislation.gov.uk/nisr/2005/395/contents/made | No-fee notices say "UK law". The registration guide cites both the GB and NI sources | **Approval:** have an adviser confirm NI agency terms for workers and clients |
| 4.4 | **England and Wales:** DBS check level must match legal eligibility | DBS eligibility guidance: https://www.gov.uk/government/collections/dbs-eligibility-guidance | Copy says "Enhanced DBS with the adults' barred list" for regulated activity only | **Done** (copy) |
| 4.5 | Right to work checks follow the Home Office guide | Employer's guide, 1 October 2026 (link in 1.8) | Guide article reflects share codes and eVisas, and that expired British passports are acceptable | **Done** (copy) |
| 4.6 | Agencies are not CQC-registered for supplying staff alone | Not checked live this session | Site makes no CQC registration claim | **Open:** confirm Aviteus provides no regulated care itself. Its SIC codes include 87300 (residential care) and 86210 (general medical practice) |

## 5. Advertising claims, reviews and pricing

| # | Requirement | Official source | How the site handles it | Status |
|---|---|---|---|---|
| 5.1 | Hold evidence before publishing objective claims | CAP Code rule 3.7: https://www.asa.org.uk/type/non_broadcast/code_section/03.html | **Claims register** (`src/claims.json`, 37 entries). Production removes any unapproved claim automatically. With zero approvals, 34 claims are removed or replaced | **Approval:** per claim. See `04-claims-register.md` |
| 5.2 | No fake or misleading reviews; take steps to prevent them; do not publish reviews misleadingly | CMA208 Fake reviews guidance (DMCC Act 2024, in force April 2025): https://www.gov.uk/government/publications/fake-reviews | Six testimonials from the old site are gated. Each needs the original on file and consent. Light grammar edits are flagged for the author's sign-off. No ratings shown | **Approval** per testimonial. A short published reviews policy is recommended before collecting Google reviews |
| 5.3 | Out-of-date certificates must not be presented as current | CAP Code 3.1 / 3.7 (link above) | Cyber Essentials (due 4 March 2026) and APSCo (2024) are hidden until current certificates are supplied | **Approval** (`cyber`, `apsco`) |
| 5.4 | Prices and pay | CAP Code section 3 | No prices or pay rates published. Pages explain what affects cost. Pay is "shown before you accept" | **Done** |
| 5.5 | Carbon reduction plan kept current for public tenders | PPN 006 (applies from 24 February 2025, update at least yearly): https://www.gov.uk/government/publications/ppn-006-taking-account-of-carbon-reduction-plans-in-the-procurement-of-major-government-contracts/ppn-006-taking-account-of-carbon-reduction-plans-html | Site shows the plan as "signed January 2025" | **Open:** the plan cites PPN 06/21 and covers 2024. Update it for 2025 data |

## 6. Business disclosures

| # | Requirement | Official source | How the site handles it | Status |
|---|---|---|---|---|
| 6.1 | Registered name, number, place of registration and registered office on the website | Company, LLP and Business (Names and Trading Disclosures) Regulations 2015, Part 6: https://www.legislation.gov.uk/uksi/2015/17/part/6 ; GOV.UK: https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material | Footer on every page, plus the compliance page. Registered office (Alpha House, 296 Kenton Road, Kenton, HA3 8DD) is shown separately from the Suite 5 trading address | **Done** |
| 6.2 | Name, geographic address, email, register and number, **VAT number if VAT-registered**, supervisory authority if authorised | Electronic Commerce (EC Directive) Regulations 2002, reg 6: https://www.legislation.gov.uk/uksi/2002/2013/regulation/6 | All shown except VAT. Set `business.vat_number` in `src/config.json` and the footer shows it | **Open: blocker** (`vat-status`) |

## 7. Accessibility

| # | Requirement | Official source | How the site handles it | Status |
|---|---|---|---|---|
| 7.1 | Reasonable adjustments for disabled people (all UK service providers) | GOV.UK, Understanding accessibility requirements: https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps (Equality Act 2010) | Built and tested to WCAG 2.2 AA: axe-core on all 30 production pages (0 violations; the 404 page was not crawled), keyboard tests, AA contrast, error summaries. Accessibility statement published | **Done**. Testing with disabled users: **not done** |
| 7.2 | Old PDFs | Same | Known issue listed on the accessibility statement, with an offer of other formats | **Approval:** replace PDFs with accessible versions over time |

## 8. Questions for the business owner (these affect publication)

1. Does Aviteus supply **nurses in Scotland**? If yes, is it registered with the Care Inspectorate as a nurse agency?
2. Does Aviteus supply **nurses in Northern Ireland**? If yes, is it registered with RQIA?
3. Is the company **VAT registered**? If yes, what is the number?
4. Which providers host the site, send email and hold candidate and client records? Where is the data stored? (Needed for the privacy notice.)
5. How long should unconverted enquiries and registrations be kept?
6. ~~Is the phone line answered 24/7?~~ Confirmed by the director on 25 November 2026 (`h24` approved).
7. Which certificates are current: Cyber Essentials, APSCo, framework awards?
8. Is **permanent recruitment** actively offered? (This decides one page and the related menu items.)
