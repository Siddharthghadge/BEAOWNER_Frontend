import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRentalById, getRentalCategories } from "@/api/rentalApi";
import { API_URLS } from "@/config/apiUrls";
import OwnerNavbar from "@/components/common/OwnerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const EditRentalItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    area: "",
    city: "",
    address: "",
    securityDeposit: "",
    itemCondition: "EXCELLENT",
    status: "AVAILABLE",
    categoryId: ""
  });

  const getBaseServerUrl = () => API_URLS.RENTALS.split('/api')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemData, catData] = await Promise.all([
          getRentalById(id),
          getRentalCategories(),
        ]);

        setCategories(catData);
        setFormData({
          title: itemData.title || "",
          description: itemData.description || "",
          area: itemData.area || "",
          city: itemData.city || "",
          address: itemData.address || "",
          securityDeposit: itemData.securityDeposit || "",
          itemCondition: itemData.itemCondition || "EXCELLENT",
          status: itemData.status || "AVAILABLE",
          categoryId: itemData.categoryId || ""
        });

        if (itemData.imageUrl) {
          const cleanPath = itemData.imageUrl.replace(/^\/+/, "");
          setImagePreview(cleanPath.startsWith('http') ? cleanPath : `${getBaseServerUrl()}/${cleanPath}`);
        }
      } catch (err) {
        toast.error("Error loading item details.");
        navigate("/owner/my-rentals");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      const data = new FormData();

      const updatePayload = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        securityDeposit: parseFloat(formData.securityDeposit),
        itemCondition: formData.itemCondition,
        status: formData.status,
        categoryId: parseInt(formData.categoryId)
      };

      data.append("data", JSON.stringify(updatePayload));
      if (selectedFile) {
        data.append("file", selectedFile);
      }

      const baseUrl = getBaseServerUrl();
      const finalUrl = `${baseUrl}/api/owner/rentals/${id}`;

      await axios.put(finalUrl, data, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Asset Vault Updated Successfully!");
      navigate("/owner/my-rentals");
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal Server Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest text-slate-400">Syncing Asset Data...</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />

      {/* HERO HEADER */}
      <div className="bg-[#0F172A] pt-20 pb-32 px-6 lg:px-20 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <button 
            onClick={() => navigate(-1)} 
            className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 hover:text-white transition-colors"
          >
            ← Cancel & Return
          </button>
          <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
            EDIT <span className="text-indigo-500 italic">LISTING</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Update specifications and availability for your asset.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          
          {/* LEFT: IMAGE & STATUS CONTROL */}
          <div className="lg:w-[380px] bg-slate-50 p-10 border-r border-slate-100 flex flex-col items-center">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center w-full border-b border-slate-200 pb-4">Display Media</h2>
            
            <div 
              className="relative w-full aspect-square rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl border-4 border-white"
              onClick={() => fileInputRef.current.click()}
            >
              <img 
                src={imagePreview || "https://placehold.co/400x400?text=No+Image"} 
                alt="Item" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                <span className="text-2xl mb-2">📸</span>
                <span className="text-[10px] font-black uppercase tracking-widest leading-tight">Replace Listing Image</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }} 
              />
            </div>

            <div className="w-full mt-12">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 block">Asset Lifecycle Status</label>
              <select 
                className="w-full bg-white border-2 border-slate-100 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest focus:border-indigo-600 outline-none transition-all shadow-sm"
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="AVAILABLE">✅ Available</option>
                <option value="RENTED">🏠 Rented</option>
                <option value="UNAVAILABLE">🚫 Unavailable</option>
              </select>
              <p className="text-[9px] text-slate-400 font-bold mt-3 uppercase leading-tight">Changing to 'Rented' will hide this from public search results.</p>
            </div>
          </div>

          {/* RIGHT: FORM DETAILS */}
          <div className="flex-1 p-10 lg:p-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Item Title</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-bold text-slate-900 transition-all outline-none"
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Asset Category</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-bold text-slate-900 transition-all outline-none"
                  value={formData.categoryId} 
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Current Condition</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-bold text-slate-900 transition-all outline-none"
                  value={formData.itemCondition} 
                  onChange={e => setFormData({...formData, itemCondition: e.target.value})}
                >
                  <option value="NEW">New</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Location: City</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-bold text-slate-900 transition-all outline-none"
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  required 
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Location: Area</label>
                <input 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-bold text-slate-900 transition-all outline-none"
                  value={formData.area} 
                  onChange={e => setFormData({...formData, area: e.target.value})} 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Security Deposit (₹)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-black text-xl text-indigo-600 transition-all outline-none"
                  value={formData.securityDeposit} 
                  onChange={e => setFormData({...formData, securityDeposit: e.target.value})} 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Pickup Address</label>
                <textarea 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-bold text-slate-900 transition-all outline-none min-h-[80px]"
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Detailed Description</label>
                <textarea 
                  className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 p-4 rounded-2xl font-bold text-slate-900 transition-all outline-none min-h-[120px]"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required 
                />
              </div>

            </div>

            <div className="mt-12 flex gap-4">
              <button 
                type="submit" 
                disabled={submitting} 
                className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl
                  ${submitting ? "bg-slate-300 cursor-not-allowed" : "bg-[#0F172A] text-white hover:bg-indigo-600 shadow-indigo-100 active:scale-95"}`}
              >
                {submitting ? "Saving Vault Data..." : "Apply All Changes"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditRentalItem;