import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCamera, FaUser, FaPhoneAlt } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  // User Context
  const { setUserData } = useUser();

  // States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  // Image Upload
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  // Form Submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    // Save data in Context
    setUserData({
      name,
      phone,
      avatar,
    });

    try {

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/v1/auth/send-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
      }),
    }
  );

  // Read JSON response
  const data = await response.json();

  console.log("Backend Response:", data);

  if (response.ok) {

    alert("OTP Sent Successfully");

    console.log("Navigating to OTP...");

    navigate("/otp");

  } else {

    alert(data.message || "Unable to Send OTP");

  }

} catch (error) {

  console.log(error);

  alert("Unable to connect backend");

}

  };

  return (

    <div className="register-page">

      {/* Left Side */}

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

      {/* Right Side */}

      <div className="right-side">

        <form className="register-card" onSubmit={handleSubmit}>

          <h2>Create Account</h2>

          <p>Welcome to LUMIX 👋</p>

          {/* Avatar */}

          <div className="avatar-upload">

            <label htmlFor="avatar">

              {preview ? (

                <img src={preview} alt="Avatar" />

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
              required
            />

          </div>

          {/* Name */}

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

          {/* Phone */}

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
            Send OTP
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