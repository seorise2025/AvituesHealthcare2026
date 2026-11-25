import { useEffect } from "react";

const SITE = "https://aviteushealthcare.co.uk";

type Props = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  jsonLd?: object[];
};

function setMeta(selector: string, attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

/** Sets the title, description, canonical, social tags and page schema for each page. */
export default function Seo({ title, description, path, noindex, jsonLd }: Props) {
  useEffect(() => {
    const url = SITE + path;
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex,follow" : "index,follow");
    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = url;

    const added = (jsonLd || []).map((data) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.page = "1";
      s.text = JSON.stringify(data);
      document.head.appendChild(s);
      return s;
    });
    return () => added.forEach((s) => s.remove());
  }, [title, description, path, noindex, jsonLd]);
  return null;
}
