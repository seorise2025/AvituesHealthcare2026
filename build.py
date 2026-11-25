#!/usr/bin/env python3
"""
Aviteus Healthcare static site builder.

  python3 build.py            -> writes the finished site into ./site
  cd site && python3 -m http.server 8000   -> preview at http://localhost:8000

Each page in src/pages starts with a meta block:

<!--meta
title: Page title | Aviteus Healthcare
description: Meta description
path: /hire-staff/
nav: hire            (hire | work | compliance | about | resources | contact)
robots: index,follow (optional)
schema: org          (optional: org | faq | job | breadcrumb names)
-->

Placeholders you can use inside pages:
  {{icon:name}}   inline SVG icon (see ICONS below)
"""
import json
import os
import re
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
OUT = os.path.join(ROOT, "site")
BASE = "https://aviteushealthcare.co.uk"

# Simple 24px line icons. stroke = currentColor so they take the text colour.
def _svg(body, fill=False):
    if fill:
        return ('<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + body + "</svg>")
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>")

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
    "target": _svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
    "linkedin": _svg('<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4z"/>', fill=True),
    "facebook": _svg('<path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7H17l.5-4h-4V9c0-.6.4-1 1-1z"/>', fill=True),
    "instagram": _svg('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>'),
    "whatsapp": _svg('<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/>', fill=True),
}

ORG_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    "@id": BASE + "/#organisation",
    "name": "Aviteus Healthcare Ltd",
    "alternateName": "Aviteus Healthcare",
    "url": BASE + "/",
    "logo": BASE + "/images/logo.png",
    "telephone": "+44 20 3488 8172",
    "email": "info@aviteushealthcare.co.uk",
    "foundingDate": "2021-04-15",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Suite 5, 3rd Floor, Alpha House, 296 Kenton Road",
        "addressLocality": "Harrow",
        "postalCode": "HA3 8DD",
        "addressCountry": "GB",
    },
    "areaServed": ["England", "Wales", "Scotland"],
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59",
    },
    "sameAs": [
        "https://www.linkedin.com/company/aviteus-healthcare",
        "https://www.facebook.com/Aviteus-Healthcare-105692805507912",
        "https://www.instagram.com/aviteus_healthcare/",
        "https://find-and-update.company-information.service.gov.uk/company/13337393",
    ],
}

NAV_KEYS = ["hire", "work", "compliance", "about", "resources", "contact"]


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def parse_meta(text):
    m = re.match(r"\s*<!--meta\s*(.*?)-->", text, re.S)
    if not m:
        raise ValueError("Missing <!--meta --> block")
    meta = {}
    for line in m.group(1).strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    return meta, text[m.end():]


def faq_schema(body):
    items = re.findall(r"<details[^>]*>\s*<summary>(.*?)</summary>\s*<div>(.*?)</div>", body, re.S)
    if not items:
        return None
    strip = lambda s: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": strip(q), "acceptedAnswer": {"@type": "Answer", "text": strip(a)}}
            for q, a in items
        ],
    }


def breadcrumb_schema(meta):
    crumbs = meta.get("breadcrumb")
    if not crumbs:
        return None
    parts = [p.strip() for p in crumbs.split(">")]
    items = []
    for i, p in enumerate(parts):
        name, url = p.split("=") if "=" in p else (p, meta["path"])
        items.append({"@type": "ListItem", "position": i + 1, "name": name.strip(), "item": BASE + url.strip()})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


def build():
    head = read(os.path.join(SRC, "partials", "head.html"))
    header = read(os.path.join(SRC, "partials", "header.html"))
    footer = read(os.path.join(SRC, "partials", "footer.html"))
    pages = []
    for dirpath, _, files in os.walk(os.path.join(SRC, "pages")):
        for fn in sorted(files):
            if fn.endswith(".html"):
                pages.append(os.path.join(dirpath, fn))

    sitemap = []
    for p in sorted(pages):
        meta, body = parse_meta(read(p))
        path = meta["path"]
        schemas = []
        kinds = [k.strip() for k in meta.get("schema", "").split(",") if k.strip()]
        if "org" in kinds:
            schemas.append(ORG_SCHEMA)
        if "faq" in kinds:
            s = faq_schema(body)
            if s:
                schemas.append(s)
        bc = breadcrumb_schema(meta)
        if bc:
            schemas.append(bc)
        schema_html = "\n".join(
            '<script type="application/ld+json">' + json.dumps(s, ensure_ascii=False) + "</script>" for s in schemas
        )

        h = head
        for k in ("title", "description", "path"):
            h = h.replace("{{" + k + "}}", meta[k])
        h = h.replace("{{robots}}", meta.get("robots", "index,follow"))
        h = h.replace("{{schema}}", schema_html)

        hd = header
        for key in NAV_KEYS:
            hd = hd.replace("{{nav_" + key + "}}", 'aria-current="page"' if meta.get("nav") == key else "")

        html = h + hd + body + footer
        html = re.sub(r"\{\{icon:([a-z]+)\}\}", lambda m: ICONS[m.group(1)], html)
        left = re.findall(r"\{\{[^}]+\}\}", html)
        if left:
            raise ValueError(f"Unfilled placeholders in {p}: {left}")

        if path == "/404/":
            out = os.path.join(OUT, "404.html")
        else:
            out = os.path.join(OUT, path.strip("/"), "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, "w", encoding="utf-8") as f:
            f.write(html)
        if "noindex" not in meta.get("robots", "") and path != "/404/":
            sitemap.append(path)
        print("built", path)

    today = date.today().isoformat()
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path in sitemap:
        xml.append(f"  <url><loc>{BASE}{path}</loc><lastmod>{today}</lastmod></url>")
    xml.append("</urlset>")
    with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write("\n".join(xml) + "\n")
    print(f"sitemap.xml: {len(sitemap)} URLs")


if __name__ == "__main__":
    build()
