import React from "react";
import { useNavigate } from "react-router-dom";

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

  const services = [
    {
      title: "Vehicles",
      subtitle: "Cars, Bikes & Scooters",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
      path: "/cars-home",
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
      title: "Furniture",
      subtitle: "Home & Office Decor",
      img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800",
      path: "/rentals?category=Furniture",
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
      title: "Properties",
      subtitle: "Flats, Rooms & Offices",
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      path: "/rentals?category=Properties",
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

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Rent Anything.{" "}
            <span className="text-blue-600">Earn Anytime.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            High-quality products from verified owners. From vehicles to property,
            get what you need without the commitment of buying.
          </p>

          <div className="mt-10 flex justify-center gap-8 text-sm font-semibold text-slate-500">
            <span>⚡ Instant Booking</span>
            <span>🛡️ Verified Owners</span>
            <span>💰 Best Prices</span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-8xl mx-auto px-7 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Popular Categories
          </h2>
          <p className="text-slate-500 mt-2">
            Browse our wide range of rental assets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {services.map((s, index) => (
            <div
              key={index}
              onClick={() => goToCategory(s.path)}
              className="group cursor-pointer bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={s.img}
                  alt={s.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x600?text=Category+Image";
                  }}
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <span className="text-white font-semibold border-2 border-white px-4 py-1 rounded-full">
                    View All
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-800">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {s.subtitle}
                </p>
                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  Explore Now →
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 text-center">
        <p className="font-bold text-slate-800">RentAll Marketplace</p>
        <p className="text-sm text-slate-500 mt-2">
          © {new Date().getFullYear()} • Built with ❤️ by Siddharth
        </p>
      </footer>
    </div>
  );
};

export default Home;
