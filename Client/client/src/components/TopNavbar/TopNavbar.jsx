import "./TopNavbar.css";

import {
  FaBell,
  FaCog,
  FaMoon,
} from "react-icons/fa";

function TopNavbar() {
  return (
    <header className="top-navbar">

      {/* Left Section */}

      <div className="navbar-left">

        <h1>LUMIX</h1>

        <p>Connect Beyond Messages</p>

      </div>

      {/* Right Section */}

      <div className="navbar-right">

        {/* Notification */}

        <div className="nav-icon">

          <FaBell />

          <span className="badge">3</span>

        </div>

        {/* Dark Mode */}

        <div className="nav-icon">

          <FaMoon />

        </div>

        {/* Settings */}

        <div className="nav-icon">

          <FaCog />

        </div>

        {/* User Avatar */}

        <img
          src="https://i.pravatar.cc/150?img=15"
          alt="Profile"
          className="user-avatar"
        />

      </div>

    </header>
  );
}

export default TopNavbar;