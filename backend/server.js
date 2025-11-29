const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { setDBStatus } = require('./services/dbStatus');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB Connection with fallback
const connectDB = async () => {
  try {
    // Try Atlas connection first
await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chandrasenapaboda_db_user:9BykkTLBM048OXGf@cluster0.c3sikg3.mongodb.net/luxora', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas connected successfully');
    setDBStatus(true);
  } catch (err) {
    console.log('⚠️  MongoDB Atlas connection failed, trying local fallback...');
    
    try {
      // Try local MongoDB connection
      await mongoose.connect('mongodb://localhost:27017/zyra-deals-local', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('✅ Local MongoDB connected successfully');
      setDBStatus(true);
    } catch (localErr) {
      console.log('⚠️  Local MongoDB also failed, running in offline mode with mock data');
      console.log('📝 To fix MongoDB connection:');
      console.log('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
      console.log('2. Or add your IP to MongoDB Atlas whitelist');
      console.log('3. Or use the mock data mode (current)');
      setDBStatus(false);
    }
  }
};

// Initialize database connection
connectDB();

// Routes
app.use('/api/watches', require('./routes/watches'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});