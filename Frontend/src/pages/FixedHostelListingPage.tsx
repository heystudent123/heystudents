import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter, { FilterOptions } from '../components/Filter';
import { accommodationsApi } from '../services/api';

// Fallback image as data URI to avoid network requests
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="%2364748b"%3EImage Unavailable%3C/text%3E%3C/svg%3E';

// Accommodation interface
interface Accommodation {
  _id: string;
  name: string;
  description: string;
  type: 'PG' | 'Hostel' | 'Flat' | 'Other';
  address: {
    street: string;
    area: string;
    city: string;
    pincode: string;
  };
  rent: number;
  averageRating?: number;
  reviews: Array<any>;
  images: string[];
  amenities: string[];
  food: {
    available: boolean;
    vegOnly: boolean;
    mealTypes: string[];
  };
  nearestCollege: string[];
  distanceFromCollege: number;
  availableFor: 'Boys' | 'Girls' | 'Both';
}

// Pure component for displaying a single hostel card
const HostelCard = React.memo(({ accommodation, onClick }: { accommodation: Accommodation, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-md border-0 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl group"
      style={{ minHeight: '450px', width: '100%' }}
    >
      <div 
        className="relative"
        style={{
          height: '200px',
          backgroundImage: `url(${FALLBACK_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f3f4f6'
        }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1.5 rounded-full font-semibold shadow-md">
          <span className="text-sm">₹</span>
          <span className="text-base">{accommodation.rent.toLocaleString()}</span>
          <span className="text-xs text-white/90">/mo</span>
        </div>
        
        {/* Accommodation type badge */}
        <div className="absolute top-3 left-3 bg-secondary/90 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {accommodation.type}
        </div>
      </div>
      
      <div className="p-5 flex flex-col" style={{ height: 'calc(100% - 200px)' }}>
        <h3 className="text-lg font-display font-bold text-neutral-dark truncate">{accommodation.name}</h3>
        <p className="text-neutral-medium text-sm mt-1 truncate flex items-center">
          <svg className="w-3.5 h-3.5 mr-1 text-neutral-medium" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {accommodation.address.area}, {accommodation.address.city}
        </p>
        
        <div className="mt-4 pt-4 border-t border-neutral-100 flex-grow">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center text-xs text-neutral-medium">
              <span className="flex items-center">
                <span className="mr-1.5">🏫</span> 
                <span>{accommodation.distanceFromCollege}km to {accommodation.nearestCollege[0]}</span>
              </span>
            </div>
            <div className="flex items-center text-xs text-neutral-medium">
              <span className="flex items-center">
                <span className="mr-1.5">{accommodation.food.vegOnly ? '🥗' : '🍽️'}</span>
                <span>{accommodation.food.vegOnly ? 'Veg Only' : 'Veg & Non-veg'}</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
              {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index} 
                  className="bg-neutral-50 text-xs px-2.5 py-1 rounded-full text-neutral-dark border border-neutral-100"
                >
                  {amenity}
                </span>
              ))}
              {accommodation.amenities.length > 3 && (
                <span className="bg-accent/10 text-xs px-2.5 py-1 rounded-full text-accent font-medium">
                  +{accommodation.amenities.length - 3}
                </span>
              )}
            </div>
            
            {/* Facility tags */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {['WiFi', 'AC', 'Laundry'].map((facility, index) => (
                <span key={index} className="inline-flex items-center bg-neutral-50 text-xs px-2 py-0.5 rounded-full text-neutral-dark border border-neutral-100">
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Loading placeholder component
const LoadingCard = React.memo(() => {
  return (
    <div className="bg-white rounded-xl shadow-md border-0 overflow-hidden" style={{ minHeight: '450px', width: '100%' }}>
      {/* Image placeholder */}
      <div className="h-[200px]">
        <div className="w-full h-full bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse"></div>
      </div>
      
      {/* Content placeholders */}
      <div className="p-5 flex flex-col" style={{ height: 'calc(100% - 200px)' }}>
        {/* Title placeholder */}
        <div className="h-6 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-full w-3/4 mb-3"></div>
        
        {/* Subtitle placeholder */}
        <div className="h-4 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-full w-1/2 mb-5"></div>
        
        {/* Divider */}
        <div className="border-t border-neutral-100 pt-4 mt-4 flex-grow">
          {/* Feature placeholders */}
          <div className="h-4 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-full w-full mb-3"></div>
          <div className="h-4 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-full w-2/3 mb-4"></div>
          
          {/* Tag placeholders */}
          <div className="flex gap-2 mt-3">
            <div className="h-6 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-full w-16"></div>
            <div className="h-6 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-full w-16"></div>
            <div className="h-6 bg-gradient-to-r from-neutral-100 to-neutral-200 animate-pulse rounded-full w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Main component with fixed rendering strategy to prevent infinite updates
const FixedHostelListingPage: React.FC = () => {
  const navigate = useNavigate();
  // State declarations - keep these minimal
  const [allAccommodations, setAllAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [sortBy, setSortBy] = useState<string>('price-low');
  
  // Critical: Fetch data only once on mount using a ref to track initialization
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await accommodationsApi.getAll();
        if (isMounted) {
          setAllAccommodations(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch accommodations:', err);
          setError('Failed to load accommodations. Please try again later.');
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once
  
  // Use callbacks for all event handlers to prevent recreation on each render
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    setActiveFilters(filters);
  }, []);
  
  const handleCardClick = useCallback((id: string) => {
    navigate(`/accommodations/${id}`);
  }, [navigate]);
  
  // Use memoization for derived state to prevent recalculation on every render
  const filteredAccommodations = useMemo(() => {
    if (!activeFilters) return allAccommodations;
    
    return allAccommodations.filter((acc) => {
      // Filter by price
      if (acc.rent < activeFilters.priceRange[0] || acc.rent > activeFilters.priceRange[1]) {
        return false;
      }

      // Filter by college if specified
      if (activeFilters.college && !acc.nearestCollege.includes(activeFilters.college)) {
        return false;
      }

      // Filter by mess type
      if (activeFilters.messType) {
        if (activeFilters.messType === 'veg' && (!acc.food.available || !acc.food.vegOnly)) {
          return false;
        } else if (activeFilters.messType === 'non-veg' && (!acc.food.available || acc.food.vegOnly)) {
          return false;
        } else if (activeFilters.messType === 'both' && !acc.food.available) {
          return false;
        }
      }

      // Filter by amenities
      if (activeFilters.amenities.length > 0) {
        const hasAllAmenities = activeFilters.amenities.every((amenity) =>
          acc.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });
  }, [allAccommodations, activeFilters]);
  
  // Memoize sorted accommodations as well
  const sortedAccommodations = useMemo(() => {
    const sorted = [...filteredAccommodations];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.rent - b.rent);
      case 'price-high':
        return sorted.sort((a, b) => b.rent - a.rent);
      case 'rating':
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'distance':
        return sorted.sort((a, b) => a.distanceFromCollege - b.distanceFromCollege);
      default:
        return sorted;
    }
  }, [filteredAccommodations, sortBy]);
  
  // Simple UI with minimal state updates
  return (
    <div className="min-h-screen bg-neutral">
      {/* Hero Section with pattern overlay */}
      <div className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary pt-24 pb-16 mb-8">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '80px 80px'
          }}
        ></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-4 tracking-tight">
              Find Your Perfect <span className="text-accent">Student Accommodation</span>
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
              Browse through our curated list of hostels, PGs, and flats near your college.
            </p>
            
            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-8 mb-4">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl text-white">
                <div className="text-2xl font-bold">{allAccommodations.length}+</div>
                <div className="text-sm text-white/80">Accommodations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl text-white">
                <div className="text-2xl font-bold">10+</div>
                <div className="text-sm text-white/80">Colleges Covered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-xl text-white">
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-sm text-white/80">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg className="absolute bottom-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 1440 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1440 27.4774C1352.73 27.4774 1270.41 23.0966 1194.27 18.9862C1136.82 16.0541 1082.47 13.3605 1033.63 11.6848C972.257 9.58958 917.811 8.63441 871.782 8.76578C825.759 8.89715 788.169 9.79539 751.249 11.0918C710.2 12.5266 672.48 14.5746 633.15 16.7658C576.01 19.9636 517.287 23.5429 454.267 26.7636C390.357 30.0359 321.949 32.9085 244.253 35.0899C178.651 36.9211 108.789 38.2118 33.9292 38.9529C22.6387 39.0643 11.3361 39.1255 0 39.1255V54H1440V27.4774Z" fill="#f5f5f5"/>
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white p-6 rounded-xl shadow-md border-0">
              <h2 className="text-xl font-display font-bold text-neutral-dark mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </h2>
              <Filter onFilterChange={handleFilterChange} />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-5 rounded-xl shadow-md border-0">
              <h2 className="text-xl font-display font-bold text-neutral-dark flex items-center">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full inline-flex items-center justify-center mr-2">
                  {sortedAccommodations.length}
                </span>
                {sortedAccommodations.length === 1 ? 'Accommodation' : 'Accommodations'} Found
              </h2>
              
              <div className="mt-4 sm:mt-0 flex items-center">
                <label htmlFor="sort" className="mr-3 text-sm font-medium text-neutral-medium">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-neutral-200 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance to College</option>
                </select>
              </div>
            </div>
            
            {/* Error state */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-lg mb-6 shadow-md">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}
            
            {/* Accommodations grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
              {loading ? (
                // Static loading placeholders
                Array(6).fill(0).map((_, idx) => (
                  <LoadingCard key={`loading-${idx}`} />
                ))
              ) : sortedAccommodations.length === 0 ? (
                // Empty state
                <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-md border-0">
                  <div className="mx-auto w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-neutral-dark mb-3">No accommodations found</h3>
                  <p className="text-neutral-medium max-w-md mx-auto text-lg">
                    We couldn't find any accommodations matching your criteria. Try adjusting your filters or search query.
                  </p>
                  <button 
                    onClick={() => setActiveFilters(null)}
                    className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                // Accommodation cards - using React.memo component to prevent unnecessary re-renders
                sortedAccommodations.map((accommodation) => (
                  <HostelCard 
                    key={accommodation._id} 
                    accommodation={accommodation}
                    onClick={() => handleCardClick(accommodation._id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedHostelListingPage;
