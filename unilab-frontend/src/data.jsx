/* ----------------------------------------------------------------
   Static content for the UNI-Lab site.
   Kept separate from App.jsx so the component file only holds markup/logic.
------------------------------------------------------------------- */

export const NAV_LINKS = [
  { href: "#top", label: "Home" },
  { href: "#services", label: "About" },
  { href: "#departments", label: "Contact" },
];

export const SERVICES = [
  {
    title: "UNI-Lab",
    body: "Uni-Lab is a college portal designed to provide students and faculty with a centralized platform for managing academic information and accessing essential university services. ",
    details: "It aims to simplify academic processes, improve communication, and provide a more convenient digital experience for the university community.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10L12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
  {
    title: "Schedule Maker",
    body: "Just Upload your Schedule and UNI-Lab will generate a clean easy to understand Schedule",
    details: "Some Students/ Faculty Members is having hard time to create a schedule since it's time consuming, with this you're just going to upload the text or img file and UNI-Lab will do the work for you",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </svg>
    ),
  },
  {
    title: "Attendance Tracking",
    body: "The Attendance Tracking for this website uses QR Code so no need to do roll each time you have a class just scan your QR code and you will be present",
    details: "With UNI-Lab you can track attendance real-time and make calculation and assesment based on the input that the students give, it will generate report for the attendance of each student. For example: one student reaches 3 absences which is the limit it will notify you so that you can take action",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h6" />
      </svg>
    ),
  },
  {
    title: "Announcements",
    body: "With UNI-Lab you can make announcement like Exam, Quizzes, Events, Activities real-time",
    details: "UNI-Lab keep students and faculty updated with the latest university news, events, important reminders, and academic updates, all in one convenient place. ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

export const DEPARTMENTS = [
  {
    title: "Physical Location",
    dean: "Balayan, Batangas",
    body: "If you're interested to meet us in person this is our Location, you can find it in Google Map. Just Click this",
    media: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#13294f" />
            <stop offset="100%" stopColor="#081326" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#g1)" />
        <g stroke="#f2a83e" strokeWidth="1" opacity=".5">
          <line x1="0" y1="220" x2="400" y2="220" />
          <line x1="60" y1="220" x2="60" y2="300" />
          <line x1="340" y1="220" x2="340" y2="300" />
        </g>
        <ellipse cx="200" cy="230" rx="150" ry="18" fill="#0d2247" />
        <g fill="#f2a83e" opacity=".85">
          <rect x="120" y="150" width="18" height="70" rx="2" />
          <rect x="190" y="140" width="18" height="80" rx="2" />
          <rect x="260" y="160" width="18" height="60" rx="2" />
        </g>
        <circle cx="200" cy="90" r="34" fill="none" stroke="#f2a83e" strokeWidth="1.5" opacity=".5" />
        <circle cx="200" cy="90" r="4" fill="#f2a83e" />
      </svg>
    ),
  },
  {
    title: "Email",
    dean: "unilab@gmail.com",
    body: "If you have any concern or any question about this website we would to discuss it for you, Just Email Us!",
    media: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2013" />
            <stop offset="100%" stopColor="#120e08" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#g2)" />
        <g fill="#c98a3e" opacity=".7">
          <rect x="30" y="60" width="60" height="180" />
          <rect x="310" y="60" width="60" height="180" />
        </g>
        <g stroke="#f2c774" strokeWidth="2" opacity=".8">
          <line x1="40" y1="70" x2="80" y2="70" />
          <line x1="40" y1="90" x2="80" y2="90" />
          <line x1="40" y1="110" x2="80" y2="110" />
          <line x1="40" y1="130" x2="80" y2="130" />
          <line x1="320" y1="70" x2="360" y2="70" />
          <line x1="320" y1="90" x2="360" y2="90" />
          <line x1="320" y1="110" x2="360" y2="110" />
          <line x1="320" y1="130" x2="360" y2="130" />
        </g>
        <rect x="140" y="150" width="120" height="12" fill="#3a2c18" />
        <rect x="150" y="162" width="100" height="8" fill="#3a2c18" />
        <circle cx="200" cy="60" r="24" fill="none" stroke="#f2c774" strokeWidth="1.5" opacity=".6" />
      </svg>
    ),
  },
  {
    title: "Reviews",
    dean: "Comment / Feedback",
    body: "We would love to have your feedback feedback for further improvements, you can leave a feedback here. Thank you!",
    media: (
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2c4a" />
            <stop offset="100%" stopColor="#0a1626" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#g3)" />
        <g fill="#38547e" opacity=".85">
          <rect x="90" y="40" width="90" height="220" />
          <rect x="200" y="80" width="90" height="180" />
        </g>
        <g fill="#8fb3dd" opacity=".35">
          <rect x="100" y="55" width="14" height="16" /><rect x="122" y="55" width="14" height="16" /><rect x="144" y="55" width="14" height="16" />
          <rect x="100" y="85" width="14" height="16" /><rect x="122" y="85" width="14" height="16" /><rect x="144" y="85" width="14" height="16" />
          <rect x="100" y="115" width="14" height="16" /><rect x="122" y="115" width="14" height="16" /><rect x="144" y="115" width="14" height="16" />
          <rect x="210" y="95" width="14" height="16" /><rect x="232" y="95" width="14" height="16" /><rect x="254" y="95" width="14" height="16" />
          <rect x="210" y="125" width="14" height="16" /><rect x="232" y="125" width="14" height="16" /><rect x="254" y="125" width="14" height="16" />
        </g>
        <rect x="0" y="255" width="400" height="45" fill="#08111e" />
      </svg>
    ),
  },
];