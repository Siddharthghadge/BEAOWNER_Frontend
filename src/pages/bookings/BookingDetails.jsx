import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../../api/bookingService";
import { getCarById } from "../../api/carService";
import { API_URLS } from "../../config/apiUrls";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const bookingRes = await bookingService.getBookingById(id);
      setBooking(bookingRes.data);

      const carRes = await getCarById(bookingRes.data.carId);
      setCar(carRes.data);
    } catch (err) {
      console.error("Error loading booking details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="h-10 w-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Retrieving Records</p>
      </div>
    );
  }

  if (!booking) return <div className="p-20 text-center font-black uppercase tracking-widest">Booking not found.</div>;

  const isDriver = booking.serviceType === "WITH_DRIVER" || booking.bookingType === "WITH_DRIVER";

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* BACK NAVIGATION */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors mb-10"
        >
          <span className="text-lg transition-transform group-hover:-translate-x-1">←</span> Back to Dashboard
        </button>

        <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
          
          {/* HEADER SECTION */}
          <div className="bg-slate-900 p-10 md:p-14 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Reservation Confirmed</span>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border 
                  ${booking.status === 'CONFIRMED' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-amber-500/10 border-amber-500 text-amber-500'}`}>
                  {booking.status}
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                Ref. <span className="text-slate-400">#{booking.id}</span>
              </h2>
            </div>
            
            <div className="text-left md:text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Grand Total</p>
              <span className="text-5xl font-black tracking-tighter text-indigo-400">₹{booking.totalAmount}</span>
            </div>
          </div>

          <div className="p-10 md:p-14 grid md:grid-cols-2 gap-16">
            
            {/* CAR SPECIFICATION */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 border-b border-slate-100 pb-4">Vehicle Specs</h3>
              {car ? (
                <div className="group">
                  <div className="relative h-48 w-full rounded-3xl overflow-hidden mb-6 bg-slate-50 border border-slate-100">
                    <img
                      src={`${API_URLS.CAR_UPLOADS}/cars/${car.imageUrls?.[0]}`}
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 border border-white/20">
                      {isDriver ? "🤵 Chauffeur Service" : "🔑 Private Rental"}
                    </div>
                  </div>
                  <h4 className="text-3xl font-black tracking-tighter text-slate-900 uppercase mb-2">{car.brand} {car.model}</h4>
                  <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{car.transmission}</span>
                    <span>•</span>
                    <span>{car.fuelType}</span>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-3xl bg-slate-100 h-48 w-full"></div>
                </div>
              )}
            </div>

            {/* TRIP TIMELINE */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 border-b border-slate-100 pb-4">Trip Schedule</h3>
              <div className="space-y-12 relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-100"></div>
                
                <div className="relative flex items-start gap-8">
                  <div className="h-6 w-6 rounded-full border-4 border-white bg-indigo-600 shadow-[0_0_0_2px_#4f46e5] z-10"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Departure / Pickup</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">
                      {new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(booking.startDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-8">
                  <div className="h-6 w-6 rounded-full border-4 border-white bg-slate-300 shadow-[0_0_0_2px_#cbd5e1] z-10"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Arrival / Return</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">
                      {new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(booking.endDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="bg-slate-50 p-10 border-t border-slate-100 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] max-w-sm mx-auto mb-8 leading-relaxed">
              Please ensure you carry a valid driving license and ID for verification during hand-over.
            </p>
            
            {booking.status === "PENDING" && (
              <button 
                onClick={() => navigate('/bookings')}
                className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-200 active:scale-95"
              >
                Complete Digital Payment
              </button>
            )}
          </div>
        </div>

        {/* HELP TEXT */}
        <p className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
          Need Assistance? Contact 24/7 Support at +91-800-RENT-ALL
        </p>
      </div>
    </div>
  );
}