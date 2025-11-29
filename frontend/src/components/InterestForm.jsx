import React, { useState, useEffect } from 'react'
import { X, MapPin, Phone, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCustomer } from '../context/CustomerContext'
import api from '../config/axios'

const InterestForm = ({ watch, selectedColor, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const { customer } = useCustomer()

  useEffect(() => {
    if (customer?.name) {
      setFormData((prev) => ({
        ...prev,
        name: customer.name
      }))
    }
  }, [customer])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'name') {
      // Capitalize first letter of each word
      const capitalizedValue = value.replace(/\b\w/g, l => l.toUpperCase())
      setFormData({
        ...formData,
        [name]: capitalizedValue
      })
    } else if (name === 'phone') {
      // Only allow digits and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '')
      if (digitsOnly.length <= 10) {
        setFormData({
          ...formData,
          [name]: digitsOnly
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits')
      return
    }

    setLoading(true)
    
    try {
      // Prepare order data
      const orderData = {
        customerName: formData.name,
        phoneNumber: formData.phone,
        deliveryAddress: formData.address,
        additionalMessage: formData.message || '',
        watch: {
          watchId: watch.watchId || watch._id || 'N/A',
          name: watch.name,
          category: watch.category || null,
          price: watch.price,
          color: selectedColor ? selectedColor.color : null,
          image: selectedColor ? (selectedColor.image || watch.mainImage) : watch.mainImage
        },
        deliveryCharges: 0 // You can add delivery charges logic here
      }

      // Save order to database
      const orderResponse = await api.post('/api/orders', orderData)
      const savedOrder = orderResponse.data.order

      // Generate and download invoice PDF
      try {
        const invoiceResponse = await api.get(`/api/orders/${savedOrder.orderId}/invoice`, {
          responseType: 'blob'
        })
      
        // Create blob URL and trigger download
        const blob = new Blob([invoiceResponse.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `invoice-${savedOrder.orderId}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        toast.success('Order placed successfully! Invoice downloaded.')
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError)
        toast.error('Order saved but failed to generate invoice')
      }
      
      // Close form after a short delay
      setTimeout(() => {
        onClose()
        setFormData({ name: '', phone: '', address: '', message: '' })
      }, 1500)
      
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Express Interest</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Watch Info */}
        <div className="bg-dark-700 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={`http://localhost:5000/${selectedColor ? selectedColor.image : watch.mainImage}`}
              alt={watch.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-white font-medium">{watch.name}</h3>
              {selectedColor && (
                <p className="text-gray-400 text-sm">Color: {selectedColor.color}</p>
              )}
              <p className="text-primary-400 font-semibold">
                Rs. {watch.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User size={16} className="inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Phone size={16} className="inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field"
              placeholder="07XXXXXXXX (10 digits)"
              maxLength="10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin size={16} className="inline mr-2" />
              Delivery Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input-field h-20 resize-none"
              placeholder="Enter your complete delivery address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="input-field h-20 resize-none"
              placeholder="Any special requests or questions?"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner h-4 w-4" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <span>Place Order</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-dark-700 rounded-lg">
          <p className="text-sm text-gray-400 text-center mb-4">
            Your order will be saved and an invoice PDF will be automatically downloaded.
          </p>
          
          {/* Trust Message */}
          <div className="mt-4 p-4 bg-dark-600 rounded-lg border border-primary-500/20">
            <h4 className="text-sm font-semibold text-white mb-2">Secure Payment with Cash on Delivery</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              We use Cash on Delivery to make your shopping experience safe and trustworthy. 
              You only pay after your order arrives. If you prefer to pay by bank transfer, 
              please contact us on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterestForm
