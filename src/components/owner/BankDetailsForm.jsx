import React, { useState } from "react";
import paymentService from "../../api/paymentService";
import { toast } from "react-toastify";

const BankDetailsForm = ({ ownerEmail, existingDetails, onSave }) => {
  const [formData, setFormData] = useState({
    accountHolderName: existingDetails?.accountHolderName || "",
    accountNumber: existingDetails?.accountNumber || "",
    ifscCode: existingDetails?.ifscCode || "",
    bankName: existingDetails?.bankName || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await paymentService.updateBankDetails(ownerEmail, formData);
      toast.success("Settlement account verified and linked.");
      onSave(); // Refresh parent component
    } catch (err) {
      toast.error("Validation failed. Check account credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* HEADER SECTION */}
      <div className="mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs">
          🏦
        </div>
        <div>
          <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.2em]">Settlement Logic</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define your primary disbursement channel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* ACCOUNT HOLDER */}
        <div className="group">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-600 transition-colors">
            Account Holder Identity
          </label>
          <input
            className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
            placeholder="FULL LEGAL NAME"
            value={formData.accountHolderName}
            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value.toUpperCase() })}
            required
          />
        </div>

        {/* ACCOUNT NUMBER */}
        <div className="group">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-600 transition-colors">
            Account Number (Primary)
          </label>
          <input
            className="w-full bg-slate-50 p-4 rounded-xl font-black text-indigo-600 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all tracking-widest"
            placeholder="0000 0000 0000 00"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            required
          />
        </div>

        {/* IFSC AND BANK NAME GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-600 transition-colors">
              IFSC Routing Code
            </label>
            <input
              className="w-full bg-slate-50 p-4 rounded-xl font-black text-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all uppercase"
              placeholder="SBIN000XXXX"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
              required
            />
          </div>
          <div className="group">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block group-focus-within:text-indigo-600 transition-colors">
              Institution Name
            </label>
            <input
              className="w-full bg-slate-50 p-4 rounded-xl font-bold text-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all"
              placeholder="E.G. HDFC BANK"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value.toUpperCase() })}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`mt-4 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl ${
            isSubmitting 
            ? "bg-slate-100 text-slate-400" 
            : "bg-slate-900 text-white hover:bg-indigo-600 active:scale-95 shadow-indigo-200"
          }`}
        >
          {isSubmitting ? "ENCRYPTING & SAVING..." : "AUTHORIZE SETTLEMENT ACCOUNT"}
        </button>
        
        <p className="text-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">
          By saving, you authorize BEAOWNER to initiate electronic transfers to this account.
        </p>
      </form>
    </div>
  );
};

export default BankDetailsForm;