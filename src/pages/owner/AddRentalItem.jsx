import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRentalCategories } from '@/api/rentalApi';
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URLS } from '@/config/apiUrls';

/* ---------- UI-only helpers (no business logic) ---------- */
const inputBase =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const Field = ({ label, hint, children, className = "" }) => (
  <div className={className}>
    <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
  </div>
);

const Section = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="mb-6 border-b border-slate-100 pb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const DURATION_LABELS = { DAILY: 'Per day', WEEKLY: 'Per week', MONTHLY: 'Per month' };

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
    <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900">
      <OwnerNavbar />

      {/* PAGE HEADER */}
      <header className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-28 pt-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
            </svg>
            Go back
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Add a new listing</h1>
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-sm font-medium text-indigo-200">
              {categoryNameFromUrl}
            </span>
          </div>
          <p className="mt-2 max-w-xl text-base text-slate-400">
            Add photos, set your price and publish your item for renters to find.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="relative z-20 mx-auto -mt-16 max-w-4xl space-y-6 px-6">

        {/* PHOTOS */}
        <Section title="Photos" subtitle="Add up to 3 clear photos. The first one is used as the cover image.">
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((src, index) => (
              <div
                key={index}
                className="relative h-36 w-36 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm"
              >
                <img src={src} alt="preview" className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/75 px-2 py-0.5 text-[11px] font-medium text-white">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Remove photo"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-sm transition hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M5.3 5.3a1 1 0 011.4 0L10 8.6l3.3-3.3a1 1 0 111.4 1.4L11.4 10l3.3 3.3a1 1 0 01-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 01-1.4-1.4L8.6 10 5.3 6.7a1 1 0 010-1.4z" />
                  </svg>
                </button>
              </div>
            ))}

            {images.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="group flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-sm font-medium">Add photo</span>
              </button>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-500">{images.length} of 3 photos added</p>
          <input type="file" hidden ref={fileInputRef} multiple accept="image/*" onChange={handleFileSelect} />
        </Section>

        {/* DETAILS */}
        <Section title="Item details" subtitle="Tell renters what they are getting.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Listing title" className="md:col-span-2">
              <input
                className={inputBase}
                placeholder="e.g. Canon EOS 90D camera kit"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </Field>

            <Field label="Condition">
              <select
                className={inputBase}
                value={formData.itemCondition}
                onChange={e => setFormData({...formData, itemCondition: e.target.value})}
              >
                <option value="NEW">Brand new</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
              </select>
            </Field>

            <Field label="Security deposit" hint="Refundable amount collected before handover.">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-semibold text-slate-400">₹</span>
                <input
                  type="number"
                  className={`${inputBase} pl-9`}
                  placeholder="0"
                  required
                  value={formData.securityDeposit}
                  onChange={e => setFormData({...formData, securityDeposit: e.target.value})}
                />
              </div>
            </Field>

            <Field label="Description" className="md:col-span-2" hint="Mention specs, what’s included and any usage rules.">
              <textarea
                className={`${inputBase} h-32 resize-y`}
                placeholder="Describe your item in detail"
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </Field>
          </div>
        </Section>

        {/* PRICING */}
        <Section title="Rental price" subtitle="Choose how often renters are charged.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Price">
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg font-semibold text-slate-400">₹</span>
                <input
                  type="number"
                  className={`${inputBase} pl-9 text-lg font-semibold`}
                  placeholder="0.00"
                  required
                  value={priceInput}
                  onChange={e => setPriceInput(e.target.value)}
                />
              </div>
            </Field>

            <Field label="Billing cycle">
              <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1" role="radiogroup" aria-label="Billing cycle">
                {['DAILY', 'WEEKLY', 'MONTHLY'].map((type) => {
                  const active = selectedDuration === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSelectedDuration(type)}
                      className={`rounded-lg px-2 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
                        active
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {DURATION_LABELS[type]}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>
        </Section>

        {/* LOCATION */}
        <Section title="Pickup location" subtitle="Where renters will collect the item.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="City">
              <input
                className={inputBase}
                placeholder="e.g. Pune"
                required
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </Field>
            <Field label="Area">
              <input
                className={inputBase}
                placeholder="e.g. Kothrud"
                required
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
              />
            </Field>
            <Field label="Pickup address" className="md:col-span-2">
              <input
                className={inputBase}
                placeholder="Street, landmark and pin code"
                required
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </Field>
          </div>
        </Section>

        {/* ACTION BAR */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-6 py-4">
            <p className="hidden text-sm text-slate-500 sm:block">Your listing goes live as soon as you publish.</p>
            <div className="ml-auto flex w-full gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-200 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 sm:flex-none ${
                  loading
                    ? 'cursor-not-allowed bg-slate-300 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                }`}
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                )}
                {loading ? 'Publishing…' : 'Publish listing'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRentalItem;