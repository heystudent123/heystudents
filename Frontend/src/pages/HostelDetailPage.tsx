import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  securityDeposit?: number;
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
  nearestMetro?: string;
  distanceFromMetro?: number;
  availableFor: 'Boys' | 'Girls' | 'Both';
  contactDetails: {
    name: string;
    phone: string;
    alternatePhone?: string;
    email?: string;
  };
}

const HostelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [similarAccommodations, setSimilarAccommodations] = useState<Accommodation[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        // Fetch the accommodation details
        const response = await accommodationsApi.getById(id);
        setAccommodation(response.data);
        
        // Fetch other accommodations for the "Similar PGs" section
        const allAccommodationsResponse = await accommodationsApi.getAll();
        const otherAccommodations = allAccommodationsResponse.data.filter(
          (acc: Accommodation) => acc._id !== id
        ).slice(0, 3);
        
        setSimilarAccommodations(otherAccommodations);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching accommodation details:', err);
        setError('Failed to load accommodation details. Please try again later.');
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/accommodation" className="text-primary hover:text-primary/80">
            Back to Accommodations
          </Link>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accommodation Not Found</h1>
          <Link to="/accommodation" className="text-primary hover:text-primary/80">
            Back to Accommodations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={accommodation.images[activeImage]}
              alt={accommodation.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 flex space-x-2 overflow-x-auto">
              {accommodation.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                    activeImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${accommodation.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{accommodation.name}</h1>
                <p className="text-gray-500">{`${accommodation.address.area}, ${accommodation.address.city}`}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary mb-1">
                  ₹{accommodation.rent.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-gray-700">{accommodation.averageRating || 'N/A'}</span>
                  <span className="text-gray-500 text-sm ml-1">({accommodation.reviews.length} reviews)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600">{accommodation.description}</p>
                
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Contact Details</h2>
                <div className="space-y-2">
                  <p className="text-gray-700"><span className="font-medium">Name:</span> {accommodation.contactDetails.name}</p>
                  <p className="text-gray-700"><span className="font-medium">Phone:</span> {accommodation.contactDetails.phone}</p>
                  {accommodation.contactDetails.alternatePhone && (
                    <p className="text-gray-700"><span className="font-medium">Alternate Phone:</span> {accommodation.contactDetails.alternatePhone}</p>
                  )}
                  {accommodation.contactDetails.email && (
                    <p className="text-gray-700"><span className="font-medium">Email:</span> {accommodation.contactDetails.email}</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {accommodation.amenities.map((amenity: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Food</h2>
                {accommodation.food.available ? (
                  <div className="space-y-2">
                    <p className="text-gray-700"><span className="font-medium">Type:</span> {accommodation.food.vegOnly ? 'Vegetarian Only' : 'Both Veg & Non-veg'}</p>
                    <p className="text-gray-700"><span className="font-medium">Meals:</span> {accommodation.food.mealTypes.join(', ')}</p>
                  </div>
                ) : (
                  <p className="text-gray-700">Food service not available</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="ml-2 text-gray-700">{accommodation.distanceFromCollege} km to {accommodation.nearestCollege[0]}</span>
                </div>
                {accommodation.distanceFromMetro && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="ml-2 text-gray-700">{accommodation.distanceFromMetro} km to {accommodation.nearestMetro}</span>
                  </div>
                )}
              </div>
            </div>

            {similarAccommodations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Similar PGs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarAccommodations.map((similar: Accommodation) => (
                    <div key={similar._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={similar.images[0]}
                        alt={similar.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{similar.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">{`${similar.address.area}, ${similar.address.city}`}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-semibold">₹{similar.rent}/month</span>
                          <Link
                            to={`/accommodation/${similar._id}`}
                            className="text-accent hover:text-accent/80"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailPage; 