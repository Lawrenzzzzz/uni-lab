import { useState } from "react";
import logoImg from "./assets/unilab-logo.png";

const API_BASE = "http://localhost:8000/api";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /\d/.test(pw) },
  { label: "One special character", test: (pw) => /[!@#$%^&*(),.?":{}|<>_\-+=~`[\];'\\/]/.test(pw) },
];

function getStrength(password) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (!password) return { score: 0, label: "", color: "" };
  if (passed <= 2) return { score: passed, label: "Weak", color: "#e5484d" };
  if (passed === 3) return { score: passed, label: "Fair", color: "#f2a83e" };
  if (passed === 4) return { score: passed, label: "Good", color: "#f2c94c" };
  return { score: passed, label: "Strong", color: "#2ecc71" };
}

function PasswordStrengthMeter({ password }) {
  const { score, label, color } = getStrength(password);
  return (
    <div className="password-strength">
      <div className="strength-bar-track">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="strength-bar-seg" style={{ background: i < score ? color : undefined }} />
        ))}
      </div>
      {label && (
        <div className="strength-rules">
          <span className="strength-label" style={{ color }}>{label}</span>
          <ul>
            {PASSWORD_RULES.map((r) => (
              <li key={r.label} className={r.test(password) ? "met" : ""}>
                {r.test(password) ? "✓" : "○"} {r.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "", agree: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setSuccessMsg("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      if (!res.ok) setErrors({ form: data.detail || "Login failed." });
      else setSuccessMsg(data.message || "Logged in!");
    } catch {
      setErrors({ form: "Could not reach the server." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!signupData.agree) {
      setErrors({ agree: "You must agree to the Terms of Service and Privacy Policy." });
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          confirm_password: signupData.confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data);
      } else {
        setSuccessMsg("Account created! You can now log in.");
        setTimeout(() => switchMode("login"), 1200);
      }
    } catch {
      setErrors({ form: "Could not reach the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay auth-overlay" onClick={onClose}>
      <div
        className={`auth-card${mode === "signup" ? " auth-card-scroll" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button lives OUTSIDE the scrollable body so it's always visible */}
        <button className="modal-close auth-close-fixed" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="auth-card-body">
          <div className="auth-badge">
            <img src={logoImg} alt="UNI-Lab" />
          </div>

          <h3 className="auth-title">UNI-LAB</h3>
          <p className="auth-subtitle">
            {mode === "login" ? "Student & Faculty Portal" : "Create Portal Account"}
          </p>

          {successMsg && <div className="auth-success">{successMsg}</div>}
          {errors.form && <div className="auth-error">{errors.form}</div>}

          {mode === "login" ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="auth-field">
                <label>Email</label>
                <div className="auth-input">
                  <span className="auth-icon">✉</span>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-field-header">
                  <label>Password</label>
                  <a href="#" className="auth-link-small">Forgot Password?</a>
                </div>
                <div className="auth-input">
                  <span className="auth-icon">🔒</span>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div className="auth-divider"><span>OR CONTINUE WITH</span></div>

              <div className="auth-oauth-row">
                <button type="button" className="auth-oauth-btn">Google</button>
                <button type="button" className="auth-oauth-btn">Microsoft</button>
              </div>

              <p className="auth-switch">
                Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); switchMode("signup"); }}>Sign Up</a>
              </p>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignupSubmit}>
              <div className="auth-field">
                <label>Full Name</label>
                <div className="auth-input">
                  <span className="auth-icon">👤</span>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Email</label>
                <div className="auth-input">
                  <span className="auth-icon">✉</span>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input">
                  <span className="auth-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Create password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <PasswordStrengthMeter password={signupData.password} />
                {errors.password && (
                  <span className="field-error">
                    {Array.isArray(errors.password) ? errors.password.join(" ") : errors.password}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label>Confirm Password</label>
                <div className="auth-input">
                  <span className="auth-icon">🔒</span>
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={signupData.agree}
                  onChange={(e) => setSignupData({ ...signupData, agree: e.target.checked })}
                />
                <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
              </label>
              {errors.agree && <span className="field-error">{errors.agree}</span>}

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="auth-switch">
                Already have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); switchMode("login"); }}>Log In</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}