const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { mockDB } = require('../services/mockData');
const { getDBStatus } = require('../services/dbStatus');
const Admin = require('../models/Admin');

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin12*#';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Luxora Admin';
const ADMIN_ID = process.env.ADMIN_ID || 'mock-admin';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    let admin;
    
    if (getDBStatus()) {
      // Use real database
      console.log('📊 Using real database for admin login');
      admin = await Admin.findOne({ email: normalizedEmail });
      
      if (!admin) {
        // Check if this is the default admin email and password
        if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          // Auto-create the default admin if it doesn't exist
          console.log('📝 Creating default admin in database...');
          admin = new Admin({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            name: ADMIN_NAME
          });
          await admin.save();
          console.log('✅ Default admin created successfully');
        } else {
          console.log('❌ Admin not found in database for email:', email);
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      } else {
        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
          console.log('❌ Invalid password for email:', email);
          return res.status(400).json({ message: 'Invalid credentials' });
        }
      }
    } else {
      // Use mock data
      console.log('📦 Using mock data for admin login');
    if (normalizedEmail !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('❌ Invalid admin credentials attempt for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

      admin = await mockDB.findAdminById(ADMIN_ID) || {
      _id: ADMIN_ID,
      email: ADMIN_EMAIL,
      name: ADMIN_NAME
    };
    }

    // Create JWT token
    const payload = {
      id: admin._id.toString(),
      email: admin.email
    };

    console.log('🔑 JWT Secret for signing:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '24h'
    });
    console.log('🎫 Token created for admin:', admin.email);

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      admin: {
        id: req.admin._id,
        email: req.admin.email,
        name: req.admin.name
      }
    });
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register
// @desc    Register admin (for initial setup)
// @access  Public (should be protected in production)
router.post('/register', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if database is connected
    if (!getDBStatus()) {
      return res.status(400).json({ message: 'Database not connected. Cannot register admin.' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password
    });

    await admin.save();

    // Create JWT token
    const payload = {
      id: admin._id,
      email: admin.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '24h'
    });

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
