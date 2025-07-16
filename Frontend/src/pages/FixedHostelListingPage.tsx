import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { accommodationsApi } from '../services/api';

// Fallback image as data URI to avoid network requests
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="%2364748b"%3EImage Unavailable%3C/text%3E%3C/svg%3E';

// Define interfaces for type safety
interface Accommodation {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  startingFrom?: string;
  uniqueCode?: string; // Added uniqueCode field
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: [number, number];
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
  amenities?: string[];
  images?: string[];
  type?: string;
  gender?: string; // For backward compatibility
  availableFor?: string; // Backend field
  address?: {
    street?: string;
    area?: string;
    city?: string;
    pincode?: string;
  };
  nearestCollege?: string[];
  nearestMetro?: string;
  verified?: boolean;
}

// Helper: compute average rating for an accommodation
const getAverageRating = (accom: Accommodation): number | null => {
  if (!accom.reviews || accom.reviews.length === 0) return null;
  const total = accom.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  return +(total / accom.reviews.length).toFixed(1);
};

// Filter options interface
interface FilterOptions {
  priceRange?: [number, number];
  college?: string;
  messType?: string;
  maxDistanceToCollege?: number;
  maxDistanceToMetro?: number;
  amenities?: string[];
  city?: string;
  type?: string;
  gender?: string;
}

// Props for HostelCard component
interface HostelCardProps {
  accommodation: Accommodation;
}

// HostelCard component - memoized for performance
const HostelCard = React.memo(({ accommodation }: HostelCardProps) => {
  const navigate = useNavigate();
  
  // Function to get image URL with fallback
  const getImageUrl = (accommodation: Accommodation) => {
    if (accommodation.images?.[0]) {
      return accommodation.images[0];
    }
    return FALLBACK_IMAGE;
  };

  // Format price with startingFrom field
  const formatPrice = (accommodation: Accommodation) => {
    if (accommodation.startingFrom) {
      return `Starting from ${accommodation.startingFrom}`;
    } else if (accommodation.price) {
      return `Starting from ₹${accommodation.price.toLocaleString('en-IN')}`;
    } else {
      return 'Starting from ₹0';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={getImageUrl(accommodation)} 
          alt={accommodation.name || 'Accommodation'} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(accommodation)}
            <span className="text-sm text-gray-500 font-normal">/month</span>
          </span>
          
          {/* Rating */}
          {getAverageRating(accommodation) !== null && (
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-blue-800 font-medium">{getAverageRating(accommodation)}</span>
            </div>
          )}
        </div>
        
        {/* Name and Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{accommodation.name}</h3>
        <p className="text-gray-600 text-sm mb-2">
          {accommodation.location?.address || 'Address not provided'}
        </p>
        
        {/* Tags and other info */}
        <div className="flex flex-wrap gap-2 mb-3">
          {accommodation.type && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {accommodation.type}
            </span>
          )}
          {accommodation.availableFor && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              {accommodation.availableFor}
            </span>
          )}
          {accommodation.distanceToCollege && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {accommodation.distanceToCollege} km to college
            </span>
          )}
        </div>
        
        {/* Amenities */}
        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="mb-3">
            <p className="text-gray-700 text-sm mb-1">Amenities:</p>
            <div className="flex flex-wrap gap-1">
              {accommodation.amenities.slice(0, 4).map((amenity, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {amenity}
                </span>
              ))}
              {accommodation.amenities.length > 4 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  +{accommodation.amenities.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {/* View Details Button */}
      <div className="mt-4">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
          onClick={() => {
            const id = accommodation._id || accommodation.id || '';
            navigate(`/accommodation/${id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
});

// Main component
const FixedHostelListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  
  // Fetch accommodations on component mount
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const rawData = await accommodationsApi.getAll();
        console.log('Fetched accommodations raw data:', rawData);
        // Support different backend response shapes
        const list = Array.isArray(rawData)
          ? rawData
          : rawData?.accommodations || rawData?.data || rawData?.results || [];
        setAccommodations(Array.isArray(list) ? list : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching accommodations:', err);
        setError('Failed to load accommodations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Filter accommodations based on search term
  const filteredAccommodations = useMemo(() => {
    if (!searchTerm.trim()) return accommodations;
    
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return accommodations.filter(accommodation => 
      accommodation.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      accommodation.location?.city?.toLowerCase().includes(lowerCaseSearchTerm) ||
      accommodation.location?.address?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [accommodations, searchTerm]);

  // Sort accommodations based on selected option
  const sortedAccommodations = useMemo(() => {
    const accommodationsToSort = [...filteredAccommodations];
    
    switch (sortOption) {
      case 'price-low-high':
        return accommodationsToSort.sort((a, b) => 
          (a.price || Number.MAX_SAFE_INTEGER) - (b.price || Number.MAX_SAFE_INTEGER)
        );
      case 'price-high-low':
        return accommodationsToSort.sort((a, b) => 
          (b.price || 0) - (a.price || 0)
        );
      case 'rating':
        return accommodationsToSort.sort((a, b) => 
          ((getAverageRating(b) || 0) - (getAverageRating(a) || 0))
        );
      case 'verified':
        return accommodationsToSort.sort((a, b) => ((b.verified ? 1 : 0) - (a.verified ? 1 : 0)));
      default:
        return accommodationsToSort;
    }
  }, [filteredAccommodations, sortOption]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by name, city or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Sort Dropdown */}
          <div className="w-full md:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="verified">Verified First</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : sortedAccommodations.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accommodations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No results match "${searchTerm}"` : "There are no accommodations available at the moment."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {sortedAccommodations.length} {sortedAccommodations.length === 1 ? 'accommodation' : 'accommodations'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAccommodations.map((accommodation) => (
                <HostelCard
                  key={accommodation._id || accommodation.id}
                  accommodation={accommodation}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FixedHostelListingPage;
