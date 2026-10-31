import React, { useState, useEffect, useMemo } from 'react';
import bookingService from '../../api/bookingService'; 
import OtpVerificationModal from "../../components/modals/OtpVerificationModal";
import OwnerNavbar from '@/components/common/OwnerNavbar';
import { toast } from 'react-toastify';

/* ---------- UI-only helpers ---------- */
const TAB_LABELS = { PENDING: 'Pending', COMPLETED: 'Completed', ALL: 'All' };

const STATUS_STYLES = {
    CONFIRMED: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    PAID: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
};
const STATUS_DOTS = {
    CONFIRMED: 'bg-amber-500',
    PAID: 'bg-amber-500',
    COMPLETED: 'bg-emerald-500',
};

const toSentenceCase = (str = '') =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

const StatCard = ({ label, value, valueClass, boxClass, labelClass }) => (
    <div className={`min-w-[140px] rounded-xl border px-5 py-4 backdrop-blur-sm ${boxClass}`}>
        <p className={`text-sm ${labelClass}`}>{label}</p>
        <p className={`mt-1 text-3xl font-bold tracking-tight ${valueClass}`}>{value}</p>
    </div>
);

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
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <OwnerNavbar />

            {/* PAGE HEADER WITH STATS */}
            <header className="relative overflow-hidden bg-slate-900">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
                <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 pb-32 pt-14 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Manage bookings</h1>
                    <p className="mt-2 max-w-xl text-base text-slate-400">
                        Review customer bookings and verify the handover code to complete each rental.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-4">
                        <StatCard
                            label="Pending action"
                            value={stats.pending}
                            boxClass="border-amber-400/20 bg-amber-500/10"
                            labelClass="text-amber-300/80"
                            valueClass="text-amber-300"
                        />
                        <StatCard
                            label="Completed"
                            value={stats.completed}
                            boxClass="border-emerald-400/20 bg-emerald-500/10"
                            labelClass="text-emerald-300/80"
                            valueClass="text-emerald-300"
                        />
                    </div>
                </div>
            </header>

            {/* SEARCH & TAB CONTROL BAR */}
            <div className="relative z-30 mx-auto -mt-10 max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg lg:flex-row lg:items-center">
                    <div className="relative w-full flex-1">
                        <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                        </svg>
                        <input 
                            type="text"
                            placeholder="Search by email or booking ID"
                            aria-label="Search by email or booking ID"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-[15px] text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="grid w-full grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 lg:w-auto" role="radiogroup" aria-label="Filter bookings">
                        {['PENDING', 'COMPLETED', 'ALL'].map((tab) => {
                            const active = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setActiveTab(tab)}
                                    className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100
                                        ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                >
                                    {TAB_LABELS[tab]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* LIST AREA */}
            <main className="relative z-10 mx-auto mt-8 max-w-7xl px-6 lg:px-8">
                {!loading && filteredBookings.length > 0 && (
                    <p className="mb-4 text-sm text-slate-500">
                        Showing <span className="font-semibold text-slate-700">{filteredBookings.length}</span>{' '}
                        {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                    </p>
                )}

                {loading ? (
                    <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-sm">
                        <div className="mb-5 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
                        <p className="text-sm font-medium text-slate-500">Loading your bookings…</p>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredBookings.map((b) => (
                            <article key={b.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
                                <div className="mb-5 flex items-center justify-between gap-3">
                                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        Booking #{b.id}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                            STATUS_STYLES[b.status] || 'bg-slate-100 text-slate-700 ring-slate-500/20'
                                        }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[b.status] || 'bg-slate-400'}`}></span>
                                        {toSentenceCase(b.status)}
                                    </span>
                                </div>

                                <div className="mb-5">
                                    <p className="mb-1 text-xs font-medium text-slate-500">Customer</p>
                                    <p className="break-all text-[15px] font-semibold text-slate-900">{b.customerEmail}</p>
                                </div>

                                <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">Type</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">{b.carId ? 'Vehicle' : 'Bike'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-500">Handover</p>
                                        <p className="mt-1 text-sm font-semibold text-slate-900">OTP required</p>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    {b.status !== 'COMPLETED' ? (
                                        <button 
                                            onClick={() => setSelectedBooking(b.id)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98]"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
                                            </svg>
                                            Verify OTP
                                        </button>
                                    ) : (
                                        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700">
                                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
                                            </svg>
                                            Payout released
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">No bookings found</h2>
                        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                            {errorMsg || "There are no bookings in this tab yet. Try another tab or a different search."}
                        </p>
                    </div>
                )}
            </main>

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