import React, { useState } from "react";
import bikeApi from "../../api/bikeApi";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from "react-toastify";

export default function AddBike() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [bike, setBike] = useState({
    brand: "",
    model: "",
    bikeType: "SPORTS",
    engineCc: "",
    pricePerHour: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [insurance, setInsurance] = useState(null);
  const [puc, setPuc] = useState(null);
  const [rcBook, setRcBook] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!insurance || !puc || !rcBook) {
      toast.error("Insurance, PUC, and RC Book are mandatory.");
      setLoading(false);
      return;
    }

    const formData = new FormData();

    // 1. Bike Data Blob
    formData.append(
      "bike",
      new Blob([JSON.stringify(bike)], { type: "application/json" })
    );

    // 2. Bike Gallery Images
    Array.from(images).forEach((file) => {
      formData.append("images", file);
    });

    // 3. Legal Documents
    formData.append("insurance", insurance);
    formData.append("puc", puc);
    formData.append("rcBook", rcBook);

    try {
      await bikeApi.post("", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Bike listed! Awaiting administrative approval.");
      navigate("/owner/my-bikes");
    } catch (err) {
      console.error("Error listing bike:", err);
      toast.error("Failed to register bike. Please check file sizes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />

      {/* HERO HEADER */}
      <div className="bg-[#0F172A] pt-24 pb-32 px-6 lg:px-20 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 hover:text-white transition-colors"
          >
            ← Cancel Registration
          </button>
          <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
            NEW <span className="text-indigo-500 italic">BIKE</span> LISTING
          </h1>
          <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Register your two-wheeler in the rental ecosystem.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12">
            
            {/* SECTION 1: CORE SPECS */}
            <div className="mb-12">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">01. Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Brand</label>
                  <input placeholder="e.g. Kawasaki" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={(e) => setBike({ ...bike, brand: e.target.value })} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Model</label>
                  <input placeholder="e.g. Ninja 400" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={(e) => setBike({ ...bike, model: e.target.value })} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Machine Category</label>
                  <select className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={(e) => setBike({ ...bike, bikeType: e.target.value })}>
                    <option value="SPORTS">Sports</option>
                    <option value="CRUISER">Cruiser</option>
                    <option value="SCOOTER">Scooter</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Engine CC</label>
                  <input type="number" placeholder="e.g. 399" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={(e) => setBike({ ...bike, engineCc: e.target.value })} required />
                </div>
              </div>
            </div>

            {/* SECTION 2: LOGISTICS */}
            <div className="mb-12">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">02. Rental Logistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price Per Hour (₹)</label>
                  <input type="number" placeholder="0.00" className="w-full bg-slate-50 p-4 rounded-xl font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={(e) => setBike({ ...bike, pricePerHour: e.target.value })} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Pickup Location</label>
                  <input placeholder="e.g. Koregaon Park" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={(e) => setBike({ ...bike, location: e.target.value })} required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Machine Description</label>
                  <textarea placeholder="Mention modifications or specific rules..." className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]" onChange={(e) => setBike({ ...bike, description: e.target.value })} />
                </div>
              </div>
            </div>

            {/* SECTION 3: LEGAL VAULT */}
            <div className="mb-8 bg-slate-900 rounded-[2rem] p-8 lg:p-10 text-white">
              <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">03. Compliance Vault</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Bike Photos (Multiple)</label>
                    <input type="file" multiple accept="image/*" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer" onChange={(e) => setImages(e.target.files)} required />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Insurance Document</label>
                    <input type="file" accept="image/*,application/pdf" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer" onChange={(e) => setInsurance(e.target.files[0])} required />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">PUC Certificate</label>
                    <input type="file" accept="image/*,application/pdf" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer" onChange={(e) => setPuc(e.target.files[0])} required />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">RC Book</label>
                    <input type="file" accept="image/*,application/pdf" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer" onChange={(e) => setRcBook(e.target.files[0])} required />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl
                ${loading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-100"}`}
            >
              {loading ? "PROCESSING VAULT..." : "LIST BIKE IN FLEET"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}