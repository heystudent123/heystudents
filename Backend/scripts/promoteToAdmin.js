const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Get email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide a user email as an argument');
  console.log('Example: node scripts/promoteToAdmin.js user@example.com');
  process.exit(1);
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Promote user to admin
const promoteToAdmin = async () => {
  try {
    // Find the user
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      process.exit(1);
    }
    
    // Check if already admin
    if (user.role === 'admin') {
      console.log(`User ${userEmail} is already an admin`);
      process.exit(0);
    }
    
    // Update user role to admin
    user.role = 'admin';
    await user.save();
    
    console.log(`User ${userEmail} successfully promoted to admin role`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
connectDB().then(() => {
  promoteToAdmin();
}); 