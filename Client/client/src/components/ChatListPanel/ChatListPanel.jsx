// import { useMemo, useState } from "react";
// import "./ChatListPanel.css";

// import {
//   FaSearch,
//   FaComments,
//   FaShieldAlt,
//   FaExclamationTriangle,
//   FaMoneyBillWave,
// } from "react-icons/fa";

// function ChatListPanel({
//   chats = [],
//   selectedChatId,
//   onSelectChat,
//   activeView,
// }) {

//   const [searchText, setSearchText] = useState("");

//   // ==========================
//   // Filter Chats
//   // ==========================

//   const filteredChats = useMemo(() => {

//     return chats.filter((chat) => {

//       const matchesCategory =
//         activeView === "all"
//           ? true
//           : chat.category === activeView;

//       const matchesSearch =
//         chat.name
//           .toLowerCase()
//           .includes(searchText.toLowerCase());

//       return matchesCategory && matchesSearch;

//     });

//   }, [chats, activeView, searchText]);

//   // ==========================
//   // Header Title
//   // ==========================

//   const getTitle = () => {

//     switch (activeView) {

//       case "otp":
//         return "OTP Messages";

//       case "spam":
//         return "Spam Messages";

//       case "finance":
//         return "Finance Messages";

//       case "personal":
//         return "Personal Chats";

//       default:
//         return "All Chats";

//     }

//   };

//   const getIcon = () => {

//     switch (activeView) {

//       case "otp":
//         return <FaShieldAlt />;

//       case "spam":
//         return <FaExclamationTriangle />;

//       case "finance":
//         return <FaMoneyBillWave />;

//       default:
//         return <FaComments />;

//     }

//   };

//   return (

//     <div className="chat-list-panel">

//       {/* Header */}

//       <div className="cl-header">

//         <h2>

//           {getIcon()} {getTitle()}

//         </h2>

//       </div>

//       {/* Search */}

//       <div className="cl-search">

//         <FaSearch />

//         <input
//           type="text"
//           placeholder="Search chats..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />

//       </div>

//       {/* Chats */}

//       <div className="cl-list">

//         {filteredChats.length === 0 ? (

//           <div className="cl-empty">

//             <h3>No Chats Found</h3>

//             <p>

//               No conversations available.

//             </p>

//           </div>

//         ) : (

//           filteredChats.map((chat) => (

//             <div

//               key={chat.id}

//               className={`chat-card ${
//                 selectedChatId === chat.id
//                   ? "selected"
//                   : ""
//               }`}

//               onClick={() =>
//                 onSelectChat(chat.id)
//               }

//             >

//               <div className="chat-avatar">

//                 <img
//                   src={chat.avatar}
//                   alt={chat.name}
//                 />

//                 {chat.isOnline && (

//                   <span className="online-dot" />

//                 )}

//               </div>

//               <div className="chat-details">

//                 <div className="chat-top">

//                   <h4>{chat.name}</h4>

//                   <span>

//                     {chat.time}

//                   </span>

//                 </div>

//                 <div className="chat-bottom">

//                   <p>

//                     {chat.message}

//                   </p>

//                   {chat.unread > 0 && (

//                     <span className="unread">

//                       {chat.unread}

//                     </span>

//                   )}

//                 </div>

//               </div>

//             </div>

//           ))

//         )}

//       </div>

//     </div>

//   );

// }

// export default ChatListPanel;









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
    all: "All Chats",
    personal: "Personal",
    otp: "OTP",
    spam: "Spam",
    finance: "Finance",
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
