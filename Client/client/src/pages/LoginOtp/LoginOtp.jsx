import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../services/api";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

function LoginOTP() {

  const navigate = useNavigate();

  const {
    userData,
    setUser,
    setToken,
  } = useUser();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      const response = await api.post("/auth/verify-otp", {

        phone: userData.phone,
        otp,

      });

      console.log(response.data);

      const { user, accessToken } = response.data.data;

      // Save in Context

      setUser(user);

      setToken(accessToken);

      // Save in LocalStorage

      localStorage.setItem("token", accessToken);

      localStorage.setItem(

        "user",

        JSON.stringify(user)

      );

      alert("Login Successful 🎉");

      navigate("/home");

    } catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Invalid OTP"

      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <AuthLayout
      headline="Login Verification"
      sub="Enter the OTP sent to your phone number to access your account."
    >
      <form onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <p className="welcome">
          OTP sent to <strong style={{ color: "var(--violet)" }}>+91 {userData?.phone}</strong>
        </p>

        <div className="field">
          <input
            type="text"
            placeholder="Enter 6 Digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ letterSpacing: "2px", fontFamily: "monospace" }}
          />
          <span className="icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
        </div>

        <button type="submit" className="cta" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="login-line">
          Incorrect number? <Link to="/login">Change details</Link>
        </p>
      </form>
    </AuthLayout>
  );

}

export default LoginOTP;