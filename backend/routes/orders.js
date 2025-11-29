const express = require('express');
const router = express.Router();
const {
  createOrder,
  generateInvoice,
  getAllOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', createOrder);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get('/', auth, getAllOrders);

// @route   GET /api/orders/:orderId
// @desc    Get single order
// @access  Private (Admin)
router.get('/:orderId', auth, getOrder);

// @route   GET /api/orders/:orderId/invoice
// @desc    Generate invoice PDF
// @access  Public
router.get('/:orderId/invoice', generateInvoice);

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/:orderId/status', auth, updateOrderStatus);

module.exports = router;

