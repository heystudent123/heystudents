import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className }) => {
  return (
    <div className={`relative min-h-[70vh] overflow-hidden ${className}`}>
      <div className="container-custom pt-8 pb-20 lg:pt-16 lg:pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Hero content */}
          <div className="w-full lg:w-1/2 text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-300 text-gray-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              CUET 2025 Batch &middot; Now Enrolling
            </div>
            
            <h1 className="font-display font-bold tracking-tight text-[#030301] mb-6 text-center">
              <span className="block mb-2 font-playfair">Learn From The Ones Who</span>
              <span className="font-montserrat">Actually Did It.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#030301] max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              CUET preparation taught by AIR 19 &amp; AIR 63 national rankers — not coaching factories. Real strategies, real PYQ breakdowns, and a community of serious aspirants.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/courses"
                className="bg-black text-white py-3 px-6 rounded-xl shadow-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center btn-lg"
              >
                Enroll Now
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-col items-center justify-center gap-4 mt-8">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white">{i}</div>
                  ))}
                </div>
                <span className="text-sm">1,000+ students enrolled this cycle</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-500 mr-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm">4.9/5 · Taught by national rankers</span>
              </div>
            </div>
          </div>
          
          {/* Hero visual */}
          <div className="w-full lg:w-1/2 relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Main image container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1350&q=80"
                  alt="Student studying for CUET"
                  className="w-full h-full object-cover"
                />
                
                {/* Stats overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">AIR 19</div>
                      <div className="text-xs text-white/80">Commerce Ranker</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">AIR 63</div>
                      <div className="text-xs text-white/80">Humanities Ranker</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1000+</div>
                      <div className="text-xs text-white/80">Students Enrolled</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge — top right */}
              <div className="absolute -top-5 -right-5 animate-float z-10 bg-white shadow-xl rounded-2xl px-4 py-3 border border-black/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center text-black font-bold text-xs leading-none text-center">
                    AIR<br/>19
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Commerce Faculty</div>
                  </div>
                </div>
              </div>
              
              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-5 -left-5 animate-float z-10 bg-white shadow-xl rounded-2xl px-4 py-3 border border-black/5" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xs leading-none text-center">
                    AIR<br/>63
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500">Humanities Faculty</div>
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