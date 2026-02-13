import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import paymentService from "../../api/paymentService"; // Verify this path
import OwnerNavbar from "@/components/common/OwnerNavbar";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.id) return;
      try {
        const res = await paymentService.getWalletSummary(user.id);
        setBalance(res.data.currentBalance);
      } catch (err) {
        console.error("Error fetching vehicle wallet:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [user?.id]);

  return (
    <div style={styles.page}>
      <OwnerNavbar />
      
      <div style={styles.container}>
        {/* Breadcrumb / Back Link */}
        <button onClick={() => navigate("/owner/home")} style={styles.backBtn}>
          ← Back to Main Hub
        </button>

        <header style={styles.header}>
          <h2 style={styles.title}>Vehicle Fleet Management</h2>
          <p style={styles.subtitle}>Control your cars, bikes, and check your transport earnings</p>
        </header>

        {/* --- VEHICLE EARNINGS BANNER --- */}
        <div style={styles.earningsCard}>
          <div style={styles.earningInfo}>
            <span style={styles.earningLabel}>Vehicle Business Earnings</span>
            <h3 style={styles.earningValue}>
              {loading ? "..." : `₹${balance.toLocaleString()}`}
            </h3>
          </div>
          <Link to="/owner/wallet" style={styles.walletBtn}>View Wallet Details</Link>
        </div>

        <div style={styles.grid}>
          {/* --- BIKES SECTION --- */}
          <div style={styles.sectionCard}>
            <div style={styles.cardHeader}>
               <span style={styles.iconCircle}>🏍️</span>
               <h3 style={styles.sectionTitle}>Bike Fleet</h3>
            </div>
            <p style={styles.cardText}>Manage scooters, sports bikes, and daily commuters.</p>
            <div style={styles.buttonGroup}>
              <Link to="/owner/add-bike" style={styles.primaryLink}>+ Add New Bike</Link>
              <Link to="/owner/my-bikes" style={styles.secondaryLink}>View My Bikes</Link>
            </div>
          </div>

          {/* --- CARS SECTION --- */}
          <div style={styles.sectionCard}>
            <div style={styles.cardHeader}>
               <span style={styles.iconCircle}>🚗</span>
               <h3 style={styles.sectionTitle}>Car Fleet</h3>
            </div>
            <p style={styles.cardText}>Manage hatchbacks, SUVs, and luxury rentals.</p>
            <div style={styles.buttonGroup}>
              <Link to="/owner/add-car" style={styles.primaryLink}>+ Add New Car</Link>
              <Link to="/owner/my-cars" style={styles.secondaryLink}>View My Cars</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#f8fafc", minHeight: "100vh" },
  container: { padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "Inter, sans-serif" },
  backBtn: { background: "none", border: "none", color: "#6366f1", fontWeight: "600", cursor: "pointer", marginBottom: "20px" },
  header: { marginBottom: "30px", textAlign: "left" },
  title: { fontSize: "32px", color: "#0f172a", margin: "0 0 8px 0", fontWeight: "800" },
  subtitle: { color: "#64748b", fontSize: "16px" },
  
  // Earnings Section
  earningsCard: { 
    background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", 
    padding: "30px", borderRadius: "20px", display: "flex", 
    justifyContent: "space-between", alignItems: "center", marginBottom: "40px",
    color: "#fff", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
  },
  earningLabel: { fontSize: "14px", opacity: 0.8 },
  earningValue: { fontSize: "32px", margin: "5px 0 0 0", fontWeight: "700" },
  walletBtn: { 
    backgroundColor: "#fff", color: "#1e293b", padding: "12px 20px", 
    borderRadius: "12px", textDecoration: "none", fontWeight: "700", fontSize: "14px" 
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" },
  sectionCard: { 
    padding: "30px", backgroundColor: "#fff", borderRadius: "20px", 
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0"
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" },
  iconCircle: { width: "45px", height: "45px", background: "#f1f5f9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" },
  sectionTitle: { fontSize: "20px", fontWeight: "700", color: "#1e293b", margin: 0 },
  cardText: { color: "#64748b", fontSize: "14px", marginBottom: "25px" },
  
  buttonGroup: { display: "flex", flexDirection: "column", gap: "12px" },
  primaryLink: { 
    display: "block", textAlign: "center", padding: "14px", 
    backgroundColor: "#2563eb", color: "#fff", textDecoration: "none", 
    borderRadius: "12px", fontWeight: "700", transition: "0.2s" 
  },
  secondaryLink: { 
    display: "block", textAlign: "center", padding: "14px", 
    backgroundColor: "#fff", color: "#475569", textDecoration: "none", 
    borderRadius: "12px", fontWeight: "600", border: "1px solid #e2e8f0"
  }
};