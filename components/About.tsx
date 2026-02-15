export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="text-arrow-gold text-sm font-semibold tracking-widest uppercase border-l-4 border-arrow-gold pl-4">
              About BlackArrow
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-arrow-black mt-6 mb-6 leading-tight">
              Precision, Trust, and
              <span className="block text-arrow-gold">Excellence</span>
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                At BlackArrow Insurance, we believe insurance should be as precise as an arrow hitting its mark. Founded on principles of accuracy, reliability, and unwavering commitment to our clients, we've been protecting families and businesses for over two decades.
              </p>
              
              <p>
                Our approach combines cutting-edge technology with personalized service, ensuring that every policy we write is tailored to meet your exact needs. We don't just sell insurance—we build lasting relationships based on trust and exceptional service.
              </p>
              
              <p>
                With a team of experienced professionals and partnerships with leading insurance carriers, we have the expertise and resources to provide comprehensive coverage solutions that give you peace of mind.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8">
              <div className="gold-accent-line pl-6">
                <div className="text-4xl font-bold text-arrow-black mb-2">20+</div>
                <div className="text-gray-600">Years of Experience</div>
              </div>
              <div className="gold-accent-line pl-6">
                <div className="text-4xl font-bold text-arrow-black mb-2">A+</div>
                <div className="text-gray-600">Rating with BBB</div>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-arrow-charcoal to-arrow-black p-8 text-white">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-arrow-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Licensed & Certified</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    All our agents are fully licensed and certified, with ongoing training to stay current with industry best practices.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-arrow-charcoal to-arrow-black p-8 text-white">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-arrow-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Award-Winning Service</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Recognized nationally for our exceptional customer service and innovative insurance solutions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-arrow-charcoal to-arrow-black p-8 text-white">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-arrow-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-2">Trusted Protection</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Partnered with top-rated insurance carriers to ensure your claims are handled efficiently and fairly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
