import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCustomer } from '../context/CustomerContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { admin, logout } = useAuth()
  const { customer } = useCustomer()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-dark-900/80 backdrop-blur border-b border-dark-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-[0.4em] text-white">LUXORA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-primary-400 bg-dark-700' 
                  : 'text-gray-300 hover:text-white hover:bg-dark-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 shadow-lg shadow-primary-500/30 ${
                isActive('/login')
                  ? 'bg-primary-600 text-white'
                  : 'bg-primary-500 text-white hover:bg-primary-600'
              }`}
            >
              {customer ? customer.name : 'Login'}
            </Link>
            
            {admin && (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive('/admin') 
                      ? 'text-primary-400 bg-dark-700' 
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-800 border-t border-dark-700">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-400 bg-dark-700' 
                    : 'text-gray-300 hover:text-white hover:bg-dark-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive('/login')
                    ? 'bg-primary-600 text-white'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {customer ? customer.name : 'User Login'}
              </Link>

              <a
                href="/#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>

              {admin && (
                <>
                  <Link
                    to="/admin"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive('/admin') 
                        ? 'text-primary-400 bg-dark-700' 
                        : 'text-gray-300 hover:text-white hover:bg-dark-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
