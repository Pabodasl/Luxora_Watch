import React from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { admin } = useAuth()

  const handleWhatsAppClick = () => {
    const message = "Hi, I'm interested in Luxora watches. Can you help me?"
    const whatsappUrl = `https://wa.me/94713697553?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <footer className="bg-black border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-[0.4em] text-white">LUXORA</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Contemporary timepieces with bold, professional finishes. 
              Every watch in our catalog is added by the Luxora admin studio.
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={20} />
                <a href="mailto:info@luxora.com" className="hover:text-primary-400 transition-colors duration-200">
                  info@luxora.com
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Talk to us</h3>
            <p className="text-gray-400 text-sm">
              Prefer a quick chat? Open WhatsApp and our concierge will help you pick a model.
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>Chat on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-dark-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} LUXORA. All rights reserved.
            </p>
            <div>
              <Link
                to="/admin"
                className="px-4 py-2 rounded-full text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200"
              >
                Admin 
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer