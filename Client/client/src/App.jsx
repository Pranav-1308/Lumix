import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import OTP from "./pages/OTP/OTP";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Register />} />

      <Route path="/login" element={<Login />} />

      <Route path="/otp" element={<OTP />} />

      <Route path="/home" element={<Home />} />

    </Routes>
  );
}

export default App;