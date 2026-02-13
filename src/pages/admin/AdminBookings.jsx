import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import { getAllBookings, processRefund } from "../../api/adminApi";
import { toast } from "react-toastify";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      const sortedData = (res.data || []).sort((a, b) => b.id - a.id);
      setBookings(sortedData);
    } catch (err) {
      toast.error("Failed to sync booking ledger.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (bookingId, maxAmount) => {
    const userInput = window.prompt(
      `Enter refund amount for Booking #${bookingId}:`,
      maxAmount
    );

    if (userInput === null || userInput.trim() === "") return;
    const refundAmt = Number(userInput);

    if (isNaN(refundAmt) || refundAmt <= 0 || refundAmt > Number(maxAmount)) {
      toast.error("Invalid refund amount. Action cancelled.");
      return;
    }

    try {
      const formattedRefundAmt = refundAmt.toFixed(2);
      await processRefund(bookingId, formattedRefundAmt);
      toast.success(`Refund of ${formattedRefundAmt} credited.`);
      fetchBookings();
    } catch (err) {
      const errorMsg = err.response?.data || "Authorization failure.";
      toast.error(errorMsg);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === "ALL" || b.status === filterStatus;
    const bDate = b.startDate ? b.startDate.split("T")[0] : "";
    const matchesDate = !filterDate || bDate === filterDate;

    const s = searchQuery.toLowerCase().trim();
    const matchesSearch =
      b.id.toString().includes(s) ||
      (b.customerEmail && b.customerEmail.toLowerCase().includes(s)) ||
      (b.ownerEmail && b.ownerEmail.toLowerCase().includes(s));

    return matchesStatus && matchesDate && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBookings.length / recordsPerPage);
  const currentRecords = filteredBookings.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 mb-4"></div>
      <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Querying Transaction Logs...</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <AdminNavbar />

      {/* COMMAND HEADER */}
      <div className="bg-[#0F172A] pt-32 pb-44 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-white font-black text-3xl uppercase tracking-tighter italic">Booking Ledger</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              Active Records: {filteredBookings.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Search</label>
              <input
                type="text"
                placeholder="EMAIL OR ID..."
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:ring-2 ring-indigo-500/50 w-64"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Disbursement Date</label>
              <input
                type="date"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none invert brightness-200"
                value={filterDate}
                onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status Flow</label>
              <select
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black text-indigo-300 outline-none uppercase tracking-widest cursor-pointer"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              >
                <option value="ALL">All States</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="COMPLETED">Completed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trace ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parties (C / O)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">State</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentRecords.length > 0 ? currentRecords.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 font-black text-indigo-600 text-xs italic tracking-tighter">#{b.id}</td>
                    <td className="px-8 py-6">
                      <span className="text-xl">{b.carId ? "🚗" : "🏍️"}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-wide truncate max-w-[200px]">{b.customerEmail}</span>
                        <div className="h-px w-4 bg-slate-200"></div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[200px]">{b.ownerEmail}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 text-xs">
                      ₹{b.totalAmount?.toLocaleString() || 0}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        b.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-600" :
                        b.status === "CANCELLED" ? "bg-rose-50 text-rose-600" :
                        b.status === "REFUNDED" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button
                        disabled={b.status === "REFUNDED"}
                        onClick={() => handleRefund(b.id, b.totalAmount)}
                        className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          b.status === "REFUNDED" 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                          : "bg-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white shadow-lg shadow-amber-200/50"
                        }`}
                      >
                        {b.status === "REFUNDED" ? "Settled" : "Initiate Refund"}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-black text-xs uppercase tracking-[0.3em]">
                      No Transactional Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION ENGINE */}
          {totalPages > 1 && (
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30"
              >
                Prev
              </button>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Page <span className="text-indigo-600">{currentPage}</span> of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;