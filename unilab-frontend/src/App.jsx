import { useEffect, useState } from "react";
import "./App.css";
import { NAV_LINKS, SERVICES, DEPARTMENTS } from "./data.jsx";
import { useReveal } from "./useReveal";
import bgImg from "./assets/bg-img.png";
import logoImg from "./assets/unilab-logo.png";

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
            <img src={logoImg} alt="UNI-Lab Logo" className="brand-logo" />
            <span className="brand-word">UNI-Lab</span>
          </a>

          <nav className={`links${navOpen ? " open" : ""}`} id="navLinks">
            {NAV_LINKS.map((link, i) => (
              <a key={link.href} href={link.href} className={i === 0 ? "active" : ""} onClick={closeNav}>
                {link.label}
              </a>
            ))}
            <a href="#" className="btn btn-primary mobile-portal-btn" onClick={closeNav}>Student Portal</a>
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
        <img src={bgImg} alt="" />
      </div>

      <div className="hero-scrim"></div>

      <div className="wrap hero-content">
        <p className="eyebrow">UNI-Lab · EST. 2026</p>

        <h1>
          Where heritage meets<br />
          the cutting <em>edge.</em>
        </h1>

        <p>
          Welcome to your academic home. Access courses, research repositories,
          grades, dynamic campus announcements, and structural support networks
          from one centralized modern hub.
        </p>

        <div className="hero-ctas">
          <a href="#services" className="btn btn-primary">Apply Now</a>
          <a href="#departments" className="btn btn-outline">Inquire</a>
        </div>
      </div>

      <div className="scroll-cue">
        <span className="line"></span> SCROLL
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------
   Services
------------------------------------------------------------------- */

function Services() {
  const { register, visible } = useReveal(SERVICES.length);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleCard = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <section className="services" id="services">
      <div className="wrap">

        <div className="section-head">
          <p className="eyebrow">What is UNI-Lab and It's Main Function?</p>

          <h2>
            University -{" "}
            <span style={{ fontStyle: "italic" }}>
              Learning Academic Bridge
            </span>
          </h2>
        </div>

        <div className="service-grid">
          {SERVICES.map((s, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={s.title}
                ref={register}
                className={`service-card${visible[i] ? " in" : ""}${
                  isOpen ? " open" : ""
                }`}
                onClick={() => toggleCard(i)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCard(i);
                  }
                }}
              >
                <div className="card-inner">

                  <div className="service-icon">
                    {s.icon}
                  </div>

                  <h3>{s.title}</h3>

                  <div className="service-copy">

                    <p className="body-text">
                      {s.body}
                    </p>

                    <div className="service-details">
                      <p>{s.details}</p>
                    </div>

                    <a
                      href="#"
                      className="access-link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleCard(i);
                      }}
                    >
                      {isOpen ? "Show Less" : "Learn More"}

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="chevron"
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </a>

                  </div>
                </div>
              </div>
            );
          })}
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
          <p className="eyebrow">Contacts</p>
          <h2>Inquiries</h2>
          <p>If you are interested in using this platform just email us!</p>
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