import React, { useState, useEffect } from "react";
import paymentService from "../../api/paymentService";
import BankDetailsForm from "./BankDetailsForm"; 
import { toast } from "react-toastify";
import OwnerNavbar from "@/components/common/OwnerNavbar";

const OwnerWallet = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    accountNumber: null, 
    ifscCode: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const ownerEmail = user?.email;

  const fetchWalletDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await paymentService.getWalletSummary(ownerEmail);
      
      setWalletData({
        balance: response.data.currentBalance || 0,
        transactions: response.data.recentTransactions || [],
        accountNumber: response.data.accountNumber,
        ifscCode: response.data.ifscCode,
      });
    } catch (err) {
      console.error("Wallet Fetch Error:", err);
      setError("Failed to load wallet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ownerEmail) {
      setError("Owner session not found. Please log in again.");
      setLoading(false);
      return;
    }
    fetchWalletDetails();
  }, [ownerEmail]);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);

    if (!amount || amount <= 0) {
      toast.warning("Enter a valid amount.");
      return;
    }

    if (amount > walletData.balance) {
      toast.error("Insufficient balance in vault.");
      return;
    }

    try {
      setIsWithdrawing(true);
      await paymentService.withdrawFunds(ownerEmail, amount);
      toast.success(`Disbursement of ₹${amount.toLocaleString("en-IN")} initiated.`);
      setWithdrawAmount("");
      fetchWalletDetails(); 
    } catch (err) {
      toast.error(err.response?.data || "Transaction failed.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 mb-4"></div>
      <p className="font-black text-xs uppercase tracking-widest text-slate-400">Auditing Earnings...</p>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
      <OwnerNavbar />

      {/* HERO HEADER */}
      <div className="bg-[#0F172A] pt-24 pb-32 px-6 lg:px-20 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-white text-5xl font-black uppercase tracking-tighter leading-none">
            FINANCIAL <span className="text-indigo-500 italic">VAULT</span>
          </h1>
          <p className="text-slate-400 mt-2 font-bold text-sm uppercase tracking-widest">Real-time revenue monitoring and fund disbursement.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* BALANCE CARD */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 rounded-[2.5rem] p-10 shadow-2xl shadow-indigo-900/40 text-white flex flex-col md:flex-row justify-between items-center gap-8 border border-white/10">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-2">Available for Withdrawal</p>
              <h2 className="text-6xl font-black tracking-tighter mb-6">
                ₹{Number(walletData.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h2>
              <button 
                onClick={() => setShowBankForm(!showBankForm)} 
                className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {walletData.accountNumber ? "Modify Settlement Account" : "+ Link Bank Account"}
              </button>
              {walletData.accountNumber && !showBankForm && (
                <p className="text-[10px] font-bold text-indigo-300 mt-4 tracking-widest uppercase opacity-70">
                  Settling to: {walletData.accountNumber.replace(/\d(?=\d{4})/g, "*")} ({walletData.ifscCode})
                </p>
              )}
            </div>

            <form onSubmit={handleWithdrawal} className="w-full md:w-auto bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
              <label className="text-[9px] font-black uppercase tracking-widest text-indigo-200 block mb-3 text-center">Transfer to Bank</label>
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-white text-slate-900 px-6 py-4 rounded-xl font-black text-xl w-full md:w-48 outline-none border-none shadow-inner"
                  disabled={!walletData.accountNumber}
                />
                <button 
                  type="submit" 
                  disabled={isWithdrawing || !withdrawAmount || !walletData.accountNumber}
                  className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${
                    !walletData.accountNumber 
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
                    : "bg-indigo-500 text-white hover:bg-indigo-400 active:scale-95"
                  }`}
                >
                  {isWithdrawing ? "Processing..." : "Withdraw Funds"}
                </button>
              </div>
            </form>
          </div>

          {/* BANK FORM MODAL/INLINE */}
          <div className="lg:col-span-1">
            {showBankForm ? (
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-right-4">
                  <BankDetailsForm 
                    ownerEmail={ownerEmail} 
                    existingDetails={walletData} 
                    onSave={() => {
                      setShowBankForm(false);
                      fetchWalletDetails();
                    }} 
                  />
               </div>
            ) : (
              <div className="bg-slate-900 p-8 rounded-[2rem] text-center h-full flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
                   <span className="text-3xl">🛡️</span>
                </div>
                <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Secure Settlements</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase leading-relaxed tracking-wider">
                  Funds are disbursed within 24-48 hours of withdrawal request. Ensure KYC details are up to date.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="mt-12 bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.3em]">Transaction Ledger</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Post Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset/Service Description</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {walletData.transactions.length > 0 ? (
                  walletData.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6 font-bold text-slate-500 text-xs">
                        {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-8 py-6 font-black text-slate-800 text-[11px] uppercase tracking-wide">
                        {tx.description}
                      </td>
                      <td className={`px-8 py-6 text-right font-black text-sm tracking-tighter ${
                        tx.type === "CREDIT" ? "text-emerald-500" : "text-rose-500"
                      }`}>
                        {tx.type === "CREDIT" ? "+" : "-"} ₹{Number(tx.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-slate-300 font-black text-[10px] uppercase tracking-widest italic">
                      No financial movement recorded in this cycle.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerWallet;