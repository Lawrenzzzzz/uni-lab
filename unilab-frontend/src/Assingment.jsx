import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  X,
} from "lucide-react";

import { ASSIGNMENTS } from "./data/assignments";
import "./Assignment.css";

/* ----------------------------------------------------------------
   Static demo data — swap for a real /api/assignments/ endpoint
   whenever the backend exposes one.
------------------------------------------------------------------- */

const CLASSES = [
  "Computer Networking 1",
  "Web Systems and Technologies",
  "Advanced Database Management System",
];

const TABS = ["Assigned", "Missing", "Done"];

const BUCKETS = [
  { key: "none", label: "No due date", defaultOpen: true },
  { key: "week", label: "This week", defaultOpen: false },
  { key: "next", label: "Next week", defaultOpen: false },
  { key: "later", label: "Later", defaultOpen: false },
];

const VISIBLE_STEP = 5;

function AssignmentRow({ item, onOpen }) {
  return (
    <button type="button" className="asg-row" onClick={() => onOpen(item)}>
      <span className="asg-row-icon">
        <FileText size={15} />
      </span>
      <span className="asg-row-text">
        <strong>{item.title}</strong>
        <span>{item.course}</span>
        <span className="asg-row-date">
          {item.status === "done" || item.status === "missing"
            ? `Due ${item.due || "—"}`
            : `Posted ${item.posted}`}
        </span>
      </span>
      {item.status === "done" && (
        <span className="asg-row-done">
          <CheckCircle2 size={16} />
        </span>
      )}
    </button>
  );
}

function DetailModal({ item, onClose, onToggleDone }) {
  if (!item) return null;
  const isDone = item.status === "done";

  return (
    <div className="asg-modal-overlay" onClick={onClose}>
      <div className="asg-modal" onClick={(e) => e.stopPropagation()}>
        <button className="asg-modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <span className="asg-modal-icon">
          <FileText size={18} />
        </span>
        <h3>{item.title}</h3>
        <p className="asg-modal-course">{item.course}</p>

        <dl className="asg-modal-meta">
          <div>
            <dt>Posted</dt>
            <dd>{item.posted}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd>{item.due || "No due date"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd className={`asg-status-pill status-${item.status}`}>
              {item.status === "assigned"
                ? "Assigned"
                : item.status === "missing"
                  ? "Missing"
                  : "Done"}
            </dd>
          </div>
        </dl>

        <p className="asg-modal-note">
          Instructions and attachments for this assignment will appear here
          once your instructor publishes them.
        </p>

        <button
          type="button"
          className="asg-modal-btn"
          onClick={() => onToggleDone(item.id)}
        >
          {isDone ? "Mark as not done" : "Mark as done"}
        </button>
      </div>
    </div>
  );
}

export default function Assignments() {
  const [tab, setTab] = useState("Assigned");
  const [course, setCourse] = useState("All classes");
  const [openBuckets, setOpenBuckets] = useState(() =>
    Object.fromEntries(BUCKETS.map((b) => [b.key, b.defaultOpen])),
  );
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP);
  const [items, setItems] = useState(ASSIGNMENTS);
  const [activeItem, setActiveItem] = useState(null);

  const toggleBucket = (key) => {
    setOpenBuckets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDone = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, status: it.status === "done" ? "assigned" : "done" }
          : it,
      ),
    );
    setActiveItem((prev) =>
      prev && prev.id === id
        ? { ...prev, status: prev.status === "done" ? "assigned" : "done" }
        : prev,
    );
  };

  const filtered = useMemo(() => {
    const statusKey = tab.toLowerCase();
    return items.filter((it) => {
      const matchesStatus = it.status === statusKey;
      const matchesCourse = course === "All classes" || it.course === course;
      return matchesStatus && matchesCourse;
    });
  }, [items, tab, course]);

  const grouped = useMemo(() => {
    const map = { none: [], week: [], next: [], later: [] };
    filtered.forEach((it) => {
      map[it.bucket || "none"]?.push(it);
    });
    return map;
  }, [filtered]);

  return (
    <div className="assignments-shell">
      <div className="assignments-card">
        <div className="asg-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              className={`asg-tab${tab === t ? " active" : ""}`}
              onClick={() => {
                setTab(t);
                setVisibleCount(VISIBLE_STEP);
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="asg-toolbar">
          <div className="asg-select-wrap">
            <select
              className="asg-select"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
            >
              <option>All classes</option>
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="asg-select-chevron" />
          </div>
        </div>

        {tab === "Assigned" ? (
          <div className="asg-buckets">
            {BUCKETS.map(({ key, label }) => {
              const list = grouped[key];
              const isOpen = openBuckets[key];
              const shown =
                key === "none" ? list.slice(0, visibleCount) : list;

              return (
                <div className="asg-bucket" key={key}>
                  <button
                    type="button"
                    className="asg-bucket-head"
                    onClick={() => toggleBucket(key)}
                  >
                    <span>{label}</span>
                    <span className="asg-bucket-right">
                      <span className="asg-bucket-count">{list.length}</span>
                      {isOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="asg-bucket-body">
                      {list.length === 0 ? (
                        <p className="asg-empty">Nothing here.</p>
                      ) : (
                        shown.map((item) => (
                          <AssignmentRow
                            key={item.id}
                            item={item}
                            onOpen={setActiveItem}
                          />
                        ))
                      )}

                      {key === "none" && list.length > visibleCount && (
                        <button
                          type="button"
                          className="asg-view-all"
                          onClick={() =>
                            setVisibleCount((v) => v + VISIBLE_STEP)
                          }
                        >
                          View all
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="asg-flat-list">
            {filtered.length === 0 ? (
              <p className="asg-empty">
                Nothing in {tab.toLowerCase()} right now.
              </p>
            ) : (
              filtered.map((item) => (
                <AssignmentRow key={item.id} item={item} onOpen={setActiveItem} />
              ))
            )}
          </div>
        )}

        <button type="button" className="asg-help" aria-label="Help">
          <HelpCircle size={20} />
        </button>
      </div>

      <DetailModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onToggleDone={toggleDone}
      />
    </div>
  );
}