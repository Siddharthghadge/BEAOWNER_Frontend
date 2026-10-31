import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { getOwnerRentals, deleteRentalItem, getRentalCategories } from '@/api/rentalApi';
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from 'react-toastify';
import { API_URLS } from '@/config/apiUrls';

/* ---------- UI-only helpers (no business logic) ---------- */
const FILTER_LABELS = { ALL: 'All', AVAILABLE: 'Available', BOOKED: 'Booked' };

const STATUS_STYLES = {
  AVAILABLE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  RENTED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  UNAVAILABLE: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};
const STATUS_DOTS = {
  AVAILABLE: 'bg-emerald-500',
  RENTED: 'bg-amber-500',
  UNAVAILABLE: 'bg-slate-400',
};

const toSentenceCase = (str = '') =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

const StatCard = ({ label, value, accent }) => (
  <div className="min-w-[130px] rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
    <p className="text-sm text-slate-400">{label}</p>
    <p className={`mt-1 text-3xl font-bold tracking-tight ${accent}`}>{value}</p>
  </div>
);

const MyRentals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const categoryName = searchParams.get("category");
  const [rentals, setRentals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // New State for Search and Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const getBaseServerUrl = useCallback(() => {
    if (!API_URLS.RENTALS) return "";
    return API_URLS.RENTALS.split('/api')[0];
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const [cats, data] = await Promise.all([
        getRentalCategories(),
        getOwnerRentals()
      ]);
      setCategories(cats);
      setRentals(data);
    } catch (err) {
      toast.error("Inventory sync failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData, location.key]);

  // Optimized Filtering Logic
  const filteredRentals = useMemo(() => {
    return rentals.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !categoryName || categoryName === "All" || 
                             item.categoryName?.toLowerCase() === categoryName.toLowerCase();
      const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [rentals, searchQuery, categoryName, statusFilter]);

  const stats = useMemo(() => ({
    total: rentals.length,
    available: rentals.filter(r => r.status === 'AVAILABLE').length,
    rented: rentals.filter(r => r.status !== 'AVAILABLE').length,
  }), [rentals]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this listing permanently?")) {
      try {
        await deleteRentalItem(id);
        setRentals(prev => prev.filter(item => item.id !== id));
        toast.success("Item removed.");
      } catch (err) {
        toast.error("Delete failed.");
      }
    }
  };

  const getImageUrl = (item) => {
    const path = (item.imageUrls && item.imageUrls.length > 0) ? item.imageUrls[0] : item.imageUrl;
    if (!path) return 'https://placehold.co/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    return `${getBaseServerUrl()}/${path.replace(/^\/+/, "")}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <OwnerNavbar />
      
      {/* 1. PAGE HEADER */}
      <header className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-14 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My rentals</h1>
                {categoryName && categoryName !== "All" && (
                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-sm font-medium text-indigo-200">
                    {categoryName}
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-xl text-base text-slate-400">
                Manage your listings, check availability and keep your inventory up to date.
              </p>

              <div className="mt-7 flex flex-wrap gap-4">
                <StatCard label="Total items" value={stats.total} accent="text-white" />
                <StatCard label="Available" value={stats.available} accent="text-emerald-400" />
                <StatCard label="Rented" value={stats.rented} accent="text-amber-400" />
              </div>
            </div>

            <button 
              onClick={() => navigate("/owner/add")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300/40 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add new item
            </button>
          </div>
        </div>
      </header>

      {/* 2. SEARCH & FILTERS */}
      <div className="relative z-30 mx-auto -mt-10 max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg lg:flex-row lg:items-center">
          <div className="relative w-full flex-1">
            <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Search by item title"
              aria-label="Search by item title"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 lg:w-auto" role="radiogroup" aria-label="Filter by status">
            {['ALL', 'AVAILABLE', 'BOOKED'].map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
                    active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {FILTER_LABELS[status]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. INVENTORY GRID */}
      <main className="relative z-10 mx-auto mt-8 max-w-7xl px-6 lg:px-8">
        {!loading && (
          <p className="mb-4 text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredRentals.length}</span>{' '}
            {filteredRentals.length === 1 ? 'item' : 'items'}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-sm">
            <div className="mb-5 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
            <p className="text-sm font-medium text-slate-500">Loading your listings…</p>
          </div>
        ) : filteredRentals.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRentals.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={getImageUrl(item)}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur ${
                      STATUS_STYLES[item.status] || 'bg-rose-50 text-rose-700 ring-rose-600/20'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[item.status] || 'bg-rose-500'}`}></span>
                    {toSentenceCase(item.status)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-1 text-base font-semibold text-slate-900" title={item.title}>
                    {item.title}
                  </h3>

                  <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="text-xl font-bold leading-none text-slate-900">
                        ₹{item.pricingOptions?.[0]?.price || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Condition</p>
                      <p className="text-sm font-semibold leading-none text-slate-700">
                        {toSentenceCase(item.itemCondition)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/owner/edit/${item.id}`)}
                      className="rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg border border-rose-200 bg-white py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">No items match your search</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Try a different title or status, or clear your filters to see all your listings.
            </p>
            <button
              onClick={() => {setSearchQuery(""); setStatusFilter("ALL");}}
              className="mt-6 inline-flex rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRentals;