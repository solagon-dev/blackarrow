export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-arrow-charcoal via-arrow-black to-arrow-gray">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-arrow-gold rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-arrow-gold rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="animate-slide-in-right">
            <div className="inline-block mb-6">
              <span className="text-arrow-gold text-sm font-semibold tracking-widest uppercase border-l-4 border-arrow-gold pl-4">
                Precision Protection
              </span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Secure Your
              <span className="block text-arrow-gold">Tomorrow</span>
              <span className="block">Today</span>
            </h1>
            
            <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
              Experience insurance that hits the mark every time. From comprehensive coverage to exceptional service, we deliver precision protection tailored to your unique needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-arrow-gold text-arrow-black px-8 py-4 font-semibold text-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Get Your Free Quote
              </button>
              <button className="border-2 border-white text-white px-8 py-4 font-semibold text-lg hover:bg-white hover:text-arrow-black transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-gray-700">
              <div>
                <div className="text-3xl font-bold text-arrow-gold mb-1">50K+</div>
                <div className="text-gray-400 text-sm">Policies Active</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-arrow-gold mb-1">98%</div>
                <div className="text-gray-400 text-sm">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-arrow-gold mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="hidden lg:block relative animate-fade-in">
            <div className="relative w-full h-[600px]">
              {/* Decorative geometric shapes */}
              <div className="absolute top-0 right-0 w-72 h-72 border-4 border-arrow-gold opacity-20 transform rotate-45"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 border-4 border-white opacity-10 transform -rotate-12"></div>
              
              {/* Main arrow visualization */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M200 50L350 150L200 350L50 150L200 50Z" fill="url(#gold-gradient)" className="animate-pulse" style={{ animationDuration: '3s' }}/>
                  <path d="M200 120L280 180L200 300L120 180L200 120Z" fill="#0A0A0A" fillOpacity="0.8"/>
                  <defs>
                    <linearGradient id="gold-gradient" x1="200" y1="50" x2="200" y2="350" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#D4AF37"/>
                      <stop offset="1" stopColor="#F4D03F" stopOpacity="0.6"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-arrow-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
