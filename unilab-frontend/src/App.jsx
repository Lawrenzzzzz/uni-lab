import { useEffect, useState } from "react";
import "./App.css";
import { NAV_LINKS, SERVICES, DEPARTMENTS } from "./data.jsx";
import { useReveal } from "./useReveal";

/* ----------------------------------------------------------------
   Header
------------------------------------------------------------------- */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 40);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
  }, [navOpen]);

  const closeNav = () => setNavOpen(false);

  return (
    <>
      <header id="siteHeader" className={scrolled ? "scrolled" : ""}>
        <div className="wrap nav-inner">
          <a href="#top" className="brand">
            <span className="brand-mark"></span>
            <span className="brand-word">UNI-Lab</span>
          </a>

          <nav className={`links${navOpen ? " open" : ""}`} id="navLinks">
            {NAV_LINKS.map((link, i) => (
              <a key={link.href} href={link.href} className={i === 0 ? "active" : ""} onClick={closeNav}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-right">
            <a href="#" className="btn btn-primary">Student Portal</a>
            <button
              className={`burger${navOpen ? " open" : ""}`}
              aria-label="Toggle menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((o) => !o)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`nav-backdrop${navOpen ? " open" : ""}`} onClick={closeNav}></div>
    </>
  );
}

/* ----------------------------------------------------------------
   Hero
------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d2247" />
              <stop offset="55%" stopColor="#0a1a37" />
              <stop offset="100%" stopColor="#060d1c" />
            </linearGradient>
            <radialGradient id="sun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f2c774" stopOpacity=".9" />
              <stop offset="100%" stopColor="#f2c774" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#182f57" />
              <stop offset="100%" stopColor="#0c1a35" />
            </linearGradient>
          </defs>
          <rect width="1440" height="900" fill="url(#sky)" />
          <circle cx="520" cy="330" r="220" fill="url(#sun)" />
          <g opacity=".5" fill="#101f3f">
            <rect x="0" y="520" width="120" height="220" />
            <rect x="130" y="480" width="90" height="260" />
            <rect x="1180" y="500" width="110" height="240" />
            <rect x="1300" y="460" width="140" height="280" />
          </g>
          <g fill="url(#bld)">
            <rect x="180" y="560" width="1100" height="340" />
            <rect x="220" y="480" width="140" height="120" />
            <rect x="900" y="480" width="140" height="120" />
            <polygon points="290,480 220,420 360,420" />
            <polygon points="970,480 900,420 1040,420" />
            <rect x="600" y="300" width="130" height="280" />
            <polygon points="665,300 600,190 730,190" />
            <rect x="650" y="150" width="30" height="60" />
            <polygon points="665,150 650,110 680,110" />
          </g>
          <g fill="#f2c774" opacity=".35">
            <rect x="260" y="620" width="16" height="26" />
            <rect x="310" y="620" width="16" height="26" />
            <rect x="360" y="620" width="16" height="26" />
            <rect x="1000" y="620" width="16" height="26" />
            <rect x="1050" y="620" width="16" height="26" />
            <rect x="630" y="360" width="18" height="30" />
            <rect x="680" y="360" width="18" height="30" />
          </g>
          <g fill="#050b18">
            <ellipse cx="1320" cy="760" rx="140" ry="180" />
            <rect x="1300" y="820" width="40" height="90" />
            <ellipse cx="60" cy="800" rx="120" ry="150" />
          </g>
          <rect x="0" y="860" width="1440" height="40" fill="#050b18" />
        </svg>
      </div>
      <div className="hero-scrim"></div>
      <div className="wrap hero-content">
        <p className="eyebrow">UNI-Lab · EST. 2026</p>
        <h1>Where heritage meets<br />the cutting <em>edge.</em></h1>
        <p>Welcome to your academic home. Access courses, research repositories, grades, dynamic campus announcements, and structural support networks from one centralized modern hub.</p>
        <div className="hero-ctas">
          <a href="#services" className="btn btn-primary">Apply Now</a>
          <a href="#departments" className="btn btn-outline">Inquire</a>
        </div>
      </div>
      <div className="scroll-cue"><span className="line"></span> SCROLL</div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Services
------------------------------------------------------------------- */

function Services() {
  const { register, visible } = useReveal(SERVICES.length);

  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Student Utilities</p>
          <h2>Essential Campus Services</h2>
        </div>
        <div className="service-grid">
          {SERVICES.map((s, i) => (
            <div key={s.title} ref={register} className={`service-card${visible[i] ? " in" : ""}`}>
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <a href="#" className="access-link">
                Access Hub
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Departments
------------------------------------------------------------------- */

function Departments() {
  const { register, visible } = useReveal(DEPARTMENTS.length);

  return (
    <section className="departments" id="departments">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Areas of Study</p>
          <h2>Featured Departments &amp; Facilities</h2>
          <p>Oakridge excels at merging classical humanities research with progressive technology incubation.</p>
        </div>
        <div className="dept-grid">
          {DEPARTMENTS.map((d, i) => (
            <div key={d.title} ref={register} className={`dept-card${visible[i] ? " in" : ""}`}>
              <div className="dept-media">{d.media}</div>
              <div className="dept-body">
                <h3>{d.title}</h3>
                <span className="dept-dean">{d.dean}</span>
                <p>{d.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Footer
------------------------------------------------------------------- */

function Footer() {
  return <footer>© 2026 UNI-Lab — 220 COLLEGE HILL ROAD</footer>;
}

/* ----------------------------------------------------------------
   App
------------------------------------------------------------------- */

export default function App() {
  return (
    <div className="unilab-site">
      <Header />
      <Hero />
      <Services />
      <Departments />
      <Footer />
    </div>
  );
}