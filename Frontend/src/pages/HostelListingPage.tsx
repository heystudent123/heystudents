import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Filter, { FilterOptions } from '../components/Filter';
import { accommodationsApi } from '../services/api';
import StaticHostelGrid from '../components/StaticHostelGrid';

// We'll handle animations in React instead of at the document level

// Constants for layout stability
const CARD_HEIGHT = 400; // Fixed card height in pixels
const IMAGE_ASPECT_RATIO = 0.5625; // 16:9 aspect ratio (9/16 = 0.5625)

// SVG fallback images encoded as data URIs to avoid network requests
// Simple placeholder image
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="%2364748b"%3EImage Unavailable%3C/text%3E%3C/svg%3E';

// Simplified approach without global state

// Define the Accommodation interface based on the backend model
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

const HostelListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simplified function to handle filtering
  const handleFilterChange = (filters: FilterOptions) => {
    setLoading(true);
    
    // Apply filters client-side with a timeout to allow UI to update
    setTimeout(() => {
      try {
        const filtered = accommodations.filter((acc: Accommodation) => {
          // Filter by price
          if (acc.rent < filters.priceRange[0] || acc.rent > filters.priceRange[1]) {
            return false;
          }

          // Filter by college if specified
          if (filters.college && !acc.nearestCollege.includes(filters.college)) {
            return false;
          }

          // Filter by mess type
          if (filters.messType) {
            if (filters.messType === 'veg' && (!acc.food.available || !acc.food.vegOnly)) {
              return false;
            } else if (filters.messType === 'non-veg' && (!acc.food.available || acc.food.vegOnly)) {
              return false;
            } else if (filters.messType === 'both' && !acc.food.available) {
              return false;
            }
          }

          // Filter by amenities
          if (filters.amenities.length > 0) {
            const hasAllAmenities = filters.amenities.every((amenity) =>
              acc.amenities.includes(amenity)
            );
            if (!hasAllAmenities) {
              return false;
            }
          }

          return true;
        });

        setFilteredAccommodations(filtered);
      } catch (err) {
        console.error('Error applying filters:', err);
        setError('Error filtering accommodations. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  // Load accommodations once on component mount
  useEffect(() => {
    // Initial data loading
    setLoading(true);
    accommodationsApi.getAll()
      .then(response => {
        setAccommodations(response.data);
        setFilteredAccommodations(response.data);
      })
      .catch(err => {
        console.error('Failed to fetch accommodations:', err);
        setError('Failed to load accommodations. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array - run once on mount

  // Skip replacing the previous handleFilterChange function since we already have a new one above

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('price-low');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const listingRef = useRef<HTMLDivElement>(null);

  // Function to scroll to listings section
  const scrollToListings = () => {
    listingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle quick search
  const handleQuickSearch = () => {
    // Apply search query filter
    const filtered = accommodations.filter((acc: Accommodation) => {
      const matchesQuery = searchQuery.trim() === '' || 
        acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.address.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.address.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || acc.type.toLowerCase() === selectedType.toLowerCase();
      
      return matchesQuery && matchesType;
    });
    
    setFilteredAccommodations(filtered);
    scrollToListings();
  };

  // Function to sort accommodations
  const sortAccommodations = (accs: Accommodation[]) => {
    switch (sortBy) {
      case 'price-low':
        return [...accs].sort((a, b) => a.rent - b.rent);
      case 'price-high':
        return [...accs].sort((a, b) => b.rent - a.rent);
      case 'rating':
        return [...accs].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'distance':
        return [...accs].sort((a, b) => a.distanceFromCollege - b.distanceFromCollege);
      default:
        return accs;
    }
  };

  // Simple sorting without dependencies that can cause loops
  const sortedAccommodations = sortAccommodations(filteredAccommodations);
  
  // No extra effects for now - let's simplify
  
  // We don't need the renderGrid function anymore as we're using StaticHostelGrid
  
  // Preload the fallback image
  useEffect(() => {
    const img = new Image();
    img.src = FALLBACK_IMAGE;
  }, []);

  return (
    <div className="min-h-screen bg-neutral pt-16">
      {/* Hero Section */}
      <div className="relative min-h-[70vh] overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-secondary">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
          <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-secondary-light/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-primary-light/20 blur-3xl"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:30px_30px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-display font-bold tracking-tight text-white">
              <span className="block mb-2">Find Your Perfect</span>
              <span className="text-accent">Student Accommodation</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Discover the best PGs, hostels and flats near your college. Filter by price, amenities, and more to find your ideal home away from home.
            </p>
            
            {/* Quick Search Box */}
            <div className="w-full max-w-3xl mt-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by location, PG name, or college..."
                      className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                  >
                    <option value="all" className="text-gray-800">All Types</option>
                    <option value="PG" className="text-gray-800">PG</option>
                    <option value="Hostel" className="text-gray-800">Hostel</option>
                    <option value="Flat" className="text-gray-800">Flat</option>
                    <option value="Other" className="text-gray-800">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleQuickSearch}
                  className="btn-accent py-3 px-8 w-full md:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Find Accommodation
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">500+</div>
                <div className="text-sm text-white/80">Accommodations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">50+</div>
                <div className="text-sm text-white/80">Colleges Covered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">4.8/5</div>
                <div className="text-sm text-white/80">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">24/7</div>
                <div className="text-sm text-white/80">Support</div>
              </div>
            </div>
            
            {/* Scroll down button */}
            <button 
              onClick={scrollToListings}
              className="mt-12 text-white hover:text-accent transition-colors duration-300 animate-bounce"
            >
              <span className="sr-only">Scroll down</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div ref={listingRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile filter button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0 sticky top-24 self-start">
            <Filter onFilterChange={handleFilterChange} />
          </div>

          {/* Accommodations List */}
          <div className="flex-1">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-neutral-dark">
                {filteredAccommodations.length} {filteredAccommodations.length === 1 ? 'Accommodation' : 'Accommodations'} Found
              </h2>
              
              <div className="mt-3 sm:mt-0 flex items-center">
                <label htmlFor="sort" className="mr-2 text-sm text-gray-500">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance to College</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6 animate-fade-in">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            <div style={{ width: '100%', padding: '24px 0' }}>
              {/* Error state */}
              {error && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>⚠️</span>
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {/* Render the static grid component */}
              <StaticHostelGrid 
                accommodations={sortedAccommodations} 
                loading={loading} 
              />
              
              {/* Reset filters button when no results */}
              {!loading && !error && sortedAccommodations.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button 
                    onClick={() => {
                      const defaultFilters: FilterOptions = {
                        priceRange: [0, 20000],
                        college: '',
                        messType: 'all',
                        maxDistanceToCollege: 5,
                        maxDistanceToMetro: 5,
                        amenities: []
                      };
                      setSearchQuery('');
                      setSelectedType('all');
                      handleFilterChange(defaultFilters);
                    }}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
            {/* Pagination */}
            {sortedAccommodations.length > 0 && (
              <div className="mt-12 flex items-center justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    aria-current="page"
                    className="z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </button>
                  <button
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </button>
                  <button
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <button
                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    8
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-neutral-dark/70 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md transform transition-all ease-in-out duration-300 translate-x-0">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <div className="flex items-center justify-between px-4 py-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 focus:outline-none"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <Filter onFilterChange={(filters) => {
                    handleFilterChange(filters);
                    setMobileFiltersOpen(false);
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelListingPage; 