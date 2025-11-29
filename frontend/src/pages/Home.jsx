import React, { useState, useEffect, useCallback } from 'react'
import api from '../config/axios'
import { Clock, Star, ShoppingBag, MessageCircle, Shield, Award, ChevronRight } from 'lucide-react'
import WatchModal from '../components/WatchModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { toast } from 'react-hot-toast'

const Home = () => {
  const [watches, setWatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWatch, setSelectedWatch] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const fetchWatches = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching watches for home page...');
      const response = await api.get(`/api/watches?t=${Date.now()}`);
      console.log('Home page watches fetched:', response.data);
      setWatches(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching watches in Home:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error('Failed to load watches. Please refresh the page.');
      setWatches([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Add a refresh effect when the component mounts
  useEffect(() => {
    const refreshData = async () => {
      await fetchWatches();
    };
    
    // Initial fetch
    refreshData();
    
    // Set up refresh interval (every 30 seconds)
    const intervalId = setInterval(refreshData, 30000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchWatches]);

  const handleWatchClick = (watch) => {
    setSelectedWatch(watch)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedWatch(null)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Your Watch Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Your Watch Image as Background - Full Size, No Opacity Change */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/Image01.jpg')"
          }}
        />
        
        {/* Soft Dark Overlay - Left Side Only for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
        
        {/* Additional subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Content on Left Side */}
            <div className="w-full lg:w-1/2 text-left">
              {/* Premium Badge */}
              <div className="inline-flex items-center space-x-2 bg-[#5C3E94]/20 border border-[#5C3E94]/40 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
                <Award size={18} className="text-[#5C3E94]" />
                <span className="text-sm font-semibold text-[#5C3E94] uppercase tracking-widest">
                  Luxury Timepieces
                </span>
              </div>

              {/* Main Brand with Soft Gold Tone */}
              <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-[#F4C7A1] to-[#E8B882] bg-clip-text text-transparent">
                  LUXORA
                </span>
              </h1>
              
              {/* Accent Line */}
              <div className="w-24 h-1 bg-gradient-to-r from-[#F25912] to-[#F25912]/80 mb-8 rounded-full" />

              {/* Tagline */}
              <p className="text-2xl md:text-3xl text-white mb-8 font-light italic leading-relaxed">
                "Every second speaks style."
              </p>

              

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-6 justify-start items-start mb-12">
                <button
                  onClick={() => document.getElementById('browse-collection')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative bg-[#F25912] hover:bg-[#F25912]/90 text-white font-semibold py-4 px-10 rounded-xl text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl shadow-[#F25912]/30 hover:shadow-[#F25912]/50 transform hover:scale-105"
                >
                  <ShoppingBag size={22} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Browse Collection</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Right Side - Reserved for Watch Display */}
            <div className="hidden lg:block lg:w-1/2"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center space-y-2 text-white/70">
            <span className="text-xs font-light tracking-widest uppercase">Scroll to Explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
          </div>
        </div>
      </section>

      {/* ALL OTHER SECTIONS REMAIN EXACTLY THE SAME */}
      {/* Browse Section */}
      <section id="browse-collection" className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Browse the Luxora Watch Collection
            </h2>
          </div>
        </div>
      </section>

      {/* Watches Section */}
      <section className="pb-16 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {watches.length === 0 ? (
            <div className="text-center py-16">
              <Clock size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Watches Available</h3>
              <p className="text-gray-500">Check back soon for our latest collection!</p>
            </div>
          ) : (
            <div className="watch-grid">
              {watches.map((watch) => (
                <div
                  key={watch._id}
                  className="watch-card group"
                  onClick={() => handleWatchClick(watch)}
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:5000/${watch.mainImage}`}
                      alt={watch.name}
                      className="watch-image"
                      loading="lazy"
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
                  
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-300 mb-2">
                      {watch.watchId || 'Pending ID'}
                    </p>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {watch.name}
                    </h3>
                    
                    <div className="mb-6">
                      <span className="text-2xl font-bold gradient-text">
                        Rs. {watch.price.toLocaleString()}
                      </span>
                    </div>
                    
                    {watch.colorVariants && watch.colorVariants.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Available Colors:</p>
                        <div className="flex space-x-2">
                          {watch.colorVariants.slice(0, 3).map((variant, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-dark-600"
                              style={{ backgroundColor: variant.color.toLowerCase() }}
                              title={variant.color}
                            />
                          ))}
                          {watch.colorVariants.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{watch.colorVariants.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full btn-primary">
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-400">
                Quick islandwide shipping handled with care
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-400">
               One-Year Trusted Warranty
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy Ordering</h3>
              <p className="text-gray-400">
               Smooth checkout process with real-time support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-dark-900" id="contact">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-primary-300 mb-2">Need help?</p>
          <h2 className="text-3xl font-bold text-white mb-4">Contact Luxora</h2>
          <p className="text-gray-400 mb-6">
            Our support team responds quickly via email. Drop us a line and we will help you pick the right timepiece.
          </p>
          <a
            href="mailto:info@luxora.com"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-primary-500 text-white hover:bg-primary-500 transition-colors duration-300"
          >
            info@luxora.com
          </a>
        </div>
      </section>

      {/* Watch Modal */}
      {isModalOpen && selectedWatch && (
        <WatchModal
          watch={selectedWatch}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

export default Home