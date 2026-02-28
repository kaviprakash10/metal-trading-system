import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowUpRight,
  Wallet,
  RefreshCcw,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { fetchPortfolio } from "../slice/Portfolioslice";
import { fetchTransactions } from "../slice/Transactionslice";
import { fetchCurrentPrices } from "../slice/Priceslice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    gold,
    silver,
    summary,
    loading: portfolioLoading,
  } = useSelector((state) => state.portfolio);
  const { transactions, loading: transLoading } = useSelector(
    (state) => state.transaction,
  );
  const { current: currentPrices } = useSelector((state) => state.price);

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchTransactions());
    dispatch(fetchCurrentPrices());
  }, [dispatch]);

  const formatDate = () => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (portfolioLoading && !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <Loader2 className="w-10 h-10 animate-spin text-[#BA943A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2924] p-6 md:p-12 font-sans selection:bg-yellow-200">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-baseline gap-4">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#14120D]">
            Dashboard
          </h1>
          <span className="text-[#A3A09A] font-medium hidden sm:inline">
            {formatDate()}
          </span>
        </div>

        <div className="flex items-center gap-6">
          {/* Gold Price */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm"></div>
              <span className="text-[#A3A09A] text-sm font-medium">Gold</span>
            </div>
            <span className="font-serif font-bold text-[#BA943A]">
              {formatCurrency(currentPrices?.gold?.pricePerGram)}
            </span>
          </div>
          {/* Silver Price */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-300 to-purple-200 shadow-sm"></div>
              <span className="text-[#A3A09A] text-sm font-medium">Silver</span>
            </div>
            <span className="font-serif font-bold text-[#6D6B78]">
              {formatCurrency(currentPrices?.silver?.pricePerGram)}
            </span>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-[#14120D] mb-2 flex items-center gap-2">
          Welcome back, {user?.userName || "User"}{" "}
          <span className="text-3xl">👋</span>
        </h2>
        <p className="text-[#88857F] text-lg">
          Here's a snapshot of your portfolio today.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Wallet Balance Card */}
        <div className="bg-[#100C04] text-white rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl shadow-yellow-900/10 min-h-[220px]">
          <div>
            <p className="text-[#8B8470] text-xs font-bold tracking-[0.15em] mb-4">
              WALLET BALANCE
            </p>
            <h3 className="font-serif text-5xl text-[#D8B452] font-semibold mb-6 tracking-tight">
              {formatCurrency(summary?.walletBalance)}
            </h3>
          </div>
          <button className="self-start px-6 py-2.5 rounded-xl border border-[#3E351E] bg-[#1a150a] text-[#cbb061] font-medium hover:bg-[#2A230D] transition-colors shadow-inner flex items-center gap-2">
            <span className="text-lg">+</span> Add Money
          </button>
        </div>

        {/* Total Portfolio Value Card */}
        <div className="bg-white rounded-[2rem] p-8 flex flex-col justify-between shadow-sm border border-[#F2EFEA] min-h-[220px]">
          <div>
            <p className="text-[#A5A196] text-xs font-bold tracking-[0.15em] mb-4">
              TOTAL PORTFOLIO VALUE
            </p>
            <h3 className="font-serif text-5xl text-[#14120D] font-semibold mb-6 tracking-tight">
              {formatCurrency(summary?.totalCurrentValue)}
            </h3>
          </div>
          <div className="flex gap-4 sm:gap-6 pt-2">
            <div>
              <p className="text-[#A5A196] text-xs font-semibold mb-1">
                Invested
              </p>
              <p className="font-semibold text-lg">
                {formatCurrency(summary?.totalInvested)}
              </p>
            </div>
            <div>
              <p className="text-[#A5A196] text-xs font-semibold mb-1">P&L</p>
              <p
                className={`font-semibold text-lg ${summary?.totalPnL >= 0 ? "text-[#25A163]" : "text-[#DE3A44]"}`}
              >
                {summary?.totalPnL >= 0 ? "+" : ""}
                {formatCurrency(summary?.totalPnL)}
              </p>
            </div>
            <div>
              <p className="text-[#A5A196] text-xs font-semibold mb-1">
                Returns
              </p>
              <p
                className={`font-semibold text-xs px-2 py-1 rounded-md mt-1 inline-block ${summary?.totalReturnsPercent >= 0 ? "bg-green-50 text-[#25A163]" : "bg-red-50 text-[#DE3A44]"}`}
              >
                {summary?.totalReturnsPercent >= 0 ? "+" : ""}
                {summary?.totalReturnsPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Gold Holdings Card */}
        <div className="bg-white rounded-[2rem] p-8 flex flex-col justify-between shadow-sm border border-[#F2EFEA] min-h-[220px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[#A5A196] text-xs font-bold tracking-[0.15em] mb-4">
                GOLD HOLDINGS
              </p>
              <h3 className="font-serif text-4xl font-semibold text-[#BA943A]">
                {gold?.grams || 0} <span className="text-2xl">g</span>
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#FFF9EA] flex items-center justify-center p-3 shadow-inner">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md border border-yellow-200"></div>
            </div>
          </div>
          <div className="border-t border-[#F2EFEA] pt-5 mt-auto">
            <div className="flex justify-between">
              <div>
                <p className="text-[#A5A196] text-xs font-semibold mb-1">
                  Value
                </p>
                <p className="font-semibold text-sm">
                  {formatCurrency(gold?.currentValue)}
                </p>
              </div>
              <div>
                <p className="text-[#A5A196] text-xs font-semibold mb-1">P&L</p>
                <p
                  className={`font-semibold text-sm ${gold?.pnl >= 0 ? "text-[#25A163]" : "text-[#DE3A44]"}`}
                >
                  {gold?.pnl >= 0 ? "+" : ""}
                  {formatCurrency(gold?.pnl)}
                </p>
              </div>
              <div>
                <p className="text-[#A5A196] text-xs font-semibold mb-1">
                  Current Rate
                </p>
                <p className="font-semibold text-[#14120D] text-sm">
                  {formatCurrency(gold?.pricePerGram)}/g
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Silver Holdings Card */}
        <div className="bg-white rounded-[2rem] p-8 flex flex-col justify-between shadow-sm border border-[#F2EFEA] min-h-[220px] relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[#A5A196] text-xs font-bold tracking-[0.15em] mb-4">
                SILVER HOLDINGS
              </p>
              <h3 className="font-serif text-4xl font-semibold text-[#8B91A4]">
                {silver?.grams || 0} <span className="text-2xl">g</span>
              </h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#F5F5FA] flex items-center justify-center p-3 shadow-inner">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-purple-300 shadow-md border border-gray-100"></div>
            </div>
          </div>
          <div className="border-t border-[#F2EFEA] pt-5 mt-auto">
            <div className="flex justify-between">
              <div>
                <p className="text-[#A5A196] text-xs font-semibold mb-1">
                  Value
                </p>
                <p className="font-semibold text-sm">
                  {formatCurrency(silver?.currentValue)}
                </p>
              </div>
              <div>
                <p className="text-[#A5A196] text-xs font-semibold mb-1">P&L</p>
                <p
                  className={`font-semibold text-sm ${silver?.pnl >= 0 ? "text-[#25A163]" : "text-[#DE3A44]"}`}
                >
                  {silver?.pnl >= 0 ? "+" : ""}
                  {formatCurrency(silver?.pnl)}
                </p>
              </div>
              <div>
                <p className="text-[#A5A196] text-xs font-semibold mb-1">
                  Current Rate
                </p>
                <p className="font-semibold text-[#14120D] text-sm">
                  {formatCurrency(silver?.pricePerGram)}/g
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Recent Transactions Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Quick Actions */}
        <div className="xl:col-span-3">
          <h4 className="text-[#A5A196] text-xs font-bold tracking-[0.15em] mb-6">
            QUICK ACTIONS
          </h4>
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            <button className="bg-white flex-1 min-w-[100px] p-6 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[#F2EFEA] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm border border-yellow-100"></div>
              <span className="font-medium text-[#14120D] text-center leading-tight">
                Buy
                <br />
                Gold
              </span>
            </button>

            <button className="bg-white flex-1 min-w-[100px] p-6 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[#F2EFEA] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-purple-300 shadow-sm border border-purple-100"></div>
              <span className="font-medium text-[#14120D] text-center leading-tight">
                Buy
                <br />
                Silver
              </span>
            </button>

            <button className="bg-white flex-1 min-w-[100px] p-6 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[#F2EFEA] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#EDF3FC] text-[#3478F6] flex items-center justify-center">
                <ArrowUpRight size={26} strokeWidth={2.5} />
              </div>
              <span className="font-medium text-[#14120D] text-center leading-tight">
                Sell
                <br />
                Gold
              </span>
            </button>

            <button className="bg-white flex-1 min-w-[100px] p-6 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[#F2EFEA] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#EDF3FC] text-[#3478F6] flex items-center justify-center">
                <ArrowUpRight size={26} strokeWidth={2.5} />
              </div>
              <span className="font-medium text-[#14120D] text-center leading-tight">
                Sell
                <br />
                Silver
              </span>
            </button>

            <button className="bg-white flex-1 min-w-[100px] p-6 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[#F2EFEA] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#FFF5EB] text-[#D87D20] flex items-center justify-center">
                <Wallet size={24} strokeWidth={2.5} />
              </div>
              <span className="font-medium text-[#14120D] text-center leading-tight">
                Add
                <br />
                Money
              </span>
            </button>

            <button className="bg-white flex-1 min-w-[100px] p-6 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-[#F2EFEA] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#EDF3FC] text-[#3478F6] flex items-center justify-center">
                <RefreshCcw size={22} strokeWidth={2.5} />
              </div>
              <span className="font-medium text-[#14120D] text-center leading-tight">
                Setup
                <br />
                SIP
              </span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#F2EFEA] h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl font-bold text-[#14120D]">
                Recent Transactions
              </h3>
              <button className="text-[#BA943A] font-medium text-sm flex items-center hover:opacity-80 transition-opacity">
                View All <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {transactions?.length > 0 ? (
                transactions.slice(0, 5).map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-[#F2EFEA] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-[3.25rem] h-[3.25rem] shrink-0 rounded-[14px] flex items-center justify-center p-[11px] ${t.type.includes("GOLD") ? "bg-[#FFF9EA]" : "bg-[#F5F5FA]"}`}
                      >
                        <div
                          className={`w-full h-full rounded-full shadow-sm border ${t.type.includes("GOLD") ? "bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200" : "bg-gradient-to-br from-gray-200 to-purple-300 border-gray-100"}`}
                        ></div>
                      </div>
                      <div>
                        <p className="font-semibold text-[#14120D] tracking-[0.03em] text-[13px] mb-0.5 uppercase">
                          {t.type.replace("_", " ")}
                        </p>
                        <p className="text-[#A5A196] text-[13px]">
                          {t.grams}g &middot; {formatCurrency(t.pricePerGram)}/g
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${t.type.startsWith("BUY") ? "text-[#DE3A44]" : "text-[#25A163]"}`}
                      >
                        {t.type.startsWith("BUY") ? "-" : "+"}
                        {formatCurrency(t.amount)}
                      </p>
                      <p className="text-[#A5A196] text-[13px] mt-0.5">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-[#A5A196]">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
