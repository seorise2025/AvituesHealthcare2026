// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function GuideStaffShortages() {
  return (
    <>
      <Seo title="Planning for Care Staff Shortages | Aviteus Healthcare" description="A practical one-page cover plan for care homes and supported living services, so a sick call at 6am does not become a crisis." path="/resources/plan-for-staff-shortages/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "How many agencies should we use?", "acceptedAnswer": {"@type": "Answer", "text": "Two is a sensible minimum, so you are not stuck if one cannot help. More than that becomes hard to manage and harder to keep consistent staff."}}, {"@type": "Question", "name": "Is agency staff always more expensive than overtime?", "acceptedAnswer": {"@type": "Answer", "text": "Not always. Compare the full cost of overtime, including tiredness and the risk of losing your own staff, with an agency rate agreed in advance."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://aviteushealthcare.co.uk/resources/"}, {"@type": "ListItem", "position": 3, "name": "Plan for staff shortages", "item": "https://aviteushealthcare.co.uk/resources/plan-for-staff-shortages/"}]}]} />
      <article className="section">
        <div className="container layout-side">
          <div className="prose">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/resources/">Guides</Link></li>
                <li aria-current="page">Plan for staff shortages</li>
              </ol>
            </nav>
            <p className="kicker">For care managers</p>
            <h1>How to plan for sudden staff shortages.</h1>
            <p className="article-meta">By Aviteus Healthcare. Updated 25 November 2026.</p>
            <p className="intro">You cannot stop people calling in sick. You can decide now what happens when they do. A one-page cover plan turns a 6am scramble into a list of calls.</p>
            <h2>1. Know your minimum safe staffing</h2>
            <p>Write down the minimum number and mix of staff for each shift. Include the skills that must be on site, such as a nurse, a medication-trained senior, or a driver. This is the number you protect first.</p>
            <h2>2. Find your weak shifts</h2>
            <p>Look back over three months of rotas. Which shifts were short most often? Weekend nights and bank holidays usually top the list. These are the shifts to plan for, not just react to.</p>
            <h2>3. Build a call-down list, in order</h2>
            <ol>
              <li>Your own staff who want extra hours</li>
              <li>Your bank staff</li>
              <li>Staff from a sister service, if you have one</li>
              <li>Your first-choice agency</li>
              <li>Your second-choice agency</li>
            </ol>
            <p>Put names, numbers and the times each person can be called. Keep it printed by the phone as well as on a shared drive.</p>
            <h2>4. Set up agencies before you need them</h2>
            <p>An agency must agree terms with you in writing before it supplies staff. Doing this at 6am wastes time you do not have. Agree terms with at least two agencies in advance, and keep their out-of-hours numbers on your call-down list.</p>
            <h2>5. Make a one-page handover sheet</h2>
            <p>Any worker who is new to your service needs the same basics: fire exits and procedures, who to ask for help, emergency numbers, key risks for the people they will support, and where to find care plans. One page, ready to hand over.</p>
            <h2>6. Block book the gaps you can see</h2>
            <p>If the same shift is short every week, book it in advance with the same workers. It costs less stress, often less money, and gives the people you support a familiar face.</p>
            <h2>7. Review after every shortfall</h2>
            <p>After any shift that ran short, ask three questions. What happened? Did the plan work? What will we change? Update the plan the same week.</p>
            <div className="callout">
              <p><strong>Print this.</strong>{" "}Your plan should fit on one page: minimum staffing, the weak shifts, the call-down list, and where the handover sheet is kept.</p>
            </div>
            <section className="faq mt-6" aria-label="Questions">
              <h2>Questions</h2>
              <details>
                <summary>How many agencies should we use?</summary>
                <div>
                  <p>Two is a sensible minimum, so you are not stuck if one cannot help. More than that becomes hard to manage and harder to keep consistent staff.</p>
                </div>
              </details>
              <details>
                <summary>Is agency staff always more expensive than overtime?</summary>
                <div>
                  <p>Not always. Compare the full cost of overtime, including tiredness and the risk of losing your own staff, with an agency rate agreed in advance.</p>
                </div>
              </details>
            </section>
            <div className="sources">
              <h2 className="h4">Official source</h2>
              <ul>
                <li><a href="https://www.gov.uk/government/publications/conduct-regulations-2003-guidance-for-employment-agencies-and-employment-businesses/overview-of-the-conduct-regulations-2003" rel="noopener">Overview of the Conduct Regulations 2003</a>{" "}(GOV.UK): agencies must agree terms with clients before supplying staff</li>
              </ul>
            </div>
          </div>
          <aside className="side-card" aria-label="Book staff">
            <div className="panel panel--bg">
              <h2 className="h3">Add us to your plan</h2>
              <p>Agree terms with us now, so we are ready when you need us.</p>
              <Link to="/request-staff/" className="btn btn--primary btn--block">Request Staff</Link>
              <a href="tel:+442034888172" className="btn btn--outline btn--block mt-3">020 3488 8172</a>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
