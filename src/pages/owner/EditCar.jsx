import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import carApi from "../../api/carApi";
import { toast } from "react-toastify";
import OwnerNavbar from '@/components/common/OwnerNavbar';

export default function EditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    location: "",
    pricePerHour: "",
    pricePerKm: "",
    availabilityStatus: "AVAILABLE",
    description: "",
    serviceType: "SELF_DRIVE",
    driverChargesPerDay: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    carApi.get(`/api/cars/${id}`)
      .then((res) => {
        setFormData({
            ...res.data,
            serviceType: res.data.serviceType || "SELF_DRIVE",
            driverChargesPerDay: res.data.driverChargesPerDay || 0
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        toast.error("Failed to retrieve asset data.");
        navigate("/owner/my-cars");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await carApi.put(`/api/cars/${id}`, formData);
      toast.success("Fleet asset updated successfully!");
      navigate("/owner/my-cars"); 
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Critical update failure. Check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest text-slate-400">Syncing Asset Info...</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />

      {/* HERO HEADER */}
      <div className="bg-[#0F172A] pt-24 pb-32 px-6 lg:px-20 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <button 
            onClick={() => navigate("/owner/my-cars")} 
            className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 hover:text-white transition-colors"
          >
            ← Fleet Overview
          </button>
          <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
            EDIT <span className="text-indigo-500 italic text-4xl leading-none">VEHICLE SPECS</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Update machine performance and pricing tiers.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 lg:p-12">
            
            {/* SECTION 1: CORE IDENTITY */}
            <div className="mb-12">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">01. Identity & Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Brand Name</label>
                  <input name="brand" className="w-full bg-slate-50 p-4 rounded-xl font-bold border border-transparent focus:border-indigo-500 outline-none transition-all" value={formData.brand} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Vehicle Model</label>
                  <input name="model" className="w-full bg-slate-50 p-4 rounded-xl font-bold border border-transparent focus:border-indigo-500 outline-none transition-all" value={formData.model} onChange={handleChange} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Station Location</label>
                  <input name="location" className="w-full bg-slate-50 p-4 rounded-xl font-bold border border-transparent focus:border-indigo-500 outline-none transition-all" value={formData.location} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* SECTION 2: PRICING & LOGISTICS */}
            <div className="mb-12">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">02. Revenue & Service Model</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Hourly Rate (₹)</label>
                  <input type="number" name="pricePerHour" className="w-full bg-indigo-50/30 p-4 rounded-xl font-black text-indigo-600 border border-indigo-100 outline-none" value={formData.pricePerHour} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">KM Rate (₹)</label>
                  <input type="number" name="pricePerKm" className="w-full bg-indigo-50/30 p-4 rounded-xl font-black text-indigo-600 border border-indigo-100 outline-none" value={formData.pricePerKm} onChange={handleChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Fleet Status</label>
                  <select name="availabilityStatus" className="w-full bg-slate-50 p-4 rounded-xl font-bold border border-transparent focus:border-indigo-500 outline-none" value={formData.availabilityStatus} onChange={handleChange}>
                    <option value="AVAILABLE">✅ Available</option>
                    <option value="BOOKED">🔒 Booked</option>
                    <option value="MAINTENANCE">🔧 In Service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: DRIVER SPECS */}
            <div className="mb-12 p-8 bg-slate-900 rounded-[2rem] text-white">
              <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">03. Service Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Operational Mode</label>
                  <select name="serviceType" className="w-full bg-slate-800 p-4 rounded-xl font-bold border border-slate-700 outline-none text-white focus:border-indigo-500" value={formData.serviceType} onChange={handleChange}>
                    <option value="SELF_DRIVE">Self Drive Only</option>
                    <option value="WITH_DRIVER">Chauffeur Driven</option>
                    <option value="BOTH">Hybrid (Self/Chauffeur)</option>
                  </select>
                </div>

                {/* DYNAMIC DRIVER CHARGES */}
                {(formData.serviceType === "WITH_DRIVER" || formData.serviceType === "BOTH") && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Daily Chauffeur Fee (₹)</label>
                    <input 
                      type="number" 
                      name="driverChargesPerDay" 
                      className="w-full bg-indigo-500/10 p-4 rounded-xl font-black text-indigo-400 border border-indigo-500/30 outline-none" 
                      value={formData.driverChargesPerDay} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                type="submit" 
                disabled={submitting} 
                className={`flex-[2] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl ${
                  submitting ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
                }`}
              >
                {submitting ? "SYNCHRONIZING..." : "COMMIT CHANGES"}
              </button>
              <button 
                type="button" 
                onClick={() => navigate("/owner/my-cars")} 
                className="flex-1 py-5 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-200 transition-all"
              >
                DISCARD
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}