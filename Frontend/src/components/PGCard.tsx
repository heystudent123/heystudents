import React from 'react';
import { Link } from 'react-router-dom';
import { PG } from '../data/hostels';

interface PGCardProps {
  PG: PG;
  onViewDetailsClick?: () => void;
  isLinkWrapped?: boolean;
}

const PGCard: React.FC<PGCardProps> = ({ PG, onViewDetailsClick, isLinkWrapped = false }) => {
  // Function to determine if the price is budget-friendly
  const isPriceBudget = PG.price < 10000;
  
  // Function to determine badge color based on rating
  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-success text-white';
    if (rating >= 4.0) return 'bg-accent text-white';
    if (rating >= 3.0) return 'bg-warning text-white';
    return 'bg-gray-400 text-white';
  };
  
  // Function to get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const amenityIcons: Record<string, string> = {
      'WiFi': '📶',
      'AC': '❄️',
      'Laundry': '👕',
      'TV': '📺',
      'Gym': '💪',
      'Power Backup': '🔋',
      'Parking': '🅿️',
      'Security': '🔒',
      'Meals': '🍽️',
      'Cleaning': '🧹',
      'Study Room': '📚',
      'Hot Water': '🚿',
    };
    
    return amenityIcons[amenity] || '✓';
  };
  
  return (
    <div className="group relative bg-white flex flex-col flex-1 overflow-hidden">
      {/* Gradient overlay at the top */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent z-10"></div>
      
      {/* Image container with overlay gradient */}
      <div className="relative w-full h-52 overflow-hidden flex-shrink-0">
        <img 
          src={PG.photos[0] || 'https://via.placeholder.com/400x250?text=No+Image'} 
          alt={PG.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
        
        {/* Price badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary-dark px-3 py-1.5 rounded-full font-semibold shadow-lg">
          <span className="text-sm">₹</span>
          <span className="text-base">{PG.price.toLocaleString()}</span>
          <span className="text-xs text-gray-500">/mo</span>
        </div>
        
        {/* Budget-friendly badge */}
        {isPriceBudget && (
          <div className="absolute top-3 left-3 bg-success/90 text-white text-xs px-2 py-1 rounded-full">
            Budget Friendly
          </div>
        )}
        
        {/* Rating badge */}
        <div className={`absolute bottom-3 left-3 ${getRatingBadgeColor(PG.rating)} px-2 py-1 rounded-full flex items-center`}>
          <svg className="w-3.5 h-3.5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-medium">{PG.rating.toFixed(1)}</span>
        </div>
        
        {/* Reviews count */}
        {PG.reviews > 0 && (
          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full text-gray-700">
            {PG.reviews} {PG.reviews === 1 ? 'review' : 'reviews'}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Name and Type */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-neutral-dark group-hover:text-primary">
            {PG.name}
          </h3>
          <p className="text-gray-500 text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {PG.address}
          </p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-100 my-3"></div>
        
        {/* Key Features */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <span className="text-primary">🏫</span>
            </div>
            <span>{PG.distance.college}km to {PG.college}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <span className="text-primary">{PG.messType === 'veg' ? '🥗' : '🍽️'}</span>
            </div>
            <span>{PG.messType === 'veg' ? 'Veg Only' : 'Veg & Non-veg'}</span>
          </div>
        </div>
        
        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {PG.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="bg-gray-50 border border-gray-100 text-xs px-2 py-1 rounded-md flex items-center">
              <span className="mr-1">{getAmenityIcon(amenity)}</span>
              <span className="text-gray-700">{amenity}</span>
            </div>
          ))}
          {PG.amenities.length > 4 && (
            <div className="bg-gray-50 border border-gray-100 text-xs px-2 py-1 rounded-md flex items-center">
              <span className="text-gray-700">+{PG.amenities.length - 4} more</span>
            </div>
          )}
        </div>
      </div>
      
      {/* View details button - appears on hover */}
      {!isLinkWrapped && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-6">
          <Link
            to={`/accommodation/${PG.id}`}
            className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-full"
          >
            View Details
          </Link>
        </div>
      )}
      {isLinkWrapped && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center pb-6">
          <button
            onClick={onViewDetailsClick}
            className="bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-full"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default PGCard;