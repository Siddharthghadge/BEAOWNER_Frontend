import React from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "@/components/common/MainNavbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <MainNavbar />

      {/* Page Content */}
      <main className="max-w-10xl mx-auto px-14 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
