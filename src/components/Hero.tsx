const Hero = () => {
  const features = [
    {
      icon: (
        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Professional Design",
      description: "Custom website design that matches your brand",
      color: "primary"
    },
    {
      icon: (
        <svg className="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Fast Performance",
      description: "Optimized performance for fast loading speeds",
      color: "accent"
    },
    {
      icon: (
        <svg className="w-10 h-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Continuous Management",
      description: "Regular updates and maintenance",
      color: "success"
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: "from-primary-100 to-primary-200 text-primary-600",
      accent: "from-accent-100 to-accent-200 text-accent-600",
      success: "from-success-100 to-success-200 text-success-600"
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.primary
  }

  return (
    <section className="bg-gradient-to-b from-white via-primary-50/40 to-white section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-200"></div>
      </div>
      
      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-secondary-900 mb-8 leading-tight animate-fade-in-up">
            Subscription Website Management Service
            <span className="gradient-text block mt-2">for Small Businesses</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary-600 mb-10 leading-relaxed animate-fade-in-up animation-delay-200 text-balance">
            Enhance your online presence with professional website design and continuous management
            <br className="hidden md:block" />
            to help your business succeed online
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up animation-delay-300">
            <button className="btn-primary text-lg px-8 py-4 group">
              <span className="flex items-center space-x-2">
                <span>Get Free Consultation</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            <button className="btn-outline text-lg px-8 py-4 group">
              <span className="flex items-center space-x-2">
                <span>Explore Services</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div key={feature.title} className={`p-6 animate-fade-in-up animation-delay-${(index + 1) * 100} group`}>
                <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
