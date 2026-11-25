// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function RegisteredNurse() {
  return (
    <>
      <Seo title="Agency Nurse Jobs | RGN, RMN & RNLD Shifts | Aviteus" description="Temporary agency nursing for RGN, RMN and RNLD nurses in nursing homes and mental health services. Choose your shifts. Register free." path="/jobs/registered-nurse/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "Can I do agency shifts alongside my NHS job?", "acceptedAnswer": {"@type": "Answer", "text": "Often, yes, but check your NHS contract first. Some trusts have rules about their own staff doing agency work."}}, {"@type": "Question", "name": "Do you help with revalidation?", "acceptedAnswer": {"@type": "Answer", "text": "Revalidation is your responsibility as a nurse. Ask your consultant what records of the shifts you've worked with us could help."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Roles we recruit", "item": "https://aviteushealthcare.co.uk/jobs/"}, {"@type": "ListItem", "position": 3, "name": "Registered nurse", "item": "https://aviteushealthcare.co.uk/jobs/registered-nurse/"}]}]} />
      <section className="page-head">
        <div className="container page-head__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs/">Roles we recruit</Link></li>
                <li aria-current="page">Registered nurse</li>
              </ol>
            </nav>
            <h1>Agency nursing with Aviteus</h1>
            <p className="intro">RGN, RMN and RNLD shifts in nursing homes, mental health and learning disability services. You decide when and where you work.</p>
            <div className="btn-row">
              <Link to="/candidates/register/" className="btn btn--primary btn--lg">Register now</Link>
            </div>
          </div>
          <dl className="facts panel">
            <dt>Employer</dt>
            <dd>Aviteus Healthcare Ltd</dd>
            <dt>Type</dt>
            <dd>Temporary agency work</dd>
            <dt>Registration</dt>
            <dd>RGN, RMN or RNLD on the NMC register</dd>
            <dt>Pay</dt>
            <dd>Hourly, shown before you accept a shift</dd>
          </dl>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="prose">
            <h2>What you'll need</h2>
            <ul>
              <li>Current NMC registration, with no conditions that stop you doing the work</li>
              <li>Post-registration experience in services like the ones you want to work in</li>
              <li>The right to work in the UK</li>
              <li>Two references, one of them from a clinical manager</li>
            </ul>
            <h2>The shifts</h2>
            <p>Shifts are usually in nursing homes, mental health or learning disability services. You might be the only nurse on shift leading a team of carers, or working alongside the service's own nurses. We'll tell you which before you accept.</p>
            <h2>How pay works</h2>
            <p>Each shift has its own hourly rate, based on the setting, the time, the day and the location. You'll see it before you accept.</p>
          </div>
          <div className="panel panel--bg">
            <h2 className="h3">Working with us</h2>
            <ul className="ticks">
              <li>You choose your shifts</li>
              <li>Work near home</li>
              <li>Weekly pay</li>
              <li>Free mandatory training</li>
            </ul>
            <Link to="/candidates/register/" className="btn btn--primary btn--block">Register now</Link>
          </div>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container narrow">
          <h2>Questions from nurses</h2>
          <div className="faq mt-5">
            <details>
              <summary>Can I do agency shifts alongside my NHS job?</summary>
              <div>
                <p>Often, yes, but check your NHS contract first. Some trusts have rules about their own staff doing agency work.</p>
              </div>
            </details>
            <details>
              <summary>Do you help with revalidation?</summary>
              <div>
                <p>Revalidation is your responsibility as a nurse. Ask your consultant what records of the shifts you've worked with us could help.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
