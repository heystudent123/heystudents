const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env FIRST so Clerk picks up the secret key
dotenv.config();

const { clerkMiddleware } = require('@clerk/express');

// Import routes
const emailUserRoutes = require('./routes/emailUserRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alumniRoutes = require('./routes/alumniRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const courseRoutes = require('./routes/courseRoutes');
const referralRoutes = require('./routes/referralRoutes');
const validationRoutes = require('./routes/validationRoutes');
const serverRoutes = require('./routes/serverRoutes');
const videoRoutes = require('./routes/videoRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const postRoutes = require('./routes/postRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(clerkMiddleware());   // must be before any routes that use getAuth()
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
app.use('/api/email-users', emailUserRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/server', serverRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/posts', postRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hey Students DU API is running');
});

// 🔁 Keep-alive ping route (for GitHub Actions or uptime pingers)
app.get('/ping', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(`[PING] ${new Date().toISOString()} - Ping received from ${ip}`);
  res.sendStatus(200);
});

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
