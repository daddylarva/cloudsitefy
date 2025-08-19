import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Pricing from './components/Pricing'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false)

  // 간단한 어드민 모드 토글 (실제 프로덕션에서는 JWT 토큰 기반 인증 사용)
  const toggleAdminMode = () => {
    const password = prompt('Enter admin password:')
    if (password === 'Impulse9@') {
      setIsAdminMode(!isAdminMode)
    } else {
      alert('Invalid password')
    }
  }

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">CloudSitefy Admin</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleAdminMode}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Exit Admin Mode
                </button>
              </div>
            </div>
          </div>
        </div>
        <AdminPanel />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <ContactForm />
      </main>
      <Footer />
      
      {/* Admin Access Button (Hidden by default, can be accessed via console) */}
      <button
        onClick={toggleAdminMode}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors opacity-0 hover:opacity-100"
        title="Admin Access"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  )
}

export default App
