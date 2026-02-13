import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bookingService from "../../api/bookingService";
import { API_URLS } from "../../config/apiUrls";


export default function IdentityUpload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({ license: null, aadhar: null });
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const pendingData = JSON.parse(sessionStorage.getItem("pendingBooking"));

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("license", files.license); // Matches @RequestParam("license")
    formData.append("aadhar", files.aadhar);   // Matches @RequestParam("aadhar")

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
    `${API_URLS.USER}/api/users/upload-identity`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );

      setIsUploaded(true);
      alert("✅ Documents uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Please check if the file size is too large.");
    } finally {
      setUploading(false);
    }
  };

  const finalizeBooking = async () => {
    try {
      if (!pendingData) {
        alert("No booking details found. Restarting process.");
        navigate("/cars");
        return;
      }

      await bookingService.createBooking(pendingData);
      sessionStorage.removeItem("pendingBooking");
      alert("🎉 Booking Successful!");
      navigate("/my-bookings");
    } catch (err) {
      alert("❌ Failed to create booking. Please try again.");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>
      <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <h2>{isUploaded ? "Ready to Book!" : "Identity Verification"}</h2>
        
        {!isUploaded ? (
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "left" }}>
              <label><b>Driving License</b></label>
              <input type="file" required onChange={(e) => setFiles({ ...files, license: e.target.files[0] })} />
            </div>
            <div style={{ textAlign: "left" }}>
              <label><b>Aadhar Card</b></label>
              <input type="file" required onChange={(e) => setFiles({ ...files, aadhar: e.target.files[0] })} />
            </div>
            <button type="submit" disabled={uploading} style={{ padding: "12px", backgroundColor: "#0984e3", color: "white", border: "none", borderRadius: "6px" }}>
              {uploading ? "Uploading..." : "Upload Documents"}
            </button>
          </form>
        ) : (
          <div style={{ marginTop: "20px" }}>
            <p style={{ color: "green", fontWeight: "bold" }}>✔ Documents Verified Successfully</p>
            <button 
              onClick={finalizeBooking}
              style={{ padding: "15px 30px", backgroundColor: "#00b894", color: "white", fontSize: "18px", borderRadius: "8px", border: "none", cursor: "pointer", width: "100%" }}
            >
              Book Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}