import { useState } from "react";
import "./SideBar.css";

import { FaCommentDots, FaLayerGroup, FaSignOutAlt } from "react-icons/fa";

const FILTERS = [
  { key: "all",      label: "All Chats" },
  { key: "personal", label: "Personal"  },
  { key: "otp",      label: "OTP"       },
  { key: "spam",     label: "Spam"      },
  { key: "finance",  label: "Finance"   },
];

function Sidebar({ activeView, setActiveView }) {
  const [inboxOpen, setInboxOpen] = useState(false);

  const handleInboxClick = () => {
    setInboxOpen((prev) => !prev);
  };

  const handleFilterSelect = (key) => {
    setActiveView(key);
    setInboxOpen(false);
  };

  return (
    <aside className="sidebar">

      {/* ── Logo ────────────────────── */}
      <div className="sidebar-logo">
        <span>L</span>
      </div>

      {/* ── Nav Icons ───────────────── */}
      <nav className="sidebar-nav">

        {/* All Chats */}
        <div
          className={`rail-icon ${activeView === "all" && !inboxOpen ? "active" : ""}`}
          title="All Chats"
          onClick={() => { setActiveView("all"); setInboxOpen(false); }}
        >
          <FaCommentDots />
        </div>

        {/* Inbox / Filter */}
        <div className="rail-icon-wrapper">
          <div
            className={`rail-icon ${inboxOpen ? "active" : ""}`}
            title="Inbox"
            onClick={handleInboxClick}
          >
            <FaLayerGroup />
          </div>

          {/* Filter Sub-Panel */}
          {inboxOpen && (
            <div className="filter-panel">
              <p className="filter-panel-title">Inbox</p>
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`filter-item ${activeView === f.key ? "filter-active" : ""}`}
                  onClick={() => handleFilterSelect(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

      </nav>

      {/* ── Logout ──────────────────── */}
      <div className="rail-icon logout-icon" title="Logout">
        <FaSignOutAlt />
      </div>

    </aside>
  );
}

export default Sidebar;