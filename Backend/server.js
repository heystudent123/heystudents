const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const referralRoutes = require('./routes/referralRoutes');
const validationRoutes = require('./routes/validationRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set JWT Secret if not in env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'heystudentsdu-secret-key-dev';
  process.env.JWT_EXPIRE = '30d';
}

// Database connection
const mongoURI = process.env.MONGODB_URI;
console.log('Attempting to connect to MongoDB Atlas...');

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Atlas Connected Successfully'))
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/validation', validationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hey Students DU API is running');
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 