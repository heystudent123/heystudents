const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@heystudentsdu.com',
  password: 'admin123456',
  mobile: '9999999999',
  college: 'Delhi University',
  role: 'admin'
};

// Seed function
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    // Create admin user
    const admin = await User.create(adminUser);
    console.log(`Admin user created with ID: ${admin._id}`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedAdmin();
}); 