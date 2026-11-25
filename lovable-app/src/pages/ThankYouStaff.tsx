// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import RefLine from "@/components/RefLine";
import Seo from "@/components/Seo";

export default function ThankYouStaff() {
  return (
    <>
      <Seo title="Request received | Aviteus Healthcare" description="Thank you. We have your staffing request." path="/thank-you/employer/" noindex />
      <section className="section">
        <div className="container narrow text-center">
          <span className="done-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
          <h1>We have your request.</h1>
          <RefLine />
          <p className="intro">You will receive a confirmation email shortly. A member of our team will contact you to go through the details and confirm what we can cover.</p>
          <div className="notice mt-5" role="note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            <p><strong>Need someone in the next few hours?</strong>{" "}Please also call{" "}<a href="tel:+442034888172">020 3488 8172</a>. It is the fastest way to reach us.</p>
          </div>
          <p className="small muted mt-5">No email in a few minutes? Check your junk folder, or call us.</p>
          <div className="btn-row center-row mt-5">
            <Link to="/compliance/" className="btn btn--outline">How we check staff</Link>
            <Link to="/" className="btn btn--outline">Back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}
