import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCarById } from "../../api/carService";
import { API_URLS } from "../../config/apiUrls";
import axios from "axios";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isDriverMode = queryParams.get("mode") === "driver";

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({ license: null, aadhar: null });
  const [consents, setConsents] = useState({ privacy: false, terms: false });

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  useEffect(() => {
    getCarById(id)
      .then((res) => setCar(res.data))
      .catch((err) => {
        console.error("Car details error", err);
        alert("Error loading car details");
      });
  }, [id]);

  const openModal = (type) => {
    if (type === "privacy") {
      setModalContent({
        title: "Security & Privacy",
        text: "Your security is our priority. Documents are encrypted and used only for identity verification. Data is never shared with third parties."
      });
    } else {
      setModalContent({
        title: "Rental Agreement",
        text: "1. Valid license required. 2. Fuel level must be maintained. 3. No smoking inside. 4. User is liable for insurance deductibles."
      });
    }
    setShowModal(true);
  };

  const getImageUrl = (imageUrls) => {
  if (imageUrls && imageUrls.length > 0) {
    return imageUrls[0];   // ✅ Direct Cloudinary URL
  }
  return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop";
};


  const calculateTotal = () => {
    if (!startDate || !endDate || !car) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMs = Math.abs(end - start);
    const hours = Math.max(1, diffInMs / (1000 * 60 * 60));
    const days = Math.ceil(hours / 24) || 1;
    let total = hours * car.pricePerHour;
    if (isDriverMode) {
      total += days * (car.driverChargesPerDay || 0);
    }
    return total.toFixed(2);
  };

  const isFormValid = startDate && endDate && (isDriverMode ? true : files.license) && files.aadhar && consents.privacy && consents.terms;

  const handleBooking = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const uploadData = new FormData();
      if (!isDriverMode && files.license) uploadData.append("license", files.license);
      uploadData.append("aadhar", files.aadhar);

      await axios.post(`${API_URLS.USER}/api/users/upload-identity`, uploadData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bookingPayload = {
        carId: car.carId || car.id,
        ownerId: car.ownerId,
        ownerEmail: car.ownerEmail,
        startDate: startDate.slice(0, 16),
        endDate: endDate.slice(0, 16),
        bookingType: isDriverMode ? "WITH_DRIVER" : "SELF_DRIVE",
        totalAmount: parseFloat(calculateTotal())
      };

      await axios.post(`${API_URLS.BOOKING}/api/bookings`, bookingPayload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      navigate("/bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!car) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 md:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        
        {/* --- LEFT: ASSET PREVIEW --- */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative group bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50">
            <img src={getImageUrl(car.imageUrls)} alt={car.model} className="w-full h-[500px] object-cover" />
            <div className="absolute top-8 left-8">
              <span className="bg-slate-900/80 backdrop-blur-xl text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">
                {isDriverMode ? "Chauffeur Drive" : "Private Rental"}
              </span>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.4em] mb-2">{car.brand}</p>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic">{car.model}</h1>
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest mb-1">Base Rate</p>
                <p className="text-3xl font-black tracking-tighter">₹{car.pricePerHour}<span className="text-sm text-slate-400">/hr</span></p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Transmission', val: car.transmission || 'Auto' },
                { label: 'Fuel', val: car.fuelType || 'Petrol' },
                { label: 'Location', val: car.location }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                  <p className="font-black text-sm uppercase">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: RESERVATION PANEL --- */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-2xl shadow-indigo-100/50">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8">Reserve Vehicle</h3>
            
            <div className="space-y-6">
              {/* DATE PICKERS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Pickup</label>
                  <input type="datetime-local" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" 
                    value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Return</label>
                  <input type="datetime-local" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold focus:ring-2 focus:ring-indigo-600 outline-none" 
                    value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>

              {/* IDENTITY UPLOAD */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Identity Verification</p>
                <div className="grid gap-4">
                  {!isDriverMode && (
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold uppercase mb-2 opacity-60">Driving License</label>
                      <input type="file" onChange={e => setFiles({ ...files, license: e.target.files[0] })} className="text-[10px] file:bg-white/10 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <label className="text-[9px] font-bold uppercase mb-2 opacity-60">Aadhar / National ID</label>
                    <input type="file" onChange={e => setFiles({ ...files, aadhar: e.target.files[0] })} className="text-[10px] file:bg-white/10 file:text-white file:border-none file:px-4 file:py-2 file:rounded-lg file:mr-4" />
                  </div>
                </div>
              </div>

              {/* SUMMARY CARD */}
              {startDate && endDate && (
                <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Estimated Total</p>
                    <p className="text-[9px] text-indigo-300 uppercase font-bold">{isDriverMode ? "Incl. Chauffeur" : "Dry Rental"}</p>
                  </div>
                  <p className="text-4xl font-black tracking-tighter text-indigo-600">₹{calculateTotal()}</p>
                </div>
              )}

              {/* CONSENTS */}
              <div className="px-2 space-y-3">
                <label className="flex items-center gap-3 text-[11px] font-bold text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={consents.privacy} onChange={e => setConsents({ ...consents, privacy: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                  <span>Accept <span onClick={() => openModal('privacy')} className="text-indigo-600 underline">Privacy Policy</span></span>
                </label>
                <label className="flex items-center gap-3 text-[11px] font-bold text-slate-500 cursor-pointer">
                  <input type="checkbox" checked={consents.terms} onChange={e => setConsents({ ...consents, terms: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                  <span>Accept <span onClick={() => openModal('terms')} className="text-indigo-600 underline">Rental Terms</span></span>
                </label>
              </div>

              <button
                onClick={handleBooking}
                disabled={!isFormValid || loading}
                className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95
                  ${!isFormValid || loading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-200'}`}
              >
                {loading ? "Syncing..." : "Confirm Reservation"}
              </button>
              <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest italic">15-minute payment hold applies</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-6">{modalContent.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">{modalContent.text}</p>
            <button onClick={() => setShowModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">Acknowledge</button>
          </div>
        </div>
      )}
    </div>
  );
}