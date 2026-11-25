import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** Scroll to the top on a new page, or to the #anchor when there is one. */
function useScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // wait one frame for lazy pages to render
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
}

/** Same-page links such as #main or #message-form: scroll, don't change the page. */
function useInPageLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || a.getAttribute("href") === "#" || a.getAttribute("href")!.startsWith("#/")) return;
      const el = document.getElementById(decodeURIComponent(a.getAttribute("href")!.slice(1)));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView();
      if (el.tabIndex < 0 && !el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}

const CLIENT_PREVIEW = import.meta.env.MODE === "clientpreview";

export default function Layout() {
  useScrollManager();
  useInPageLinks();
  return (
    <>
      {CLIENT_PREVIEW && (
        <div className="preview-banner" role="note">
          Client preview. The forms are not connected yet, so nothing you type is sent.
        </div>
      )}
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
