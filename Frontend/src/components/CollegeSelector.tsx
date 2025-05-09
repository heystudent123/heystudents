import React from 'react';
import { College } from '../types/alumni';
import { delhiUniversityColleges } from '../data/colleges';

interface CollegeSelectorProps {
  selectedCollege: string;
  onCollegeChange: (college: string) => void;
}

const CollegeSelector: React.FC<CollegeSelectorProps> = ({
  selectedCollege,
  onCollegeChange,
}) => {
  return (
    <div className="relative">
      <label
        htmlFor="college-select"
        className="block text-sm font-medium text-primary mb-2"
      >
        Select Your College
      </label>
      <div className="relative">
        <select
          id="college-select"
          value={selectedCollege}
          onChange={(e) => onCollegeChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md shadow-sm bg-white"
        >
          <option value="">Select a college</option>
          {delhiUniversityColleges.map((college) => (
            <option key={college.id} value={college.name}>
              {college.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Choose your college to find alumni from your institution
      </p>
    </div>
  );
};

export default CollegeSelector; 