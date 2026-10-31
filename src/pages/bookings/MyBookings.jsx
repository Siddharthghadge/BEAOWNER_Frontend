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
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">

      {/* PAGE HEADER */}
      <header className="relative overflow-hidden bg-slate-900">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-between gap-8 px-6 pb-32 pt-16 md:flex-row md:items-end lg:px-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">My bookings</h1>
            <p className="mt-2 max-w-xl text-base text-slate-400">
              Track your reservations, complete payments and view your booking history.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="min-w-[130px] rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
              <p className="text-sm text-slate-400">Total bookings</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-white">{bookings.length}</p>
            </div>
            <div className="min-w-[130px] rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-sm text-emerald-300/80">Active</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-300">{active.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-20 mx-auto -mt-20 max-w-6xl space-y-12 px-6 lg:px-8">

        {/* ACTIVE BOOKINGS */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-indigo-600"></span>
            <h2 className="text-xl font-semibold text-white">Active bookings</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-lg">
              <div className="mb-5 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
              <p className="text-sm font-medium text-slate-500">Loading your bookings…</p>
            </div>
          ) : active.length > 0 ? (
            <div className="space-y-5">
              {active.map(b => (
                <BookingCard key={b.id} b={b} onPay={() => handlePayment(b)} onCancel={() => cancelBooking(b.id)} onDetails={() => navigate(`/bookings/${b.id}`)} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 21h14a1 1 0 001-1V7a1 1 0 00-1-1H5a1 1 0 00-1 1v13a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No active bookings</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                When you reserve something, it will show up here.
              </p>
            </div>
          )}
        </section>

        {/* BOOKING HISTORY */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-slate-300"></span>
            <h2 className="text-xl font-semibold text-slate-900">Booking history</h2>
          </div>

          {history.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {history.map(b => (
                <BookingCard key={b.id} b={b} isHistory={true} onDetails={() => navigate(`/bookings/${b.id}`)} />
              ))}
            </div>
          ) : (
            !loading && (
              <p className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
                Completed and cancelled bookings will appear here.
              </p>
            )
          )}
        </section>
      </div>
    </div>
  );
};

/* ---------- UI-only helpers ---------- */
const toSentenceCase = (str = "") =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const BookingCard = ({ b, isHistory, onPay, onCancel, onDetails }) => {
  const statusColors = {
    CONFIRMED: "bg-emerald-500",
    PENDING: "bg-amber-400",
    CANCELLED: "bg-rose-500",
    COMPLETED: "bg-slate-900"
  };

  const statusBadge = {
    CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
    CANCELLED: "bg-rose-50 text-rose-700 ring-rose-600/20",
    COMPLETED: "bg-slate-100 text-slate-700 ring-slate-500/20",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-white transition duration-300
      ${isHistory
        ? "border-slate-200 p-5 shadow-sm hover:shadow-md"
        : "border-slate-200 p-6 shadow-lg shadow-slate-200/60 hover:-translate-y-0.5 hover:shadow-xl sm:p-8"
      }`}
    >
      {/* Side status bar */}
      <div className={`absolute bottom-0 left-0 top-0 w-1.5 ${statusColors[b.status] || "bg-slate-200"}`}></div>

      <div className="flex flex-col justify-between gap-6 lg:flex-row">
        <div className="flex items-start gap-5">
          {/* Booking type icon */}
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
              isHistory ? "bg-slate-100 text-slate-400" : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {b.bookingType === "WITH_DRIVER" ? (
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.1a7.5 7.5 0 0115 0" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l1.5-4.5A2 2 0 018.4 7h7.2a2 2 0 011.9 1.5L19 13m-14 0h14m-14 0v4a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-4M7.5 15.5h.01M16.5 15.5h.01" />
              </svg>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                  statusBadge[b.status] || "bg-slate-100 text-slate-700 ring-slate-500/20"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusColors[b.status]}`}></span>
                {toSentenceCase(b.status)}
              </span>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/10">
                {toSentenceCase(b.bookingType.replace("_", " "))}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Booking <span className="text-slate-400">#{b.id}</span>
            </h3>

            <div className="flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:gap-5">
              <p className="flex items-center gap-2">
                <span className="font-medium text-slate-700">From</span> {formatDate(b.startDate)}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium text-slate-700">To</span> {formatDate(b.endDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 border-t border-slate-100 pt-5 lg:items-end lg:border-t-0 lg:pt-0">
          <div className="lg:text-right">
            <p className="text-xs font-medium text-slate-500">Total amount</p>
            <p className={`font-bold tracking-tight text-slate-900 ${isHistory ? "text-2xl" : "text-3xl"}`}>
              ₹{b.totalAmount}
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-2 lg:w-auto">
            {!isHistory && b.status === "PENDING" && (
              <>
                <button
                  onClick={onPay}
                  className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98] lg:flex-none"
                >
                  Pay now
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 rounded-xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 lg:flex-none"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={onDetails}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 lg:flex-none"
            >
              View details
            </button>
          </div>
        </div>
      </div>

      {/* PICKUP OTP */}
      {!isHistory && b.status === "CONFIRMED" && b.pickupOtp && (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Pickup code ready</p>
              <p className="text-xs text-emerald-700/80">Share this code with the owner at pickup.</p>
            </div>
          </div>
          <div className="rounded-xl bg-slate-900 px-5 py-2.5 shadow-sm">
            <span className="text-xl font-bold tracking-[0.35em] text-white">{b.pickupOtp}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;