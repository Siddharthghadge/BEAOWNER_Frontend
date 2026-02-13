import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OwnerNavbar from '@/components/common/OwnerNavbar';

const OwnerVehicleHome = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20 relative overflow-hidden">
      {/* Background Blobs (keeping the artistic touch) */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <OwnerNavbar />

      {/* HERO HEADER */}
      <div className="bg-[#0F172A] pt-24 pb-32 px-6 lg:px-20 relative">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={() => navigate("/owner/home")} 
                className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2"
              >
                ← Back to Hub
              </button>
            </div>
            <h1 className="text-white text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              VEHICLE <span className="text-indigo-500 italic">COMMAND</span>
            </h1>
            <p className="text-slate-400 mt-4 font-bold text-xl uppercase tracking-wider flex items-center gap-3">
              <span className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></span>
              FLEET OPERATOR: <span className="text-white underline decoration-indigo-500 underline-offset-4">{user?.email}</span>
            </p>
          </div>

          <Link 
            to="/owner/dashboard" 
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-indigo-500 shadow-xl shadow-indigo-500/40 transition-all active:scale-95 border-b-4 border-indigo-800"
          >
            📊 Fleet Analytics
          </Link>
        </div>
      </div>

      {/* MAIN MANAGEMENT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Motorcycle Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🏍️</div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-3">Motorcycles</h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wide leading-relaxed mb-8">
              Control your two-wheeler fleet, set dynamic pricing, and track availability.
            </p>
            <div className="flex gap-4">
              <Link to="/owner/add-bike" className="flex-1 bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-indigo-600 transition-colors">Add Bike</Link>
              <Link to="/owner/my-bikes" className="flex-1 bg-slate-50 text-slate-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-slate-200 transition-colors">Inventory</Link>
            </div>
          </div>

          {/* Car Fleet Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-600" />
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🚗</div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-3">Car Fleet</h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wide leading-relaxed mb-8">
              Manage SUVs and luxury rentals. Assign drivers and verify vehicle documents.
            </p>
            <div className="flex gap-4">
              <Link to="/owner/add-car" className="flex-1 bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-purple-600 transition-colors">Add Car</Link>
              <Link to="/owner/my-cars" className="flex-1 bg-slate-50 text-slate-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-slate-200 transition-colors">Fleet List</Link>
            </div>
          </div>

          {/* Handover Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner">🔑</div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-3">Handover</h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wide leading-relaxed mb-8">
              Secure trip validation. Enter customer OTPs to authorize vehicle release.
            </p>
            <div className="flex gap-4">
              <Link to="/owner/my-bookings" className="flex-1 bg-emerald-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-slate-900 transition-colors shadow-lg shadow-emerald-200">Verify OTP</Link>
              <Link to="/owner/booking-history" className="flex-1 bg-slate-50 text-slate-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-slate-200 transition-colors">History</Link>
            </div>
          </div>

        </div>

        {/* INSIGHTS FOOTER BANNER */}
        <section className="mt-12 bg-white rounded-[3rem] p-10 border-2 border-slate-100 shadow-lg flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Fleet Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-l-4 border-indigo-600 pl-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                <Link to="/owner/wallet" className="text-xl font-black text-slate-900 hover:text-indigo-600 transition-colors">VIEW WALLET EARNINGS →</Link>
              </div>
              <div className="border-l-4 border-slate-200 pl-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resources</p>
                <p className="text-sm font-bold text-slate-600 uppercase">Need help with a listing? <span className="text-indigo-600 cursor-pointer">Contact Support</span></p>
              </div>
            </div>
          </div>
          <div className="text-7xl opacity-10 font-black select-none hidden lg:block">INSIGHTS</div>
        </section>
      </div>
    </div>
  );
};

export default OwnerVehicleHome;