import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendPhoneVerification, verifyUpdatedPhone } from "../slice/Authslice";

export default function UpdatePhonePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [clientError, setClientError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setClientError("Please enter a valid 10-digit phone number");
      return;
    }

    setClientError("");
    const result = await dispatch(sendPhoneVerification({ phone }));
    if (result.meta.requestStatus === "fulfilled") {
      setStep(2);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setClientError("Please enter the OTP");
      return;
    }

    setClientError("");
    await dispatch(
      verifyUpdatedPhone({
        otp,
        redirect: () => navigate("/user/dashboard"),
      }),
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[32px] shadow-2xl p-10 border border-slate-100">
        <h2 className="text-3xl font-serif font-black text-slate-900 mb-2">
          Verify Phone
        </h2>
        <p className="text-slate-500 font-medium mb-8">
          Please add a verified phone number to continue using Luna Gold.
        </p>

        {(error || clientError) && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold">
            {clientError || error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-amber-500/20 outline-none text-slate-900 font-bold transition-all"
                placeholder="10-digit mobile number"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/20 outline-none text-slate-900 font-bold transition-all text-center tracking-[1em] text-lg"
                placeholder="000000"
                maxLength={6}
              />
              <p className="text-[10px] text-slate-400 font-bold text-center mt-2">
                Sent to {phone} <button type="button" onClick={() => setStep(1)} className="text-amber-600 hover:underline">Change</button>
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
