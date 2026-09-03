import { useState } from "react";
import logoImg from "./assets/unilab-logo.png";

const API_BASE = "http://localhost:8000/api";

function AuroraBackground() {
  return (
    <div className="auth-aurora" aria-hidden="true">
      <span className="auth-aurora-blob auth-aurora-blob--a" />
      <span className="auth-aurora-blob auth-aurora-blob--b" />
      <span className="auth-aurora-blob auth-aurora-blob--c" />
      <span className="auth-aurora-grid" />
    </div>
  );
}

function BrandMark() {
  return (
    <div className="auth-brand">
      <img src={logoImg} alt="UNI-Lab" className="auth-brand-logo" />
      <div>
        <p className="auth-brand-name">UNI-Lab</p>
        <p className="auth-brand-tag">Secure Student Workspace</p>
      </div>
    </div>
  );
}

function FieldError({ children }) {
  return (
    <p className="field-error">
      <span>!</span> {children}
    </p>
  );
}

function RevealButton({ shown, onClick }) {
  return (
    <button type="button" className="reveal-btn" onClick={onClick}>
      {shown ? "Hide" : "Show"}
    </button>
  );
}

function SocialButton({ children }) {
  return (
    <button type="button" className="social-btn">
      {children}
    </button>
  );
}

export default function Login({ onSuccess, onSignUpClick, onBack }) {
  const [showPw, setShowPw] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = {};
    const email = values.email.trim();
    if (!email) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Please enter your password.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: values.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ form: data.detail || "Login failed. Check your credentials." });
      } else {
        onSuccess();
      }
    } catch {
      setErrors({ form: "Could not reach the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="unilab-site auth-screen">
      <AuroraBackground />
      <div className="auth-wrap">
        <div className="auth-panel">
          <BrandMark />

          <h1 className="auth-title">Welcome back</h1>

          <p className="auth-subtitle">Log in to access your UNI-Lab workspace.</p>

          {errors.form && <FieldError>{errors.form}</FieldError>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="login-email" className="field-label">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                maxLength={255}
                placeholder="you@unilab.edu"
                value={values.email}
                onChange={set("email")}
                className={`field-input${errors.email ? " field-input-error" : ""}`}
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </div>

            <div className="field-group">
              <div className="auth-field-header">
                <label htmlFor="login-pw" className="field-label">Password</label>
                <a href="#" className="auth-link-small">Forgot Password?</a>
              </div>
              <div className="field-with-action">
                <input
                  id="login-pw"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={values.password}
                  onChange={set("password")}
                  className={`field-input${errors.password ? " field-input-error" : ""}`}
                />
                <RevealButton shown={showPw} onClick={() => setShowPw((s) => !s)} />
              </div>
              {errors.password && <FieldError>{errors.password}</FieldError>}
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <p>or continue with</p>
            <span />
          </div>

          <div className="auth-social-grid">
            <SocialButton><strong>G</strong> Google</SocialButton>
            <SocialButton>Apple</SocialButton>
          </div>
        </div>

        <p className="auth-footnote">
          Don't have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onSignUpClick(); }}>Sign Up</a>
        </p>
        <p className="auth-footnote auth-footnote--mono">Protected by UNI-Lab security</p>

        <button type="button" className="auth-back" onClick={onBack}>
          ← Back to site
        </button>
      </div>
    </div>
  );
}