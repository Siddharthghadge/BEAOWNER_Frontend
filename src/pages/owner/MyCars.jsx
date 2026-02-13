import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import carApi from "../../api/carApi";
import { toast } from "react-toastify";
//import { API_URLS } from "../../config/apiUrls"; 
import OwnerNavbar from "@/components/common/OwnerNavbar";

export default function MyCars() {
  const [activeCars, setActiveCars] = useState([]);
  const [rejectedCars, setRejectedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("active");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    setLoading(true);
    carApi.get("/api/cars/my-cars")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const rejected = data.filter(c => (c.status || "").toUpperCase() === "REJECTED");
        const active = data.filter(c => (c.status || "").toUpperCase() !== "REJECTED");

        setActiveCars(active.sort((a, b) => (b.carId || 0) - (a.carId || 0)));
        setRejectedCars(rejected);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        toast.error("Error loading fleet archive");
      })
      .finally(() => setLoading(false));
  };

  const getImageUrl = (imageUrls) =>
  imageUrls?.length > 0
    ? imageUrls[0]   // ✅ Direct Cloudinary URL
    : "https://placehold.co/400x300?text=No+Vehicle+Image";


  const getServiceLabel = (type) => {
    switch(type) {
      case 'WITH_DRIVER': return { text: "CHAUFFEUR DRIVEN", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" };
      case 'BOTH': return { text: "HYBRID SERVICE", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" };
      default: return { text: "SELF DRIVE", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" };
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("CRITICAL: Permanent removal of this vehicle from the active fleet. Proceed?")) {
      carApi.delete(`/api/cars/${id}`)
        .then(() => {
          toast.success("Asset decommissioned successfully");
          fetchCars();
        })
        .catch(() => toast.error("Decommissioning failed"));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest text-slate-400">Syncing Fleet...</p>
    </div>
  );

  const currentList = view === "active" ? activeCars : rejectedCars;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />

      {/* HERO HEADER */}
      <div className="bg-[#0F172A] pt-24 pb-32 px-6 lg:px-20 relative">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
              FLEET <span className="text-indigo-500 italic">VAULT</span>
            </h1>
            <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Global control of your vehicle assets in Pune.</p>
          </div>
          <button 
            onClick={() => navigate("/owner/add-car")}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 active:scale-95"
          >
            + Register Vehicle
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setView("active")}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              view === "active" 
              ? "bg-white text-indigo-600 shadow-lg" 
              : "bg-slate-200/50 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Live Garage ({activeCars.length})
          </button>
          <button 
            onClick={() => setView("rejected")}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              view === "rejected" 
              ? "bg-red-500 text-white shadow-lg shadow-red-200" 
              : "bg-slate-200/50 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Rejected ({rejectedCars.length})
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentList.length > 0 ? (
            currentList.map((car) => {
              const service = getServiceLabel(car.serviceType);
              const adminStatus = (car.status || "PENDING").toUpperCase();
              const availStatus = (car.availabilityStatus || "AVAILABLE").toUpperCase();

              return (
                <div key={car.carId} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 group flex flex-col">
                  {/* IMAGE SECTION */}
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={getImageUrl(car.imageUrls)} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={car.model}
                      onError={(e) => e.target.src = "https://placehold.co/400x300?text=Asset+Offline"}
                    />
                    
                    {/* TOP BADGES */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                      <span className={`px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg ${
                        adminStatus === "APPROVED" ? "bg-emerald-500 text-white" : 
                        adminStatus === "REJECTED" ? "bg-red-500 text-white" : "bg-amber-400 text-amber-900"
                      }`}>
                        {adminStatus}
                      </span>
                      <span className={`px-4 py-2 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg ${service.bg} ${service.color} border ${service.border}`}>
                        {service.text}
                      </span>
                    </div>

                    {/* AVAILABILITY OVERLAY */}
                    <div className="absolute bottom-4 left-4">
                      <span className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 ${
                        availStatus === "AVAILABLE" ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        {availStatus}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT SECTION */}
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{car.brand}</h3>
                      <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">{car.model}</p>
                      <p className="text-slate-400 font-bold text-[10px] mt-2 italic flex items-center gap-1">
                         📍 {car.location}
                      </p>
                    </div>

                    {/* PRICING GRID */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hourly Rate</p>
                        <p className="text-lg font-black text-slate-800 tracking-tighter">₹{car.pricePerHour}</p>
                      </div>
                      <div className="border-l border-slate-200 pl-4">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Per KM Rate</p>
                        <p className="text-lg font-black text-slate-800 tracking-tighter">₹{car.pricePerKm}</p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-auto grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => navigate(`/owner/edit-car/${car.carId}`)}
                        className="py-4 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                      >
                        Edit Details
                      </button>
                      <button 
                        onClick={() => handleDelete(car.carId)}
                        className="py-4 rounded-xl bg-white text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all border border-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="text-6xl mb-6 grayscale opacity-20">🚗</div>
              <h3 className="text-slate-400 font-black text-xs uppercase tracking-[0.4em]">Inventory level zero for {view} status</h3>
              <button 
                onClick={() => navigate("/owner/add-car")}
                className="mt-6 bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
              >
                + Initialize first vehicle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}