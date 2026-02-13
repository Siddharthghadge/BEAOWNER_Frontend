import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import carApi from "../../api/carApi";
import { API_URLS } from "../../config/apiUrls";

export default function CarBookingWithDriver() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // ✅ Policy & Modal States
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  // ✅ Cloudinary + Local image handler (no UI change)
const buildImageUrl = (file) => {
  if (!file) return "https://placehold.co/600x400?text=No+Image";

  const cleanFile = String(file).trim();

  // ✅ If Cloudinary / external URL → use directly
  if (cleanFile.startsWith("http")) {
    return cleanFile;
  }

  // ✅ fallback for old local uploads (optional)
  return `${API_URLS.CAR_UPLOADS}/${encodeURIComponent(cleanFile)}`;
};


  useEffect(() => {
    carApi.get(`/api/cars/${id}`)
      .then((res) => {
        setCar(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching car:", err);
        navigate("/");
      });
  }, [id, navigate]);

  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      const total = (car.pricePerHour * 24 * diffDays) + (car.driverChargesPerDay * diffDays);
      setTotalPrice(total);
    }
  }, [startDate, endDate, car]);

  // ✅ Modal Handler
  const openPolicy = (type) => {
    if (type === 'privacy') {
      setModalContent({
        title: "Privacy Protocol",
        text: "Your booking details and identity information are protected. We use your data solely for coordinating with the assigned driver and ensuring trip safety. Documents are stored in an encrypted format."
      });
    } else {
      setModalContent({
        title: "Engagement Terms",
        text: "1. The driver's working hours are max 12 hours/day. 2. Night driving (11 PM - 5 AM) may incur extra charges paid directly to the driver. 3. Tolls and state taxes are to be borne by the customer. 4. Smoking or drinking inside the vehicle is strictly prohibited."
      });
    }
    setShowModal(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!agreedToPrivacy || !agreedToTerms) {
      alert("Please accept the Privacy Policy and Terms & Conditions.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const payload = {
        carId: parseInt(id),
        ownerId: car.ownerId || car.userId || car.vendorId || car.createdById,
        ownerEmail: car.ownerEmail || car.userEmail || car.vendorEmail || car.createdByEmail,
        startDate: startDate + "T10:00:00",
        endDate: endDate + "T10:00:00",
        bookingType: "WITH_DRIVER",
        totalAmount: parseFloat(totalPrice)
      };

      const response = await axios.post(
        `${API_URLS.BOOKING}/api/bookings`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        alert("✅ Chauffeur Booking Created Successfully!");
        navigate("/bookings");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Check connectivity to the server.";
      alert(`Error: ${errorMsg}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-16 px-4 md:px-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors"
        >
          ← Go Back
        </button>

        <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-200 grid lg:grid-cols-2">
          
          {/* LEFT: VISUAL PREVIEW */}
          <div className="relative border-r border-slate-100 bg-white p-10 flex flex-col justify-between">
            <div>
              <span className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                Premium Chauffeur Service
              </span>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-2">
                {car.brand} <br />
                <span className="text-slate-400">{car.model}</span>
              </h2>
              <p className="text-slate-400 font-bold text-sm mb-8">📍 {car.location}</p>
            </div>

            <div className="relative h-64 w-full rounded-[2rem] overflow-hidden shadow-2xl mb-8">
             <img
  src={buildImageUrl(car.imageUrls?.[0])}
  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
  alt="Car"
  onError={(e) => {
    e.target.src = "https://placehold.co/600x400?text=Image+Unavailable";
  }}
/>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Driver On Standby</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Service Type</p>
                <p className="font-black text-xs uppercase tracking-tighter italic">Professional Driver</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Fleet Protection</p>
                <p className="font-black text-xs uppercase tracking-tighter italic">Secured & Tracked</p>
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING FORM */}
          <div className="p-10 md:p-14 bg-slate-50/50">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-10">Configure Trip</h3>
            
            <form onSubmit={handleBooking} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Pickup Date</label>
                  <input
                    type="date"
                    required
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Return Date</label>
                  <input
                    type="date"
                    required
                    className="w-full p-4 bg-white rounded-2xl border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-indigo-600/10 outline-none transition-all"
                    min={startDate || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* PRICE RECEIPT */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 text-center border-b border-white/10 pb-4">Fare Breakdown</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold opacity-60">
                    <span className="uppercase tracking-widest text-[10px]">Daily Base Fare</span>
                    <span>₹{car.pricePerHour * 24}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold opacity-60">
                    <span className="uppercase tracking-widest text-[10px]">Chauffeur Service</span>
                    <span>₹{car.driverChargesPerDay}</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Grand Total</p>
                      <p className="text-[9px] opacity-40 uppercase font-black tracking-widest mt-1">Inclusive of Taxes</p>
                    </div>
                    <span className="text-4xl font-black tracking-tighter">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* CONSENTS */}
              <div className="space-y-4 px-2">
                <div className="flex items-start gap-4 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    checked={agreedToPrivacy} 
                    className="mt-1 w-4 h-4 accent-indigo-600 rounded"
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)} 
                  />
                  <label htmlFor="privacy" className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-tight">
                    I agree to the <span className="text-indigo-600 underline cursor-pointer" onClick={(e) => { e.preventDefault(); openPolicy('privacy'); }}>Privacy Policy</span> regarding trip records.
                  </label>
                </div>

                <div className="flex items-start gap-4 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreedToTerms} 
                    className="mt-1 w-4 h-4 accent-indigo-600 rounded"
                    onChange={(e) => setAgreedToTerms(e.target.checked)} 
                  />
                  <label htmlFor="terms" className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-tight">
                    I accept the <span className="text-indigo-600 underline cursor-pointer" onClick={(e) => { e.preventDefault(); openPolicy('terms'); }}>Engagement Terms</span> for chauffeur services.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!agreedToPrivacy || !agreedToTerms}
                className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all duration-300 shadow-xl active:scale-95
                  ${(agreedToPrivacy && agreedToTerms) 
                    ? "bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-200" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
              >
                Confirm Chauffeur Booking
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-6 transition-all">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-6 border-b border-slate-50 pb-4">
              {modalContent.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium italic">
              {modalContent.text}
            </p>
            <button 
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-colors shadow-xl"
              onClick={() => setShowModal(false)}
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}