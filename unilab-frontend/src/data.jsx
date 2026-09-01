import locationImg from "./assets/location-pic.jpg";
import emailImg from "./assets/email-pic.jpg";
import reviewsImg from "./assets/reviews-pic.jpg";

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
    media: <img src={locationImg} alt="Location" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />,
  },
  {
    title: "Email",
    dean: "unilab@gmail.com",
    body: "If you have any concern or any question about this website we would to discuss it for you, Just Email Us!",
    media: <img src={emailImg} alt="Email" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />,
  },
  {
    title: "Reviews",
    dean: "Comment / Feedback",
    body: "We would love to have your feedback feedback for further improvements, you can leave a feedback here. Thank you!",
    media: <img src={reviewsImg} alt="Reviews" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />,
  },
];