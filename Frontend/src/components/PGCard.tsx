import React from 'react';
import { Link } from 'react-router-dom';
import { PG } from '../data/hostels';

interface PGCardProps {
  PG: PG;
}

const PGCard: React.FC<PGCardProps> = ({ PG }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={PG.photos[0]}
          alt={PG.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded-md text-sm font-semibold">
          ₹{PG.price}/month
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{PG.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{PG.address}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-gray-700">{PG.rating}</span>
          </div>
          <span className="text-gray-500 text-sm">{PG.distance.college} km from campus</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary/10 text-primary px-2 py-1 text-xs font-semibold rounded-md">
            {PG.messType}
          </span>
          
          {PG.amenities.slice(0, 3).map((amenity: string, index: number) => (
            <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-semibold rounded-md">
              {amenity}
            </span>
          ))}
        </div>
        
        <Link
          to={`/accommodation/${PG.id}`}
          className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PGCard; 