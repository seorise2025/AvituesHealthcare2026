// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import LeadForm from "@/components/LeadForm";
import Seo from "@/components/Seo";

export default function RequestStaff() {
  return (
    <>
      <Seo title="Request Healthcare Staff | Aviteus Healthcare" description="Request agency nurses, healthcare assistants or support workers in about two minutes. For cover in the next few hours, call 020 3488 8172." path="/request-staff/" jsonLd={[{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Request staff", "item": "https://aviteushealthcare.co.uk/request-staff/"}]}]} />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">Request staff</li>
            </ol>
          </nav>
          <h1>Request staff</h1>
          <p className="intro">Tell us who you need and when. It takes about two minutes, and someone from our team will be in touch to go through it with you.</p>
        </div>
      </section>
      <section className="section">
        <div className="container layout-side">
          <div>
            <div className="notice notice--info mb-5" role="note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              <p><strong>Need someone in the next few hours?</strong>{" "}Please ring{" "}<a href="tel:+442034888172">020 3488 8172</a>{" "}instead. A form can wait in an inbox. A phone call can't.</p>
            </div>
            <LeadForm type="employer" id="request-form">
              <fieldset className="field full mb-5">
                <legend>How soon do you need staff?{" "}<span className="req" aria-hidden="true">*</span><span className="sr-only">(required)</span></legend>
                <div className="options">
                  <label className="option"><input id="e-urgency" type="radio" name="urgency" value="urgent" required /><span>Today or tomorrow</span></label>
                  <label className="option"><input type="radio" name="urgency" value="temporary" /><span>Shifts in the coming weeks</span></label>
                </div>
                <span className="error-msg">Choose how soon you need staff.</span>
              </fieldset>
              <fieldset className="field full mb-5">
                <legend>Who do you need?{" "}<span className="hint-inline">Choose any that apply</span></legend>
                <div className="options">
                  <label className="option"><input type="checkbox" name="roles" value="RGN" /><span>RGN nurse</span></label>
                  <label className="option"><input type="checkbox" name="roles" value="RMN" /><span>RMN nurse</span></label>
                  <label className="option"><input type="checkbox" name="roles" value="RNLD" /><span>RNLD nurse</span></label>
                  <label className="option"><input type="checkbox" name="roles" value="Senior carer" /><span>Senior carer</span></label>
                  <label className="option"><input type="checkbox" name="roles" value="HCA" /><span>Healthcare assistant</span></label>
                  <label className="option"><input type="checkbox" name="roles" value="Support worker" /><span>Support worker</span></label>
                </div>
              </fieldset>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="e-name">Your name{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="e-name" name="name" type="text" autoComplete="name" maxLength={100} required aria-describedby="e-name-err" />
                  <span className="error-msg" id="e-name-err">Enter your name.</span>
                </div>
                <div className="field">
                  <label htmlFor="e-org">Organisation{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="e-org" name="organisation" type="text" autoComplete="organization" maxLength={150} required aria-describedby="e-org-err" />
                  <span className="error-msg" id="e-org-err">Enter your organisation.</span>
                </div>
                <div className="field">
                  <label htmlFor="e-phone">Phone{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="e-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} required aria-describedby="e-phone-hint e-phone-err" />
                  <span className="hint" id="e-phone-hint">We call this number to talk through your request.</span>
                  <span className="error-msg" id="e-phone-err">Enter a UK phone number, for example 020 3488 8172.</span>
                </div>
                <div className="field">
                  <label htmlFor="e-email">Work email{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="e-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-describedby="e-email-err" />
                  <span className="error-msg" id="e-email-err">Enter an email address, for example name@example.co.uk.</span>
                </div>
                <div className="field">
                  <label htmlFor="e-postcode">Postcode of the service{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="e-postcode" name="postcode" type="text" autoComplete="postal-code" maxLength={10} required pattern="[A-Za-z]{1,2}[0-9][0-9A-Za-z]? ?[0-9][A-Za-z]{2}" aria-describedby="e-postcode-hint e-postcode-err" />
                  <span className="hint" id="e-postcode-hint">So we look for staff who can reach you.</span>
                  <span className="error-msg" id="e-postcode-err">Enter a UK postcode, for example HA3 8DD.</span>
                </div>
                <div className="field">
                  <label htmlFor="e-setting">Type of service</label>
                  <select id="e-setting" name="setting">
                    <option value="">Choose one (optional)</option>
                    <option>Residential care home</option>
                    <option>Nursing home</option>
                    <option>Supported living</option>
                    <option>Learning disability service</option>
                    <option>Mental health service</option>
                    <option>NHS trust or hospital</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="e-notes">Dates, shift times and anything else we should know</label>
                  <textarea id="e-notes" name="notes" maxLength={2000} aria-describedby="e-notes-hint" />
                  <span className="hint" id="e-notes-hint">For example: 3 night shifts from Friday, 20:00 to 08:00, hoist trained. Please do not include residents' or patients' personal details.</span>
                </div>
                <div className="field full">
                  <label className="consent-box"><input type="checkbox" name="marketing_opt_in" value="yes" />{" "}<span>Optional: send me occasional staffing updates from Aviteus Healthcare by email. I can unsubscribe at any time.</span></label>
                </div>
                <div className="field full">
                  <button className="btn btn--primary btn--lg btn--block" type="submit">Send staffing request</button>
                  <p className="privacy-line mt-3">We use your details to respond to this request and to arrange staff. Read our{" "}<Link to="/privacy-policy/">privacy notice</Link>.</p>
                </div>
              </div>
            </LeadForm>
          </div>
          <aside className="side-card" aria-label="Other ways to reach us">
            <div className="panel">
              <h2 className="h3">Rather talk to someone?</h2>
              <p className="small muted">The staffing line is answered day and night:</p>
              <a href="tel:+442034888172" className="duty__phone">020 3488 8172</a>
              <p className="small"><a href="mailto:info@aviteushealthcare.co.uk">info@aviteushealthcare.co.uk</a></p>
              <hr />
              <h2 className="h4">After you send this</h2>
              <ol className="numbered numbered--compact">
                <li>
                  <p>We contact you to check the details, and agree terms and rates if you're new to us.</p>
                </li>
                <li>
                  <p>We look for people whose experience fits your service.</p>
                </li>
                <li>
                  <p>We tell you who's coming, or tell you plainly if we can't cover it.</p>
                </li>
              </ol>
              <hr />
              <p className="small muted mb-0">You'll also get an email with a reference number. Please don't include residents' or patients' details in the form.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
