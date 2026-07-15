import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import AuthLayout from "../../components/AuthLayout/AuthLayout";

function OTP() {

  const navigate = useNavigate();

  const { userData } = useUser();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      // ====================================
      // STEP 1 : VERIFY OTP
      // ====================================

      const otpResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: userData.phone,
            otp,
          }),
        }
      );

      const otpData = await otpResponse.json();

      console.log("OTP Response:", otpData);

      if (!otpResponse.ok) {

        alert(otpData.message || "Invalid OTP");

        setLoading(false);

        return;

      }

      alert("OTP Verified Successfully");

      // ====================================
      // STEP 2 : REGISTER USER
      // ====================================

      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);

      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }

      const registerResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const registerData = await registerResponse.json();

      console.log("Register Response:", registerData);

      if (!registerResponse.ok) {

        // User already exists
        if (registerResponse.status === 409) {

          alert("User already exists.");

        } else {

          alert(registerData.message || "Registration Failed");

        }

        setLoading(false);

        return;

      }

      // Save Token (if backend returns it)

      if (registerData.token) {

        localStorage.setItem("token", registerData.token);

      }

      // Save User

      if (registerData.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(registerData.data)
        );

      }

      alert("Registration Successful 🎉");

      navigate("/home");

    } catch (error) {

      console.error(error);

      alert("Unable to connect to backend");

    } finally {

      setLoading(false);

    }

  };

  return (
    <AuthLayout
      headline="Verify Your OTP"
      sub="Enter the OTP sent to your phone number to complete registration."
    >
      <form onSubmit={handleSubmit}>
        <h2>OTP Verification</h2>
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
          Incorrect number? <Link to="/">Change details</Link>
        </p>
      </form>
    </AuthLayout>
  );

}

export default OTP;