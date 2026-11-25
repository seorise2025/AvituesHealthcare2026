// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function HireStaff() {
  return (
    <>
      <Seo title="Healthcare Staffing Services | Aviteus Healthcare" description="Urgent cover, temporary shifts, agency nurses and permanent recruitment for care homes, supported living and mental health services, with what affects the price." path="/hire-staff/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Do I have to sign a contract?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, a short one. The law requires an agency to agree terms with a client in writing before it supplies staff. It covers rates, how bookings and cancellations work, and any fee if you later take on one of our workers directly."}}, {"@type": "Question", "name": "Is there a minimum booking?", "acceptedAnswer": {"@type": "Answer", "text": "No. Once the agreement is in place you can book a single shift."}}, {"@type": "Question", "name": "Where do you cover?", "acceptedAnswer": {"@type": "Answer", "text": "Anywhere in the UK. Send your postcode and we'll tell you honestly how much choice we have nearby."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Hire staff", "item": "https://aviteushealthcare.co.uk/hire-staff/"}]}]} />
      <section className="page-head">
        <div className="container page-head__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li aria-current="page">Hire staff</li>
              </ol>
            </nav>
            <h1>Staffing for care providers</h1>
            <p className="intro">Most people come to us with one of four problems. Find yours below, or ring us and we'll work it out together.</p>
          </div>
          <div className="panel">
            <p className="mb-0 small">Need someone today?<br /><a href="tel:+442034888172" className="duty__phone">020 3488 8172</a></p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ul className="rows">
            <li className="row"><h2 className="h3"><Link to="/hire-staff/emergency-cover/">"Someone's called in sick for tonight"</Link></h2><p>Urgent and same-day cover. Phone is quickest, because we can start calling workers while we talk.</p><Link to="/hire-staff/emergency-cover/" className="more">Urgent cover</Link></li>
            <li className="row"><h2 className="h3"><Link to="/hire-staff/temporary-staffing/">"We're short every weekend in December"</Link></h2><p>Temporary staffing booked ahead: single shifts, block bookings with the same workers, or a long line while you recruit.</p><Link to="/hire-staff/temporary-staffing/" className="more">Temporary staffing</Link></li>
            <li className="row"><h2 className="h3"><Link to="/hire-staff/nursing-staff/">"We can't open the night shift without a nurse"</Link></h2><p>Agency RGN, RMN and RNLD nurses, matched to the kind of service you run.</p><Link to="/hire-staff/nursing-staff/" className="more">Agency nurses</Link></li>
          </ul>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container split">
          <div className="measure">
            <h2>What affects the price</h2>
            <p>We don't publish a price list, because the same shift can cost quite different amounts depending on a handful of things. What we do instead is agree the rates with you in writing before anyone starts. These are the things that move the number:</p>
            <ul>
              <li><strong>The role.</strong>{" "}A registered nurse costs more than a healthcare assistant or support worker.</li>
              <li><strong>When the shift is.</strong>{" "}Nights, weekends and bank holidays are charged at higher rates.</li>
              <li><strong>How much notice you give.</strong>{" "}Same-day requests can cost more, and they are harder to fill.</li>
              <li><strong>How much you book.</strong>{" "}A run of shifts is easier to plan than scattered single ones.</li>
              <li><strong>Specialist skills.</strong>{" "}The more specific the requirement, the fewer people can do it.</li>
            </ul>
          </div>
          <div className="panel panel--accent">
            <h2 className="h3">What every client gets</h2>
            <ul className="ticks mb-0">
              <li>Terms and rates agreed in writing before the first shift</li>
              <li>People matched to your setting, not just the job title</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <h2>Before you book</h2>
          <div className="faq mt-5">
            <details>
              <summary>Do I have to sign a contract?</summary>
              <div>
                <p>Yes, a short one. The law requires an agency to agree terms with a client in writing before it supplies staff. It covers rates, how bookings and cancellations work, and any fee if you later take on one of our workers directly.</p>
              </div>
            </details>
            <details>
              <summary>Is there a minimum booking?</summary>
              <div>
                <p>No. Once the agreement is in place you can book a single shift.</p>
              </div>
            </details>
            <details>
              <summary>Where do you cover?</summary>
              <div>
                <p>Anywhere in the UK. Send your postcode and we'll tell you honestly how much choice we have nearby.</p>
              </div>
            </details>
          </div>
          <p className="mt-6">Want to see how we check people first?{" "}<Link to="/compliance/">Read our compliance details</Link>, or the{" "}<Link to="/resources/checks-before-booking-agency-staff/">checklist we'd use if we were booking agency staff ourselves</Link>.</p>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container">
          <div className="strip">
            <div>
              <h2>Tell us what you need</h2>
              <p>A two-minute form, or a phone call if it's urgent.</p>
            </div>
            <div className="btn-row">
              <Link to="/request-staff/" className="btn btn--primary btn--lg">Request staff</Link>
              <a href="tel:+442034888172" className="btn btn--outline btn--lg">020 3488 8172</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
