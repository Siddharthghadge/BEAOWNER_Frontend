import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRentalById, getRentalCategories } from "@/api/rentalApi";
import { API_URLS } from "@/config/apiUrls";
import OwnerNavbar from "@/components/common/OwnerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
  </section>
);

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Available", dot: "bg-emerald-500", desc: "Visible and open for booking" },
  { value: "RENTED", label: "Rented", dot: "bg-amber-500", desc: "Currently with a renter" },
  { value: "UNAVAILABLE", label: "Unavailable", dot: "bg-slate-400", desc: "Paused by you" },
];

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
      <p className="text-sm font-medium text-slate-500">Loading listing details…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900">
      <OwnerNavbar />

      {/* PAGE HEADER */}
      <header className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>
        <div className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-12 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
            </svg>
            Back to my rentals
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Edit listing</h1>
          <p className="mt-2 max-w-xl text-base text-slate-400">
            Update the details, photo and availability of your rental item.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="relative z-20 mx-auto -mt-16 max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* LEFT: PHOTO & STATUS */}
          <aside className="w-full space-y-6 lg:sticky lg:top-24 lg:w-[340px] lg:shrink-0">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Listing photo</h2>
              <p className="mb-4 mt-1 text-sm text-slate-500">This is the first image renters see.</p>

              <div
                role="button"
                tabIndex={0}
                aria-label="Replace listing image"
                onClick={() => fileInputRef.current.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current.click();
                  }
                }}
                className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
              >
                <img
                  src={imagePreview || "https://placehold.co/400x400?text=No+Image"}
                  alt="Item"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/60 p-6 text-center text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V18a2 2 0 002 2h14a2 2 0 002-2v-1.5M16 8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-sm font-semibold">Replace image</span>
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

              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                {selectedFile ? "Choose a different image" : "Upload new image"}
              </button>
              {selectedFile && (
                <p className="mt-2 truncate text-xs text-emerald-600">Selected: {selectedFile.name}</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
              <p className="mb-4 mt-1 text-sm text-slate-500">Control whether renters can book this item.</p>

              <div className="space-y-2" role="radiogroup" aria-label="Availability status">
                {STATUS_OPTIONS.map((opt) => {
                  const active = formData.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setFormData({ ...formData, status: opt.value })}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
                        active
                          ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${opt.dot}`}></span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">{opt.label}</span>
                        <span className="block text-xs text-slate-500">{opt.desc}</span>
                      </span>
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          active ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
                        }`}
                      >
                        {active && (
                          <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Items marked as Rented are hidden from public search results.
              </p>
            </div>
          </aside>

          {/* RIGHT: DETAILS */}
          <div className="min-w-0 flex-1 space-y-6">
            <Section title="Basic information" subtitle="Help renters understand what you are offering.">
              <Field label="Item title" className="md:col-span-2">
                <input
                  className={inputBase}
                  placeholder="e.g. Canon EOS 90D camera kit"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  required
                />
              </Field>

              <Field label="Category">
                <select
                  className={inputBase}
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Condition">
                <select
                  className={inputBase}
                  value={formData.itemCondition}
                  onChange={e => setFormData({...formData, itemCondition: e.target.value})}
                >
                  <option value="NEW">New</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </Field>

              <Field label="Description" className="md:col-span-2" hint="Mention what’s included, usage tips and any rules for renters.">
                <textarea
                  className={`${inputBase} min-h-[130px] resize-y`}
                  placeholder="Describe your item in detail"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />
              </Field>
            </Section>

            <Section title="Pickup location" subtitle="Where renters will collect the item.">
              <Field label="City">
                <input
                  className={inputBase}
                  placeholder="e.g. Pune"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  required
                />
              </Field>

              <Field label="Area">
                <input
                  className={inputBase}
                  placeholder="e.g. Kothrud"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  required
                />
              </Field>

              <Field label="Pickup address" className="md:col-span-2">
                <textarea
                  className={`${inputBase} min-h-[90px] resize-y`}
                  placeholder="Street, landmark and pin code"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  required
                />
              </Field>
            </Section>

            <Section title="Pricing" subtitle="Refundable amount collected before handover.">
              <Field label="Security deposit" className="md:col-span-2">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base font-semibold text-slate-400">₹</span>
                  <input
                    type="number"
                    className={`${inputBase} pl-9 text-lg font-semibold`}
                    placeholder="0"
                    value={formData.securityDeposit}
                    onChange={e => setFormData({...formData, securityDeposit: e.target.value})}
                    required
                  />
                </div>
              </Field>
            </Section>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 lg:px-8">
            <p className="hidden text-sm text-slate-500 sm:block">Changes go live as soon as you save.</p>
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
                disabled={submitting}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 sm:flex-none ${
                  submitting
                    ? "cursor-not-allowed bg-slate-300 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
                }`}
              >
                {submitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                )}
                {submitting ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditRentalItem;
