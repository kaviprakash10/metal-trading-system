import AboutImg from "../assets/About.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full Match to Your Image Style */}
      <div className="relative w-full h-screen">
        <img 
          src={AboutImg} 
          alt="Luna Gold - Who We Are" 
          className="w-full h-full object-cover"
        />
        
        {/* Deep Gradient Overlay (matches the dramatic sunset mood) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/75"></div>

        {/* Centered Text - Exactly like your image */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
              Who We Are
            </h1>
            <p className="text-2xl md:text-3xl text-amber-100 max-w-2xl mx-auto font-light">
              Premium Digital Gold Investment Platform
            </p>
            
            {/* Subtle Trust Line */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 text-white text-sm">
                ✨ Since 2023 • Trusted by Thousands
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center">
          <span className="text-xs tracking-widest mb-2">SCROLL TO DISCOVER</span>
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
        </div>
      </div>

      {/* Rest of the Content */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-2xl text-gray-700 leading-relaxed">
            We are making <span className="font-semibold text-amber-600">gold investment</span> 
            simple, secure, and accessible to every Indian.
          </p>
        </div>

        {/* Why Us Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Luna Gold
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-amber-100 group">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h3 className="text-2xl font-semibold mb-4">Bank-Grade Security</h3>
              <p className="text-gray-600">Physical gold stored in secure vaults with full insurance and real-time auditing.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-amber-100 group">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-2xl font-semibold mb-4">Instant Transactions</h3>
              <p className="text-gray-600">Buy, sell, or hold 24×7 with lightning-fast digital gold & silver trading.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-amber-100 group">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform">
                🌟
              </div>
              <h3 className="text-2xl font-semibold mb-4">Complete Transparency</h3>
              <p className="text-gray-600">Every gram is traceable. Live prices. No hidden charges.</p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-4xl font-bold text-amber-950 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            To empower every Indian to build lasting wealth through smart, secure, 
            and responsible investment in gold and silver.
          </p>
        </div>
      </div>
    </div>
  );
}