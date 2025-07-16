import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';
import { accommodationsApi } from '../services/api';

// Fallback image as data URI
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="%2364748b"%3EImage Unavailable%3C/text%3E%3C/svg%3E';

// Interface for accommodation data
interface Accommodation {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  startingFrom?: string; // Added startingFrom field
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
  messType?: string;
  // Added fields to match backend schema
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

const HostelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchAccommodationDetails = async () => {
      if (!id) {
        setError('Accommodation ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const rawData = await accommodationsApi.getById(id);
        // Support different backend response shapes (e.g., { accommodation: {...} }, { data: {...} }, etc.)
        const data = rawData?.accommodation || rawData?.data || rawData?.result || rawData;
        setAccommodation(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching accommodation details:', err);
        setError('Failed to load accommodation details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationDetails();
  }, [id]);

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

  // Format distance with unit
  const formatDistance = (distance?: number) => {
    if (!distance && distance !== 0) return 'N/A';
    return `${distance} km`;
  };

  // Concatenate address fields gracefully
  const formatAddress = (acc: Accommodation): string => {
    if (acc.address) {
      const parts = [acc.address.street, acc.address.area, acc.address.city, acc.address.pincode].filter(Boolean);
      if (parts.length) return parts.join(', ');
    }
    if (acc.location?.address) return acc.location.address;
    if (acc.location?.city) return `${acc.location.city}${acc.location.state ? ', ' + acc.location.state : ''}`;
    return '';
  };

  // Get image URL with fallback
  const getImageUrl = (index: number) => {
    if (accommodation?.images && accommodation.images.length > index && accommodation.images[index]) {
      return accommodation.images[index];
    }
    return FALLBACK_IMAGE;
  };

  // Handle image navigation
  const handlePrevImage = () => {
    if (accommodation?.images && accommodation.images.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 ? accommodation.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextImage = () => {
    if (accommodation?.images && accommodation.images.length > 0) {
      setActiveImageIndex((prevIndex) => 
        prevIndex === accommodation.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-md my-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/accommodation')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Accommodations
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : accommodation ? (
          <div>
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/accommodation')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Accommodations
                  </button>
                </li>
                <li>
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <span className="text-gray-700 font-medium">{accommodation.name}</span>
                </li>
              </ol>
            </nav>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Image Gallery */}
              <div className="relative h-80 md:h-96 bg-gray-100">
                <img 
                  src={getImageUrl(activeImageIndex)} 
                  alt={`${accommodation.name} - Image ${activeImageIndex + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                
                {accommodation.images && accommodation.images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 focus:outline-none"
                    >
                      <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 focus:outline-none"
                    >
                      <svg className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                      {activeImageIndex + 1} / {accommodation.images.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail gallery for desktop */}
              {accommodation.images && accommodation.images.length > 1 && (
                <div className="hidden md:flex overflow-x-auto p-4 space-x-2 bg-gray-50">
                  {accommodation.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                        activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image || FALLBACK_IMAGE} 
                        alt={`${accommodation.name} - Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {accommodation.type === 'PG' && (accommodation.availableFor === 'Girls' || accommodation.gender === 'Girls') ? 'PG for Girls' : accommodation.name}
                    </h1>
                    
                    {/* Location section removed */}
                    
                    {/* Type and Gender */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {accommodation.type && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {accommodation.type}
                        </span>
                      )}
                      {(accommodation.availableFor || accommodation.gender) && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {accommodation.availableFor || accommodation.gender}
                        </span>
                      )}
                      {accommodation.messType && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {accommodation.messType} Mess
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="mt-4 md:mt-0 bg-blue-50 px-4 py-3 rounded-lg">
                    <p className="text-sm text-gray-500">Monthly Rent</p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600">
                      {formatPrice(accommodation)}
                    </p>
                  </div>
                </div>
                
                {/* Distances and Rating */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {accommodation.distanceToCollege !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Distance to College</p>
                      <p className="text-xl font-semibold">{formatDistance(accommodation.distanceToCollege)}</p>
                    </div>
                  )}
                  
                  {accommodation.distanceToMetro !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Distance to Metro</p>
                      <p className="text-xl font-semibold">{formatDistance(accommodation.distanceToMetro)}</p>
                    </div>
                  )}
                  
                  {accommodation.rating !== undefined && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center">
                        <span className="text-xl font-semibold mr-2">{accommodation.rating.toFixed(1)}</span>
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                {accommodation.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                    <div className="prose max-w-none text-gray-600">
                      <p>{accommodation.description}</p>
                    </div>
                  </div>
                )}
                
                {/* Amenities */}
                {accommodation.amenities && accommodation.amenities.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {accommodation.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Contact Section */}
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Interested in this accommodation?</h2>
                  <p className="text-gray-600 mb-4">Contact us for more information or to schedule a visit.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Owner
                    </button>
                    <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-6 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Schedule Visit
                    </button>
                  </div>
                </div>
                
                {/* Unique Code */}
                {accommodation.uniqueCode && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Accommodation Code</h2>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-lg font-medium">{accommodation.uniqueCode}</span>
                    </div>
                  </div>
                )}
                
                {/* Back to listings button */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => navigate('/accommodation')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Accommodations
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No accommodation found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The accommodation you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/accommodation')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Accommodations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelDetailPage;
