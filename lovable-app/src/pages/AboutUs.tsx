// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function AboutUs() {
  return (
    <>
      <Seo title="About Aviteus Healthcare | Staffing Agency in Harrow" description="Aviteus Healthcare Ltd is a healthcare staffing agency based in Harrow, North West London, supplying nurses and care staff to care providers since 2021." path="/about-us/" jsonLd={[{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "About us", "item": "https://aviteushealthcare.co.uk/about-us/"}]}]} />
      <section className="page-head">
        <div className="container page-head__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><Link to="/">Home</Link></li>
                <li aria-current="page">About us</li>
              </ol>
            </nav>
            <h1>About Aviteus Healthcare</h1>
            <p className="intro">We set up in April 2021 as a small nursing agency in Harrow. Today we supply nurses, healthcare assistants and support workers to care homes, supported living and mental health services<span>{" "}all over the UK</span>.</p>
          </div>
          <dl className="facts panel">
            <dt>Founded</dt>
            <dd>April 2021</dd>
            <dt>Office</dt>
            <dd>Alpha House, Kenton Road, Harrow</dd>
            <dt>Company no.</dt>
            <dd>13337393</dd>
            <dt>Director</dt>
            <dd>Vikas Pandey</dd>
          </dl>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div className="measure">
            <h2>Why we do it the way we do</h2>
            <p>Talk to any care manager about agencies and you'll hear the same three complaints. The phone rings out when you need it most. The person who turns up has never worked anywhere like yours. And when the inspector asks how that person was checked, nobody can find the paperwork.</p>
            <p>We built Aviteus around fixing those three things. One number for bookings, answered by people who know your service. Workers chosen for the setting, not just the job title. And if a shift is going to be hard to fill, we say so early, so you can make a plan.</p>
            <p>We look after the people who work for us, too. Agency work only works for a care service when the workers are treated well enough to want to come back.</p>
          </div>
          <div className="panel panel--bg">
            <h2 className="h3">How we run the business</h2>
            <ul className="ticks mb-0">
              <li><strong>Net zero by 2045.</strong>{" "}Our published carbon reduction plan shows emissions falling from 493 to 348 tonnes CO2e between 2022 and 2024.</li>
              <li><strong>Modern slavery.</strong>{" "}We publish a statement setting out our approach.</li>
              <li><strong>Data protection.</strong>{" "}Registered with the Information Commissioner's Office.</li>
              <li><strong>No fees for workers.</strong>{" "}We never charge anyone for finding them work.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split split--even">
          <div>
            <h2>Working in our office</h2>
            <p>We're sometimes looking for recruitment consultants and compliance staff to work from Kenton Road. If that interests you, send your CV to{" "}<a href="mailto:info@aviteushealthcare.co.uk?subject=Office%20careers">info@aviteushealthcare.co.uk</a>.</p>
          </div>
          <div>
            <h2>Our registrations</h2>
            <p>Company number, ICO registration and published policies are all on our{" "}<Link to="/compliance/">compliance page</Link>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
