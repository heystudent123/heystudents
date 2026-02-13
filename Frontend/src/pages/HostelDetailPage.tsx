import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom';
import { accommodationsApi } from '../services/api';
import * as wishlistService from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import SharedNavbar from '../components/SharedNavbar';
import { toast } from 'react-toastify';

// Fallback image as data URI
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%23e2e8f0"%3E%3C/rect%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" fill="%2364748b"%3EImage Unavailable%3C/text%3E%3C/svg%3E';

// Interface for accommodation data
interface Accommodation {
  _id?: string;
  id?: string;
  name: string;
  type?: string;
  description?: string;
  price?: number;
  startingFrom?: string;
  priceType?: string;
  gender?: string;
  availableFor?: string;
  images?: string[];
  amenities?: string[];
  rating?: number;
  verified?: boolean;
  address?: string | {
    street?: string;
    area?: string;
    city?: string;
    pincode?: string;
  };
  city?: string;
  state?: string;
  nearestColleges?: { name: string; distance?: number; distanceUnit?: string }[];
  nearestMetros?: { name: string; distance?: number; distanceUnit?: string }[];
  uniqueCode?: string;
}

// Component for image gallery
interface ImageGalleryProps {
  images: string[];
  fallbackImage?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, fallbackImage = FALLBACK_IMAGE }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActiveIndex, setModalActiveIndex] = useState(0);
  
  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const handleModalPrev = () => {
    setModalActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleModalNext = () => {
    setModalActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const openModal = (index: number) => {
    setModalActiveIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };
  
  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isModalOpen]);
  
  return (
    <div>
      {/* Main image */}
      <div className="relative bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-lg">
        <div className="aspect-w-16 aspect-h-9" style={{ height: '500px' }}>
          <img 
            src={images[activeIndex] || fallbackImage} 
            alt="Accommodation" 
            className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage }}
            onClick={() => openModal(activeIndex)}
          />
        </div>
        
        {/* Navigation controls */}
        {images.length > 1 && (
          <>
            {/* Previous button */}
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              onClick={handlePrev}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Next button */}
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              onClick={handleNext}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image counter */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnail strip for desktop */}
      {images.length > 1 && (
        <div className="mt-4 hidden md:block">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, idx) => (
              <button 
                key={idx} 
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  activeIndex === idx 
                    ? 'border-black shadow-lg' 
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
                onClick={() => setActiveIndex(idx)}
                onDoubleClick={() => openModal(idx)}
                aria-label={`Go to image ${idx + 1}`}
              >
                <img 
                  src={image || fallbackImage} 
                  alt={`Thumbnail ${idx + 1}`}
                  className="object-cover w-full h-full cursor-pointer"
                  onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Dot indicators for mobile */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2 md:hidden">
          {images.map((_, idx) => (
            <button 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                activeIndex === idx ? 'bg-black' : 'bg-neutral-300'
              }`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* Compact Modal Carousel */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* Modal Container */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Close button */}
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-1 shadow-md"
              onClick={closeModal}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image container */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-10" style={{ height: '400px' }}>
                <img 
                  src={images[modalActiveIndex] || fallbackImage} 
                  alt="Accommodation" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage }}
                />
              </div>
              
              {/* Navigation controls */}
              {images.length > 1 && (
                <>
                  {/* Previous button */}
                  <button 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    onClick={handleModalPrev}
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Next button */}
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    onClick={handleModalNext}
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {modalActiveIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image, idx) => (
                    <button 
                      key={idx} 
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        modalActiveIndex === idx 
                          ? 'border-black shadow-md' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => setModalActiveIndex(idx)}
                    >
                      <img 
                        src={image || fallbackImage} 
                        alt={`Thumbnail ${idx + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeModal}
          />
        </div>
      )}
    </div>
  );
};

// Component for key details section
interface KeyDetailsProps {
  accommodation: Accommodation;
  formatPrice: (acc: Accommodation) => string;
  isInWishlist: boolean;
  isLoggedIn: boolean;
  onAddToWishlist: () => void;
  onRemoveFromWishlist: () => void;
  navigate: NavigateFunction;
}

