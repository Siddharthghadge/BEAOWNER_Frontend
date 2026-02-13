import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../api/bookingService";
import paymentService from "../../api/paymentService";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = () => {
    setLoading(true);
    bookingService.getMyBookings()
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.id - a.id);
        setBookings(sorted);
      })
      .catch((err) => console.error("Fetch error", err))
      .finally(() => setLoading(false));
  };

  const handlePayment = async (booking) => {
    try {
      const res = await paymentService.initiatePayment(booking.id, booking.totalAmount);
      //const { razorpayOrderId, amount, currency } = res.data;
      const { razorpayOrderId, amountInPaise, currency, keyId } = res.data;

      const options = {
  key: keyId,
  amount: amountInPaise,
  currency: currency,
  name: "Fleet Auth",
  description: `Authorization for Unit #${booking.id}`,
  order_id: razorpayOrderId,
  handler: async function (response) {
    try {
      await paymentService.verifyPayment({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        bookingId: booking.id
      });
      fetchBookings();
    } catch (err) {
      alert("Payment Verification Failed.");
    }
  },
  prefill: { name: "Operator" },
  theme: { color: "#6366f1" },
};


      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("System could not initiate transaction.");
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("TERMINATE RESERVATION? This action is logged.")) return;
    try {
      await bookingService.cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert("Termination Error.");
    }
  };

  const active = bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED");
  const history = bookings.filter(b => b.status === "CANCELLED" || b.status === "COMPLETED");

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-32">
      {/* HEADER: INDUSTRIAL DARK */}
      <div className="bg-[#0F172A] pt-32 pb-48 px-8 lg:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-indigo-500"></span>
              <p className="text-indigo-400 font-black uppercase tracking-[0.4em] text-[10px]">Registry Logs</p>
            </div>
            <h1 className="text-white text-6xl md:text-8xl font-black leading-[0.8] uppercase tracking-tighter italic">
              FLEET<br /><span className="text-slate-500">HISTORY</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-white font-black text-4xl italic tracking-tighter">{bookings.length}</p>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Total Logs Found</p>
          </div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-32 relative z-20 space-y-20">
        
        {/* ACTIVE TRANSMISSIONS */}
        <section>
          <div className="flex items-center gap-6 mb-10">
            <div className="bg-indigo-600 h-8 w-2 rounded-full shadow-lg shadow-indigo-500/50"></div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-900">Active Transmissions</h3>
          </div>

          {loading ? (
            <div className="bg-white p-24 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center">
              <div className="w-12 h-12 border-t-4 border-indigo-600 border-r-4 border-r-transparent rounded-full animate-spin"></div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Scanning Database...</p>
            </div>
          ) : active.length > 0 ? (
            <div className="space-y-6">
              {active.map(b => (
                <BookingCard key={b.id} b={b} onPay={() => handlePayment(b)} onCancel={() => cancelBooking(b.id)} onDetails={() => navigate(`/bookings/${b.id}`)} />
              ))}
            </div>
          ) : (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 p-20 rounded-[3rem] text-center">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">No Active Operations Found</p>
            </div>
          )}
        </section>

        {/* ARCHIVE */}
        <section>
          <div className="flex items-center gap-6 mb-10">
            <div className="bg-slate-300 h-8 w-2 rounded-full"></div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-400">Archived Records</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map(b => (
              <BookingCard key={b.id} b={b} isHistory={true} onDetails={() => navigate(`/bookings/${b.id}`)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const BookingCard = ({ b, isHistory, onPay, onCancel, onDetails }) => {
  const statusColors = {
    CONFIRMED: "bg-emerald-500",
    PENDING: "bg-amber-400",
    CANCELLED: "bg-rose-500",
    COMPLETED: "bg-slate-900"
  };

  return (
    <div className={`relative overflow-hidden transition-all duration-500 
      ${isHistory 
        ? 'bg-white/40 border border-slate-200 rounded-[2rem] p-6 hover:bg-white' 
        : 'bg-white border border-slate-100 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/60 hover:-translate-y-2'
      }`}>
      
      {/* Side Status Bar */}
      <div className={`absolute top-0 left-0 bottom-0 w-2 ${statusColors[b.status] || 'bg-slate-200'}`}></div>

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="flex gap-8 items-start">
          {/* Asset Type */}
          <div className={`h-20 w-20 flex-shrink-0 rounded-3xl flex items-center justify-center text-3xl shadow-inner
            ${isHistory ? 'bg-slate-100 grayscale' : 'bg-slate-50 border border-slate-100 animate-pulse-slow'}`}>
            {b.bookingType === "WITH_DRIVER" ? "🤵" : "🚗"}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${statusColors[b.status]}`}></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{b.status}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                {b.bookingType.replace("_", " ")}
              </span>
            </div>
            
            <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">
              LOG <span className="text-slate-300">#{b.id}</span>
            </h4>

            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="text-indigo-500 font-black italic">FROM:</span> {new Date(b.startDate).toDateString()}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="text-rose-500 font-black italic">TO:</span> {new Date(b.endDate).toDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between items-end gap-6 border-t lg:border-t-0 pt-6 lg:pt-0 border-slate-100">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Authorized</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">₹{b.totalAmount}</p>
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            {!isHistory && b.status === "PENDING" && (
              <>
                <button onClick={onPay} className="flex-1 lg:flex-none bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">Initialize Payment</button>
                <button onClick={onCancel} className="flex-1 lg:flex-none bg-white text-rose-500 border border-rose-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">Abort</button>
              </>
            )}
            <button onClick={onDetails} className="flex-1 lg:flex-none bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200">
              {isHistory ? "View Record" : "Mission Brief"}
            </button>
          </div>
        </div>
      </div>

      {/* SECURE OTP FLOATING BOX */}
      {!isHistory && b.status === "CONFIRMED" && b.pickupOtp && (
        <div className="mt-10 border-t border-slate-50 pt-6 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Security Token Ready</p>
           </div>
           <div className="bg-slate-900 px-6 py-3 rounded-2xl shadow-xl shadow-indigo-200/20">
              <span className="text-white font-black text-2xl tracking-[0.4em] ml-2">{b.pickupOtp}</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;