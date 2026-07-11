import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./OTP.css";

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

        <form
          className="otp-card"
          onSubmit={handleSubmit}
        >

          <h2>OTP Verification</h2>

          <p>OTP sent to</p>

          <h3>+91 {userData.phone}</h3>

          <input
            type="text"
            placeholder="Enter 6 Digit OTP"
            value={otp}
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >

            {loading ? "Verifying..." : "Verify OTP"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default OTP;