import React, { useState } from 'react';

// Define College interface locally
interface College {
  id: number;
  name: string;
}

// Define colleges data locally
const delhiUniversityColleges: College[] = [
  { id: 1, name: 'Acharya Narendra Dev College' },
  { id: 2, name: 'Aditi Mahavidyalaya' },
  // Add more colleges as needed
];

interface CollegeSelectorProps {
  selectedCollege: string;
  onCollegeChange: (college: string) => void;
}

const CollegeSelector: React.FC<CollegeSelectorProps> = ({
  selectedCollege,
  onCollegeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <label
        htmlFor="college-select"
        className="block text-sm font-medium text-primary mb-2 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Select Your College
      </label>
      
      <div className="relative">
        <div className="relative">
          <select
            id="college-select"
            value={selectedCollege}
            onChange={(e) => {
              onCollegeChange(e.target.value);
              setIsOpen(false);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            className="block w-full pl-4 pr-10 py-3.5 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent rounded-lg shadow-sm bg-white transition-all duration-200 appearance-none"
          >
            <option value="">Select a college</option>
            {delhiUniversityColleges.map((college) => (
              <option key={college.id} value={college.name}>
                {college.name}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown indicator with animation */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              <svg className="h-5 w-5 text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Decorative accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-primary rounded-l-lg"></div>
        </div>
        
        {/* Animated badge showing selected college */}
        {selectedCollege && (
          <div className="absolute -top-3 -right-2 bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-fade-in">
            Selected
          </div>
        )}
      </div>
      
      <p className="mt-2.5 text-sm text-gray-500 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Choose your college to find alumni from your institution
      </p>
    </div>
  );
};

export default CollegeSelector;