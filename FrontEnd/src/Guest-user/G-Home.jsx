export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610374792793-f016b6e2e8c8')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            Invest in <span className="text-yellow-400">Real Gold</span>,<br />
            Digitally.
          </h1>
          <p className="text-2xl text-amber-100 mb-10">
            Secure. Transparent. Profitable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/calculators/sip" className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-10 py-4 rounded-2xl text-lg transition">
              Start Investing
            </a>
            <a href="/about" className="border border-white/70 hover:bg-white/10 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-75">
          <div className="text-2xl font-semibold text-gray-700">RBI Compliant</div>
          <div className="text-2xl font-semibold text-gray-700">100% Secure Vaults</div>
          <div className="text-2xl font-semibold text-gray-700">24×7 Liquidity</div>
          <div className="text-2xl font-semibold text-gray-700">Instant Delivery</div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Choose Luna Gold?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { emoji: "🔒", title: "Bank-Grade Security", desc: "Physical gold stored in insured, audited vaults with full transparency." },
            { emoji: "⚡", title: "Instant Buy & Sell", desc: "Trade digital gold & silver anytime with zero paperwork." },
            { emoji: "📈", title: "Live Market Rates", desc: "Real-time pricing with historical performance tracking." }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-amber-100">
              <div className="text-5xl mb-6">{feature.emoji}</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}   