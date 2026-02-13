import React, { useState } from 'react';
import { forgotPassword, resetPassword } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Reset
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data || "Failed to send OTP. Check if email exists.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetPassword({ email, token: otp, newPassword });
            toast.success("Password reset successful! Please login.");
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data || "Invalid OTP or request expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Visual Step Indicator */}
                <div style={styles.stepContainer}>
                    <div style={{...styles.stepCircle, backgroundColor: step >= 1 ? "#2563eb" : "#cbd5e1"}}>1</div>
                    <div style={{...styles.stepLine, backgroundColor: step === 2 ? "#2563eb" : "#cbd5e1"}}></div>
                    <div style={{...styles.stepCircle, backgroundColor: step === 2 ? "#2563eb" : "#cbd5e1"}}>2</div>
                </div>

                <h2 style={styles.title}>{step === 1 ? "Forgot Password" : "Set New Password"}</h2>
                <p style={styles.subtitle}>
                    {step === 1 
                        ? "Don't worry! Enter your email and we'll send you a 6-digit reset code." 
                        : `We sent a code to ${email}. Please enter it below.`}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="e.g. siddharth@example.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? "Sending Code..." : "Send Reset Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Verification Code</label>
                            <input 
                                type="text" 
                                placeholder="Enter 6-digit OTP" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                required 
                                maxLength="6"
                                style={{...styles.input, textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold'}}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>New Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                required 
                                style={styles.input}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? "Updating Password..." : "Update Password"}
                        </button>
                    </form>
                )}
                
                <button 
                    style={styles.backBtn} 
                    onClick={() => step === 2 ? setStep(1) : navigate('/login')}
                >
                    {step === 2 ? "← Use different email" : "Back to Login"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Inter', sans-serif"
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        textAlign: "center"
    },
    stepContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "24px"
    },
    stepCircle: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "0.3s"
    },
    stepLine: {
        width: "40px",
        height: "3px",
        margin: "0 8px"
    },
    title: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#1e293b",
        margin: "0 0 10px 0"
    },
    subtitle: {
        fontSize: "14px",
        color: "#64748b",
        lineHeight: "1.5",
        marginBottom: "30px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        textAlign: "left"
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#475569"
    },
    input: {
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "15px",
        outline: "none",
        transition: "border-color 0.2s",
        backgroundColor: "#fdfdfd"
    },
    button: {
        padding: "14px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "16px",
        marginTop: "10px",
        transition: "background 0.2s",
    },
    backBtn: {
        background: "none",
        border: "none",
        color: "#64748b",
        fontSize: "14px",
        fontWeight: "500",
        marginTop: "25px",
        cursor: "pointer",
        textDecoration: "underline"
    }
};

export default ForgotPassword;