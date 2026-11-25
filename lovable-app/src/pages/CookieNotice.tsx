// Generated from the approved site copy by tools/html_to_react.py.
// Safe to edit by hand once the site lives in Lovable.
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";

export default function CookieNotice() {
  return (
    <>
      <Seo title="Cookie Notice | Aviteus Healthcare" description="This website does not use cookies or similar technologies to track you. Here is what it does and does not store." path="/cookie-policy/" jsonLd={[{"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviteushealthcare.co.uk/"}, {"@type": "ListItem", "position": 2, "name": "Cookie notice", "item": "https://aviteushealthcare.co.uk/cookie-policy/"}]}]} />
      <section className="section">
        <div className="container prose">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li aria-current="page">Cookie notice</li>
            </ol>
          </nav>
          <h1>Cookie notice</h1>
          <p className="intro">This website does not use cookies, and it does not store or read anything else on your device to track you.</p>
          <h2>What that means</h2>
          <ul>
            <li>No analytics or tracking cookies</li>
            <li>No cookie banner, because there is nothing to agree to</li>
            <li>Our fonts are stored on our own server, so your browser does not contact Google or other font services</li>
            <li>Our forms send your answers to us when you press send. Nothing is saved in your browser</li>
          </ul>
          <p>If we ever add analytics, we will update this notice and ask for your permission first.</p>
          <h2>Things we deliberately do not use</h2>
          <ul>
            <li>Advertising or tracking pixels</li>
            <li>Embedded videos or social media feeds</li>
            <li>Fonts, maps or scripts loaded from other companies' servers</li>
          </ul>
          <p>Links to Google Maps, WhatsApp, LinkedIn, Facebook and Instagram take you to those sites. Their own cookie rules apply once you are there.</p>
          <h2>Questions</h2>
          <p>Email{" "}<a href="mailto:info@aviteushealthcare.co.uk">info@aviteushealthcare.co.uk</a>. See also our{" "}<Link to="/privacy-policy/">privacy notice</Link>.</p>
        </div>
      </section>
    </>
  );
}
