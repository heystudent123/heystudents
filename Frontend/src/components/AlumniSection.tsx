import React, { useState, useEffect } from 'react';
import AlumniCard from './AlumniCard';
import { alumniData } from '../data/alumni';
import CollegeSelector from './CollegeSelector';

const AlumniSection: React.FC = () => {
  const [selectedCollege, setSelectedCollege] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter alumni based on college and search term
  const filteredAlumni = alumniData
    .filter((alumni) => {
      const matchesCollege = selectedCollege ? alumni.college === selectedCollege : true;
      const matchesSearch = searchTerm
        ? alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          alumni.currentCompany.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesCollege && matchesSearch;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section header with decorative elements */}
      <div className="relative mb-16 text-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <span className="inline-block py-1 px-3 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
            Alumni Network
          </span>
          
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-dark">
            Our Distinguished <span className="text-primary">Alumni</span>
          </h2>
          
          <p className="mt-4 max-w-2xl text-lg text-gray-500 mx-auto">
            Connect with alumni who can help guide your career path and expand your professional network.
          </p>
          
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* College selector */}
          <div className="md:col-span-1">
            <CollegeSelector
              selectedCollege={selectedCollege}
              onCollegeChange={setSelectedCollege}
            />
          </div>
          
          {/* Search input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-primary mb-2">
              Search Alumni
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-3 border-gray-300 focus:ring-accent focus:border-accent rounded-md shadow-sm"
                placeholder="Search by name, position, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results section */}
      <div className="space-y-8">
        {/* Results header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-primary">
              {selectedCollege ? `Alumni from ${selectedCollege}` : 'All Alumni'}
            </h3>
            <p className="text-gray-500 mt-1">
              Showing {filteredAlumni.length} {filteredAlumni.length === 1 ? 'result' : 'results'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
              defaultValue="recent"
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-20 w-20"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="mt-5 space-y-2 bg-gray-50 p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="mt-5 flex space-x-3">
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAlumni.map((alumni) => (
              <div 
                key={alumni.id} 
                className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <AlumniCard alumni={alumni} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No alumni found</h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <button 
              onClick={() => {
                setSelectedCollege('');
                setSearchTerm('');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredAlumni.length > 0 && (
        <div className="mt-12 flex items-center justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#"
              aria-current="page"
              className="z-10 bg-primary border-primary text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              2
            </a>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium"
            >
              3
            </a>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              ...
            </span>
            <a
              href="#"
              className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              8
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AlumniSection;