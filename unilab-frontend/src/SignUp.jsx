import { useState } from "react";
import logoImg from "./assets/unilab-logo.png";
import { apiPost } from "./api";

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

export default function SignUp({ onSuccess, onBack, onLoginClick }) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    const name = values.name.trim();
    const email = values.email.trim();

    if (!name) next.name = "Please enter your full name.";
    else if (name.length > 100) next.name = "Name must be under 100 characters.";

    if (!email) next.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";

    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords don't match — please re-enter.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const { ok, data } = await apiPost("/auth/signup/", {
        full_name: name,
        email,
        password: values.password,
        confirm_password: values.confirm,
      });

      if (!ok) {
        // Map Django/DRF field errors (full_name, email, password,
        // confirm_password) back onto this form's local field names.
        setErrors({
          name: data.full_name?.join(" "),
          email: data.email?.join(" "),
          password: data.password?.join(" "),
          confirm: data.confirm_password?.join(" ") || data.non_field_errors?.join(" "),
          form: typeof data.detail === "string" ? data.detail : undefined,
        });
        return;
      }

      onSuccess();
    } catch {
      setErrors({ form: "Could not reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="unilab-site auth-screen">
      <AuroraBackground />
      <div className="auth-wrap">
        <div className="auth-panel">
            <BrandMark />

            <h1 className="auth-title">Create your account</h1>

            <p className="auth-subtitle">Set up a secure login to start using UNI-Lab.</p>

            {errors.form && <FieldError>{errors.form}</FieldError>}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="field-group">
                <label htmlFor="name" className="field-label">Full name</label>
                <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="Jordan Ellis"
                    value={values.name}
                    onChange={set("name")}
                    className={`field-input${errors.name ? " field-input-error" : ""}`}
                />
                {errors.name && <FieldError>{errors.name}</FieldError>}
                </div>

                <div className="field-group">
                <label htmlFor="email" className="field-label">Email</label>
                <input
                    id="email"
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
                <label htmlFor="pw" className="field-label">Password</label>
                <div className="field-with-action">
                    <input
                    id="pw"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={set("password")}
                    className={`field-input${errors.password ? " field-input-error" : ""}`}
                    />
                    <RevealButton shown={showPw} onClick={() => setShowPw((s) => !s)} />
                </div>
                {errors.password ? (
                    <FieldError>{errors.password}</FieldError>
                ) : (
                    <p className="field-hint">Minimum 8 characters.</p>
                )}
                </div>

                <div className="field-group">
                <label htmlFor="cpw" className="field-label">Confirm password</label>
                <div className="field-with-action">
                    <input
                    id="cpw"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={values.confirm}
                    onChange={set("confirm")}
                    className={`field-input${errors.confirm ? " field-input-error" : ""}`}
                    />
                    <RevealButton shown={showConfirm} onClick={() => setShowConfirm((s) => !s)} />
                </div>
                {errors.confirm && <FieldError>{errors.confirm}</FieldError>}
                </div>

                <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
                {submitting ? "Creating account..." : "Create account"}
                </button>
            </form>
          </div>

        <p className="auth-footnote">
          Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }}>Log in</a>
        </p>
        <p className="auth-footnote auth-footnote--mono">Protected by UNI-Lab security</p>

        <button type="button" className="auth-back" onClick={onBack}>
          ← Back to site
        </button>
      </div>
    </div>
  );
}