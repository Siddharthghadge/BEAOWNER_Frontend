import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRentalCategories } from '@/api/rentalApi';
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URLS } from '@/config/apiUrls';

const AddRentalItem = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const categoryNameFromUrl = searchParams.get("category") || "Item";

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [selectedDuration, setSelectedDuration] = useState("MONTHLY");
  const [priceInput, setPriceInput] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    area: '',
    address: '',
    securityDeposit: '',
    itemCondition: 'EXCELLENT',
    categoryId: null,
  });

  // ✅ LOGIC PRESERVED: CATEGORY MATCHING
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getRentalCategories();
        const normalize = (str = "") => str.toLowerCase().replace(/\s+/g, "").trim();
        const target = normalize(categoryNameFromUrl);
        const match = data.find(c => normalize(c.name) === target) || 
                      data.find(c => normalize(c.name).includes(target));
        if (match) setFormData(prev => ({ ...prev, categoryId: match.id }));
      } catch (err) {
        toast.error("Network Error.");
      }
    };
    if (categoryNameFromUrl) loadCategories();
  }, [categoryNameFromUrl]);

  // ✅ LOGIC PRESERVED: IMAGE HANDLERS
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (images.length + selectedFiles.length > 3) return toast.warn("Max 3 photos.");
    selectedFiles.forEach(file => {
      setImages(prev => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Upload photos.");
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const data = new FormData();
      const payload = {
        ...formData,
        securityDeposit: parseFloat(formData.securityDeposit),
        pricingOptions: [{ durationType: selectedDuration, price: parseFloat(priceInput), minDuration: 1 }]
      };
      const requestBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      data.append("data", requestBlob);
      images.forEach(file => data.append("file", file));
      await axios.post(`${API_URLS.RENTALS}/api/owner/rentals`, data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      toast.success("Listed!");
      navigate(`/owner/my-rentals?category=${categoryNameFromUrl}`);
    } catch (err) {
      toast.error("Failed to save.");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <OwnerNavbar />
      
      {/* HEADER */}
      <div className="bg-[#0F172A] py-16 px-6 border-b border-indigo-500/20">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-indigo-400 font-black text-xs tracking-widest mb-4 uppercase">← Return</button>
          <h1 className="text-white text-4xl font-black tracking-tight uppercase">PUBLISH <span className="italic text-indigo-500">{categoryNameFromUrl}</span></h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-12 space-y-12">
            
           {/* --- SECTION: MEDIA --- */}
            <div>
              <label className="text-slate-900 font-black text-xl uppercase tracking-tight block mb-6">
                01. Upload Photos <span className="text-indigo-600 font-normal text-sm lowercase tracking-normal">(Max 3)</span>
              </label>
              <div className="flex gap-4 flex-wrap">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative w-36 h-36 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-md">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)} 
                      className="absolute top-2 right-2 bg-black/70 text-white w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <div 
                    onClick={() => fileInputRef.current.click()} 
                    className="w-36 h-36 border-4 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                  >
                    <span className="text-3xl text-slate-300 group-hover:text-indigo-500 mb-1">+</span>
                    <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">Add Image</span>
                  </div>
                )}
              </div>
              <input type="file" hidden ref={fileInputRef} multiple accept="image/*" onChange={handleFileSelect} />
            </div>

            {/* MAIN INFO */}
            <section className="space-y-8">
              <label className="block text-lg font-black text-slate-800 uppercase tracking-tight border-b-4 border-indigo-600 pb-2 w-fit">02. Listing Details</label>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-base font-black text-slate-600 uppercase mb-2">Listing Title</label>
                  <input className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-bold outline-none focus:border-indigo-600 transition-all" placeholder="Enter a catchy name for your item" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base font-black text-slate-600 uppercase mb-2">Condition</label>
                    <select className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-bold outline-none focus:border-indigo-600 appearance-none" value={formData.itemCondition} onChange={e => setFormData({...formData, itemCondition: e.target.value})}>
                      <option value="NEW">Brand New</option>
                      <option value="EXCELLENT">Excellent</option>
                      <option value="GOOD">Good</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-base font-black text-slate-600 uppercase mb-2">Security Deposit (₹)</label>
                    <input type="number" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-bold outline-none focus:border-indigo-600" placeholder="Refundable amount" required value={formData.securityDeposit} onChange={e => setFormData({...formData, securityDeposit: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-black text-slate-600 uppercase mb-2">Description</label>
                  <textarea className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-medium outline-none focus:border-indigo-600 h-32 resize-none" placeholder="Provide details about specs and usage..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
            </section>

            {/* PRICING WITH EXPLICIT DURATION OPTIONS */}
            <section className="space-y-8">
              <label className="block text-lg font-black text-slate-800 uppercase tracking-tight border-b-4 border-emerald-500 pb-2 w-fit">03. Rental Pricing</label>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-base font-black text-slate-600 uppercase mb-2">Price (₹)</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-2xl font-black text-emerald-600 outline-none focus:border-emerald-500 transition-all" placeholder="0.00" required value={priceInput} onChange={e => setPriceInput(e.target.value)} />
                </div>
                
                <div className="flex-1">
                  <label className="block text-base font-black text-slate-600 uppercase mb-2">Billing Cycle</label>
                  <div className="grid grid-cols-3 gap-2 h-[64px]">
                    {['DAILY', 'WEEKLY', 'MONTHLY'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedDuration(type)}
                        className={`rounded-xl font-black text-[10px] tracking-widest uppercase transition-all border-2 
                          ${selectedDuration === type 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                            : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200'}`}
                      >
                        {type === 'DAILY' ? 'Per Day' : type === 'WEEKLY' ? 'Per Week' : 'Per Month'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* LOCATION */}
            <section className="space-y-8">
              <label className="block text-lg font-black text-slate-800 uppercase tracking-tight border-b-4 border-orange-500 pb-2 w-fit">04. Pickup Address</label>
              <div className="grid grid-cols-2 gap-4">
                <input className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-bold outline-none focus:border-orange-500" placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                <input className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-bold outline-none focus:border-orange-500" placeholder="Area" required value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} />
              </div>
              <input className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg font-bold outline-none focus:border-orange-500" placeholder="Detailed Address" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </section>

            <button type="submit" disabled={loading} className={`w-full py-6 rounded-2xl text-xl font-black uppercase tracking-widest transition-all ${loading ? 'bg-slate-300' : 'bg-[#0F172A] text-white hover:bg-indigo-600 active:scale-95 shadow-2xl shadow-indigo-200'}`}>
              {loading ? 'PUBLISHING...' : 'CONFIRM & LIST ITEM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRentalItem;