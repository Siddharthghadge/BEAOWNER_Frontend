import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRentalById } from "@/api/rentalApi";
import { API_URLS } from "@/config/apiUrls";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id || id === "undefined") return;
      try {
        setLoading(true);
        const data = await getRentalById(id);
        setItem(data);
        setActiveImg(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="mt-4 text-xs font-semibold tracking-widest text-slate-400">
            LOADING ITEM
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-20 text-center text-slate-400 font-semibold">
        Asset not found
      </div>
    );
  }

  const imageUrls =
    item.imageUrls?.length > 0
      ? item.imageUrls
      : item.imageUrl
      ? [item.imageUrl]
      : [];

 // ✅ Cloudinary + Local image handler (NO UI change)
const getFullImageUrl = (path) => {
  if (!path) return "https://placehold.co/800x1200";

  const cleanPath = String(path).trim();

  // ✅ If Cloudinary / external URL → use directly
  if (cleanPath.startsWith("http")) {
    return cleanPath;
  }

  // ✅ fallback for old local storage
  const base = API_URLS.RENTALS.split("/api")[0];
  return `${base}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
};


  const plan = item.pricingOptions?.[0];

  return (
    <div className="bg-slate-100 min-h-screen pb-24 font-sans">
      {/* TOP BAR */}
      <div className="max-w-[1400px] mx-auto px-6 pt-8 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="h-11 w-11 flex items-center justify-center bg-white rounded-full border border-slate-200 shadow-sm hover:shadow-md transition"
        >
          ←
        </button>
        <span className="text-[11px] text-slate-400 font-semibold tracking-widest uppercase">
          Asset ID • {id?.slice(-6)}
        </span>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 mt-10 grid lg:grid-cols-12 gap-14">
        {/* LEFT – GALLERY */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-[2.5rem] overflow-hidden bg-white shadow-xl border border-white">
            <img
              src={getFullImageUrl(imageUrls[activeImg])}
              alt={item.title}
              className="w-full h-[640px] object-cover"
            />
          </div>

          <div className="flex gap-4 px-2">
            {imageUrls.map((url, index) => (
              <button
                key={index}
                onClick={() => setActiveImg(index)}
                className={`h-20 w-20 rounded-2xl overflow-hidden border transition
                  ${
                    activeImg === index
                      ? "border-indigo-600 ring-2 ring-indigo-100"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }
                `}
              >
                <img
                  src={getFullImageUrl(url)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT – DETAILS */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          {/* TITLE */}
          <div>
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest">
              {item.categoryName}
            </span>
            <h1 className="mt-3 text-4xl font-extrabold text-slate-900 leading-tight">
              {item.title}
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-500">
              📍 {item.area}, {item.city}
            </p>
          </div>

          {/* SPECS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Condition
              </p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {item.itemCondition}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Deposit
              </p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                ₹{item.securityDeposit}
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800 mb-3">
              Description
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              {item.description}
            </p>
          </div>

          {/* PRICE + CTA */}
          <div className="bg-gradient-to-br from-slate-900 to-black rounded-3xl p-8 text-white shadow-2xl">
            <p className="text-xs text-slate-300 font-semibold uppercase tracking-widest">
              Rental price
            </p>

            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-extrabold">
                ₹{plan?.price || "---"}
              </span>
              <span className="text-slate-300 text-sm font-medium">
                / {plan?.durationType?.toLowerCase() || "day"}
              </span>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="mt-6 w-full bg-white text-black py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition"
            >
              Reserve this item
            </button>

            <p className="mt-3 text-xs text-slate-400 text-center">
              Verified owner • Transparent pricing • No hidden fees
            </p>
          </div>
        </div>
      </main>

   {/* MODAL (Glassmorphism) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black tracking-tighter">Contact Concierge</h3>
              <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center bg-slate-100 rounded-full font-bold">✕</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl">
                <div className="h-16 w-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black">
                   {item.ownerName?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Owner</p>
                  <p className="text-xl font-black text-slate-900">{item.ownerName}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <a href={`tel:${item.ownerPhone}`} className="flex justify-between items-center p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-black text-slate-400 uppercase">Mobile</span>
                  <span className="font-bold">{item.ownerPhone}</span>
                </a>
                <a href={`mailto:${item.ownerEmail}`} className="flex justify-between items-center p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-black text-slate-400 uppercase">Email</span>
                  <span className="font-bold underline">{item.ownerEmail}</span>
                </a>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
               <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Please mention the Asset ID during contact</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ItemDetails;
