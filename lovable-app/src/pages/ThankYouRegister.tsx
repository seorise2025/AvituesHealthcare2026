// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import RefLine from "@/components/RefLine";
import Seo from "@/components/Seo";

export default function ThankYouRegister() {
  return (
    <>
      <Seo title="Thanks for registering | Aviteus Healthcare" description="Thank you. We have your details." path="/thank-you/candidate/" noindex />
      <section className="section">
        <div className="container narrow text-center">
          <span className="done-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
          <h1>Thanks. We have your details.</h1>
          <RefLine />
          <p className="intro">You will receive a confirmation email shortly. A recruitment consultant will contact you to talk about the work you want and the next steps.</p>
          <p>While you wait, start getting your documents ready. It is the quickest way to your first shift.</p>
          <div className="btn-row center-row mt-5">
            <Link to="/resources/agency-registration-documents/" className="btn btn--primary">Documents you need</Link>
            <a href="https://register.aviteushealthcare.co.uk/" className="btn btn--outline" rel="noopener">Worker portal</a>
          </div>
          <div className="notice mt-6" role="note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M12 3l10 18H2L12 3z" /><path d="M12 10v5M12 18h.01" /></svg>
            <p><strong>We will never ask you to pay a fee.</strong>{" "}If anyone asks you for money in our name, do not pay.</p>
          </div>
        </div>
      </section>
    </>
  );
}
