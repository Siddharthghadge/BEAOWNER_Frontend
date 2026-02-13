import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBikeById } from '../../api/bikeApi';
import { API_URLS } from "../../config/apiUrls";

const BikeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");

    // ✅ Only allow real Cloudinary images
    const buildImageUrl = (file) => {
        if (!file) return null;

        const cleanFile = String(file).trim();

        // Use Cloudinary URL directly
        if (cleanFile.includes("res.cloudinary.com")) {
            return cleanFile;
        }

        // Ignore local filenames (not accessible)
        return null;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getBikeById(id);
                setBike(response.data);

                if (response.data.imageUrls && response.data.imageUrls.length > 0) {

                    // pick first cloudinary image only
                    const cloudImage = response.data.imageUrls.find(img =>
                        img && img.includes("res.cloudinary.com")
                    );

                    if (cloudImage) {
                        setMainImage(cloudImage);
                    }
                }

            } catch (error) {
                console.error("Error fetching bike details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleBookNow = () => {
        navigate(`/customer/book-bike/${id}`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    if (!bike) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Bike profile not found.
            </p>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">

            <div className="h-24" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    ← Back to Fleet
                </button>

                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT: VISUAL GALLERY */}
                    <div className="space-y-6">

                        <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-200">
                            <img
                                src={mainImage || "https://placehold.co/800x600?text=No+Image"}
                                alt={bike.model}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                    (e.target.src = "https://placehold.co/800x600?text=Image+Unavailable")
                                }
                            />

                            <div className="absolute top-8 left-8">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md
                                    ${bike.available ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                                    {bike.available ? 'Available' : 'Reserved'}
                                </span>
                            </div>
                        </div>

                        {/* THUMBNAILS */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {bike.imageUrls
                                ?.filter(img => img && img.includes("res.cloudinary.com"))
                                .map((img, index) => {

                                    const fullUrl = img;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(fullUrl)}
                                            className={`relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all
                                                ${mainImage === fullUrl
                                                    ? "border-indigo-600 scale-95"
                                                    : "border-transparent opacity-60 hover:opacity-100"}`}
                                        >
                                            <img
                                                src={fullUrl}
                                                className="w-full h-full object-cover"
                                                alt="thumb"
                                            />
                                        </button>
                                    );
                                })}
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="flex flex-col">

                        <div className="mb-10">
                            <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-3 italic">
                                {bike.brand}
                            </p>

                            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] mb-6 text-slate-900">
                                {bike.model}
                            </h1>

                            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm tracking-tight">
                                <span className="flex items-center gap-1 italic">📍 {bike.location}</span>
                                <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                <span className="uppercase tracking-widest text-[10px]">{bike.bikeType}</span>
                            </div>
                        </div>

                        {/* SPECS */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {[
                                { label: "Displacement", value: `${bike.engineCc} CC` },
                                { label: "Transmission", value: "Manual" },
                                { label: "Fuel System", value: "Fuel Injection" },
                                { label: "Drive Type", value: "Chain Drive" }
                            ].map((spec, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                                        {spec.label}
                                    </p>
                                    <p className="font-black text-slate-900 tracking-tight">{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mb-10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
                                Vehicle Description
                            </h3>

                            <p className="text-slate-600 font-medium leading-relaxed italic">
                                {bike.description ||
                                    "A premium performance machine maintained to the highest boutique standards for your riding pleasure."}
                            </p>
                        </div>

                        {/* PRICE */}
                        <div className="mt-auto flex flex-col md:flex-row items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Price Rate
                                </span>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black tracking-tighter text-slate-900">
                                        ₹{bike.pricePerHour}
                                    </span>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">
                                        / HR
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleBookNow}
                                disabled={!bike.available}
                                className={`flex-1 w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95
                                    ${bike.available
                                        ? "bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-100"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"}`}
                            >
                                {bike.available ? 'Reserve This Ride' : 'Currently Unavailable'}
                            </button>
                        </div>

                        {!bike.available && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mt-4 text-center md:text-right italic">
                                * Maintenance gap in progress
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BikeDetails;
