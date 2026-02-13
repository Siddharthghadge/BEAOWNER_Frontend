import React, { useState } from "react";
import carApi from "../../api/carApi";
import { useNavigate } from "react-router-dom";
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from "react-toastify";

export default function AddCar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    registrationNumber: "",
    pricePerHour: "",
    pricePerKm: "",
    serviceType: "SELF_DRIVE",
    driverChargesPerDay: 0,
    fuelType: "PETROL",
    transmission: "MANUAL",
    location: "",
    description: ""
  });

  const [images, setImages] = useState([]);
  const [insurance, setInsurance] = useState(null);
  const [puc, setPuc] = useState(null);
  const [rcBook, setRcBook] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // 1. JSON Data Blob for @RequestPart
    formData.append("carData", new Blob([JSON.stringify(carData)], {
      type: 'application/json'
    }));

    // 2. Car Images
    if (images.length > 0) {
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });
    }

    // 3. Mandatory Documents
    formData.append("insurance", insurance);
    formData.append("puc", puc);
    formData.append("rcBook", rcBook);

    try {
      await carApi.post("/api/cars", formData);
      toast.success("Car listed in the Fleet Vault!");
      navigate("/owner/my-cars"); 
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error("Upload failed. Verify all documents are attached.");
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
            ← Back to Fleet
          </button>
          <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
            ADD NEW <span className="text-indigo-500 italic">VEHICLE</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Expand your fleet in the Pune region.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          <div className="p-8 lg:p-12">
            {/* SECTION 1: SPECIFICATIONS */}
            <div className="mb-12">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">01. Vehicle Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Brand Name</label>
                  <input name="brand" placeholder="e.g. TATA" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Model</label>
                  <input name="model" placeholder="e.g. NEXON" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Registration (Plate)</label>
                  <input name="registrationNumber" placeholder="MH 12 XX 0000" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Base Location</label>
                  <input name="location" placeholder="e.g. HINJEWADI" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            {/* SECTION 2: SERVICE & PRICING */}
            <div className="mb-12">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">02. Pricing & Service</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price Per Hour (₹)</label>
                  <input name="pricePerHour" type="number" className="w-full bg-slate-50 p-4 rounded-xl font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price Per KM (₹)</label>
                  <input name="pricePerKm" type="number" className="w-full bg-slate-50 p-4 rounded-xl font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Service Type</label>
                  <select name="serviceType" className="w-full bg-slate-50 p-4 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all" onChange={handleInputChange} value={carData.serviceType}>
                    <option value="SELF_DRIVE">Self-Drive Only</option>
                    <option value="WITH_DRIVER">With Driver Only</option>
                    <option value="BOTH">Both (Self-Drive & Driver)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Driver Daily Charges (₹)</label>
                  <input 
                    name="driverChargesPerDay" 
                    type="number" 
                    disabled={carData.serviceType === "SELF_DRIVE"}
                    className={`w-full p-4 rounded-xl font-black outline-none transition-all ${carData.serviceType === "SELF_DRIVE" ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-50 text-emerald-600 focus:ring-2 focus:ring-indigo-500'}`}
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: COMPLIANCE VAULT */}
            <div className="mb-8 bg-slate-900 rounded-[2rem] p-8 lg:p-10 text-white">
              <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-8 border-b border-white/10 pb-4">03. Compliance Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Vehicle Photos (Multi-Select)</label>
                    <input type="file" multiple className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer" onChange={(e) => setImages(e.target.files)} required />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Insurance Policy</label>
                    <input type="file" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer" onChange={(e) => setInsurance(e.target.files[0])} required />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">PUC Certificate</label>
                    <input type="file" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer" onChange={(e) => setPuc(e.target.files[0])} required />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">RC Book Copy</label>
                    <input type="file" className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer" onChange={(e) => setRcBook(e.target.files[0])} required />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl
                ${loading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-emerald-200"}`}
            >
              {loading ? "AUTHENTICATING ASSET..." : "LIST VEHICLE IN FLEET"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}