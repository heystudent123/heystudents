// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hostel } from '../data/hostels';

interface HostelCardProps {
  hostel: Hostel;
}

const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
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
          src={hostel.images[0]}
          alt={hostel.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-50"></div>
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-black text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
          ₹{hostel.price.toLocaleString()}/month
        </div>
        
        {/* Verified badge if applicable */}
        {hostel.verified && (
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
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-black flex-1 pr-2">{hostel.name}</h3>
          
          {hostel.rating && (
            <div className="flex items-center bg-yellow-100/70 px-2 py-0.5 rounded-lg">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm font-medium">{hostel.rating}</span>
            </div>
          )}
        </div>
        
        {/* Location */}
        <div className="flex items-center text-neutral-600 text-sm mb-3">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="truncate">
            {hostel.distance && `${hostel.distance} km from college • `} 
            {hostel.location || hostel.address || 'Location available on request'}
          </span>
        </div>

        {/* Description - show only if not too long */}
        {hostel.description && hostel.description.length < 100 && (
          <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{hostel.description}</p>
        )}
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {hostel.amenities?.slice(0, 3).map((amenity: string) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-white border border-neutral-200 text-neutral-700 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {hostel.amenities?.length > 3 && (
            <span className="px-2 py-1 bg-white border border-neutral-200 text-neutral-500 text-xs rounded-full">
              +{hostel.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* View Details Button */}
        <Link
          to={`/hostel/${hostel.id}`}
          className="block w-full text-center bg-black text-white py-2.5 rounded-xl font-medium hover:bg-neutral-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HostelCard;