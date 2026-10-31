import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRentalById } from "@/api/rentalApi";
import { API_URLS } from "@/config/apiUrls";

/* ---------- UI-only helpers ---------- */
const toSentenceCase = (str = "") =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const PERIOD_LABELS = { DAILY: "day", WEEKLY: "week", MONTHLY: "month", YEARLY: "year" };

const CONDITION_STYLES = {
  NEW: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  EXCELLENT: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  GOOD: "bg-sky-50 text-sky-700 ring-sky-600/20",
  FAIR: "bg-amber-50 text-amber-700 ring-amber-600/20",
};

const TRUST_ITEMS = [
  {
    label: "Verified owner",
    icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
  {
    label: "Transparent pricing",
    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  },
  {
    label: "No hidden fees",
    icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
  },
];

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Loading item details…</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Item not found</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          This listing may have been removed or is no longer available.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          Go back
        </button>
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
  const periodLabel = PERIOD_LABELS[plan?.durationType] || plan?.durationType?.toLowerCase() || "day";

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900 lg:pb-20">
      {/* TOP BAR */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 text-sm">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg font-medium text-slate-600 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
              </svg>
              Back
            </button>
            {item.categoryName && (
              <>
                <span className="text-slate-300">/</span>
                <span className="truncate text-slate-500">{item.categoryName}</span>
              </>
            )}
            <span className="hidden text-slate-300 sm:inline">/</span>
            <span className="hidden truncate font-medium text-slate-700 sm:inline">{item.title}</span>
          </div>
          <span className="ml-3 hidden shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 sm:inline-block">
            Listing ID: {id?.slice(-6)}
          </span>
        </div>
      </div>

      <main className="mx-auto mt-8 grid max-w-7xl items-start gap-8 px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* LEFT – GALLERY */}
        <div className="space-y-4 lg:col-span-7">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={getFullImageUrl(imageUrls[activeImg])}
              alt={item.title}
              className="h-[320px] w-full object-contain p-4 sm:h-[460px] lg:h-[560px]"
            />

            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImg((activeImg - 1 + imageUrls.length) % imageUrls.length)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveImg((activeImg + 1) % imageUrls.length)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                >
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.3 15.7a1 1 0 010-1.4L11.6 10 7.3 5.7a1 1 0 011.4-1.4l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {activeImg + 1} / {imageUrls.length}
                </span>
              </>
            )}
          </div>

          {imageUrls.length > 1 && (
            <div className="flex gap-3">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImg(index)}
                  aria-label={`Show photo ${index + 1}`}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 bg-white transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100
                    ${
                      activeImg === index
                        ? "border-indigo-600 ring-2 ring-indigo-100"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }
                  `}
                >
                  <img
                    src={getFullImageUrl(url)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-3 border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">
              About this item
            </h2>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-600">
              {item.description}
            </p>
          </div>
        </div>

        {/* RIGHT – DETAILS (sticky on desktop) */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-5">
          {/* TITLE */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {item.categoryName && (
                <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                  {item.categoryName}
                </span>
              )}
              {item.itemCondition && (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                    CONDITION_STYLES[item.itemCondition] || "bg-slate-100 text-slate-700 ring-slate-500/20"
                  }`}
                >
                  {toSentenceCase(item.itemCondition)}
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {item.title}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
              <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {item.area}, {item.city}
            </p>
          </div>

          {/* PRICE + CTA */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-7 text-white shadow-xl">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-indigo-500/30 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-sky-500/10 blur-3xl"></div>
            <div className="relative">
              <p className="text-sm font-medium text-slate-400">Rental price</p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">
                  ₹{plan?.price || "---"}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  / {periodLabel}
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm ring-1 ring-inset ring-white/10">
                <span className="text-slate-400">Refundable security deposit</span>
                <span className="font-semibold text-white">₹{item.securityDeposit}</span>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="mt-5 w-full rounded-xl bg-indigo-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/40 active:scale-[0.98]"
              >
                Reserve this item
              </button>

              <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
                {TRUST_ITEMS.map((t) => (
                  <li key={t.label} className="flex flex-col items-center gap-1.5 text-center">
                    <svg className="h-5 w-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                    </svg>
                    <span className="text-[11px] leading-tight text-slate-400">{t.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SPECS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Condition</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {toSentenceCase(item.itemCondition)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500">Security deposit</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                ₹{item.securityDeposit}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE RESERVE BAR */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <div>
            <p className="text-xs text-slate-500">Rental price</p>
            <p className="text-xl font-bold leading-tight text-slate-900">
              ₹{plan?.price || "---"}
              <span className="ml-1 text-sm font-medium text-slate-500">/ {periodLabel}</span>
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98]"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* CONTACT MODAL */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Contact owner"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-6 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-7 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Contact owner</h3>
                <p className="mt-1 text-sm text-slate-500">Reach out directly to reserve this item.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M5.3 5.3a1 1 0 011.4 0L10 8.6l3.3-3.3a1 1 0 111.4 1.4L11.4 10l3.3 3.3a1 1 0 01-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 01-1.4-1.4L8.6 10 5.3 6.7a1 1 0 010-1.4z" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold uppercase text-white">
                  {item.ownerName?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">Listing owner</p>
                  <p className="truncate text-lg font-semibold text-slate-900">{item.ownerName}</p>
                </div>
              </div>

              <div className="grid gap-3">
                <a
                  href={`tel:${item.ownerPhone}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                >
                  <span className="text-sm text-slate-500">Mobile</span>
                  <span className="font-semibold text-slate-900">{item.ownerPhone}</span>
                </a>
                <a
                  href={`mailto:${item.ownerEmail}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                >
                  <span className="text-sm text-slate-500">Email</span>
                  <span className="truncate font-semibold text-indigo-600">{item.ownerEmail}</span>
                </a>
              </div>
            </div>

            <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
              Please mention the Listing ID ({id?.slice(-6)}) when you contact the owner.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ItemDetails;