const KeyDetails: React.FC<KeyDetailsProps> = ({ accommodation, formatPrice, isInWishlist, isLoggedIn, onAddToWishlist, onRemoveFromWishlist, navigate }) => {
  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (isInWishlist) {
      onRemoveFromWishlist();
    } else {
      onAddToWishlist();
    }
  };

  return (
    <div className="bg-[#fff9ed] rounded-2xl shadow-sm p-6 mb-8 border border-neutral-100 text-center">
      {/* Wishlist button at the top */}
      <div className="flex justify-center md:justify-end mb-4">
        <button
          onClick={handleWishlistClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow-sm text-sm font-medium ${isInWishlist ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          aria-label={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isInWishlist ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>
      
      {/* Header with name and price */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-black mb-2">{accommodation.name}</h1>
        <div className="text-xl font-semibold text-black">{formatPrice(accommodation)}</div>
      </div>
      
      {/* Rating and verification badges */}
      <div className="flex flex-wrap gap-2 justify-center">
        {accommodation.rating !== undefined && (
          <div className="flex items-center bg-neutral-100 rounded-lg px-3 py-1">
            <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-neutral-700">{accommodation.rating} / 5</span>
          </div>
        )}
        {accommodation.verified && (
          <div className="flex items-center bg-neutral-100 rounded-lg px-3 py-1">
            <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-neutral-700">Verified</span>
          </div>
        )}
        {accommodation.uniqueCode && (
          <div className="flex items-center bg-neutral-100 rounded-lg px-3 py-1">
            <span className="text-sm text-neutral-700">Code: {accommodation.uniqueCode}</span>
          </div>
        )}
        {accommodation.availableFor && (
          <div className="flex items-center bg-neutral-100 rounded-lg px-3 py-1">
            <span className="text-sm text-neutral-700">For: {accommodation.availableFor}</span>
          </div>
        )}
        {accommodation.gender && (
          <div className="flex items-center bg-neutral-100 rounded-lg px-3 py-1">
            <span className="text-sm text-neutral-700">Gender: {accommodation.gender}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for amenities section
interface AmenitiesSectionProps {
  amenities?: string[];
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ amenities = [] }) => {
  if (amenities.length === 0) return null;
  
  return (
    <div className="bg-[#fff9ed] rounded-2xl shadow-sm p-6 mb-8 border border-neutral-100">
      <h2 className="text-2xl font-semibold text-black mb-4">Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-neutral-700">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for description section
interface DescriptionSectionProps {
  description?: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ description }) => {
  if (!description) return null;
  
  return (
    <div className="bg-[#fff9ed] rounded-2xl shadow-sm p-6 mb-8 border border-neutral-100">
      <h2 className="text-2xl font-semibold text-black mb-4">Description</h2>
      <p className="text-neutral-700 whitespace-pre-line">{description}</p>
    </div>
  );
};

// Component for location section
interface LocationSectionProps {
  distanceToColleges?: { name: string; distance?: number; distanceUnit?: string; }[];
  distanceToMetros?: { name: string; distance?: number; distanceUnit?: string; }[];
  formatDistance: (distance?: number, unit?: string) => string;
}

const LocationSection: React.FC<LocationSectionProps> = ({ 
  distanceToColleges = [],
  distanceToMetros = [],
  formatDistance 
}) => {
  if (distanceToColleges.length === 0 && distanceToMetros.length === 0) return null;
  
  return (
    <div className="bg-[#fff9ed] rounded-2xl shadow-sm p-6 mb-8 border border-neutral-100">
      <h2 className="text-2xl font-semibold text-black mb-4">Location</h2>
      
      {distanceToColleges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-neutral-900 mb-3">Nearest Colleges</h3>
          <div className="space-y-2">
            {distanceToColleges.map((college, index) => (
              <div key={index} className="flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-neutral-700">
                  {college.name} - {college.distance !== undefined ? formatDistance(college.distance, college.distanceUnit) : 'Distance unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {distanceToMetros.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-3">Nearest Metro Stations</h3>
          <div className="space-y-2">
            {distanceToMetros.map((metro, index) => (
              <div key={index} className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-neutral-700">
                  {metro.name} - {metro.distance !== undefined ? formatDistance(metro.distance, metro.distanceUnit) : 'Distance unknown'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component for action buttons section
interface ActionsSectionProps {
  navigate: NavigateFunction;
  accommodationId: string;
  isInWishlist: boolean;
  isLoggedIn: boolean;
  onAddToWishlist: () => void;
  onRemoveFromWishlist: () => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ 
  navigate,
  accommodationId,
  isInWishlist,
  isLoggedIn,
  onAddToWishlist,
  onRemoveFromWishlist
}) => {
  return (
    <div className="flex justify-start items-center mt-6">
      <button 
        onClick={() => navigate(-1)} 
        className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Back to Listings
      </button>
    </div>
  );
};

// Component for empty state
interface EmptyStateProps {
  navigate: (path: string) => void;
  error?: string | null;
}

const EmptyState: React.FC<EmptyStateProps> = ({ navigate, error = null }) => {
  return (
    <div className="bg-[#fff9ed] rounded-2xl shadow-sm p-8 text-center">
      <svg className="mx-auto h-16 w-16 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="mt-4 text-xl font-medium text-black">No Accommodation Found</h2>
      <p className="mt-2 text-neutral-600">{error || 'The accommodation you are looking for does not exist or has been removed.'}</p>
      <button 
        className="mt-6 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        onClick={() => navigate('/accommodations')}
      >
        Browse Accommodations
      </button>
    </div>
  );
};

// Loading skeleton component
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full bg-neutral-200 rounded-2xl aspect-w-16 aspect-h-9 md:aspect-h-6 mb-8"></div>
      
      {/* Title and price skeleton */}
      <div className="bg-neutral-200 h-8 rounded-lg w-3/4 mb-4"></div>
      <div className="bg-neutral-200 h-6 rounded-lg w-1/2 mb-8"></div>
      
      {/* Content skeletons */}
      <div className="space-y-8">
        <div className="bg-neutral-200 h-32 rounded-2xl"></div>
        <div className="bg-neutral-200 h-48 rounded-2xl"></div>
        <div className="bg-neutral-200 h-32 rounded-2xl"></div>
        <div className="bg-neutral-200 h-16 rounded-2xl"></div>
      </div>
    </div>
  );
};

// Main component
const HostelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const isAuthenticated = auth?.user !== null;
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWishlist, setIsInWishlist] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchAccommodation = async () => {
      if (!id) {
        setError('Accommodation ID is required');
        setLoading(false);
        return;
      }
      
      try {
        const response = await accommodationsApi.getById(id);
        setAccommodation(response.data);
      } catch (err) {
        console.error('Error fetching accommodation details:', err);
        setError('Failed to fetch accommodation details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccommodation();
  }, [id]);
  
  // Check if accommodation is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!isAuthenticated || !id) return;
      
      try {
        const response = await wishlistService.getWishlist();
        const wishlistItems = response.data;
        
        // Check if current accommodation is in wishlist
        const found = wishlistItems.some((item: any) => 
          item._id === id || 
          (item.accommodation && item.accommodation._id === id)
        );
        
        setIsInWishlist(found);
      } catch (err) {
        console.error('Error checking wishlist status:', err);
      }
    };
    
    checkWishlist();
  }, [id, isAuthenticated]);
  
  // Helper functions for formatting
  const formatPrice = (acc: Accommodation): string => {
    // Use startingFrom field first, then fallback to price
    if (acc.startingFrom) {
      // Check if "Starting from" is already included in the string
      if (acc.startingFrom.toLowerCase().includes('starting from')) {
        return acc.startingFrom;
      } else {
        return `Starting from Rs. ${acc.startingFrom}/pm`;
      }
    }
    
    if (!acc.price) return 'Price on request';
    
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(acc.price);
    
    const priceWithType = acc.priceType ? `${formattedPrice} / ${acc.priceType}` : formattedPrice;
    return `Starting from ${priceWithType}`;
  };
  
  const formatDistance = (distance?: number, unit: string = 'km'): string => {
    if (distance === undefined) return 'Unknown distance';
    return `${distance} ${unit}`;
  };
  
  // Wishlist handlers
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!id) return;
    
    try {
      await wishlistService.addToWishlist(id);
      setIsInWishlist(true);
      toast.success('Added to wishlist', {
        position: "bottom-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      toast.error('Failed to add to wishlist');
    }
  };
  
  const handleRemoveFromWishlist = async () => {
    if (!isAuthenticated || !id) return;
    
    try {
      await wishlistService.removeFromWishlist(id);
      setIsInWishlist(false);
      toast.success('Removed from wishlist', {
        position: "bottom-center",
        autoClose: 3000,
      });
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      toast.error('Failed to remove from wishlist');
    }
  };
  
  if (loading) {
    return (
      <div className="bg-[#fff9ed] min-h-screen">
        <SharedNavbar />
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }
  
  if (error || !accommodation) {
    return (
      <div className="bg-[#fff9ed] min-h-screen">
        <SharedNavbar />
        <div className="container mx-auto px-4 py-8">
          <EmptyState navigate={navigate} error={error} />
        </div>
      </div>
    );
  }
  
  const images = accommodation.images?.length ? accommodation.images : [FALLBACK_IMAGE];
  
  return (
    <div className="bg-[#fff9ed] min-h-screen">
      <SharedNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap text-sm mb-8 text-neutral-500">
          <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/accommodations')}>Accommodations</span>
          <span className="mx-2">/</span>
          <span className="text-black">{accommodation.name}</span>
        </div>
        
        {/* Main content - Centered */}
        <div className="max-w-4xl mx-auto">
          {/* Image gallery */}
          <div className="mb-8">
            <ImageGallery images={images} />
          </div>
          
          {/* Key details */}
          <KeyDetails 
            accommodation={accommodation} 
            formatPrice={formatPrice}
            isInWishlist={isInWishlist}
            isLoggedIn={isAuthenticated}
            onAddToWishlist={handleAddToWishlist}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            navigate={navigate}
          />
          
          {/* Content sections */}
          <div className="space-y-8">
            {/* Description */}
            <DescriptionSection description={accommodation.description} />
            
            {/* Amenities */}
            <AmenitiesSection amenities={accommodation.amenities} />
            
            {/* Location */}
            <LocationSection 
              distanceToColleges={accommodation.nearestColleges}
              distanceToMetros={accommodation.nearestMetros}
              formatDistance={formatDistance} 
            />
            
            {/* Actions */}
            <div className="mb-8">
              <ActionsSection 
                navigate={navigate}
                accommodationId={id || ''}
                isInWishlist={isInWishlist}
                isLoggedIn={isAuthenticated}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailPage;