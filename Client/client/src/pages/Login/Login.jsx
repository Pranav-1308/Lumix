import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";
import "./Login.css";

function Login() {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      phone,
    });

    // API Integration will be added later
  };

  return (
    <div className="login-page">
      {/* Left Side */}

      <div className="left-side">
        <div className="brand">
          <h1>LUMIX</h1>

          <h2>Welcome Back 👋</h2>

          <p>
            Continue your conversations with your friends.
            Fast, secure and beautiful messaging experience.
          </p>

          <ul>
            <li>💬 Real-Time Messaging</li>
            <li>🔒 Secure Communication</li>
            <li>🌍 Stay Connected Everywhere</li>
          </ul>
        </div>
      </div>

      {/* Right Side */}

      <div className="right-side">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <p>Login to your account</p>

          <div className="input-box">
            <FaPhoneAlt />

            <input
              type="tel"
              placeholder="Phone Number"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <button type="submit">
            Continue
          </button>

          <p className="bottom-text">
            Don't have an account?

            <Link to="/">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;