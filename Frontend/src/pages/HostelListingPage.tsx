import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PGCard from '../components/PGCard';
import Filter, { FilterOptions } from '../components/Filter';
import { accommodationsApi } from '../services/api';

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
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accommodations from API
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const response = await accommodationsApi.getAll();
        setAccommodations(response.data);
        setFilteredAccommodations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch accommodations:', err);
        setError('Failed to load accommodations. Please try again later.');
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: FilterOptions) => {
    setLoading(true);
    
    // Apply filters client-side for now
    // In a production app, you might want to send these filters to the API
    setTimeout(() => {
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
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Filter onFilterChange={handleFilterChange} />
          </div>

          {/* Accommodations List */}
          <div className="flex-1">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredAccommodations.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No accommodations found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccommodations.map((accommodation) => (
                  <Link to={`/accommodations/${accommodation._id}`} key={accommodation._id}>
                    <PGCard
                      PG={{
                        id: accommodation._id,
                        name: accommodation.name,
                        description: accommodation.description,
                        address: `${accommodation.address.area}, ${accommodation.address.city}`,
                        price: accommodation.rent,
                        rating: accommodation.averageRating || 0,
                        reviews: accommodation.reviews.length,
                        photos: accommodation.images,
                        amenities: accommodation.amenities,
                        messType: accommodation.food.vegOnly ? 'veg' : 'both',
                        college: accommodation.nearestCollege[0],
                        distance: {
                          college: accommodation.distanceFromCollege,
                          metro: 0 // Default if not available
                        },
                        contact: {
                          phone: '',
                          email: ''
                        }
                      }}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelListingPage; 