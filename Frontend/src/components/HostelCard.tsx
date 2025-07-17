// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Accommodation {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  startingFrom?: string;
  uniqueCode?: string;
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
  gender?: string;
  availableFor?: string;
  verified?: boolean;
}

interface HostelCardProps {
  accommodation: Accommodation;
}

const HostelCard: React.FC<HostelCardProps> = ({ accommodation }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image section with gradient overlay */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={accommodation.images?.[0] || '/api/placeholder/400/300'}
          alt={accommodation.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50"></div>
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-black text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
          {accommodation.startingFrom || (accommodation.price ? `₹${accommodation.price.toLocaleString()}/month` : 'Price on request')}
        </div>
        
        {/* Verified badge if applicable */}
        {accommodation.verified && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
      </div>
      
      <div className="p-5">
        {/* Title and rating row */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-black flex-1 pr-2">{accommodation.name}</h3>
          
          {accommodation.rating && (
            <div className="flex items-center bg-yellow-100/70 px-2 py-0.5 rounded-lg">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm font-medium">{accommodation.rating}</span>
            </div>
          )}
        </div>

        {/* Description - show only if not too long */}
        {accommodation.description && accommodation.description.length < 100 && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{accommodation.description}</p>
        )}
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {accommodation.amenities?.slice(0, 3).map((amenity: string) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-white border border-neutral-200 text-neutral-700 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {accommodation.amenities?.length > 3 && (
            <span className="px-2 py-1 bg-white border border-neutral-200 text-neutral-500 text-xs rounded-full">
              +{accommodation.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* View Details Button */}
        <Link
          to={`/hostel/${accommodation._id || accommodation.id}`}
          className="block w-full text-center bg-black text-white py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HostelCard;