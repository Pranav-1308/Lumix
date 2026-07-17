import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import OTP from "./pages/OTP/OTP";
import Home from "./pages/Home/Home";
import LoginOTP from "./pages/LoginOTP/LoginOTP";
import Inbox from "./pages/Inbox/Inbox";
import InboxHistory from "./components/InboxHistory/InboxHistory";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/otp"
        element={<OTP />}
      />

      <Route
        path="/login-otp"
        element={<LoginOTP />}
      />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inbox/:category"
        element={
          <ProtectedRoute>
            <Inbox />
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;







// import { Routes, Route } from "react-router-dom";

// import Register from "./pages/Register/Register";
// import Login from "./pages/Login/Login";
// import OTP from "./pages/OTP/OTP";
// import Home from "./pages/Home/Home";
// import LoginOTP from "./pages/LoginOTP/LoginOTP";

// function App() {
//   return (
//     <Routes>

//       <Route path="/" element={<Register />} />

//       <Route path="/login" element={<Login />} />

//       <Route path="/otp" element={<OTP />} />

//       <Route path="/home" element={<Home />} />

//       <Route path="/login-otp" element={<LoginOTP />} />

//     </Routes>
//   );
// }

// export default App;

// import Home from "./pages/Home/Home";

// function App() {
//   return (
//     <Home />
//   );
// }

// export default App;