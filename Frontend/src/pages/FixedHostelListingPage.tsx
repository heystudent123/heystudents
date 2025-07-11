import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilterOptions } from '../components/Filter';
import { accommodationsApi } from '../services/api';

// Fallback image as data URI to avoid network requests
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="%2364748b"%3EImage Unavailable%3C/text%3E%3C/svg%3E';

// Extended filter options interface
interface ExtendedFilterOptions extends FilterOptions {
  city?: string;
  type?: string;
  gender?: string;
  maxPrice?: number;
}

// Accommodation interface
interface Accommodation {
  id?: string;
  _id?: string; // Support for both id and _id formats
  name: string;
  type: string;
  address: string | {
    street: string;
    area: string;
    city: string;
    pincode: string;
  };
  city?: string;
  gender?: string;
  price_per_month?: number;
  rating?: number;
  distance_to_college?: number;
  amenities: string[];
  image?: string;
  images?: string[];
  availability?: boolean;
  mess_type?: string;
  rent?: number;
  averageRating?: number;
  food?: {
    available: boolean;
    vegOnly: boolean;
    mealTypes: string[];
  };
  nearestCollege?: string[];
  distanceFromCollege?: number;
  availableFor?: 'Boys' | 'Girls' | 'Both';
}

// HostelCard interface
interface HostelCardProps {
  accommodation: Accommodation;
  onClick: (id: string) => void;
}

