export interface PG {
  id: number | string;
  name: string;
  description: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  photos: string[];
  amenities: string[];
  messType: 'veg' | 'non-veg' | 'both';
  college: string;
  distance: {
    college: number;
    metro: number;
  };
  contact: {
    phone: string;
    email: string;
  };
}

export interface Hostel {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  distance: number;
  images: string[];
  amenities: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export const collegesList = [
  'Delhi University',
  'Jamia Millia Islamia',
  'Jamia Hamdard',
  'IP University',
  'Ambedkar University',
  'Guru Gobind Singh Indraprastha University',
  'National Law University',
  'All India Institute of Medical Sciences',
  'Indian Institute of Technology Delhi',
  'Indian Statistical Institute',
  'JNU',
  'DTU',
  'NSIT',
  'IIIT Delhi'
];

export const pgs: PG[] = [
  {
    id: 1,
    name: "Cozy PG for Girls",
    description: "Near Delhi University, North Campus",
    address: "Near Delhi University, North Campus",
    price: 8000,
    rating: 4.5,
    reviews: 120,
    photos: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Study Room",
      "Power Backup",
      "24/7 Security"
    ],
    messType: "veg",
    college: "Delhi University",
    distance: {
      college: 0.5,
      metro: 1.2
    },
    contact: {
      phone: "+91 9876543210",
      email: "cozypg@example.com"
    }
  },
  {
    id: 2,
    name: "Student's Home PG",
    description: "Near Jamia Millia Islamia",
    address: "Near Jamia Millia Islamia",
    price: 6000,
    rating: 4.2,
    reviews: 85,
    photos: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "Laundry",
      "TV Lounge",
      "Hot Water",
      "24/7 Security"
    ],
    messType: "both",
    college: "Jamia Millia Islamia",
    distance: {
      college: 0.8,
      metro: 1.5
    },
    contact: {
      phone: "+91 9876543211",
      email: "studentshome@example.com"
    }
  },
  {
    id: 3,
    name: "Premium Student PG",
    description: "Near IP University",
    address: "Near IP University",
    price: 12000,
    rating: 4.8,
    reviews: 150,
    photos: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8g?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8h?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8i?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Gym",
      "Library",
      "Study Room",
      "Power Backup",
      "TV Lounge",
      "Hot Water",
      "24/7 Security"
    ],
    messType: "both",
    college: "IP University",
    distance: {
      college: 1.0,
      metro: 0.8
    },
    contact: {
      phone: "+91 9876543212",
      email: "premiumpg@example.com"
    }
  },
  {
    id: 4,
    name: "JNU Student PG",
    description: "Peaceful PG near JNU campus",
    address: "Near JNU Campus",
    price: 7000,
    rating: 4.3,
    reviews: 95,
    photos: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8j?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8k?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8l?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Study Room",
      "Library",
      "24/7 Security"
    ],
    messType: "veg",
    college: "JNU",
    distance: {
      college: 0.3,
      metro: 2.0
    },
    contact: {
      phone: "+91 9876543213",
      email: "jnupg@example.com"
    }
  },
  {
    id: 5,
    name: "DTU Boys PG",
    description: "Modern PG for engineering students",
    address: "Near DTU Campus",
    price: 9000,
    rating: 4.6,
    reviews: 110,
    photos: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8m?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8n?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8o?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Gym",
      "Study Room",
      "Power Backup",
      "TV Lounge",
      "24/7 Security"
    ],
    messType: "both",
    college: "DTU",
    distance: {
      college: 0.6,
      metro: 1.8
    },
    contact: {
      phone: "+91 9876543214",
      email: "dtupg@example.com"
    }
  },
  {
    id: 6,
    name: "NSIT Student Home",
    description: "Comfortable PG near NSIT campus",
    address: "Near NSIT Campus",
    price: 7500,
    rating: 4.4,
    reviews: 88,
    photos: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8p?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8q?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8r?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Study Room",
      "Library",
      "Power Backup",
      "24/7 Security"
    ],
    messType: "veg",
    college: "NSIT",
    distance: {
      college: 0.4,
      metro: 1.5
    },
    contact: {
      phone: "+91 9876543215",
      email: "nsitpg@example.com"
    }
  },
  {
    id: 7,
    name: "IIIT Delhi PG",
    description: "Premium PG for IIIT students",
    address: "Near IIIT Delhi Campus",
    price: 10000,
    rating: 4.7,
    reviews: 130,
    photos: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8s?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8t?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8u?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Gym",
      "Library",
      "Study Room",
      "Power Backup",
      "TV Lounge",
      "Hot Water",
      "24/7 Security"
    ],
    messType: "both",
    college: "IIIT Delhi",
    distance: {
      college: 0.7,
      metro: 1.2
    },
    contact: {
      phone: "+91 9876543216",
      email: "iiitpg@example.com"
    }
  },
  {
    id: 8,
    name: "AIIMS Student PG",
    description: "Medical student friendly PG",
    address: "Near AIIMS Campus",
    price: 11000,
    rating: 4.9,
    reviews: 160,
    photos: [
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8v?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8w?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1560449017-7c4b1a9a2b8x?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Study Room",
      "Library",
      "Power Backup",
      "TV Lounge",
      "Hot Water",
      "24/7 Security",
      "Medical Emergency Support"
    ],
    messType: "both",
    college: "All India Institute of Medical Sciences",
    distance: {
      college: 0.5,
      metro: 1.0
    },
    contact: {
      phone: "+91 9876543217",
      email: "aiimspg@example.com"
    }
  }
];

export const hostels: Hostel[] = [
  {
    id: 1,
    name: "Cozy Hostel for Girls",
    description: "A comfortable and secure hostel for female students, offering modern amenities and a supportive environment.",
    price: 12000,
    rating: 4.5,
    distance: 1.2,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Study Room",
      "Power Backup",
      "24/7 Security"
    ],
    contact: {
      phone: "+91 9876543210",
      email: "cozyhostel@example.com"
    }
  },
  {
    id: 2,
    name: "Student's Home Hostel",
    description: "A vibrant community for students with modern facilities and a friendly atmosphere.",
    price: 8000,
    rating: 4.2,
    distance: 2.5,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "Mess",
      "Laundry",
      "TV Lounge",
      "Power Backup"
    ],
    contact: {
      phone: "+91 9876543211",
      email: "studentshome@example.com"
    }
  },
  {
    id: 3,
    name: "Premium Student Hostel",
    description: "Luxury accommodation with modern amenities and premium facilities for students.",
    price: 15000,
    rating: 4.8,
    distance: 1.8,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    ],
    amenities: [
      "WiFi",
      "AC",
      "Laundry",
      "Gym",
      "Library",
      "Study Room",
      "Power Backup",
      "24/7 Security",
      "TV Lounge"
    ],
    contact: {
      phone: "+91 9876543212",
      email: "premiumhostel@example.com"
    }
  }
]; 