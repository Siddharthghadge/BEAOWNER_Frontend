import React, { useEffect, useState } from 'react';
import { getAllBikes } from '../../api/bikeApi';
import BikeCard from '../../components/cards/BikeCard';

const Bikes = () => {
    const [bikes, setBikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await getAllBikes();
                // Show only available bikes
                setBikes(response.data.filter(bike => bike.available));
            } catch (error) {
                console.error("Failed to fetch bikes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBikes();
    }, []);

    const filteredBikes = bikes.filter(bike =>
        bike.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* HERO SECTION - MATCHING REFERENCE UI */}
            <div className="bg-[#0F172A] pt-32 pb-48 px-6 lg:px-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="z-10 text-center md:text-left">
                        <p className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">Two-Wheeler Fleet</p>
                        <h1 className="text-white text-6xl md:text-7xl font-black leading-none mb-2">
                            AVAILABLE <br />
                            <span className="italic text-slate-400 opacity-80">BIKES</span>
                        </h1>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="w-full md:w-[450px] relative z-10">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search by brand or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 p-5 pl-14 rounded-2xl text-white placeholder-slate-500 font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>
                
                {/* Visual Background Accent */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
            </div>

            {/* GRID SECTION */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 pb-20">
                {loading ? (
                    <div className="bg-white rounded-[2.5rem] p-40 text-center shadow-xl border border-slate-100">
                        <div className="h-12 w-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Locating Available Rides</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBikes.map(bike => (
                                <BikeCard key={bike.id} bike={bike} />
                            ))}
                        </div>

                        {/* EMPTY STATE */}
                        {!loading && filteredBikes.length === 0 && (
                            <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">
                                    No bikes found matching your search.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Bikes;