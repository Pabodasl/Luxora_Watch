const mongoose = require('mongoose');

const colorVariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  }
});

const generateWatchId = () => {
  const timestampSegment = Date.now().toString().slice(-6);
  const randomSegment = Math.floor(100 + Math.random() * 900);
  return `LUX-${timestampSegment}${randomSegment}`;
};

const watchSchema = new mongoose.Schema({
  watchId: {
    type: String,
    unique: true,
    default: generateWatchId
  },
  customerName: {
    type: String,
    default: 'LUXORA Client',
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Rolex', 'G-Shock', 'Casio', 'Citizen'],
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 1
  },
  mainImage: {
    type: String,
    required: true
  },
  colorVariants: [colorVariantSchema],
  availability: {
    type: String,
    enum: ['Available', 'Sold Out'],
    default: 'Available'
  },
  description: {
    type: String,
    default: ''
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
watchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Ensure watchId is generated if not present
  if (!this.watchId) {
    this.watchId = generateWatchId();
  }
  
  // Ensure name is set from category if not provided
  if (!this.name && this.category) {
    this.name = this.category;
  }
  
  next();
});

// Add index for better performance
watchSchema.index({ createdAt: -1 });
watchSchema.index({ category: 1 });
watchSchema.index({ availability: 1 });

module.exports = mongoose.model('Watch', watchSchema);