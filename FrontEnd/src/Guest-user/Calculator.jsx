import { useState, useEffect } from "react";

export default function Calculator() {
  const [mode, setMode] = useState("lump"); // "lump" or "sip"
  const [lumpAmount, setLumpAmount] = useState(50000);
  const [sipAmount, setSipAmount] = useState(5000);
  const [years, setYears] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);

  // Calculations
  const monthlyInvestment = mode === "sip" ? sipAmount : 0;
  const totalInvestment = mode === "lump" 
    ? lumpAmount 
    : sipAmount * years * 12;

  const rate = expectedReturn / 100;
  let futureValue = 0;

  if (mode === "lump") {
    futureValue = Math.round(lumpAmount * Math.pow(1 + rate, years));
  } else {
    // SIP Future Value Formula
    futureValue = Math.round(
      sipAmount * ((Math.pow(1 + rate / 12, years * 12) - 1) / (rate / 12)) * (1 + rate / 12)
    );
  }

  const totalReturns = futureValue - totalInvestment;
  const returnPercentage = totalInvestment > 0 ? Math.round((totalReturns / totalInvestment) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-amber-950 mb-3">
            Gold Returns Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            See how your gold investment can grow over time
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white rounded-2xl p-1 shadow-sm inline-flex">
            <button
              onClick={() => setMode("lump")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${mode === "lump" 
                ? "bg-amber-600 text-white shadow" 
                : "text-gray-600 hover:bg-gray-100"}`}
            >
              Lump Sum
            </button>
            <button
              onClick={() => setMode("sip")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${mode === "sip" 
                ? "bg-amber-600 text-white shadow" 
                : "text-gray-600 hover:bg-gray-100"}`}
            >
              Monthly SIP
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Controls */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-10">
            {mode === "lump" ? (
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                  <span>One-time Investment</span>
                  <span className="font-semibold text-amber-700">₹{lumpAmount.toLocaleString("en-IN")}</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="1000"
                  value={lumpAmount}
                  onChange={(e) => setLumpAmount(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <input
                  type="number"
                  value={lumpAmount}
                  onChange={(e) => setLumpAmount(Number(e.target.value))}
                  className="mt-4 w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-500 text-lg"
                />
              </div>
            ) : (
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                  <span>Monthly Investment</span>
                  <span className="font-semibold text-amber-700">₹{sipAmount.toLocaleString("en-IN")}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="500"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="mt-4 w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-amber-500 text-lg"
                />
              </div>
            )}

            {/* Duration */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                <span>Investment Period</span>
                <span className="font-semibold text-amber-700">{years} Years</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            {/* Expected Return */}
            <div>
              <label className="flex justify-between text-sm font-medium text-gray-700 mb-3">
                <span>Expected Annual Return</span>
                <span className="font-semibold text-amber-700">{expectedReturn}%</span>
              </label>
              <input
                type="range"
                min="6"
                max="20"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative (6%)</span>
                <span>Aggressive (20%)</span>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-amber-600 to-yellow-700 text-white rounded-3xl p-8 md:p-10 h-full flex flex-col">
              <h3 className="text-amber-100 text-lg font-medium mb-8">Your Projection</h3>

              <div className="space-y-8 flex-1">
                <div>
                  <p className="text-amber-200 text-sm">Total Invested</p>
                  <p className="text-4xl font-bold mt-1">₹{totalInvestment.toLocaleString("en-IN")}</p>
                </div>

                <div>
                  <p className="text-amber-200 text-sm">Estimated Future Value</p>
                  <p className="text-5xl font-bold mt-1">₹{futureValue.toLocaleString("en-IN")}</p>
                </div>

                <div className="pt-6 border-t border-amber-400">
                  <p className="text-amber-200 text-sm">Total Profit</p>
                  <p className="text-4xl font-bold text-yellow-200">₹{totalReturns.toLocaleString("en-IN")}</p>
                  <p className="text-sm mt-1 text-amber-100">({returnPercentage}% return)</p>
                </div>
              </div>

              {/* Summary Bar */}
              <div className="mt-10 pt-6 border-t border-amber-400 text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-amber-100">Annualized Return</span>
                  <span className="font-semibold">{expectedReturn}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-100">Investment Mode</span>
                  <span className="font-semibold capitalize">{mode === "lump" ? "Lump Sum" : "SIP"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-gray-500 text-sm mt-10 max-w-md mx-auto">
          This is a simulation based on assumed returns. Past performance is not indicative of future results. 
          Gold prices are volatile.
        </p>
      </div>
    </div>
  );
}