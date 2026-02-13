import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import {
  fetchPendingCars,
  fetchPendingBikes,
  updateCarStatus,
  updateBikeStatus,
} from "../../api/adminApi";
import { toast } from "react-toastify";
import { API_URLS } from "../../config/apiUrls";

const AdminApprovals = () => {
  const [cars, setCars] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("cars");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const carRes = await fetchPendingCars();
      const bikeRes = await fetchPendingBikes();
      setCars(carRes.data || []);
      setBikes(bikeRes.data || []);
    } catch (error) {
      toast.error("Security Clearance Failed: Could not fetch pending records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id, type, status) => {
    let reason = "";
    if (status === "REJECTED") {
      const adminInput = window.prompt("REJECTION PROTOCOL: Specify reason for verification failure:");
      if (adminInput === null) return;
      reason = adminInput.trim() !== "" ? adminInput : "Incomplete or invalid documentation provided.";
    } else {
      reason = "Verification complete. Your vehicle is now live on the fleet.";
    }

    try {
      if (type === "car") {
        await updateCarStatus(id, status, reason);
      } else {
        await updateBikeStatus(id, status, reason);
      }
      toast.success(`Vehicle ${status} updated in master database.`);
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error("Transmission Error: Verify Notification Service connectivity.");
    }
  };

  const buildFileUrl = (file, type) => {
    if (!file || file === "undefined" || file === "null") return null;
    let cleanFile = String(file).trim().replace(/^\/?(uploads|bikes|cars)\/?/i, "");
    const baseUrl = type === "bikes" ? API_URLS.BIKE_UPLOADS : API_URLS.CAR_UPLOADS;
    return `${baseUrl}/${cleanFile}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 mb-4"></div>
      <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Scanning Fleet Requests...</p>
    </div>
  );

  const currentFleet = activeTab === "cars" ? cars : bikes;
 const rcBookUrl = buildFileUrl(selectedVehicle?.imageUrls?.[0], activeTab);
const insuranceUrl = buildFileUrl(selectedVehicle?.imageUrls?.[1], activeTab);
const pucUrl = buildFileUrl(selectedVehicle?.imageUrls?.[2], activeTab);


  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <AdminNavbar />

      {/* HEADER SECTION */}
      <div className="bg-[#0F172A] pt-32 pb-44 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-white font-black text-4xl uppercase tracking-tighter italic">Verification Queue</h2>
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              Pending Authorization: {cars.length + bikes.length} Units
            </p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("cars")}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === "cars" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              🚗 Cars ({cars.length})
            </button>
            <button
              onClick={() => setActiveTab("bikes")}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === "bikes" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-slate-400 hover:text-white"
              }`}
            >
              🏍️ Bikes ({bikes.length})
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center w-20">ID</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Specs</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tariff</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Docs</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentFleet.length > 0 ? currentFleet.map((item) => (
                  <tr key={item.id || item.carId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 text-center font-black text-indigo-600 text-xs italic tracking-tighter">
                      #{item.id || item.carId}
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.brand}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.model} • {item.fuelType}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[11px] font-black text-slate-700">{item.ownerEmail}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{item.location}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-black text-emerald-600 text-sm">₹{item.pricePerHour || item.pricePerDay}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Rate / HR</div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => { setSelectedVehicle(item); setShowModal(true); }}
                        className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAction(item.carId || item.id, activeTab === "cars" ? "car" : "bike", "APPROVED")}
                          className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-200"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleAction(item.carId || item.id, activeTab === "cars" ? "car" : "bike", "REJECTED")}
                          className="px-4 py-2 bg-rose-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-200"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-24 text-center">
                      <div className="text-4xl mb-4 opacity-20">📡</div>
                      <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">No Pending {activeTab} Transmissions</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DOCUMENT REVIEW MODAL */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/60 transition-all">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-900 p-8 flex justify-between items-center border-b border-white/5">
              <div>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">Document Audit</h3>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{selectedVehicle.brand} {selectedVehicle.model} // Unit #{selectedVehicle.id || selectedVehicle.carId}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white/10 p-3 rounded-2xl text-white hover:bg-rose-500 transition-all font-bold">Close</button>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50">
              {[
                { label: "Insurance Policy", url: insuranceUrl },
                { label: "RC Book Detail", url: rcBookUrl },
                { label: "PUC Certificate", url: pucUrl },
              ].map((doc, idx) => (
                <div key={idx} className="group">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-2">{doc.label}</label>
                  <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-slate-200 h-[350px] flex flex-col items-center justify-center overflow-hidden relative">
                    {doc.url ? (
                      <img 
                        src={doc.url} 
                        className="w-full h-full object-contain cursor-zoom-in hover:scale-105 transition-transform duration-500" 
                        alt={doc.label} 
                        onClick={() => window.open(doc.url, "_blank")}
                        onError={(e) => { e.target.src = "https://placehold.co/600x400/0f172a/6366f1?text=DATA+UNAVAILABLE"; }}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl mb-2 grayscale opacity-30">🚫</div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No File Linked</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 flex justify-end gap-4 bg-white border-t border-slate-100">
              <button 
                onClick={() => handleAction(selectedVehicle.id || selectedVehicle.carId, activeTab === "cars" ? "car" : "bike", "REJECTED")}
                className="px-10 py-4 rounded-2xl bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                Reject Asset
              </button>
              <button 
                onClick={() => handleAction(selectedVehicle.id || selectedVehicle.carId, activeTab === "cars" ? "car" : "bike", "APPROVED")}
                className="px-10 py-4 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Authorize Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;