// HostelCard component
const HostelCard: React.FC<HostelCardProps> = React.memo(({ accommodation, onClick }) => {
  // Use either id or _id, whichever is available
  const accommodationId = accommodation.id || accommodation._id || '';
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl border border-neutral-100/50 h-full transform hover:-translate-y-2" 
      onClick={() => onClick(accommodationId)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(accommodationId);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${accommodation.name}`}
    >
      {/* Image Section with Glassmorphism Elements */}
      <div className="relative h-56 bg-neutral-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary-200 to-transparent z-0"></div>
        
        {/* Main Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110 z-10" 
          style={{ backgroundImage: `url(${accommodation.image || (accommodation.images?.[0] || FALLBACK_IMAGE)})` }} 
          aria-hidden="true"
        ></div>
        
        {/* Price Tag */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
            ₹{(accommodation.price_per_month || accommodation.rent || 0).toLocaleString('en-IN')}/mo
          </div>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white/30 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md border border-white/20">
            {accommodation.type}
          </div>
        </div>
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-4 px-5 z-20">
          <h3 className="text-xl font-bold text-white leading-tight">{accommodation.name}</h3>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col bg-white">
        {/* Address */}
        <div className="flex items-center gap-2 mb-4 text-sm text-neutral-600">
          <div className="bg-primary-50 p-1.5 rounded-full">
            <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="truncate font-medium">
            {typeof accommodation.address === 'string' ? accommodation.address : `${accommodation.address.street || ''}, ${accommodation.address.area || ''}, ${accommodation.address.city || ''}`}
          </p>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {/* Rating */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-3 rounded-xl flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-lg font-bold text-primary-700">{accommodation.rating || accommodation.averageRating || '4.5'}</span>
            </div>
            <span className="text-xs text-primary-600 mt-1">Rating</span>
          </div>
          
          {/* Distance */}
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 p-3 rounded-xl flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-bold text-neutral-700">{accommodation.distance_to_college || accommodation.distanceFromCollege || '2.5'}</span>
            </div>
            <span className="text-xs text-neutral-500 mt-1">km away</span>
          </div>
          
          {/* Gender */}
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 p-3 rounded-xl flex flex-col items-center justify-center">
            <div className="flex items-center gap-1">
              <svg className="h-4 w-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm font-bold text-neutral-700">{accommodation.availableFor || 'All'}</span>
            </div>
            <span className="text-xs text-neutral-500 mt-1">Available for</span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="mb-5">
          <div className="text-xs text-neutral-500 mb-2 font-medium">TOP AMENITIES</div>
          <div className="flex flex-wrap gap-2">
            {accommodation.amenities?.slice(0, 3).map((amenity, index) => (
              <span key={index} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                {amenity}
              </span>
            ))}
            {accommodation.amenities?.length > 3 && (
              <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                +{accommodation.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-auto">
          <button 
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            onClick={(e) => {
              e.stopPropagation();
              const id = accommodation.id || accommodation._id || '';
              onClick(id);
            }}
          >
            <span>View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
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
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<ExtendedFilterOptions>({
    priceRange: [0, 20000],
    college: '',
    messType: 'all',
    maxDistanceToCollege: 5,
    maxDistanceToMetro: 5,
    amenities: [],
    city: '',
    type: '',
    gender: '',
    maxPrice: 20000
  });
  const [sortOption, setSortOption] = useState<string>('recommended');
  
  // Fetch accommodations data
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const data = await accommodationsApi.getAll();
        setAccommodations(Array.isArray(data) ? data : []);
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

  // Handle card click
  const handleCardClick = useCallback((id: string) => {
    navigate(`/accommodation/${id}`);
  }, [navigate]);

  // Handle filter change
  const handleFilterChange = useCallback((filters: FilterOptions) => {
    setActiveFilters(prev => ({
      ...prev,
      ...filters
    }));
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle search form submit
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search logic is handled in the filtered accommodations memo
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  }, []);

  // Handle filter update
  const handleFilterUpdate = useCallback((field: keyof ExtendedFilterOptions, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setActiveFilters({
      priceRange: [0, 20000],
      college: '',
      messType: 'all',
      maxDistanceToCollege: 5,
      maxDistanceToMetro: 5,
      amenities: [],
      city: '',
      type: '',
      gender: '',
      maxPrice: 20000
    });
    setSearchQuery('');
    setSortOption('recommended');
  }, []);

  // Load more accommodations
  const handleLoadMore = useCallback(() => {
    setVisibleCount(prev => prev + 9);
  }, []);

  // Filter and sort accommodations
  const filteredAndSortedAccommodations = useMemo(() => {
    // First apply filters
    let filtered = [...accommodations];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(acc => {
        return (
          acc.name.toLowerCase().includes(query) ||
          (typeof acc.address === 'string' ? 
            acc.address.toLowerCase().includes(query) : 
            `${acc.address.street || ''} ${acc.address.area || ''} ${acc.address.city || ''}`.toLowerCase().includes(query))
        );
      });
    }

    // City filter
    if (activeFilters.city) {
      filtered = filtered.filter(acc => {
        if (typeof acc.address === 'string') {
          return acc.address.toLowerCase().includes(activeFilters.city!.toLowerCase());
        } else {
          return acc.address.city?.toLowerCase().includes(activeFilters.city!.toLowerCase()) || false;
        }
      });
    }

    // Type filter
    if (activeFilters.type) {
      filtered = filtered.filter(acc => 
        acc.type.toLowerCase() === activeFilters.type!.toLowerCase()
      );
    }

    // Gender filter
    if (activeFilters.gender && activeFilters.gender !== 'Both') {
      filtered = filtered.filter(acc => 
        acc.availableFor === activeFilters.gender || acc.availableFor === 'Both'
      );
    }

    // Price filter
    if (activeFilters.maxPrice) {
      filtered = filtered.filter(acc => 
        (acc.price_per_month || acc.rent || 0) <= (activeFilters.maxPrice || 20000)
      );
    }

    // Amenities filter
    if (activeFilters.amenities.length > 0) {
      filtered = filtered.filter(acc => 
        activeFilters.amenities.every(amenity => 
          acc.amenities?.includes(amenity) || false
        )
      );
    }

    // Distance to college filter
    if (activeFilters.maxDistanceToCollege < 5) {
      filtered = filtered.filter(acc => 
        (acc.distance_to_college || acc.distanceFromCollege || 5) <= activeFilters.maxDistanceToCollege
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        filtered.sort((a, b) => (a.price_per_month || a.rent || 0) - (b.price_per_month || b.rent || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price_per_month || b.rent || 0) - (a.price_per_month || a.rent || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0));
        break;
      case 'distance':
        filtered.sort((a, b) => 
          (a.distance_to_college || a.distanceFromCollege || 5) - 
          (b.distance_to_college || b.distanceFromCollege || 5)
        );
        break;
      // Default is 'recommended'
      default:
        // For recommended, we use a combination of rating and distance
        filtered.sort((a, b) => {
          const aScore = (a.rating || a.averageRating || 3) * 2 - (a.distance_to_college || a.distanceFromCollege || 5);
          const bScore = (b.rating || b.averageRating || 3) * 2 - (b.distance_to_college || b.distanceFromCollege || 5);
          return bScore - aScore;
        });
    }
    
    return filtered;
  }, [accommodations, searchQuery, activeFilters, sortOption]);

  // Visible accommodations (for pagination)
  const visibleAccommodations = useMemo(() => {
    return filteredAndSortedAccommodations.slice(0, visibleCount);
  }, [filteredAndSortedAccommodations, visibleCount]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search and Filter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8 shadow-lg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                placeholder="Search by name, location, or amenities"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </form>
          
          {/* Filter and Sort Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            {/* Filter Button */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter Options
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="appearance-none bg-white/20 hover:bg-white/30 text-white pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <option value="recommended" className="text-neutral-800">Recommended</option>
                  <option value="price-low" className="text-neutral-800">Price: Low to High</option>
                  <option value="price-high" className="text-neutral-800">Price: High to Low</option>
                  <option value="rating" className="text-neutral-800">Highest Rated</option>
                  <option value="distance" className="text-neutral-800">Nearest</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Active Filters Display */}
            <div className="flex items-center flex-wrap gap-2">
              {activeFilters.city && (
                <span className="bg-white/20 text-white text-xs rounded-full px-3 py-1 flex items-center">
                  City: {activeFilters.city}
                  <button onClick={() => handleFilterUpdate('city', '')} className="ml-1.5 hover:text-red-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {activeFilters.type && (
                <span className="bg-white/20 text-white text-xs rounded-full px-3 py-1 flex items-center">
                  Type: {activeFilters.type}
                  <button onClick={() => handleFilterUpdate('type', '')} className="ml-1.5 hover:text-red-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {activeFilters.gender && activeFilters.gender !== 'Both' && (
                <span className="bg-white/20 text-white text-xs rounded-full px-3 py-1 flex items-center">
                  For: {activeFilters.gender}
                  <button onClick={() => handleFilterUpdate('gender', 'Both')} className="ml-1.5 hover:text-red-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {activeFilters.amenities.length > 0 && (
                <span className="bg-white/20 text-white text-xs rounded-full px-3 py-1 flex items-center">
                  {activeFilters.amenities.length} Amenities
                  <button onClick={() => handleFilterUpdate('amenities', [])} className="ml-1.5 hover:text-red-200">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {(activeFilters.city || activeFilters.type || (activeFilters.gender && activeFilters.gender !== 'Both') || activeFilters.amenities.length > 0) && (
                <button
                  onClick={handleClearFilters}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex items-center"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-neutral-800">
              {loading ? 'Loading accommodations...' : 
               error ? 'Error loading accommodations' : 
               `${filteredAndSortedAccommodations.length} Accommodations Found`}
            </h2>
            
            {!loading && !error && filteredAndSortedAccommodations.length > 0 && (
              <div className="text-sm text-neutral-500">
                Showing {Math.min(visibleCount, filteredAndSortedAccommodations.length)} of {filteredAndSortedAccommodations.length}
              </div>
            )}
          </div>
          
          {/* View Toggle - Could be implemented for grid/list view */}
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-primary-600 text-white rounded">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Accommodation Cards */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-neutral-500 animate-pulse">Finding the best accommodations for you...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 shadow-sm">
            <div className="flex items-start">
              <svg className="w-6 h-6 mr-3 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold mb-1">Failed to load accommodations</h3>
                <p className="text-sm text-red-600">We're having trouble connecting to our servers. Please try again later or contact support if the problem persists.</p>
                <button className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : filteredAndSortedAccommodations.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-10 text-center shadow-sm">
            <div className="bg-neutral-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">No accommodations found</h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">We couldn't find any accommodations matching your search criteria. Try adjusting your filters or search terms.</p>
            <button
              onClick={handleClearFilters}
              className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center mx-auto"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAccommodations.map((accommodation, index) => (
              <HostelCard
                key={accommodation.id || accommodation._id || `acc-${index}`}
                accommodation={accommodation}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && !error && filteredAndSortedAccommodations.length > visibleCount && (
          <div className="flex justify-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-white hover:bg-neutral-50 text-primary-700 border border-primary-200 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Load More Accommodations
            </button>
          </div>
        )}
      </div>
  );
};

export default FixedHostelListingPage;
