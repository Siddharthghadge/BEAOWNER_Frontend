import React from "react";
import { Link } from "react-router-dom";
import { API_URLS } from "../../config/apiUrls";

const CarCard = ({ car, viewMode }) => {
 const getImageUrl = (imageUrls) => {
    if (imageUrls && imageUrls.length > 0) {
      return imageUrls[0];   // ← Direct use
    }
    return "https://placehold.co/400x300?text=No+Image";
  };

  const getServiceTypeText = (type) => {
    if (type === "BOTH") return "Premium Hybrid";
    if (type === "WITH_DRIVER") return "Chauffeur Only";
    return "Self Drive";
  };

  const canShowDriverMode =
    (car.serviceType === "BOTH" || car.serviceType === "WITH_DRIVER") &&
    viewMode === "driver";

  return (
    /* CHANGE: Added 'bg-white', a more defined 'border-slate-200', 
       and a stronger 'shadow-xl' on hover to prevent merging with page background.
    */
    <div className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:bg-slate-50 transition-all duration-500 flex flex-col h-full">
      
      {/* IMAGE SECTION */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={getImageUrl(car.imageUrls)}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
          onError={(e) => (e.target.src = "/no-doc.png")}
        />
        
        {/* TOP BADGE */}
        <div className="absolute top-4 right-4">
          <div className={`backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/20 shadow-lg 
            ${car.serviceType === "BOTH" ? "bg-indigo-600/90 text-white" : "bg-white/90 text-slate-900"}`}>
            {getServiceTypeText(car.serviceType)}
          </div>
        </div>

        {/* LOCATION OVERLAY */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
            📍 {car.location}
          </span>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
            {car.brand}
          </p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {car.model}
          </h3>
        </div>

        {/* PRICING GRID - Added slightly darker border for contrast */}
        <div className="grid grid-cols-2 gap-4 border-y border-slate-200 py-6 mb-8">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rental</span>
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              ₹{car.pricePerHour}<small className="text-[10px] text-slate-400 font-bold uppercase ml-1">/hr</small>
            </span>
          </div>

          {canShowDriverMode && (
            <div className="flex flex-col border-l border-slate-200 pl-4">
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">Driver</span>
              <span className="text-xl font-black text-indigo-600 tracking-tighter">
                ₹{car.driverChargesPerDay}<small className="text-[10px] text-indigo-400 font-bold uppercase ml-1">/day</small>
              </span>
            </div>
          )}
        </div>

        {/* CTA BUTTON */}
        <Link
          to={`/cars/${car.carId}${canShowDriverMode ? "?mode=driver" : ""}`}
          className={`mt-auto w-full py-4 rounded-2xl text-center font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 shadow-md
            ${canShowDriverMode 
              ? "bg-indigo-600 text-white hover:bg-slate-900 hover:shadow-indigo-200" 
              : "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-slate-300"
            }`}
        >
          {canShowDriverMode ? "Reserve with Driver" : "Reserve Now"}
        </Link>
      </div>
    </div>
  );
};

export default CarCard;