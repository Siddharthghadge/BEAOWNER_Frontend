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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="bg-white px-4 py-2 rounded-xl font-semibold shadow-sm hover:shadow transition"
          >
            ← Back
          </button>

          <div className="flex gap-2">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
              ✨ Premium inventory
            </span>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
              Available today
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-slate-400">Collection</p>
            <h1 className="text-4xl font-extrabold text-slate-900 mt-1">
              {displayName}
            </h1>
            <p className="text-slate-500 mt-2 max-w-md">
              Curated rentals with transparent pricing, verified condition, and flexible pickup.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center bg-white border rounded-xl px-4 py-2 w-full md:w-auto flex-1">
                🔍
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, area, city..."
                  className="ml-2 w-full outline-none text-sm"
                />
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl">
                {["recommended", "low", "high"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSortOrder(t)}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition
                      ${sortOrder === t ? "bg-slate-900 text-white shadow" : "text-slate-600"}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase mb-4">Insights</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-2xl p-4">
                <p className="text-xs text-slate-400 font-bold">Avg price</p>
                <p className="text-xl font-extrabold">₹{avgPrice}</p>
              </div>
              <div className="border rounded-2xl p-4">
                <p className="text-xs text-slate-400 font-bold">Top city</p>
                <p className="text-xl font-extrabold">Pune</p>
              </div>
            </div>
            <div className="mt-4 bg-purple-50 border border-purple-100 rounded-xl p-3 text-sm text-purple-700">
              ✨ Compare condition badges and pick up near you to save time.
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map(item => (
            <RentalCard key={item.id} item={item} navigate={navigate} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-14 pt-6 border-t flex flex-wrap justify-between items-center gap-4 text-sm text-slate-500">
          <p>
            Showing <b>{currentItems.length}</b> items in <b>{displayName}</b>
          </p>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-semibold border transition
                  ${currentPage === i + 1
                    ? "bg-slate-900 text-white border-slate-900 shadow"
                    : "bg-white"}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <p className="text-xs">Prices are indicative. Availability may change.</p>
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
    <div
      onClick={() => navigate(`/item-details/${item.id}`)}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden cursor-pointer
                 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="relative h-56">
       <img
  src={buildImageUrl(item.imageUrl)}
  alt={item.title}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.target.src = "https://placehold.co/600x400?text=Image+Unavailable";
  }}
/>

        <span className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow">
          {item.itemCondition || "Mint"}
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg">{item.title}</h3>
        <p className="text-sm text-slate-500 mt-1">
          📍 {item.area}, {item.city}
        </p>

        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <div>
            <span className="text-blue-600 font-bold">₹</span>
            <span className="text-2xl font-extrabold ml-1">{price}</span>
            <span className="text-sm text-slate-400 ml-1">{period}</span>
          </div>

          <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold">
            View details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rentals;
