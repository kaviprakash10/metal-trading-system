export default function Contact() {
  return (
    <div className="min-h-screen bg-white py-24 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
            Let's <span className="text-amber-600">Connect</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light">
            Whether you're a first-time investor or a seasoned professional, 
            our team is here to guide your gold journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[40px] shadow-2xl shadow-amber-900/5 p-10 md:p-12 border border-amber-50 animate-slide-up">
            <h2 className="text-3xl font-bold mb-10 text-gray-900">Send a Message</h2>
            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none appearance-none">
                  <option>General Inquiry</option>
                  <option>Investment Support</option>
                  <option>Physical Delivery</option>
                  <option>Technical Issue</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea placeholder="Tell us how we can help..." rows={5} className="w-full px-6 py-4 rounded-3xl bg-gray-50 border-transparent focus:bg-white focus:border-amber-500/30 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none resize-none"></textarea>
              </div>

              <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-5 rounded-2xl shadow-xl shadow-amber-600/20 transform transition-all active:scale-95 hover:-translate-y-1">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-12 animate-slide-up [animation-delay:200ms]">
            <div className="space-y-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Information</h3>
              
              {[
                { icon: "📍", title: "Corporate Office", detail: "Luna Gold Towers, Race Course, Coimbatore, TN 641018" },
                { icon: "📞", title: "Support Line", detail: "+91 (0422) 488 9000" },
                { icon: "✉️", title: "Email Us", detail: "hello@lunagold.in" }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-amber-100 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-gray-500 leading-relaxed font-light">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-10 rounded-[40px] bg-gradient-to-br from-amber-900 to-black text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
               <p className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-4">Enterprise Inquiries</p>
               <h4 className="text-2xl font-bold mb-4 leading-tight">Looking for large-scale procurement?</h4>
               <p className="text-gray-400 font-light mb-8">Talk to our institutional desk for bulk digital and physical gold solutions.</p>
               <button className="text-amber-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all uppercase tracking-widest text-sm">
                 Learn More <span>→</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}