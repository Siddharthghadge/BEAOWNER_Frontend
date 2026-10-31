import React, { useState } from 'react';
import { forgotPassword, resetPassword } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/* ---------- UI-only helpers ---------- */
const inputBase =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const primaryBtn =
    "flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

const Spinner = () => (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
);

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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 font-sans text-slate-900">
            {/* Soft background accents */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl"></div>

            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-9">
                {/* Visual Step Indicator */}
                <div className="mb-7 flex items-center justify-center" aria-label={`Step ${step} of 2`}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                        {step === 2 ? (
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            "1"
                        )}
                    </div>
                    <div className={`mx-2 h-0.5 w-12 rounded-full transition-colors ${step === 2 ? "bg-indigo-600" : "bg-slate-200"}`}></div>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${step === 2 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                        2
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        {step === 1 ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.9 5.3a2 2 0 002.2 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6.75 10.5h10.5a1.5 1.5 0 011.5 1.5v6.75a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5V12a1.5 1.5 0 011.5-1.5z" />
                            </svg>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        {step === 1 ? "Forgot password" : "Set new password"}
                    </h2>
                    <p className="mt-2 break-words text-sm leading-relaxed text-slate-500">
                        {step === 1
                            ? "Don't worry! Enter your email and we'll send you a 6-digit reset code."
                            : `We sent a code to ${email}. Please enter it below.`}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={inputBase}
                            />
                        </div>
                        <button type="submit" disabled={loading} className={primaryBtn}>
                            {loading && <Spinner />}
                            {loading ? "Sending Code..." : "Send Reset Code"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="otp" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Verification code
                            </label>
                            <input
                                id="otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                maxLength="6"
                                className={`${inputBase} text-center text-lg font-semibold tracking-[0.4em] placeholder:text-sm placeholder:font-normal placeholder:tracking-normal`}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-semibold text-slate-700">
                                New password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className={inputBase}
                            />
                        </div>
                        <button type="submit" disabled={loading} className={primaryBtn}>
                            {loading && <Spinner />}
                            {loading ? "Updating Password..." : "Update Password"}
                        </button>
                    </form>
                )}

                <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                    <button
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:text-indigo-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100"
                        onClick={() => step === 2 ? setStep(1) : navigate('/login')}
                    >
                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.7 4.3a1 1 0 010 1.4L8.4 10l4.3 4.3a1 1 0 01-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 0z" clipRule="evenodd" />
                        </svg>
                        {step === 2 ? "Use different email" : "Back to Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;