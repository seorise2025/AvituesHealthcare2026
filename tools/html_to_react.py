#!/usr/bin/env python3
"""
Turn the built static site (dist/qa, claims already applied) into React pages
for the Lovable app in lovable-app/.

    python3 build.py --mode production --qa
    python3 tools/html_to_react.py

It writes lovable-app/src/pages/*.tsx, lovable-app/src/components/Footer.tsx
and lovable-app/src/routes.ts. Run it again whenever the copy in src/pages changes.
After the app has moved to Lovable, edit the .tsx files directly instead.
"""
import html
import json
import os
import re
from html.parser import HTMLParser

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
QA = os.path.join(ROOT, "dist", "qa")
APP = os.path.join(ROOT, "lovable-app", "src")

# site path -> component name
PAGES = {
    "/": "Home", "/hire-staff/": "HireStaff", "/hire-staff/emergency-cover/": "UrgentCover",
    "/hire-staff/temporary-staffing/": "TemporaryStaffing", "/hire-staff/nursing-staff/": "AgencyNurses",
    "/sectors/care-homes/": "CareHomes", "/sectors/supported-living/": "SupportedLiving",
    "/sectors/mental-health/": "MentalHealth", "/request-staff/": "RequestStaff", "/compliance/": "Compliance",
    "/candidates/": "FindWork", "/candidates/register/": "Register", "/candidates/timesheet/": "Timesheets",
    "/jobs/": "Roles", "/jobs/healthcare-assistant/": "HealthcareAssistant", "/jobs/support-worker/": "SupportWorker",
    "/jobs/registered-nurse/": "RegisteredNurse", "/about-us/": "AboutUs", "/contact-us/": "ContactUs",
    "/resources/": "Guides", "/resources/checks-before-booking-agency-staff/": "GuideAgencyChecks",
    "/resources/plan-for-staff-shortages/": "GuideStaffShortages",
    "/resources/agency-registration-documents/": "GuideRegistrationDocuments",
    "/privacy-policy/": "PrivacyNotice", "/cookie-policy/": "CookieNotice", "/accessibility/": "Accessibility",
    "/thank-you/employer/": "ThankYouStaff", "/thank-you/candidate/": "ThankYouRegister",
    "/thank-you/message/": "ThankYouMessage", "/enquiry-problem/": "FormProblem",
}
NOT_FOUND = "NotFound"

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
        "path", "circle", "rect", "line", "polyline", "polygon", "ellipse"}
BLOCK = {"section", "div", "ul", "ol", "li", "p", "h1", "h2", "h3", "h4", "h5", "h6", "table", "thead", "tbody",
         "tr", "td", "th", "form", "fieldset", "legend", "details", "summary", "nav", "aside", "header", "footer",
         "main", "article", "figure", "figcaption", "blockquote", "dl", "dt", "dd", "select", "option",
         "textarea", "hr", "address", "svg", "LeadForm"}
ATTR = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "autocomplete": "autoComplete",
    "maxlength": "maxLength", "minlength": "minLength", "inputmode": "inputMode", "colspan": "colSpan",
    "rowspan": "rowSpan", "readonly": "readOnly", "novalidate": "noValidate", "datetime": "dateTime",
    "crossorigin": "crossOrigin", "viewbox": "viewBox", "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin", "fill-rule": "fillRule",
    "clip-rule": "clipRule", "stroke-dasharray": "strokeDasharray", "preserveaspectratio": "preserveAspectRatio",
    "checked": "defaultChecked",
}
NUMERIC = {"maxLength", "minLength", "tabIndex", "colSpan", "rowSpan"}
TEXT_CONTAINERS = {"p", "li", "dd", "dt", "td", "th", "h1", "h2", "h3", "h4", "h5", "h6", "summary", "legend",
                   "label", "figcaption", "address", "strong", "span", "a", "button", "small", "b", "em"}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, attrs, parent, []


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", [])
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)

    def handle_comment(self, data):
        pass


def parse(fragment):
    t = Tree()
    t.feed(fragment)
    t.close()
    return t.root


def attr(node, name):
    for k, v in node.attrs:
        if k == name:
            return v
    return None


def has_attr(node, name):
    return any(k == name for k, _ in node.attrs)


def classes(node):
    return (attr(node, "class") or "").split()


class Ctx:
    def __init__(self):
        self.uses = set()


