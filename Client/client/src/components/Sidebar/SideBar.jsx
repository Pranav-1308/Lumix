import "./Sidebar.css";

import {
  FaHome,
  FaUser,
  FaShieldAlt,
  FaExclamationTriangle,
  FaMoneyCheckAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Profile */}

      <div className="profile">

        <img
          src="https://i.pravatar.cc/150?img=15"
          alt="Profile"
        />

        <h2>Soni</h2>

        <p>🟢 Online</p>

      </div>

      {/* Menu */}

      <ul className="menu">

        <li className="active">
          <FaHome />
          <span>Home</span>
        </li>

        <li>
          <FaUser />
          <span>Profile</span>
        </li>

        <li>
          <FaShieldAlt />
          <span>OTP</span>
        </li>

        <li>
          <FaExclamationTriangle />
          <span>Spam</span>
        </li>

        <li>
          <FaMoneyCheckAlt />
          <span>Finance</span>
        </li>

        <li>
          <FaCog />
          <span>Settings</span>
        </li>

      </ul>

      {/* Logout */}

      <button className="logout-btn">

        <FaSignOutAlt />

        <span>Logout</span>

      </button>

    </aside>
  );
}

export default Sidebar;