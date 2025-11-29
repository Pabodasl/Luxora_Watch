import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, LogOut, ShoppingBag, Package, Download, BarChart3, ChevronDown, ChevronUp, MapPin, Phone, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../config/axios'
import toast from 'react-hot-toast'
import AddWatchModal from '../components/AddWatchModal'
import EditWatchModal from '../components/EditWatchModal'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('watches')
  const [watches, setWatches] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedWatch, setSelectedWatch] = useState(null)
  const [expandedOrders, setExpandedOrders] = useState(new Set())
  
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login')
      return
    }
    fetchWatches()
    fetchOrders()
  }, [admin, navigate])

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders()
    }
  }, [activeTab])

  const fetchWatches = async () => {
    try {
      console.log('Fetching watches...')
      const response = await api.get(`/api/watches?t=${Date.now()}`)
      console.log('Watches fetched successfully:', response.data)
      setWatches(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching watches:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      toast.error('Failed to fetch watches. Please try again.')
      setWatches([]) // Reset to empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (watchId) => {
    if (!window.confirm('Are you sure you want to delete this watch?')) {
      return
    }

    try {
      await api.delete(`/api/watches/${watchId}`)
      toast.success('Watch deleted successfully')
      fetchWatches()
    } catch (error) {
      console.error('Error deleting watch:', error)
      toast.error('Failed to delete watch')
    }
  }

  const handleEdit = (watch) => {
    setSelectedWatch(watch)
    setShowEditModal(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const response = await api.get('/api/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      console.error('Error downloading invoice:', error)
      toast.error('Failed to download invoice')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus })
      toast.success('Order status updated successfully')
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const toggleOrderDetails = (orderId) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  // Analytics calculations
  const calculateAnalytics = () => {
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.watch.price + (order.deliveryCharges || 0))
    }, 0)

    const deliveredRevenue = orders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, order) => {
        return sum + (order.watch.price + (order.deliveryCharges || 0))
      }, 0)

    const pendingRevenue = orders
      .filter(o => o.status === 'Pending' || o.status === 'Confirmed')
      .reduce((sum, order) => {
        return sum + (order.watch.price + (order.deliveryCharges || 0))
      }, 0)

    // Category breakdown
    const categoryStats = {}
    orders.forEach(order => {
      const category = order.watch.category || 'Unknown'
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, revenue: 0 }
      }
      categoryStats[category].count++
      categoryStats[category].revenue += (order.watch.price + (order.deliveryCharges || 0))
    })

    // Monthly revenue (last 6 months)
    const monthlyRevenue = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      monthlyRevenue[monthKey] = 0
    }

    orders.forEach(order => {
      const orderDate = new Date(order.orderDate)
      const monthKey = orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      if (monthlyRevenue.hasOwnProperty(monthKey)) {
        monthlyRevenue[monthKey] += (order.watch.price + (order.deliveryCharges || 0))
      }
    })

    // Average order value
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    return {
      totalRevenue,
      deliveredRevenue,
      pendingRevenue,
      categoryStats,
      monthlyRevenue,
      avgOrderValue
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="loading-spinner h-12 w-12" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Manage your watch collection and orders</p>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {activeTab === 'watches' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Watch</span>
            </button>
            )}
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-dark-700">
          <button
            onClick={() => setActiveTab('watches')}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === 'watches'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package size={20} className="inline mr-2" />
            Watches
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === 'orders'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShoppingBag size={20} className="inline mr-2" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-medium transition-colors duration-200 ${
              activeTab === 'analytics'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 size={20} className="inline mr-2" />
            Analytics
          </button>
        </div>

        {/* Stats */}
        {activeTab === 'watches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-2">Total Watches</h3>
            <p className="text-3xl font-bold gradient-text">{watches.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-2">Available</h3>
            <p className="text-3xl font-bold text-green-400">
              {watches.filter(w => w.availability === 'Available').length}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-2">Sold Out</h3>
            <p className="text-3xl font-bold text-red-400">
              {watches.filter(w => w.availability === 'Sold Out').length}
            </p>
          </div>
        </div>
        )}

        {activeTab === 'orders' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Total Orders</h3>
                <p className="text-3xl font-bold gradient-text">{orders.length}</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Pending</h3>
                <p className="text-3xl font-bold text-yellow-400">
                  {orders.filter(o => o.status === 'Pending').length}
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Processing</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length}
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Delivered</h3>
                <p className="text-3xl font-bold text-green-400">
                  {orders.filter(o => o.status === 'Delivered').length}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold text-primary-400">
                  Rs. {orders.reduce((sum, order) => sum + (order.watch.price + (order.deliveryCharges || 0)), 0).toLocaleString()}
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Delivered Revenue</h3>
                <p className="text-3xl font-bold text-green-400">
                  Rs. {orders.filter(o => o.status === 'Delivered').reduce((sum, order) => sum + (order.watch.price + (order.deliveryCharges || 0)), 0).toLocaleString()}
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-2">Pending Revenue</h3>
                <p className="text-3xl font-bold text-yellow-400">
                  Rs. {orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').reduce((sum, order) => sum + (order.watch.price + (order.deliveryCharges || 0)), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Watches Table */}
        {activeTab === 'watches' && (
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Watch Collection</h2>
          
          {watches.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">No watches added yet</h3>
              <p className="text-gray-500 mb-4">Start building your collection by adding your first watch</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                Add Your First Watch
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Image</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Category</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Watch ID</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Availability</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Colors</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watches.map((watch) => (
                    <tr key={watch._id} className="border-b border-dark-700 hover:bg-dark-700 transition-colors duration-200">
                      <td className="py-4 px-4">
                        <img
                          src={`http://localhost:5000/${watch.mainImage}`}
                          alt={watch.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{watch.name}</p>
                          {watch.description && (
                            <p className="text-gray-400 text-sm truncate max-w-xs">
                              {watch.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-primary-400 font-medium">
                          {watch.category || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-400">{watch.watchId || 'Pending ID'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-primary-400 font-semibold">
                          Rs. {watch.price.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            watch.availability === 'Available'
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {watch.availability}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-1">
                          {watch.colorVariants && watch.colorVariants.slice(0, 3).map((variant, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-dark-600"
                              style={{ backgroundColor: variant.color.toLowerCase() }}
                              title={variant.color}
                            />
                          ))}
                          {watch.colorVariants && watch.colorVariants.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{watch.colorVariants.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(watch)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-dark-600 rounded-lg transition-colors duration-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(watch._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-dark-600 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Order Management</h2>
            
            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="loading-spinner h-12 w-12 mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No orders yet</h3>
                <p className="text-gray-500">Orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Product</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Total</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const isExpanded = expandedOrders.has(order.orderId)
                      return (
                        <React.Fragment key={order._id}>
                          <tr className="border-b border-dark-700 hover:bg-dark-700 transition-colors duration-200">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleOrderDetails(order.orderId)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <span className="text-sm text-gray-400 font-mono">{order.orderId}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-white font-medium">{order.customerName}</p>
                                <p className="text-gray-400 text-sm">{order.phoneNumber}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-white font-medium">{order.watch.name}</p>
                                {order.watch.color && (
                                  <p className="text-gray-400 text-sm">Color: {order.watch.color}</p>
                                )}
                                <p className="text-gray-400 text-xs">{order.watch.watchId}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-primary-400 font-semibold">
                                Rs. {(order.watch.price + (order.deliveryCharges || 0)).toLocaleString()}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm text-gray-400">
                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.orderId, e.target.value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${
                                  order.status === 'Pending'
                                    ? 'bg-yellow-500 text-white'
                                    : order.status === 'Confirmed' || order.status === 'Processing'
                                    ? 'bg-blue-500 text-white'
                                    : order.status === 'Shipped'
                                    ? 'bg-purple-500 text-white'
                                    : order.status === 'Delivered'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleDownloadInvoice(order.orderId)}
                                  className="p-2 text-green-400 hover:text-green-300 hover:bg-dark-600 rounded-lg transition-colors duration-200"
                                  title="Download Invoice PDF"
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-dark-800">
                              <td colSpan="7" className="py-6 px-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-white font-semibold mb-4 flex items-center">
                                      <MapPin size={18} className="mr-2 text-primary-400" />
                                      Delivery Address
                                    </h4>
                                    <p className="text-gray-300 text-sm mb-4">{order.deliveryAddress}</p>
                                    {order.additionalMessage && (
                                      <>
                                        <h4 className="text-white font-semibold mb-2 flex items-center mt-4">
                                          <MessageSquare size={18} className="mr-2 text-primary-400" />
                                          Additional Message
                                        </h4>
                                        <p className="text-gray-300 text-sm">{order.additionalMessage}</p>
                                      </>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-white font-semibold mb-4">Order Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Product Price:</span>
                                        <span className="text-white">Rs. {order.watch.price.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Delivery Charges:</span>
                                        <span className="text-white">Rs. {(order.deliveryCharges || 0).toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between pt-2 border-t border-dark-700">
                                        <span className="text-gray-300 font-semibold">Total Amount:</span>
                                        <span className="text-primary-400 font-bold">Rs. {(order.watch.price + (order.deliveryCharges || 0)).toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between mt-4">
                                        <span className="text-gray-400">Payment Method:</span>
                                        <span className="text-white">{order.paymentMethod || 'Cash on Delivery'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Order Date & Time:</span>
                                        <span className="text-white">
                                          {new Date(order.orderDate).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (() => {
          const analytics = calculateAnalytics()
          return (
            <div className="space-y-6">
              {/* Revenue Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold gradient-text">
                    Rs. {analytics.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">All orders</p>
                </div>
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-2">Delivered Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">
                    Rs. {analytics.deliveredRevenue.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Confirmed payments</p>
                </div>
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-2">Pending Revenue</h3>
                  <p className="text-3xl font-bold text-yellow-400">
                    Rs. {analytics.pendingRevenue.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">In pipeline</p>
                </div>
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-2">Avg Order Value</h3>
                  <p className="text-3xl font-bold text-primary-400">
                    Rs. {Math.round(analytics.avgOrderValue).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Per order</p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6">Category Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analytics.categoryStats).map(([category, stats]) => (
                    <div key={category} className="bg-dark-800 p-4 rounded-lg border border-dark-700">
                      <h3 className="text-white font-semibold mb-2">{category}</h3>
                      <p className="text-2xl font-bold text-primary-400 mb-1">
                        {stats.count} {stats.count === 1 ? 'order' : 'orders'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Rs. {stats.revenue.toLocaleString()} revenue
                      </p>
                    </div>
                  ))}
                  {Object.keys(analytics.categoryStats).length === 0 && (
                    <p className="text-gray-400 col-span-full text-center py-4">No category data available</p>
                  )}
                </div>
              </div>

              {/* Monthly Revenue Trend */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6">Monthly Revenue Trend</h2>
                <div className="space-y-3">
                  {Object.entries(analytics.monthlyRevenue).map(([month, revenue]) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-gray-300 font-medium">{month}</span>
                      <div className="flex items-center space-x-4 flex-1 ml-4">
                        <div className="flex-1 bg-dark-800 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-primary-400 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${analytics.totalRevenue > 0 ? (revenue / analytics.totalRevenue) * 100 : 0}%`
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold min-w-[100px] text-right">
                          Rs. {revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Distribution */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-6">Order Status Distribution</h2>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => {
                    const count = orders.filter(o => o.status === status).length
                    const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0
                    return (
                      <div key={status} className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">{count}</div>
                        <div className="text-sm text-gray-400 mb-1">{status}</div>
                        <div className="text-xs text-primary-400">{percentage.toFixed(1)}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Add Watch Modal */}
      {showAddModal && (
        <AddWatchModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchWatches}
        />
      )}

      {/* Edit Watch Modal */}
      {showEditModal && selectedWatch && (
        <EditWatchModal
          watch={selectedWatch}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedWatch(null)
          }}
          onSuccess={() => {
            setShowEditModal(false)
            setSelectedWatch(null)
            fetchWatches()
          }}
        />
      )}
    </div>
  )
}

export default AdminPanel
