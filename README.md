# Aviteus Healthcare website

A complete lead-generation website for [aviteushealthcare.co.uk](https://aviteushealthcare.co.uk): 33 pages, three working lead forms with a tested back end, a claims register that keeps unproven statements off the live site, and UK compliance and launch checklists.

**Status: built and tested, not yet approved for publication.** See [`docs/08-launch-checklist.md`](docs/08-launch-checklist.md).

## Hand-over documents

| Document | What it covers |
|---|---|
| [`docs/05-competitor-audit.md`](docs/05-competitor-audit.md) | 7 competitors reviewed live, with URLs, and the decisions they drove |
| [`docs/06-sitemap-seo-lead-routing.md`](docs/06-sitemap-seo-lead-routing.md) | Sitemap, menus, SEO set-up, lead routing and failure handling, server set-up |
| [`docs/seo-metadata-table.md`](docs/seo-metadata-table.md) | Every page's title and meta description (generated) |
| [`docs/07-compliance-checklist.md`](docs/07-compliance-checklist.md) | UK requirements with official sources, how each is handled, what needs sign-off |
| [`docs/04-claims-register.md`](docs/04-claims-register.md) | Every claim that needs evidence, its owner and where it appears (generated) |
| [`docs/08-launch-checklist.md`](docs/08-launch-checklist.md) | What passed, what is untested, what blocks publication |
| [`docs/test-results.json`](docs/test-results.json) | Latest browser test output |
| [`docs/02-design-system.md`](docs/02-design-system.md) | Logo, colours, type, components, accessibility |
| [`docs/01-strategy-and-sitemap.md`](docs/01-strategy-and-sitemap.md) | Earlier audit of the live site (history; the sitemap is superseded by doc 06) |

## Look at it now

The staging preview is committed in `dist/preview/`. It shows every claim with a dashed review box.

```bash
cd dist/preview && python3 -m http.server 8000
```

Then open http://localhost:8000. Forms need the handler running (below) to send.

## Build

```bash
python3 build.py
```
Staging preview with review notes, written to `dist/preview/`. Always noindex.

```bash
python3 build.py --mode production
```
The public site, written to `dist/production/`. Refuses to build while any blocking claim is unapproved. Removes every unapproved claim. Fails on placeholders, broken links, empty lists or inline scripts.

```bash
python3 build.py --mode production --qa
```
Production rules with blockers ignored, for testing only. Written to `dist/qa/`, always noindex.

## Run the forms locally

```bash
STATIC_DIR=dist/qa LEAD_DB_PATH=/tmp/leads.db ALLOWED_ORIGINS=http://127.0.0.1:8081 python3 server/lead_handler.py
```

Open http://127.0.0.1:8081. Leads are saved to the database. Add SMTP and inbox settings to send email (see `server/lead-handler.env.example`).

## Test

```bash
python3 -m unittest discover -s tests -v
```

```bash
cd tests && npm install && cd .. && python3 tests/run_e2e.py
```

## Approve a claim

Edit `src/claims.json`: set `"approved": true` and describe the evidence in `"evidence"`. Rebuild. Then refresh the register:

```bash
python3 tools/report.py
```

## Structure

```
src/pages/        one file per page, meta block at the top
src/partials/     header, footer, head, forms, cookie text
src/claims.json   claims register (approvals)
src/config.json   verified business details, analytics switch
static/           CSS, JS, self-hosted fonts, robots.txt
server/           lead handler (Python standard library) + env template
deploy/           nginx config, systemd service and timer
tests/            handler tests, browser tests, test SMTP and webhook
tools/report.py   generates the claims register and SEO table
```

## Fix the live site today

The current site's menu links return 404 because nginx does not look for the `.html` files. Add `try_files $uri $uri.html $uri/ =404;` to its `location /` block. See the top of `deploy/nginx.conf`.
