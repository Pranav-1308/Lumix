import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCamera, FaUser, FaPhoneAlt } from "react-icons/fa";
import "./Register.css";

function Register() {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      phone,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/fullname`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      console.log("Status Code:", response.status);

      if (!response.ok) {
        const errorText = await response.text();

        console.log("Backend Error:");
        console.log(errorText);

        alert(`Request Failed (${response.status})`);
        return;
      }

      const data = await response.json();

      console.log("Success:", data);

      alert("Registration Successful!");

    } catch (error) {
      console.error("Network Error:", error);
      alert("Unable to connect to the backend.");
    }
  };

  return (
    <div className="register-page">

      <div className="left-side">
        <div className="brand">

          <h1>LUMIX</h1>

          <h2>Connect Beyond Messages</h2>

          <p>
            Chat with your friends securely and instantly.
          </p>

          <ul>
            <li>💬 Instant Messaging</li>
            <li>🔒 Secure Chat</li>
            <li>🌍 Connect Anywhere</li>
          </ul>

        </div>
      </div>

      <div className="right-side">

        <form className="register-card" onSubmit={handleSubmit}>

          <h2>Create Account</h2>

          <p>Welcome to LUMIX 👋</p>

          <div className="avatar-upload">

            <label htmlFor="avatar">

              {avatar ? (
                <img src={avatar} alt="Avatar" />
              ) : (
                <>
                  <FaCamera className="camera-icon" />
                  <span>Upload Photo</span>
                </>
              )}

            </label>

            <input
              type="file"
              id="avatar"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />

          </div>

          <div className="input-box">

            <FaUser />

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>

          <div className="input-box">

            <FaPhoneAlt />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              maxLength={10}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

          </div>

          <button type="submit">
            Create Account
          </button>

          <p className="bottom-text">
            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
}

export default Register;