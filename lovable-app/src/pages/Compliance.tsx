// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function Compliance() {
  return (
    <>
      <Seo title="Agency Staff Compliance & Vetting | Aviteus Healthcare" description="How Aviteus Healthcare checks nurses, healthcare assistants and support workers before they work, plus our company registrations and published policies." path="/compliance/" jsonLd={[{"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "What should I check before booking any agency worker?", "acceptedAnswer": {"@type": "Answer", "text": "Right to work, a criminal record check at the right level, references, training dates and, for nurses, the NMC register. Our checklist for care managers goes through each one."}}, {"@type": "Question", "name": "Do workers pay for their own checks or training?", "acceptedAnswer": {"@type": "Answer", "text": "Workers are never charged for finding them work. Ask us how DBS fees and training are handled."}}]}, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Compliance", "item": "https://aviteushealthcare.co.uk/compliance/"}]}]} />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">Compliance</li>
            </ol>
          </nav>
          <h1>Registrations and policies</h1>
          <p className="intro">You stay responsible for everyone who works in your service, so you should be able to see what checks were done.{" "}<span>Below are our company registrations and the policies we publish.</span></p>
        </div>
      </section>
      <section className="section section--bg">
        <div className="container split split--even">
          <div>
            <h2>Company details</h2>
            <div className="table-wrap">
              <table className="data">
                <tbody>
                  <tr>
                    <th scope="row">Legal name</th>
                    <td>Aviteus Healthcare Ltd</td>
                  </tr>
                  <tr>
                    <th scope="row">Company number</th>
                    <td><a href="https://find-and-update.company-information.service.gov.uk/company/13337393" rel="noopener">13337393</a>, registered in England and Wales</td>
                  </tr>
                  <tr>
                    <th scope="row">Registered office</th>
                    <td>Alpha House, 296 Kenton Road, Kenton, HA3 8DD</td>
                  </tr>
                  <tr>
                    <th scope="row">Incorporated</th>
                    <td>15 April 2021</td>
                  </tr>
                  <tr>
                    <th scope="row">ICO registration</th>
                    <td><a href="https://ico.org.uk/ESDWebPages/Entry/ZB303299" rel="noopener">ZB303299</a></td>
                  </tr>
                  <tr>
                    <th scope="row">Frameworks</th>
                    <td>HealthTrust Europe, NHS Wales</td>
                  </tr>
                  <tr>
                    <th scope="row">Cyber security</th>
                    <td>Cyber Essentials certified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2>Published policies</h2>
            <ul className="docs">
              <li><a href="/files/Modern-Slavery-Aviteus%20Healthcare%20LTD.pdf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>Modern slavery statement{" "}<span>PDF</span></a></li>
              <li><a href="/files/PPN-0621-Carbon-Reduction-Plan-Aviteus.pdf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>Carbon reduction plan, signed January 2025{" "}<span>PDF</span></a></li>
              <li><a href="/files/cyber-essentials-certificate.pdf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>Cyber Essentials certificate{" "}<span>PDF</span></a></li>
            </ul>
            <p className="small muted mt-5">Our carbon reduction plan reports total emissions of 493 tonnes CO2e in 2022 and 348 tonnes in 2024, and commits us to net zero by 2045.</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <h2>Compliance questions</h2>
          <div className="faq mt-5">
            <details>
              <summary>What should I check before booking any agency worker?</summary>
              <div>
                <p>Right to work, a criminal record check at the right level, references, training dates and, for nurses, the NMC register. Our{" "}<Link to="/resources/checks-before-booking-agency-staff/">checklist for care managers</Link>{" "}goes through each one.</p>
              </div>
            </details>
            <details>
              <summary>Do workers pay for their own checks or training?</summary>
              <div>
                <p>Workers are never charged for finding them work. Ask us how DBS fees and training are handled.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
