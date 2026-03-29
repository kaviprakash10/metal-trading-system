export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">We're here to help you with your gold journey</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-8">Send us a Message</h2>
            <form className="space-y-6">
              <input type="text" placeholder="Your Name" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500" />
              <input type="email" placeholder="Email Address" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500" />
              <input type="tel" placeholder="Phone Number" className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:border-amber-500" />
              <textarea placeholder="How can we help you?" rows={5} className="w-full px-5 py-4 rounded-3xl border border-gray-200 focus:outline-none focus:border-amber-500"></textarea>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 rounded-2xl transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-6 text-gray-600">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-medium">Luna Gold Pvt Ltd</p>
                    <p>Coimbatore, Tamil Nadu, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p>+91 98765 43210</p>
                    <p>support@lunagold.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🕒</span>
                  <div>
                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-3xl">
              <p className="font-medium text-amber-900">Have questions about investing?</p>
              <p className="text-amber-700 mt-2">Our experts are just a call away.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}