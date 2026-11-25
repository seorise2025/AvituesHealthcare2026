# Claims register

Generated from `src/claims.json` by `python3 tools/report.py`. Do not edit by hand.

Approve a claim by setting `"approved": true` and writing the evidence in `"evidence"`. Unapproved claims are removed from the production build automatically. **Blocking** items stop the production build.

| ID | Claim | Evidence needed | Owner | Blocking | Approved | Where it appears |
|---|---|---|---|---|---|---|
| `privacy-review` | Privacy notice reviewed and approved (processors, retention periods, lawful bases, international transfers) | Sign-off from the business owner or a data protection adviser on /privacy-policy/ | Director / data protection lead | **Yes** | No | build gate only |
| `lead-routing` | Live form delivery tested on the production server | Test enquiry from each form reached the right inbox and CRM, visitor confirmation email received | Developer | **Yes** | No | build gate only |
| `vat-status` | VAT registration status confirmed (number shown in footer if registered) | VAT certificate, or confirmation the company is not VAT registered | Director | **Yes** | No | build gate only |
| `h24` | Phone line answered by a person 24 hours a day, 7 days a week, including bank holidays | Out-of-hours rota and call logs for the last 3 months | Operations | No | Yes | /contact-us/, /hire-staff/emergency-cover/, /, /request-staff/, every page (header.html) |
| `coverage` | Supplies care staff across the UK: England, Scotland, Wales and Northern Ireland | Owner confirmation, plus a list of active client sites by nation (recommended) | Operations | No | Yes | /about-us/, /hire-staff/, /, every page (footer.html) |
| `scotland-reg` | If nurses are supplied in Scotland: registered with the Care Inspectorate as a nurse agency | Care Inspectorate registration certificate, or confirmation that no nurses are supplied in Scotland | Compliance | No | No | /compliance/, /hire-staff/nursing-staff/ |
| `ni-reg` | If nurses are supplied in Northern Ireland: registered with RQIA as a nursing agency | RQIA registration certificate, or confirmation that no nurses are supplied in Northern Ireland | Compliance | No | No | /compliance/, /hire-staff/nursing-staff/ |
| `frameworks` | Current approved supplier on HealthTrust Europe and NHS Wales frameworks | Award letters showing framework name, lot numbers and expiry dates | Compliance | No | Yes | /compliance/, /hire-staff/, /, /sectors/nhs/ |
| `nhs-supply` | Currently supplies staff to NHS trusts or health boards | Active NHS booking or framework call-off in the last 6 months | Operations | No | No | /, /sectors/nhs/ (whole page), every page (header.html) |
| `apsco` | Current APSCo membership | Current year certificate (the one online is for 2024) | Director | No | No | /compliance/, / |
| `cyber` | Current Cyber Essentials certificate | Renewed certificate. The 2025 certificate online was due for renewal on 4 March 2026 | Director | No | Yes | /compliance/, /, /sectors/nhs/ |
| `sponsor` | Holds a current Skilled Worker sponsor licence | Entry on the Home Office register of licensed sponsors | Compliance | No | No | /candidates/register/ |
| `clients` | Permission to name client organisations | Written permission from each client named | Director | No | Yes | / |
| `t-sanctuary` | Testimonial: Jonathon James, Sanctuary Housing Association | Original testimonial on file, consent to publish, sign-off on light grammar edits | Director | No | Yes | / |
| `t-turningpoint` | Testimonial: Charles Musendo, Turning Point | Original testimonial on file, consent to publish, sign-off on light grammar edits | Director | No | Yes | /, /sectors/care-homes/ |
| `t-mencap` | Testimonial: Steven Moocarme, Royal Mencap | Original testimonial on file, consent to publish, sign-off on light grammar edits | Director | No | Yes | /, /sectors/supported-living/ |
| `t-ernest` | Testimonial: Ernest Kyei, healthcare assistant | Consent to publish name and words, sign-off on edits | Recruitment | No | Yes | /candidates/, / |
| `t-peter` | Testimonial: Peter Adeyanju, worker | Consent to publish name and words, sign-off on edits | Recruitment | No | Yes | /candidates/ |
| `vetting` | Vetting steps as described: interview, right to work, enhanced DBS or PVG, two references, mandatory training, occupational health, NMC check | Written compliance procedure and a sample audited worker file | Compliance | No | No | /candidates/register/, /compliance/, /hire-staff/nursing-staff/, /, /jobs/registered-nurse/ |
| `training-list` | Mandatory training topics listed (safeguarding, moving and handling, BLS, infection control, medication awareness, dementia awareness, food hygiene) | Training matrix | Training | No | No | /sectors/care-homes/ |
| `profiles` | A worker profile is sent to the client before each booking | Sample profile and the booking procedure | Operations | No | No | /hire-staff/, /hire-staff/temporary-staffing/ |
| `compliance-files` | Clients can request a worker's compliance file and receive it | Procedure for sharing files (with the worker's data protection notice covering it) | Compliance | No | No | /compliance/ |
| `confirmation` | Written confirmation of worker name and start time is sent for every booking | Sample booking confirmation | Operations | No | No | /hire-staff/, / |
| `account-manager` | Each client has a named account manager | Client account list with named managers | Operations | No | No | /hire-staff/ |
| `replacement` | Replacement policy: an unsuitable worker is not sent back and a replacement is sought | Written policy in client terms of business | Director | No | No | /hire-staff/ |
| `temp-to-perm` | Clients can take on temporary workers permanently under agreed terms | Transfer fee terms in client terms of business | Director | No | No | /hire-staff/ |
| `perm-process` | Permanent recruitment process: brief, search, screen, shortlist, offer support | Confirmation the service is offered now, and the fee basis in terms of business | Director | No | No | /hire-staff/, /hire-staff/permanent-recruitment/ (whole page), /, every page (header.html), every page (form-employer.html), every page (footer.html) |
| `nurse-skills` | Clinical skills available on request (PEG, catheter care, wound care, diabetes care, end of life care) | Training and competency records for nurses on the books | Compliance | No | No | /hire-staff/nursing-staff/ |
| `ld-skills` | Support workers trained in positive behaviour support, epilepsy awareness and autism awareness | Training matrix | Training | No | No | /jobs/support-worker/, /sectors/supported-living/ |
| `mh-skills` | Mental health staff trained in de-escalation and enhanced observations | Training matrix and the name of the restraint or de-escalation course | Training | No | No | /sectors/mental-health/ |
| `pay-weekly` | Workers are paid weekly | Payroll calendar | Payroll | No | Yes | /candidates/, /, /jobs/healthcare-assistant/, /jobs/registered-nurse/, /jobs/support-worker/ |
| `training-free` | Mandatory training and Basic Life Support are free to workers | Training policy, including any conditions or clawback terms | Training | No | Yes | /candidates/, /, /jobs/healthcare-assistant/, /jobs/registered-nurse/, /jobs/support-worker/ |
| `uniform` | Workers receive a uniform free of charge | Uniform policy | Operations | No | Yes | /candidates/, /hire-staff/emergency-cover/, /jobs/healthcare-assistant/ |
| `referral` | Refer-a-friend bonus | Scheme rules: amount, qualifying hours, payment timing | Recruitment | No | Yes | /candidates/, /jobs/healthcare-assistant/ |
| `dbs-help` | Agency helps workers through the DBS or PVG application | Confirmation of process and who pays the fee | Compliance | No | Yes | /candidates/ |
| `experience-min` | Minimum experience requirements per role | Recruitment criteria | Recruitment | No | No | /candidates/, /jobs/healthcare-assistant/ |
| `team` | Named team members on the About page | Names, roles and consent from each person | Director | No | No | /about-us/ |
| `office-hours` | Office opening hours: Monday to Friday, 9am to 5:30pm | Confirm hours | Operations | No | No | /contact-us/ |
