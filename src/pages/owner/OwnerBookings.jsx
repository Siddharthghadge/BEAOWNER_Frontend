import React, { useState, useEffect, useMemo } from 'react';
import bookingService from '../../api/bookingService'; 
import OtpVerificationModal from "../../components/modals/OtpVerificationModal";
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from 'react-toastify';

const OwnerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    
    // Efficiency States
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("PENDING"); // PENDING, COMPLETED, ALL

    useEffect(() => {
        const fetchInitialData = () => {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                setErrorMsg("User session not found.");
                setLoading(false);
                return;
            }
            try {
                const user = JSON.parse(userStr);
                const ownerId = user.id || user.userId || user.sub;
                if (ownerId) loadBookings(ownerId);
            } catch (err) {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const loadBookings = async (ownerId) => {
        try {
            setLoading(true);
            const res = await bookingService.getOwnerBookings(ownerId);
            setBookings(res.data || []);
        } catch (err) {
            setErrorMsg("Failed to sync bookings.");
        } finally {
            setLoading(false);
        }
    };

    // Advanced Filtering Logic
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchesSearch = b.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 b.id.toString().includes(searchTerm);
            
            const isPending = b.status === 'CONFIRMED' || b.status === 'PAID';
            const isCompleted = b.status === 'COMPLETED';

            if (activeTab === "PENDING") return matchesSearch && isPending;
            if (activeTab === "COMPLETED") return matchesSearch && isCompleted;
            return matchesSearch;
        });
    }, [bookings, searchTerm, activeTab]);

    const stats = useMemo(() => ({
        pending: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PAID').length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length
    }), [bookings]);

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
            <OwnerNavbar />

            {/* HERO SECTION WITH REAL-TIME STATS */}
            <div className="bg-[#0F172A] pt-24 pb-40 px-6 lg:px-20 relative">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
                    <div>
                        <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
                            BOOKING <span className="text-indigo-500 italic">HUB</span>
                        </h1>
                        <div className="flex gap-4 mt-6">
                            <div className="bg-amber-500/10 border border-amber-500/20 px-5 py-3 rounded-2xl">
                                <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Pending Action</p>
                                <p className="text-2xl font-black text-amber-400">{stats.pending}</p>
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl">
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Completed</p>
                                <p className="text-2xl font-black text-emerald-400">{stats.completed}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH & TAB CONTROL BAR */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
                <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-slate-200 flex flex-col lg:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
                        <input 
                            type="text"
                            placeholder="SEARCH BY EMAIL OR BOOKING ID..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none font-black text-[11px] tracking-widest uppercase transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full lg:w-auto">
                        {['PENDING', 'COMPLETED', 'ALL'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all 
                                    ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* LIST AREA */}
            <div className="max-w-7xl mx-auto px-6 mt-10 relative z-10">
                {loading ? (
                    <div className="bg-white rounded-[2rem] p-20 text-center shadow-xl flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mb-4"></div>
                        <p className="font-black text-xs uppercase tracking-widest text-slate-400">Loading your history...</p>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredBookings.map((b) => (
                            <div key={b.id} className="bg-white rounded-[2rem] border-2 border-slate-100 p-7 shadow-lg hover:border-indigo-200 transition-all flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase tracking-widest">ID: #{b.id}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg
                                        ${b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {b.status}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                                    <p className="text-sm font-bold text-slate-800 break-all">{b.customerEmail}</p>
                                </div>

                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl mb-8">
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase">Type</p>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{b.carId ? '🚗 Vehicle' : '🏍️ Bike'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-slate-400 uppercase">Handover</p>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">OTP REQUIRED</p>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    {b.status !== 'COMPLETED' ? (
                                        <button 
                                            onClick={() => setSelectedBooking(b.id)}
                                            className="w-full bg-indigo-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 hover:bg-[#0F172A] transition-all"
                                        >
                                            Verify OTP 🔑
                                        </button>
                                    ) : (
                                        <div className="w-full py-4 rounded-xl border-2 border-dashed border-slate-100 text-center">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Payout Released ✅</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-24 text-center border-4 border-dashed border-slate-100">
                        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">No Bookings Found In This Tab</p>
                    </div>
                )}
            </div>

            {selectedBooking && (
                <OtpVerificationModal 
                    bookingId={selectedBooking} 
                    onClose={() => setSelectedBooking(null)}
                    onSuccess={() => {
                        toast.success("Verification Successful!");
                        const user = JSON.parse(localStorage.getItem("user"));
                        loadBookings(user.id || user.userId); 
                        setSelectedBooking(null);
                    }}
                />
            )}
        </div>
    );
};

export default OwnerBookings;