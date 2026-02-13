import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const OwnerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Helper to check if a link is active for the underline effect
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-[80px] bg-white border-b border-gray-100 flex justify-between items-center px-6 lg:px-12 sticky top-0 z-[1000] shadow-sm">
      
      {/* BRANDING: BEAOWNER WITH LOGO (Using your styles) */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/owner/home")}
      >
        <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
          <img 
            src="/Gemini_Generated_Image_hizgnvhizgnvhizg.jpg" 
            alt="BEAOWNER Logo" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src="https://placehold.co/100x100?text=B"
            }}
          />
        </div>
        <div className="flex flex-col">
          <h2 className="m-0 font-black text-2xl tracking-tighter uppercase italic text-[#0F172A]">
            BEA<span className="text-indigo-600">OWNER</span>
          </h2>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">
            Owner Control Panel
          </span>
        </div>
      </div>

      {/* NAVIGATION LINKS - Increased font-size and spacing */}
      <div className="flex items-center gap-8">
        <Link
          to="/owner/home"
          className={`text-[12px] font-black uppercase tracking-[0.2em] transition-colors ${
            isActive("/owner/home") ? "text-indigo-600 underline underline-offset-8" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/owner/my-rentals"
          className={`text-[12px] font-black uppercase tracking-[0.2em] transition-colors ${
            isActive("/owner/my-rentals") ? "text-indigo-600 underline underline-offset-8" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          My Inventory
        </Link>

        <Link
          to="/owner/my-bookings"
          className={`text-[12px] font-black uppercase tracking-[0.2em] transition-colors ${
            isActive("/owner/my-bookings") ? "text-indigo-600 underline underline-offset-8" : "text-slate-400 hover:text-indigo-600"
          }`}
        >
          Manage Bookings
        </Link>

        {/* USER & AUTH SECTION */}
        <div className="flex items-center gap-6 pl-6 border-l border-slate-100">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Connected as</span>
            <span className="text-[11px] font-bold text-slate-900">{user?.email}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default OwnerNavbar;