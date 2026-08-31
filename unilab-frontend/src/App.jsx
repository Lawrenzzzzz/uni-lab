import { useEffect, useRef, useState } from "react";

/* ----------------------------------------------------------------
   Data
------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "About" },
  { href: "#departments", label: "Contact" },
];

const SERVICES = [
  {
    title: "Registrar & Grades",
    body: "View academic transcripts, structural credit updates, register for upcoming terms, and manage tuition schedules.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10L12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
  {
    title: "Digital Library",
    body: "Access over 450,000 academic journals, peer-reviewed articles, reserve study pods, and query expert research librarians.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),
  },
  {
    title: "Admissions Hub",
    body: "Submit critical transfer paperwork, track application lifecycles, and check scholarship eligibility status.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    ),
  },
  {
    title: "Campus Calendar",
    body: "Never miss lectures, academic symposia, midterms, or major campus athletic events.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

const DEPARTMENTS = [
  {
    title: "School of Computing",
    dean: "Dean: Dr. Aris Thorne",
    body: "Leading the paradigm shift in hardware-software co-design, artificial neural networks, and secure distributed ledger technologies.",
    media: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#13294f" />
            <stop offset="100%" stopColor="#081326" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#g1)" />
        <g stroke="#f2a83e" strokeWidth="1" opacity=".5">
          <line x1="0" y1="220" x2="400" y2="220" />
          <line x1="60" y1="220" x2="60" y2="300" />
          <line x1="340" y1="220" x2="340" y2="300" />
        </g>
        <ellipse cx="200" cy="230" rx="150" ry="18" fill="#0d2247" />
        <g fill="#f2a83e" opacity=".85">
          <rect x="120" y="150" width="18" height="70" rx="2" />
          <rect x="190" y="140" width="18" height="80" rx="2" />
          <rect x="260" y="160" width="18" height="60" rx="2" />
        </g>
        <circle cx="200" cy="90" r="34" fill="none" stroke="#f2a83e" strokeWidth="1.5" opacity=".5" />
        <circle cx="200" cy="90" r="4" fill="#f2a83e" />
      </svg>
    ),
  },
  {
    title: "Humanities & Philosophy",
    dean: "Dean: Prof. Beatrice Vance",
    body: "Exclusively structured to foster deep ethical inquiry, historical critical analysis, and dialectical synthesis in a global context.",
    media: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2013" />
            <stop offset="100%" stopColor="#120e08" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#g2)" />
        <g fill="#c98a3e" opacity=".7">
          <rect x="30" y="60" width="60" height="180" />
          <rect x="310" y="60" width="60" height="180" />
        </g>
        <g stroke="#f2c774" strokeWidth="2" opacity=".8">
          <line x1="40" y1="70" x2="80" y2="70" />
          <line x1="40" y1="90" x2="80" y2="90" />
          <line x1="40" y1="110" x2="80" y2="110" />
          <line x1="40" y1="130" x2="80" y2="130" />
          <line x1="320" y1="70" x2="360" y2="70" />
          <line x1="320" y1="90" x2="360" y2="90" />
          <line x1="320" y1="110" x2="360" y2="110" />
          <line x1="320" y1="130" x2="360" y2="130" />
        </g>
        <rect x="140" y="150" width="120" height="12" fill="#3a2c18" />
        <rect x="150" y="162" width="100" height="8" fill="#3a2c18" />
        <circle cx="200" cy="60" r="24" fill="none" stroke="#f2c774" strokeWidth="1.5" opacity=".6" />
      </svg>
    ),
  },
  {
    title: "School of Business",
    dean: "Dean: Dr. Marcus Stirling",
    body: "Empowering next-generation executives with empirical econometric models, behavioral consumer labs, and international venture pipelines.",
    media: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2c4a" />
            <stop offset="100%" stopColor="#0a1626" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#g3)" />
        <g fill="#38547e" opacity=".85">
          <rect x="90" y="40" width="90" height="220" />
          <rect x="200" y="80" width="90" height="180" />
        </g>
        <g fill="#8fb3dd" opacity=".35">
          <rect x="100" y="55" width="14" height="16" /><rect x="122" y="55" width="14" height="16" /><rect x="144" y="55" width="14" height="16" />
          <rect x="100" y="85" width="14" height="16" /><rect x="122" y="85" width="14" height="16" /><rect x="144" y="85" width="14" height="16" />
          <rect x="100" y="115" width="14" height="16" /><rect x="122" y="115" width="14" height="16" /><rect x="144" y="115" width="14" height="16" />
          <rect x="210" y="95" width="14" height="16" /><rect x="232" y="95" width="14" height="16" /><rect x="254" y="95" width="14" height="16" />
          <rect x="210" y="125" width="14" height="16" /><rect x="232" y="125" width="14" height="16" /><rect x="254" y="125" width="14" height="16" />
        </g>
        <rect x="0" y="255" width="400" height="45" fill="#08111e" />
      </svg>
    ),
  },
];

/* ----------------------------------------------------------------
   Hook: fade/rise a card in once it crosses the viewport,
   staggered by its index within the grid (mirrors script.js)
------------------------------------------------------------------- */

