const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Responsive Design",
      description: "Websites that work perfectly on all devices.",
      color: "primary"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Fast Loading Speed",
      description: "Optimized code and images for fast loading performance.",
      color: "accent"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Enhanced Security",
      description: "Latest security technologies including HTTPS, security headers, and spam protection.",
      color: "success"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "24/7 Monitoring",
      description: "Real-time website monitoring with immediate response to issues.",
      color: "warning"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "SEO Optimization",
      description: "Search engine optimization to increase online visibility and attract more visitors.",
      color: "primary"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Customer Support",
      description: "Professional customer support team available anytime to help.",
      color: "accent"
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; hover: string } } = {
      primary: { bg: 'bg-primary-100', text: 'text-primary-600', hover: 'hover:text-primary-700' },
      accent: { bg: 'bg-accent-100', text: 'text-accent-600', hover: 'hover:text-accent-700' },
      success: { bg: 'bg-success-100', text: 'text-success-600', hover: 'hover:text-success-700' },
      warning: { bg: 'bg-warning-100', text: 'text-warning-600', hover: 'hover:text-warning-700' },
    }
    return colorMap[color] || colorMap.primary
  }

  return (
    <section id="features" className="section-padding bg-white relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary-50 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 animate-fade-in-up">
            Core <span className="gradient-text">Features</span> of CloudSitefy
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 text-balance">
            Everything you need to help your small business succeed online
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color)
            return (
              <div 
                key={feature.title} 
                className="card card-hover group animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={colors.text}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold text-secondary-900 mb-4 group-hover:${colors.hover} transition-colors duration-300`}>
                  {feature.title}
                </h3>
                
                <p className="text-secondary-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
