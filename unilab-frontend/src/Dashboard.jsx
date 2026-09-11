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
  ChevronLeft,
} from "lucide-react";
import "./Dashboard.css";
import { ASSIGNMENTS } from "./data/assignments";
import Assignments from "./Assignment.jsx";     
import Grades from "./GradesTemp.jsx";
import Schedule from "./Schedule.jsx";
import Messages from "./Messages.jsx";

/* ----------------------------------------------------------------
   Navigation items
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

/* ----------------------------------------------------------------
   Static data
------------------------------------------------------------------- */
const STATS = [
  { label: "Attendance rate", value: "94.6%", note: "On Track", detail: "Minimum requirement: 85%", icon: Clock3 },
  { label: "Cumulative GPA", value: "3.84", note: "+0.12", detail: "Top 5% of your class", icon: Award },
  { label: "Credits completed", value: "78 / 120", note: "Junior", detail: "65% completion rate", icon: Target },
  { label: "Active courses", value: "6 Courses", note: "Fall '26", detail: "18 total weekly hours", icon: BookOpen },
];

const GRADES = [
  ["Database Systems & Design", "CS 340 · Prof. Higgins", "Midterm Project", "96 / 100", "Excellent"],
  ["Applied Statistics", "MATH 221 · Dr. Kovács", "Quiz 3", "88 / 100", "Good"],
  ["Creative Writing Seminar", "ENGL 201 · Prof. Vance", "Short Story Essay", "91 / 100", "Excellent"],
];

