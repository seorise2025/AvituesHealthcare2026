// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function SupportWorker() {
  return (
    <>
      <Seo title="Support Worker Jobs | Agency Work | Aviteus Healthcare" description="Temporary agency support worker jobs in supported living, learning disability and mental health services. Choose your shifts. Register free in five minutes." path="/jobs/support-worker/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Do I need qualifications?", "acceptedAnswer": {"@type": "Answer", "text": "You don't need a degree. Experience, up-to-date mandatory training and the right attitude matter most."}}, {"@type": "Question", "name": "Will I work on my own?", "acceptedAnswer": {"@type": "Answer", "text": "Some supported living shifts are lone working. We only offer those to people with enough experience, and we tell you before you accept."}}, {"@type": "Question", "name": "Support worker or HCA?", "acceptedAnswer": {"@type": "Answer", "text": "Plenty of people do both. See healthcare assistant roles."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Roles we recruit", "item": "https://aviteushealthcare.co.uk/jobs/"}, {"@type": "ListItem", "position": 3, "name": "Support worker", "item": "https://aviteushealthcare.co.uk/jobs/support-worker/"}]}]} />
      <section className="page-head">
        <div className="container page-head__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs/">Roles we recruit</Link></li>
                <li aria-current="page">Support worker</li>
              </ol>
            </nav>
            <h1>Agency support worker jobs</h1>
            <p className="intro">Help people with learning disabilities, autism or mental health needs live the way they choose, on shifts that fit around your own life.</p>
            <div className="btn-row">
              <Link to="/candidates/register/" className="btn btn--primary btn--lg">Register now</Link>
            </div>
          </div>
          <dl className="facts panel">
            <dt>Employer</dt>
            <dd>Aviteus Healthcare Ltd</dd>
            <dt>Type</dt>
            <dd>Temporary agency work</dd>
            <dt>Shifts</dt>
            <dd>Days, waking nights, sleep-ins</dd>
            <dt>Pay</dt>
            <dd>Hourly, shown before you accept a shift</dd>
          </dl>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="prose">
            <h2>What the job involves</h2>
            <ul>
              <li>Helping with cooking, cleaning, shopping and money</li>
              <li>Supporting people to get out: college, work, appointments, seeing friends</li>
              <li>Personal care, where it's part of the support plan</li>
              <li>Medication support, following the service's policy</li>
              <li>Following support plans and behaviour support plans</li>
              <li>Writing daily notes</li>
            </ul>
            <h2>What you'll need</h2>
            <ul>
              <li>The right to work in the UK</li>
              <li>Paid care or support experience</li>
              <li>Patience, good judgement, and respect for people's own choices</li>
              <li>A driving licence helps for community support, but isn't always needed</li>
            </ul>
            <h2>Sleep-ins</h2>
            <p>On a sleep-in you stay overnight and can sleep, but you're there if someone needs you. Sleep-ins are usually paid differently from waking hours, and your consultant will explain the rate before you accept.</p>
            <h2>Working in Wales or Northern Ireland</h2>
            <p>Most social care workers in Wales must register with Social Care Wales within six months of starting. In Northern Ireland, social care workers must be registered with the Northern Ireland Social Care Council (NISCC). Ask us about it when you register.</p>
          </div>
          <div className="panel panel--bg">
            <h2 className="h3">Working with us</h2>
            <ul className="ticks">
              <li>You choose which shifts to take</li>
              <li>Shifts offered close to home</li>
              <li>We tell you if a shift is lone working before you accept</li>
            </ul>
            <Link to="/candidates/register/" className="btn btn--primary btn--block">Register now</Link>
          </div>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container narrow">
          <h2>Support worker questions</h2>
          <div className="faq mt-5">
            <details>
              <summary>Do I need qualifications?</summary>
              <div>
                <p>You don't need a degree. Experience, up-to-date mandatory training and the right attitude matter most.</p>
              </div>
            </details>
            <details>
              <summary>Will I work on my own?</summary>
              <div>
                <p>Some supported living shifts are lone working. We only offer those to people with enough experience, and we tell you before you accept.</p>
              </div>
            </details>
            <details>
              <summary>Support worker or HCA?</summary>
              <div>
                <p>Plenty of people do both. See{" "}<Link to="/jobs/healthcare-assistant/">healthcare assistant roles</Link>.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