def prune(node):
    """Drop markup the React app renders itself (form plumbing)."""
    keep = []
    for c in node.children:
        if isinstance(c, Node):
            cl = classes(c)
            if c.tag == "input" and attr(c, "type") == "hidden":
                continue
            if c.tag == "div" and ("hp" in cl or "error-summary" in cl or "send-error" in cl):
                continue
            prune(c)
        keep.append(c)
    node.children = keep


def js_string(s):
    return "{" + json.dumps(s, ensure_ascii=False) + "}"


def text_jsx(s):
    if re.search(r"[{}<>&]", s):
        return js_string(s)
    return s


def is_block(c):
    return isinstance(c, Node) and (c.tag in BLOCK)


def render_attrs(node, ctx):
    out = []
    tag = node.tag
    itype = attr(node, "type")
    for k, v in node.attrs:
        if tag == "a" and k == "href":
            continue
        if tag == "form" and k in ("action", "method", "data-lead-form", "class"):
            continue
        name = ATTR.get(k, k)
        if tag in ("input", "textarea", "select") and k == "value" and itype not in ("radio", "checkbox"):
            name = "defaultValue"
        if k == "style":
            raise SystemExit("inline style found; move it to the stylesheet")
        if name in NUMERIC and v is not None and re.fullmatch(r"-?\d+", v):
            out.append(f"{name}={{{v}}}")
            continue
        if v is None:
            if k.startswith("data-"):
                out.append(f'{name}=""')
            else:
                out.append(name)
        else:
            out.append(f"{name}={json.dumps(v, ensure_ascii=False)}")
    return out


def render(node, ctx, depth):
    ind = "  " * depth
    tag = node.tag
    cl = classes(node)

    # thank-you reference line
    if tag == "p" and any(isinstance(c, Node) and has_attr(c, "data-ref") for c in node.children):
        ctx.uses.add("RefLine")
        return f"{ind}<RefLine />"
    # logo link
    if tag == "a" and "brand" in cl:
        ctx.uses.add("BrandLink")
        return f"{ind}<BrandLink />"

    attrs = render_attrs(node, ctx)
    jtag = tag
    if tag == "form" and attr(node, "data-lead-form"):
        ctx.uses.add("LeadForm")
        jtag = "LeadForm"
        attrs = [f'type="{attr(node, "data-lead-form")}"'] + attrs
    elif tag == "a":
        href = attr(node, "href") or ""
        if href.startswith("/") and not href.startswith("/files/") and href != "/sitemap.xml":
            ctx.uses.add("Link")
            jtag = "Link"
            attrs = [f"to={json.dumps(href)}"] + attrs
        else:
            attrs = [f"href={json.dumps(href, ensure_ascii=False)}"] + attrs
    open_ = f"<{jtag}{(' ' + ' '.join(attrs)) if attrs else ''}"
    if tag in VOID:
        return f"{ind}{open_} />"
    if tag == "textarea":
        return f"{ind}{open_} />"

    kids = node.children
    only_elements = all(isinstance(c, Node) or not c.strip() for c in kids)
    block_layout = (tag in BLOCK and all(is_block(c) or (isinstance(c, str) and not c.strip()) for c in kids)) or (
        tag not in TEXT_CONTAINERS and tag != "svg" and only_elements and any(isinstance(c, Node) for c in kids))
    if block_layout:
        parts = [render(c, ctx, depth + 1) for c in kids if isinstance(c, Node)]
        if not parts:
            return f"{ind}{open_}></{jtag}>"
        return f"{ind}{open_}>\n" + "\n".join(parts) + f"\n{ind}</{jtag}>"
    return f"{ind}{open_}>" + inline(kids, ctx, tag in BLOCK, depth) + f"</{jtag}>"


def inline(kids, ctx, parent_block, depth=0):
    out = []
    n = len(kids)
    for i, c in enumerate(kids):
        if isinstance(c, Node):
            out.append(render(c, ctx, depth).strip())
            continue
        s = re.sub(r"\s+", " ", c)
        first, last = i == 0, i == n - 1
        prev_block = i > 0 and is_block(kids[i - 1])
        next_block = i < n - 1 and is_block(kids[i + 1])
        if not s.strip():
            if (first or last) and parent_block or prev_block or next_block:
                continue
            out.append('{" "}')
            continue
        lead = s.startswith(" ") and not ((first and parent_block) or prev_block)
        trail = s.endswith(" ") and not ((last and parent_block) or next_block)
        core = s.strip()
        out.append(('{" "}' if lead else "") + text_jsx(core) + ('{" "}' if trail else ""))
    return "".join(out)


