// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function SupportedLiving() {
  return (
    <>
      <Seo title="Supported Living Staffing Agency | Aviteus Healthcare" description="Support workers, senior support workers and RNLD nurses for supported living, learning disability and autism services. Request staff or call 020 3488 8172." path="/sectors/supported-living/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Do you cover sleep-ins?", "acceptedAnswer": {"@type": "Answer", "text": "Yes. Tell us the hours and any waking duties so we can agree the right rate and brief the worker properly."}}, {"@type": "Question", "name": "Can the person meet the worker first?", "acceptedAnswer": {"@type": "Answer", "text": "If there's time, yes. Book ahead and we'll arrange an introduction before the first shift."}}, {"@type": "Question", "name": "What do you need to know about the person?", "acceptedAnswer": {"@type": "Answer", "text": "Only what the worker needs to support them safely: needs, routines and risks. Please share it with us securely rather than through the website form."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Hire staff", "item": "https://aviteushealthcare.co.uk/hire-staff/"}, {"@type": "ListItem", "position": 3, "name": "Supported living", "item": "https://aviteushealthcare.co.uk/sectors/supported-living/"}]}]} />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/hire-staff/">Hire staff</Link></li>
              <li aria-current="page">Supported living</li>
            </ol>
          </nav>
          <h1>Support workers for supported living services</h1>
          <p className="intro">In supported living, one unfamiliar face can unsettle someone for days. We supply support workers, senior support workers and RNLD nurses for learning disability and autism services, and we work hard to send the same people back.</p>
          <div className="btn-row">
            <Link to="/request-staff/" className="btn btn--primary btn--lg">Request staff</Link>
            <a href="tel:+442034888172" className="btn btn--outline btn--lg">020 3488 8172</a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container cols cols-3">
          <div>
            <h2 className="h3">Routine matters</h2>
            <p className="muted">Tell us who the person gets on with, what upsets them and how their day usually runs. We use it when choosing who to send.</p>
          </div>
          <div>
            <h2 className="h3">Lone working</h2>
            <p className="muted">Plenty of shifts have no colleague on site. For those, we look for experienced, confident support workers.</p>
          </div>
          <div>
            <h2 className="h3">Out in the community</h2>
            <p className="muted">Shopping, appointments, college, days out. Tell us if the worker needs to drive, and give us notice, because fewer can.</p>
          </div>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container split">
          <div className="measure">
            <h2>What we cover</h2>
            <ul className="ticks">
              <li>Support workers, senior support workers, team leaders and RNLD nurses</li>
              <li>Day shifts, waking nights and sleep-ins</li>
              <li>One-to-one and two-to-one support hours</li>
              <li>Block bookings to keep the same workers</li>
            </ul>
            <h3 className="mt-5">What we don't</h3>
            <ul className="crosses">
              <li>Writing or reviewing support plans</li>
              <li>Any restrictive practice that isn't in the person's plan</li>
            </ul>
          </div>
          <div className="panel">
            <h2 className="h3">Cost and timing</h2>
            <p>Sleep-ins, waking nights and day support are charged differently. Higher needs and two-to-one support need more experienced people, which affects both the rate and how much notice we need.</p>
            <p className="mb-0">We agree all of this in writing before the first shift.</p>
          </div>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container narrow">
          <h2>Supported living questions</h2>
          <div className="faq mt-5">
            <details>
              <summary>Do you cover sleep-ins?</summary>
              <div>
                <p>Yes. Tell us the hours and any waking duties so we can agree the right rate and brief the worker properly.</p>
              </div>
            </details>
            <details>
              <summary>Can the person meet the worker first?</summary>
              <div>
                <p>If there's time, yes. Book ahead and we'll arrange an introduction before the first shift.</p>
              </div>
            </details>
            <details>
              <summary>What do you need to know about the person?</summary>
              <div>
                <p>Only what the worker needs to support them safely: needs, routines and risks. Please share it with us securely rather than through the website form.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="strip">
            <div>
              <h2>Need support workers?</h2>
              <p>Send the hours and we'll come back to you.</p>
            </div>
            <div className="btn-row">
              <Link to="/request-staff/" className="btn btn--primary btn--lg">Request staff</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
