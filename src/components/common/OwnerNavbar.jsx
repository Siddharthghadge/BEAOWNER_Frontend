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

  /* ---------- UI-only helper: link styling ---------- */
  const linkClass = (path) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-600"
        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* BRANDING: BEAOWNER WITH LOGO */}
        <div
          className="group flex shrink-0 cursor-pointer items-center gap-3"
          onClick={() => navigate("/owner/home")}
        >
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-200 shadow-sm sm:h-11 sm:w-11">
            <img
              src="/Gemini_Generated_Image_hizgnvhizgnvhizg.jpg"
              alt="BEAOWNER Logo"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/100x100?text=B";
              }}
            />
          </div>
          <div className="hidden flex-col sm:flex">
            <h2 className="m-0 text-xl font-extrabold uppercase leading-none tracking-tight text-slate-900">
              BEA<span className="text-indigo-600">OWNER</span>
            </h2>
            <span className="mt-1 text-xs leading-none text-slate-500">
              Owner control panel
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/owner/home" className={linkClass("/owner/home")}>
            Dashboard
          </Link>

          <Link to="/owner/my-rentals" className={linkClass("/owner/my-rentals")}>
            <span className="sm:hidden">Inventory</span>
            <span className="hidden sm:inline">My Inventory</span>
          </Link>

          <Link to="/owner/my-bookings" className={linkClass("/owner/my-bookings")}>
            <span className="sm:hidden">Bookings</span>
            <span className="hidden sm:inline">Manage Bookings</span>
          </Link>

          {/* USER & AUTH SECTION */}
          <div className="ml-1 flex items-center gap-3 border-l border-slate-200 pl-2 sm:ml-2 sm:gap-4 sm:pl-4">
            <div className="hidden items-center gap-3 lg:flex">
              {user?.email && (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold uppercase text-indigo-700">
                  {user.email.charAt(0)}
                </div>
              )}
              <div className="flex max-w-[200px] flex-col">
                <span className="text-xs text-slate-500">Connected as</span>
                <span className="truncate text-sm font-semibold text-slate-900" title={user?.email}>
                  {user?.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-600 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default OwnerNavbar;