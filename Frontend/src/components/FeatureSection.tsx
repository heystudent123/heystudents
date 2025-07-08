import React from 'react';

const features = [
  {
    name: 'Study Resources',
    description: 'Access a comprehensive library of study materials, previous year papers, notes, and resources specific to your DU courses.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'from-primary-500 to-primary-600',
    bgColor: 'bg-primary-50',
    textColor: 'text-primary-600'
  },
  {
    name: 'Alumni Network',
    description: 'Connect with DU alumni from various colleges who can provide mentorship, career guidance, and insights about your academic journey.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: 'from-secondary-500 to-secondary-600',
    bgColor: 'bg-secondary-50',
    textColor: 'text-secondary-600'
  },
  {
    name: 'Campus Events',
    description: 'Stay updated with all the events, fests, seminars, and workshops happening across DU colleges to never miss an opportunity.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-accent-500 to-accent-600',
    bgColor: 'bg-accent-50',
    textColor: 'text-accent-600'
  },
  {
    name: 'Accommodation Finder',
    description: 'Find affordable and convenient PGs, hostels, and flats near your DU college, with verified reviews from fellow students.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: 'from-success-500 to-success-600',
    bgColor: 'bg-success-50',
    textColor: 'text-success-600'
  },
];

const FeatureSection: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6">
            Your Complete <span className="text-gradient">DU Student Resource</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need for a successful journey at Delhi University — from academic resources to networking opportunities, all in one beautifully designed platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={feature.name} 
              className="group relative p-8 rounded-3xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${feature.bgColor} ${feature.textColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  {feature.name}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
                
                {/* Arrow indicator */}
                <div className="mt-6 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                  <span className="text-sm font-medium mr-2">Learn more</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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