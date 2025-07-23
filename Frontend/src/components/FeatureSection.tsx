import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    name: 'Accommodation Finder',
    description: 'Find affordable and convenient PGs, hostels, and flats near your DU college, with verified reviews from fellow students.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'from-green-100 to-green-200',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    iconBg: 'bg-green-100',
    size: 'lg', // changed to large card
    position: 'top-left'
  },
  {
    name: 'Food Options',
    description: 'Discover affordable cafes, canteens and food joints near your college.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    color: 'from-red-100 to-red-200',
    bgColor: 'bg-red-50',
    textColor: 'text-red-800',
    iconBg: 'bg-red-100',
    size: 'lg', // changed to large card
    position: 'top-right'
  },
];

const FeatureSection: React.FC = () => {
  return (
    <section className="section-padding bg-[#fff9ed]">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-black text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6">Your Complete <span className="text-black">PG & Hostel Resource</span></h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">Everything you need for finding the perfect accommodation near Delhi University — verified PGs, hostels, and meal options to make your college life comfortable.</p>
        </div>

        {/* Features Layout - Two cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Accommodation Finder Card */}
          {features
            .filter(feature => feature.position === 'top-left')
            .map(feature => (
              <Link 
                key={feature.name} 
                to="/accommodation"
                className="group h-full p-8 rounded-3xl bg-[#5a684e] border border-transparent transition-all duration-300 cursor-pointer hover:shadow-lg block"
              >
                <div className="relative">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-white mb-6">
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <p className="text-white leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
          ))}
          
          {/* Food Options Card */}
          {features
            .filter(feature => feature.position === 'top-right')
            .map(feature => (
              <div 
                key={feature.name} 
                className="group h-full p-8 rounded-3xl bg-[#bdab93] border border-transparent transition-all duration-300"
              >
                <div className="relative">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 text-white mb-6">
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:text-gray-200 transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <p className="text-white leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 text-neutral-600 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-2 border-white"></div>
              ))}
            </div>
            <span className="text-lg">Join 10,000+ DU students already using our platform</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex text-accent-500">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-neutral-600">4.9/5 rating from students</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;