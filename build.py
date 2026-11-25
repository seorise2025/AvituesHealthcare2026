#!/usr/bin/env python3
"""
Aviteus Healthcare static site builder.

Two outputs from one source:

  python3 build.py                      -> dist/preview/     staging preview
  python3 build.py --mode production    -> dist/production/  the public site
  python3 build.py --mode production --qa  -> dist/qa/       production rules,
                                             but builds even with open blockers
                                             (for testing only, always noindex)

PREVIEW: every claim is shown with a dashed review box and its review note.
         Every page is noindex, robots.txt blocks everything.

PRODUCTION: any element tagged with an unapproved claim is removed (or
         replaced by its fallback text). Review notes never reach the HTML.
         The build FAILS if: a blocking claim is unapproved, a placeholder
         remains, a review attribute survives, an internal link is broken,
         or a list/grid is left empty.

Claims live in src/claims.json. Approve a claim by setting "approved": true
and filling in "evidence". Nothing else needs to change.

Markup used inside pages:
  data-claim="id [id2]"      keep only if ALL listed claims are approved
  data-claim-any="id id2"    keep if ANY listed claim is approved
  data-fallback="text"       if removed, keep the tag and use this text instead
  {{icon:name}}              inline SVG icon
  {{year}}                   current year

Page meta block (top of every file in src/pages):
<!--meta
title: ...
description: ...
path: /url/
nav: hire | work | compliance | about | resources | contact
robots: index,follow | noindex,follow
schema: org,faq            (optional)
breadcrumb: Home=/ > Page  (optional)
requires: claim-id         (optional: page only built if the claim is approved)
-->
"""
import argparse
import html
import json
import os
import re
import shutil
import sys
from datetime import date
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
STATIC = os.path.join(ROOT, "static")

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
NAV_KEYS = ["hire", "work", "compliance", "about", "resources", "contact"]


# --------------------------------------------------------------------------- icons
def _svg(body, fill=False):
    if fill:
        return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + body + "</svg>"
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + "</svg>")


