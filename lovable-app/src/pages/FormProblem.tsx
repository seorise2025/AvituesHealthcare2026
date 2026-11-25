// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function FormProblem() {
  return (
    <>
      <Seo title="Your form did not send | Aviteus Healthcare" description="Something stopped your form from sending." path="/enquiry-problem/" noindex />
      <section className="section">
        <div className="container narrow">
          <span className="kicker">Form not sent</span>
          <h1>Sorry, your form did not send.</h1>
          <p className="intro">Nothing has been saved. This usually happens for one of these reasons:</p>
          <ul className="ticks">
            <li>A required field was empty, or an email, phone number or postcode was not in the expected format</li>
            <li>Several forms were sent from the same connection in a short time</li>
            <li>A temporary problem on our side</li>
          </ul>
          <p>Please go back and try again. If it still does not work, contact us directly:</p>
          <div className="btn-row mt-5">
            <a href="tel:+442034888172" className="btn btn--teal btn--lg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>020 3488 8172</a>
            <a href="mailto:info@aviteushealthcare.co.uk" className="btn btn--outline btn--lg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>info@aviteushealthcare.co.uk</a>
          </div>
          <p className="mt-6"><Link to="/request-staff/">Request staff form</Link>{" "}·{" "}<Link to="/candidates/register/">Registration form</Link>{" "}·{" "}<Link to="/contact-us/">Contact form</Link></p>
        </div>
      </section>
    </>
  );
}
