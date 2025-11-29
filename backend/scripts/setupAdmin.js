const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const setupAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chandrasenapaboda_db_user:iLkzw3OHgXqLtMg4@cluster0.3pgi0qk.mongodb.net/zyra-deals');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@zyradeals.lk' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = new Admin({
      name: 'Admin',
      email: 'admin@zyradeals.lk',
      password: 'admin123'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@zyradeals.lk');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

setupAdmin();
