import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Send,
  Check,
  CheckCheck,
  ChevronLeft,
  BellOff,
  Pin,
  Info,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import "./Messages.css";

/* ================================================================
   STATIC DATA  (swap these with your API later)
================================================================ */
const CONTACTS = [
  {
    id: "alex",
    name: "Alex Johnson",
    tone: "purple",
    online: true,
    time: "10:30 AM",
    preview: "Hey! How are you doing?",
    unread: 2,
    pinned: true,
    role: "Product Designer @ TechFlow",
    location: "Loves coffee ☕ and 3D art 🎨",
  },
  {
    id: "design",
    name: "Design Team",
    tone: "blue",
    online: true,
    time: "9:45 AM",
    preview: "Sorry, please check the new mockups…",
    unread: 3,
    group: true,
    role: "8 members · Product design guild",
    location: "Weekly sync every Monday, 9:30 AM",
  },
  {
    id: "jane",
    name: "Jane Cooper",
    tone: "pink",
    online: false,
    time: "Yesterday",
    preview: "Thanks for the update!",
    unread: 0,
    role: "Frontend Engineer @ TechFlow",
    location: "Based in Cebu City 🇵🇭",
  },
  {
    id: "alpha",
    name: "Project Alpha",
    tone: "green",
    online: false,
    time: "Yesterday",
    preview: "Joint meeting at 3 PM today.",
    unread: 0,
    group: true,
    role: "12 members · Capstone project",
    location: "Deliverable due: Sprint 4 review",
  },
  {
    id: "michael",
    name: "Michael Brown",
    tone: "amber",
    online: false,
    time: "Mon",
    preview: "Alright, see you tomorrow 👋",
    unread: 0,
    role: "QA Analyst @ TechFlow",
    location: "Coffee run every 10 AM ☕",
  },
  {
    id: "emily",
    name: "Emily Davis",
    tone: "teal",
    online: true,
    time: "Sun",
    preview: "Can you share the file?",
    unread: 0,
    role: "Research Assistant · CS Dept.",
    location: "Handles the thesis repository",
  },
];

const THREADS = {
  alex: [
    { id: "a1", side: "them", text: "Hey! 👋", time: "10:30 AM", day: "Today" },
    { id: "a2", side: "them", text: "How are you doing?", time: "10:30 AM" },
    { id: "a3", side: "me", text: "Hi Alex! I'm good, thanks 😊\nHow about you?", time: "10:31 AM", seen: true },
    { id: "a4", side: "them", text: "I'm doing great!\nJust working on the new project.\nWill share the updates soon.", time: "10:32 AM" },
    { id: "a5", side: "me", text: "Awesome! Can't wait to see it. Let me know if you need anything 🙌", time: "10:33 AM", seen: true },
    { id: "a6", side: "them", text: "Thanks! Will do 👍", time: "10:34 AM" },
  ],
  design: [
    { id: "d1", side: "them", text: "Morning team! Standup in 15 minutes.", time: "9:30 AM", day: "Today" },
    { id: "d2", side: "me", text: "On my way ☕", time: "9:33 AM", seen: true },
    { id: "d3", side: "them", text: "Sorry, please check the new mockups when you can. 🙏", time: "9:45 AM" },
  ],
  jane: [
    { id: "j1", side: "them", text: "Thanks for the update!", time: "4:12 PM", day: "Yesterday" },
    { id: "j2", side: "me", text: "Anytime! Ping me if the report needs changes.", time: "4:15 PM", seen: true },
  ],
  alpha: [
    { id: "p1", side: "them", text: "Joint meeting at 3 PM today.", time: "11:02 AM", day: "Yesterday" },
    { id: "p2", side: "me", text: "Noted. I'll prepare the sprint summary beforehand.", time: "11:10 AM", seen: true },
  ],
  michael: [
    { id: "m1", side: "them", text: "Alright, see you tomorrow 👋", time: "6:40 PM", day: "Monday" },
    { id: "m2", side: "me", text: "See you! Bring the test logs 😄", time: "6:42 PM", seen: true },
  ],
  emily: [
    { id: "e1", side: "them", text: "Can you share the file?", time: "2:20 PM", day: "Sunday" },
    { id: "e2", side: "me", text: "Sure, sending it over now 📎", time: "2:24 PM", seen: true },
  ],
};

