import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRentalsByCategory } from "@/api/rentalApi";
import { API_URLS } from "@/config/apiUrls";


/* =========================
   Image URL handler (Cloudinary + Local)
========================= */
const buildImageUrl = (file) => {
  if (!file) return "https://placehold.co/600x400";

  const cleanFile = String(file).trim();

  // ✅ If Cloudinary / external URL → use directly
  if (cleanFile.startsWith("http")) {
    return cleanFile;
  }

  // ✅ fallback for old local storage
  return `${API_URLS.RENTALS.split("/api")[0]}${cleanFile}`;
};


/* =========================
   Helper: pricing priority
========================= */
const getPrimaryPriceOption = (pricingOptions = []) => {
  return (
    pricingOptions.find(p => p.durationType === "YEARLY") ||
    pricingOptions.find(p => p.durationType === "MONTHLY") ||
    pricingOptions.find(p => p.durationType === "DAILY") ||
    null
  );
};

/* ---------- UI-only labels ---------- */
const SORT_LABELS = {
  recommended: "Recommended",
  low: "Price: low to high",
  high: "Price: high to low",
};

const toSentenceCase = (str = "") =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const Rentals = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || "";
  const displayName = decodeURIComponent(categoryParam);

  useEffect(() => {
    const fetchItems = async () => {
      if (!categoryParam) return;
      try {
        setLoading(true);
        const data = await getRentalsByCategory(displayName);
        setItems(data.filter(i => i.status === "AVAILABLE"));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [categoryParam, displayName]);

  const filteredItems = useMemo(() => {
    let result = items.filter((item) => {
      const searchStr = `${item.title} ${item.area} ${item.city}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });

    if (sortOrder !== "recommended") {
      result.sort((a, b) => {
        const aP = getPrimaryPriceOption(a.pricingOptions)?.price || 0;
        const bP = getPrimaryPriceOption(b.pricingOptions)?.price || 0;
        return sortOrder === "low" ? aP - bP : bP - aP;
      });
    }
    return result;
  }, [items, searchQuery, sortOrder]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const avgPrice = useMemo(() => {
    if (!items.length) return 0;
    return Math.round(
      items.reduce((acc, i) => acc + (getPrimaryPriceOption(i.pricingOptions)?.price || 0), 0) / items.length
    );
  }, [items]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Loading rentals…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-900">

      {/* HERO */}
      <header className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-8 lg:px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-300 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
              </svg>
              Back to home
            </button>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                Premium inventory
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                Available today
              </span>
            </div>
          </div>

          <p className="text-sm font-medium text-indigo-300">Collection</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {displayName}
          </h1>
          <p className="mt-3 max-w-xl text-base text-slate-400">
            Curated rentals with transparent pricing, verified condition, and flexible pickup.
          </p>
        </div>
      </header>

      <div className="relative z-20 mx-auto -mt-20 max-w-7xl px-6 lg:px-8">

        {/* SEARCH + INSIGHTS */}
        <div className="mb-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">Find your rental</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">Search by name, area or city and sort by price.</p>

            <div className="flex flex-col gap-3">
              <div className="relative w-full">
                <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                </svg>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, area, city..."
                  aria-label="Search rentals"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-1 rounded-xl bg-slate-100 p-1 sm:grid-cols-3" role="radiogroup" aria-label="Sort order">
                {["recommended", "low", "high"].map((t) => {
                  const active = sortOrder === t;
                  return (
                    <button
                      key={t}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSortOrder(t)}
                      className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
                        active ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {SORT_LABELS[t]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-900">Quick insights</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Avg price</p>
                <p className="mt-1 text-xl font-bold text-slate-900">₹{avgPrice}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Top city</p>
                <p className="mt-1 text-xl font-bold text-slate-900">Pune</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2.5 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm text-indigo-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Compare condition badges and pick up near you to save time.
            </div>
          </div>
        </div>

        {/* GRID */}
        {currentItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentItems.map(item => (
              <RentalCard key={item.id} item={item} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">No rentals found</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Try a different search term or check back soon for new listings.
            </p>
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row">
          <p>
            Showing <b className="text-slate-700">{currentItems.length}</b> items in{" "}
            <b className="text-slate-700">{displayName}</b>
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                aria-current={currentPage === i + 1 ? "page" : undefined}
                className={`h-10 min-w-[2.5rem] rounded-lg border px-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
                  currentPage === i + 1
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400">Prices are indicative. Availability may change.</p>
        </div>
      </div>
    </div>
  );
};

const RentalCard = ({ item, navigate }) => {
  const main = getPrimaryPriceOption(item.pricingOptions);
  const price = main?.price || 0;
  const period =
    main?.durationType === "YEARLY" ? "/yr" :
    main?.durationType === "MONTHLY" ? "/mo" : "/day";

  return (
    <article
      onClick={() => navigate(`/item-details/${item.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/item-details/${item.id}`);
      }}
      tabIndex={0}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={buildImageUrl(item.imageUrl)}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400?text=Image+Unavailable";
          }}
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
          {toSentenceCase(item.itemCondition) || "Mint"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900" title={item.title}>
          {item.title}
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
          <svg className="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{item.area}, {item.city}</span>
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="mt-4 flex items-baseline">
            <span className="text-sm font-semibold text-indigo-600">₹</span>
            <span className="ml-0.5 text-2xl font-bold text-slate-900">{price}</span>
            <span className="ml-1 text-sm text-slate-400">{period}</span>
          </div>

          <button className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-indigo-600">
            View details
          </button>
        </div>
      </div>
    </article>
  );
};

export default Rentals;