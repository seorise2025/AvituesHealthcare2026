// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function Roles() {
  return (
    <>
      <Seo title="Healthcare Agency Jobs: HCA, Support & Nurse | Aviteus" description="Temporary agency work for healthcare assistants, support workers and registered nurses. See what each role involves and register free." path="/jobs/" jsonLd={[{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Roles we recruit", "item": "https://aviteushealthcare.co.uk/jobs/"}]}]} />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">Roles we recruit</li>
            </ol>
          </nav>
          <h1>The roles we recruit for</h1>
          <p className="intro">All of these are temporary agency roles with Aviteus Healthcare Ltd. Pick one to see what the work involves and what you'll need, then register once and we'll match you to shifts near you.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ul className="rows">
            <li className="row"><h2 className="h3"><Link to="/jobs/healthcare-assistant/">Healthcare assistant</Link></h2><p>Personal care and day-to-day support in care homes, nursing homes and hospitals.</p><Link to="/jobs/healthcare-assistant/" className="more">About the role</Link></li>
            <li className="row"><h2 className="h3"><Link to="/jobs/support-worker/">Support worker</Link></h2><p>Helping people with learning disabilities, autism or mental health needs live their own lives.</p><Link to="/jobs/support-worker/" className="more">About the role</Link></li>
            <li className="row"><h2 className="h3"><Link to="/jobs/registered-nurse/">Registered nurse</Link></h2><p>RGN, RMN and RNLD shifts in nursing homes and mental health services.</p><Link to="/jobs/registered-nurse/" className="more">About the role</Link></li>
          </ul>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container split">
          <div className="measure">
            <h2>Why there's no job board</h2>
            <p>Agency shifts come and go quickly, so a list on a website is out of date almost as soon as it's published. Instead, register with us. Your consultant will offer you shifts that match your skills and are within reach of your postcode.</p>
          </div>
          <div className="panel">
            <h2 className="h3">Ready to start?</h2>
            <p>Registering is free and takes about five minutes.</p>
            <Link to="/candidates/register/" className="btn btn--primary btn--block">Register with us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
