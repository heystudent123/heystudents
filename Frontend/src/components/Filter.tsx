import React, { useState, useEffect } from 'react';
import { collegesList } from '../data/hostels';
// Note: You'll need to install rc-slider with: npm install rc-slider
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
  // State variables
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [college, setCollege] = useState<string>('');
  const [messType, setMessType] = useState<string>('all');
  const [maxDistanceToCollege, setMaxDistanceToCollege] = useState<number>(5);
  const [maxDistanceToMetro, setMaxDistanceToMetro] = useState<number>(5);
  const [amenities, setAmenities] = useState<string[]>([]);
  
  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    college: true,
    messType: true,
    distance: true,
    amenities: true
  });

  // Function to toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const availableAmenities = [
    'WiFi',
    'AC',
    'Laundry',
    'TV',
    'Gym',
    'Power Backup',
    'Parking',
    'Security',
    'Meals',
    'Cleaning',
    'Study Room',
    'Hot Water',
  ];

  const colleges = [
    'Delhi University',
    'Jamia Millia Islamia',
    'Jawaharlal Nehru University',
    'Indraprastha University',
    'Ambedkar University',
    'DTU',
    'NSIT',
    'IIIT Delhi',
  ];
  
  // Amenity icons mapping
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

  useEffect(() => {
    // Apply filters when any filter option changes
    const filters: FilterOptions = {
      priceRange,
      college,
      messType,
      maxDistanceToCollege,
      maxDistanceToMetro,
      amenities,
    };
    onFilterChange(filters);
  }, [priceRange, college, messType, maxDistanceToCollege, maxDistanceToMetro, amenities, onFilterChange]);

  const handleAmenityChange = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a: string) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleReset = () => {
    setPriceRange([0, 20000]);
    setCollege('');
    setMessType('all');
    setMaxDistanceToCollege(5);
    setMaxDistanceToMetro(5);
    setAmenities([]);
  };
  
  // Custom slider styles
  const sliderStyle = {
    track: {
      backgroundColor: 'var(--color-primary-light)',
    },
    rail: {
      backgroundColor: '#e5e7eb',
    },
    handle: {
      borderColor: 'var(--color-primary)',
      backgroundColor: 'var(--color-primary)',
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      {/* Filter Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={handleReset}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200"
          >
            Reset All
          </button>
        </div>
      </div>

      <div className="p-4 divide-y divide-gray-100">
        {/* Price Range */}
        <div className="py-4 first:pt-0">
          <button 
            className="flex justify-between items-center w-full text-left focus:outline-none" 
            onClick={() => toggleSection('price')}
          >
            <h3 className="text-sm font-medium text-neutral-dark flex items-center">
              <span className="mr-2 text-primary">💰</span>
              Price Range
            </h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.price ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {expandedSections.price && (
            <div className="mt-3 space-y-4 animate-fade-in">
              <Slider
                range
                min={0}
                max={20000}
                value={priceRange}
                onChange={(value: any) => setPriceRange(value as [number, number])}
                className="mb-2"
                trackStyle={[sliderStyle.track]}
                railStyle={sliderStyle.rail}
                handleStyle={[sliderStyle.handle, sliderStyle.handle]}
              />
              <div className="flex justify-between items-center">
                <div className="px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-700 font-medium">
                  ₹{priceRange[0].toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">to</div>
                <div className="px-3 py-1.5 bg-gray-50 rounded-md text-sm text-gray-700 font-medium">
                  ₹{priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* College */}
        <div className="py-4">
          <button 
            className="flex justify-between items-center w-full text-left focus:outline-none" 
            onClick={() => toggleSection('college')}
          >
            <h3 className="text-sm font-medium text-neutral-dark flex items-center">
              <span className="mr-2 text-primary">🏫</span>
              College
            </h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.college ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {expandedSections.college && (
            <div className="mt-3 animate-fade-in">
              <div className="relative">
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10 text-sm text-gray-700"
                >
                  <option value="">All Colleges</option>
                  {colleges.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mess Type */}
        <div className="py-4">
          <button 
            className="flex justify-between items-center w-full text-left focus:outline-none" 
            onClick={() => toggleSection('messType')}
          >
            <h3 className="text-sm font-medium text-neutral-dark flex items-center">
              <span className="mr-2 text-primary">🍽️</span>
              Mess Type
            </h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.messType ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {expandedSections.messType && (
            <div className="mt-3 animate-fade-in">
              <div className="flex space-x-2">
                <button
                  onClick={() => setMessType('all')}
                  className={`px-3 py-2 text-sm rounded-lg flex-1 transition-colors duration-200 ${messType === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setMessType('veg')}
                  className={`px-3 py-2 text-sm rounded-lg flex-1 transition-colors duration-200 ${messType === 'veg' ? 'bg-primary text-white shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="mr-1">🥗</span> Veg Only
                </button>
                <button
                  onClick={() => setMessType('both')}
                  className={`px-3 py-2 text-sm rounded-lg flex-1 transition-colors duration-200 ${messType === 'both' ? 'bg-primary text-white shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  <span className="mr-1">🍖</span> Both
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Distance Sliders */}
        <div className="py-4">
          <button 
            className="flex justify-between items-center w-full text-left focus:outline-none" 
            onClick={() => toggleSection('distance')}
          >
            <h3 className="text-sm font-medium text-neutral-dark flex items-center">
              <span className="mr-2 text-primary">📍</span>
              Distance
            </h3>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.distance ? 'transform rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {expandedSections.distance && (
            <div className="mt-3 space-y-6 animate-fade-in">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-500">Max Distance to College</h4>
                  <span className="text-xs font-medium text-primary">{maxDistanceToCollege} km</span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  value={maxDistanceToCollege}
                  onChange={(value: any) => setMaxDistanceToCollege(value as number)}
                  trackStyle={sliderStyle.track}
                  railStyle={sliderStyle.rail}
                  handleStyle={sliderStyle.handle}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 km</span>
                  <span>10 km</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium text-gray-500">Max Distance to Metro</h4>
                  <span className="text-xs font-medium text-primary">{maxDistanceToMetro} km</span>
                </div>
                <Slider
                  min={0}
                  max={10}
                  value={maxDistanceToMetro}
                  onChange={(value: any) => setMaxDistanceToMetro(value as number)}
                  trackStyle={sliderStyle.track}
                  railStyle={sliderStyle.rail}
                  handleStyle={sliderStyle.handle}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0 km</span>
                  <span>10 km</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div className="py-4">
          <button 
            className="flex justify-between items-center w-full text-left focus:outline-none" 
            onClick={() => toggleSection('amenities')}
          >
            <h3 className="text-sm font-medium text-neutral-dark flex items-center">
              <span className="mr-2 text-primary">✨</span>
              Amenities
            </h3>
            <div className="flex items-center">
              {amenities.length > 0 && (
                <span className="mr-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {amenities.length} selected
                </span>
              )}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections.amenities ? 'transform rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
          
          {expandedSections.amenities && (
            <div className="mt-3 animate-fade-in">
              <div className="grid grid-cols-2 gap-2">
                {availableAmenities.map((amenity: string) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={amenity}
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
                    />
                    <label htmlFor={amenity} className="ml-2 text-sm text-gray-700 flex items-center">
                      <span className="mr-1">{amenityIcons[amenity] || '✓'}</span>
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Apply Filters Button - Mobile Only */}
      <div className="p-4 bg-gray-50 md:hidden">
        <button 
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          onClick={() => {
            // This will trigger the filter change through the useEffect
            // Just a visual feedback for mobile users
            const filters: FilterOptions = {
              priceRange,
              college,
              messType,
              maxDistanceToCollege,
              maxDistanceToMetro,
              amenities,
            };
            onFilterChange(filters);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filter;