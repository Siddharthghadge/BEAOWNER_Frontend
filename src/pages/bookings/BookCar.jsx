import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../api/userService";
import bookingService from "../../api/bookingService";
import axios from "axios";
import { API_URLS } from "../../config/apiUrls";

export default function BookCar() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Added car state (required to get ownerId/ownerEmail/price)
  const [car, setCar] = useState(null);

  // Form States
  const [formData, setFormData] = useState({ startDate: "", endDate: "" });
  const [files, setFiles] = useState({ license: null, aadhar: null });
  const [consents, setConsents] = useState({ privacy: false, terms: false });
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ Fetch car details to get ownerId/ownerEmail
 useEffect(() => {
  const fetchCar = async () => {
    try {
      const res = await axios.get(`${API_URLS.CAR}/api/cars/${id}`);
      setCar(res.data);
    } catch (err) {
      console.error("Error fetching car details:", err);
    }
  };

  fetchCar();
}, [id]);

  // Helper to check if button should be enabled
  const isFormValid =
    formData.startDate &&
    formData.endDate &&
    files.license &&
    files.aadhar &&
    consents.privacy &&
    consents.terms;

  const handleBookingClick = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // ✅ Ensure car loaded
      if (!car) {
        alert("❌ Car details not loaded. Please refresh.");
        setIsProcessing(false);
        return;
      }

      // 1. Upload Documents First
      const uploadData = new FormData();
      uploadData.append("license", files.license);
      uploadData.append("aadhar", files.aadhar);

      const token = localStorage.getItem("accessToken");

     await axios.post(
  `${API_URLS.USER}/api/users/upload-identity`,
  uploadData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);

      // ✅ Calculate totalAmount (required by backend)
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffMs = end - start;
      const hours = diffMs / 36e5;
      const totalAmount = hours > 0 ? Number((hours * car.pricePerHour).toFixed(2)) : 0;

      // 2. Then Create Booking ✅ (FIXED PAYLOAD)
      const bookingRes = await bookingService.createBooking({
        carId: Number(id),

        // ✅ Required fields
        ownerId: car.ownerId,
        ownerEmail: car.ownerEmail,
        bookingType: "SELF_DRIVE",

        // ✅ Must match backend field names
        startDate: formData.startDate.includes("T") ? formData.startDate : `${formData.startDate}:00`,
        endDate: formData.endDate.includes("T") ? formData.endDate : `${formData.endDate}:00`,

        // ✅ Required by DTO (@NotNull)
        totalAmount: totalAmount,
      });

      alert("✅ Documents uploaded and Booking created!");
      navigate(`/bookings/${bookingRes.data.id}`);
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);
      alert("❌ Process failed. Please check your files and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ background: "#f9f9f9", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginBottom: "20px" }}>Book This Car</h3>

        <form onSubmit={handleBookingClick} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

          {/* Date Inputs */}
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Start Date & Time</label>
            <input
              type="datetime-local"
              required
              style={{ width: "100%", padding: "10px" }}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>End Date & Time</label>
            <input
              type="datetime-local"
              required
              style={{ width: "100%", padding: "10px" }}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <hr />

          {/* NEW: File Upload Section */}
          <div style={{ background: "#fff", padding: "15px", borderRadius: "5px", border: "1px solid #ddd" }}>
            <p style={{ marginTop: "0", fontWeight: "bold", color: "#d63031" }}>Verification Required</p>

            <label style={{ fontSize: "14px" }}>Driving License (Image)</label>
            <input
              type="file"
              accept="image/*"
              required
              style={{ marginBottom: "10px" }}
              onChange={(e) => setFiles({ ...files, license: e.target.files[0] })}
            />

            <label style={{ fontSize: "14px" }}>Aadhar Card (Image)</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFiles({ ...files, aadhar: e.target.files[0] })}
            />
          </div>

          {/* NEW: Checkbox Section */}
          <div style={{ fontSize: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consents.privacy}
                onChange={(e) => setConsents({ ...consents, privacy: e.target.checked })}
              />
              I agree to the Privacy Policy
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consents.terms}
                onChange={(e) => setConsents({ ...consents, terms: e.target.checked })}
              />
              I accept the Terms and Conditions
            </label>
          </div>

          {/* Updated Button with Disabled Logic */}
          <button
            type="submit"
            disabled={!isFormValid || isProcessing}
            style={{
              padding: "14px",
              backgroundColor: (!isFormValid || isProcessing) ? "#a29bfe" : "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: (!isFormValid || isProcessing) ? "not-allowed" : "pointer",
              transition: "0.3s"
            }}
          >
            {isProcessing ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
