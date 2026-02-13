// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  // Wait for AuthProvider to finish reading LocalStorage
  if (!authReady) return <p>Loading...</p>;

  // If no token, go to login
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;