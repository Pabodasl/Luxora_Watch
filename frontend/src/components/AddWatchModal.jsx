import React, { useState } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import api from '../config/axios'
import toast from 'react-hot-toast'
import { useCustomer } from '../context/CustomerContext'
import { useAuth } from '../context/AuthContext'

const AddWatchModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: 'Rolex',
    price: '',
    description: '',
    availability: 'Available'
  })
  const [colorVariants, setColorVariants] = useState([])
  const [mainImage, setMainImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { customer } = useCustomer()
  const { admin } = useAuth()

  if (!isOpen) return null

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
    const file = e.target.files[0]
    console.log('Main image selected:', file ? file.name : 'none')
    setMainImage(file)
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

    // Make main image optional for development
    if (!mainImage) {
      console.log('No main image provided, will use placeholder')
    }

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      const derivedCustomerName = customer?.name || admin?.name || 'LUXORA Client'

      formDataToSend.append('name', formData.category) // Use category as name
      formDataToSend.append('category', formData.category)
      formDataToSend.append('price', priceValue)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('availability', formData.availability)
      formDataToSend.append('customerName', derivedCustomerName)
      
      // Add main image if provided
      if (mainImage) {
        formDataToSend.append('mainImage', mainImage)
      }
      
      // Process color variants and images
      const processedColorVariants = colorVariants.map((variant, index) => ({
        color: variant.color,
        image: variant.image ? variant.image.name : ''
      }))
      
      // Add color variants
      if (processedColorVariants.length > 0) {
        formDataToSend.append('colorVariants', JSON.stringify(processedColorVariants))
      }
      
      // Add color images
      colorVariants.forEach((variant, index) => {
        if (variant.image) {
          formDataToSend.append('colorImages', variant.image)
        }
      })

      console.log('Submitting watch data:', {
        category: formData.category,
        price: formData.price,
        colorVariants: processedColorVariants,
        colorImagesCount: colorVariants.filter(v => v.image).length
      })

      const response = await api.post('/api/watches', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Watch added successfully:', response.data)
      toast.success('Watch added successfully!')
      onSuccess()
      
      // Reset form
      setFormData({
        category: 'Rolex',
        price: '',
        description: '',
        availability: 'Available'
      })
      setColorVariants([])
      setMainImage(null)
      
    } catch (error) {
      console.error('Error adding watch:', error)
      toast.error(`Failed to add watch: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Watch</h2>
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

          <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 text-sm text-gray-300">
            A unique Luxora Watch ID will be generated automatically once you save this watch.
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Main Image (Optional)
            </label>
            <div className="border-2 border-dashed border-dark-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
                id="mainImage"
              />
              <label htmlFor="mainImage" className="cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-400">
                  {mainImage ? mainImage.name : 'Click to upload main image'}
                </p>
                {mainImage && (
                  <p className="text-green-400 text-sm mt-2">
                    Main image selected
                  </p>
                )}
              </label>
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
              <div key={index} className="mb-4 p-4 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-4 mb-3">
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
                
                {/* Individual color image upload */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {variant.color || `Color ${index + 1}`} Image
                  </label>
                  <div className="border-2 border-dashed border-dark-600 rounded-lg p-4 text-center hover:border-primary-500 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const updated = [...colorVariants]
                          updated[index].image = file
                          setColorVariants(updated)
                          console.log(`Image selected for ${variant.color || `Color ${index + 1}`}:`, file.name)
                        }
                      }}
                      className="hidden"
                      id={`colorImage-${index}`}
                    />
                    <label htmlFor={`colorImage-${index}`} className="cursor-pointer">
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-400 text-sm">
                        {variant.image ? variant.image.name : 'Click to upload image'}
                      </p>
                      {variant.image && (
                        <p className="text-green-400 text-xs mt-1">
                          ✓ Image selected
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            ))}
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
              {loading ? 'Adding...' : 'Add Watch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddWatchModal