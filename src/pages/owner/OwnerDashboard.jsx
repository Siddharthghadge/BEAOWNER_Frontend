import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import paymentService from "../../api/paymentService"; // Verify this path
import OwnerNavbar from "@/components/common/OwnerNavbar";

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.id) return;
      try {
        const res = await paymentService.getWalletSummary(user.id);
        setBalance(res.data.currentBalance);
      } catch (err) {
        console.error("Error fetching vehicle wallet:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, [user?.id]);

  return (
    <div className="bg-[#FAFAF8] min-h-screen font-[Inter,sans-serif]">
      <OwnerNavbar />

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb / Back Link */}
        <button
          onClick={() => navigate("/owner/home")}
          className="text-[#0E1B2E] font-semibold text-sm hover:text-[#E2A63B] transition-colors mb-6"
        >
          ← Back to main hub
        </button>

        <header className="mb-8 text-left">
          <h2 className="font-[Sora,sans-serif] text-3xl font-bold text-[#0E1B2E]">
            Vehicle fleet management
          </h2>
          <p className="text-slate-500 mt-2">
            Control your cars, bikes, and check your transport earnings.
          </p>
        </header>

        {/* --- VEHICLE EARNINGS BANNER --- */}
        <div className="bg-[#0E1B2E] rounded-xl px-8 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <span className="text-slate-400 text-sm">
              Vehicle business earnings
            </span>
            <h3 className="font-[Sora,sans-serif] text-3xl font-bold text-white mt-1">
              {loading ? "..." : `₹${balance.toLocaleString()}`}
            </h3>
          </div>
          <Link
            to="/owner/wallet"
            className="bg-[#E2A63B] text-[#0E1B2E] px-5 py-3 rounded-md font-semibold text-sm hover:bg-[#f0b856] transition-colors shrink-0"
          >
            View wallet details
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* --- BIKES SECTION --- */}
          <div className="p-7 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-11 h-11 bg-[#0E1B2E]/5 rounded-lg flex items-center justify-center text-2xl">
                🏍️
              </span>
              <h3 className="text-lg font-semibold text-[#0E1B2E]">
                Bike fleet
              </h3>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Manage scooters, sports bikes, and daily commuters.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/owner/add-bike"
                className="block text-center py-3.5 bg-[#0E1B2E] text-white rounded-md font-semibold text-sm hover:bg-[#16283f] transition-colors"
              >
                + Add new bike
              </Link>
              <Link
                to="/owner/my-bikes"
                className="block text-center py-3.5 bg-white text-[#0E1B2E] rounded-md font-semibold text-sm border border-slate-200 hover:border-[#E2A63B] transition-colors"
              >
                View my bikes
              </Link>
            </div>
          </div>

          {/* --- CARS SECTION --- */}
          <div className="p-7 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-11 h-11 bg-[#0E1B2E]/5 rounded-lg flex items-center justify-center text-2xl">
                🚗
              </span>
              <h3 className="text-lg font-semibold text-[#0E1B2E]">
                Car fleet
              </h3>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Manage hatchbacks, SUVs, and luxury rentals.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/owner/add-car"
                className="block text-center py-3.5 bg-[#0E1B2E] text-white rounded-md font-semibold text-sm hover:bg-[#16283f] transition-colors"
              >
                + Add new car
              </Link>
              <Link
                to="/owner/my-cars"
                className="block text-center py-3.5 bg-white text-[#0E1B2E] rounded-md font-semibold text-sm border border-slate-200 hover:border-[#E2A63B] transition-colors"
              >
                View my cars
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}