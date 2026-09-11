import { useState } from "react";
import { Clock3 } from "lucide-react";
import "./Schedule.css";

const WEEK_DAYS = [
  { key: "Monday", short: "M" },
  { key: "Tuesday", short: "T" },
  { key: "Wednesday", short: "W" },
  { key: "Thursday", short: "TH" },
  { key: "Friday", short: "F" },
  { key: "Saturday", short: "SAT" },
  { key: "Sunday", short: "SUN" },
];

const SCHEDULE_COLORS = ["blue", "green", "amber"];

function getTimeValue(time) {
  const match = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return hour * 60 + minute;
}

export default function Schedule({ classes = [] }) {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const scheduleItems = classes
    .filter((course) => course.status === "ACTIVE")
    .flatMap((course) =>
      course.schedule.map((slot, index) => ({
        ...slot,
        id: `${course.id}-${index}`,
        code: course.code,
        title: course.title,
        instructor: course.instructor,
      }))
    )
    .sort((a, b) => getTimeValue(a.start) - getTimeValue(b.start));

  const selectedItems = scheduleItems.filter((item) => item.day === selectedDay);

  return (
    <div className="dash-schedule-page">
      <div className="dash-schedule-toolbar">
        <div>
          <h2>Weekly Schedule</h2>
          <p>Your classes for the current semester.</p>
        </div>
        <span className="dash-schedule-term">2026–2027 · First Semester</span>
      </div>

      <div className="dash-day-tabs" role="tablist" aria-label="Schedule days">
        {WEEK_DAYS.map((day) => {
          const hasClass = scheduleItems.some((item) => item.day === day.key);
          const active = selectedDay === day.key;

          return (
            <button
              key={day.key}
              type="button"
              role="tab"
              aria-selected={active}
              className={`dash-day-tab${active ? " active" : ""}${hasClass ? " has-class" : ""}`}
              onClick={() => setSelectedDay(day.key)}
            >
              <span>{day.short}</span>
              <small>{day.key}</small>
              {hasClass && <i />}
            </button>
          );
        })}
      </div>

      <div className="dash-schedule-day-card">
        <div className="dash-schedule-day-header">
          <div>
            <span className="dash-schedule-day-label">{selectedDay}</span>
            <h3>
              {selectedItems.length
                ? `${selectedItems.length} class${selectedItems.length > 1 ? "es" : ""}`
                : "No classes"}
            </h3>
          </div>
          <Clock3 size={20} />
        </div>

        {selectedItems.length ? (
          <div className="dash-schedule-timeline">
            {selectedItems.map((item, index) => (
              <article
                key={item.id}
                className={`dash-schedule-card card-${SCHEDULE_COLORS[index % SCHEDULE_COLORS.length]}`}
              >
                <div className="dash-schedule-card-time">
                  <strong>{item.start}</strong>
                  <span>{item.end}</span>
                </div>
                <div className="dash-schedule-card-body">
                  <span className="dash-schedule-code">{item.code}</span>
                  <h4>{item.title}</h4>
                  <p>{item.instructor}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="dash-schedule-empty">
            <Clock3 size={28} />
            <strong>No classes scheduled</strong>
            <span>Enjoy your free day.</span>
          </div>
        )}
      </div>
    </div>
  );
}
