import AboutImg from "../assets/About.png";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <img 
          src={AboutImg} 
          alt="Luna Gold - Who We Are" 
          className="w-full h-full object-cover animate-scale-in"
        />
        
        {/* Overlay with subtle animation */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 transition-opacity duration-1000"></div>

        {/* Centered Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6 animate-fade-in">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-7xl md:text-9xl font-bold text-white tracking-tighter mb-4 drop-shadow-2xl animate-slide-up">
              Heritage <span className="text-amber-500">&</span> Vision
            </h1>
            <p className="text-2xl md:text-4xl text-amber-100/80 max-w-2xl mx-auto font-light italic animate-slide-up [animation-delay:200ms]">
              Crafting India's digital gold future since 2023.
            </p>
            
            <div className="mt-12 flex justify-center animate-slide-up [animation-delay:400ms]">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-10 py-4 rounded-full border border-white/10 text-white text-lg font-medium hover:bg-white/10 transition-all cursor-default">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                Trusted by 50,000+ Investors
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/50 flex flex-col items-center animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.4em] mb-4">Explore our legacy</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent"></div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 space-y-32">
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-slide-up">
           <span className="text-amber-600 font-bold uppercase tracking-widest text-sm">Our Philosophy</span>
           <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
             Democratizing Gold for <br/> <span className="italic font-serif text-amber-700">Modern India</span>
           </h2>
           <p className="text-2xl text-gray-500 leading-relaxed font-light">
            We believe that wealth preservation shouldn't be complicated. By combining 
            <span className="text-gray-900 font-medium"> traditional trust </span> 
            with 
            <span className="text-gray-900 font-medium"> cutting-edge technology</span>,
            we've created a platform where anyone can start their gold journey with just ₹10.
          </p>
        </div>

        {/* Why Us Cards with staggered animations */}
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { 
              emoji: "🛡️", 
              title: "Unrivaled Security", 
              desc: "Your assets are stored in SEBI-regulated, bank-grade vaults with 100% insurance coverage." 
            },
            { 
              emoji: "⚡", 
              title: "Real-time Access", 
              desc: "Buy, sell, or request physical delivery 24×7. Your gold is always just a click away." 
            },
            { 
              emoji: "💎", 
              title: "Absolute Purity", 
              desc: "We only deal in 24K (99.9%) pure gold and 99.9% pure silver, certified and traceable." 
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group bg-gray-50 p-12 rounded-[50px] border border-transparent hover:border-amber-200 hover:bg-white hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-20 h-20 bg-amber-100/50 text-amber-600 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                {feature.emoji}
              </div>
              <h3 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 text-lg leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="relative group overflow-hidden bg-amber-950 rounded-[60px] p-20 md:p-32 text-center text-white">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] group-hover:bg-amber-500/20 transition-all duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px]"></div>
          
          <div className="relative z-10 space-y-8 animate-slide-up">
            <h2 className="text-5xl md:text-7xl font-bold mb-6">Our Mission</h2>
            <p className="text-2xl md:text-3xl text-amber-100/80 max-w-4xl mx-auto font-light leading-relaxed">
              To empower every Indian home with the ability to build and protect wealth 
              through the most secure digital investment platform for precious metals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}