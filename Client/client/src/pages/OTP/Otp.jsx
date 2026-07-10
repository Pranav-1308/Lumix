import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./OTP.css";

function OTP() {

  const navigate = useNavigate();

  // Get user data from Context
  const { userData } = useUser();

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // ===============================
      // STEP 1 : VERIFY OTP
      // ===============================

      const otpResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            phone: userData.phone,
            otp: otp,
          }),
        }
      );

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {

        alert(otpData.message || "Invalid OTP");

        return;

      }

      alert("OTP Verified Successfully");

      // ===============================
      // STEP 2 : REGISTER USER
      // ===============================

      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("avatar", userData.avatar);

      const registerResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        {
          method: "POST",
          body: formData,
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {

        alert(registerData.message || "Registration Failed");

        return;

      }

      // Save JWT if backend returns it
      if (registerData.token) {

        localStorage.setItem("token", registerData.token);

      }

      alert("Registration Successful");

      navigate("/home");

    } catch (error) {

      console.log(error);

      alert("Unable to connect to backend");

    }

  };

  return (

    <div className="otp-page">

      {/* Left Side */}

      <div className="left-side">

        <div className="brand">

          <h1>LUMIX</h1>

          <h2>Verify Your OTP</h2>

          <p>
            Enter the OTP sent to your phone number.
          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="right-side">

        <form className="otp-card" onSubmit={handleSubmit}>

          <h2>OTP Verification</h2>

          <p>

            OTP sent to

          </p>

          <h3>

            +91 {userData.phone}

          </h3>

          <input
            type="text"
            placeholder="Enter 6 Digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit">

            Verify OTP

          </button>

        </form>

      </div>

    </div>

  );

}

export default OTP;