import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import UserLogin from './pages/UserLogin'
import { AuthProvider } from './context/AuthContext'
import { CustomerProvider } from './context/CustomerContext'

function App() {
  return (
    <CustomerProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-dark-900 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login" element={<UserLogin />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#2C2450',
                  color: '#fff',
                  border: '1px solid #3C306B',
                },
                success: {
                  iconTheme: {
                    primary: '#F25912',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#FF6B6B',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </CustomerProvider>
  )
}

export default App
