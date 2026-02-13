import React from "react";
import { Link } from "react-router-dom";

const BikeCard = ({ bike }) => {

  // ✅ Safe Image Resolver (Cloudinary + fallback)
  const getImageUrl = (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return "/no-image.png";

    const validUrl = imageUrls.find((url) => url.startsWith("http"));
    return validUrl || "/no-image.png";
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:bg-slate-50 transition-all duration-500 flex flex-col h-full">

      {/* IMAGE SECTION */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(bike.imageUrls)}
          alt={`${bike.brand} ${bike.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
          onError={(e) => (e.target.src = "/no-image.png")}
        />

        {/* BIKE TYPE BADGE */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 text-slate-900 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-lg">
            {bike.bikeType || "Performance"}
          </div>
        </div>

        {/* LOCATION OVERLAY */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
            📍 {bike.location}
          </span>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="p-8 flex flex-col flex-grow">

        {/* BRAND + MODEL */}
        <div className="mb-6">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
            {bike.brand}
          </p>

          <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {bike.model}
          </h3>

          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            Engine {bike.engineCc} CC
          </p>
        </div>

        {/* PRICING SECTION */}
        <div className="grid grid-cols-1 gap-4 border-y border-slate-200 py-6 mb-8">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Rental
            </span>

            <span className="text-xl font-black text-slate-900 tracking-tighter">
              ₹{bike.pricePerHour}
              <small className="text-[10px] text-slate-400 font-bold uppercase ml-1">
                /hr
              </small>
            </span>
          </div>
        </div>

        {/* AVAILABILITY STATUS */}
        <div className="flex items-center justify-between mb-8">
          <span
            className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${
              bike.available ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                bike.available
                  ? "bg-emerald-500"
                  : "bg-amber-500 animate-pulse"
              }`}
            />
            {bike.available ? "Ready for Rental" : "Booked"}
          </span>
        </div>

        {/* CTA BUTTON */}
        <Link
          to={`/bike-details/${bike.id}`}
          className="mt-auto w-full py-4 rounded-2xl text-center font-black text-xs uppercase tracking-[0.2em] bg-slate-900 text-white hover:bg-indigo-600 transition-all duration-300 active:scale-95 shadow-md"
        >
          Reserve Now
        </Link>
      </div>
    </div>
  );
};

export default BikeCard;
