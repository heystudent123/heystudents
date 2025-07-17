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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!accommodation.images || accommodation.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % accommodation.images!.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [accommodation.images]);

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
    <div 
      className="bg-[#fff9ed] rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out relative transform hover:scale-105"
      style={{
        zIndex: isHovered ? 10 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        {accommodation.images && accommodation.images.length > 0 ? (
          <>
            <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{
              transform: `translateX(-${currentImageIndex * 100}%)`
            }}>
              {accommodation.images.map((img, idx) => (
                <div key={idx} className="w-full flex-shrink-0">
                  <img 
                    src={img} 
                    alt={`${accommodation.name} ${idx+1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              ))}
            </div>
            {/* Navigation Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {accommodation.images.map((_, idx) => (
                <button 
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-gray-300'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <img 
            src={FALLBACK_IMAGE} 
            alt={accommodation.name || 'Accommodation'} 
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold text-[#1a1d23]">
            {formatPrice(accommodation)}
            <span className="text-sm text-[#6b7280] font-normal">/month</span>
          </span>
          
          {/* Rating */}
          {getAverageRating(accommodation) !== null && (
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#f7dc6f]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-[#374151]">
                {getAverageRating(accommodation)}
              </span>
            </div>
          )}
        </div>
        
        {/* Name */}
        <h3 className="text-lg font-semibold text-[#1a1d23] mb-1">
          {accommodation.name}
        </h3>
        
        {/* Location */}
        <p className="text-[#6b7280] text-sm mb-3">
          {[accommodation.address?.area || accommodation.location?.address, accommodation.address?.city || accommodation.location?.city]
            .filter(Boolean)
            .join(', ')}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {accommodation.type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dbeafe] text-[#3b82f6]">
              {accommodation.type}
            </span>
          )}
          {accommodation.availableFor && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#c6efce] text-[#2ecc71]">
              {accommodation.availableFor}
            </span>
          )}
          {accommodation.verified && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#c7d2fe] text-[#7a69ff]">
              Verified
            </span>
          )}
        </div>
        
        {/* View Button */}
        <button 
          onClick={() => navigate(`/accommodation/${accommodation._id || accommodation.id}`)}
          className="w-full mt-2 bg-gradient-to-r from-[#3b82f6] to-[#63b3ed] hover:from-[#3b82f6] hover:to-[#63b3ed] text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          View Details
        </button>
      </div>
      
      {/* Amenities Section */}
      {isHovered && accommodation.amenities && accommodation.amenities.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 transition-all duration-300 ease-in-out transform translate-y-0">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h4>
          <ul className="grid grid-cols-2 gap-2">
            {accommodation.amenities.slice(0, 4).map((amenity, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {amenity}
              </li>
            ))}
            {accommodation.amenities.length > 4 && (
              <li className="text-sm text-gray-500">
                +{accommodation.amenities.length - 4} more
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
});

// Main component
const FixedHostelListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  
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
    if (!searchTerm) return accommodations;
    const term = searchTerm.toLowerCase();
    return accommodations.filter(accom => 
      (accom.name && accom.name.toLowerCase().includes(term)) ||
      (accom.address?.city && accom.address.city.toLowerCase().includes(term)) ||
      (accom.address?.area && accom.address.area.toLowerCase().includes(term)) ||
      (accom.location?.address && accom.location.address.toLowerCase().includes(term)) ||
      (accom.location?.city && accom.location.city.toLowerCase().includes(term))
    );
  }, [accommodations, searchTerm]);

  // Sort accommodations
  const sortedAccommodations = useMemo(() => {
    const accoms = [...filteredAccommodations];
    switch (sortOption) {
      case 'price-low-high':
        return accoms.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high-low':
        return accoms.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return accoms.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'verified':
        return accoms.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
      default:
        return accoms;
    }
  }, [filteredAccommodations, sortOption]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="bg-[#fff9ed] p-4 rounded-lg shadow-sm">
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-[#fff9ed] placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by name, city or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Sort Dropdown */}
          <div className="w-full md:w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-[#fff9ed]"
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
          <div className="bg-[#fff9ed] text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
