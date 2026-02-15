export default function Coverage() {
  const coverageTypes = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>
      ),
      title: "Auto Insurance",
      description: "Comprehensive protection for your vehicle with collision, liability, and comprehensive coverage options.",
      features: ["Full Coverage", "Roadside Assistance", "Rental Reimbursement"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: "Home Insurance",
      description: "Protect your most valuable asset with coverage for dwelling, personal property, and liability.",
      features: ["Property Coverage", "Liability Protection", "Natural Disaster"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Life Insurance",
      description: "Secure your family's financial future with term life, whole life, and universal life options.",
      features: ["Term Life", "Whole Life", "Flexible Premiums"]
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Business Insurance",
      description: "Tailored coverage for businesses of all sizes, from liability to property and workers' compensation.",
      features: ["General Liability", "Property Coverage", "Workers Comp"]
    }
  ]

  return (
    <section id="coverage" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-arrow-gold text-sm font-semibold tracking-widest uppercase">
            Our Services
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-arrow-black mt-4 mb-6">
            Comprehensive Coverage Solutions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose from our range of specialized insurance products designed to protect what matters most to you.
          </p>
        </div>

        {/* Coverage Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coverageTypes.map((coverage, index) => (
            <div 
              key={index}
              className="group bg-white p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-gray-100 hover:border-arrow-gold"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-arrow-gold to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="text-arrow-black group-hover:text-arrow-gold transition-colors duration-300 mb-6">
                {coverage.icon}
              </div>
              
              <h3 className="font-display text-2xl font-bold text-arrow-black mb-4">
                {coverage.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {coverage.description}
              </p>

              <ul className="space-y-2 mb-6">
                {coverage.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-arrow-gold mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="text-arrow-black group-hover:text-arrow-gold font-semibold inline-flex items-center transition-colors duration-300">
                Learn More
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
