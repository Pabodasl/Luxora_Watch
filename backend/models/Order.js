const mongoose = require('mongoose');

const generateOrderId = () => {
  const timestampSegment = Date.now().toString().slice(-6);
  const randomSegment = Math.floor(100 + Math.random() * 900);
  return `ORD-${timestampSegment}${randomSegment}`;
};

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: generateOrderId
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  deliveryAddress: {
    type: String,
    required: true,
    trim: true
  },
  additionalMessage: {
    type: String,
    default: '',
    trim: true
  },
  watch: {
    watchId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: null
    },
    price: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    }
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Bank Transfer'],
    default: 'Cash on Delivery'
  },
  deliveryCharges: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.orderId) {
    this.orderId = generateOrderId();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