def imports(ctx, extra=()):
    lines = []
    if "Link" in ctx.uses:
        lines.append('import { Link } from "react-router-dom";')
    for name in ("LeadForm", "RefLine", "BrandLink"):
        if name in ctx.uses:
            lines.append(f'import {name} from "@/components/{name}";')
    lines.extend(extra)
    return "\n".join(lines)


def page_meta(doc):
    title = html.unescape(re.search(r"<title>(.*?)</title>", doc, re.S).group(1))
    m = re.search(r'<meta name="description" content="([^"]*)"', doc)
    desc = html.unescape(m.group(1)) if m else ""
    lds = []
    for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>', doc, re.S):
        data = json.loads(raw)
        if data.get("@type") == "EmploymentAgency":
            continue  # the organisation block is in index.html once
        lds.append(data)
    return title, desc, lds


def convert_page(path, name):
    file = os.path.join(QA, path.strip("/"), "index.html") if path != "/" else os.path.join(QA, "index.html")
    if name == NOT_FOUND:
        file = os.path.join(QA, "404.html")
    doc = open(file, encoding="utf-8").read()
    title, desc, lds = page_meta(doc)
    main = doc.split('<main id="main">', 1)[1].split("</main>", 1)[0]
    root = parse(main)
    prune(root)
    ctx = Ctx()
    body = "\n".join(render(c, ctx, 3) for c in root.children if isinstance(c, Node))
    seo_props = [f"title={json.dumps(title, ensure_ascii=False)}",
                 f"description={json.dumps(desc, ensure_ascii=False)}",
                 f"path={json.dumps(path)}"]
    if name in ("ThankYouStaff", "ThankYouRegister", "ThankYouMessage", "FormProblem", NOT_FOUND):
        seo_props.append("noindex")
    if lds:
        seo_props.append("jsonLd={" + json.dumps(lds, ensure_ascii=False) + "}")
    src = (
        "// Generated from the approved site copy by tools/html_to_react.py.\n"
        "// Safe to edit by hand once the site lives in Lovable.\n"
        + imports(ctx, ['import Seo from "@/components/Seo";']) + "\n\n"
        f"export default function {name}() {{\n"
        "  return (\n"
        "    <>\n"
        f"      <Seo {' '.join(seo_props)} />\n"
        f"{body}\n"
        "    </>\n"
        "  );\n"
        "}\n"
    )
    open(os.path.join(APP, "pages", f"{name}.tsx"), "w", encoding="utf-8").write(src)
    return name


def convert_footer():
    doc = open(os.path.join(QA, "index.html"), encoding="utf-8").read()
    frag = doc.split("<footer", 1)[1]
    frag = "<footer" + frag.split("</footer>", 1)[0] + "</footer>"
    bar = re.search(r'<div class="action-bar">.*?</div>', doc, re.S).group(0)
    root = parse(frag + bar)
    ctx = Ctx()
    body = "\n".join(render(c, ctx, 3) for c in root.children if isinstance(c, Node))
    body = body.replace("© 2026 Aviteus", "© {year} Aviteus")
    src = (
        "// Generated by tools/html_to_react.py. Safe to edit by hand.\n"
        + imports(ctx) + "\n\n"
        "export default function Footer() {\n"
        "  const year = new Date().getFullYear();\n"
        "  return (\n"
        "    <>\n"
        f"{body}\n"
        "    </>\n"
        "  );\n"
        "}\n"
    )
    open(os.path.join(APP, "components", "Footer.tsx"), "w", encoding="utf-8").write(src)


def main():
    os.makedirs(os.path.join(APP, "pages"), exist_ok=True)
    for path, name in PAGES.items():
        convert_page(path, name)
    convert_page("/404/", NOT_FOUND)
    convert_footer()
    routes = ["// Generated by tools/html_to_react.py", 'import { lazy } from "react";', ""]
    routes.append("export const routes = [")
    for path, name in PAGES.items():
        routes.append(f'  {{ path: {json.dumps(path)}, Component: lazy(() => import("@/pages/{name}")) }},')
    routes.append("];")
    routes.append(f'export const NotFound = lazy(() => import("@/pages/{NOT_FOUND}"));')
    open(os.path.join(APP, "routes.ts"), "w", encoding="utf-8").write("\n".join(routes) + "\n")
    print(f"wrote {len(PAGES) + 1} pages, Footer and routes.ts")


if __name__ == "__main__":
    main()
