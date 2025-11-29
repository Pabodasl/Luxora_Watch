import React from 'react'
import { Clock } from 'lucide-react'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <Clock size={64} className="text-primary-500 animate-bounce-gentle mx-auto mb-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="loading-spinner h-8 w-8" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Loading Watches</h2>
        <p className="text-gray-400">Please wait while we fetch our premium collection...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
