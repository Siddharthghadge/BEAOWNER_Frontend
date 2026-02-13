import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bikeApi from "../../api/bikeApi";
import { toast } from "react-toastify";
import OwnerNavbar from "@/components/common/OwnerNavbar";

export default function MyBikes() {
  const [activeBikes, setActiveBikes] = useState([]);
  const [rejectedBikes, setRejectedBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("active");
  const navigate = useNavigate();

  console.log("MYBIKES UPDATED VERSION");

  // ✅ Safe Image Resolver
  const getImageUrl = (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return "/no-image.png";
    const validUrl = imageUrls.find((url) => url.startsWith("http"));
    return validUrl || "/no-image.png";
  };

  // ================= FETCH =================
  const fetchBikes = async () => {
    setLoading(true);
    try {
      const res = await bikeApi.get("/my-bikes");
      const allData = Array.isArray(res.data) ? res.data : [];

      setActiveBikes(allData.filter((b) => b.status !== "REJECTED"));
      setRejectedBikes(allData.filter((b) => b.status === "REJECTED"));
    } catch (err) {
      console.error("Fetch bikes error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch garage data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm("Permanent removal of this machine. Proceed?")) {
      try {
        await bikeApi.delete(`/${id}`);
        toast.success("Bike removed successfully");
        fetchBikes();
      } catch {
        toast.error("Removal failed");
      }
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mb-4"></div>
        <p className="font-black text-xs uppercase tracking-widest text-slate-400">
          Syncing Garage...
        </p>
      </div>
    );
  }

  const currentList = view === "active" ? activeBikes : rejectedBikes;

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />

      {/* HERO HEADER */}
      <div className="bg-[#0F172A] pt-24 pb-32 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-white text-5xl font-black uppercase tracking-tighter">
              BIKE <span className="text-indigo-500 italic">GARAGE</span>
            </h1>
            <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">
              Manage your two-wheeler inventory and status.
            </p>
          </div>

          <button
            onClick={() => navigate("/owner/add-bike")}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl"
          >
            + Register Machine
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12">

        {/* TAB NAVIGATION */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setView("active")}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${
              view === "active"
                ? "bg-white text-indigo-600 shadow-lg"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            Active & Pending ({activeBikes.length})
          </button>

          <button
            onClick={() => setView("rejected")}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest ${
              view === "rejected"
                ? "bg-red-500 text-white shadow-lg"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            Rejected ({rejectedBikes.length})
          </button>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentList.length > 0 ? (
            currentList.map((bike) => (
              <div
                key={bike.id}
                className="bg-white rounded-[2rem] overflow-hidden border shadow-xl group"
              >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImageUrl(bike.imageUrls)}
                    alt={bike.model}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => (e.target.src = "/no-image.png")}
                  />

                  {/* ✅ ADMIN STATUS BADGE */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg ${
                        bike.status === "APPROVED"
                          ? "bg-emerald-500 text-white"
                          : bike.status === "REJECTED"
                          ? "bg-red-500 text-white"
                          : "bg-amber-400 text-amber-900"
                      }`}
                    >
                      {bike.status}
                    </span>
                  </div>

                  {/* ✅ RENTAL STATUS BADGE */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg ${
                        bike.available
                          ? "bg-blue-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {bike.available ? "AVAILABLE" : "BOOKED"}
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-black uppercase">
                        {bike.brand}
                      </h4>
                      <p className="text-indigo-600 text-xs font-bold uppercase">
                        {bike.model}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-400 text-[9px] uppercase font-black">
                        Per Hour
                      </p>
                      <p className="text-2xl font-black">
                        ₹{bike.pricePerHour}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs italic mb-6">
                    📍 {bike.location}
                  </p>

                  {/* REJECTION MESSAGE */}
                  {bike.status === "REJECTED" && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
                      <p className="text-[10px] font-black text-red-600 uppercase mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-xs text-red-800">
                        {bike.reason || "Documents verification failed"}
                      </p>
                    </div>
                  )}

                  {/* AVAILABILITY TEXT */}
                  <div className="flex items-center justify-between py-4 border-y mb-6">
                    <span
                      className={`flex items-center gap-2 text-[10px] font-black uppercase ${
                        bike.available
                          ? "text-emerald-500"
                          : "text-amber-500"
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

                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {bike.bikeType}
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/owner/edit-bike/${bike.id}`)}
                      className="py-3 rounded-xl bg-slate-50 text-slate-600 text-[10px] font-black uppercase hover:bg-indigo-50"
                    >
                      Edit Asset
                    </button>

                    <button
                      onClick={() => handleDelete(bike.id)}
                      className="py-3 rounded-xl bg-white text-red-500 text-[10px] font-black uppercase border"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center py-20 bg-white rounded-[3rem] border-2 border-dashed">
              <div className="text-5xl mb-4 opacity-20">🏍️</div>
              <h3 className="text-slate-400 font-black text-xs uppercase">
                No {view} bikes found
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
