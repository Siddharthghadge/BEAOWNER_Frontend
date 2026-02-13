import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const services = [
    {
      id: "self-drive",
      title: "Self Drive",
      description: "Take total control of the journey. No limits, just you and the open road.",
      icon: "🚗",
      path: "/cars",
      border: "border-blue-500",
      accent: "text-blue-500",
    },
    {
      id: "with-driver",
      title: "Chauffeur",
      description: "Experience premium hospitality. Our chauffeurs are trained for your comfort.",
      icon: "🤵",
      path: "/car-with-driver",
      border: "border-indigo-600",
      accent: "text-indigo-600",
    },
    {
      id: "rent-bike",
      title: "Urban Bikes",
      description: "The city belongs to you. Fast scooters and superbikes for the urban explorer.",
      icon: "🏍️",
      path: "/bikes",
      border: "border-amber-500",
      accent: "text-amber-500",
    }
  ];

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans selection:bg-indigo-100 text-slate-900">
      
      {/* --- HERO SECTION --- */}
      <header className="relative h-[95vh] flex items-center px-6 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1500&auto=format&fit=crop" 
            alt="Hero background" 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.4]"
          />
        </div>

        <div className="relative z-10 max-w-5xl">
          <span className="inline-block px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8 rounded-sm">
            Established 2026
          </span>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-10 text-white">
            DRIVE <br /> 
            <span className="text-indigo-500 italic">DIFFERENT.</span>
          </h1>
          <p className="max-w-xl text-xl text-slate-300 font-light leading-relaxed mb-12 border-l-2 border-indigo-500 pl-6">
            We don't just rent vehicles. We provide the keys to your next core memory. 
            Choose from the city's most exclusive curated fleet.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-black px-12 py-6 font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-2xl"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </header>

      {/* --- SERVICES GRID --- */}
      <section className="py-32 px-6 lg:px-20 bg-[#F8FAFC]" id="services">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6 uppercase">
              Curated <br />Categories
            </h2>
          </div>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-4">
            Select your preferred mode of transit
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {services.map((service) => (
            <div 
              key={service.id} 
              onClick={() => navigate(service.path)}
              className="group relative bg-white border border-slate-200 p-12 rounded-3xl transition-all duration-500 hover:shadow-[30px_30px_0px_0px_rgba(79,70,229,0.1)] cursor-pointer"
            >
              <div className="text-7xl mb-12 grayscale group-hover:grayscale-0 transition-all duration-500">
                {service.icon}
              </div>
              <h3 className={`text-4xl font-black tracking-tighter mb-4 uppercase ${service.accent}`}>
                {service.title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-12 h-20">
                {service.description}
              </p>
              <div className="w-fit flex items-center gap-4 text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-900 pb-2 group-hover:gap-8 transition-all">
                Browse Fleet <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- STRIP STATS --- */}
      <div className="bg-slate-900 py-24 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-12">
          {[
            { label: "Fleet Size", val: "500+" },
            { label: "Active Renters", val: "12,000" },
            { label: "City Hubs", val: "50+" },
            { label: "Trust Score", val: "99%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-start">
              <span className="text-5xl font-black text-white tracking-tighter mb-1">{stat.val}</span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- WHY US (BENTO MIX) --- */}
      <section className="py-32 px-6 lg:px-20 bg-white">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-indigo-600 rounded-[3rem] p-16 text-white flex flex-col justify-between shadow-2xl">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-12 uppercase">
              The gold standard <br /> of rental services.
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="font-black text-lg mb-4 uppercase italic">01. Comprehensive Insurance</h4>
                <p className="text-indigo-100 text-sm leading-relaxed">Drive with total freedom knowing that every single ride is protected by our global insurance partners.</p>
              </div>
              <div>
                <h4 className="font-black text-lg mb-4 uppercase italic">02. Verified Owners</h4>
                <p className="text-indigo-100 text-sm leading-relaxed">We vet every listing and owner to ensure the vehicle you see is exactly the vehicle you get.</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 bg-slate-100 rounded-[3rem] p-12 flex flex-col justify-center items-center text-center">
            <div className="text-6xl mb-6">💳</div>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Secured <br />Payments</h4>
            <p className="text-slate-500 text-sm font-medium">PCI-compliant transactions with instant deposit refunds.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white py-20 px-6 lg:px-20 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-4xl font-black tracking-tighter uppercase italic">
            Car<span className="text-indigo-600 underline">Rental</span>
          </div>
          <div className="flex gap-12">
            {['Instagram', 'LinkedIn', 'Twitter'].map(link => (
              <span key={link} className="text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 cursor-pointer transition-colors border-b border-transparent hover:border-indigo-600 pb-1">
                {link}
              </span>
            ))}
          </div>
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 Studio CarRental. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}