import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  return (
    <div className={`relative min-h-[70vh] overflow-hidden ${className}`}>
      <div className="container-custom pt-8 pb-20 lg:pt-16 lg:pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Hero content */}
          <div className="w-full lg:w-1/2 text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-gray-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              Trusted by 10,000+ DU Students
            </div>
            
            <h1 className="font-display font-bold tracking-tight text-[#030301] mb-6 text-center">
              <span className="block mb-2 font-playfair">College Begins with</span>
              <span className="font-montserrat">The Right Place to Live</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#030301] max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            Find Your Perfect PG – Fast & Easy
(An initiative by Hindu and Hansraj Students)
Just got into college? Let us help you find verified PGs near your campus based on budget, location, food preference, and more.
Your college life begins here – make it a smooth start.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link 
                to={user ? '/accommodation' : '/login'}
                className="bg-black text-white py-3 px-6 rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center btn-lg group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 4a4 4 0 100 8a4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg>
                Find Your PG
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm">Join thousands of students</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-500 mr-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm">4.9/5 rating</span>
              </div>
            </div>
          </div>
          
          {/* Hero visual */}
          <div className="w-full lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Main image container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                  alt="Student Accommodation"
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay */}
                
                {/* Stats overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1000+</div>
                      <div className="text-xs text-white/80">Verified PGs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">5000+</div>
                      <div className="text-xs text-white/80">Happy Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">20+</div>
                      <div className="text-xs text-white/80">Localities</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating feature cards */}
              <div className="absolute -top-6 -right-6 p-4 max-w-xs animate-float group hover:scale-105 transition-all duration-300 cursor-pointer z-10 bg-white shadow-lg rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success-500 rounded-xl flex items-center justify-center group-hover:bg-success-600 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Verified Listings</div>
                    <div className="text-sm text-neutral-600">100% Safe & Secure</div>
                  </div>
                </div>
                <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-500 ease-in-out">
                  <div className="mt-3 bg-neutral-100 p-3 rounded-lg text-sm text-neutral-700">
                    All our PGs are personally verified by our team to ensure safety, cleanliness, and accurate information for students.
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-20 -left-6 p-4 max-w-xs animate-float group hover:scale-105 transition-all duration-300 cursor-pointer z-10 bg-white shadow-lg rounded-xl overflow-visible" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Verified Network of PGs</div>
                    <div className="text-sm text-neutral-600">Trusted & Verified</div>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 w-full">
                    <div className="bg-neutral-100 p-3 rounded-lg text-sm text-neutral-700 shadow-md border border-neutral-200">
                      Our extensive network of verified PGs ensures you find safe, clean, and reliable accommodation that meets your budget and location preferences.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-gentle">
          <span className="text-white/70 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;