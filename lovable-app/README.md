# Aviteus Healthcare website (Lovable-ready)

A working React website: 30 pages plus a not-found page, 3 live lead forms, and a server function that stores and emails every enquiry.

Built with the same stack Lovable uses: **Vite, React 18, TypeScript and React Router**. The look comes from one stylesheet, `src/styles/site.css`, which keeps the existing logo colours and fonts.

## What is in here

| Path | What it is |
|---|---|
| `src/pages/*.tsx` | One file per page. Plain JSX. Edit the words directly. |
| `src/components/Header.tsx` | Top bar, menu, dropdowns and the mobile menu |
| `src/components/Footer.tsx` | Footer and the phone action bar |
| `src/components/LeadForm.tsx` | Checks a form, runs the spam traps and sends it |
| `src/lib/submitLead.ts` | Picks the form backend (see below) |
| `src/components/Seo.tsx` | Title, description, canonical link and schema for each page |
| `supabase/migrations/` | The `leads` table (locked down: the public key cannot read it) |
| `supabase/functions/submit-lead/` | Server function: checks, stores, emails. Has its own tests. |
| `public/` | Fonts, robots.txt, sitemap.xml. Add the logo and PDFs here (see "Before launch"). |

## Run it on a computer

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:8080

## How the forms send

Set **one** of these in `.env` (copy `.env.example`):

1. **Lovable Cloud (recommended in Lovable).** When you switch on Cloud, Lovable fills in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The forms then call the `submit-lead` function.
2. **Your own server.** Set `VITE_LEAD_ENDPOINT` to the Python lead handler in `../server` (for example `https://aviteushealthcare.co.uk/api/enquiry`).

If neither is set, the form shows "Your form did not send" with the phone number and email address. It never pretends to succeed.

### Lovable Cloud set-up (one time)

1. Switch on Cloud in the Lovable project.
2. Run the migration in `supabase/migrations/` (Lovable applies it from the repo, or paste it into the SQL editor).
3. Deploy the `submit-lead` function.
4. Add these secrets:

| Secret | Example |
|---|---|
| `RESEND_API_KEY` | from resend.com, after you verify the aviteushealthcare.co.uk domain |
| `MAIL_FROM` | `website@aviteushealthcare.co.uk` |
| `LEAD_TO_EMPLOYER` | the bookings inbox |
| `LEAD_TO_CANDIDATE` | the recruitment inbox |
| `LEAD_TO_GENERAL` | `info@aviteushealthcare.co.uk` |
| `ALLOWED_ORIGINS` | `https://aviteushealthcare.co.uk,https://www.aviteushealthcare.co.uk` plus the Lovable preview address while testing |
| `IP_SALT` | any long random string |

5. Schedule `select public.purge_old_leads();` to run daily. This deletes leads after 90 days, which matches the privacy notice.

Every lead is saved **before** any email is sent, so a mail outage never loses an enquiry. Failed emails are marked on the row (`email_ok = false`).

## Moving this into Lovable through GitHub

Lovable cannot import an existing repository. Its GitHub sync only works one way: Lovable creates a new repository, then syncs whatever lands in it.

1. In Lovable, create a new blank project.
2. Connect it to GitHub. Lovable creates a new repository.
3. Replace the contents of that repository with the contents of this `lovable-app` folder (this folder becomes the root), then push to its main branch.
4. Lovable picks up the push and rebuilds.

Step 3 can be done for you: share the new repository name and confirm it is fine to push to its main branch.

## Tests

From the repository root:

```bash
python3 tests/run_app_e2e.py
```

This builds the app and runs the real lead handler with a fake mail server. It checks every page in Chromium (desktop and 390px phone), every internal link, accessibility (axe, WCAG 2.2 AA), the menus, and all three forms end to end. Last run: **47 passed, 0 failed** (`docs/app-test-results.json`).

```bash
npx deno@2.1.4 test --node-modules-dir=none --allow-env --allow-net supabase/functions/submit-lead/
```

This tests the server function against a fake database and fake email service. It covers storing, routing, urgent flags, field errors, spam traps, origin blocking and rate limits. Last run: **7 passed, 0 failed**.

## Before launch

These must be done before the domain points here:

- [ ] Put the real logo at `public/images/logo.png`. Until then, the text name shows.
- [ ] Copy the three PDFs from the current server into `public/files/` with the same names: the modern slavery statement, the carbon reduction plan, and the timesheet.
- [ ] Add the **renewed** Cyber Essentials certificate as `public/files/cyber-essentials-certificate.pdf` (not the expired 2025 one).
- [ ] Add `public/favicon.ico`.
- [ ] Set up the form backend (above). Send one test enquiry per form and confirm each one arrives.
- [ ] Fill in the `[TBC]` items in `src/pages/PrivacyNotice.tsx`.
- [ ] Add the VAT number to the footer, or confirm the company is not VAT registered.
- [ ] Confirm nurse agency registration for Scotland (Care Inspectorate) and Northern Ireland (RQIA) before advertising nurses there.
- [ ] Set up 301 redirects from the old `.html` addresses (list in `../docs/06-sitemap-seo-lead-routing.md`).

## Claims held back

Frameworks, client names, testimonials, Cyber Essentials and the candidate benefits were approved by the director on 25 November 2026 and are now on the site. Still held back: the vetting table, NHS supply, APSCo and a few others. The full list and the wording for each is in `../docs/04-claims-register.md`. Send proof and they go back in.

## SEO note

This is a single-page app. Google renders JavaScript, and each page sets its own title, description, canonical link and schema. Other crawlers and link previews may only see the homepage tags. If that matters later, add pre-rendering at the hosting layer.
