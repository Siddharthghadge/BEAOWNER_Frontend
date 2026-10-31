import React from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerNavbar from '@/components/common/OwnerNavbar';

const OwnerHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ DATA UNCHANGED — every field, path, and color value preserved as-is
  const businessSections = [
    {
      title: "Vehicles",
      desc: "Manage your Cars and Bikes. View earnings and verify OTPs.",
      icon: "🏎️",
      path: "/owner/vehicle-management",
      color: "border-blue-500 text-blue-500 bg-blue-50",
      accent: "blue",
      count: "Fleet"
    },
    {
      title: "Home Appliances",
      desc: "Washing Machines, Fridges, and AC units for household use.",
      icon: "📺",
      path: "/owner/add?category=Home%20Appliances",
      color: "border-pink-500 text-pink-500 bg-pink-50",
      accent: "pink",
      count: "Utility"
    },
    {
      title: "Electronics",
      desc: "Laptops, Gadgets, and Home Theater systems.",
      icon: "💻",
      path: "/owner/add?category=Electronics",
      color: "border-emerald-500 text-emerald-500 bg-emerald-50",
      accent: "emerald",
      count: "Tech"
    },
    {
      title: "Furniture",
      desc: "Rent out Sofas, Beds, and Tables to locals.",
      icon: "🛋️",
      path: "/owner/add?category=Furniture",
      color: "border-purple-500 text-purple-500 bg-purple-50",
      accent: "purple",
      count: "Living"
    },
    {
      title: "Medical Equipment",
      desc: "Health monitors, wheelchairs, and recovery gear.",
      icon: "🏥",
      path: "/owner/add?category=Medical%20Equipment",
      color: "border-green-500 text-green-500 bg-green-50",
      accent: "green",
      count: "Health"
    },
    {
      title: "Musical Instruments",
      desc: "Guitars, Keyboards, and Studio gear for musicians.",
      icon: "🎸",
      path: "/owner/add?category=Musical%20Instruments",
      color: "border-amber-500 text-amber-500 bg-amber-50",
      accent: "amber",
      count: "Studio"
    },
    {
      title: "Kids Toys",
      desc: "Educational toys, play zones, and outdoor sets.",
      icon: "🧸",
      path: "/owner/add?category=Kids%20Toys",
      color: "border-rose-500 text-rose-500 bg-rose-50",
      accent: "rose",
      count: "Play"
    },
    {
      title: "Sports",
      desc: "Cricket kits, football gear, and sports equipment.",
      icon: "⚽",
      path: "/owner/add?category=Sports",
      color: "border-indigo-500 text-indigo-500 bg-indigo-50",
      accent: "indigo",
      count: "Pro"
    },
    {
      title: "Properties",
      desc: "Manage your real estate listings and tenant contacts.",
      icon: "🏢",
      path: "/owner/add?category=Properties",
      color: "border-orange-500 text-orange-500 bg-orange-50",
      accent: "orange",
      count: "Estate"
    },
    {
      title: "Gym Equipments",
      desc: "Treadmills, Dumbbells, and Home-Gym setups.",
      icon: "🏋️",
      path: "/owner/add?category=Gym%20Equipments",
      color: "border-violet-500 text-violet-500 bg-violet-50",
      accent: "violet",
      count: "Fitness"
    },
    {
      title: "Machines & Tools",
      desc: "Drills, Generators, and Industrial power tools.",
      icon: "🔧",
      path: "/owner/add?category=Machines%20%26%20Tools",
      color: "border-slate-500 text-slate-500 bg-slate-50",
      accent: "slate",
      count: "Industrial"
    },
    {
      title: "Camera & Lenses",
      desc: "Professional DSLRs, Lenses, and Lighting kits.",
      icon: "📸",
      path: "/owner/add?category=Camera%20%26%20Lenses",
      color: "border-cyan-500 text-cyan-500 bg-cyan-50",
      accent: "cyan",
      count: "Media"
    },
    {
      title: "Drones",
      desc: "Aerial photography drones and cinematography kits.",
      icon: "🚁",
      path: "/owner/add?category=Drones",
      color: "border-fuchsia-500 text-fuchsia-500 bg-fuchsia-50",
      accent: "fuchsia",
      count: "Sky"
    },
    {
      title: "Clothes",
      desc: "Designer suits, wedding wear, and ethnic dresses.",
      icon: "👔",
      path: "/owner/add?category=Clothes",
      color: "border-red-500 text-red-500 bg-red-50",
      accent: "red",
      count: "Fashion"
    },
    {
      title: "Biking & Hiking Gear",
      desc: "Tents, Camping bags, and Biking safety gear.",
      icon: "🚵",
      path: "/owner/add?category=Biking%20%26%20Hiking%20Gear",
      color: "border-green-700 text-green-700 bg-green-50",
      accent: "green",
      count: "Adventure"
    }
  ];

  return (
    <div className="bg-[#FAFAF8] min-h-screen font-[Inter,sans-serif] pb-20">
      <OwnerNavbar />

      {/* HERO */}
      <div className="bg-[#0E1B2E] pt-24 pb-28 px-6 lg:px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <span className="text-[#E2A63B] text-sm font-semibold tracking-wide">
              Owner dashboard
            </span>
            <h1 className="mt-3 font-[Sora,sans-serif] text-4xl md:text-5xl font-bold text-white leading-tight">
              Manage your listings
            </h1>
            <p className="text-slate-400 text-sm mt-4 max-w-md">
              Signed in as{" "}
              <span className="text-white font-medium">
                {user?.email || "Partner"}
              </span>
              . Pick a category below to add stock, track bookings, or check
              earnings.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg px-5 py-3.5 flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Account status
              </p>
              <p className="text-white font-semibold text-sm">
                Verified partner
              </p>
            </div>
          </div>
        </div>

        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-[#E2A63B]/10 rounded-full blur-[120px] -mr-40 -mt-40" />
      </div>

      {/* DASHBOARD GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessSections.map((section) => (
            <div
              key={section.title}
              className="group bg-white p-7 rounded-xl border border-slate-200 hover:border-[#E2A63B] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col relative"
              onClick={() => navigate(section.path)}
            >
              {/* Category tag */}
              <span className="absolute top-6 right-6 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide text-slate-500 bg-slate-100">
                {section.count}
              </span>

              {/* Icon */}
              <div className="h-14 w-14 bg-[#0E1B2E]/5 rounded-lg flex items-center justify-center text-3xl mb-6">
                {section.icon}
              </div>

              <h3 className="text-lg font-semibold text-[#0E1B2E] mb-2">
                {section.title}
              </h3>

              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                {section.desc}
              </p>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0E1B2E] group-hover:text-[#E2A63B] group-hover:translate-x-1 transition-all">
                  Manage listings →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;