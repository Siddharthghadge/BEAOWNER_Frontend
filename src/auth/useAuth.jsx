
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import authApi from "../api/authApi";



function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
}

export default function useAuth() {
  const { setUser } = useContext(AuthContext);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });

    const token = res.data.accessToken;
    localStorage.setItem("accessToken", token);

    const decoded = parseJwt(token);

    const user = {
      email: decoded.sub,
      role: decoded.role, // CUSTOMER / OWNER / ADMIN
    };

    localStorage.setItem("userRole", decoded.role);
    setUser(user);

    return user;
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    localStorage.clear();
    setUser(null);
  };

  return { login, logout };
}
