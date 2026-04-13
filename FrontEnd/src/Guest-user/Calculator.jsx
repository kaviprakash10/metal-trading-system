import { useState, useEffect } from "react";

export default function Calculator() {
  const [mode, setMode] = useState("lump"); // "lump" or "sip"
  const [lumpAmount, setLumpAmount] = useState(50000);
  const [sipAmount, setSipAmount] = useState(5000);
  const [years, setYears] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Calculations
  const monthlyInvestment = mode === "sip" ? sipAmount : 0;
  const totalInvestment = mode === "lump" ? lumpAmount : sipAmount * years * 12;

  const rate = expectedReturn / 100;
  let futureValue = 0;

  if (mode === "lump") {
    futureValue = Math.round(lumpAmount * Math.pow(1 + rate, years));
  } else {
    // SIP Future Value Formula
    futureValue = Math.round(
      sipAmount *
        ((Math.pow(1 + rate / 12, years * 12) - 1) / (rate / 12)) *
        (1 + rate / 12),
    );
  }

  const totalReturns = futureValue - totalInvestment;
  const returnPercentage =
    totalInvestment > 0
      ? Math.round((totalReturns / totalInvestment) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50/30 py-16 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-amber-950 tracking-tight">
            Gold{" "}
            <span className="text-amber-600 font-serif italic">Returns</span>{" "}
            Calculator
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Visualize your path to wealth. Our smart projection tool helps you
            plan your gold and silver future.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center p-1 animate-slide-up">
          <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-1.5 shadow-xl shadow-amber-900/5 inline-flex border border-amber-100/50">
            <button
              onClick={() => setMode("lump")}
              className={`px-10 py-4 rounded-[20px] font-bold transition-all duration-300 ${
                mode === "lump"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20 scale-105"
                  : "text-gray-500 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              Lump Sum
            </button>
            <button
              onClick={() => setMode("sip")}
              className={`px-10 py-4 rounded-[20px] font-bold transition-all duration-300 ${
                mode === "sip"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20 scale-105"
                  : "text-gray-500 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              Monthly SIP
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Input Controls */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-sm rounded-[44px] shadow-2xl shadow-amber-900/5 p-10 md:p-14 space-y-12 border border-white animate-slide-up [animation-delay:200ms]">
            {mode === "lump" ? (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-semibold text-gray-800">
                    One-time Investment
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-700">
                      ₹{lumpAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="1000"
                  value={lumpAmount}
                  onChange={(e) => setLumpAmount(Number(e.target.value))}
                  className="w-full h-3 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
                <input
                  type="number"
                  value={lumpAmount}
                  onChange={(e) => setLumpAmount(Number(e.target.value))}
                  className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-xl font-medium transition-all"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-semibold text-gray-800">
                    Monthly Investment
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-700">
                      ₹{sipAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="500"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full h-3 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
                <input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white text-xl font-medium transition-all"
                />
              </div>
            )}

            {/* Duration */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-lg font-semibold text-gray-800">
                  Investment Period
                </span>
                <span className="text-3xl font-black text-amber-700">
                  {years}{" "}
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                    Years
                  </span>
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-3 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-600"
              />
            </div>

            {/* Expected Return */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-lg font-semibold text-gray-800">
                  Expected Annual Return
                </span>
                <span className="text-3xl font-black text-amber-700">
                  {expectedReturn}%
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="20"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-3 bg-amber-100 rounded-full appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-xs text-gray-400 font-medium uppercase tracking-tighter">
                <span>Conservative (6%)</span>
                <span>Optimistic (20%)</span>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-5 animate-slide-up [animation-delay:400ms]">
            <div className="bg-gradient-to-br from-amber-500 via-amber-550 to-amber-600 text-white rounded-[44px] p-10 md:p-14 h-full flex flex-col relative overflow-hidden shadow-2xl shadow-amber-950/20">
              {/* Decorative background element */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-amber-400/80 text-sm font-bold uppercase tracking-[0.2em] mb-12">
                  Growth Projection
                </h3>

                <div className="space-y-12 flex-1">
                  <div className="space-y-1">
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                      Total Money Invested
                    </p>
                    <p className="text-4xl md:text-5xl font-black font-sans tracking-tight text-white">
                      ₹{totalInvestment.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                      Estimated Portfolio Value
                    </p>
                    <p className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500">
                      ₹{futureValue.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="pt-10 border-t border-white/10 space-y-2">
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                      Total Wealth Gained
                    </p>
                    <p className="text-4xl font-black text-green-400">
                      +₹{totalReturns.toLocaleString("en-IN")}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-bold">
                      {returnPercentage}% Growth
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center text-sm font-medium text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="uppercase tracking-widest">
                      {mode} Plan
                    </span>
                  </div>
                  <span className="bg-white/5 px-4 py-1.5 rounded-full text-white/80">
                    {years}YR Horizon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-3xl p-8 text-center animate-fade-in [animation-delay:600ms]">
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto italic">
            "Gold is the money of kings." This simulation uses compound interest
            models. Real world returns depend on actual market performance and
            metal price fluctuations. Always consult with a financial advisor
            before making large investments.
          </p>
        </div>
      </div>
    </div>
  );
}
