import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { API_URLS } from "../../config/apiUrls";
import { toast } from "react-toastify";
import {
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  getPendingVehicles,
  updateVehicleStatus,
  getAllBookings,
} from "../../api/adminApi";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState({ cars: [], bikes: [] });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocs, setSelectedDocs] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const userRes = await getAllUsers();
      setUsers(userRes.data);
      
      const vehicleData = await getPendingVehicles();
      setVehicles(vehicleData);

      const bookingRes = await getAllBookings();
      setBookings(bookingRes.data || []);
    } catch (err) {
      console.error("Data Fetch Error:", err);
      toast.error("Microservice sync failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleApproval = async (type, id, status) => {
    let reason = "";
    if (status === "REJECTED") {
      reason = window.prompt("Reason for rejection:");
      if (!reason?.trim()) return toast.warning("Rejection reason required.");
    }
    try {
      await updateVehicleStatus(type, id, status, reason);
      toast.success(`Vehicle ${status.toLowerCase()} successfully!`);
      loadData();
      setSelectedDocs(null);
    } catch (err) {
      toast.error("Approval flow interrupted.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * DEPLOYMENT FRIENDLY URL BUILDER
   * Handles both Cloudinary (absolute) and Local (relative) paths
   */
  const buildFileUrl = (file) => {
    if (!file || file === "undefined" || file === "null") return null;
    
    let cleanFile = String(file).trim();

    // 1. If it's a Cloudinary/Web URL, use it directly
    if (cleanFile.startsWith("http")) {
      return cleanFile;
    }

    // 2. Legacy Local Storage Fallback
    // Identify if the currently viewed doc belongs to a bike or car
    const isBikeDoc = selectedDocs?.bikeId || activeTab === "bikes";
    const baseUrl = isBikeDoc ? API_URLS.BIKE_UPLOADS : API_URLS.CAR_UPLOADS;

    // Clean prefix logic for local files
    const finalPath = cleanFile.replace(/^\/?(uploads|bikes|cars)\/?/i, "");
    const normalizedBase = baseUrl?.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    return `${normalizedBase}/${finalPath}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 mb-4"></div>
      <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">Syncing Microservices...</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <AdminNavbar onTabChange={setActiveTab} />
      
      {/* STATS OVERVIEW */}
      <div className="bg-[#0F172A] pt-32 pb-40 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Network Users</p>
            <h3 className="text-4xl font-black text-white italic">{users.length}</h3>
          </div>
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pending Inventory</p>
            <h3 className="text-4xl font-black text-white italic">{vehicles.cars.length + vehicles.bikes.length}</h3>
          </div>
          <div 
            className="bg-indigo-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={() => navigate("/admin/bookings")}
          >
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">System Bookings</p>
            <h3 className="text-4xl font-black text-white italic">{bookings.length}</h3>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          
          {/* TAB NAVIGATION */}
          <div className="flex flex-col md:flex-row justify-between items-center p-8 gap-6 border-b border-slate-50">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {["users", "cars", "bikes"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab} ({tab === 'users' ? users.length : vehicles[tab]?.length || 0})
                </button>
              ))}
            </div>

            {activeTab === "users" && (
              <div className="relative w-full md:w-96">
                <input 
                  type="text" 
                  placeholder="SEARCH DIRECTORY..." 
                  className="w-full bg-slate-50 border-none rounded-xl px-6 py-3 font-bold text-xs uppercase tracking-widest outline-none focus:ring-2 ring-indigo-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* DATA TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  {activeTab === "users" ? (
                    <>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identifier</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Privileges</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Authorization</th>
                    </>
                  ) : (
                    <>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Specs</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeTab === "users" ? filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/30">
                    <td className="px-8 py-6 font-bold text-indigo-600 text-xs">#{user.id}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-[11px] uppercase tracking-wide">{user.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value).then(loadData)}
                        className="bg-slate-100 border-none rounded-lg text-[9px] font-black px-3 py-1.5 uppercase outline-none"
                        disabled={user.email === 'scindia@gmail.com'}
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="OWNER">Owner</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => toggleUserStatus(user.id).then(loadData)}
                        className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg transition-all ${
                          user.enabled !== false 
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white" 
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        {user.enabled !== false ? "Restrict" : "Authorize"}
                      </button>
                    </td>
                  </tr>
                )) : vehicles[activeTab]?.map((v) => (
                  <tr key={v.id || v.carId || v.bikeId} className="hover:bg-slate-50/30">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-[11px] uppercase tracking-wide">{v.brand}</span>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase">{v.model}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase">{v.ownerEmail}</td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => setSelectedDocs(v)}
                        className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        Review Documents
                      </button>
                    </td>
                    <td className="px-8 py-6 text-center flex justify-center gap-2">
                      <button onClick={() => handleVehicleApproval(activeTab === "cars" ? "car" : "bike", v.id || v.carId || v.bikeId, "APPROVED")} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 shadow-lg shadow-emerald-500/20">✅</button>
                      <button onClick={() => handleVehicleApproval(activeTab === "cars" ? "car" : "bike", v.id || v.carId || v.bikeId, "REJECTED")} className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 shadow-lg shadow-rose-500/20">❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VERIFICATION MODAL */}
      {selectedDocs && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.3em]">Compliance Verification</h3>
                <p className="text-[10px] font-bold text-indigo-500 uppercase mt-1">{selectedDocs.brand} {selectedDocs.model}</p>
              </div>
              <button onClick={() => setSelectedDocs(null)} className="text-3xl text-slate-300 hover:text-slate-900 transition-colors">&times;</button>
            </div>

            <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
  { label: "RC Book", url: selectedDocs.rcBookUrl },
  { label: "Insurance", url: selectedDocs.insuranceDocUrl },
  { label: "PUC/Permit", url: selectedDocs.pucDocUrl }
]
.map((doc, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{doc.label}</h5>
                  <div className="aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-inner group relative">
                    <img
                      src={buildFileUrl(doc.url) || "https://placehold.co/400x500/e2e8f0/64748b?text=NO+DOCUMENT"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 cursor-zoom-in"
                      alt={doc.label}
                      onClick={() => doc.url && window.open(buildFileUrl(doc.url), "_blank")}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x500/e2e8f0/64748b?text=NOT+FOUND";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-900 flex justify-end gap-4">
              <button 
                onClick={() => handleVehicleApproval(activeTab === "cars" ? "car" : "bike", selectedDocs.id || selectedDocs.carId || selectedDocs.bikeId, "REJECTED")}
                className="px-10 py-4 bg-transparent border border-rose-500 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                Reject Asset
              </button>
              <button 
                onClick={() => handleVehicleApproval(activeTab === "cars" ? "car" : "bike", selectedDocs.id || selectedDocs.carId || selectedDocs.bikeId, "APPROVED")}
                className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;