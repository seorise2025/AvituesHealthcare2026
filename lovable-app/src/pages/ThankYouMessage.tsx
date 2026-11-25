// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import RefLine from "@/components/RefLine";
import Seo from "@/components/Seo";

export default function ThankYouMessage() {
  return (
    <>
      <Seo title="Message sent | Aviteus Healthcare" description="Thank you. We have your message." path="/thank-you/message/" noindex />
      <section className="section">
        <div className="container narrow text-center">
          <span className="done-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
          <h1>Message sent.</h1>
          <RefLine />
          <p className="intro">Thank you. You will receive a confirmation email shortly, and we will reply by email. If your message is urgent, call{" "}<a href="tel:+442034888172">020 3488 8172</a>.</p>
          <div className="btn-row center-row mt-5">
            <Link to="/" className="btn btn--outline">Back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
