import React from 'react';
import { Link } from 'react-router-dom';
import { Hostel } from '../data/hostels';

interface HostelCardProps {
  hostel: Hostel;
}

const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={hostel.images[0]}
          alt={hostel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-primary">
          ₹{hostel.price.toLocaleString()}/month
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{hostel.name}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hostel.description}</p>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm text-gray-600">{hostel.rating}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="ml-1 text-sm text-gray-600">{hostel.distance} km from college</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {hostel.amenities.slice(0, 3).map((amenity: string) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
          {hostel.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{hostel.amenities.length - 3} more
            </span>
          )}
        </div>

        <Link
          to={`/hostel/${hostel.id}`}
          className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HostelCard; 