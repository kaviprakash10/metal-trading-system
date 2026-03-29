export default function Home() {
  return (
    <div className="space-y-24 mb-20">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1610374792793-f016b6e2e8c8')] bg-cover bg-center transition-transform duration-[10s] hover:scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-400/10 backdrop-blur-md border border-yellow-400/20 text-yellow-500 text-sm font-semibold tracking-widest uppercase mb-4 animate-slide-up">
            New Era of Wealth
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-white leading-[1.1] mb-6 animate-slide-up [animation-delay:200ms]">
            Invest in{" "}
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-sm">
              Real Gold
            </span>
            ,<br />
            Seamlessly.
          </h1>

          <p className="text-xl md:text-2xl text-amber-100/80 mb-10 max-w-2xl mx-auto font-light animate-slide-up [animation-delay:400ms]">
            Secure your future with the world's most trusted asset. Audited,
            insured, and 100% physically backed.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up [animation-delay:600ms]">
            <a
              href="/calculators/sip"
              className="group relative bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-12 py-5 rounded-2xl text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95"
            >
              Start Your SIP
              <span className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></span>
            </a>
            <a
              href="/about"
              className="px-12 py-5 rounded-2xl text-lg font-semibold text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 hover:border-white transition-all duration-300 active:scale-95"
            >
              How it works
            </a>
          </div>
        </div>

        {/* Floating Element for visual flair */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-float [animation-delay:2s]"></div>
      </div>

      {/* Trust Bar with enhanced styling */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white/50 backdrop-blur-xl border border-amber-100 rounded-[40px] p-10 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-x-12 gap-y-8">
            {[
              { label: "RBI Compliant", icon: "🏛️" },
              { label: "100% Secure Vaults", icon: "💎" },
              { label: "24×7 Instant Liquidity", icon: "💸" },
              { label: "Physical Delivery", icon: "📦" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300">
                  {item.icon}
                </span>
                <span className="text-lg font-medium text-gray-500 group-hover:text-amber-900 transition-colors uppercase tracking-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Luna Gold? */}
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4 animate-fade-in">
          <span className="text-amber-600 font-bold uppercase tracking-widest text-sm">
            Key Advantages
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">
            Why Luna <span className="text-amber-600">Gold</span>?
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Experience a transparent, secure, and rewarding investment journey
            designed for the modern era.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              emoji: "🛡️",
              title: "Bank-Grade Security",
              desc: "Your gold is stored in SEBI-regulated, bank-grade vaults with 100% insurance coverage by global leaders.",
              gradient: "from-amber-50 to-orange-50",
            },
            {
              emoji: "⚡",
              title: "Instant Liquidity",
              desc: "Buy, sell, or request physical delivery 24×7. Your funds are always just a click away.",
              gradient: "from-yellow-50 to-amber-50",
            },
            {
              emoji: "💎",
              title: "Absolute Purity",
              desc: "We only deal in 24K (99.9%) pure gold and 99.9% pure silver, certified and traceable.",
              gradient: "from-orange-50 to-yellow-50",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`group bg-gradient-to-br ${feature.gradient} p-12 rounded-[50px] border border-transparent hover:border-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-4`}
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                {feature.emoji}
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900 group-hover:text-amber-800 transition-colors tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                {feature.desc}
              </p>

              <div className="mt-10 overflow-hidden h-1 bg-white/50 rounded-full">
                <div className="h-full bg-amber-500 w-0 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Your Journey Steps */}
      <div className="bg-gray-900 py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.05),transparent)]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 animate-slide-up">
              <div className="space-y-4">
                <span className="text-amber-500 font-bold uppercase tracking-widest text-sm">
                  Onboarding
                </span>
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
                  Your Gold <br /> Journey{" "}
                  <span className="text-amber-500 font-serif italic">
                    Begins
                  </span>{" "}
                  Here
                </h2>
              </div>

              <div className="space-y-10">
                {[
                  {
                    step: "01",
                    title: "Instant Verification",
                    desc: "Complete your KYC in under 60 seconds with our seamless API integration.",
                  },
                  {
                    step: "02",
                    title: "Setup Your Plan",
                    desc: "Start with a lump sum or automate your savings with a Monthly SIP from just ₹500.",
                  },
                  {
                    step: "03",
                    title: "Build Real Wealth",
                    desc: "Watch your portfolio grow with real-time price updates and secure automated vaulting.",
                  },
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-8 group">
                    <div className="text-4xl font-black text-amber-500/20 group-hover:text-amber-500 transition-colors duration-500">
                      {s.step}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold text-white tracking-tight">
                        {s.title}
                      </h4>
                      <p className="text-gray-400 font-light text-lg">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in [animation-delay:400ms]">
              <div className="absolute inset-0 bg-amber-500/20 rounded-[60px] blur-3xl transform rotate-6"></div>
              <div className="bg-gradient-to-br from-amber-800 to-black p-12 md:p-20 rounded-[60px] border border-white/10 shadow-3xl text-center space-y-10 relative z-10">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 group hover:bg-amber-500/10 transition-colors">
                  <span className="text-5xl group-hover:scale-110 transition-transform">
                    🔒
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-white">
                  Join 50,000+ Investors
                </h3>
                <p className="text-gray-400 text-lg font-light leading-relaxed">
                  Ready to start building your precious metal portfolio? Open
                  your vault today.
                </p>
                <div className="flex flex-col gap-4">
                  <a
                    href="/register"
                    className="bg-amber-500 text-black font-black py-5 rounded-[24px] text-xl shadow-xl shadow-amber-500/20 hover:bg-amber-400 hover:-translate-y-1 transition-all active:scale-95"
                  >
                    Open Free Account
                  </a>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-bold">
                    No hidden charges • No paperwork
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
