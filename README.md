# Aviteus Healthcare: Website Rebuild

New lead-generation website for [aviteushealthcare.co.uk](https://aviteushealthcare.co.uk).
Two audiences, two clear routes: **care providers who need staff** and **care workers who want shifts**.

## Start here

| Read | What it covers |
|---|---|
| [`docs/01-strategy-and-sitemap.md`](docs/01-strategy-and-sitemap.md) | Audit findings, competitors, every page kept, merged, deleted or added and why, sitemap, redirects, lead routing |
| [`docs/02-design-system.md`](docs/02-design-system.md) | Logo, colours, type, components, accessibility |
| [`docs/03-copy-deck.md`](docs/03-copy-deck.md) | Ready copy for the pages not yet built, plus 8 article briefs |
| [`docs/04-verify-before-publishing.md`](docs/04-verify-before-publishing.md) | Every claim that needs proof before launch |
| [`nginx.conf.example`](nginx.conf.example) | One-line fix for the live 404s, plus all 301 redirects |

## Urgent: fix the live site today

The current site's menu links all return 404. The pages exist at `.html` URLs, but nginx is not set up to find them. Add this line inside the `location /` block on the live server and reload nginx:

```
try_files $uri $uri.html $uri/ =404;
```

## Build and preview

No dependencies beyond Python 3.

```bash
python3 build.py
```

```bash
cd site && python3 -m http.server 8000
```

Open http://localhost:8000. Add `?review=1` to any URL to highlight every claim that still needs evidence.

## Structure

```
src/partials/   head, header, footer (shared on every page)
src/pages/      one file per page, with a meta block at the top
site/           built output: upload this folder to the server
site/assets/    styles.css (design system) and main.js (menu, forms, tracking)
build.py        joins partials + pages, adds icons and schema, writes sitemap.xml
```

## Before launch

1. Copy `logo.png`, `favicon.ico`, `/images/` and `/files/` from the live server into `site/`.
2. Replace `REPLACE_WITH_CRM_ENDPOINT` in the three forms with the CRM webhook.
3. Clear every item in the verify register.
4. Build the remaining pages from the copy deck.
5. Deploy with the redirects in `nginx.conf.example`. Submit `sitemap.xml` in Search Console.
