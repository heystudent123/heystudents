import React from 'react';
import { Alumni } from '../types/alumni';

interface AlumniCardProps {
  alumni: Alumni;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={alumni.imageUrl}
              alt={alumni.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-accent w-5 h-5 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">{alumni.name}</h3>
            <p className="text-accent font-medium">{alumni.position}</p>
            <p className="text-gray-500 text-sm">{alumni.currentCompany}</p>
          </div>
        </div>
        
        <div className="mt-5 space-y-2 bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">College:</span> {alumni.college}
          </p>
          <p className="text-gray-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Passing Year:</span> {alumni.passingYear}
          </p>
        </div>

        <div className="mt-5 flex space-x-3">
          <a
            href={`mailto:${alumni.email}`}
            className="flex-1 bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </a>
          {alumni.linkedin && (
            <a
              href={alumni.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
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