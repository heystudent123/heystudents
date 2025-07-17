import React, { useEffect, useRef, useState } from 'react';

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  content: string;
}

// Custom hook to detect screen size
const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return { isMobile };
};

// Extended testimonial data with more entries
const testimonialData: TestimonialProps[] = [
  {
    name: "Aarav Sharma",
    role: "3rd Year",
    company: "Hansraj College",
    content: "This platform has been a game-changer for me. From finding study materials to connecting with seniors who guided my career path - it's truly the ultimate DU companion!"
  },
  {
    name: "Priya Patel",
    role: "1st Year",
    company: "Miranda House",
    content: "As a fresher, I was overwhelmed with college life. This site helped me find accommodation, access previous years' notes, and discover college events all in one place!"
  },
  {
    name: "Rahul Gupta",
    role: "Alumni",
    company: "St. Stephen's College",
    content: "As an alumnus, I love being able to mentor current students. The alumni network here makes it easy to give back to the DU community and help the next generation."
  },
  {
    name: "Neha Verma",
    role: "2nd Year",
    company: "Lady Shri Ram College",
    content: "The PG finder tool saved me so much time! I found a perfect place near campus within my budget in just two days. Highly recommend to all DU students!"
  },
  {
    name: "Vikram Singh",
    role: "Final Year",
    company: "Ramjas College",
    content: "The study resources and past papers section is gold! It helped me improve my grades significantly. The community here is super supportive too."
  },
  {
    name: "Ananya Reddy",
    role: "2nd Year",
    company: "Hindu College",
    content: "The events calendar helped me discover so many interesting workshops and seminars. I've made great connections and learned valuable skills outside the classroom."
  },
  {
    name: "Rohan Kapoor",
    role: "Final Year",
    company: "Kirori Mal College",
    content: "Finding internships was a breeze with the career portal. I landed my dream internship and it's all thanks to the connections I made through this platform."
  },
  {
    name: "Ishaan Mehta",
    role: "3rd Year",
    company: "SRCC",
    content: "The roommate matching feature helped me find someone compatible to share my PG with. We've become great friends and it's made my college experience so much better."
  },
  {
    name: "Zara Khan",
    role: "1st Year",
    company: "Jesus & Mary College",
    content: "As someone new to Delhi, this platform made me feel welcome and helped me navigate the city. The local guides and tips section is incredibly helpful!"
  },
  {
    name: "Arjun Nair",
    role: "Alumni",
    company: "Venkateshwara College",
    content: "Even after graduating, I still use this platform to mentor juniors and stay connected with campus happenings. It's a community that extends beyond your college years."
  },
  {
    name: "Diya Sharma",
    role: "2nd Year",
    company: "Gargi College",
    content: "The budget meal finder feature has saved me so much money! As a student on a tight budget, finding affordable and good food options nearby is a lifesaver."
  },
  {
    name: "Kabir Malhotra",
    role: "Final Year",
    company: "Deshbandhu College",
    content: "The study group feature helped me connect with peers in my major. Our weekly sessions have significantly improved my understanding of complex topics."
  }
];

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, company, content }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`p-6 rounded-2xl shadow-md transition-all duration-300 bg-[#fff9ed] border border-black`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-neutral-900">{name}</h3>
        <p className="text-xs text-neutral-500">{company}, {role}</p>
      </div>
      <p className={`text-sm leading-relaxed text-neutral-700`}>{content}</p>
    </div>
  );
};

// Mobile testimonial carousel component
const TestimonialCarousel: React.FC<{ testimonials: TestimonialProps[] }> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl mb-8">
      {/* Carousel container */}
      <div className="h-full w-full relative">
        {/* Current testimonial */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-auto border border-gray-100">
            <div className="mb-4">
              <p className="text-gray-600 italic">"{testimonials[currentIndex].content}"</p>
            </div>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                {testimonials[currentIndex].name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{testimonials[currentIndex].name}</p>
                <p className="text-sm text-gray-500">{testimonials[currentIndex].role}, {testimonials[currentIndex].company}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation arrows - adjusted positioning and z-index */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10"
        aria-label="Previous testimonial"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none z-10"
        aria-label="Next testimonial"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {testimonials.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-primary-600' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Component for a single scrolling column
const TestimonialColumn: React.FC<{ testimonials: TestimonialProps[], direction: 'up' | 'down' }> = ({ testimonials, direction }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isMouseOver, setIsMouseOver] = useState(false);
  
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    // Set initial scroll position
    if (direction === 'up') {
      // For upward scrolling columns, start from middle
      scrollContainer.scrollTop = scrollContainer.scrollHeight / 2;
    }
    
    const autoScroll = () => {
      if (scrollContainer && !isMouseOver) {
        // Determine scroll direction and speed - increased for better visibility
        const scrollAmount = direction === 'up' ? -1.0 : 1.0;
        
        // Apply scroll
        scrollContainer.scrollTop += scrollAmount;
        
        // Handle infinite scroll loop
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        
        // More aggressive reset to ensure columns don't get stuck
        if (direction === 'up' && scrollContainer.scrollTop <= 10) {
          // If scrolling up and reached top, jump to bottom
          scrollContainer.scrollTop = maxScroll - 20;
        } else if (direction === 'down' && scrollContainer.scrollTop >= maxScroll - 10) {
          // If scrolling down and reached bottom, jump to top
          scrollContainer.scrollTop = 20;
        }
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(autoScroll);
    };
    
    // Start the animation
    animationRef.current = requestAnimationFrame(autoScroll);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, isMouseOver]);

  return (
    <div 
      className={`relative w-full h-[500px] overflow-hidden rounded-xl transition-all duration-300 ${isMouseOver ? 'shadow-lg' : 'shadow-sm'}`}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {/* Top blur gradient */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#fff9ed] to-transparent z-10 pointer-events-none"></div>
      
      <div 
        ref={scrollRef}
        className="h-full overflow-y-auto scrollbar-hide py-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Original testimonials */}
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
        
        {/* Duplicate testimonials to create seamless loop effect */}
        {testimonials.slice(0, 3).map((testimonial, index) => (
          <TestimonialCard key={`duplicate-${index}`} {...testimonial} />
        ))}
      </div>
      
      {/* Bottom blur gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#fff9ed] to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  // Use custom hook to detect screen size
  const { isMobile } = useScreenSize();
  
  // Split testimonials into three groups for the three columns
  const columnOneTestimonials = testimonialData.slice(0, 6);
  const columnTwoTestimonials = testimonialData.slice(3, 9);
  const columnThreeTestimonials = testimonialData.slice(6, 12);

  return (
    <div className="bg-transparent py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3 md:mb-4">
            For Students, <span className="text-black">By Students</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Join thousands of Delhi University students who use Hey Students to enhance their university experience.
          </p>
        </div>
        
        {isMobile ? (
          // Mobile view - Carousel
          <TestimonialCarousel testimonials={testimonialData} />
        ) : (
          // Desktop view - Three columns
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* First column - scrolling down */}
            <div className="w-full">
              <TestimonialColumn testimonials={columnOneTestimonials} direction="down" />
            </div>
            
            {/* Second column - scrolling up */}
            <div className="w-full">
              <TestimonialColumn testimonials={columnTwoTestimonials} direction="up" />
            </div>
            
            {/* Third column - scrolling down */}
            <div className="w-full">
              <TestimonialColumn testimonials={columnThreeTestimonials} direction="down" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;