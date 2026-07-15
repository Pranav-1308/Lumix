import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

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
    <AuthLayout
      headline="Connect Beyond Messages"
      sub="Chat with your friends securely and instantly."
      features={[
        { icon: "💬", text: "Instant Messaging" },
        { icon: "🔒", text: "Secure Chat" },
        { icon: "🌍", text: "Connect Anywhere" }
      ]}
    >
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="welcome">Welcome to LUMIX 👋</p>

        <div className="upload-wrap">
          <label htmlFor="avatar" className="upload-circle">
            {preview ? (
              <img
                src={preview}
                alt="Avatar Preview"
                style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", position: "absolute", inset: 0, zIndex: 3 }}
              />
            ) : (
              <div className="inner">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 8h3l2-2h6l2 2h3v11H4z"/>
                  <circle cx="12" cy="13" r="3.2"/>
                </svg>
                <span>Upload Photo</span>
              </div>
            )}
          </label>
        </div>
        <input
          type="file"
          id="avatar"
          hidden
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        <div className="field">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <span className="icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </span>
        </div>

        <div className="field">
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <span className="icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z"/>
            </svg>
          </span>
        </div>

        <button type="submit" className="cta">
          Send OTP
        </button>

        <p className="login-line">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );

}

export default Register;