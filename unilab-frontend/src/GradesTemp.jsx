import { useState } from "react";
import { CheckCircle, Filter, Search } from "lucide-react";
import "./Grades.css";

/* ----------------------------------------------------------------
   Static data – replace with real API later
------------------------------------------------------------------- */
const GRADES_DATA = [
  {
    code: "CQE 465",
    description: "Discrete Mathematics",
    units: 3,
    grade: 2.50,
    status: "passed",
    instructor: "JAVIER, DOMINIC C.",
    semester: "1st Sem 2025-2026",
  },
  {
    code: "CS 121",
    description: "Advanced Computer Programming",
    units: 3,
    grade: 2.00,
    status: "passed",
    instructor: "ROXAS, MELVIN B.",
    semester: "1st Sem 2025-2026",
  },
  {
    code: "CS 211",
    description: "Object-Oriented Programming",
    units: 3,
    grade: 2.00,
    status: "passed",
    instructor: "PLAOTO, CALVIN JOHN V.",
    semester: "1st Sem 2025-2026",
  },
  {
    code: "IT 211",
    description: "Database Management System",
    units: 3,
    grade: 1.75,
    status: "passed",
    instructor: "EVANGELISTA, HAROLD T.",
    semester: "2nd Sem 2025-2026",
  },
  {
    code: "IT 212",
    description: "Computer Networking 1",
    units: 3,
    grade: 2.25,
    status: "passed",
    instructor: "DESTREZA, PHILIP A.",
    semester: "2nd Sem 2025-2026",
  },
  {
    code: "LR 102",
    description: "ASIAN Literature",
    units: 3,
    grade: 2.00,
    status: "passed",
    instructor: "FRIME, GLANZAMORE E.",
    semester: "2nd Sem 2025-2026",
  },
  {
    code: "PATHF 3",
    description: "Traditional and Racionalized Games",
    units: 3,
    grade: 2.00,
    status: "passed",
    instructor: "ANDRID, JOHN LESTER D.",
    semester: "2nd Sem 2025-2026",
  },
  {
    code: "Phy 101",
    description: "Calculus-Based Physics",
    units: 3,
    grade: 1.50,
    status: "passed",
    instructor: "BATON, JOHN AUBREY D.",
    semester: "2nd Sem 2025-2026",
  },
];

const SEMESTERS = [
  "All Semesters",
  "1st Sem 2025-2026",
  "2nd Sem 2025-2026",
  "1st Sem 2026-2027",
];

export default function Grades() {
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = GRADES_DATA.filter((item) => {
    const matchesSemester =
      semesterFilter === "All Semesters" || item.semester === semesterFilter;
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSemester && matchesSearch;
  });

  // Calculate summary stats
  const totalUnits = filtered.reduce((sum, g) => sum + g.units, 0);
  const avgGrade =
    filtered.length > 0
      ? (filtered.reduce((sum, g) => sum + g.grade, 0) / filtered.length).toFixed(2)
      : "—";
  const passed = filtered.filter((g) => g.status === "passed").length;


  return (
    <div className="grades-shell">
      <div className="grades-header">
        <div className="grades-summary">
          <div className="summary-item">
            <span className="summary-label">Average</span>
            <span className="summary-value">{avgGrade}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Passed</span>
            <span className="summary-value">{passed}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Units</span>
            <span className="summary-value">{totalUnits}</span>
          </div>
        </div>
      </div>

      <div className="grades-card">
        <div className="grades-toolbar">
          <div className="grades-search">
            <Search size={16} className="grades-search-icon" />
            <input
              type="text"
              placeholder="Search by code, description, or instructor…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grades-filter">
            <Filter size={16} />
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grades-table-wrap">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Units</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="grades-empty">
                    No grades found for the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.code}>
                    <td>{item.code}</td>
                    <td>{item.description}</td>
                    <td>{item.units}</td>
                    <td className="grade-value">{item.grade.toFixed(2)}</td>
                    <td>
                      <span className="grade-status passed">
                        <CheckCircle size={14} /> Passed
                      </span>
                    </td>
                    <td>{item.instructor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}