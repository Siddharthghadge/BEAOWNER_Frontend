import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bikeApi from '../../api/bikeApi';
import { toast } from "react-toastify";
import OwnerNavbar from '@/components/common/OwnerNavbar';

export default function EditBike() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    const [bike, setBike] = useState({
        brand: '', 
        model: '', 
        pricePerHour: '', 
        location: '', 
        description: '', 
        available: true
    });

    useEffect(() => {
        bikeApi.get(`/${id}`)
            .then(res => {
                setBike(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Could not fetch bike details", err);
                toast.error("Failed to load asset data.");
                navigate('/owner/my-bikes');
            });
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await bikeApi.put(`/${id}`, bike);
            toast.success("Machine specifications updated!");
            navigate('/owner/my-bikes');
        } catch (err) {
            toast.error("Update failed. Check network status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mb-4"></div>
            <p className="font-black text-xs uppercase tracking-widest text-slate-400">Loading Specifications...</p>
        </div>
    );

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
            <OwnerNavbar />

            {/* HERO HEADER */}
            <div className="bg-[#0F172A] pt-24 pb-32 px-6 lg:px-20 relative">
                <div className="max-w-5xl mx-auto relative z-10">
                    <button 
                        onClick={() => navigate('/owner/my-bikes')} 
                        className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 hover:text-white transition-colors"
                    >
                        ← Back to Garage
                    </button>
                    <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
                        MODIFY <span className="text-indigo-500 italic text-4xl leading-none">ASSET #{id}</span>
                    </h1>
                    <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Update machine availability and rental parameters.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
                <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="p-8 lg:p-12">
                        
                        {/* AVAILABILITY TOGGLE BOX */}
                        <div className="mb-10 p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Operational Status</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Is this bike ready for new bookings?</p>
                            </div>
                            <select 
                                value={bike.available} 
                                onChange={e => setBike({...bike, available: e.target.value === 'true'})}
                                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest outline-none border-2 transition-all ${
                                    bike.available 
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                                    : "bg-red-50 border-red-500 text-red-700"
                                }`}
                            >
                                <option value="true">● Available for Rent</option>
                                <option value="false">● Decommissioned / Booked</option>
                            </select>
                        </div>

                        {/* SPECS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Immutable Brand</label>
                                    <input value={bike.brand} disabled className="w-full bg-slate-100 p-4 rounded-xl font-black text-slate-400 cursor-not-allowed border border-slate-200" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block italic">Immutable Model</label>
                                    <input value={bike.model} disabled className="w-full bg-slate-100 p-4 rounded-xl font-black text-slate-400 cursor-not-allowed border border-slate-200" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Rental Rate (₹ / hr)</label>
                                    <input 
                                        type="number" 
                                        value={bike.pricePerHour} 
                                        className="w-full bg-white p-4 rounded-xl font-black text-indigo-600 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                        onChange={e => setBike({...bike, pricePerHour: e.target.value})} 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Station Location</label>
                                    <input 
                                        value={bike.location} 
                                        className="w-full bg-white p-4 rounded-xl font-bold text-slate-700 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all shadow-sm"
                                        onChange={e => setBike({...bike, location: e.target.value})} 
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mb-10">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Service Description</label>
                            <textarea 
                                value={bike.description} 
                                className="w-full bg-white p-4 rounded-xl font-medium text-slate-700 border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all shadow-sm min-h-[120px]"
                                onChange={e => setBike({...bike, description: e.target.value})} 
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button 
                                type="submit" 
                                disabled={updating}
                                className={`flex-grow py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl ${
                                    updating ? "bg-slate-200 text-slate-400" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]"
                                }`}
                            >
                                {updating ? "SYNCHRONIZING..." : "COMMIT CHANGES"}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/owner/my-bikes')} 
                                className="md:w-1/3 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                            >
                                DISCARD
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}