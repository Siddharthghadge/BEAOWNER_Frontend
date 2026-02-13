import React from "react";
import { Link, useNavigate } from "react-router-dom";

const MainNavbar = () => {
  const navigate = useNavigate();
  // Check for accessToken to determine login status
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="h-[80px] bg-white border-b border-gray-100 flex justify-between items-center px-6 lg:px-12 sticky top-0 z-50 shadow-sm">
      {/* BRANDING: BEAOWNER WITH LOGO */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-100 shadow-sm">
          <img 
            /* IMPORTANT: Ensure this file is in your 'public' folder. 
               Rename it to 'logo.jpg' for simplicity or use the full name below.
            */
            src="/Gemini_Generated_Image_hizgnvhizgnvhizg.jpg" 
            alt="BEAOWNER Logo" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
                e.target.onerror = null; 
                e.target.src="https://placehold.co/100x100?text=B"
            }}
          />
        </div>
        <h2 className="m-0 font-black text-2xl tracking-tighter uppercase italic text-[#0F172A]">
          BEA<span className="text-indigo-600">OWNER</span>
        </h2>
      </div>

      {/* NAVIGATION LINKS */}
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors"
        >
          Home
        </Link>

        {isLoggedIn && (
          <>
            {/* MATCHING ROUTE: Ensure your Route in App.js is <Route path="/my-bookings" ... />
            */}
            <Link
              to="/bookings"
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors"
            >
              My Bookings
            </Link>
            <Link
              to="/want-to-earn"
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              Earn <span className="text-[14px]">💰</span>
            </Link>
          </>
        )}

        {/* AUTH BUTTONS */}
        {!isLoggedIn ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
            <Link
              to="/login"
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-indigo-600 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="pl-4 border-l border-slate-100">
            <button
              onClick={handleLogout}
              className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-600 hover:text-white transition-all shadow-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;