const SCHEDULE = [
  {
    time: "09:00",
    end: "10:30 AM",
    title: "Applied Statistics",
    location: "Room 402B · Dr. Kovács",
    accent: "blue"
  },
  {
    time: "11:00",
    end: "12:30 PM",
    title: "Database Systems",
    location: "Lab 3 · Prof. Higgins",
    accent: "green"
  },
  {
    time: "14:00",
    end: "15:30 PM",
    title: "Human Computer Interaction",
    location: "Design Studio · Prof. Lin",
    accent: "amber"
  }
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

const CLASSES = [
  {
    id: 1,
    code: "IT 2205",
    status: "ARCHIVED",
    title: "Advanced Database Management System",
    schoolYear: "2025-2026",
    semester: "Second Semester",
    instructor: "Jason C. Magsino",
    schedule: [
      { day: "Monday", start: "03:30 PM", end: "05:30 PM" },
      { day: "Sunday", start: "04:00 PM", end: "07:00 PM" },
    ],
  },
  {
    id: 2,
    code: "IT-314",
    status: "ACTIVE",
    title: "Web Systems and Technologies - BSIT BA-3104",
    schoolYear: "2026-2027",
    semester: "First Semester",
    instructor: "Jason C. Magsino",
    schedule: [
      { day: "Tuesday", start: "10:00 AM", end: "12:00 PM" },
      { day: "Saturday", start: "07:00 AM", end: "10:00 AM" },
    ],
  },
];

/* ----------------------------------------------------------------
   Building Blocks
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
      <button
        type="button"
        className="dash-profile-logout"
        onClick={onLogout}
        title="Log out"
      >
        ⏻
      </button>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  action,
  onAction,
  children,
  className = "",
}) {
  return (
    <div className={`dash-panel ${className}`}>
      <div className="dash-panel-header">
        <h2>
          <Icon size={15} />
          {title}
        </h2>

        {action && (
          <button
            type="button"
            className="dash-panel-action"
            onClick={onAction}
          >
            {action}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

/* ----------------------------------------------------------------
   Views
------------------------------------------------------------------- */
function DashboardView({ onNavigate }) {
  const upcomingAssignments = ASSIGNMENTS
    .filter((item) => item.status === "assigned")
    .slice(0, 3);

  return (
    <>
      <div className="dash-stats">
        {STATS.map(({ label, value, note, detail, icon: Icon }, i) => (
          <article
            className="dash-stat-card"
            key={label}
            style={{ animationDelay: `${i * 70}ms` }}
          >
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
          <Panel
            title="Assignment Deadlines"
            icon={CalendarDays}
            action="View All"
            onAction={() => onNavigate("Assignments")}
          >
            <div className="dash-assignments">
              {upcomingAssignments.map((item) => (
                <button
                  type="button"
                  className="dash-assignment-row"
                  key={item.id}
                  onClick={() => onNavigate("Assignments")}
                >
                  <span className="dash-assignment-icon info">
                    <FileText size={16} />
                  </span>

                  <span className="dash-assignment-text">
                    <strong>{item.title}</strong>
                    <span>{item.course}</span>
                  </span>

                  <span className="dash-assignment-due tone-info">
                    <strong>{item.due || "No due date"}</strong>
                    <span>Weight: {item.weight || 0}%</span>
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
                        <span className={`dash-status${status === "Good" ? " neutral" : ""}`}>
                          {status}
                        </span>
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
              {SCHEDULE.map((item) => (
                <div className="dash-schedule-row" key={item.time}>
                  <div className="dash-schedule-time">
                    <strong>{item.time}</strong>
                    <span>{item.end}</span>
                  </div>
                  <div className={`dash-schedule-bar bar-${item.accent}`} />
                  <div className="dash-schedule-body">
                    <strong className="dash-schedule-title">{item.title}</strong>
                    <span className="dash-schedule-sub">{item.location}</span>
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
    </>
  );
}

function ClassesView({ onViewClass, selectedClass, onBack }) {
  if (selectedClass) {
    const c = selectedClass;
    return (
      <div className="dash-class-detail">
        <button className="dash-back-btn" onClick={onBack}>
          <ChevronLeft size={18} /> Back to Classes
        </button>
        <div className="dash-class-header-card">
          <div className="dash-class-top-bar">
            <span className="dash-class-code">{c.code}</span>
            <span className={`dash-class-badge ${c.status.toLowerCase()}`}>{c.status}</span>
          </div>
          <h2>{c.title}</h2>
          <div className="dash-class-meta">
            <p><strong>Academic Year & Semester:</strong> {c.schoolYear} | {c.semester}</p>
            <p><strong>Instructor:</strong> {c.instructor}</p>
          </div>
        </div>
        <div className="dash-class-schedule-card">
          <h4>📅 Schedule Details</h4>
          {c.schedule.map((slot, idx) => (
            <div key={idx} className="dash-class-slot">
              <span>{slot.day}</span>
              <span>{slot.start} – {slot.end}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dash-classes">
      <div className="dash-classes-header">
        <div className="dash-classes-filters">
          <div className="dash-filter-group">
            <label>School Year</label>
            <select>
              <option>All School Years</option>
              <option>2025-2026</option>
              <option>2026-2027</option>
            </select>
          </div>
          <div className="dash-filter-group">
            <label>Semester</label>
            <select>
              <option>All Semesters</option>
              <option>First Semester</option>
              <option>Second Semester</option>
            </select>
          </div>
        </div>
        <button className="dash-btn-join">+ Join Class</button>
      </div>

      <div className="dash-class-grid">
        {CLASSES.map((cls) => (
          <div key={cls.id} className="dash-class-card">
            <div className="dash-class-card-header">
              <span className="dash-class-code">{cls.code}</span>
              <span className={`dash-class-badge ${cls.status.toLowerCase()}`}>{cls.status}</span>
            </div>
            <h3 className="dash-class-title">{cls.title}</h3>
            <div className="dash-class-card-body">
              <span className="dash-label">Academic Year & Semester</span>
              <p className="dash-value">{cls.schoolYear} | {cls.semester}</p>
              <span className="dash-label">Instructor</span>
              <p className="dash-value dash-instructor">{cls.instructor}</p>
              <span className="dash-label">📅 Schedule Details</span>
              <div className="dash-schedule-list">
                {cls.schedule.map((slot, idx) => (
                  <div key={idx} className="dash-class-slot">
                    <span>{slot.day}</span>
                    <span>{slot.start} - {slot.end}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="dash-btn-view" onClick={() => onViewClass(cls)}>
              View Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


function PlaceholderView({ title }) {
  return (
    <div className="dash-placeholder">
      <h2>{title}</h2>
      <p>This page is under construction.</p>
    </div>
  );
}

/* ----------------------------------------------------------------
   Main Dashboard
------------------------------------------------------------------- */
export default function Dashboard({
  studentName = "Student",
  studentId = "8948271",
  onLogout,
}) {
  const [navOpen, setNavOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  const closeNav = () => setNavOpen(false);
  const firstName = studentName.split(" ")[0];

  const handleNavSelect = (label) => {
    setActive(label);
    if (label !== "Class") setSelectedClass(null);
    closeNav();
  };

  // ★ This is the renderContent function – all conditional logic is here ★
  const renderContent = () => {
    if (active === "Dashboard") return <DashboardView onNavigate={handleNavSelect} />;
    if (active === "Class") {
      return (
        <ClassesView
          onViewClass={(cls) => setSelectedClass(cls)}
          selectedClass={selectedClass}
          onBack={() => setSelectedClass(null)}
        />
      );
    }
    if (active === "Assignments") return <Assignments />;
    if (active === "Grades") return <Grades />;   // ← new Grades view
    if (active === "Schedule") return <Schedule classes={CLASSES} />;
    if (active === "Messages") return <Messages />;
    return <PlaceholderView title={active} />;
  };

  return (
    <div className="unilab-site dash-screen">
      <aside className="dash-sidebar">
        <Brand />
        <Navigation active={active} onSelect={handleNavSelect} />
        <Profile name={studentName} studentId={studentId} onLogout={onLogout} />
      </aside>

      <div
        className={`dash-mobile-backdrop${navOpen ? " open" : ""}`}
        onClick={closeNav}
      />
      <aside className={`dash-mobile-sidebar${navOpen ? " open" : ""}`}>
        <button
          type="button"
          className="dash-mobile-close"
          onClick={closeNav}
          aria-label="Close menu"
        >
          ×
        </button>
        <Brand />
        <Navigation active={active} onSelect={handleNavSelect} />
        <Profile name={studentName} studentId={studentId} onLogout={onLogout} />
      </aside>

      <main className="dash-main">
        <div className="dash-wrap">
          <div className="dash-topbar">
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
              <h1>
                {active === "Dashboard" && `Welcome back, ${firstName}!`}
                {active === "Class" && (selectedClass ? selectedClass.code : "My Classes")}
                {active !== "Dashboard" && active !== "Class" && active}
              </h1>
              <p>
                {active === "Dashboard" && "Here is your overview for Fall Semester 2026."}
                {active === "Class" && !selectedClass && "Your enrolled classes for the current term."}
                {active === "Class" && selectedClass && "Class details"}
              </p>
            </div>

            <div className="dash-topbar-actions">
              <label className="dash-search">
                <Search size={16} />
                <input type="text" placeholder="Search courses, tasks…" />
              </label>
              <button
                type="button"
                className="dash-bell"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="dash-bell-dot" />
              </button>
            </div>
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}