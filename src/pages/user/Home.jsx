import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Home Component
 * The main landing page for users to discover rental categories.
 */
const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  // ✅ LOGIC UNCHANGED
  const goToCategory = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      if (path.includes("?category=")) {
        const [base, category] = path.split("?category=");
        const encodedPath = `${base}?category=${encodeURIComponent(category)}`;
        navigate(encodedPath);
      } else {
        navigate(path);
      }
    }
  };

  // Shown when someone hovers/clicks a service that is not live yet
  const showComingSoon = (title) => {
    toast.info(`${title} service is coming soon!`);
  };

  // ✅ ORDER: Properties → Furniture → Home Appliances → Electronics → the rest
  // ✅ Vehicles is marked comingSoon (no navigation, shows "Coming soon")
  const services = [
    {
      title: "Properties",
      subtitle: "Flats, Rooms & Offices",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      path: "/rentals?category=Properties",
    },
    {
      title: "Furniture",
      subtitle: "Home & Office Decor",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
      path: "/rentals?category=Furniture",
    },
    {
      title: "Home Appliances",
      subtitle: "Fridges, ACs & Washers",
      img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
      path: "/rentals?category=Home Appliances",
    },
    {
      title: "Electronics",
      subtitle: "Laptops, Cameras & More",
      img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
      path: "/rentals?category=Electronics",
    },
    {
      title: "Vehicles",
      subtitle: "Cars, Bikes & Scooters",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
      path: "/cars-home",
      comingSoon: true,
    },
    {
      title: "Medical Equipment",
      subtitle: "Health & Support Gear",
      img: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800",
      path: "/rentals?category=Medical Equipment",
    },
    {
      title: "Musical Instruments",
      subtitle: "Guitars, Pianos & Drums",
      img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
      path: "/rentals?category=Musical Instruments",
    },
    {
      title: "Kids Toys",
      subtitle: "Games & Play Area",
      img: "https://images.unsplash.com/photo-1532330393533-443990a51d10?w=800",
      path: "/rentals?category=Kids Toys",
    },
    {
      title: "Sports",
      subtitle: "Cricket, Football & More",
      img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800",
      path: "/rentals?category=Sports",
    },
    {
      title: "Gym Equipments",
      subtitle: "Treadmills & Weights",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      path: "/rentals?category=Gym Equipments",
    },
    {
      title: "Machines & Tools",
      subtitle: "Drills & Power Tools",
      img: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800",
      path: "/rentals?category=Machines & Tools",
    },
    {
      title: "Camera & Lenses",
      subtitle: "DSLRs & Professional Gear",
      img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
      path: "/rentals?category=Camera & Lenses",
    },
    {
      title: "Drones",
      subtitle: "Aerial View Cameras",
      img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000",
      path: "/rentals?category=Drones",
    },
    {
      title: "Clothes",
      subtitle: "Ethnic & Party Wear",
      img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800",
      path: "/rentals?category=Clothes",
    },
    {
      title: "Biking & Hiking Gear",
      subtitle: "Camping & Outdoor Kits",
      img: "https://images.unsplash.com/photo-1533632359083-0185df1be85d?w=800",
      path: "/rentals?category=Biking & Hiking Gear",
    },
  ];

  // Small local content arrays for the new sections — pure presentation, no logic.
  // (500+ Verified owners removed — we have not launched yet.)
  const stats = [
    { value: "15+", label: "Rental categories" },
    { value: "24/7", label: "Customer support" },
    { value: "Zero", label: "Ownership hassle" },
  ];

  const steps = [
    {
      number: "01",
      title: "Browse & compare",
      copy: "Search by category, check availability and pricing from verified owners near you.",
    },
    {
      number: "02",
      title: "Book instantly",
      copy: "Reserve the item for the dates you need — no paperwork, no showroom visits.",
    },
    {
      number: "03",
      title: "Use, return, repeat",
      copy: "Pick up or get it delivered, use it for as long as you booked, then hand it back.",
    },
  ];

  // Hero collage keeps the same four images as before, regardless of category order.
  const heroPreview = ["Vehicles", "Home Appliances", "Electronics", "Furniture"]
    .map((title) => services.find((s) => s.title === title))
    .filter(Boolean);

  // Footer links
  const menuLinks = [
    { label: "Partner with us", to: "/partner" },
    { label: "Submit requirement / RFP", to: "/rfp" },
    { label: "Contact us", to: "/contact" },
    { label: "About us", to: "/about" },
  ];

  const pageLinks = [
    { label: "Medical equipment", onClick: () => goToCategory("/rentals?category=Medical Equipment") },
    { label: "Home appliances", onClick: () => goToCategory("/rentals?category=Home Appliances") },
    { label: "Vehicles", onClick: () => showComingSoon("Vehicles") },
    { label: "Electronics", onClick: () => goToCategory("/rentals?category=Electronics") },
  ];

  const supportLinks = [
    { label: "Raise a complaint", to: "/complaint" },
    { label: "Terms of use", to: "/terms" },
    { label: "Privacy policy", to: "/privacy" },
    { label: "FAQ", to: "/faq" },
  ];

  return (
    <div className="bg-[#FAFAF8] text-[#1B2433] font-[Inter,sans-serif]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0E1B2E]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <span className="inline-block text-[#E2A63B] text-sm font-semibold tracking-wide">
              India's rental marketplace
            </span>
            <h1 className="mt-4 font-[Sora,sans-serif] text-4xl md:text-5xl font-bold text-white leading-[1.1]">
              Why buy it when you can rent it for a day, a week, or a year?
            </h1>
            <p className="mt-6 text-base md:text-lg text-slate-300 leading-relaxed max-w-lg">
              Vehicles, appliances, electronics, furniture and more — from
              owners who've already been verified, at prices that beat buying
              new.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <button
                onClick={() => goToCategory("/rentals?category=Electronics")}
                className="px-7 py-3.5 bg-[#E2A63B] text-[#0E1B2E] font-semibold rounded-md hover:bg-[#f0b856] transition-colors"
              >
                Browse rentals
              </button>
              <button
                onClick={() => goToCategory("/list-item")}
                className="px-7 py-3.5 border border-slate-500 text-white font-semibold rounded-md hover:border-[#E2A63B] hover:text-[#E2A63B] transition-colors"
              >
                List your item & earn
              </button>
            </div>
          </div>

          {/* Offset image collage */}
          <div className="relative hidden md:block h-[420px]">
            {heroPreview.map((item, i) => {
              const positions = [
                "top-0 left-8 w-52 h-64 z-20",
                "top-16 right-0 w-48 h-56 z-10",
                "bottom-0 left-0 w-44 h-52 z-10",
                "bottom-6 right-10 w-40 h-48 z-0",
              ];
              return (
                <div
                  key={item.title}
                  className={`absolute ${positions[i]} rounded-lg overflow-hidden border-4 border-[#0E1B2E] shadow-2xl`}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 grid grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="font-[Sora,sans-serif] text-2xl md:text-3xl font-bold text-[#0E1B2E]">
                {s.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="mb-12 max-w-xl">
          <h2 className="font-[Sora,sans-serif] text-3xl font-bold text-[#0E1B2E]">
            Popular categories
          </h2>
          <p className="text-slate-500 mt-3">
            Every category is stocked by owners we've verified — pick what
            you need and check availability in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((s, index) => (
            <div
              key={index}
              onClick={() =>
                s.comingSoon ? showComingSoon(s.title) : goToCategory(s.path)
              }
              className="group cursor-pointer bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-[#E2A63B] hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x600?text=Category+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2E]/70 via-transparent to-transparent" />

                {/* Coming soon overlay (appears on hover) */}
                {s.comingSoon && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0E1B2E]/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <span className="rounded-full bg-[#E2A63B] px-4 py-1.5 text-sm font-semibold text-[#0E1B2E]">
                      Coming soon
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 border-l-2 border-transparent group-hover:border-[#E2A63B] transition-colors">
                <h3 className="text-base font-semibold text-[#0E1B2E]">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{s.subtitle}</p>
                <div className="mt-3 text-[#0E1B2E] font-semibold text-sm group-hover:text-[#E2A63B] transition-colors">
                  {s.comingSoon ? "Coming soon" : "Explore now"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
          <h2 className="font-[Sora,sans-serif] text-3xl font-bold text-[#0E1B2E] max-w-md">
            Renting takes three steps
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-10">
            {steps.map((step) => (
              <div key={step.number}>
                <div className="font-[Sora,sans-serif] text-sm font-bold text-[#E2A63B]">
                  {step.number}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[#0E1B2E]">
                  {step.title}
                </h3>
                <p className="mt-2 text-slate-500 text-sm leading-relaxed">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OWNER CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="bg-[#0E1B2E] rounded-2xl px-8 md:px-14 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-[Sora,sans-serif] text-2xl md:text-3xl font-bold text-white max-w-md">
              Got something sitting idle? Put it to work.
            </h2>
            <p className="mt-3 text-slate-300 max-w-md">
              List your vehicle, equipment, or gear and start earning from
              renters in your area.
            </p>
          </div>
          <button
            onClick={() => goToCategory("/list-item")}
            className="shrink-0 px-8 py-3.5 bg-[#E2A63B] text-[#0E1B2E] font-semibold rounded-md hover:bg-[#f0b856] transition-colors"
          >
            Start listing
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0E1B2E] text-slate-300">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14 grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <p className="font-[Sora,sans-serif] text-xl font-bold text-white">
              RentAll Marketplace
            </p>
            <p className="mt-4 text-sm leading-relaxed max-w-xs">
              High-quality products from verified owners, without the
              commitment of buying.
            </p>
            <p className="mt-6 text-sm">
              Plot Number 000, Sector 00
              <br />
              Pune, Maharashtra 411001
              <br />
              +91-00000 00000
            </p>
          </div>

          <div>
            <p className="text-white font-semibold mb-4">Menu</p>
            <ul className="space-y-2 text-sm">
              {menuLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-[#E2A63B] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold mb-4">Pages</p>
            <ul className="space-y-2 text-sm">
              {pageLinks.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={l.onClick}
                    className="text-left hover:text-[#E2A63B] transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold mb-4">Support</p>
            <ul className="space-y-2 text-sm">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-[#E2A63B] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between text-xs text-slate-400 gap-2">
            <span>© {new Date().getFullYear()} RentAll Marketplace. All rights reserved.</span>
            <span>Built by Siddharth</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;