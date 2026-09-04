import { useMemo, useRef, useState } from "react";
import logoImg from "./assets/unilab-logo.png";
import { apiPost } from "./api";

const STEPS = ["Details", "Course", "Verify"];

const COURSES = [
  { id: "cs", name: "Computer Science", meta: "Systems, algorithms, software craft" },
  { id: "design", name: "Product Design", meta: "Interfaces, research, prototyping" },
  { id: "data", name: "Data Science", meta: "Statistics, modelling, visualisation" },
  { id: "business", name: "Business & Strategy", meta: "Operations, finance, growth" },
];

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

function Stepper({ current }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => (
        <div key={label} className="stepper-step">
          <span className={`stepper-bar${i <= current ? " stepper-bar--active" : ""}`} />
          <span className={`stepper-label${i <= current ? " stepper-label--active" : ""}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Onboarding({ onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState({ age: "", birthday: "" });
  const [course, setCourse] = useState(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const codeRefs = useRef([]);

  const codeValue = useMemo(() => code.join(""), [code]);

  const validateStep = () => {
    const next = {};
    if (step === 0) {
      const age = Number(details.age);
      if (!details.age.trim()) next.age = "Please enter your age.";
      else if (!Number.isInteger(age) || age < 13 || age > 120)
        next.age = "Enter an age between 13 and 120.";
      if (!details.birthday) next.birthday = "Please pick your birthday.";
      else if (new Date(details.birthday) > new Date())
        next.birthday = "Birthday can't be in the future.";
    }
    if (step === 1 && !course) next.course = "Choose a course to continue.";
    if (step === 2 && codeValue.length !== 6) next.code = "Enter all six digits.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      const { ok, data } = await apiPost("/auth/onboarding/", {
        age: Number(details.age),
        birthday: details.birthday,
        course,
      });
      if (!ok) {
        setErrors({
          code:
            data.non_field_errors?.join(" ") ||
            data.age?.join(" ") ||
            data.birthday?.join(" ") ||
            data.course?.join(" ") ||
            data.detail ||
            "Could not save your profile. Please try again.",
        });
        return;
      }
      setDone(true);
    } catch {
      setErrors({ code: "Could not reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  const setDigit = (index, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setErrors((prev) => ({ ...prev, code: undefined }));
    if (digit && index < 5) codeRefs.current[index + 1]?.focus();
  };

  const handleDigitKey = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) codeRefs.current[index - 1]?.focus();
  };

  if (done) {
    return (
      <div className="unilab-site auth-screen">
        <AuroraBackground />
        <div className="auth-wrap">
          <BrandMark />
          <div className="auth-panel auth-panel--center">
            <div className="auth-success-icon">✓</div>
            <h1 className="auth-title">You're all set</h1>
            <p className="auth-subtitle">Your profile is complete. UNI-Lab is ready whenever you are.</p>
            <button type="button" className="btn btn-primary auth-submit" onClick={onDone}>
              Back to start
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unilab-site auth-screen">
      <AuroraBackground />
      <div className="auth-wrap">
        <BrandMark />

        <div className="auth-panel">
          <Stepper current={step} />

          <p className="eyebrow auth-step-eyebrow">Step {step + 1} of 3 — {STEPS[step]}</p>
          <h1 className="auth-title">
            {step === 0 && "A few details about you"}
            {step === 1 && "Pick your course"}
            {step === 2 && "Verify your email"}
          </h1>
          <p className="auth-subtitle">
            {step === 0 && "This helps us tailor your workspace. You can change it later."}
            {step === 1 && "Choose the track you'll be studying. One selection only."}
            {step === 2 && "We sent a six-digit code to your email. Enter it below."}
          </p>

          <form className="auth-form" onSubmit={handleNext} noValidate>
            {step === 0 && (
              <>
                <div className="field-group">
                  <label htmlFor="age" className="field-label">Age</label>
                  <input
                    id="age"
                    type="number"
                    min={13}
                    max={120}
                    inputMode="numeric"
                    placeholder="24"
                    value={details.age}
                    onChange={(e) => {
                      setDetails((d) => ({ ...d, age: e.target.value }));
                      setErrors((p) => ({ ...p, age: undefined }));
                    }}
                    className={`field-input${errors.age ? " field-input-error" : ""}`}
                  />
                  {errors.age && <FieldError>{errors.age}</FieldError>}
                </div>

                <div className="field-group">
                  <label htmlFor="birthday" className="field-label">Birthday</label>
                  <input
                    id="birthday"
                    type="date"
                    value={details.birthday}
                    onChange={(e) => {
                      setDetails((d) => ({ ...d, birthday: e.target.value }));
                      setErrors((p) => ({ ...p, birthday: undefined }));
                    }}
                    className={`field-input${errors.birthday ? " field-input-error" : ""}`}
                  />
                  {errors.birthday && <FieldError>{errors.birthday}</FieldError>}
                </div>
              </>
            )}

            {step === 1 && (
              <div className="course-list">
                {COURSES.map((c) => {
                  const selected = course === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCourse(c.id);
                        setErrors((p) => ({ ...p, course: undefined }));
                      }}
                      aria-pressed={selected}
                      className={`course-option${selected ? " course-option--selected" : ""}`}
                    >
                      <span>
                        <span className="course-option-name">{c.name}</span>
                        <span className="course-option-meta">{c.meta}</span>
                      </span>
                      <span className={`course-check${selected ? " course-check--selected" : ""}`}>✓</span>
                    </button>
                  );
                })}
                {errors.course && <FieldError>{errors.course}</FieldError>}
              </div>
            )}

            {step === 2 && (
              <div className="code-group">
                <div className="code-inputs">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { codeRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`Digit ${i + 1}`}
                      value={digit}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKey(i, e)}
                      className={`field-input code-input${errors.code ? " field-input-error" : ""}`}
                    />
                  ))}
                </div>
                {errors.code ? (
                  <FieldError>{errors.code}</FieldError>
                ) : (
                  <p className="field-hint">
                    Didn't get it?{" "}
                    <button type="button" className="auth-link-btn">Resend code</button>
                  </p>
                )}
              </div>
            )}

            <div className="auth-btn-row">
              <button type="button" className="btn btn-outline-dark" onClick={handleBack}>
                Back
              </button>
              <button type="submit" className="btn btn-primary auth-btn-flex" disabled={submitting}>
                {submitting ? "Saving..." : step === 2 ? "Verify & finish" : "Next"}
              </button>
            </div>
          </form>
        </div>

        <p className="auth-footnote auth-footnote--mono">Protected by UNI-Lab security</p>
      </div>
    </div>
  );
}