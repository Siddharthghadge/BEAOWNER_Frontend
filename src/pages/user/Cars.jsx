import React, { useEffect, useState } from "react";
import { getAllCars } from "../../api/carService";
import CarCard from "../../components/cards/CarCard";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllCars()
      .then((res) => {
        setCars(res.data);
      })
      .catch((err) => console.error("Cars error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCars = cars.filter((car) =>
    car.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="h-12 w-12 border-[3px] border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Fleet</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] min-h-screen font-sans selection:bg-indigo-100 text-slate-900 pb-20">
      {/* --- PAGE HEADER --- */}
      <div className="bg-slate-900 pt-32 pb-20 px-6 lg:px-20 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
              Fleet Selection
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              Available <br /> <span className="italic text-slate-400">Vehicles</span>
            </h1>
          </div>

          {/* --- SEARCH BOX --- */}
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <span className="text-xl group-focus-within:scale-110 transition-transform">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Filter by location (e.g. Pune)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 py-5 pl-14 pr-6 rounded-2xl outline-none focus:bg-white focus:text-black focus:ring-4 focus:ring-indigo-600/20 transition-all font-bold text-sm"
            />
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-6 lg:px-20 -mt-10 relative z-10">
        {filteredCars.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center shadow-2xl">
            <div className="text-6xl mb-6">🏜️</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Match Found</h3>
            <p className="text-slate-400 font-medium mb-8">We couldn't find any assets in "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCars.map((car) => (
              <div 
                key={car.carId} 
                className="transform transition-all duration-500 hover:-translate-y-2"
              >
                {/* Assuming CarCard is updated to match the UI. 
                  If not, I can provide a matching CarCard component too. 
                */}
                <CarCard car={car} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- FOOTER DECOR --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-20 mt-32 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          End of Listing • {filteredCars.length} results
        </p>
      </div>
    </div>
  );
};

export default Cars;