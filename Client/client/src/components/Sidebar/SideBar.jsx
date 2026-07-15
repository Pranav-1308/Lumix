// import "./Sidebar.css";

// import {
//   FaHome,
//   FaUser,
//   FaShieldAlt,
//   FaExclamationTriangle,
//   FaMoneyCheckAlt,
//   FaCog,
//   FaSignOutAlt,
// } from "react-icons/fa";

// import { useNavigate } from "react-router-dom";
// import socket from "../../services/socket";

// function Sidebar({

//   activeView,

//   setActiveView,

// }) {

//   const navigate = useNavigate();

//   // ============================
//   // Logout
//   // ============================

//   const handleLogout = () => {

//     try {

//       socket.disconnect();

//     } catch (error) {

//       console.log(error);

//     }

//     localStorage.removeItem("token");

//     localStorage.removeItem("user");

//     navigate("/login");

//   };

//   return (

//     <div className="sidebar">

//       {/* =========================
//           Profile
//       ========================== */}

//       <div className="profile">

//         <img
//           src="https://i.pravatar.cc/150?img=12"
//           alt="Profile"
//         />

//         <h3>LUMIX</h3>

//         <p>Smart Chat</p>

//       </div>

//       {/* =========================
//           Menu
//       ========================== */}

//       <ul className="menu">

//         <li

//           className={

//             activeView === "all"

//               ? "active"

//               : ""

//           }

//           onClick={() =>

//             setActiveView("all")

//           }

//         >

//           <FaHome />

//           <span>Home</span>

//         </li>

//         <li

//           className={

//             activeView === "personal"

//               ? "active"

//               : ""

//           }

//           onClick={() =>

//             setActiveView("personal")

//           }

//         >

//           <FaUser />

//           <span>Personal</span>

//         </li>

//         <li

//           className={

//             activeView === "otp"

//               ? "active"

//               : ""

//           }

//           onClick={() =>

//             setActiveView("otp")

//           }

//         >

//           <FaShieldAlt />

//           <span>OTP</span>

//         </li>

//         <li

//           className={

//             activeView === "spam"

//               ? "active"

//               : ""

//           }

//           onClick={() =>

//             setActiveView("spam")

//           }

//         >

//           <FaExclamationTriangle />

//           <span>Spam</span>

//         </li>

//         <li

//           className={

//             activeView === "finance"

//               ? "active"

//               : ""

//           }

//           onClick={() =>

//             setActiveView("finance")

//           }

//         >

//           <FaMoneyCheckAlt />

//           <span>Finance</span>

//         </li>

//         <li>

//           <FaCog />

//           <span>Settings</span>

//         </li>

//       </ul>

//       {/* =========================
//           Logout
//       ========================== */}

//       <button

//         className="logout-btn"

//         onClick={handleLogout}

//       >

//         <FaSignOutAlt />

//         Logout

//       </button>

//     </div>

//   );

// }

// export default Sidebar;





import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SideBar.css";

import { FaCommentDots, FaLayerGroup, FaSignOutAlt } from "react-icons/fa";
import socket from "../../services/socket";
import { useUser } from "../../context/UserContext";

const FILTERS = [
  { key: "all", label: "All Chats" },
  { key: "personal", label: "Personal" },
  { key: "otp", label: "OTP" },
  { key: "Offer", label: "Offers" },
  { key: "Bank", label: "Bank" },
];

function Sidebar({ activeView, setActiveView }) {

  const navigate = useNavigate();
  const { logout } = useUser();
  const [inboxOpen, setInboxOpen] = useState(false);

  const handleInboxClick = () => {
    setInboxOpen((prev) => !prev);
  };

  const handleFilterSelect = (key) => {
    setActiveView(key);
    setInboxOpen(false);
  };

  const handleLogout = () => {

  try {

    // Disconnect Socket
    socket.disconnect();

  } catch (error) {

    console.log("Socket Disconnect Error:", error);

  }

  // Clear Context + LocalStorage
  logout();

  // Navigate to Login
  navigate("/login", { replace: true });

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
      <div className="rail-icon logout-icon" title="Logout" onClick={handleLogout}>
        <FaSignOutAlt />
      </div>

    </aside>
  );
}

export default Sidebar;