import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavigateFunction } from 'react-router-dom';
import { accommodationsApi } from '../services/api';
import SharedNavbar from '../components/SharedNavbar';

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
  phone?: string;
  email?: string;
}

// Component for image gallery
interface ImageGalleryProps {
  images: string[];
  fallbackImage?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, fallbackImage = FALLBACK_IMAGE }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="mb-8">
      {/* Main image */}
      <div className="relative bg-[#fff9ed] border border-neutral-200 rounded-lg overflow-hidden max-w-4xl mx-auto">
        <div className="aspect-w-16 aspect-h-10" style={{ maxHeight: '400px' }}>
          <img 
            src={images[activeIndex] || fallbackImage} 
            alt="Accommodation" 
            className="object-cover w-full h-full"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImage }}
          />
        </div>
        
        {/* Simple navigation controls */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-0 flex justify-between items-center p-4">
            <button 
              className="bg-white rounded p-2 shadow hover:bg-neutral-100 focus:outline-none"
              onClick={handlePrev}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-sm bg-white px-3 py-1 rounded shadow">
              {activeIndex + 1} / {images.length}
            </div>
            
            <button 
              className="bg-white rounded p-2 shadow hover:bg-neutral-100 focus:outline-none"
              onClick={handleNext}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Simple dot indicators */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, idx) => (
            <button 
              key={idx} 
              className={`w-2 h-2 rounded-full ${activeIndex === idx ? 'bg-black' : 'bg-neutral-300'}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component for key details section
interface KeyDetailsProps {
  accommodation: Accommodation;
  formatPrice: (acc: Accommodation) => string;
  formatAddress: (acc: Accommodation) => string;
}

const KeyDetails: React.FC<KeyDetailsProps> = ({ accommodation, formatPrice, formatAddress }) => {
  return (
    <div className="bg-[#fff9ed] rounded-2xl shadow-sm p-6 mb-8 border border-neutral-100">
      <h1 className="text-3xl font-bold text-black mb-2">{accommodation.name}</h1>
      <div className="flex flex-wrap justify-between items-center">
        <p className="text-neutral-600">{formatAddress(accommodation)}</p>
        <div className="text-2xl font-semibold mt-2 md:mt-0">{formatPrice(accommodation)}</div>
      </div>
      
      {/* Rating and verification */}
      <div className="flex flex-wrap gap-4 mt-4">
        {accommodation.rating !== undefined && (
          <div className="flex items-center bg-yellow-100 rounded-lg px-3 py-1">
            <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-medium">{accommodation.rating} / 5</span>
          </div>
        )}
        {accommodation.verified && (
          <div className="flex items-center bg-green-100 rounded-lg px-3 py-1">
            <svg className="w-5 h-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Verified</span>
          </div>
        )}
        {accommodation.uniqueCode && (
          <div className="flex items-center bg-blue-100 rounded-lg px-3 py-1">
            <span className="font-medium">Code: {accommodation.uniqueCode}</span>
          </div>
        )}
        {accommodation.availableFor && (
          <div className="flex items-center bg-purple-100 rounded-lg px-3 py-1">
            <span className="font-medium">For: {accommodation.availableFor}</span>
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
  phone?: string;
  email?: string;
  navigate: NavigateFunction;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({ 
  phone = '+911234567890', 
  email = 'info@heystudents.com', 
  navigate 
}) => {
  return (
    <div>
      <button 
        className="w-full mb-4 bg-black text-white px-4 py-3 rounded-xl flex items-center justify-center font-semibold hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        onClick={() => window.open(`tel:${phone}`, '_blank')}
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call Owner
      </button>
      <button 
        className="w-full mb-4 bg-white border border-black text-black px-4 py-3 rounded-xl flex items-center justify-center font-semibold hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        onClick={() => window.open(`mailto:${email}`, '_blank')}
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Email Inquiry
      </button>
      <button 
        className="w-full bg-white border border-black text-black px-4 py-3 rounded-xl flex items-center justify-center font-semibold hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        onClick={() => navigate(-1)}
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Go Back
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
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAccommodation = async () => {
      setLoading(true);
      
      try {
        if (!id) {
          throw new Error('Accommodation ID is required');
        }
        
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
  
  // Helper functions for formatting
  const formatPrice = (acc: Accommodation): string => {
    if (!acc.price) return 'Price on request';
    
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(acc.price);
    
    return acc.priceType ? `${formattedPrice} / ${acc.priceType}` : formattedPrice;
  };
  
  const formatAddress = (acc: Accommodation): string => {
    if (typeof acc.address === 'string') return acc.address;
    
    const addrObj = acc.address;
    if (!addrObj) return 'Address not available';
    
    const parts = [];
    if (addrObj.street) parts.push(addrObj.street);
    if (addrObj.area) parts.push(addrObj.area);
    if (addrObj.city) parts.push(addrObj.city);
    if (addrObj.pincode) parts.push(addrObj.pincode);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };
  
  const formatDistance = (distance?: number, unit: string = 'km'): string => {
    if (distance === undefined) return 'Unknown distance';
    return `${distance} ${unit}`;
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
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap text-sm mb-6 text-neutral-500">
          <span className="hover:text-black cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span className="hover:text-black cursor-pointer" onClick={() => navigate('/accommodations')}>Accommodations</span>
          <span className="mx-2">/</span>
          <span className="text-black">{accommodation.name}</span>
        </div>
        
        {/* Image gallery */}
        <ImageGallery images={images} />
        
        {/* Key details */}
        <KeyDetails 
          accommodation={accommodation} 
          formatPrice={formatPrice} 
          formatAddress={formatAddress} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
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
          </div>
          
          <div>
            {/* Actions */}
            <div className="bg-[#fff9ed] rounded-2xl shadow-sm p-6 mb-8 border border-neutral-100 sticky top-4">
              <ActionsSection 
                navigate={navigate}
                phone={accommodation.phone || '+911234567890'}
                email={accommodation.email || 'info@heystudents.com'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailPage;