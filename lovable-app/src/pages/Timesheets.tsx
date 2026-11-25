// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function Timesheets() {
  return (
    <>
      <Seo title="Timesheets for Aviteus Workers | Aviteus Healthcare" description="Download the Aviteus Healthcare agency worker timesheet and find out how to submit it." path="/candidates/timesheet/" />
      <section className="page-head">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/candidates/">Find work</Link></li>
              <li aria-current="page">Timesheets</li>
            </ol>
          </nav>
          <h1>Timesheets</h1>
          <p className="intro">Ask the nurse or manager in charge to sign your timesheet at the end of every shift. We can't pay hours that haven't been signed for.</p>
          <div className="btn-row">
            <a href="/files/TIMESHEET_&_Assesment_Aviteus_Healthcare.pdf" className="btn btn--primary btn--lg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>Download the timesheet (PDF)</a>
            <a href="https://register.aviteushealthcare.co.uk/" className="btn btn--outline btn--lg" rel="noopener">Worker portal</a>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <h2>Before you send it</h2>
          <ul className="ticks">
            <li>Every shift has a start time, finish time and break</li>
            <li>The person in charge has signed and printed their name</li>
            <li>The photo or scan is clear, with nothing cut off</li>
          </ul>
          <p>Your consultant will tell you the weekly deadline. For questions about pay, use the{" "}<Link to="/contact-us/">contact form</Link>{" "}and choose "Timesheet or pay".</p>
        </div>
      </section>
    </>
  );
}
