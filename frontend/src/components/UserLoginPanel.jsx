import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, LogOut } from 'lucide-react'
import { useCustomer } from '../context/CustomerContext'

const UserLoginPanel = () => {
  const { customer, loginCustomer, logoutCustomer } = useCustomer()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '' })

  useEffect(() => {
    if (customer) {
      setFormData({ name: customer.name, email: customer.email })
    }
  }, [customer])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    loginCustomer(formData)
    navigate('/')
  }

  if (customer) {
    return (
      <div className="bg-dark-800/80 border border-dark-600 rounded-2xl p-6 shadow-xl space-y-4">
        <div>
          <p className="text-sm text-gray-400">Signed in as</p>
          <p className="text-xl font-semibold text-white">{customer.name}</p>
          <p className="text-sm text-gray-400">{customer.email}</p>
        </div>
        <div className="text-sm text-gray-400">
          Your name will be used as the default customer when you add a watch or send an inquiry.
        </div>
        <button
          onClick={() => {
            logoutCustomer()
            navigate('/')
          }}
          className="btn-secondary flex items-center justify-center space-x-2"
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-dark-800/80 border border-dark-600 rounded-2xl p-6 shadow-xl space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <User size={16} className="inline mr-2" />
          Your name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field bg-dark-900/60"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <Mail size={16} className="inline mr-2" />
          Email address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field bg-dark-900/60"
          placeholder="you@luxora.com"
          required
        />
      </div>

      <button type="submit" className="w-full btn-primary">
        Sign in to Luxora
      </button>
    </form>
  )
}

export default UserLoginPanel

