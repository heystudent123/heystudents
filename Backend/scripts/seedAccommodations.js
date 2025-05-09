const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Accommodation = require('../models/Accommodation');
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

// Sample accommodation data
const accommodations = [
  {
    name: "Cozy PG for Girls",
    type: "PG",
    description: "A comfortable and safe PG accommodation near Delhi University North Campus. We provide fully furnished rooms with all essential amenities.",
    address: {
      street: "2134 Vishwavidyalaya Marg",
      area: "North Campus",
      city: "Delhi",
      pincode: "110007"
    },
    nearestCollege: ["Delhi University", "St. Stephen's College"],
    distanceFromCollege: 0.5,
    nearestMetro: "Vishwavidyalaya Metro Station",
    distanceFromMetro: 0.3,
    rent: 8000,
    securityDeposit: 16000,
    availableFor: "Girls",
    roomTypes: [
      {
        type: "Single",
        price: 12000,
        availability: 3
      },
      {
        type: "Double",
        price: 8000,
        availability: 5
      },
      {
        type: "Triple",
        price: 6000,
        availability: 2
      }
    ],
    amenities: ["WiFi", "AC", "Laundry", "Study Room", "Power Backup", "24/7 Security", "Hot Water"],
    food: {
      available: true,
      vegOnly: true,
      mealTypes: ["Breakfast", "Lunch", "Dinner"]
    },
    rules: [
      "No smoking",
      "No alcohol",
      "Entry closed after 10 PM",
      "Guests allowed in common area only"
    ],
    contactDetails: {
      name: "Mrs. Sharma",
      phone: "9876543210",
      alternatePhone: "9876543211",
      email: "cozypg@example.com"
    },
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
    ],
    verified: true
  },
  {
    name: "Student's Home PG",
    type: "PG",
    description: "Affordable and comfortable PG accommodation for students near Jamia Millia Islamia. We offer a friendly atmosphere with all necessary facilities.",
    address: {
      street: "45 Jamia Nagar",
      area: "Okhla",
      city: "Delhi",
      pincode: "110025"
    },
    nearestCollege: ["Jamia Millia Islamia"],
    distanceFromCollege: 0.8,
    nearestMetro: "Jamia Millia Islamia Metro Station",
    distanceFromMetro: 0.7,
    rent: 6000,
    securityDeposit: 12000,
    availableFor: "Boys",
    roomTypes: [
      {
        type: "Double",
        price: 6000,
        availability: 8
      },
      {
        type: "Triple",
        price: 5000,
        availability: 4
      }
    ],
    amenities: ["WiFi", "Laundry", "TV Lounge", "Hot Water", "24/7 Security"],
    food: {
      available: true,
      vegOnly: false,
      mealTypes: ["Breakfast", "Dinner"]
    },
    rules: [
      "No smoking inside rooms",
      "No loud music after 9 PM",
      "Entry closed after 11 PM"
    ],
    contactDetails: {
      name: "Mr. Khan",
      phone: "9876543212",
      email: "studentshome@example.com"
    },
    images: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8d"
    ],
    verified: true
  },
  {
    name: "Premium Student PG",
    type: "PG",
    description: "Luxury PG accommodation near IP University with premium amenities and facilities for students who demand the best.",
    address: {
      street: "67 Dwarka Sector 16",
      area: "Dwarka",
      city: "Delhi",
      pincode: "110078"
    },
    nearestCollege: ["IP University", "GGSIPU"],
    distanceFromCollege: 1.0,
    nearestMetro: "Dwarka Sector 14 Metro Station",
    distanceFromMetro: 0.8,
    rent: 12000,
    securityDeposit: 24000,
    availableFor: "Both",
    roomTypes: [
      {
        type: "Single",
        price: 15000,
        availability: 6
      },
      {
        type: "Double",
        price: 12000,
        availability: 4
      }
    ],
    amenities: [
      "WiFi", "AC", "Laundry", "Gym", "Library", "Study Room", 
      "Power Backup", "TV Lounge", "Hot Water", "24/7 Security"
    ],
    food: {
      available: true,
      vegOnly: false,
      mealTypes: ["Breakfast", "Lunch", "Dinner", "Snacks"]
    },
    rules: [
      "No smoking in common areas",
      "Guests allowed with permission",
      "Noise restrictions after 10 PM"
    ],
    contactDetails: {
      name: "Mr. Sharma",
      phone: "9876543213",
      alternatePhone: "9876543214",
      email: "premiumpg@example.com"
    },
    images: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8g",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8h"
    ],
    verified: true
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
    
    // Clear existing accommodations
    await Accommodation.deleteMany({});
    console.log('Deleted existing accommodations');
    
    // Add createdBy field to each accommodation
    const accommodationsWithCreator = accommodations.map(acc => ({
      ...acc,
      createdBy: admin._id
    }));
    
    // Insert new accommodations
    const createdAccommodations = await Accommodation.insertMany(accommodationsWithCreator);
    console.log(`${createdAccommodations.length} accommodations inserted successfully`);
    
    console.log('Data seeding completed!');
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