import { Navigate } from "react-router-dom";

// 🔹 decode JWT safely
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export default function OwnerRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  // ❌ no token → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const decoded = parseJwt(token);
  const role = decoded?.role;

  console.log("OwnerRoute role:", role);

  // ❌ not owner → login
  if (role !== "OWNER" && role !== "ROLE_OWNER") {
    return <Navigate to="/login" replace />;
  }

  // ✅ owner allowed
  return children;
}