ICONS = {
    "clock": _svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    "shield": _svg('<path d="M12 3l8 3v6c0 4.5-3.4 8.4-8 9-4.6-.6-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'),
    "check": _svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    "users": _svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-6 6.5-6s5.9 2.4 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14c2.6.2 4.4 2.3 5 5"/>'),
    "phone": _svg('<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>'),
    "home": _svg('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
    "heart": _svg('<path d="M12 20s-7-4.4-9-9a4.8 4.8 0 0 1 9-3 4.8 4.8 0 0 1 9 3c-2 4.6-9 9-9 9z"/>'),
    "brain": _svg('<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4H9z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4h1z"/>'),
    "hospital": _svg('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6M9 10h6"/><path d="M9 21v-4h6v4"/>'),
    "calendar": _svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h3v3H8z"/>'),
    "badge": _svg('<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7.5 18c.7-2 2.4-3 4.5-3s3.8 1 4.5 3"/>'),
    "file": _svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
    "pound": _svg('<path d="M16 6.5A4 4 0 0 0 9 9v4.5c0 2.5-1 4.5-3 5.5h12"/><path d="M6 12h8"/>'),
    "cap": _svg('<path d="M2 9l10-5 10 5-10 5L2 9z"/><path d="M6 11v5c2 2 10 2 12 0v-5"/>'),
    "shirt": _svg('<path d="M8 3l-5 3 2 4 2-1v12h10V9l2 1 2-4-5-3a4 4 0 0 1-8 0z"/>'),
    "lock": _svg('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'),
    "leaf": _svg('<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l7-7"/>'),
    "alert": _svg('<path d="M12 3l10 18H2L12 3z"/><path d="M12 10v5M12 18h.01"/>'),
    "search": _svg('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
    "mail": _svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
    "pin": _svg('<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>'),
    "star": _svg('<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z"/>'),
    "gift": _svg('<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18"/><path d="M12 8c-2-4-6-4-6-1.5S9 8 12 8zM12 8c2-4 6-4 6-1.5S15 8 12 8z"/>'),
    "chat": _svg('<path d="M4 5h16v11H8l-4 4V5z"/><path d="M8 10h8M8 13h5"/>'),
    "bolt": _svg('<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>'),
    "list": _svg('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>'),
    "linkedin": _svg('<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>', fill=True),
    "facebook": _svg('<path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H17l.5-4h-4V9c0-.6.4-1 1-1z"/>', fill=True),
    "instagram": _svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'),
    "whatsapp": _svg('<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/>', fill=True),
}


# --------------------------------------------------------------------------- claim filter
class ClaimFilter(HTMLParser):
    """Streams HTML and applies claim rules without changing anything else."""

    ATTR_RE = re.compile(r'\s+data-(?:claim|claim-any|fallback)="[^"]*"')

    def __init__(self, mode, claims):
        super().__init__(convert_charrefs=False)
        self.mode, self.claims = mode, claims
        self.out = []
        self.skip = 0           # depth inside a removed element
        self.close_with = None  # end tag to write when a fallback element finishes
        self.used = set()

    def approved(self, cid):
        if cid not in self.claims:
            raise KeyError(f"Unknown claim id '{cid}'. Add it to src/claims.json")
        self.used.add(cid)
        return bool(self.claims[cid].get("approved"))

    def _decide(self, attrs):
        a = dict(attrs)
        all_ids = (a.get("data-claim") or "").split()
        any_ids = (a.get("data-claim-any") or "").split()
        if not all_ids and not any_ids:
            return None, a
        keep = all(self.approved(c) for c in all_ids)
        if any_ids:
            keep = keep and any(self.approved(c) for c in any_ids)
        return (keep, all_ids + any_ids), a

    def _open(self, tag, attrs, raw, void):
        if self.skip:
            if not void:
                self.skip += 1
            return
        decision, a = self._decide(attrs)
        if decision is None:
            self.out.append(raw)
            return
        keep, ids = decision
        clean = self.ATTR_RE.sub("", raw)
        if self.mode == "preview":
            notes = " | ".join(f"{c}: {self.claims[c]['label']}" for c in ids)
            status = "approved" if keep else "NOT APPROVED"
            note = html.escape(f"[{status}] {notes}", quote=True)
            self.out.append(clean[:-1].rstrip("/").rstrip() + f' data-review="{note}"' + (" />" if raw.endswith("/>") else ">"))
            return
        if keep:
            self.out.append(clean)
            return
        if "data-fallback" in a and not void:
            self.out.append(clean)
            self.out.append(html.escape(a["data-fallback"], quote=False))
            self.close_with = tag
            self.skip = 1
            return
        if not void:
            self.skip = 1

    def handle_starttag(self, tag, attrs):
        self._open(tag, attrs, self.get_starttag_text(), tag in VOID)

    def handle_startendtag(self, tag, attrs):
        self._open(tag, attrs, self.get_starttag_text(), True)

    def handle_endtag(self, tag):
        if self.skip:
            self.skip -= 1
            if self.skip == 0 and self.close_with:
                self.out.append(f"</{self.close_with}>")
                self.close_with = None
            return
        self.out.append(f"</{tag}>")

    def _text(self, s):
        if not self.skip:
            self.out.append(s)

    def handle_data(self, d): self._text(d)
    def handle_entityref(self, n): self._text(f"&{n};")
    def handle_charref(self, n): self._text(f"&#{n};")
    def handle_decl(self, d): self._text(f"<!{d}>")

    def handle_comment(self, d):
        if self.mode == "preview":
            self._text(f"<!--{d}-->")   # production drops all HTML comments

    def result(self):
        self.close()
        return "".join(self.out)


# --------------------------------------------------------------------------- helpers
def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def parse_meta(text, src):
    m = re.match(r"\s*<!--meta\s*(.*?)-->", text, re.S)
    if not m:
        raise ValueError(f"{src}: missing <!--meta --> block")
    meta = {}
    for line in m.group(1).strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for k in ("title", "description", "path"):
        if k not in meta:
            raise ValueError(f"{src}: meta is missing '{k}'")
    return meta, text[m.end():]


def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", s))).strip()


def faq_schema(body):
    items = re.findall(r"<details[^>]*>\s*<summary>(.*?)</summary>\s*<div>(.*?)</div>", body, re.S)
    if not items:
        return None
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": strip_tags(q),
                        "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)}} for q, a in items],
    }


def breadcrumb_schema(meta, base):
    crumbs = meta.get("breadcrumb")
    if not crumbs:
        return None
    items = []
    for i, p in enumerate([p.strip() for p in crumbs.split(">")]):
        name, url = p.split("=") if "=" in p else (p, meta["path"])
        items.append({"@type": "ListItem", "position": i + 1, "name": name.strip(), "item": base + url.strip()})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


def org_schema(cfg, claims):
    b = cfg["business"]
    s = {
        "@context": "https://schema.org",
        "@type": "EmploymentAgency",
        "@id": cfg["site_url"] + "/#organisation",
        "name": b["legal_name"],
        "alternateName": b["trading_name"],
        "url": cfg["site_url"] + "/",
        "telephone": b["phone_intl"],
        "email": b["email"],
        "foundingDate": b["founded"],
        "address": {"@type": "PostalAddress", "streetAddress": b["trading_address"]["street"],
                    "addressLocality": b["trading_address"]["locality"],
                    "postalCode": b["trading_address"]["postcode"], "addressCountry": "GB"},
        "sameAs": b["same_as"],
    }
    if cfg.get("logo_available"):
        s["logo"] = cfg["site_url"] + "/images/logo.png"
    if claims["h24"].get("approved"):
        s["openingHoursSpecification"] = {"@type": "OpeningHoursSpecification",
                                          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                                          "opens": "00:00", "closes": "23:59"}
    if claims["coverage"].get("approved"):
        s["areaServed"] = ["England", "Scotland", "Wales"]
    return s


# --------------------------------------------------------------------------- build
def build(mode, qa=False, claims_path=None, config_path=None, out=None):
    cfg = json.loads(read(config_path or os.path.join(SRC, "config.json")))
    claims = json.loads(read(claims_path or os.path.join(SRC, "claims.json")))["claims"]
    out_name = "preview" if mode == "preview" else ("qa" if qa else "production")
    out_dir = os.path.abspath(out) if out else os.path.join(ROOT, "dist", out_name)
    base = cfg["site_url"]
    errors, warnings = [], []

    # Blocking claims stop a real production build.
    if mode == "production" and not qa:
        open_blockers = [f"{k}: {v['label']}" for k, v in claims.items() if v.get("blocking") and not v.get("approved")]
        if open_blockers:
            print("PRODUCTION BUILD REFUSED. These must be approved first:\n  - " + "\n  - ".join(open_blockers))
            sys.exit(2)

    if os.path.exists(out_dir):
        shutil.rmtree(out_dir)
    shutil.copytree(STATIC, out_dir)

    partials = {n: read(os.path.join(SRC, "partials", n + ".html")) for n in ("head", "header", "footer", "consent")}
    pages = []
    for dirpath, _, files in os.walk(os.path.join(SRC, "pages")):
        pages += [os.path.join(dirpath, f) for f in files if f.endswith(".html")]

    noindex_all = mode == "preview" or qa
    analytics = cfg.get("analytics", {}).get("ga4_id", "").strip()
    built, sitemap, used, skipped = [], [], set(), []

    for p in sorted(pages):
        meta, body = parse_meta(read(p), p)
        req = meta.get("requires")
        if req and mode == "production" and not claims[req].get("approved"):
            skipped.append((meta["path"], req))
            continue

        hd = partials["header"]
        for key in NAV_KEYS:
            hd = hd.replace("{{nav_" + key + "}}", 'aria-current="page"' if meta.get("nav") == key else "")
        doc = hd + body + partials["footer"].replace("{{consent}}", partials["consent"] if analytics else "")
        doc = re.sub(r"\{\{form:([a-z]+)\}\}", lambda m: read(os.path.join(SRC, "partials", "form-" + m.group(1) + ".html")), doc)
        doc = re.sub(r"\{\{icon:([a-z]+)\}\}", lambda m: ICONS[m.group(1)], doc)
        doc = doc.replace("{{year}}", str(date.today().year))
        doc = doc.replace("{{analytics_section}}", read(os.path.join(SRC, "partials", "cookies-analytics-" + ("on" if analytics else "off") + ".html")))
        vat = cfg["business"].get("vat_number", "").strip()
        doc = doc.replace("{{vat}}", f" VAT number {html.escape(vat)}." if vat else "")

        f = ClaimFilter(mode, claims)
        f.feed(doc)
        doc = f.result()
        used |= f.used

        # Schema is built from the filtered page, so it only reflects what visitors see.
        schemas = []
        kinds = [k.strip() for k in meta.get("schema", "").split(",") if k.strip()]
        if "org" in kinds:
            schemas.append(org_schema(cfg, claims if mode == "production" else {k: {"approved": True} for k in claims}))
        if "faq" in kinds and (s := faq_schema(doc)):
            schemas.append(s)
        if (bc := breadcrumb_schema(meta, base)):
            schemas.append(bc)
        schema_html = "\n".join('<script type="application/ld+json">' + json.dumps(s, ensure_ascii=False) + "</script>" for s in schemas)

        robots = "noindex,nofollow" if noindex_all else meta.get("robots", "index,follow")
        h = partials["head"]
        rep = {"title": html.escape(meta["title"]), "description": html.escape(meta["description"]),
               "path": meta["path"], "robots": robots, "schema": schema_html,
               "html_class": "review-mode" if mode == "preview" else "",
               "analytics_meta": f'<meta name="ga4-id" content="{html.escape(analytics)}">' if analytics else ""}
        for k, v in rep.items():
            h = h.replace("{{" + k + "}}", v)
        page_html = h + doc

        left = re.findall(r"\{\{[^}]+\}\}", page_html)
        if left:
            errors.append(f"{meta['path']}: unfilled template tags {left}")

        out = os.path.join(out_dir, "404.html") if meta["path"] == "/404/" else os.path.join(out_dir, meta["path"].strip("/"), "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(page_html)
        built.append((meta, out, page_html))
        if "noindex" not in meta.get("robots", "") and meta["path"] != "/404/":
            sitemap.append(meta["path"])

    # robots.txt and sitemap.xml
    if noindex_all:
        robots_txt = "# Staging or QA build. Keep out of search results.\nUser-agent: *\nDisallow: /\n"
    else:
        robots_txt = read(os.path.join(STATIC, "robots.txt"))
    with open(os.path.join(out_dir, "robots.txt"), "w") as fh:
        fh.write(robots_txt)
    today = date.today().isoformat()
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    xml += [f"  <url><loc>{base}{p}</loc><lastmod>{today}</lastmod></url>" for p in sitemap]
    xml.append("</urlset>")
    with open(os.path.join(out_dir, "sitemap.xml"), "w") as fh:
        fh.write("\n".join(xml) + "\n")

    # ---------------------------------------------------------------- validation
    server_assets = tuple(cfg["server_assets"])   # files carried over from the live server
    for meta, out, page_html in built:
        path = meta["path"]
        if mode == "production":
            if re.search(r'data-(claim|claim-any|fallback|review|verify)=', page_html):
                errors.append(f"{path}: review attributes left in production HTML")
            for ph in re.findall(r"\[(?:X|Name|Town|day|time|TBC|VERIFY)[^\]]*\]|REPLACE_[A-Z_]+", page_html):
                # In QA mode [TBC] items are expected (they are blockers) and only reported.
                (warnings if qa and ph.startswith("[TBC") else errors).append(f"{path}: placeholder left: {ph[:60]}")
            if re.search(r'\sstyle="|\son[a-z]+="', page_html):
                errors.append(f"{path}: inline style or event handler (blocked by the Content Security Policy)")
            if re.search(r"<(ul|ol)\b(?![^>]*js-errors)[^>]*>\s*</\1>", page_html):
                errors.append(f"{path}: a list is empty after removing unapproved claims")
            if re.search(r'<div class="(grid|chips|clients|stats)[^"]*"[^>]*>\s*</div>', page_html):
                errors.append(f"{path}: a grid is empty after removing unapproved claims")
        for href in re.findall(r'(?:href|src|action)="(/[^"#?]*)', page_html):
            if href.startswith(server_assets) or href.startswith("/api/"):
                continue
            target = os.path.join(out_dir, href.lstrip("/"))
            if not (os.path.isfile(target) or os.path.isfile(os.path.join(target, "index.html"))):
                errors.append(f"{path}: broken internal link {href}")

    unknown = set(claims) - used
    print(f"[{out_name}] built {len(built)} pages, sitemap {len(sitemap)} URLs")
    for s, req in skipped:
        print(f"  skipped {s} (needs claim '{req}')")
    if mode == "production":
        removed = sorted(k for k in used if not claims[k].get("approved"))
        print(f"  unapproved claims removed or replaced: {len(removed)}")
    if unknown:
        print(f"  note: claims not used on any page: {sorted(unknown)}")
    if warnings:
        print(f"  QA warnings ({len(warnings)}), expected until blockers are cleared:")
        for w in sorted(set(warnings)):
            print("   ~ " + w)
    if errors:
        print("BUILD FAILED:\n  - " + "\n  - ".join(sorted(set(errors))))
        sys.exit(1)
    print(f"  OK -> {os.path.relpath(out_dir, ROOT)}")
    return out_dir


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["preview", "production"], default="preview")
    ap.add_argument("--qa", action="store_true", help="production rules, ignore blockers, noindex, output dist/qa")
    ap.add_argument("--claims", help="alternative claims file (for tests)")
    ap.add_argument("--config", help="alternative config file (for tests)")
    ap.add_argument("--out", help="alternative output folder (for tests)")
    a = ap.parse_args()
    build(a.mode, a.qa, a.claims, a.config, a.out)
