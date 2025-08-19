import { useState } from 'react'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  honeypot: string
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    honeypot: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.')
      return false
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email format.')
      return false
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your phone number.')
      return false
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your message.')
      return false
    }
    if (formData.honeypot) {
      // Honeypot field has value, consider it a bot
      setErrorMessage('Invalid access detected.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          message: formData.message,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: await getClientIP()
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: '',
          honeypot: ''
        })
      } else {
        const errorData = await response.json()
        setSubmitStatus('error')
        setErrorMessage(errorData.message || 'Failed to send. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  }

  return (
    <section id="contact" className="section-padding bg-white relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-accent-50 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
      </div>

      <div className="max-w-4xl mx-auto container-padding relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 animate-fade-in-up">
            Get Free <span className="gradient-text">Consultation</span>
          </h2>
          <p className="text-xl text-secondary-600 animate-fade-in-up animation-delay-200 text-balance">
            Have questions about CloudSitefy services? Contact us anytime.
            <br className="hidden md:block" />
            Our expert consultants will respond quickly.
          </p>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-3xl p-8 md:p-12 shadow-soft animate-fade-in-up animation-delay-300">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="animate-fade-in-up animation-delay-400">
                <label htmlFor="name" className="block text-sm font-semibold text-secondary-700 mb-3">
                  Name <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                  required
                  aria-required="true"
                />
              </div>

              <div className="animate-fade-in-up animation-delay-500">
                <label htmlFor="email" className="block text-sm font-semibold text-secondary-700 mb-3">
                  Email <span className="text-error-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="example@email.com"
                  required
                  aria-required="true"
                />
              </div>

              <div className="animate-fade-in-up animation-delay-600">
                <label htmlFor="phone" className="block text-sm font-semibold text-secondary-700 mb-3">
                  Phone <span className="text-error-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1-234-567-8900"
                  required
                  aria-required="true"
                />
              </div>

              <div className="animate-fade-in-up animation-delay-700">
                <label htmlFor="company" className="block text-sm font-semibold text-secondary-700 mb-3">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Company Name (Optional)"
                />
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-800">
              <label htmlFor="service" className="block text-sm font-semibold text-secondary-700 mb-3">
                Service of Interest
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Please select a service</option>
                <option value="starter">Starter ($99/month)</option>
                <option value="professional">Professional ($199/month)</option>
                <option value="enterprise">Enterprise ($399/month)</option>
                <option value="custom">Custom Service</option>
                <option value="consultation">Consultation Only</option>
              </select>
            </div>

            <div className="animate-fade-in-up animation-delay-900">
              <label htmlFor="message" className="block text-sm font-semibold text-secondary-700 mb-3">
                Message <span className="text-error-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="input-field resize-none"
                placeholder="Please provide details about your inquiry..."
                required
                aria-required="true"
              />
            </div>

            {/* Honeypot field - bot prevention */}
            <div className="hidden">
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
            </div>

            {/* Error message */}
            {submitStatus === 'error' && (
              <div className="bg-error-50 border border-error-200 rounded-xl p-4 animate-fade-in-up" role="alert">
                <p id="error-message" className="text-error-600 text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Success message */}
            {submitStatus === 'success' && (
              <div className="bg-success-50 border border-success-200 rounded-xl p-4 animate-fade-in-up" role="status" aria-live="polite">
                <p className="text-success-600 text-sm flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your message has been sent successfully. We will respond shortly.
                </p>
              </div>
            )}

            <div className="text-center animate-fade-in-up animation-delay-1000">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-describedby={submitStatus === 'error' ? 'error-message' : undefined}
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Send Message</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            <div className="text-center animate-fade-in-up animation-delay-1100">
              <p className="text-sm text-secondary-500">
                Personal information is used only for inquiry processing and will be deleted immediately after completion.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
