import { useState, useRef, useEffect } from "react";
import "./ChatListPanel.css";

import { FaSearch, FaTimes } from "react-icons/fa";
import ChatCard from "../ChatCard/ChatCard";

function ChatListPanel({ chats, selectedChatId, onSelectChat, activeView }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  /* Focus input when search opens */
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchToggle = () => {
    setSearchOpen((prev) => {
      if (prev) setSearchQuery("");
      return !prev;
    });
  };

  /* Filter chats by activeView then by search query */
  const filtered = chats
    .filter((c) => activeView === "all" || c.category === activeView)
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q)
      );
    });

  const viewLabel = {
    all:      "All Chats",
    personal: "Personal",
    otp:      "OTP",
    spam:     "Spam",
    finance:  "Finance",
  };

  return (
    <section className="chat-list-panel">

      {/* ── Header ─────────────────────────────── */}
      <div className="clp-header">
        <div className="clp-header-left">
          <h2 className="clp-title">Lumix</h2>
          {activeView !== "all" && (
            <span className="clp-filter-badge">{viewLabel[activeView]}</span>
          )}
        </div>
        <button
          className={`clp-search-btn ${searchOpen ? "active" : ""}`}
          onClick={handleSearchToggle}
          title={searchOpen ? "Close search" : "Search"}
        >
          {searchOpen ? <FaTimes /> : <FaSearch />}
        </button>
      </div>

      {/* ── Search Bar (animated slide) ─────────── */}
      <div className={`clp-search-wrapper ${searchOpen ? "open" : ""}`}>
        <div className="clp-search-inner">
          <FaSearch className="clp-search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search chats…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Chat Rows ──────────────────────────── */}
      <div className="clp-list">
        {filtered.length === 0 ? (
          <div className="clp-empty">
            <p>No chats found</p>
          </div>
        ) : (
          filtered.map((chat) => (
            <ChatCard
              key={chat.id}
              {...chat}
              isActive={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))
        )}
      </div>

    </section>
  );
}

export default ChatListPanel;
