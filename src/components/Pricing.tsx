const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "99",
      period: "month",
      description: "Basic package for small businesses",
      features: [
        "Responsive website design",
        "5 pages creation",
        "Basic SEO optimization",
        "Email contact form",
        "Mobile optimization",
        "Basic analytics tools"
      ],
      popular: false,
      cta: "Get Started",
      color: "primary"
    },
    {
      name: "Professional",
      price: "199",
      period: "month",
      description: "Premium package for growing businesses",
      features: [
        "All Starter features included",
        "10 pages creation",
        "Advanced SEO optimization",
        "Booking system",
        "Social media integration",
        "Advanced analytics tools",
        "24/7 monitoring",
        "Monthly content updates"
      ],
      popular: true,
      cta: "Most Popular",
      color: "accent"
    },
    {
      name: "Enterprise",
      price: "399",
      period: "month",
      description: "Custom solution for large businesses",
      features: [
        "All Professional features included",
        "Unlimited pages creation",
        "Custom feature development",
        "Advanced security settings",
        "CDN and performance optimization",
        "Dedicated manager",
        "Priority support",
        "Bi-weekly content updates"
      ],
      popular: false,
      cta: "Contact Us",
      color: "success"
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string; button: string } } = {
      primary: { 
        bg: 'bg-primary-50', 
        border: 'border-primary-200', 
        text: 'text-primary-600',
        button: 'btn-primary'
      },
      accent: { 
        bg: 'bg-accent-50', 
        border: 'border-accent-200', 
        text: 'text-accent-600',
        button: 'btn-accent'
      },
      success: { 
        bg: 'bg-success-50', 
        border: 'border-success-200', 
        text: 'text-success-600',
        button: 'btn-primary'
      },
    }
    return colorMap[color] || colorMap.primary
  }

  return (
    <section id="pricing" className="section-padding bg-secondary-50 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 animate-fade-in-up">
            Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 text-balance">
            Choose the optimal plan for your business size. 
            <br className="hidden md:block" />
            We provide services with clear pricing and no hidden costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const colors = getColorClasses(plan.color)
            return (
              <div 
                key={index} 
                className={`relative p-8 rounded-3xl shadow-soft transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular 
                    ? 'bg-white border-2 border-accent-500 scale-105 ring-4 ring-accent-100 shadow-large' 
                    : 'bg-white hover:shadow-large'
                } animate-fade-in-up`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
                    <span className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-glow">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-3">
                    {plan.name}
                  </h3>
                  <p className="text-secondary-600 mb-6">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl md:text-6xl font-extrabold text-secondary-900">
                      ${plan.price}
                    </span>
                    <span className="text-lg text-secondary-600 ml-2">
                      /{plan.period}
                    </span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-accent-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-secondary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  plan.popular
                    ? 'btn-accent shadow-glow hover:shadow-glow-lg'
                    : colors.button
                }`}>
                  {plan.cta}
                </button>
              </div>
            )
          })}
        </div>
        
        <div className="text-center mt-16 animate-fade-in-up animation-delay-500">
          <p className="text-secondary-600 mb-6 text-lg">
            All plans include a 30-day free trial
          </p>
          <button className="btn-primary text-lg px-8 py-4 group">
            <span className="flex items-center space-x-2">
              <span>Start Free Trial</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Pricing
