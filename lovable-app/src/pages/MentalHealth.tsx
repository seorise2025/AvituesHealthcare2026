// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function MentalHealth() {
  return (
    <>
      <Seo title="Mental Health Staffing Agency | RMNs & HCAs | Aviteus" description="RMN nurses, mental health healthcare assistants and support workers for wards, rehabilitation units and community mental health services." path="/sectors/mental-health/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Can you staff enhanced observations?", "acceptedAnswer": {"@type": "Answer", "text": "Tell us the level, the hours and the training your policy requires, and we'll tell you what we can cover."}}, {"@type": "Question", "name": "Are your staff trained in restraint?", "acceptedAnswer": {"@type": "Answer", "text": "Services use different methods. Tell us yours and we'll only offer people who hold it."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Hire staff", "item": "https://aviteushealthcare.co.uk/hire-staff/"}, {"@type": "ListItem", "position": 3, "name": "Mental health", "item": "https://aviteushealthcare.co.uk/sectors/mental-health/"}]}]} />
      <section className="page-head">
        <div className="container page-head__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/hire-staff/">Hire staff</Link></li>
                <li aria-current="page">Mental health</li>
              </ol>
            </nav>
            <h1>Staff for mental health services</h1>
            <p className="intro">Mental health work needs people with the right training and the right temperament: calm, observant and firm when they need to be. We supply RMNs, mental health healthcare assistants and support workers.</p>
            <div className="btn-row">
              <Link to="/request-staff/" className="btn btn--primary btn--lg">Request staff</Link>
              <a href="tel:+442034888172" className="btn btn--outline btn--lg">020 3488 8172</a>
            </div>
          </div>
          <div className="panel">
            <h2 className="h4">Settings</h2>
            <p className="small mb-0">Mental health wards, locked and step-down rehabilitation, community and crisis services, and older adult units.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="measure">
            <h2>Before we book anyone, we'll ask</h2>
            <ul>
              <li>About the patient group, and the observation levels on the ward</li>
              <li>Which physical intervention method your service uses, so we only offer staff trained in it</li>
              <li>Whether you need a male or female worker for any observations</li>
              <li>Who the worker reports to, and how handover works</li>
            </ul>
            <h2 className="mt-6">Not something we provide</h2>
            <ul className="crosses">
              <li>Psychiatrists, psychologists or approved mental health professionals</li>
              <li>Secure transport or escorts</li>
              <li>Physical intervention by anyone not trained in your approved method</li>
            </ul>
          </div>
          <div className="panel panel--bg">
            <h2 className="h3">Cost and timing</h2>
            <p>RMNs are among the hardest nurses to find, so book ahead wherever you can. One-to-one and two-to-one observations take more staff hours, and a specific training requirement narrows who we can offer.</p>
            <p className="mb-0">Rates are agreed in writing before the first shift.</p>
          </div>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container narrow">
          <h2>Questions</h2>
          <div className="faq mt-5">
            <details>
              <summary>Can you staff enhanced observations?</summary>
              <div>
                <p>Tell us the level, the hours and the training your policy requires, and we'll tell you what we can cover.</p>
              </div>
            </details>
            <details>
              <summary>Are your staff trained in restraint?</summary>
              <div>
                <p>Services use different methods. Tell us yours and we'll only offer people who hold it.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="strip">
            <div>
              <h2>Need mental health staff?</h2>
              <p>Ring us or send the details.</p>
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
