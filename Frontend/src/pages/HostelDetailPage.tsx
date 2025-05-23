import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { accommodationsApi } from '../services/api';
import { PG } from '../data/hostels';

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
  reviews: Array<{
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  images: string[];
  amenities: string[];
  rules: string[];
  occupancy: number;
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
  contactPhone: string;
  contactEmail: string;
  ownerName?: string;
  contactDetails: {
    name: string;
    phone: string;
    email: string;
  };
}

const HostelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [similarAccommodations, setSimilarAccommodations] = useState<Accommodation[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllImages, setShowAllImages] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

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
      <div className="min-h-screen bg-neutral pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-neutral-dark text-lg">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral pt-16 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-card p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 text-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-neutral-dark mb-4">Error</h1>
          <p className="text-error mb-6">{error}</p>
          <Link to="/accommodations" className="btn-primary inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Accommodations
          </Link>
        </div>
      </div>
    );
  }

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-neutral pt-16 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-card p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-neutral-dark mb-4">Accommodation Not Found</h1>
          <p className="text-gray-500 mb-6">We couldn't find the accommodation you're looking for.</p>
          <Link to="/accommodations" className="btn-primary inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse Accommodations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral pt-16">
      {/* Full screen gallery modal */}
      {showAllImages && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative w-full h-full">
            <button 
              onClick={() => setShowAllImages(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={accommodation.images[activeImage]}
                alt={accommodation.name}
                className="max-h-[85vh] max-w-[85vw] object-contain"
              />
            </div>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto py-2 px-4 bg-black/30 backdrop-blur-sm rounded-xl">
              {accommodation.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    activeImage === index ? 'ring-2 ring-accent scale-110' : 'opacity-70 hover:opacity-100'
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
            
            {/* Navigation arrows */}
            <button 
              onClick={() => setActiveImage(prev => (prev === 0 ? accommodation.images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setActiveImage(prev => (prev === accommodation.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Hero section with main image */}
      <div ref={galleryRef} className="relative">
        <div className="h-[50vh] md:h-[60vh] overflow-hidden relative">
          <img
            src={accommodation.images[activeImage]}
            alt={accommodation.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-3">
                  {accommodation.type} • Available for {accommodation.availableFor}
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{accommodation.name}</h1>
                <p className="text-white/80 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {`${accommodation.address.area}, ${accommodation.address.city}`}
                </p>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold text-white mb-1">
                  ₹{accommodation.rent.toLocaleString()}
                  <span className="text-sm font-normal text-white/80">/month</span>
                </div>
                <div className="flex items-center text-white/90">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span>{accommodation.averageRating || 'N/A'}</span>
                  <span className="text-white/70 text-sm ml-1">({accommodation.reviews.length} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image gallery thumbnails */}
          <div className="absolute bottom-32 md:bottom-28 left-0 right-0 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
                {accommodation.images.slice(0, 5).map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                      activeImage === index ? 'ring-2 ring-accent scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${accommodation.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                
                {accommodation.images.length > 5 && (
                  <button
                    onClick={() => setShowAllImages(true)}
                    className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative group"
                  >
                    <img
                      src={accommodation.images[5]}
                      alt={`${accommodation.name} more`}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">+{accommodation.images.length - 5}</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs navigation */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('amenities')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'amenities' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Amenities
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'location' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Location
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Reviews ({accommodation.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('similar')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeTab === 'similar' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Similar Accommodations
          </button>
        </div>

        {/* Tab content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-display font-bold text-neutral-dark mb-4">Overview</h2>
              <p className="text-neutral-dark/80 mb-6">{accommodation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Key Details</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-neutral-dark/80">
                      <span className="w-32 flex-shrink-0">Occupancy:</span>
                      <span>{accommodation.occupancy} persons</span>
                    </li>
                    <li className="flex items-center text-neutral-dark/80">
                      <span className="w-32 flex-shrink-0">Security Deposit:</span>
                      <span>₹{accommodation.securityDeposit?.toLocaleString() || 'Not specified'}</span>
                    </li>
                    <li className="flex items-center text-neutral-dark/80">
                      <span className="w-32 flex-shrink-0">Food:</span>
                      <span>
                        {accommodation.food.available 
                          ? `Available (${accommodation.food.vegOnly ? 'Veg Only' : 'Veg & Non-veg'})` 
                          : 'Not available'}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Contact Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-neutral-dark/80">
                      <span className="w-32 flex-shrink-0">Phone:</span>
                      <a href={`tel:${accommodation.contactPhone}`} className="text-primary hover:text-primary-dark">
                        {accommodation.contactPhone}
                      </a>
                    </li>
                    <li className="flex items-center text-neutral-dark/80">
                      <span className="w-32 flex-shrink-0">Email:</span>
                      <a href={`mailto:${accommodation.contactEmail}`} className="text-primary hover:text-primary-dark">
                        {accommodation.contactEmail}
                      </a>
                    </li>
                    {accommodation.ownerName && (
                      <li className="flex items-center text-neutral-dark/80">
                        <span className="w-32 flex-shrink-0">Owner:</span>
                        <span>{accommodation.ownerName}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div>
              <h2 className="text-2xl font-display font-bold text-neutral-dark mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-neutral-dark/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              {accommodation.rules.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-display font-bold text-neutral-dark mb-4">House Rules</h3>
                  <ul className="space-y-2">
                    {accommodation.rules.map((rule, index) => (
                      <li key={index} className="flex items-start space-x-2 text-neutral-dark/80">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'location' && (
            <div>
              <h2 className="text-2xl font-display font-bold text-neutral-dark mb-6">Location</h2>
              <div className="bg-white rounded-xl shadow-card p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">Address</h3>
                <p className="text-neutral-dark/80">
                  {accommodation.address.street}<br />
                  {accommodation.address.area}<br />
                  {accommodation.address.city} - {accommodation.address.pincode}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-card p-6">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Nearest Colleges</h3>
                  <ul className="space-y-3">
                    {accommodation.nearestCollege.map((college, index) => (
                      <li key={index} className="flex items-center text-neutral-dark/80">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{college}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-neutral-dark/60">
                    Distance from college: {accommodation.distanceFromCollege} km
                  </p>
                </div>

                {accommodation.nearestMetro && (
                  <div className="bg-white rounded-xl shadow-card p-6">
                    <h3 className="text-lg font-semibold text-neutral-dark mb-4">Public Transport</h3>
                    <div className="flex items-center text-neutral-dark/80 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Nearest Metro Station: {accommodation.nearestMetro}</span>
                    </div>
                    <p className="text-sm text-neutral-dark/60">
                      Distance from metro: {accommodation.distanceFromMetro} km
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-neutral-dark">Reviews</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-2xl">★</span>
                  <span className="text-2xl font-bold text-neutral-dark">{accommodation.averageRating || 'N/A'}</span>
                  <span className="text-neutral-dark/60">({accommodation.reviews.length} reviews)</span>
                </div>
              </div>

              {accommodation.reviews.length > 0 ? (
                <div className="space-y-6">
                  {accommodation.reviews.map((review, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-neutral-dark">{review.userName}</h3>
                          <p className="text-sm text-neutral-dark/60">{review.date}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="font-medium text-neutral-dark">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-neutral-dark/80">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-dark/60">
                  <p>No reviews yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'similar' && (
            <div>
              <h2 className="text-2xl font-display font-bold text-neutral-dark mb-6">Similar Accommodations</h2>
              
              {similarAccommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarAccommodations.map((similar) => (
                    <div
                      key={similar._id}
                      className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
                      onClick={() => window.location.href = `/accommodations/${similar._id}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="relative h-48">
                        <img
                          src={similar.images[0]}
                          alt={similar.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-semibold text-white mb-1">{similar.name}</h3>
                          <p className="text-sm text-white/80">{similar.address.area}, {similar.address.city}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-neutral-dark">₹{similar.rent.toLocaleString()}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-medium text-neutral-dark">{similar.averageRating || 'N/A'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-dark/60">
                          {similar.type} • Available for {similar.availableFor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-dark/60">
                  <p>No similar accommodations found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelDetailPage;