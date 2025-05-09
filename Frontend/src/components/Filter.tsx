import React, { useState } from 'react';
import { collegesList } from '../data/hostels';

interface FilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  priceRange: [number, number];
  college: string;
  messType: string;
  maxDistanceToCollege: number;
  maxDistanceToMetro: number;
  amenities: string[];
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 20000],
    college: '',
    messType: 'all',
    maxDistanceToCollege: 5,
    maxDistanceToMetro: 5,
    amenities: []
  });

  const amenitiesList = [
    'WiFi', 'AC', 'Laundry', 'Gym', 'Library', '24/7 Security',
    'Study Rooms', 'Power Backup', 'TV Lounge', 'Hot Water'
  ];

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, college: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newFilters = { 
      ...filters, 
      priceRange: [filters.priceRange[0], value] as [number, number]
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, messType: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDistanceToCollegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newFilters = { ...filters, maxDistanceToCollege: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDistanceToMetroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newFilters = { ...filters, maxDistanceToMetro: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAmenityChange = (amenity: string) => {
    let newAmenities;
    if (filters.amenities.includes(amenity)) {
      newAmenities = filters.amenities.filter(a => a !== amenity);
    } else {
      newAmenities = [...filters.amenities, amenity];
    }
    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 20000] as [number, number],
      college: '',
      messType: 'all',
      maxDistanceToCollege: 5,
      maxDistanceToMetro: 5,
      amenities: []
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-primary">Filters</h2>
        <button 
          onClick={resetFilters}
          className="text-sm text-accent hover:text-accent/80"
        >
          Reset All
        </button>
      </div>

      {/* College Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          College
        </label>
        <select
          value={filters.college}
          onChange={handleCollegeChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
        >
          <option value="">All Colleges</option>
          {collegesList.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Maximum Price: ₹{filters.priceRange[1].toLocaleString()}
        </label>
        <input
          type="range"
          min="5000"
          max="20000"
          step="500"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹5,000</span>
          <span>₹20,000</span>
        </div>
      </div>

      {/* Mess Type Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Mess Type
        </label>
        <select
          value={filters.messType}
          onChange={handleMessTypeChange}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent"
        >
          <option value="all">All Types</option>
          <option value="veg">Vegetarian</option>
          <option value="non-veg">Non-Vegetarian</option>
          <option value="both">Both Veg & Non-Veg</option>
        </select>
      </div>

      {/* Distance to College Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Max Distance to College: {filters.maxDistanceToCollege} km
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={filters.maxDistanceToCollege}
          onChange={handleDistanceToCollegeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5 km</span>
          <span>5 km</span>
        </div>
      </div>

      {/* Distance to Metro Filter */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Max Distance to Metro: {filters.maxDistanceToMetro} km
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={filters.maxDistanceToMetro}
          onChange={handleDistanceToMetroChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5 km</span>
          <span>5 km</span>
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-2">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center">
              <input
                type="checkbox"
                id={`amenity-${amenity}`}
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label
                htmlFor={`amenity-${amenity}`}
                className="ml-2 block text-sm text-gray-700"
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter; 