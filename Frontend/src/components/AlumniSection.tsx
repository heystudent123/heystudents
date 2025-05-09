import React, { useState } from 'react';
import AlumniCard from './AlumniCard';
import { alumniData } from '../data/alumni';
import CollegeSelector from './CollegeSelector';

const AlumniSection: React.FC = () => {
  const [selectedCollege, setSelectedCollege] = useState('');

  const filteredAlumni = selectedCollege
    ? alumniData.filter((alumni) => alumni.college === selectedCollege)
    : alumniData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="lg:text-center mb-12">
        <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Alumni Network</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-primary sm:text-4xl">
          Our Distinguished Alumni
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Connect with alumni who can help guide your career path and expand your professional network.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <CollegeSelector
          selectedCollege={selectedCollege}
          onCollegeChange={setSelectedCollege}
        />
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-primary">
            {selectedCollege ? `Alumni from ${selectedCollege}` : 'All Alumni'}
          </h3>
          <span className="bg-accent/10 text-accent text-xs font-medium px-2.5 py-0.5 rounded-full">
            {filteredAlumni.length} {filteredAlumni.length === 1 ? 'alumni' : 'alumni'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAlumni.map((alumni) => (
            <div key={alumni.id} className="transform transition-all duration-300 hover:scale-105">
              <AlumniCard alumni={alumni} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlumniSection; 