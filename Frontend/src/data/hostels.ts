// Define interfaces for accommodation types
export interface Hostel {
  id: string;
  name: string;
  description?: string;
  price: number;
  location: {
    address: string;
    city: string;
    state?: string;
    country?: string;
    coordinates?: [number, number]; // [latitude, longitude]
  };
  distanceToCollege?: number;
  distanceToMetro?: number;
  rating?: number;
  reviews?: Array<{
    userId: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  amenities: string[];
  images: string[];
  type: string;
  gender: string;
  messType?: string;
}

export interface PG {
  id: string;
  name: string;
  description?: string;
  price: number;
  location: {
    address: string;
    city: string;
    state?: string;
    country?: string;
    coordinates?: [number, number]; // [latitude, longitude]
  };
  distanceToCollege?: number;
  distanceToMetro?: number;
  rating?: number;
  reviews?: Array<{
    userId: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  amenities: string[];
  images: string[];
  type: string;
  gender: string;
  messType?: string;
}

// List of colleges for filtering
export const collegesList = [
  "Delhi University",
  "Jawaharlal Nehru University",
  "Jamia Millia Islamia",
  "Indraprastha University",
  "Amity University",
  "IIT Delhi",
  "AIIMS Delhi",
  "DTU Delhi",
  "NSUT Delhi",
  "IIIT Delhi",
  "Sharda University",
  "Galgotias University",
  "Bennett University",
  "Ashoka University",
  "O.P. Jindal Global University"
];

// Sample data - this is just for component development and testing
// In production, this data would come from the API
export const sampleHostels: Hostel[] = [
  {
    id: "1",
    name: "Sunrise Hostel",
    description: "A comfortable hostel with all modern amenities",
    price: 12000,
    location: {
      address: "123 College Road, North Campus",
      city: "Delhi",
      state: "Delhi",
      country: "India"
    },
    distanceToCollege: 0.5,
    distanceToMetro: 1.2,
    rating: 4.5,
    amenities: ["WiFi", "AC", "Laundry", "Mess", "Security", "Power Backup"],
    images: ["https://example.com/hostel1.jpg"],
    type: "Hostel",
    gender: "Male"
  },
  {
    id: "2",
    name: "Green View PG",
    description: "Peaceful environment with greenery all around",
    price: 15000,
    location: {
      address: "45 South Extension",
      city: "Delhi",
      state: "Delhi",
      country: "India"
    },
    distanceToCollege: 2.0,
    distanceToMetro: 0.8,
    rating: 4.2,
    amenities: ["WiFi", "AC", "Laundry", "Mess", "Security", "TV Room"],
    images: ["https://example.com/hostel2.jpg"],
    type: "PG",
    gender: "Female",
    messType: "Veg"
  }
];

export const samplePGs: PG[] = [
  {
    id: "3",
    name: "Metro PG",
    description: "Located near metro station for easy commute",
    price: 14000,
    location: {
      address: "78 Lajpat Nagar",
      city: "Delhi",
      state: "Delhi",
      country: "India"
    },
    distanceToCollege: 3.5,
    distanceToMetro: 0.3,
    rating: 4.0,
    amenities: ["WiFi", "AC", "Laundry", "Mess", "Security"],
    images: ["https://example.com/pg1.jpg"],
    type: "PG",
    gender: "Male",
    messType: "Both"
  },
  {
    id: "4",
    name: "Scholar's Haven",
    description: "Quiet environment perfect for students",
    price: 13000,
    location: {
      address: "34 Kamla Nagar",
      city: "Delhi",
      state: "Delhi",
      country: "India"
    },
    distanceToCollege: 1.0,
    distanceToMetro: 1.5,
    rating: 4.3,
    amenities: ["WiFi", "AC", "Laundry", "Mess", "Study Room", "Library"],
    images: ["https://example.com/pg2.jpg"],
    type: "PG",
    gender: "Co-ed",
    messType: "Veg"
  }
];
