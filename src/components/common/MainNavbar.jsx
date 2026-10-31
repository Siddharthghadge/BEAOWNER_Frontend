import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

/* ---------- UI-only helper: link styling (active page highlighted) ---------- */
const navLinkClass = ({ isActive }) =>
  `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
    isActive
      ? "text-indigo-600 bg-indigo-50"
      : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
  }`;

const MainNavbar = () => {
  const navigate = useNavigate();
  // Check for accessToken to determine login status
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* BRANDING: BEAOWNER WITH LOGO */}
        <div
          className="group flex shrink-0 cursor-pointer items-center gap-3"
          onClick={() => navigate("/")}
        >
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 shadow-sm sm:h-11 sm:w-11">
            <img
              /* IMPORTANT: Ensure this file is in your 'public' folder.
                 Rename it to 'logo.jpg' for simplicity or use the full name below.
              */
              src="/Gemini_Generated_Image_hizgnvhizgnvhizg.jpg"
              alt="BEAOWNER Logo"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x100?text=B";
              }}
            />
          </div>
          <h2 className="m-0 hidden text-xl font-extrabold uppercase tracking-tight text-slate-900 sm:block">
            BEA<span className="text-indigo-600">OWNER</span>
          </h2>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          {isLoggedIn && (
            <>
              {/* MATCHING ROUTE: Ensure your Route in App.js is <Route path="/my-bookings" ... />
              */}
              <NavLink to="/bookings" className={navLinkClass}>
                <span className="sm:hidden">Bookings</span>
                <span className="hidden sm:inline">My Bookings</span>
              </NavLink>
              <NavLink to="/want-to-earn" className={navLinkClass}>
                Earn
              </NavLink>
            </>
          )}

          {/* AUTH BUTTONS */}
          {!isLoggedIn ? (
            <div className="ml-1 flex items-center gap-2 border-l border-slate-200 pl-2 sm:ml-2 sm:gap-3 sm:pl-4">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 transition-colors hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98]"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="ml-1 border-l border-slate-200 pl-2 sm:ml-2 sm:pl-4">
              <button
                onClick={handleLogout}
                className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;