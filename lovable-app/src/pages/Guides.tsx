// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function Guides() {
  return (
    <>
      <Seo title="Guides for Care Managers and Care Workers | Aviteus" description="Practical guides on booking agency staff, planning for staff shortages and the documents care workers need to join an agency." path="/resources/" jsonLd={[{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://aviteushealthcare.co.uk/resources/"}]}]} />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">Guides</li>
            </ol>
          </nav>
          <h1>Guides</h1>
          <p className="intro">Practical notes for care managers and care workers. Each one is checked against official UK guidance and dated, so you know how current it is.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <ul className="guides">
            <li><small>For care managers. Checked 25 November 2026</small><h2 className="h3"><Link to="/resources/checks-before-booking-agency-staff/">What to check before you book agency staff</Link></h2><p>The questions to ask any agency, what you can check yourself, and the warning signs.</p></li>
            <li><small>For care managers. Updated 25 November 2026</small><h2 className="h3"><Link to="/resources/plan-for-staff-shortages/">Planning for sudden staff shortages</Link></h2><p>A one-page cover plan to write now, before the next early-morning sick call.</p></li>
            <li><small>For care workers. Checked 25 November 2026</small><h2 className="h3"><Link to="/resources/agency-registration-documents/">Documents you'll need to join a care agency</Link></h2><p>What to get ready, including how right to work checks work with share codes.</p></li>
          </ul>
        </div>
      </section>
    </>
  );
}
