#!/usr/bin/env python3
"""Writes docs/04-claims-register.md and the SEO table in docs/06 from the source files.
Run: python3 tools/report.py"""
import glob, json, os, re, sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)
from build import parse_meta, read  # noqa

claims = json.loads(read(os.path.join(ROOT, "src", "claims.json")))["claims"]
usage = {k: [] for k in claims}
pages = []
for f in sorted(glob.glob(os.path.join(ROOT, "src", "pages", "**", "*.html"), recursive=True)):
    meta, body = parse_meta(read(f), f)
    pages.append(meta)
    for ids in re.findall(r'data-claim(?:-any)?="([^"]+)"', body):
        for c in ids.split():
            if meta["path"] not in usage[c]:
                usage[c].append(meta["path"])
    if meta.get("requires"):
        usage[meta["requires"]].append(meta["path"] + " (whole page)")
for f in glob.glob(os.path.join(ROOT, "src", "partials", "*.html")):
    for ids in re.findall(r'data-claim(?:-any)?="([^"]+)"', read(f)):
        for c in ids.split():
            tag = "every page (" + os.path.basename(f) + ")"
            if tag not in usage[c]:
                usage[c].append(tag)

lines = ["# Claims register", "", "Generated from `src/claims.json` by `python3 tools/report.py`. Do not edit by hand.", "",
         "Approve a claim by setting `\"approved\": true` and writing the evidence in `\"evidence\"`. Unapproved claims are removed from the production build automatically. **Blocking** items stop the production build.", "",
         "| ID | Claim | Evidence needed | Owner | Blocking | Approved | Where it appears |", "|---|---|---|---|---|---|---|"]
for k, v in claims.items():
    where = ", ".join(usage[k]) or "build gate only"
    lines.append(f"| `{k}` | {v['label']} | {v['evidence_needed']} | {v['owner']} | {'**Yes**' if v.get('blocking') else 'No'} | {'Yes' if v.get('approved') else 'No'} | {where} |")
open(os.path.join(ROOT, "docs", "04-claims-register.md"), "w").write("\n".join(lines) + "\n")

seo = ["| URL | Title | Meta description | Index | Needs claim |", "|---|---|---|---|---|"]
for m in sorted(pages, key=lambda m: m["path"]):
    idx = "No" if "noindex" in m.get("robots", "") or m["path"] == "/404/" else "Yes"
    t = m['title'].replace('|', '\\|')
    seo.append(f"| `{m['path']}` | {t} ({len(m['title'])}) | {m['description']} ({len(m['description'])}) | {idx} | {m.get('requires', '')} |")
open(os.path.join(ROOT, "docs", "seo-metadata-table.md"), "w").write("\n".join(seo) + "\n")
print("wrote docs/04-claims-register.md and docs/seo-metadata-table.md")
