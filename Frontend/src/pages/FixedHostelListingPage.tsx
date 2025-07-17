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

  // Reset image index when mouse leaves
  useEffect(() => {
    if (!isHovered) {
      setCurrentImageIndex(0);
    }
  }, [isHovered]);

  useEffect(() => {
    if (!accommodation.images || accommodation.images.length <= 1 || !isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % accommodation.images!.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [accommodation.images, isHovered]);

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
      className="bg-[#fff9ed] rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 ease-in-out relative transform hover:scale-[1.02] hover:shadow-md border border-neutral-100"
      style={{
        zIndex: isHovered ? 10 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/accommodation/${accommodation._id || accommodation.id}`)}
    >
      {/* Image Carousel */}
      <div className="relative h-56 overflow-hidden">
        {accommodation.images && accommodation.images.length > 0 ? (
          <>
            <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{
              transform: `translateX(-${currentImageIndex * 100}%)`
            }}>
              {accommodation.images.map((imageUrl, index) => (
                <img 
                  key={index}
                  className="flex-shrink-0 w-full h-full object-cover" 
                  src={imageUrl} 
                  alt={`${accommodation.name} image ${index+1}`} 
                  loading="lazy" 
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              ))}
            </div>

            {/* Image indicators */}
            {accommodation.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                {accommodation.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  ></button>
                ))}
              </div>
            )}
          </>
        ) : (
          <img 
            className="w-full h-full object-cover" 
            src={getImageUrl(accommodation)} 
            alt={accommodation.name} 
          />
        )}
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-black text-white px-3 py-1 rounded-lg text-sm font-medium">
          {formatPrice(accommodation)}
        </div>

        {/* Verified badge */}
        {accommodation.verified && (
          <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1 text-[#030301]">{accommodation.name}</h3>
          
          {/* Rating display */}
          {(accommodation.rating || getAverageRating(accommodation)) && (
            <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded-lg">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span className="ml-1 text-sm font-semibold">{accommodation.rating || getAverageRating(accommodation)}</span>
            </div>
          )}
        </div>


        
        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {accommodation.amenities?.slice(0, 3).map((amenity, index) => (
            <span 
              key={index}
              className="inline-block bg-neutral-100 rounded-full px-3 py-1 text-xs font-medium text-neutral-800"
            >
              {amenity}
            </span>
          ))}
          {accommodation.amenities && accommodation.amenities.length > 3 && (
            <span className="inline-block bg-neutral-100 rounded-full px-3 py-1 text-xs font-medium text-neutral-600">
              +{accommodation.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* For gender or availableFor */}
        {(accommodation.gender || accommodation.availableFor) && (
          <div className="text-sm text-neutral-600 mb-3">
            <span className="text-xs font-medium text-neutral-500 block mb-1">For:</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#fff9ed] border border-neutral-200 text-xs font-medium text-neutral-800">
                {accommodation.availableFor || accommodation.gender}
              </span>
            </div>
          </div>
        )}
        
        {/* View Details button */}
        <div className="mt-auto pt-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/accommodation/${accommodation._id || accommodation.id}`);
            }}
            className="w-full bg-black text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            View Details
          </button>
        </div>
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
  const [genderFilter, setGenderFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
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

  // Filter accommodations based on gender and price filters
  const filteredAccommodations = useMemo(() => {
    return accommodations.filter(accom => {
      // Gender filter
      if (genderFilter !== 'all') {
        const accommodationGender = accom.gender || accom.availableFor || '';
        if (genderFilter === 'boys' && !accommodationGender.toLowerCase().includes('male') && !accommodationGender.toLowerCase().includes('boys')) {
          return false;
        }
        if (genderFilter === 'girls' && !accommodationGender.toLowerCase().includes('female') && !accommodationGender.toLowerCase().includes('girls')) {
          return false;
        }
      }
      
      // Price filter
      if (priceFilter !== 'all') {
        // Extract numeric value from startingFrom field or use price field as fallback
        let price = 0;
        if (accom.startingFrom) {
          // Extract numeric value from startingFrom string (e.g., "Starting from ₹8,000" -> 8000)
          const match = accom.startingFrom.match(/[₹]?([0-9,]+)/);
          if (match) {
            price = parseInt(match[1].replace(/,/g, ''));
          }
        } else if (accom.price) {
          price = accom.price;
        }
        
        if (price > 0) {
          switch (priceFilter) {
            case 'under-5000':
              return price < 5000;
            case '5000-10000':
              return price >= 5000 && price <= 10000;
            case '10000-15000':
              return price >= 10000 && price <= 15000;
            case 'above-15000':
              return price > 15000;
            default:
              return true;
          }
        }
      }
      
      return true;
    });
  }, [accommodations, genderFilter, priceFilter]);

  // Helper function to extract price from accommodation
  const extractPrice = (accom: Accommodation): number => {
    if (accom.startingFrom) {
      // Extract numeric value from startingFrom string (e.g., "Starting from ₹8,000" -> 8000)
      const match = accom.startingFrom.match(/[₹]?([0-9,]+)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ''));
      }
    }
    return accom.price || 0;
  };

  // Sort accommodations
  const sortedAccommodations = useMemo(() => {
    const accoms = [...filteredAccommodations];
    switch (sortOption) {
      case 'price-low-high':
        return accoms.sort((a, b) => extractPrice(a) - extractPrice(b));
      case 'price-high-low':
        return accoms.sort((a, b) => extractPrice(b) - extractPrice(a));
      default:
        return accoms;
    }
  }, [filteredAccommodations, sortOption]);

  return (
    <div className="space-y-8">
      {/* Filter Section */}
      <div className="bg-[#fff9ed] p-6 rounded-xl shadow-sm border border-neutral-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Gender Filter */}
          <div className="w-full md:w-60">
            <div className="relative">
              <select
                className="block appearance-none w-full pl-4 pr-10 py-3 text-base border border-neutral-200 rounded-xl focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-[#fff9ed] transition-colors"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="all">All Genders</option>
                <option value="boys">Boys Only</option>
                <option value="girls">Girls Only</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Price Filter */}
          <div className="w-full md:w-60">
            <div className="relative">
              <select
                className="block appearance-none w-full pl-4 pr-10 py-3 text-base border border-neutral-200 rounded-xl focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-[#fff9ed] transition-colors"
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="under-5000">Under ₹5,000</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-15000">₹10,000 - ₹15,000</option>
                <option value="above-15000">Above ₹15,000</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Sort Dropdown */}
          <div className="w-full md:w-60">
            <div className="relative">
              <select
                className="block appearance-none w-full pl-4 pr-10 py-3 text-base border border-neutral-200 rounded-xl focus:outline-none focus:ring-black focus:border-black sm:text-sm bg-[#fff9ed] transition-colors"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Sort By: Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl" role="alert">
            <div className="flex">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <strong className="font-medium">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          </div>
        ) : sortedAccommodations.length === 0 ? (
          <div className="bg-[#fff9ed] border border-neutral-100 rounded-xl shadow-sm text-center py-16 px-4">
            <svg className="mx-auto h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-neutral-900">No accommodations found</h3>
            <p className="mt-2 text-neutral-500 max-w-md mx-auto">
              {(genderFilter !== 'all' || priceFilter !== 'all') ? "No accommodations match your selected filters." : "There are no accommodations available at the moment."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutral-600">
                Showing <span className="font-medium">{sortedAccommodations.length}</span> {sortedAccommodations.length === 1 ? 'accommodation' : 'accommodations'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
