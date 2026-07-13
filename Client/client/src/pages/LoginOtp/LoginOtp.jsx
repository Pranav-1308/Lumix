import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../services/api";
import "./LoginOTP.css";

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

    <div className="otp-page">

      <div className="left-side">

        <div className="brand">

          <h1>LUMIX</h1>

          <h2>Login Verification</h2>

          <p>

            Enter the OTP sent to your phone.

          </p>

        </div>

      </div>

      <div className="right-side">

        <form

          className="otp-card"

          onSubmit={handleSubmit}

        >

          <h2>Verify OTP</h2>

          <p>

            OTP sent to

          </p>

          <h3>

            +91 {userData.phone}

          </h3>

          <input

            type="text"

            placeholder="Enter 6 Digit OTP"

            maxLength={6}

            value={otp}

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

export default LoginOTP;