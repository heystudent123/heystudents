const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Alumni = require('../models/Alumni');
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

// Sample alumni data
const alumniData = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    college: 'St. Stephen\'s College',
    graduationYear: 2020,
    course: 'B.Tech Computer Science',
    currentCompany: 'Google',
    designation: 'Software Engineer',
    linkedInProfile: 'https://linkedin.com/in/rahul-sharma',
    bio: 'Software Engineer with experience in developing scalable web applications. Graduated from St. Stephen\'s College with a major in Computer Science.',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    isAvailableForMentoring: true,
    expertiseAreas: ['Web Development', 'React', 'Node.js']
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    college: 'Hindu College',
    graduationYear: 2019,
    course: 'BBA Marketing',
    currentCompany: 'Microsoft',
    designation: 'Product Manager',
    linkedInProfile: 'https://linkedin.com/in/priya-patel',
    bio: 'Product Manager with a passion for creating user-centric products. Graduated from Hindu College with a BBA in Marketing.',
    profileImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    isAvailableForMentoring: true,
    expertiseAreas: ['Product Management', 'Marketing', 'User Research']
  },
  {
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    college: 'SRCC',
    graduationYear: 2021,
    course: 'B.Com Honours',
    currentCompany: 'Amazon',
    designation: 'Data Scientist',
    linkedInProfile: 'https://linkedin.com/in/arjun-singh',
    bio: 'Data Scientist with a focus on building machine learning models. Graduated from SRCC with a B.Com Honours.',
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    isAvailableForMentoring: false,
    expertiseAreas: ['Data Science', 'Python', 'Machine Learning']
  },
  {
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    college: 'Ramjas College',
    graduationYear: 2018,
    course: 'BSc Economics',
    currentCompany: 'IBM',
    designation: 'Business Analyst',
    linkedInProfile: 'https://linkedin.com/in/neha-gupta',
    bio: 'Business Analyst with expertise in data-driven decision making. Graduated from Ramjas College with a degree in Economics.',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    isAvailableForMentoring: true,
    expertiseAreas: ['Business Analysis', 'Economics', 'Data Visualization']
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    college: 'NSUT',
    graduationYear: 2020,
    course: 'B.Tech Electronics',
    currentCompany: 'Adobe',
    designation: 'UX Designer',
    linkedInProfile: 'https://linkedin.com/in/vikram-malhotra',
    bio: 'UX Designer specializing in creating intuitive and accessible digital experiences. Graduated from NSUT with a degree in Electronics.',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    isAvailableForMentoring: true,
    expertiseAreas: ['UX Design', 'UI Design', 'Figma']
  }
];

// Seed function
const seedDB = async () => {
  try {
    // Find an admin user to be set as the creator
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('No admin user found. Please create an admin user first.');
      process.exit(1);
    }
    
    // Clear existing alumni
    await Alumni.deleteMany({});
    console.log('Deleted existing alumni');
    
    // Add createdBy field to each alumni
    const alumniWithCreator = alumniData.map(alumni => ({
      ...alumni,
      createdBy: admin._id
    }));
    
    // Insert new alumni
    const createdAlumni = await Alumni.insertMany(alumniWithCreator);
    console.log(`${createdAlumni.length} alumni inserted successfully`);
    
    console.log('Alumni data seeding completed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(() => {
  seedDB();
}); 