import React, { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import InterestForm from './InterestForm'

const WatchModal = ({ watch, isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(
    watch.colorVariants && watch.colorVariants.length > 0 ? watch.colorVariants[0] : null
  )
  const [showInterestForm, setShowInterestForm] = useState(false)

  if (!isOpen || !watch) return null

  const currentImage = selectedColor ? selectedColor.image : watch.mainImage

  const handleInterestClick = () => {
    setShowInterestForm(true)
  }

  const closeInterestForm = () => {
    setShowInterestForm(false)
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Watch Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={`http://localhost:5000/${currentImage}`}
                  alt={watch.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      watch.availability === 'Available'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {watch.availability}
                  </span>
                </div>
              </div>

              {/* Color Variants */}
              {watch.colorVariants && watch.colorVariants.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Available Colors</h3>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Choose your color
                    </label>
                    <select
                      value={
                        Math.max(
                          0,
                          selectedColor
                            ? watch.colorVariants.findIndex(
                                (variant) => variant.color === selectedColor.color
                              )
                            : 0
                        )
                      }
                      onChange={(event) => {
                        const index = Number(event.target.value)
                        const variant = watch.colorVariants[index]
                        if (variant) setSelectedColor(variant)
                      }}
                      className="input-field bg-dark-900/60"
                    >
                      {watch.colorVariants.map((variant, index) => (
                        <option value={index} key={variant.color}>
                          {variant.color}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {watch.colorVariants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(variant)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedColor === variant
                            ? 'border-primary-500 bg-primary-500 bg-opacity-10'
                            : 'border-dark-600 hover:border-dark-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded-full border-2 border-dark-600"
                            style={{ backgroundColor: variant.color.toLowerCase() }}
                          />
                          <span className="text-white text-sm font-medium">
                            {variant.color}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary-300 mb-2">
                  {watch.watchId || 'Pending ID'}
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">{watch.name}</h1>
                <div className="mb-4">
                  <span className="text-3xl font-bold gradient-text">
                    Rs. {watch.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {watch.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{watch.description}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>Premium materials and craftsmanship</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>Multiple color options available</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>Fast delivery across Sri Lanka</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span>WhatsApp support for inquiries</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {watch.availability === 'Available' ? (
                  <button
                    onClick={handleInterestClick}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <MessageCircle size={20} />
                    <span>I'm Interested</span>
                  </button>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-red-400 font-medium mb-2">This watch is currently sold out</p>
                    <p className="text-gray-400 text-sm">
                      Contact us to be notified when it's back in stock
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Form Modal */}
      {showInterestForm && (
        <InterestForm
          watch={watch}
          selectedColor={selectedColor}
          isOpen={showInterestForm}
          onClose={closeInterestForm}
        />
      )}
    </>
  )
}

export default WatchModal
