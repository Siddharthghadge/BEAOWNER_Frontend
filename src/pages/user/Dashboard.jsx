// src/pages/Dashboard.jsx
import React from "react";
import useAuth from "../../auth/useAuth";

export default function Dashboard(){
  const { user, logout } = useAuth();
  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.email} (role: {user?.role})</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
