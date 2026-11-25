// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import LeadForm from "@/components/LeadForm";
import Seo from "@/components/Seo";

export default function Register() {
  return (
    <>
      <Seo title="Register With a Healthcare Agency | Aviteus Healthcare" description="Register your interest in agency work as a healthcare assistant, support worker or nurse. See the steps, the checks and the documents you'll need." path="/candidates/register/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Does it cost anything?", "acceptedAnswer": {"@type": "Answer", "text": "No. UK employment agencies aren't allowed to charge you for finding you work. If anyone asks you for money in our name, don't pay and email info@aviteushealthcare.co.uk."}}, {"@type": "Question", "name": "How long do the checks take?", "acceptedAnswer": {"@type": "Answer", "text": "The criminal record check usually takes the longest. If you're on the DBS Update Service and your certificate is at the right level, things can move faster."}}, {"@type": "Question", "name": "Can I register without care experience?", "acceptedAnswer": {"@type": "Answer", "text": "Most agency shifts need some paid care experience. Register anyway and tell us. We'll be straight with you about whether we can offer you work."}}, {"@type": "Question", "name": "Do you sponsor visas?", "acceptedAnswer": {"@type": "Answer", "text": "We can't discuss visa sponsorship through this website. Never pay anyone who offers you a sponsored job."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Find work", "item": "https://aviteushealthcare.co.uk/candidates/"}, {"@type": "ListItem", "position": 3, "name": "Register", "item": "https://aviteushealthcare.co.uk/candidates/register/"}]}]} />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/candidates/">Find work</Link></li>
              <li aria-current="page">Register</li>
            </ol>
          </nav>
          <h1>Register with Aviteus</h1>
          <p className="intro">Tell us a bit about yourself and the work you want. One of our recruitment consultants will ring you to talk it through. It's free.</p>
        </div>
      </section>
      <section className="section">
        <div className="container layout-side">
          <div>
            <LeadForm type="candidate" id="register-form">
              <fieldset className="field full mb-5">
                <legend>What work are you looking for?{" "}<span className="req" aria-hidden="true">*</span><span className="sr-only">(required)</span></legend>
                <div className="options">
                  <label className="option"><input id="c-role" type="radio" name="role" value="HCA" required /><span>Healthcare assistant</span></label>
                  <label className="option"><input type="radio" name="role" value="Support worker" /><span>Support worker</span></label>
                  <label className="option"><input type="radio" name="role" value="Senior carer" /><span>Senior carer</span></label>
                  <label className="option"><input type="radio" name="role" value="Nurse" /><span>Registered nurse</span></label>
                </div>
                <span className="error-msg">Choose the role you want.</span>
              </fieldset>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="c-name">Full name{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="c-name" name="name" type="text" autoComplete="name" maxLength={100} required aria-describedby="c-name-err" />
                  <span className="error-msg" id="c-name-err">Enter your name.</span>
                </div>
                <div className="field">
                  <label htmlFor="c-phone">Mobile number{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="c-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} required aria-describedby="c-phone-err" />
                  <span className="error-msg" id="c-phone-err">Enter a UK phone number, for example 07700 900123.</span>
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="c-email" name="email" type="email" autoComplete="email" maxLength={254} required aria-describedby="c-email-err" />
                  <span className="error-msg" id="c-email-err">Enter an email address, for example name@example.co.uk.</span>
                </div>
                <div className="field">
                  <label htmlFor="c-postcode">Home postcode{" "}<span className="req" aria-hidden="true">*</span></label>
                  <input id="c-postcode" name="postcode" type="text" autoComplete="postal-code" maxLength={10} required pattern="[A-Za-z]{1,2}[0-9][0-9A-Za-z]? ?[0-9][A-Za-z]{2}" aria-describedby="c-postcode-hint c-postcode-err" />
                  <span className="hint" id="c-postcode-hint">So we can offer work you can reach.</span>
                  <span className="error-msg" id="c-postcode-err">Enter a UK postcode, for example HA3 8DD.</span>
                </div>
                <div className="field">
                  <label htmlFor="c-exp">Paid care experience in the UK{" "}<span className="req" aria-hidden="true">*</span></label>
                  <select id="c-exp" name="experience" required aria-describedby="c-exp-err">
                    <option value="">Choose one</option>
                    <option>None yet</option>
                    <option>Less than 6 months</option>
                    <option>6 to 12 months</option>
                    <option>1 to 3 years</option>
                    <option>More than 3 years</option>
                  </select>
                  <span className="error-msg" id="c-exp-err">Choose your experience.</span>
                </div>
                <div className="field">
                  <label htmlFor="c-rtw">Do you have the right to work in the UK?{" "}<span className="req" aria-hidden="true">*</span></label>
                  <select id="c-rtw" name="right_to_work" required aria-describedby="c-rtw-hint c-rtw-err">
                    <option value="">Choose one</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not sure</option>
                  </select>
                  <span className="hint" id="c-rtw-hint">We check right to work for everyone before any work starts. You do not need documents yet.</span>
                  <span className="error-msg" id="c-rtw-err">Choose an answer.</span>
                </div>
                <div className="field full">
                  <label htmlFor="c-notes">Anything you want us to know</label>
                  <textarea id="c-notes" name="notes" maxLength={2000} aria-describedby="c-notes-hint" />
                  <span className="hint" id="c-notes-hint">For example: the days you can work, or that you drive. Please do not include health information here.</span>
                </div>
                <div className="field full">
                  <label className="consent-box"><input type="checkbox" name="marketing_opt_in" value="yes" />{" "}<span>Optional: send me new shift and job alerts by email or text. I can opt out at any time.</span></label>
                </div>
                <div className="field full">
                  <button className="btn btn--primary btn--lg btn--block" type="submit">Register my interest</button>
                  <p className="privacy-line mt-3">Free to join. We use your details to talk to you about work and to check you are eligible. Read our{" "}<Link to="/privacy-policy/">privacy notice</Link>.</p>
                </div>
              </div>
            </LeadForm>
          </div>
          <aside className="side-card" id="documents" aria-label="Documents you will need">
            <div className="panel panel--bg">
              <h2 className="h3">Documents to get ready</h2>
              <p className="small">You don't need these to register, but having them ready speeds up your checks.</p>
              <ul className="ticks small">
                <li>Right to work: a UK or Irish passport, or a share code if you have an eVisa</li>
                <li>Photo ID</li>
                <li>Proof of address from the last three months</li>
                <li>National Insurance number</li>
                <li>Details of two referees</li>
                <li>Training certificates you already hold</li>
                <li>DBS Update Service details, if you have them</li>
                <li>Nurses: your NMC PIN</li>
              </ul>
              <Link to="/resources/agency-registration-documents/" className="more">Full documents guide</Link>
            </div>
          </aside>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container">
          <h2>What happens next</h2>
          <ol className="numbered numbered--across numbered--5 mt-5">
            <li>
              <h3>We ring you</h3>
              <p>To talk about your experience and the work you want.</p>
            </li>
            <li>
              <h3>Full application</h3>
              <p>Online, in our worker portal.</p>
            </li>
            <li>
              <h3>Checks</h3>
              <p>Including right to work and a criminal record check. The law requires both for care work.</p>
            </li>
            <li>
              <h3>First shifts</h3>
              <p>Once everything's complete, we start offering you work.</p>
            </li>
          </ol>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <h2>Questions about registering</h2>
          <div className="faq mt-5">
            <details>
              <summary>Does it cost anything?</summary>
              <div>
                <p>No. UK employment agencies aren't allowed to charge you for finding you work. If anyone asks you for money in our name, don't pay and email info@aviteushealthcare.co.uk.</p>
              </div>
            </details>
            <details>
              <summary>How long do the checks take?</summary>
              <div>
                <p>The criminal record check usually takes the longest. If you're on the DBS Update Service and your certificate is at the right level, things can move faster.</p>
              </div>
            </details>
            <details>
              <summary>Can I register without care experience?</summary>
              <div>
                <p>Most agency shifts need some paid care experience. Register anyway and tell us. We'll be straight with you about whether we can offer you work.</p>
              </div>
            </details>
            <details>
              <summary>Do you sponsor visas?</summary>
              <div>
                <p>We can't discuss visa sponsorship through this website. Never pay anyone who offers you a sponsored job.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
