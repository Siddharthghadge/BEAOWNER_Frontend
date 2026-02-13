import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { getOwnerRentals, deleteRentalItem, getRentalCategories } from '@/api/rentalApi';
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from 'react-toastify';
import { API_URLS } from '@/config/apiUrls';

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
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />
      
      {/* 1. MANAGEMENT DASHBOARD HEADER */}
      <div className="bg-[#0F172A] pt-24 pb-40 px-6 lg:px-20 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-white text-5xl font-black uppercase tracking-tighter">
                ASSET <span className="text-indigo-500 italic">VAULT</span>
              </h1>
              <div className="flex gap-6 mt-6">
                <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl min-w-[120px]">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Items</p>
                  <p className="text-2xl font-black text-white">{stats.total}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl min-w-[120px]">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Available</p>
                  <p className="text-2xl font-black text-emerald-400">{stats.available}</p>
                </div>
                <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl min-w-[120px]">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Rented</p>
                  <p className="text-2xl font-black text-indigo-400">{stats.rented}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate("/owner/add")}
              className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-indigo-500 shadow-2xl shadow-indigo-500/40 transition-all border-b-4 border-indigo-800"
            >
              + Add New Asset
            </button>
          </div>
        </div>
      </div>

      {/* 2. SMART FILTERS BAR */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-slate-200 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text"
              placeholder="SEARCH BY ITEM TITLE..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-black text-xs tracking-widest uppercase transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            {['ALL', 'AVAILABLE', 'BOOKED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 lg:flex-none px-6 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all border-2 
                  ${statusFilter === status ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. INVENTORY GRID */}
      <div className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
        {loading ? (
          <div className="bg-white rounded-[2rem] p-20 text-center flex flex-col items-center border border-slate-100 shadow-xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mb-6"></div>
            <p className="text-slate-900 font-black uppercase tracking-[0.3em]">Opening Vault...</p>
          </div>
        ) : filteredRentals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRentals.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all group">
                <div className="relative h-48 bg-slate-100">
                  <img src={getImageUrl(item)} alt={item.title} className="w-full h-full object-cover" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[9px] font-black uppercase text-white shadow-lg ${item.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    {item.status}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1 mb-4">{item.title}</h3>
                  
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl mb-6">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Price</p>
                      <p className="text-lg font-black text-indigo-600 leading-none">₹{item.pricingOptions?.[0]?.price || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Condition</p>
                      <p className="text-[10px] font-black text-slate-700 uppercase leading-none">{item.itemCondition}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => navigate(`/owner/edit/${item.id}`)} className="bg-slate-900 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">EDIT</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-rose-50 text-rose-600 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all">DELETE</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border-4 border-dashed border-slate-100 shadow-sm">
            <h2 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tighter">No items match your search</h2>
            <button onClick={() => {setSearchQuery(""); setStatusFilter("ALL");}} className="text-indigo-600 font-black text-xs uppercase tracking-widest underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRentals;