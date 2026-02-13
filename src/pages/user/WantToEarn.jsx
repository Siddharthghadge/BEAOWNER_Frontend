import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authApi from "../../api/authApi";

export default function WantToEarn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "OWNER", // ✅ Fixed OWNER
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await authApi.post("/api/auth/register", form);
      alert("Owner registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Owner Register Error:", err.response?.data);

      const errorMsg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Owner registration failed";

      alert(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Become an Owner 💰</h2>
        <p style={styles.subtitle}>
          Register as Owner & start earning by listing your items / vehicles
        </p>

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              name="name"
              placeholder="Full Name"
              style={styles.input}
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              style={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            style={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            style={styles.input}
            value={form.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Your Address"
            style={{ ...styles.input, height: "80px", paddingTop: "10px" }}
            value={form.address}
            onChange={handleChange}
            required
          />

          {/* ✅ Role fixed for OWNER */}
          <div style={styles.fixedRoleBox}>
            Registering as: <b>OWNER</b>
          </div>

          <button type="submit" style={styles.button}>
            Register as Owner
          </button>
        </form>

        <p style={styles.footerText}>
          Want to rent products as a customer?{" "}
          <Link to="/register" style={styles.link}>
            Customer Register
          </Link>
        </p>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

// --- Same Modern Styles ---
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7f6",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: { fontSize: "2rem", color: "#333", marginBottom: "10px" },
  subtitle: { color: "#666", marginBottom: "30px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", gap: "10px" },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  },
  fixedRoleBox: {
    background: "#f1f1f1",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#333",
    textAlign: "left",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s",
  },
  footerText: { marginTop: "15px", color: "#666" },
  link: { color: "#007bff", textDecoration: "none", fontWeight: "600" },
};
