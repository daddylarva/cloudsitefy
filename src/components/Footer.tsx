const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-secondary-900 to-secondary-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-900/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-900/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold text-primary-400 mb-6 hover:text-primary-300 transition-colors duration-300">
              CloudSitefy
            </h3>
            <p className="text-secondary-300 mb-8 max-w-md leading-relaxed">
              A subscription website management service for small businesses, supporting your online success 
              with professional design and continuous management.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-all duration-300 p-2 rounded-lg hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-300">Services</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Website Design
                </a>
              </li>
              <li>
                <a href="#features" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  SEO Optimization
                </a>
              </li>
              <li>
                <a href="#features" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Maintenance
                </a>
              </li>
              <li>
                <a href="#features" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Hosting Management
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-primary-300">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#contact" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © {currentYear} CloudSitefy. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
