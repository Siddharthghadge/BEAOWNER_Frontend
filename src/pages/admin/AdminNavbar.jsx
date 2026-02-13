import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = ({ onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /**
   * Logic: If we are on the standalone Bookings page, we navigate back
   * to the main Admin route before firing the tab change.
   */
  const handleTabClick = (tab) => {
    if (location.pathname !== "/admin") {
      navigate("/admin");
      // Small delay to allow AdminDashboard to mount before setting its internal state
      setTimeout(() => {
        if (onTabChange) onTabChange(tab);
      }, 100);
    } else {
      if (onTabChange) onTabChange(tab);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-[#0F172A] border-b border-slate-800 flex justify-between items-center px-8 lg:px-12 z-[2000] shadow-2xl">
      
      {/* BRANDING */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/admin")}
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
          🚀
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black text-xs uppercase tracking-[0.2em] leading-none">Admin</span>
          <span className="text-indigo-400 font-black text-lg uppercase tracking-tighter leading-none">Console</span>
        </div>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800/50">
        <button 
          onClick={() => handleTabClick("users")} 
          className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isActive("/admin") && location.search.includes("users") // Optional: if you use query params
            ? "text-white bg-slate-800" 
            : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          User Registry
        </button>
        
        <div className="w-px h-4 bg-slate-800 mx-1"></div>
        
        <button 
          onClick={() => handleTabClick("cars")} 
          className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          Car Approvals
        </button>
        
        <button 
          onClick={() => handleTabClick("bikes")} 
          className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          Bike Approvals
        </button>

        {/* STANDALONE PAGE LINK */}
        <button 
          onClick={() => navigate("/admin/bookings")} 
          className={`ml-4 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
            isActive("/admin/bookings") 
            ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" 
            : "bg-slate-800 text-indigo-300 border-slate-700 hover:bg-slate-700"
          }`}
        >
          Bookings & Refunds
        </button>
      </div>

      {/* ACTION AREA */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center justify-end gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Operational
          </span>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-rose-500/20 transition-all active:scale-95"
        >
          Exit System
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;