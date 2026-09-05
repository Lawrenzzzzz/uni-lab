import { useEffect, useState } from "react";
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Megaphone,
  Menu,
  Search,
  Settings,
  Target,
  UsersRound,
} from "lucide-react";
import "./Dashboard.css";

/* ----------------------------------------------------------------
   Static demo data — swap for real API data (see api.js) whenever
   the backend exposes /api/dashboard/ style endpoints.
------------------------------------------------------------------- */

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: BookOpen, label: "Class" },
  { icon: CalendarDays, label: "Assignments" },
  { icon: Award, label: "Grades" },
  { icon: Clock3, label: "Schedule" },
  { icon: Mail, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

const STATS = [
  { label: "Attendance rate", value: "94.6%", note: "On Track", detail: "Minimum requirement: 85%", icon: Clock3 },
  { label: "Cumulative GPA", value: "3.84", note: "+0.12", detail: "Top 5% of your class", icon: Award },
  { label: "Credits completed", value: "78 / 120", note: "Junior", detail: "65% completion rate", icon: Target },
  { label: "Active courses", value: "6 Courses", note: "Fall '26", detail: "18 total weekly hours", icon: BookOpen },
];

const ASSIGNMENTS = [
  { title: "Interactive Web App Draft", course: "CS 302 · Human Computer Interaction", due: "Due in 4 Hours", icon: FileText, tone: "danger", weight: 15 },
  { title: "Linear Regression Problem Set", course: "MATH 221 · Applied Statistics", due: "Due Tomorrow", icon: FileText, tone: "warning", weight: 10 },
  { title: "Brand Communication Analysis", course: "MKT 315 · Marketing Principles", due: "Due in 5 Days", icon: FileText, tone: "info", weight: 10 },
];

const GRADES = [
  ["Database Systems & Design", "CS 340 · Prof. Higgins", "Midterm Project", "96 / 100", "Excellent"],
  ["Applied Statistics", "MATH 221 · Dr. Kovács", "Quiz 3", "88 / 100", "Good"],
  ["Creative Writing Seminar", "ENGL 201 · Prof. Vance", "Short Story Essay", "91 / 100", "Excellent"],
];

const SCHEDULE = [
  ["09:00", "10:30 AM", "Applied Statistics", "Room 208 · Dr. Kovács"],
  ["11:00", "12:30 PM", "Database Systems", "Lab 3 · Prof. Higgins"],
  ["14:00", "3:30 PM", "Human Computer Interaction", "Design Studio · Prof. Lin"],
];

const ANNOUNCEMENTS = [
  {
    tag: "Campus Info",
    tone: "primary",
    time: "2 Hours Ago",
    title: "Fall semester career fair registration now open",
    body: "Meet top tech, design, and marketing agencies on October 12 in the Great Hall.",
  },
  {
    tag: "Maintenance",
    tone: "warning",
    time: "1 Day Ago",
    title: "UNI-Lab system upgrade on Sunday",
    body: "The portal will be offline for planned database upgrades between 02:00 AM and 06:00 AM.",
  },
];

/* ----------------------------------------------------------------
   Small building blocks
------------------------------------------------------------------- */

function Brand() {
  return (
    <div className="dash-brand">
      <span className="dash-brand-mark">
        <GraduationCap size={20} />
      </span>
      <strong className="dash-brand-name">UNI-Lab</strong>
    </div>
  );
}

function Navigation({ active, onSelect }) {
  return (
    <nav className="dash-nav" aria-label="Dashboard navigation">
      {NAV.map(({ icon: Icon, label }) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            className={`dash-nav-item${isActive ? " active" : ""}`}
            onClick={() => onSelect(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
            {isActive && <span className="dash-nav-indicator" />}
          </button>
        );
      })}
    </nav>
  );
}

function Profile({ name, studentId, onLogout }) {
  return (
    <div className="dash-profile">
      <div className="dash-profile-avatar">
        <UsersRound size={18} />
      </div>
      <div className="dash-profile-info">
        <p className="dash-profile-name">{name}</p>
        <p className="dash-profile-id">ID: {studentId}</p>
      </div>
      <button type="button" className="dash-profile-logout" onClick={onLogout} title="Log out">
        ⏻
      </button>
    </div>
  );
}

function Panel({ title, icon: Icon, action, children, className = "" }) {
  return (
    <section className={`dash-panel ${className}`}>
      <header className="dash-panel-header">
        <h2>
          <Icon size={15} />
          {title}
        </h2>
        {action && (
          <button type="button" className="dash-panel-action">
            {action}
          </button>
        )}
      </header>
      {children}
    </section>
  );
}

/* ----------------------------------------------------------------
   Dashboard
------------------------------------------------------------------- */

export default function Dashboard({ studentName = "Student", studentId = "8948271", onLogout }) {
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const closeNav = () => setNavOpen(false);
  const firstName = studentName.split(" ")[0];

  return (
    <div className="unilab-site dash-screen">
      {/* Desktop sidebar */}
      <aside className="dash-sidebar">
        <Brand />
        <Navigation active={active} onSelect={setActive} />
        <Profile name={studentName} studentId={studentId} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      <div className={`dash-mobile-backdrop${navOpen ? " open" : ""}`} onClick={closeNav} />
      <aside className={`dash-mobile-sidebar${navOpen ? " open" : ""}`}>
        <button type="button" className="dash-mobile-close" onClick={closeNav} aria-label="Close menu">
          ×
        </button>
        <Brand />
        <Navigation
          active={active}
          onSelect={(label) => {
            setActive(label);
            closeNav();
          }}
        />
        <Profile name={studentName} studentId={studentId} onLogout={onLogout} />
      </aside>

      <main className="dash-main">
        <div className="dash-wrap">
          <header className="dash-topbar">
            <button
              type="button"
              className="dash-menu-btn"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="dash-title-block">
              <h1>Welcome back, {firstName}!</h1>
              <p>Here is your overview for Fall Semester 2026.</p>
            </div>

            <div className="dash-topbar-actions">
              <label className="dash-search">
                <Search size={16} />
                <input type="text" placeholder="Search courses, tasks…" />
              </label>
              <button type="button" className="dash-bell" aria-label="Notifications">
                <Bell size={18} />
                <span className="dash-bell-dot" />
              </button>
            </div>
          </header>

          <div className="dash-stats">
            {STATS.map(({ label, value, note, detail, icon: Icon }, i) => (
              <article className="dash-stat-card" key={label} style={{ animationDelay: `${i * 70}ms` }}>
                <div className="dash-stat-top">
                  <p className="dash-stat-label">{label}</p>
                  <span className="dash-stat-icon">
                    <Icon size={16} />
                  </span>
                </div>
                <p className="dash-stat-value">{value}</p>
                <p className="dash-stat-foot">
                  <span className="dash-stat-note">{note}</span>
                  <span>{detail}</span>
                </p>
              </article>
            ))}
          </div>

          <div className="dash-content-grid">
            <div className="dash-col">
              <Panel title="Assignment Deadlines" icon={CalendarDays} action="View All">
                <div className="dash-assignments">
                  {ASSIGNMENTS.map(({ title, course, due, icon: Icon, tone, weight }) => (
                    <button type="button" className="dash-assignment-row" key={title}>
                      <span className={`dash-assignment-icon ${tone}`}>
                        <Icon size={16} />
                      </span>
                      <span className="dash-assignment-text">
                        <strong>{title}</strong>
                        <span>{course}</span>
                      </span>
                      <span className={`dash-assignment-due tone-${tone}`}>
                        <strong>{due}</strong>
                        <span>Weight: {weight}%</span>
                      </span>
                      <ChevronRight size={16} className="dash-assignment-chevron" />
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Recent Academic Results" icon={Award} action="Full Transcript">
                <div className="dash-table-scroll">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Course Name</th>
                        <th>Assessment</th>
                        <th>Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GRADES.map(([course, code, assessment, score, status]) => (
                        <tr key={course}>
                          <td>
                            <strong>{course}</strong>
                            <span>{code}</span>
                          </td>
                          <td>{assessment}</td>
                          <td className="dash-score">{score}</td>
                          <td>
                            <span className={`dash-status${status === "Good" ? " neutral" : ""}`}>{status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>

            <div className="dash-col">
              <Panel title="Today's Schedule" icon={Clock3} action="Calendar">
                <div className="dash-schedule">
                  {SCHEDULE.map(([start, range, course, room], i) => (
                    <div className="dash-schedule-row" key={start}>
                      <div className="dash-schedule-time">
                        <strong>{start}</strong>
                        <span>{range}</span>
                      </div>
                      <div className="dash-schedule-body">
                        <span className={`dash-schedule-dot${i === 0 ? " active" : ""}`} />
                        <strong>{course}</strong>
                        <span>{room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Announcements" icon={Megaphone}>
                <div className="dash-announcements">
                  {ANNOUNCEMENTS.map((a, i) => (
                    <article key={a.title} className={i > 0 ? "with-border" : ""}>
                      <div className="dash-announce-head">
                        <strong className={`tone-${a.tone}`}>{a.tag}</strong>
                        <time>{a.time}</time>
                      </div>
                      <h3>{a.title}</h3>
                      <p>{a.body}</p>
                    </article>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}