import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowUpRight,
  Wallet,
  RefreshCcw,
  ChevronRight,
  Loader2,
  CirclePlay,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { fetchPortfolio } from "../slice/Portfolioslice";
import { fetchTransactions } from "../slice/Transactionslice";
import { fetchCurrentPrices } from "../slice/Priceslice";
import UserLayout from "./userLayout";
import { Link } from "react-router-dom";

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
    <UserLayout>
      <div className="min-h-screen bg-[#FDFBF7] text-[#2C2924] p-6 lg:p-12 font-sans selection:bg-yellow-100">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#14120D]">
              Dashboard
            </h1>
            <span className="text-[#A3A09A] font-medium text-sm sm:text-base">
              {formatDate()}
            </span>
          </div>

          <div className="flex items-center gap-8 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-[#F2EFEA]">
            {/* Gold Price */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-sm border border-yellow-200"></div>
                <span className="text-[#88857F] text-xs font-bold tracking-wider uppercase">
                  Gold
                </span>
              </div>
              <span className="font-serif font-bold text-[#BA943A] text-lg">
                {formatCurrency(currentPrices?.gold?.pricePerGram)}
              </span>
            </div>
            {/* Silver Price */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gray-300 to-purple-200 shadow-sm border border-gray-200"></div>
                <span className="text-[#88857F] text-xs font-bold tracking-wider uppercase">
                  Silver
                </span>
              </div>
              <span className="font-serif font-bold text-[#6D6B78] text-lg">
                {formatCurrency(currentPrices?.silver?.pricePerGram)}
              </span>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl lg:text-4xl font-serif font-semibold text-[#14120D] mb-2 flex items-center gap-3">
            Welcome back, {user?.userName || "Investor"}{" "}
            <span className="animate-bounce-slow">👋</span>
          </h2>
          <p className="text-[#88857F] text-lg font-medium opacity-80">
            Here's a snapshot of your portfolio today.
          </p>
        </div>

        {/* Major Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {/* Wallet Balance Card */}
          <div className="bg-[#100C04] text-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-2xl shadow-yellow-900/10 min-h-[240px] border border-white/5 group">
            <div>
              <p className="text-[#8B8470] text-xs font-bold tracking-[0.2em] mb-4 uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                WALLET BALANCE
              </p>
              <h3 className="font-serif text-5xl text-[#D8B452] font-bold mb-6 tracking-tight">
                {formatCurrency(summary?.walletBalance)}
              </h3>
            </div>
            <Link
              to="/user/wallet"
              className="self-start px-6 py-3 rounded-xl border border-[#3E351E] bg-[#1a150a] text-[#BA943A] font-bold hover:bg-[#BA943A] hover:text-[#100C04] transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add Money
            </Link>
          </div>

          {/* Total Portfolio Value Card */}
          <div className="bg-white rounded-[2.5rem] p-8 flex flex-col justify-between shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#F2EFEA] min-h-[240px]">
            <div>
              <p className="text-[#A5A196] text-xs font-bold tracking-[0.2em] mb-4 uppercase">
                TOTAL PORTFOLIO VALUE
              </p>
              <h3 className="font-serif text-5xl text-[#14120D] font-bold mb-6 tracking-tight">
                {formatCurrency(summary?.totalCurrentValue)}
              </h3>
            </div>
            <div className="flex gap-4 sm:gap-6 pt-4 border-t border-[#F7F5F0]">
              <div>
                <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-1 uppercase">
                  Invested
                </p>
                <p className="font-bold text-base text-[#14120D]">
                  {formatCurrency(summary?.totalInvested)}
                </p>
              </div>
              <div>
                <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-1 uppercase">
                  P&L
                </p>
                <p
                  className={`font-bold text-base ${summary?.totalPnL >= 0 ? "text-[#25A163]" : "text-[#DE3A44]"}`}
                >
                  {summary?.totalPnL >= 0 ? "+" : ""}
                  {formatCurrency(summary?.totalPnL)}
                </p>
              </div>
              <div>
                <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-1 uppercase">
                  Returns
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${summary?.totalReturnsPercent >= 0 ? "bg-[#E6F4EA] text-[#25A163]" : "bg-[#FCE8E8] text-[#DE3A44]"}`}
                >
                  {summary?.totalReturnsPercent >= 0 ? "+" : ""}
                  {summary?.totalReturnsPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Gold Holdings Card */}
          <div className="bg-white rounded-[2.5rem] p-8 flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#F2EFEA] min-h-[240px] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[#A5A196] text-xs font-bold tracking-[0.2em] mb-4 uppercase">
                  GOLD HOLDINGS
                </p>
                <h3 className="font-serif text-5xl font-bold text-[#BA943A] tracking-tight">
                  {gold?.grams || 0}{" "}
                  <span className="text-3xl font-medium text-[#A3A09A]">g</span>
                </h3>
              </div>
              <div className="w-16 h-16 rounded-[1.25rem] bg-[#FFF9EA] flex items-center justify-center p-4 shadow-inner group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md border border-yellow-200"></div>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-[#F7F5F0]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-0.5 uppercase">
                    Current Value
                  </p>
                  <p className="font-bold text-sm text-[#14120D]">
                    {formatCurrency(
                      gold?.totalCurrentValue || gold?.currentValue,
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-0.5 uppercase">
                    P&L
                  </p>
                  <p
                    className={`font-bold text-sm ${gold?.pnl >= 0 ? "text-[#25A163]" : "text-[#DE3A44]"}`}
                  >
                    {gold?.pnl >= 0 ? "+" : ""}
                    {formatCurrency(gold?.pnl)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-0.5 uppercase">
                    Rate
                  </p>
                  <p className="font-bold text-sm text-[#14120D]">
                    {formatCurrency(gold?.pricePerGram)}/g
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Silver Holdings Card */}
          <div className="bg-white rounded-[2.5rem] p-8 flex flex-col shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#F2EFEA] min-h-[240px] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[#A5A196] text-xs font-bold tracking-[0.2em] mb-4 uppercase">
                  SILVER HOLDINGS
                </p>
                <h3 className="font-serif text-5xl font-bold text-[#6D6B78] tracking-tight">
                  {silver?.grams || 0}{" "}
                  <span className="text-3xl font-medium text-[#A3A09A]">g</span>
                </h3>
              </div>
              <div className="w-16 h-16 rounded-[1.25rem] bg-[#F5F5FA] flex items-center justify-center p-4 shadow-inner group-hover:scale-110 transition-transform">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-purple-300 shadow-md border border-gray-100"></div>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-[#F7F5F0]">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-0.5 uppercase">
                    Current Value
                  </p>
                  <p className="font-bold text-sm text-[#14120D]">
                    {formatCurrency(
                      silver?.totalCurrentValue || silver?.currentValue,
                    )}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-0.5 uppercase">
                    P&L
                  </p>
                  <p
                    className={`font-bold text-sm ${silver?.pnl >= 0 ? "text-[#25A163]" : "text-[#DE3A44]"}`}
                  >
                    {silver?.pnl >= 0 ? "+" : ""}
                    {formatCurrency(silver?.pnl)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mb-0.5 uppercase">
                    Rate
                  </p>
                  <p className="font-bold text-sm text-[#14120D]">
                    {formatCurrency(silver?.pricePerGram)}/g
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          {/* Quick Actions */}
          <div className="xl:col-span-3">
            <h4 className="text-[#A5A196] text-xs font-bold tracking-[0.2em] mb-8 uppercase">
              QUICK ACTIONS
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Buy Gold", icon: "gold-dot", to: "/user/buy/gold" },
                {
                  label: "Buy Silver",
                  icon: "silver-dot",
                  to: "/user/buy/silver",
                },
                {
                  label: "Sell Gold",
                  icon: ArrowUpRight,
                  to: "/user/sell/gold",
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                },
                {
                  label: "Sell Silver",
                  icon: ArrowUpRight,
                  to: "/user/sell/silver",
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                },
                {
                  label: "Add Money",
                  icon: Wallet,
                  to: "/user/wallet",
                  bg: "bg-orange-50",
                  color: "text-orange-600",
                },
                {
                  label: "Setup SIP",
                  icon: RefreshCcw,
                  to: "/user/sip",
                  bg: "bg-indigo-50",
                  color: "text-indigo-600",
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="bg-white p-6 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F2EFEA] hover:-translate-y-2 hover:shadow-xl hover:border-[#BA943A]/30 transition-all duration-300"
                >
                  {action.icon === "gold-dot" ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md border border-yellow-200"></div>
                  ) : action.icon === "silver-dot" ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-purple-300 shadow-md border border-gray-100"></div>
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center`}
                    >
                      <action.icon size={26} strokeWidth={2.5} />
                    </div>
                  )}
                  <span className="font-bold text-[#14120D] text-[13px] text-center leading-tight">
                    {action.label.split(" ").map((word, idx) => (
                      <React.Fragment key={idx}>
                        {word} <br />
                      </React.Fragment>
                    ))}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-[#F2EFEA] flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-serif text-2xl font-bold text-[#14120D]">
                  Recent Transactions
                </h3>
                <Link
                  to="/user/transactions"
                  className="text-[#BA943A] font-bold text-sm flex items-center gap-1 group"
                >
                  View All{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

              <div className="space-y-4">
                {transactions?.length > 0 ? (
                  transactions.slice(0, 4).map((t) => (
                    <div
                      key={t._id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-[#F2EFEA] hover:bg-[#FDFBF7] transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center p-3 shadow-inner ${t.type.includes("GOLD") ? "bg-[#FFF9EA]" : "bg-[#F5F5FA]"}`}
                        >
                          <div
                            className={`w-full h-full rounded-full border ${t.type.includes("GOLD") ? "bg-gradient-to-br from-yellow-300 to-yellow-500 border-yellow-200" : "bg-gradient-to-br from-gray-200 to-purple-300 border-gray-100"}`}
                          ></div>
                        </div>
                        <div>
                          <p className="font-bold text-[#14120D] text-[14px] uppercase tracking-wide">
                            {t.type.replace("_", " ")}
                          </p>
                          <p className="text-[#A5A196] text-xs font-medium mt-0.5">
                            {t.grams}g &bull; {formatCurrency(t.pricePerGram)}/g
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-base ${t.type.startsWith("BUY") ? "text-[#DE3A44]" : "text-[#25A163]"}`}
                        >
                          {t.type.startsWith("BUY") ? "-" : "+"}
                          {formatCurrency(t.amount)}
                        </p>
                        <p className="text-[#A5A196] text-[10px] font-bold tracking-wider mt-1 uppercase">
                          {new Date(t.createdAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 opacity-40">
                    <ClipboardList size={40} className="mb-2" />
                    <p className="font-medium">No transactions yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
