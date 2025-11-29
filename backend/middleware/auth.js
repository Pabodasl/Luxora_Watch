const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { mockDB } = require('../services/mockData');
const { getDBStatus } = require('../services/dbStatus');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('🔍 Verifying token:', token.substring(0, 20) + '...');
    console.log('🔑 JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('✅ Token decoded:', decoded);
    
    let admin;
    if (getDBStatus()) {
      // Use real database
      console.log('📊 Using real database for admin lookup');
      // Check if decoded.id is a valid MongoDB ObjectId
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(decoded.id)) {
      admin = await Admin.findById(decoded.id).select('-password');
      } else {
        // If not a valid ObjectId, try to find by email
        admin = await Admin.findOne({ email: decoded.email }).select('-password');
      }
    } else {
      // Use mock data
      console.log('📦 Using mock data for admin lookup, ID:', decoded.id);
      admin = await mockDB.findAdminById(decoded.id);
    }
    
    if (!admin) {
      console.log('❌ Admin not found for ID:', decoded.id);
      return res.status(401).json({ message: 'Token is not valid' });
    }

    console.log('✅ Admin found:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;