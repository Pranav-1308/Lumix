import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function ProtectedRoute({ children }) {

  const { token } = useUser();

  if (!token) {

    return <Navigate to="/login" replace />;

  }

  return children;

}

export default ProtectedRoute;