import React from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerNavbar from '@/components/common/OwnerNavbar'; 

const OwnerHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  
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
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />
      
      {/* HERO SECTION */}
      <div className="bg-[#0F172A] pt-28 pb-36 px-6 lg:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto z-10 relative flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Enterprise Hub</p>
            <h1 className="text-white text-5xl md:text-6xl font-black leading-none uppercase">
              OWNER <span className="italic text-slate-400">CONTROL</span>
            </h1>
            <p className="text-slate-400 text-sm mt-4 font-medium max-w-md">
              Managing portfolio for <span className="text-white font-bold">{user?.email || "Partner"}</span>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
            <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                <p className="text-white font-bold text-sm">Verified Partner</p>
            </div>
          </div>
        </div>
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-40 -mt-40" />
      </div>

      {/* DASHBOARD GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessSections.map((section) => (
            <div
              key={section.title}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
              onClick={() => navigate(section.path)}
            >
              {/* Category Badge */}
              <div className={`absolute top-6 right-8 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${section.color}`}>
                {section.count}
              </div>

              {/* Icon Container */}
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-slate-50 group-hover:scale-110 transition-transform">
                {section.icon}
              </div>

              <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tighter mb-2 leading-none">
                {section.title}
              </h3>
              
              <p className="text-slate-400 text-[13px] leading-relaxed mb-8 flex-1 font-medium">
                {section.desc}
              </p>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform ${section.color.split(' ')[1]}`}>
                  Manage Dept →
                </span>
                <div className={`w-1.5 h-1.5 rounded-full ${section.color.split(' ')[0].replace('border', 'bg')}`} />
              </div>
              
              {/* Subtle hover background accent */}
              <div className={`absolute bottom-0 right-0 w-24 h-24 -mr-12 -mb-12 rounded-full opacity-0 group-hover:opacity-10 transition-opacity ${section.color.split(' ')[0].replace('border', 'bg')}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerHome;