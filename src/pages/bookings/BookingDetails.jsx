import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../../api/bookingService";
import { getCarById } from "../../api/carService";
import { API_URLS } from "../../config/apiUrls";

/* ---------- UI-only helpers ---------- */
const toSentenceCase = (str = "") =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const STATUS_BADGE = {
  CONFIRMED: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30",
  PENDING: "bg-amber-500/10 text-amber-300 ring-amber-400/30",
  CANCELLED: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
  COMPLETED: "bg-slate-500/20 text-slate-200 ring-slate-300/30",
};
const STATUS_DOT = {
  CONFIRMED: "bg-emerald-400",
  PENDING: "bg-amber-400",
  CANCELLED: "bg-rose-400",
  COMPLETED: "bg-slate-300",
};

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="mb-4 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Loading booking details…</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Booking not found</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          We couldn’t find this booking. It may have been removed or the link is incorrect.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          Go back
        </button>
      </div>
    );
  }

  const isDriver = booking.serviceType === "WITH_DRIVER" || booking.bookingType === "WITH_DRIVER";

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 font-sans text-slate-900 sm:py-14">
      <div className="mx-auto max-w-4xl">

        {/* BACK NAVIGATION */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
        >
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
          </svg>
          Back to dashboard
        </button>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">

          {/* HEADER SECTION */}
          <div className="relative overflow-hidden bg-slate-900 p-8 text-white md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl"></div>
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-indigo-300">Booking details</span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                      STATUS_BADGE[booking.status] || "bg-amber-500/10 text-amber-300 ring-amber-400/30"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[booking.status] || "bg-amber-400"}`}></span>
                    {toSentenceCase(booking.status)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Booking <span className="text-slate-400">#{booking.id}</span>
                </h1>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-slate-400">Total amount</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">₹{booking.totalAmount}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 p-8 md:grid-cols-2 md:gap-12 md:p-10">

            {/* CAR SPECIFICATION */}
            <div>
              <h2 className="mb-5 border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">Vehicle</h2>
              {car ? (
                <div className="group">
                  <div className="relative mb-5 h-52 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                      src={`${API_URLS.CAR_UPLOADS}/cars/${car.imageUrls?.[0]}`}
                      alt={car.model}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                      {isDriver ? (
                        <>
                          <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.1a7.5 7.5 0 0115 0" />
                          </svg>
                          Chauffeur service
                        </>
                      ) : (
                        <>
                          <svg className="h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.03 5.91c-.5-.09-1.03.06-1.39.42l-1.99 1.99H9v2.25H6.75V19.5H4.5v-2.25c0-.4.16-.78.44-1.06l5.26-5.26c.36-.36.5-.89.42-1.39A6 6 0 1121.75 8.25z" />
                          </svg>
                          Private rental
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">{car.brand} {car.model}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {toSentenceCase(car.transmission)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {toSentenceCase(car.fuelType)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse">
                  <div className="h-52 w-full rounded-xl bg-slate-100"></div>
                  <div className="mt-5 h-6 w-2/3 rounded bg-slate-100"></div>
                </div>
              )}
            </div>

            {/* TRIP TIMELINE */}
            <div>
              <h2 className="mb-5 border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900">Trip schedule</h2>
              <div className="relative space-y-9">
                {/* Vertical line */}
                <div className="absolute bottom-3 left-[11px] top-3 w-0.5 bg-slate-200"></div>

                <div className="relative flex items-start gap-5">
                  <div className="z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-4 border-white bg-indigo-600 shadow-[0_0_0_2px_#4f46e5]"></div>
                  <div>
                    <p className="text-sm font-semibold text-indigo-600">Pickup</p>
                    <p className="mt-0.5 text-xl font-semibold text-slate-900">
                      {new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {new Date(booking.startDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-5">
                  <div className="z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-4 border-white bg-slate-300 shadow-[0_0_0_2px_#cbd5e1]"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Return</p>
                    <p className="mt-0.5 text-xl font-semibold text-slate-900">
                      {new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {new Date(booking.endDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="border-t border-slate-100 bg-slate-50 px-8 py-8 md:px-10">
            <div className="mx-auto flex max-w-xl items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-left text-sm text-indigo-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Please carry a valid driving license and ID for verification during hand-over.
            </div>

            {booking.status === "PENDING" && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/bookings')}
                  className="w-full rounded-xl bg-indigo-600 px-10 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98] sm:w-auto"
                >
                  Complete payment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* HELP TEXT */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Need assistance? Contact 24/7 support at +91-800-RENT-ALL
        </p>
      </div>
    </div>
  );
}