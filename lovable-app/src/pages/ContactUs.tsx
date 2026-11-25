// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import LeadForm from "@/components/LeadForm";
import Seo from "@/components/Seo";

export default function ContactUs() {
  return (
    <>
      <Seo title="Contact Aviteus Healthcare | 020 3488 8172 | Harrow" description="Call 020 3488 8172 to book staff or ask about work, email info@aviteushealthcare.co.uk, or visit us at Alpha House, 296 Kenton Road, Harrow HA3 8DD." path="/contact-us/" jsonLd={[{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Contact", "item": "https://aviteushealthcare.co.uk/contact-us/"}]}]} />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">Contact</li>
            </ol>
          </nav>
          <h1>Contact us</h1>
          <p className="intro">The quickest way to reach us is by phone. For anything that isn't urgent, email or the form below is fine.</p>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <dl className="facts">
              <dt>Phone</dt>
              <dd><a href="tel:+442034888172">020 3488 8172</a><span>, answered 24 hours a day</span></dd>
              <dt>Email</dt>
              <dd><a href="mailto:info@aviteushealthcare.co.uk">info@aviteushealthcare.co.uk</a></dd>
              <dt>WhatsApp</dt>
              <dd><a href="https://wa.me/447418347802" rel="noopener">07418 347802</a>{" "}(for care workers)</dd>
              <dt>Office</dt>
              <dd>Suite 5, 3rd Floor, Alpha House, 296 Kenton Road, Harrow, HA3 8DD</dd>
            </dl>
            <p className="mt-5 small muted">Please ring before you visit, so we can make sure the right person is in.</p>
            <p><a href="https://www.google.com/maps/search/?api=1&query=Alpha+House+296+Kenton+Road+Harrow+HA3+8DD" rel="noopener">Directions on Google Maps</a></p>
            <h2 className="mt-7">Which route is right for you?</h2>
            <ul className="rows">
              <li className="row"><h3>I need staff</h3><p>Use the request form, or ring if it's for today or tonight.</p><Link to="/request-staff/" className="more">Request staff</Link></li>
              <li className="row"><h3>I want work</h3><p>Register online. You can also message us on WhatsApp.</p><Link to="/candidates/register/" className="more">Register</Link></li>
              <li className="row"><h3>Something else</h3><p>Timesheets, invoices, compliance files, complaints or data requests. Use the form here.</p><a href="#message-form" className="more">Message us</a></li>
            </ul>
          </div>
          <div>
            <LeadForm type="general" id="message-form">
              <h2 className="h3">Send us a message</h2>
              <div className="form-grid form-grid--single">
                <div className="field">
                  <label htmlFor="g-name">Name{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="g-name" name="name" autoComplete="name" maxLength={100} required aria-describedby="g-name-err" />
                  <span className="error-msg" id="g-name-err">Enter your name.</span>
                </div>
                <div className="field">
                  <label htmlFor="g-email">Email{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="g-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-describedby="g-email-err" />
                  <span className="error-msg" id="g-email-err">Enter an email address, for example name@example.co.uk.</span>
                </div>
                <div className="field">
                  <label htmlFor="g-topic">What is it about?</label>
                  <select id="g-topic" name="topic">
                    <option>General question</option>
                    <option>Timesheet or pay</option>
                    <option>Invoice</option>
                    <option>Compliance file</option>
                    <option>Complaint or feedback</option>
                    <option>Data protection request</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="g-msg">Message{" "}<span className="req" aria-hidden="true">*</span></label>
                  <textarea id="g-msg" name="message" maxLength={3000} required aria-describedby="g-msg-err" />
                  <span className="error-msg" id="g-msg-err">Enter your message.</span>
                </div>
                <button className="btn btn--primary btn--block" type="submit">Send message</button>
                <p className="privacy-line">We use your details to reply to you. Read our{" "}<Link to="/privacy-policy/">privacy notice</Link>.</p>
              </div>
            </LeadForm>
            <h2 className="h3 mt-6">Complaints</h2>
            <p className="small">If we've got something wrong, tell us. Email{" "}<a href="mailto:info@aviteushealthcare.co.uk?subject=Complaint">info@aviteushealthcare.co.uk</a>{" "}with "Complaint" in the subject, or choose "Complaint or feedback" in the form. Complaints about your personal data are covered in the{" "}<Link to="/privacy-policy/#complaints">privacy notice</Link>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
