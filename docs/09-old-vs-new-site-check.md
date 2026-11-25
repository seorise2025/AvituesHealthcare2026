# Old site vs new site: services and facts check

Checked on 25 November 2026. The live site (aviteushealthcare.co.uk) was read with Firecrawl: the home page, services, clients, candidates, about us and contact pages, plus the Cyber Essentials certificate PDF. It was compared with the new site's live copy (`lovable-app/src/pages`) and with the full source (`src/pages`), which also holds the claims kept back until there is proof.

## Summary

- **The core service matches.** It covers agency nurses (RGN, RMN, RNLD), healthcare assistants, support workers, senior carers and team leaders for care homes, nursing homes, mental health and learning disability services and supported living. Single shifts, block bookings, long-term cover and the 24/7 line are all there.
- **Contact and company details match exactly.**
- **The old site offers a lot more** than the new one shows. That falls into three groups:
  1. **Written into the new site but kept back until proven:** frameworks, client names, testimonials, permanent and international recruitment, weekly pay, uniforms, training, referrals, DBS help, Cyber Essentials and NHS supply.
  2. **Left off the new site entirely:** doctors and locums, therapists (AHPs), specialist hospital nurses, social workers, revalidation, domiciliary care, accommodation help, and some performance numbers.
  3. **Problems on the old site itself:** an expired Cyber Essentials certificate is still linked, and some copy looks like it came from another company's website.
- **The client must decide** on the groups above. The questions to ask are at the end of this document.

## 1. Matches

| Item | Old site | New site |
|---|---|---|
| Phone | 0203 4888 172 | 020 3488 8172 (same number, standard UK spacing) |
| Email | info@aviteushealthcare.co.uk | Same |
| Office | Suite 5, 3rd Floor, Alpha House, 296 Kenton Road, Harrow, HA3 8DD | Same |
| Company number | 13337393 | Same |
| ICO number | ZB303299 | Same |
| WhatsApp | 07418 347802 | Same (for care workers) |
| Facebook, Instagram, LinkedIn | Linked | Same links |
| Timesheet, carbon reduction plan, modern slavery statement (PDFs) | Linked | Linked (copy the files across before launch) |
| Nurses: RGN, RMN, RNLD | Yes | Yes, on the agency nurses page |
| Healthcare assistants, support workers, senior carers, team leaders | Yes | Yes |
| Care homes, nursing homes, mental health, learning disability, supported living | Yes | Yes, with a page for each sector |
| Rehabilitation settings | Yes | Yes, on the mental health page |
| Single shifts, block bookings, long-term assignments | Yes | Yes |
| 24/7 emergency line | Yes | Yes. Approved by the director on 25 November 2026. |
| "We do not charge fees for sponsorship" warning | Yes | Yes, stronger: the FAQ explains that UK law bans agencies charging workers for finding them work |
| Deputy and home managers named as contacts | Recruited (permanent) | Named as the people who ring us; permanent recruitment held back (see 2) |

## 2. On the old site, written into the new site, but kept back until there is proof

These are already written. Each one goes live once the client confirms it and sends the evidence named below. The details are in `docs/04-claims-register.md`.

| Old site says | Claim id | Evidence needed |
|---|---|---|
| Framework approved with HealthTrust Europe and NHS Wales | `frameworks` | Current framework award letters or listing, with dates and lots |
| NHS supply, hospitals, trusts | `nhs-supply` | A current NHS contract or framework call-off |
| Client logos: Accord, Bupa, Four Seasons, HC-One, Lifeways, Mencap, Sanctuary, Turning Point and others | `clients` | Written permission from each client to use their name or logo |
| Testimonials from 5 workers and 3 clients | `t-*` | Written consent from each named person, and confirmation that each one is genuine and unpaid (DMCC Act 2024 rules on fake reviews) |
| Permanent recruitment | `perm-process` | Confirm it is still offered, the fee terms, and who runs it |
| International recruitment and visa sponsorship | `sponsor` | A current Home Office sponsor licence number |
| Weekly pay | `pay-weekly` | Confirm the pay cycle |
| Uniforms supplied | `uniform` | Confirm it is still true and free |
| Free training, Basic Life Support courses | `training-free` | Confirm which courses are free and who delivers them |
| Referral scheme | `referral` | The scheme terms (amount, qualifying period) |
| DBS application help | `dbs-help` | Confirm who pays the DBS fee |
| Cyber Essentials | `cyber` | **A new certificate.** The one on the old site expired. See section 4. |

## 3. On the old site, not on the new site at all

These were left out because they do not match what the business report and the rest of the site describe: a nursing and care agency for care providers. If any of them are real, current services, they need new pages.

