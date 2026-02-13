import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import { getBikeById } from '../../api/bikeApi';

import bookingService from '../../api/bookingService';

import { API_URLS } from "../../config/apiUrls";



const BikeBooking = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [bike, setBike] = useState(null);

    const [loading, setLoading] = useState(true);



    // Booking Details

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [totalPrice, setTotalPrice] = useState(0);



    // Documents and Terms

    const [license, setLicense] = useState(null);

    const [aadhar, setAadhar] = useState(null);

    const [agreedToTerms, setAgreedToTerms] = useState(false);



    // ✅ Modal States

    const [showModal, setShowModal] = useState(false);

    const [modalContent, setModalContent] = useState({ title: "", text: "" });



    const buildImageUrl = (file) => {

        if (!file) return null;



        const cleanFile = String(file).trim();



        // Use Cloudinary URL directly

        if (cleanFile.includes("res.cloudinary.com")) {

            return cleanFile;

        }



        // Ignore local filename

        return null;

    };



    useEffect(() => {

        getBikeById(id).then(res => {

            setBike(res.data);

            setLoading(false);

        });

    }, [id]);



    useEffect(() => {

        if (startDate && endDate && bike) {

            const start = new Date(startDate);

            const end = new Date(endDate);

            const diffMs = end - start;

            const hours = diffMs / 36e5;

            setTotalPrice(hours > 0 ? (hours * bike.pricePerHour).toFixed(2) : 0);

        }

    }, [startDate, endDate, bike]);



    // ✅ Function to open Policy Modals

    const openPolicy = (type) => {

        if (type === 'privacy') {

            setModalContent({

                title: "Privacy Protocol",

                text: "We value your privacy. Your document uploads (Aadhar/License) are encrypted and stored only for verification purposes. We do not share your data with third-party advertisers. Data is automatically archived after the rental period ends."

            });

        } else {

            setModalContent({

                title: "Rental Terms",

                text: "1. The rider must be 18+ with a valid license. 2. Any damage to the bike during the rental period is the user's responsibility. 3. Fuel charges are not included in the hourly rate. 4. Late returns will incur a penalty of 2x hourly rate per hour."

            });

        }

        setShowModal(true);

    };



    const handleConfirmBooking = async () => {

        if (!startDate || !endDate) return alert("Please select dates.");

        if (new Date(startDate) >= new Date(endDate)) return alert("Invalid date range.");

        if (!license || !aadhar) return alert("Please upload documents.");

        if (!agreedToTerms) return alert("Please agree to the terms.");



        if (!bike?.ownerId || !bike?.ownerEmail) {

            alert("❌ Bike owner details missing. Please contact support.");

            return;

        }



        const bookingData = {

            bikeId: Number(id),

            ownerId: bike.ownerId,

            ownerEmail: bike.ownerEmail,

            bookingType: "SELF_DRIVE",

            startDate: startDate.includes("T") ? startDate : `${startDate}:00`,

            endDate: endDate.includes("T") ? endDate : `${endDate}:00`,

            totalAmount: Number(totalPrice)

        };



        try {

            await bookingService.createBooking(bookingData);

            alert("✅ Reservation successful!");

            navigate('/bookings');

        } catch (error) {

            console.error("Booking Error:", error.response?.data);

            alert("Booking failed: " + (error.response?.data?.message || "Error"));

        }

    };



    if (loading) return (

        <div className="min-h-screen flex items-center justify-center bg-white">

            <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />

        </div>

    );



    return (

        <div className="bg-[#F8FAFC] min-h-screen py-16 px-4 md:px-8 font-sans text-slate-900">

            <div className="max-w-5xl mx-auto">

                {/* BACK BUTTON */}

                <button 

                    onClick={() => navigate(-1)}

                    className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-colors"

                >

                    ← Go Back

                </button>



                <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-200 grid lg:grid-cols-2">

                    

                    {/* LEFT: BIKE SUMMARY */}

                    <div className="relative border-r border-slate-100 bg-white p-10 flex flex-col justify-between">

                        <div>

                            <span className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 inline-block">

                                Self-Drive Reservation

                            </span>

                            <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-2">

                                {bike.brand} <br />

                                <span className="text-slate-400">{bike.model}</span>

                            </h2>

                            <p className="text-slate-400 font-bold text-sm mb-8">Type: {bike.bikeType} • {bike.engineCc}CC</p>

                        </div>



                        <div className="relative h-64 w-full rounded-[2rem] overflow-hidden shadow-2xl mb-8">

                            <img

  src={

    bike.imageUrls?.find(img => img?.startsWith("http")) ||

    `${API_URLS.BIKE_UPLOADS}/${bike.imageUrls?.[0]}`

  }

  className="w-full h-full object-cover"

  alt="bike"

/>



                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        </div>



                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">

                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Rate</p>

                            <p className="font-black text-xl uppercase tracking-tighter italic text-indigo-600">₹{bike.pricePerHour}/hr</p>

                        </div>

                    </div>



                    {/* RIGHT: FORM SECTION */}

                    <div className="p-10 md:p-14 bg-slate-50/50">

                        <h3 className="text-2xl font-black tracking-tighter uppercase mb-10">Booking Configuration</h3>

                        

                        <div className="space-y-8">
                            {/* DURATION */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Pickup</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-4 bg-white rounded-2xl border border-slate-200 text-xs font-bold outline-none"
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">

                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Return</label>

                                    <input

                                        type="datetime-local"

                                        className="w-full p-4 bg-white rounded-2xl border border-slate-200 text-xs font-bold outline-none"

                                        onChange={(e) => setEndDate(e.target.value)}

                                    />

                                </div>

                            </div>



                            {/* DOCUMENTS */}

                            <div className="space-y-4">

                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Required Documents</p>

                                <div className="grid grid-cols-1 gap-3">

                                    <div className="relative">

                                        <input type="file" id="lic" hidden onChange={(e) => setLicense(e.target.files[0])} />

                                        <label htmlFor="lic" className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-600 transition-all">

                                            <span className="text-[11px] font-black uppercase">Driving License</span>

                                            <span className="text-[9px] bg-slate-100 px-2 py-1 rounded-md">{license ? "Uploaded" : "Select File"}</span>

                                        </label>

                                    </div>

                                    <div className="relative">

                                        <input type="file" id="adh" hidden onChange={(e) => setAadhar(e.target.files[0])} />

                                        <label htmlFor="adh" className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-600 transition-all">

                                            <span className="text-[11px] font-black uppercase">Aadhar Card</span>

                                            <span className="text-[9px] bg-slate-100 px-2 py-1 rounded-md">{aadhar ? "Uploaded" : "Select File"}</span>

                                        </label>

                                    </div>

                                </div>

                            </div>



                            {/* TOTAL */}

                            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">

                                <div className="flex justify-between items-end">

                                    <div>

                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Total Estimation</p>

                                        <p className="text-[9px] opacity-40 uppercase font-black tracking-widest mt-1">Based on hourly rate</p>

                                    </div>

                                    <span className="text-4xl font-black tracking-tighter">₹{totalPrice}</span>

                                </div>

                            </div>



                            {/* CONSENT */}

                            <div className="flex items-start gap-4 px-2">

                                <input 

                                    type="checkbox" 

                                    id="policyCheck" 

                                    className="mt-1 w-4 h-4 accent-indigo-600 rounded"

                                    checked={agreedToTerms} 

                                    onChange={(e) => setAgreedToTerms(e.target.checked)} 

                                />

                                <label htmlFor="policyCheck" className="text-[11px] font-bold text-slate-500 uppercase tracking-tight leading-tight">

                                    I agree to the <span className="text-indigo-600 underline cursor-pointer" onClick={() => openPolicy('privacy')}>Privacy Policy</span> and <span className="text-indigo-600 underline cursor-pointer" onClick={() => openPolicy('terms')}>Terms</span>.

                                </label>

                            </div>



                            <button

                                onClick={handleConfirmBooking}

                                disabled={!agreedToTerms}

                                className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95

                                    ${agreedToTerms ? "bg-indigo-600 text-white hover:bg-slate-900 shadow-indigo-200" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"}`}

                            >

                                Confirm Reservation

                            </button>

                        </div>

                    </div>

                </div>

            </div>



            {/* MODAL */}

            {showModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-6">

                    <div className="bg-white rounded-[2.5rem] p-10 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-300">

                        <h3 className="text-2xl font-black tracking-tighter uppercase mb-6 border-b border-slate-50 pb-4">

                            {modalContent.title}

                        </h3>

                        <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium italic">

                            {modalContent.text}

                        </p>

                        <button 

                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-colors"

                            onClick={() => setShowModal(false)}

                        >

                            Close Protocol

                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};



export default BikeBooking;