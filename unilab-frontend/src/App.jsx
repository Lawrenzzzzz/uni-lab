import { useEffect, useState } from "react";
import "./App.css";
import { NAV_LINKS, SERVICES, DEPARTMENTS } from "./data.jsx";
import { useReveal } from "./useReveal";
import bgImg from "./assets/bg-img.png";
import logoImg from "./assets/unilab-logo.png";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 
import AuthModal from "./AuthModal";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ----------------------------------------------------------------
   Header
------------------------------------------------------------------- */

function Header({ onOpenAuth }) {
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
            <button
              className="btn btn-primary mobile-portal-btn"
              onClick={() => {
                closeNav();
                onOpenAuth();
              }}
            >
              Student Portal
            </button>
          </nav>

          <div className="nav-right">
            <button className="btn btn-primary" onClick={onOpenAuth}>
              Student Portal
            </button>
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
                className={`service-card${visible[i] ? " in" : ""}${isOpen ? " open" : ""}`}
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
   Map Popup Component
------------------------------------------------------------------- */

function MapPopup({ isOpen, onClose }) {
  if (!isOpen) return null;

  const position = [13.9376, 120.7327];

  return (
    <div className="map-popup-overlay" onClick={onClose}>
      <div className="map-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="map-popup-close" onClick={onClose}>×</button>
        <h3>📍 Our Location</h3>
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Marker position={position}>
            <Popup>UNI-Lab - Balayan, Batangas</Popup>
          </Marker>
        </MapContainer>
        <p className="map-popup-address">📍📍 220 College Hill Road, Balayan, Batangas</p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Email Modal Component
------------------------------------------------------------------- */

function EmailModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cc: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSending(true);

    try {
      const res = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setShowSuccess(true);
      setFormData({ name: '', email: '', cc: '', subject: '', message: '' });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content email-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <h3>📧 Send us an Email</h3>
          <p>We'll get back to you as soon as possible</p>
        </div>

        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Juan Dela Cruz"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cc">Cc</label>
            <input
              type="email"
              id="cc"
              name="cc"
              placeholder="cc@example.com (optional)"
              value={formData.cc}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Enter your subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          {errorMsg && (
            <p style={{ color: '#e0932a', fontSize: '13px', margin: 0 }}>{errorMsg}</p>
          )}

          <button type="submit" className="btn btn-primary submit-btn" disabled={sending}>
            {sending ? 'Sending...' : 'Send Message ✉️'}
          </button>
        </form>
      </div>

      <div className={`success-toast${showSuccess ? ' show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">✅</span>
          <div>
            <h4>Message sent!</h4>
            <p>Thanks for reaching out — we'll reply to your email soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ----------------------------------------------------------------
   Review Modal Component
------------------------------------------------------------------- */

function ReviewModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState(() => {
    // Load reviews from localStorage or use default
    const saved = localStorage.getItem('unilab-reviews');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Maria Santos",
        rating: 5,
        comment: "This platform is amazing! It makes tracking my classes so much easier.",
        date: "2026-08-28"
      },
      {
        id: 2,
        name: "John Dela Cruz",
        rating: 4,
        comment: "Great tool for attendance tracking. Would love to see more features added.",
        date: "2026-08-25"
      },
      {
        id: 3,
        name: "Anna Reyes",
        rating: 5,
        comment: "The schedule maker saved me so much time! Highly recommended for all students.",
        date: "2026-08-20"
      }
    ];
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('unilab-reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a star rating before submitting.');
      return;
    }

    const newReview = {
      id: Date.now(),
      name: name || 'Anonymous',
      rating: rating,
      comment: comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([newReview, ...reviews]);
    setShowSuccess(true);
    
    // Reset form
    setRating(0);
    setHoverRating(0);
    setName('');
    setComment('');
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (!isOpen) return null;

  // Star component
  const Star = ({ filled, onMouseEnter, onMouseLeave, onClick }) => (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'var(--amber-500)' : 'none'}
      stroke="var(--amber-500)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, fill 0.2s ease',
        transform: filled ? 'scale(1.1)' : 'scale(1)',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h3>⭐ Reviews & Feedback</h3>
          <p>Share your experience with UNI-Lab</p>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Your Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= (hoverRating || rating)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
              <span className="rating-label">
                {rating > 0 ? `${rating} / 5 stars` : 'Click to rate'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="review-name">Your Name (optional)</label>
            <input
              type="text"
              id="review-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="review-comment">Your Comment</label>
            <textarea
              id="review-comment"
              rows="3"
              placeholder="Write your feedback here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            Submit Review ⭐
          </button>
        </form>

        {/* Reviews Display */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h4>📝 What others are saying</h4>
            <span className="review-count">{reviews.length} reviews</span>
          </div>
          
          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to share your feedback!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          viewBox="0 0 24 24"
                          fill={star <= review.rating ? 'var(--amber-500)' : 'none'}
                          stroke="var(--amber-500)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: '16px', height: '16px' }}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <div className={`success-toast${showSuccess ? ' show' : ''}`}>
        <div className="toast-content">
          <span className="toast-icon">✅</span>
          <div>
            <h4>Thank you for your feedback!</h4>
            <p>Your review has been submitted successfully</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Departments
------------------------------------------------------------------- */

function Departments() {
  const { register, visible } = useReveal(DEPARTMENTS.length);
  const [showMap, setShowMap] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleCardClick = (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (d.title === "Physical Location") {
      setShowMap(true);
    } else if (d.title === "Email") {
      setShowEmailModal(true);
    } else if (d.title === "Reviews") {
      setShowReviewModal(true);
    }
  };

  return (
    <section className="departments" id="departments">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Contacts</p>
          <h2>Inquiries</h2>
          <p>If you are interested in using this platform just email us!</p>
        </div>
        <div className="dept-grid">
          {DEPARTMENTS.map((d, i) => {
            const isClickable = d.title === "Physical Location" || d.title === "Email" || d.title === "Reviews";
            return (
              <div 
                key={d.title} 
                ref={register} 
                className={`dept-card${visible[i] ? " in" : ""}${isClickable ? " clickable" : ""}`}
                onClick={(e) => handleCardClick(e, d)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
              >
                <div className="dept-media">{d.media}</div>
                <div className="dept-body">
                  <h3>{d.title}</h3>
                  <span className="dept-dean">{d.dean}</span>
                  <p>
                    {d.body}
                    {isClickable && (
                        <span className="click-hint">
                          {d.title === "Physical Location" && " 🗺️ Click to view map"}
                          {d.title === "Email" && " ✉️ Click to send email"}
                          {d.title === "Reviews" && " ⭐ Click to leave a review"}
                        </span>
                      )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Map Popup */}
      <MapPopup isOpen={showMap} onClose={() => setShowMap(false)} />
      
      {/* Email Modal */}
      <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />

      <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
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
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="unilab-site">
      <Header onOpenAuth={() => setShowAuth(true)} />
      <Hero />
      <Services />
      <Departments />
      <Footer />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}