| Old site says | Where | Recommendation |
|---|---|---|
| Locum doctors in 10 specialties (A&E, surgery, radiology, GPs, dentistry and others) | Candidates | Leave out unless Aviteus actually places doctors today. Supplying locum doctors is a very different business. |
| Revalidation, and "designated body status" with a named Responsible Officer (Dr Ian Grant) and Healthcare Licensing Support Ltd | Candidates | **Check urgently.** Designated body status is listed by the GMC and can be checked. If it is not current, this text must come off the old site now. |
| AHPs and health science staff (speech therapy, OT, physio, psychology, radiography, pharmacy and others) | Candidates | Leave out unless it is a current service. |
| Specialist and senior hospital nurses (theatres, PICU, NICU, A&E, matrons, hospital directors) | Candidates | Leave out unless the client confirms hospital supply (ties to `nhs-supply`). |
| Social workers | Candidates | Leave out unless it is a current service. |
| Community nurses | Candidates | Can be added to the agency nurses page if the client confirms. |
| Domiciliary care | Services | Needs confirming. Home care has its own rules and inspection, so add it only if it is a real service. |
| Clinical leads, activities coordinators (permanent) | Services | Add to the permanent recruitment section if `perm-process` is approved. |
| Help finding accommodation | Candidates | Leave out unless it is real and current. |
| Expansion into the UAE, Australia and the British Isles; recruiting from India, the Philippines, Nigeria, Zimbabwe and the EU | Candidates, Services | Leave out unless it is real and current. Overseas recruitment claims attract close checking. |
| "Most enquiries answered within 1 hour", "fill rate over 90%", "replacement at no extra charge" | Services | Leave out unless there are records to back each figure. These are exactly the claims the CAP Code says must be proven. |
| "Online portal" or "online profile" for compliance documents | Services, Clients | Leave out unless the system exists and clients or workers can log in. |
| Serology reports, medical questionnaire, indemnity insurance in the compliance list | Clients | These are doctor and hospital requirements. The new site lists the checks for care work instead. |
| "Become an Aviteus Recruiter" | About | Can be added as a short careers note if they are hiring. |

## 4. Problems found on the old site

These affect the business now, whatever happens with the new site.

1. **The Cyber Essentials certificate has expired.** The PDF linked in the old footer shows certification on 4 March 2025, with **recertification due 4 March 2026**. Unless it has been renewed, the old site is showing a lapsed certificate. Renew it, or remove the link.
2. **Copy from another business.** The old site says "Aviteus Global" in two places, and the doctor, revalidation and international text reads like a template from a larger locum agency. This is the main reason it was not carried over.
3. **Coverage is inconsistent.** The old site says "England, Scotland, and Wales" on the home page and "England and Wales" on the candidates page. The new site says the whole UK, as the director confirmed. Northern Ireland nurse supply needs RQIA registration, and Scotland needs Care Inspectorate registration (see the launch checklist).
4. **Every page has the same browser title**, "Candidates | Aviteus Healthcare", and the share text is set to Ukrainian (`uk_ua`). The new site fixes both.
5. **Testimonials and client logos are shown without visible consent.** If any are not backed by written permission, they are a risk on the old site today.

## 5. Fixes made to the new site during this check

| Fix | Why |
|---|---|
| Hire staff page description no longer mentions permanent recruitment | That section is held back, so the description promised something the page did not show |
| Removed "Doctors, therapists or other professions we don't supply" (urgent cover page) | The old site says the opposite. The new site should not state either until the client decides. |
| Removed "Midwives, health visitors or doctors" from "Not something we do" (agency nurses page) | Same reason |

## 6. Client answers (25 November 2026) and what changed

| Question | Answer | Result on the new site |
|---|---|---|
| Doctors, therapists or social workers? | No | Kept off. "Not something we do" lines now say so plainly on the urgent cover and agency nurses pages. |
| Designated body status for revalidation? | Yes | **Kept off, and needs a second look.** A designated body is for doctors connected to the organisation. That doesn't fit with "no doctors". Ask the client to explain before this goes anywhere. |
| HealthTrust Europe and NHS Wales frameworks? | Yes | Approved. Shown on the home, hire staff and compliance pages. Award letters to be kept on file. |
| Permanent and international recruitment, sponsor licence? | No | Kept off. The visa FAQs now say plainly that Aviteus holds no sponsor licence. |
| Cyber Essentials renewed? | Yes | Approved. The link now points to `/files/cyber-essentials-certificate.pdf`. Upload the renewed certificate there. |
| Clients and workers agreed in writing? | All previous ones | Approved. All 12 client names from the old site's logos are listed, plus 5 testimonials (3 clients, 2 workers). The old site's "community" logo is left out because its full name is unclear. |
| Weekly pay, uniforms, training, referrals, DBS help? | Yes | Approved. Shown on the job pages and the find work page. |
| Domiciliary care? | No | Kept off. |

**The old site is now wrong in several places.** It still offers permanent recruitment, international recruitment, visa sponsorship support, domiciliary care and locum doctors, and it links the expired 2025 Cyber Essentials certificate. Correct it, or replace it with the new site soon.

## 7. Questions still open

1. How does designated body status fit with placing no doctors?
2. Do you currently supply NHS trusts or health boards (needed for the NHS and hospitals page)?
3. What is the "community" client logo on the old site?

## 8. Original questions for the client

1. Do you place **doctors, therapists (AHPs) or social workers** today? If yes, which roles and where?
2. Is the **designated body status** for doctors' revalidation current? Who is the Responsible Officer now?
3. Are you **currently on the HealthTrust Europe and NHS Wales frameworks**? Please send the award letters.
4. Do you still offer **permanent and international recruitment**? Do you hold a **sponsor licence**?
5. Has **Cyber Essentials** been renewed since 4 March 2026?
6. Which **clients and workers** have agreed in writing to be named on the site?
7. Is **weekly pay, free uniforms, free training, the referral scheme and DBS help** all still true?
8. Do you provide **domiciliary (home) care** staff?
