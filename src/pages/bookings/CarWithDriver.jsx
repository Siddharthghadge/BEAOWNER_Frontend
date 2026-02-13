import React, { useEffect, useState } from "react";
import carApi from "../../api/carApi";
import { useNavigate } from "react-router-dom";
import { API_URLS } from "../../config/apiUrls";

const CarWithDriver = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    carApi.get("/api/cars/available-with-driver")
      .then(res => setCars(res.data))
      .catch(err => console.error("Error fetching cars:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCars = cars.filter(car =>
    car.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) {
    return "https://placehold.co/600x400?text=No+Vehicle+Image";
  }

  // find first valid image
  const validImage = imageUrls.find(
    img => img && String(img).trim() !== "" && !String(img).includes("undefined")
  );

  if (!validImage) {
    return "https://placehold.co/600x400?text=No+Vehicle+Image";
  }

  const cleanFile = String(validImage).trim();

  // ✅ Cloudinary or external URL → use directly
  if (cleanFile.startsWith("http")) {
    return cleanFile;
  }

  // ✅ fallback for old local uploads (optional)
  return `${API_URLS.CAR_UPLOADS}/${encodeURIComponent(cleanFile)}`;
};


  return (
    <div className="bg-white min-h-screen font-sans">
      {/* HERO SECTION - MATCHING REFERENCE */}
      <div className="bg-[#0F172A] pt-32 pb-48 px-6 lg:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="z-10 text-center md:text-left">
            <p className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Fleet Selection</p>
            <h1 className="text-white text-6xl md:text-7xl font-black leading-none mb-2">
              AVAILABLE <br />
              <span className="italic text-slate-400 opacity-80">VEHICLES</span>
            </h1>
          </div>

          {/* PILL SEARCH BAR */}
          <div className="w-full md:w-[450px] relative z-10">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Filter by location (e.g. Pune)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 p-5 pl-14 rounded-2xl text-white placeholder-slate-500 font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      </div>

      {/* GRID SECTION */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 pb-20">
        {loading ? (
          <div className="bg-white rounded-[2.5rem] p-40 text-center shadow-xl border border-slate-100">
            <div className="h-12 w-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Chauffeur Fleet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map(car => (
              <div 
                key={car.carId || car.id} 
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col group transition-all duration-300 hover:-translate-y-2"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative h-60 overflow-hidden bg-slate-100 m-3 rounded-[2rem]">
                  <img 
                    src={getImageUrl(car.imageUrls)} 
                    alt={car.model} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* SERVICE TAG */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#0F172A] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                      {car.bookingType === "WITH_DRIVER" ? "Chauffeur" : "Self Drive"}
                    </span>
                  </div>
                </div>

                {/* CONTENT AREA */}
                <div className="p-8 pt-4 flex flex-col flex-grow">
                  <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
                      {car.brand}
                    </p>
                    <h3 className="text-3xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                      {car.model}
                    </h3>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rental</span>
                      <span className="text-2xl font-black text-[#0F172A]">
                        ₹{car.pricePerHour} <span className="text-[10px] opacity-40">/ HR</span>
                      </span>
                    </div>

                    {/* DRIVER HIGHLIGHT */}
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Driver Included</span>
                      <span className="text-xs font-bold text-indigo-600">₹{car.driverChargesPerDay}/day</span>
                    </div>
                  </div>

                  <button 
                    className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    onClick={() => navigate(`/car/${car.carId || car.id}/book-with-driver`)}
                  >
                    RESERVE NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredCars.length === 0 && (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">
              No vehicles available in this criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarWithDriver;