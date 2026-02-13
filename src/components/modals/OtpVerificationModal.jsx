import React, { useState } from 'react';
import bookingService from "../../api/bookingService"; // ✅ Imported the default object

const OtpVerificationModal = ({ bookingId, onClose, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        // Validation for numeric 6-digit OTP
        if (otp.length !== 6 || isNaN(otp)) {
            setError("Please enter a valid 6-digit numeric OTP.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            // ✅ FIX: Called as a method of bookingService
            await bookingService.verifyPickupOtp(bookingId, otp);
            
            onSuccess(); // Refresh the parent booking list
            onClose();   // Close the modal
        } catch (err) {
            console.error("Verification Error:", err);
            // Handling both string responses and object error messages
            const serverError = typeof err.response?.data === 'string' 
                ? err.response.data 
                : err.response?.data?.message || "Invalid OTP. Please try again.";
            
            setError(serverError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.content}>
                <h3 style={modalStyles.title}>Verify Handover</h3>
                <p style={modalStyles.subtitle}>Ask the customer for the 6-digit OTP shown on their booking details.</p>
                
                <input 
                    type="text" 
                    placeholder="000000" 
                    value={otp} 
                    onChange={(e) => {
                        // Only allow numbers and limit to 6 digits
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 6) setOtp(val);
                    }}
                    style={modalStyles.input}
                    maxLength={6}
                />

                {error && <div style={modalStyles.errorBox}>{error}</div>}

                <div style={modalStyles.actions}>
                    <button 
                        onClick={onClose} 
                        style={modalStyles.cancelBtn}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleVerify} 
                        disabled={loading} 
                        style={loading ? {...modalStyles.verifyBtn, opacity: 0.7} : modalStyles.verifyBtn}
                    >
                        {loading ? "Verifying..." : "Verify & Complete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: { 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', 
        justifyContent: 'center', alignItems: 'center', zIndex: 1000 
    },
    content: { 
        background: 'white', padding: '30px', borderRadius: '16px', 
        width: '100%', maxWidth: '400px', textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    title: { margin: '0 0 10px 0', fontSize: '20px', color: '#111827' },
    subtitle: { fontSize: '14px', color: '#6b7280', lineHeight: '1.5' },
    input: { 
        width: '100%', padding: '15px', fontSize: '28px', letterSpacing: '8px', 
        textAlign: 'center', margin: '20px 0', border: '2px solid #e5e7eb', 
        borderRadius: '12px', outline: 'none', transition: 'border-color 0.2s'
    },
    errorBox: { 
        backgroundColor: '#fef2f2', color: '#b91c1c', padding: '10px', 
        borderRadius: '8px', fontSize: '14px', marginBottom: '15px', border: '1px solid #fee2e2'
    },
    actions: { display: 'flex', gap: '12px' },
    cancelBtn: { 
        flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', 
        borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#4b5563' 
    },
    verifyBtn: { 
        flex: 1, padding: '12px', background: '#2563eb', color: 'white', 
        border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' 
    }
};

export default OtpVerificationModal;