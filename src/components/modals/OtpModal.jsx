import React, { useState } from 'react';
import { verifyPickupOtp } from '../api/bookingService';

const OtpModal = ({ bookingId, onVerified }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await verifyPickupOtp(bookingId, otp);
            alert("Booking Completed! Earnings credited to your wallet.");
            onVerified(); // Refresh the page or status
        } catch (err) {
            alert("Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow-md bg-white">
            <h2 className="text-lg font-bold mb-2">Verify Customer OTP</h2>
            <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code provided by the customer.</p>
            <input 
                className="border p-2 w-full mb-4"
                type="text" 
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
            />
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded w-full"
            >
                {loading ? 'Verifying...' : 'Complete Handover'}
            </button>
        </div>
    );
};

export default OtpModal;