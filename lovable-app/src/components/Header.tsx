import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandLink from "@/components/BrandLink";

type Section = "hire" | "work" | "compliance" | "about" | "resources" | "contact" | "";

function sectionFor(path: string): Section {
  if (/^\/(hire-staff|sectors|request-staff|thank-you\/employer)/.test(path)) return "hire";
  if (/^\/(candidates|jobs|thank-you\/candidate)/.test(path)) return "work";
  if (path.startsWith("/compliance")) return "compliance";
  if (path.startsWith("/about-us")) return "about";
  if (path.startsWith("/resources")) return "resources";
  if (/^\/(contact-us|thank-you\/message|enquiry-problem)/.test(path)) return "contact";
  return "";
}

const current = (on: boolean) => (on ? { "aria-current": "page" as const } : {});

export default function Header() {
  const { pathname } = useLocation();
  const section = sectionFor(pathname);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  // Close menus after every page change, and drop focus out of the dropdown.
  useEffect(() => {
    setOpenDrop(null);
    setMenuOpen(false);
    const el = document.activeElement as HTMLElement | null;
    if (el && el.closest(".menu")) el.blur();
  }, [pathname]);

  // Mobile menu: lock page scroll, move focus, close on Escape.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) closeRef.current?.focus();
    else if (!firstRender.current) toggleRef.current?.focus({ preventScroll: true });
    firstRender.current = false;
    if (!menuOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const dropProps = (id: string) => ({
    className: openDrop === id ? "is-open" : undefined,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Escape") setOpenDrop(null);
    },
    onBlur: (e: React.FocusEvent<HTMLLIElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenDrop(null);
    },
  });
  const dropButton = (id: string, label: string, on: boolean) => (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={openDrop === id}
      onClick={() => setOpenDrop(openDrop === id ? null : id)}
      {...current(on)}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>
            <span>Staffing line, day or night:</span> <a href="tel:+442034888172">020 3488 8172</a>
          </span>
          <div className="topbar__right">
            <Link to="/candidates/register/">Register for work</Link>
            <Link to="/candidates/timesheet/">Timesheets</Link>
            <a href="mailto:info@aviteushealthcare.co.uk">info@aviteushealthcare.co.uk</a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container">
          <BrandLink />

          <ul className="menu" aria-label="Main menu">
            <li {...dropProps("hire")}>
              {dropButton("hire", "Hire Staff", section === "hire")}
              <div className="dropdown dropdown--wide">
                <div>
                  <div className="dropdown__label">Services</div>
                  <Link to="/hire-staff/emergency-cover/"><strong>Urgent and same-day cover</strong><span>Someone needed today or tonight</span></Link>
                  <Link to="/hire-staff/temporary-staffing/"><strong>Temporary staffing</strong><span>Shifts, block bookings, long lines</span></Link>
                  <Link to="/hire-staff/nursing-staff/"><strong>Agency nurses</strong><span>RGN, RMN and RNLD cover</span></Link>
                  <Link to="/hire-staff/"><strong>All staffing services</strong><span>Overview and prices</span></Link>
                </div>
                <div>
                  <div className="dropdown__label">Sectors</div>
                  <Link to="/sectors/care-homes/"><strong>Care and nursing homes</strong><span>Residential, nursing and dementia care</span></Link>
                  <Link to="/sectors/supported-living/"><strong>Supported living</strong><span>Learning disability and autism</span></Link>
                  <Link to="/sectors/mental-health/"><strong>Mental health</strong><span>Hospitals, rehab and community</span></Link>
                </div>
              </div>
            </li>
            <li {...dropProps("work")}>
              {dropButton("work", "Find Work", section === "work")}
              <div className="dropdown">
                <Link to="/candidates/"><strong>Work with Aviteus</strong><span>Shifts, pay and registering</span></Link>
                <Link to="/jobs/healthcare-assistant/"><strong>Healthcare assistant work</strong></Link>
                <Link to="/jobs/support-worker/"><strong>Support worker work</strong></Link>
                <Link to="/jobs/registered-nurse/"><strong>Agency nurse work</strong></Link>
                <Link to="/candidates/register/"><strong>Register with us</strong><span>Steps and documents</span></Link>
              </div>
            </li>
            <li><Link to="/compliance/" {...current(section === "compliance")}>Compliance</Link></li>
            <li><Link to="/about-us/" {...current(section === "about")}>About</Link></li>
            <li><Link to="/resources/" {...current(section === "resources")}>Guides</Link></li>
            <li><Link to="/contact-us/" {...current(section === "contact")}>Contact</Link></li>
          </ul>

          <div className="header-cta">
            <Link className="btn btn--outline" to="/candidates/">Find Work</Link>
            <Link className="btn btn--primary" to="/request-staff/">Request Staff</Link>
          </div>
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span aria-hidden="true"></span>
            <b className="sr-only">Open menu</b>
          </button>
        </div>
      </header>

      <div
        className="mobile-menu"
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!menuOpen}
        onClick={(e) => {
          // close straight away when a link is tapped, before the next page loads
          if ((e.target as HTMLElement).closest("a")) setMenuOpen(false);
        }}
      >
        <div className="mobile-menu__top">
          <Link className="brand" to="/"><span className="brand-text">Aviteus <b>Healthcare</b></span></Link>
          <button ref={closeRef} className="mobile-menu__close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            &times;
          </button>
        </div>
        <div className="btn-row">
          <Link className="btn btn--primary" to="/request-staff/">Request Staff</Link>
          <Link className="btn btn--outline" to="/candidates/">Find Work</Link>
        </div>
        <h2 className="mobile-menu__label">Hire staff</h2>
        <ul>
          <li><Link to="/hire-staff/">All staffing services</Link></li>
          <li><Link to="/hire-staff/emergency-cover/">Urgent and same-day cover</Link></li>
          <li><Link to="/hire-staff/temporary-staffing/">Temporary staffing</Link></li>
          <li><Link to="/hire-staff/nursing-staff/">Agency nurses</Link></li>
          <li><Link to="/sectors/care-homes/">Care and nursing homes</Link></li>
          <li><Link to="/sectors/supported-living/">Supported living</Link></li>
          <li><Link to="/sectors/mental-health/">Mental health</Link></li>
        </ul>
        <h2 className="mobile-menu__label">Find work</h2>
        <ul>
          <li><Link to="/candidates/">Work with Aviteus</Link></li>
          <li><Link to="/jobs/">Roles we recruit</Link></li>
          <li><Link to="/candidates/register/">Register with us</Link></li>
          <li><Link to="/candidates/timesheet/">Timesheets</Link></li>
        </ul>
        <h2 className="mobile-menu__label">Company</h2>
        <ul>
          <li><Link to="/compliance/">Compliance</Link></li>
          <li><Link to="/about-us/">About</Link></li>
          <li><Link to="/resources/">Guides</Link></li>
          <li><Link to="/contact-us/">Contact</Link></li>
        </ul>
        <div className="btn-row">
          <a className="btn btn--teal" href="tel:+442034888172">Call 020 3488 8172</a>
        </div>
      </div>
    </>
  );
}
