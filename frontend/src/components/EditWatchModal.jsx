import React, { useState, useEffect } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import api from '../config/axios'
import toast from 'react-hot-toast'

const EditWatchModal = ({ watch, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: 'Rolex',
    price: '',
    description: '',
    availability: 'Available',
    customerName: ''
  })
  const [colorVariants, setColorVariants] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [colorImages, setColorImages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (watch) {
      setFormData({
        category: watch.category || watch.name || 'Rolex',
        price: watch.price || '',
        description: watch.description || '',
        availability: watch.availability || 'Available',
        customerName: watch.customerName || ''
      })
      setColorVariants(watch.colorVariants || [])
    }
  }, [watch])

  if (!isOpen || !watch) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Special validation for price field
    if (name === 'price') {
      // Allow empty string (for clearing the field)
      if (value === '') {
        setFormData({
          ...formData,
          [name]: ''
        })
        return
      }
      
      // Convert to number and validate
      const numValue = Number(value)
      
      // Block negative numbers and zero
      if (isNaN(numValue) || numValue <= 0) {
        // Don't update if invalid (negative or zero)
        return
      }
      
      // Allow positive numbers
      setFormData({
        ...formData,
        [name]: value
      })
    } else {
      // For other fields, update normally
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0])
  }

  const handleColorImageChange = (e) => {
    setColorImages(Array.from(e.target.files))
  }

  const addColorVariant = () => {
    setColorVariants([...colorVariants, { color: '', image: '' }])
  }

  const removeColorVariant = (index) => {
    setColorVariants(colorVariants.filter((_, i) => i !== index))
  }

  const updateColorVariant = (index, field, value) => {
    const updated = [...colorVariants]
    updated[index][field] = value
    setColorVariants(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const priceValue = Number(formData.price)
    if (!formData.category || !priceValue) {
      toast.error('Please fill in all required fields')
      return
    }

    if (priceValue <= 0) {
      toast.error('Price must be greater than zero')
      return
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.category) // Use category as name
      formDataToSend.append('category', formData.category)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('availability', formData.availability)
      formDataToSend.append('customerName', formData.customerName || 'LUXORA Client')
      
      // Add main image if changed
      if (mainImage) {
        formDataToSend.append('mainImage', mainImage)
      }
      
      // Add color variants
      if (colorVariants.length > 0) {
        formDataToSend.append('colorVariants', JSON.stringify(colorVariants))
      }
      
      // Add color images if changed
      colorImages.forEach((image, index) => {
        formDataToSend.append('colorImages', image)
      })

      await api.put(`/api/watches/${watch._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Watch updated successfully!')
      onSuccess()
      
    } catch (error) {
      console.error('Error updating watch:', error)
      toast.error('Failed to update watch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Watch</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Watch Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="Rolex">Rolex</option>
                <option value="G-Shock">G-Shock</option>
                <option value="Casio">Casio</option>
                <option value="Citizen">Citizen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter price"
                min="1"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Assigned customer / curator"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field h-20 resize-none"
              placeholder="Enter watch description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Availability
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="Available">Available</option>
              <option value="Sold Out">Sold Out</option>
            </select>
          </div>

          {/* Current Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Main Image
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:5000/${watch.mainImage}`}
                alt={watch.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm text-gray-400 mb-2">Upload new image to replace</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="hidden"
                  id="mainImage"
                />
                <label htmlFor="mainImage" className="btn-secondary cursor-pointer">
                  <Upload size={16} className="inline mr-2" />
                  Change Image
                </label>
              </div>
            </div>
          </div>

          {/* Color Variants */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-300">
                Color Variants
              </label>
              <button
                type="button"
                onClick={addColorVariant}
                className="btn-secondary flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Color</span>
              </button>
            </div>

            {colorVariants.map((variant, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4 p-4 bg-dark-700 rounded-lg">
                <div className="flex-1">
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => updateColorVariant(index, 'color', e.target.value)}
                    className="input-field"
                    placeholder="Color name (e.g., Black, Silver)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeColorVariant(index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-dark-600 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {colorVariants.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Color Images (optional)
                </label>
                <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleColorImageChange}
                    className="hidden"
                    id="colorImages"
                  />
                  <label htmlFor="colorImages" className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-400">
                      Upload new color images (order should match color variants)
                    </p>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Watch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditWatchModal
