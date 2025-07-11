import React, { useState, useEffect } from 'react';

// Import local images
// We're using require for images to work with TypeScript
const hostelImageImports = {
  img2978: require('../img/IMG_2978.JPG'),
  img2989: require('../img/IMG_2989.JPG'),
  img2991: require('../img/IMG_2991.JPG'),
  img2992: require('../img/IMG_2992.JPG'),
  img2997: require('../img/IMG_2997.JPG'),
  img2998: require('../img/IMG_2998.JPG'),
  img3004: require('../img/IMG_3004.JPG'),
  img5557: require('../img/IMG_5557.JPG'),
  img7289: require('../img/IMG_7289.JPG'),
  img7296: require('../img/IMG_7296.JPG'),
  img7579: require('../img/IMG_7579.JPG'),
  img7580: require('../img/IMG_7580.JPG')
};

interface HostelCarouselProps {
  autoplaySpeed?: number; // in milliseconds
  slideTransitionDuration?: number; // in milliseconds
}

interface HostelImage {
  url: string;
  alt: string;
  caption: string;
}

const HostelCarousel: React.FC<HostelCarouselProps> = ({ 
  autoplaySpeed = 3000,
  slideTransitionDuration = 500 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Custom hook to detect screen size
  const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState({
      isMobile: typeof window !== 'undefined' ? window.innerWidth < 640 : false,
      isTablet: typeof window !== 'undefined' ? window.innerWidth >= 640 && window.innerWidth < 1024 : false,
      isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
    });

    useEffect(() => {
      if (typeof window === 'undefined') return;
      
      const handleResize = () => {
        setScreenSize({
          isMobile: window.innerWidth < 640,
          isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
          isDesktop: window.innerWidth >= 1024
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
  };

  const { isMobile, isTablet, isDesktop } = useScreenSize();
  
  // Local hostel images from the img folder
  const hostelImages: HostelImage[] = [
    {
      url: hostelImageImports.img2978,
      alt: "Modern student accommodation with comfortable facilities",
      caption: "Premium Accommodations"
    },
    {
      url: hostelImageImports.img2989,
      alt: "Clean and organized hostel room",
      caption: "Spacious Living Areas"
    },
    {
      url: hostelImageImports.img2991,
      alt: "Well-maintained hostel facilities",
      caption: "Quality Facilities"
    },
    {
      url: hostelImageImports.img2992,
      alt: "Student-friendly living environment",
      caption: "Student-Friendly Environment"
    },
    {
      url: hostelImageImports.img2997,
      alt: "Convenient study areas for students",
      caption: "Dedicated Study Areas"
    },
    {
      url: hostelImageImports.img2998,
      alt: "Relaxing common areas for students",
      caption: "Relaxing Common Spaces"
    },
    {
      url: hostelImageImports.img3004,
      alt: "Well-equipped accommodation facilities",
      caption: "Modern Amenities"
    },
    {
      url: hostelImageImports.img5557,
      alt: "Comfortable student housing options",
      caption: "Comfortable Living"
    },
    {
      url: hostelImageImports.img7289,
      alt: "Secure and well-maintained student residences",
      caption: "Secure Residences"
    },
    {
      url: hostelImageImports.img7296,
      alt: "Affordable student housing with great facilities",
      caption: "Affordable Options"
    },
    {
      url: hostelImageImports.img7579,
      alt: "Conveniently located student accommodations",
      caption: "Prime Locations"
    },
    {
      url: hostelImageImports.img7580,
      alt: "Student-friendly housing with all necessities",
      caption: "All Inclusive Packages"
    }
  ];

  // Determine how many images to show based on screen size
  const getVisibleCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 3;
    return 5; // Desktop
  };

  // Function to get the indices of visible images based on screen size
  const getVisibleIndices = () => {
    const indices: number[] = [];
    const totalImages = hostelImages.length;
    const visibleCount = getVisibleCount();
    const offset = Math.floor(visibleCount / 2);
    
    for (let i = -offset; i <= offset; i++) {
      // Skip indices that would make more than visibleCount
      if (indices.length >= visibleCount) break;
      
      let index = currentIndex + i;
      
      // Handle wrapping around the array
      if (index < 0) index = totalImages + index;
      if (index >= totalImages) index = index - totalImages;
      
      indices.push(index);
    }
    
    return indices;
  };

  // Autoplay functionality with continuous movement in one direction
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % hostelImages.length);
          setIsTransitioning(false);
        }, slideTransitionDuration);
      }
    }, autoplaySpeed);
    
    return () => clearInterval(interval);
  }, [autoplaySpeed, hostelImages.length, isTransitioning, slideTransitionDuration, isPaused]);

  // Navigation functions
  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setIsPaused(true); // Pause autoplay when manually navigating
      setCurrentIndex((prevIndex) => (prevIndex + 1) % hostelImages.length);
      setTimeout(() => setIsTransitioning(false), slideTransitionDuration);
    }
  };
  
  const handlePrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setIsPaused(true); // Pause autoplay when manually navigating
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? hostelImages.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsTransitioning(false), slideTransitionDuration);
    }
  };
  
  // Toggle autoplay
  const toggleAutoplay = () => {
    setIsPaused(prev => !prev);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Space') {
        setIsPaused(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative py-8 md:py-12 overflow-hidden">
      {/* Background with similar styling to hero */}
      <div className="absolute inset-0 bg-white">
        {/* Floating orbs similar to hero - hidden on mobile */}
        {!isMobile && (
          <>
            <div className="absolute -top-24 -right-24 w-48 md:w-72 h-48 md:h-72 rounded-full bg-accent-400/10 blur-3xl animate-float"></div>
            <div className="absolute bottom-1/3 -left-24 w-40 md:w-64 h-40 md:h-64 rounded-full bg-secondary-400/10 blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-32 md:w-48 h-32 md:h-48 rounded-full bg-primary-400/15 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </>
        )}
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700">Featured Hostels</h2>
          <p className="mt-2 text-sm md:text-lg text-gray-600">Discover comfortable and affordable accommodation options near Delhi University</p>
        </div>
        
        <div className="relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden px-2 md:px-4">
          {/* Carousel display with continuous side-to-side animation */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
            style={{
              gap: isMobile ? '0' : isTablet ? '8px' : '12px',
              transform: isTransitioning ? 
                `translateX(${isMobile ? '-50px' : isTablet ? '-75px' : '-100px'})` : 
                'translateX(0)',
            }}
          >
            {getVisibleIndices().map((index, i) => {
              // Determine size and styling based on position and screen size
              let width: string;
              let height: string;
              let opacity: number;
              let zIndex: number;
              const visibleCount = getVisibleCount();
              
              if (isMobile) {
                // Mobile: Show only 1 image
                width = '85%';
                height = '90%';
                opacity = 1;
                zIndex = 3;
              } else if (isTablet) {
                // Tablet: Show 3 images
                switch(i) {
                  case 0: // Left
                    width = '25%';
                    height = '75%';
                    opacity = 0.7;
                    zIndex = 1;
                    break;
                  case 1: // Center/focused
                    width = '40%';
                    height = '85%';
                    opacity = 1;
                    zIndex = 3;
                    break;
                  case 2: // Right
                    width = '25%';
                    height = '75%';
                    opacity = 0.7;
                    zIndex = 1;
                    break;
                  default:
                    width = '30%';
                    height = '80%';
                    opacity = 0.8;
                    zIndex = 1;
                }
              } else {
                // Desktop: Show 5 images
                switch(i) {
                  case 0: // Far left
                    width = '18%';
                    height = '70%';
                    opacity = 0.6;
                    zIndex = 1;
                    break;
                  case 1: // Left
                    width = '22%';
                    height = '80%';
                    opacity = 0.8;
                    zIndex = 2;
                    break;
                  case 2: // Center/focused
                    width = '26%';
                    height = '90%';
                    opacity = 1;
                    zIndex = 3;
                    break;
                  case 3: // Right
                    width = '22%';
                    height = '80%';
                    opacity = 0.8;
                    zIndex = 2;
                    break;
                  case 4: // Far right
                    width = '18%';
                    height = '70%';
                    opacity = 0.6;
                    zIndex = 1;
                    break;
                  default:
                    width = '20%';
                    height = '75%';
                    opacity = 0.7;
                    zIndex = 1;
                }
              }
              
              return (
                <div 
                  key={index}
                  className="rounded-xl md:rounded-2xl overflow-hidden shadow-lg transition-all duration-500 flex-shrink-0"
                  style={{
                    width,
                    height,
                    opacity,
                    zIndex,
                  }}
                >
                  <img 
                    src={hostelImages[index].url} 
                    alt={hostelImages[index].alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Caption - only show on larger screens and for center image */}
                  {((isDesktop && i === 2) || (isTablet && i === 1) || isMobile) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 md:p-3 text-xs md:text-sm">
                      {hostelImages[index].caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Navigation controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3">
            {/* Previous button */}
            <button 
              onClick={handlePrevious}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-primary-600 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Play/Pause button */}
            <button 
              onClick={toggleAutoplay}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-primary-600 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {/* Next button */}
            <button 
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-primary-600 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Navigation dots */}
            <div className="hidden sm:flex absolute -bottom-8 left-0 right-0 justify-center gap-1.5">
              {hostelImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 ${idx === currentIndex ? 'bg-primary-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelCarousel;
