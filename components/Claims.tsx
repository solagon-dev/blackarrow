export default function Claims() {
  const claimSteps = [
    {
      number: "01",
      title: "Report Your Claim",
      description: "Contact us immediately via phone, email, or our online portal to report your claim 24/7."
    },
    {
      number: "02",
      title: "Document Everything",
      description: "Gather all relevant information, photos, and documentation related to your claim."
    },
    {
      number: "03",
      title: "Claims Assessment",
      description: "Our expert team will review your claim and guide you through the assessment process."
    },
    {
      number: "04",
      title: "Resolution & Payment",
      description: "Once approved, we process your claim quickly and ensure you receive your settlement."
    }
  ]

  return (
    <section id="claims" className="py-24 bg-gradient-to-br from-arrow-black via-arrow-charcoal to-arrow-gray relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 border-2 border-arrow-gold transform rotate-45"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-arrow-gold transform -rotate-12"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-arrow-gold text-sm font-semibold tracking-widest uppercase">
            Claims Process
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            Fast & Easy Claims Filing
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            When you need us most, we're here. Our streamlined claims process ensures you get the support and settlement you deserve.
          </p>
        </div>

        {/* Claims Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {claimSteps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white/5 backdrop-blur-sm p-8 h-full border border-arrow-gold/20 hover:border-arrow-gold transition-all duration-300 hover:shadow-2xl hover:shadow-arrow-gold/20">
                <div className="text-6xl font-display font-bold text-arrow-gold/20 mb-4 group-hover:text-arrow-gold/40 transition-colors duration-300">
                  {step.number}
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              {/* Connecting arrow for desktop */}
              {index < claimSteps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg className="w-8 h-8 text-arrow-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-arrow-gold to-yellow-500 p-10 text-center">
          <h3 className="font-display text-3xl font-bold text-arrow-black mb-4">
            Need to File a Claim?
          </h3>
          <p className="text-arrow-charcoal mb-8 max-w-2xl mx-auto">
            Our dedicated claims team is available 24/7 to assist you. File online, call us, or visit your local office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-arrow-black text-white px-8 py-4 font-semibold text-lg hover:bg-arrow-charcoal transition-all duration-300">
              File Claim Online
            </button>
            <button className="border-2 border-arrow-black text-arrow-black px-8 py-4 font-semibold text-lg hover:bg-arrow-black hover:text-white transition-all duration-300">
              Call: 1-800-ARROW-INS
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
