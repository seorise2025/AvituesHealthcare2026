// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found | Aviteus Healthcare" description="This page has moved or no longer exists." path="/404/" noindex />
      <section className="section">
        <div className="container narrow text-center">
          <span className="kicker">Page not found</span>
          <h1>Sorry, we cannot find that page.</h1>
          <p className="intro">It may have moved. Where would you like to go?</p>
          <div className="btn-row center-row">
            <Link to="/request-staff/" className="btn btn--primary btn--lg">I need staff</Link>
            <Link to="/candidates/" className="btn btn--outline btn--lg">I want work</Link>
          </div>
          <p className="mt-5">Or call{" "}<a href="tel:+442034888172">020 3488 8172</a></p>
        </div>
      </section>
    </>
  );
}