const EMOJIS = ["😀", "😂", "😍", "🙌", "👍", "🔥", "🎉", "😊", "🤝", "☕", "📚", "✅", "🙏", "💜"];

/* ================================================================
   SMALL PRESENTATIONAL PARTS
================================================================ */

/** Circular initials avatar with an optional online dot. */
function Avatar({ name, tone = "purple", size = "md", online = false }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span className={`msg-avatar msg-avatar-${size} msg-tone-${tone}`}>
      {initials}
      {online && <i className="msg-avatar-dot" />}
    </span>
  );
}

/** Row with an icon, label and a small on/off switch. */
function ToggleRow({ icon: Icon, label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <button
      type="button"
      className={`msg-toggle-row${on ? " on" : ""}`}
      onClick={() => setOn((value) => !value)}
    >
      <Icon size={15} />
      <span>{label}</span>
      <i className="msg-switch" />
    </button>
  );
}

/* ================================================================
   MESSAGES VIEW
================================================================ */
export default function Messages() {
  const [chats, setChats] = useState(CONTACTS);
  const [threads, setThreads] = useState(THREADS);
  const [activeId, setActiveId] = useState("alex");
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "unread"
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [showThread, setShowThread] = useState(false); // mobile: list <-> thread

  const scrollerRef = useRef(null);
  const emojiWrapRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeId) || chats[0];
  const thread = threads[activeId] || [];

  /* -------- filtered chat list -------- */
  const visibleChats = useMemo(() => {
    const q = query.trim().toLowerCase();

    return chats.filter((chat) => {
      const matchesQuery =
        !q ||
        chat.name.toLowerCase().includes(q) ||
        chat.preview.toLowerCase().includes(q);

      const matchesFilter = filter === "all" || chat.unread > 0;

      return matchesQuery && matchesFilter;
    });
  }, [chats, query, filter]);

  /* -------- auto-scroll to newest message -------- */
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, thread.length]);

  /* -------- close emoji popover on outside click -------- */
  useEffect(() => {
    if (!emojiOpen) return;

    const handlePointerDown = (event) => {
      if (emojiWrapRef.current && !emojiWrapRef.current.contains(event.target)) {
        setEmojiOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [emojiOpen]);

  /* -------- actions -------- */
  const openChat = (id) => {
    setActiveId(id);
    setShowThread(true);
    // clear unread badge for that chat
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, unread: 0 } : chat))
    );
  };

  const handleSend = (event) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setThreads((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        {
          id: `local-${Date.now()}`,
          side: "me",
          text,
          time: now,
          day: "Today",
          seen: false,
        },
      ],
    }));

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeId
          ? { ...chat, preview: text.replace(/\n/g, " "), time: now }
          : chat
      )
    );

    setDraft("");
    setEmojiOpen(false);
  };

  const insertEmoji = (emoji) => {
    setDraft((current) => current + emoji);
    setEmojiOpen(false);
  };

  /* -------- render -------- */
  return (
    <div className={`msg-shell${showThread ? " show-thread" : ""}`}>
      {/* ============================================================
          LEFT: CHAT LIST
      ============================================================ */}
      <section className="msg-panel msg-side">
        <div className="msg-side-head">
          <label className="msg-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search messages…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="msg-side-title">
            <h3>Recent Chats</h3>

            <div className="msg-chips">
              <button
                type="button"
                className={`msg-chip${filter === "all" ? " active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`msg-chip${filter === "unread" ? " active" : ""}`}
                onClick={() => setFilter("unread")}
              >
                Unread
              </button>
            </div>
          </div>
        </div>

        <div className="msg-chat-scroll">
          {visibleChats.length === 0 && (
            <p className="msg-empty">No conversations found.</p>
          )}

          {visibleChats.map((chat) => (
            <button
              type="button"
              key={chat.id}
              className={`msg-chat-item${chat.id === activeId ? " active" : ""}`}
              onClick={() => openChat(chat.id)}
            >
              <Avatar
                name={chat.name}
                tone={chat.tone}
                online={chat.online}
                size="md"
              />

              <span className="msg-chat-main">
                <span className="msg-chat-top">
                  <strong>{chat.name}</strong>
                  <time>{chat.time}</time>
                </span>

                <span className="msg-chat-bottom">
                  <span className="msg-chat-preview">{chat.preview}</span>
                  {chat.unread > 0 && (
                    <span className="msg-unread">{chat.unread}</span>
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================
          CENTER: CONVERSATION
      ============================================================ */}
      <section className="msg-panel msg-thread">
        <div className="msg-thread-head">
          <button
            type="button"
            className="msg-back"
            onClick={() => setShowThread(false)}
            aria-label="Back to chats"
          >
            <ChevronLeft size={20} />
          </button>

          <Avatar
            name={activeChat.name}
            tone={activeChat.tone}
            online={activeChat.online}
            size="md"
          />

          <div className="msg-thread-id">
            <strong>{activeChat.name}</strong>
            <span className={activeChat.online ? "online" : ""}>
              {activeChat.online ? "Online" : "Offline"}
            </span>
          </div>

          <div className="msg-thread-actions">
            <button type="button" aria-label="Start audio call">
              <Phone size={16} />
            </button>
            <button type="button" aria-label="Start video call">
              <Video size={16} />
            </button>
            <button type="button" aria-label="More options">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <div className="msg-thread-body" ref={scrollerRef}>
          {thread.map((message, index) => {
            const previous = thread[index - 1];
            const showDay = !previous || previous.day !== message.day;
            const grouped =
              previous && previous.side === message.side && !showDay;

            return (
              <div key={message.id}>
                {showDay && (
                  <div className="msg-day">
                    <span>{message.day}</span>
                  </div>
                )}

                <div className={`msg-row ${message.side}${grouped ? " grouped" : ""}`}>
                  {message.side === "them" && (
                    <Avatar
                      name={activeChat.name}
                      tone={activeChat.tone}
                      size="sm"
                    />
                  )}

                  <div className="msg-bubble-wrap">
                    <div className="msg-bubble">{message.text}</div>

                    <div className="msg-meta">
                      <span>{message.time}</span>
                      {message.side === "me" &&
                        (message.seen ? (
                          <CheckCheck size={13} />
                        ) : (
                          <Check size={13} />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- composer ---- */}
        <form className="msg-composer" onSubmit={handleSend}>
          <div className="msg-emoji-wrap" ref={emojiWrapRef}>
            {emojiOpen && (
              <div className="msg-emoji-pop">
                {EMOJIS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    aria-label={`Insert ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="msg-icon-btn"
              onClick={() => setEmojiOpen((value) => !value)}
              aria-label="Emoji picker"
            >
              <Smile size={18} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Type a message…"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />

          <button
            type="submit"
            className="msg-send"
            disabled={!draft.trim()}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </section>

      {/* ============================================================
          RIGHT: CONTACT DETAILS
      ============================================================ */}
      <aside className="msg-panel msg-details">
        <div className="msg-details-hero">
          <Avatar
            name={activeChat.name}
            tone={activeChat.tone}
            size="xl"
            online={activeChat.online}
          />

          <h3>{activeChat.name}</h3>

          <span
            className={`msg-details-status${activeChat.online ? " online" : ""}`}
          >
            {activeChat.online ? "Online" : "Offline"}
          </span>

          <div className="msg-details-actions">
            <button type="button">
              <Phone size={15} />
              <span>Audio</span>
            </button>
            <button type="button">
              <Video size={15} />
              <span>Video</span>
            </button>
            <button type="button">
              <Info size={15} />
              <span>Profile</span>
            </button>
            <button type="button">
              <MoreVertical size={15} />
              <span>More</span>
            </button>
          </div>
        </div>

        <div className="msg-details-block">
          <h4>About</h4>
          <p>{activeChat.role}</p>
          <p className="muted">{activeChat.location}</p>
        </div>

        <div className="msg-details-block">
          <div className="msg-details-head">
            <h4>Shared media</h4>
            <button type="button">See all</button>
          </div>

          <div className="msg-media-grid">
            <span>
              <ImageIcon size={16} />
              IMG
            </span>
            <span>
              <FileText size={16} />
              PDF
            </span>
            <span>
              <FileText size={16} />
              DOC
            </span>
          </div>
        </div>

        <div className="msg-details-block">
          <h4>Settings</h4>
          <ToggleRow icon={BellOff} label="Mute notifications" />
          <ToggleRow
            icon={Pin}
            label="Pin chat"
            defaultOn={Boolean(activeChat.pinned)}
          />
          <ToggleRow icon={Info} label="Block contact" />
        </div>
      </aside>
    </div>
  );
}