import React from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "@/components/common/MainNavbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Navbar */}
      <MainNavbar />

      {/* Page Content
          No horizontal padding or max-width here: each page controls its own
          container, so full-width banners can stretch edge to edge. */}
      <main className="w-full flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <p className="text-slate-400">Secure payments • Verified owners • Transparent pricing</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;