function useReveal(count) {
  const refs = useRef([]);
  const [visible, setVisible] = useState(() => Array(count).fill(false));
  refs.current = [];

  const register = (el) => {
    if (el && !refs.current.includes(el)) refs.current.push(el);
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = refs.current.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 90}ms`;
          setVisible((v) => {
            const next = [...v];
            next[index] = true;
            return next;
          });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    refs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [count]);

  return { register, visible };
}

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
      <style>{CSS}</style>
      <Header />
      <Hero />
      <Services />
      <Departments />
      <Footer />
    </div>
  );
}

/* ----------------------------------------------------------------
   Styles — ported 1:1 from styles.css, scoped under .unilab-site
------------------------------------------------------------------- */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

.unilab-site{
  --navy-950:#081326; --navy-900:#0b1b3a; --navy-800:#13294f; --navy-700:#1c3a68;
  --amber-500:#f2a83e; --amber-600:#e0932a;
  --paper:#f7f7f4; --paper-card:#ffffff;
  --ink-900:#161b26; --ink-600:#565f70; --ink-400:#8993a4;
  --hairline:#e4e2da; --radius:2px;
  --ease:cubic-bezier(.19,1,.22,1);
  --ease-fast:cubic-bezier(.4,0,.2,1);
  font-family:'Inter',sans-serif;
  color:var(--ink-900);
  background:var(--paper);
  -webkit-font-smoothing:antialiased;
  position:relative;
}
.unilab-site *{box-sizing:border-box;}
.unilab-site img{max-width:100%;display:block;}
.unilab-site a{color:inherit;text-decoration:none;}
.unilab-site .eyebrow{
  font-family:'Space Mono',monospace; font-size:11px; letter-spacing:.16em;
  text-transform:uppercase; display:flex; align-items:center; gap:8px; font-weight:700;
}
.unilab-site .eyebrow::before{content:"";width:14px;height:2px;background:var(--amber-500);display:inline-block;}
.unilab-site h1,.unilab-site h2,.unilab-site h3{font-family:'Playfair Display',serif;margin:0;letter-spacing:-.01em;}
.unilab-site .wrap{max-width:1240px;margin:0 auto;padding:0 40px;}
.unilab-site .btn{
  display:inline-flex; align-items:center; gap:8px; padding:14px 26px;
  font-family:'Inter',sans-serif; font-weight:600; font-size:14px; letter-spacing:.01em;
  border-radius:var(--radius); border:1px solid transparent; cursor:pointer;
  transition:transform .35s var(--ease), background .3s var(--ease-fast), border-color .3s var(--ease-fast), color .3s var(--ease-fast), box-shadow .35s var(--ease);
}
.unilab-site .btn-primary{background:var(--amber-500);color:var(--navy-950);}
.unilab-site .btn-primary:hover{background:var(--amber-600); transform:translateY(-2px); box-shadow:0 10px 24px -8px rgba(224,147,42,.55);}
.unilab-site .btn-primary:active{transform:translateY(0); transition-duration:.1s;}
.unilab-site .btn-outline{background:transparent;border-color:rgba(255,255,255,.55);color:#fff;}
.unilab-site .btn-outline:hover{border-color:#fff; background:rgba(255,255,255,.08); transform:translateY(-2px);}
.unilab-site .btn-outline:active{transform:translateY(0); transition-duration:.1s;}

.unilab-site header{
  position:sticky; top:0; left:0; right:0; z-index:50;
  background:linear-gradient(to bottom, rgba(8,19,38,.92), rgba(8,19,38,0));
  padding:22px 0;
  transition:background .5s var(--ease), padding .5s var(--ease), box-shadow .5s var(--ease);
}
.unilab-site header.scrolled{background:var(--navy-950); padding:14px 0; box-shadow:0 8px 24px rgba(0,0,0,.25);}
.unilab-site .nav-inner{display:flex; align-items:center; justify-content:space-between; gap:24px;}
.unilab-site .brand{display:flex; align-items:center; gap:10px; color:#fff;}
.unilab-site .brand-mark{width:15px;height:15px;background:var(--amber-500);flex-shrink:0;transition:transform .4s var(--ease);}
.unilab-site .brand:hover .brand-mark{transform:rotate(90deg);}
.unilab-site .brand-word{font-family:'Space Mono',monospace;font-size:15px;letter-spacing:.14em;font-weight:700;}
.unilab-site nav.links{display:flex; align-items:center; gap:36px;}
.unilab-site nav.links a{color:rgba(255,255,255,.82); font-size:14px; font-weight:500; position:relative; padding:4px 0; transition:color .3s var(--ease-fast);}
.unilab-site nav.links a.active{color:#fff;}
.unilab-site nav.links a::after{
  content:""; position:absolute; left:0; right:0; bottom:-4px; height:1px; background:var(--amber-500);
  transform:scaleX(0); transform-origin:left; transition:transform .4s var(--ease);
}
.unilab-site nav.links a:hover{color:#fff;}
.unilab-site nav.links a.active::after, .unilab-site nav.links a:hover::after{transform:scaleX(1);}
.unilab-site .nav-right{display:flex; align-items:center; gap:20px;}
.unilab-site .burger{display:none; flex-direction:column; gap:5px; background:none;border:none;cursor:pointer; padding:4px; position:relative; z-index:61;}
.unilab-site .burger span{width:22px;height:2px;background:#fff;display:block; transition:transform .4s var(--ease), opacity .3s var(--ease-fast);}
.unilab-site .burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.unilab-site .burger.open span:nth-child(2){opacity:0; transform:scaleX(0);}
.unilab-site .burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
.unilab-site .nav-backdrop{
  position:fixed; inset:0; background:rgba(5,10,20,.5); backdrop-filter:blur(2px);
  z-index:55; opacity:0; pointer-events:none; transition:opacity .4s var(--ease);
}
.unilab-site .nav-backdrop.open{opacity:1; pointer-events:auto;}

.unilab-site .hero{position:relative; min-height:600px; display:flex; align-items:center; background:var(--navy-950); overflow:hidden;}
.unilab-site .hero-bg{position:absolute; inset:0; z-index:0;}
.unilab-site .hero-bg svg{width:100%; height:100%; display:block;}
.unilab-site .hero-scrim{
  position:absolute; inset:0;
  background:
    radial-gradient(ellipse 900px 700px at 12% 30%, rgba(8,19,38,.35), transparent 60%),
    linear-gradient(180deg, rgba(6,13,28,.55) 0%, rgba(6,13,28,.72) 55%, rgba(6,13,28,.92) 100%);
  z-index:1;
}
.unilab-site .hero-content{position:relative; z-index:2; padding:90px 0 60px; max-width:760px; margin-left:30px;}
.unilab-site .hero-content .eyebrow{color:var(--amber-500); margin-bottom:22px;}
.unilab-site .hero h1{color:#fff; font-size:clamp(38px, 5.4vw, 68px); line-height:1.06; font-weight:600; margin-bottom:26px;}
.unilab-site .hero h1 em{font-style:italic; color:var(--amber-500);}
.unilab-site .hero p{color:rgba(255,255,255,.72); font-size:17px; line-height:1.65; max-width:600px; margin-bottom:38px;}
.unilab-site .hero-ctas{display:flex; gap:16px; flex-wrap:wrap;}
.unilab-site .scroll-cue{
  position:absolute; bottom:34px; left:40px; z-index:2; display:flex; align-items:center; gap:12px;
  color:rgba(255,255,255,.5); font-family:'Space Mono',monospace; font-size:11px; letter-spacing:.14em;
}
.unilab-site .scroll-cue .line{width:1px; height:34px; background:linear-gradient(to bottom, rgba(255,255,255,.6), transparent); animation:unilab-scrollpulse 2.2s ease-in-out infinite;}
@keyframes unilab-scrollpulse{0%,100%{transform:scaleY(1); opacity:.7;} 50%{transform:scaleY(.6); opacity:.3;}}

.unilab-site section{padding:110px 0;}
.unilab-site .section-head{max-width:640px; margin-bottom:56px;}
.unilab-site .section-head .eyebrow{color:var(--amber-600); margin-bottom:16px;}
.unilab-site .section-head h2{font-size:clamp(30px,3.4vw,42px); color:var(--ink-900); font-weight:600; margin-bottom:14px;}
.unilab-site .section-head p{color:var(--ink-600); font-size:16px; line-height:1.6;}

.unilab-site .services{background:var(--paper);}
.unilab-site .service-grid{display:grid; grid-template-columns:repeat(4, 1fr); gap:1px; background:var(--hairline); border:1px solid var(--hairline);}
.unilab-site .service-card{
  background:var(--paper-card); padding:36px 30px; opacity:0; transform:translateY(28px);
  transition:opacity .8s var(--ease), transform .8s var(--ease), background .3s var(--ease-fast);
}
.unilab-site .service-card.in{opacity:1; transform:translateY(0);}
.unilab-site .service-card:hover{background:#fbfaf6;}
.unilab-site .service-icon{
  width:46px;height:46px; border-radius:var(--radius); background:rgba(242,168,62,.14);
  display:flex; align-items:center; justify-content:center; margin-bottom:22px;
  transition:transform .4s var(--ease), background .3s var(--ease-fast);
}
.unilab-site .service-card:hover .service-icon{transform:scale(1.08); background:rgba(242,168,62,.22);}
.unilab-site .service-icon svg{width:22px;height:22px;stroke:var(--amber-600);}
.unilab-site .service-card h3{font-size:18px; font-weight:600; color:var(--ink-900); margin-bottom:10px;}
.unilab-site .service-card p{font-size:14px; line-height:1.6; color:var(--ink-600); margin-bottom:20px; min-height:96px;}
.unilab-site .access-link{display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--navy-900); letter-spacing:.02em; transition:gap .3s var(--ease), color .3s var(--ease-fast);}
.unilab-site .access-link svg{width:13px;height:13px; transition:transform .35s var(--ease);}
.unilab-site .service-card:hover .access-link{color:var(--amber-600);}
.unilab-site .service-card:hover .access-link svg{transform:translateX(4px);}

.unilab-site .departments{background:var(--navy-950);}
.unilab-site .departments .section-head .eyebrow{color:var(--amber-500);}
.unilab-site .departments .section-head h2{color:#fff;}
.unilab-site .departments .section-head p{color:rgba(255,255,255,.6);}
.unilab-site .dept-grid{display:grid; grid-template-columns:repeat(3, 1fr); gap:28px;}
.unilab-site .dept-card{
  background:var(--navy-900); border:1px solid var(--navy-700); overflow:hidden;
  opacity:0; transform:translateY(28px);
  transition:opacity .8s var(--ease), transform .8s var(--ease), border-color .3s var(--ease-fast), box-shadow .4s var(--ease);
}
.unilab-site .dept-card.in{opacity:1; transform:translateY(0);}
.unilab-site .dept-card:hover{border-color:var(--amber-500); box-shadow:0 20px 40px -20px rgba(0,0,0,.5);}
.unilab-site .dept-media{aspect-ratio:4/3; position:relative; overflow:hidden;}
.unilab-site .dept-media svg{width:100%;height:100%; display:block; transition:transform .6s var(--ease);}
.unilab-site .dept-card:hover .dept-media svg{transform:scale(1.06);}
.unilab-site .dept-body{padding:26px 26px 30px;}
.unilab-site .dept-body h3{color:#fff; font-size:20px; font-weight:600; margin-bottom:6px;}
.unilab-site .dept-dean{font-family:'Space Mono',monospace; font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--amber-500); margin-bottom:14px; display:block;}
.unilab-site .dept-body p{font-size:14px; line-height:1.65; color:rgba(255,255,255,.62);}

.unilab-site footer{
  background:var(--navy-950); border-top:1px solid var(--navy-700); padding:28px 0;
  text-align:center; font-size:12.5px; color:rgba(255,255,255,.4); font-family:'Space Mono',monospace; letter-spacing:.04em;
}

@media (max-width:960px){
  .unilab-site .service-grid{grid-template-columns:repeat(2,1fr);}
  .unilab-site .dept-grid{grid-template-columns:1fr; gap:24px;}
  .unilab-site .wrap{padding:0 24px;}
}
@media (max-width:760px){
  .unilab-site nav.links{
    position:fixed; top:0; right:0; bottom:0; width:78%; max-width:320px; background:var(--navy-950);
    flex-direction:column; align-items:flex-start; justify-content:center; gap:28px; padding:0 40px;
    transform:translateX(100%); transition:transform .5s var(--ease); z-index:60;
  }
  .unilab-site nav.links.open{transform:translateX(0);}
  .unilab-site .burger{display:flex;}
  .unilab-site .nav-right .btn-primary{display:none;}
  .unilab-site .service-grid{grid-template-columns:1fr;}
  .unilab-site section{padding:76px 0;}
  .unilab-site .hero-content{padding-top:70px;}
  .unilab-site .scroll-cue{display:none;}
}
@media (prefers-reduced-motion: reduce){
  .unilab-site *{animation:none !important; transition:none !important;}
  .unilab-site .service-card, .unilab-site .dept-card{opacity:1; transform:none;}
}
.unilab-site :focus-visible{outline:2px solid var(--amber-500); outline-offset:2px;}
`;