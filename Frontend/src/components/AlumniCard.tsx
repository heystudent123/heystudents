import React, { useState } from 'react';
import { Alumni } from '../types/alumni';

interface AlumniCardProps {
  alumni: Alumni;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card header with gradient */}
      <div className="h-3 bg-gradient-to-r from-primary to-secondary"></div>
      
      <div className="p-6">
        {/* Profile section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* Profile image with animated border on hover */}
            <div className={`absolute inset-0 rounded-full ${isHovered ? 'animate-pulse-slow bg-gradient-to-r from-accent to-secondary blur-sm' : ''}`}></div>
            <div className="relative">
              <img
                src={alumni.imageUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                alt={alumni.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-accent w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-accent opacity-75"></span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-neutral-dark group-hover:text-primary transition-colors duration-300">
              {alumni.name}
            </h3>
            <p className="text-accent font-medium">{alumni.position}</p>
            <p className="text-gray-500 text-sm">{alumni.currentCompany}</p>
          </div>
        </div>
        
        {/* Info section with glass morphism effect */}
        <div className="mt-5 space-y-3 bg-gray-50/80 backdrop-blur-sm p-5 rounded-xl border border-gray-100">
          <p className="text-gray-700 flex items-center">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <span>
              <span className="font-medium text-neutral-dark">College:</span> 
              <span className="text-gray-600 ml-1">{alumni.college}</span>
            </span>
          </p>
          
          <p className="text-gray-700 flex items-center">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <span>
              <span className="font-medium text-neutral-dark">Passing Year:</span> 
              <span className="text-gray-600 ml-1">{alumni.passingYear}</span>
            </span>
          </p>
        </div>

        {/* Action buttons with hover effects */}
        <div className="mt-6 flex space-x-3">
          <a
            href={`mailto:${alumni.email}`}
            className="flex-1 group bg-gradient-to-r from-accent to-accent-dark text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-md hover:shadow-accent/20 hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 w-full h-full rounded-lg opacity-0 group-hover:opacity-20 bg-white"></span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </a>
          {alumni.linkedin && (
            <a
              href={alumni.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 group bg-gradient-to-r from-primary to-primary-dark text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 w-full h-full rounded-lg opacity-0 group-hover:opacity-20 bg-white"></span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniCard;