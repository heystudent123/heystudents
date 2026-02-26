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
    role: "Commerce Stream",
    company: "SRCC, DU 2025",
    content: "I was scoring 78 percentile in mocks and had no idea where I was going wrong. After joining, the PYQ breakdown sessions completely changed how I approached each section. Ended up with 97.4 percentile."
  },
  {
    name: "Priya Patel",
    role: "Humanities Stream",
    company: "Hindu College, DU 2025",
    content: "The live doubt sessions are the real deal. I asked a question about History paper pattern at 9 PM and had a full recorded explanation waiting by morning. No coaching class ever did that."
  },
  {
    name: "Rahul Mehra",
    role: "Commerce Stream",
    company: "Hansraj College, DU 2025",
    content: "Worth every rupee. The mock test analysis told me exactly which chapter to revise and which to skip. I stopped wasting time on low-weightage topics and my score jumped in 3 weeks."
  },
  {
    name: "Sneha Verma",
    role: "Humanities Stream",
    company: "Miranda House, DU 2025",
    content: "I had failed two mock series from other platforms. This batch broke down the CUET pattern in a way nobody else does — which questions are traps, which are free marks. That clarity was everything."
  },
  {
    name: "Karan Singh",
    role: "Commerce Stream",
    company: "Ramjas College, DU 2025",
    content: "The General Test module alone is worth it. I used to skip it thinking it was easy. Turns out it's the most scoring section if you know the shortcuts — and they teach you exactly those."
  },
  {
    name: "Ananya Reddy",
    role: "Humanities Stream",
    company: "Lady Shri Ram, DU 2025",
    content: "Faculty who actually gave the exam recently — that's the biggest difference. They know what 2023 paper felt like, what the traps were, and how the marking changed. That insider knowledge is priceless."
  },
  {
    name: "Rohan Kapoor",
    role: "Commerce Stream",
    company: "Kirori Mal College, DU 2025",
    content: "The PDF notes are incredibly well structured. I printed them out and used them as my entire revision material in the last month. Every chapter had a 'what CUET actually asks' section that was spot on."
  },
  {
    name: "Ishaan Mehta",
    role: "Humanities Stream",
    company: "St. Stephen's, DU 2025",
    content: "Joined 2 months before the exam as a dropper. Was skeptical but the rank tracker after each mock kept me motivated and showed real progress. Improved from 71 to 94 percentile in 7 weeks."
  },
  {
    name: "Zara Khan",
    role: "Commerce Stream",
    company: "Jesus & Mary College, DU 2025",
    content: "What I appreciated most was the honesty — they told me which chapters to deprioritise, which is something no paid coaching ever does. Saved me weeks of pointless studying."
  },
  {
    name: "Arjun Nair",
    role: "Humanities Stream",
    company: "Gargi College, DU 2025",
    content: "The private community kept me accountable when I wanted to give up. Seeing other students post their mock scores and progress pushed me to study when I really didn't feel like it."
  },
  {
    name: "Diya Sharma",
    role: "Commerce Stream",
    company: "Deshbandhu College, DU 2025",
    content: "Best decision I made was joining this over a ₹40,000 offline coaching. Got better results, better resources, and actually understood the strategy behind every topic."
  },
  {
    name: "Kabir Malhotra",
    role: "Humanities Stream",
    company: "Venkateshwara College, DU 2025",
    content: "I was preparing alone before this and had no benchmark. The mock rank tracker put everything in perspective — I knew exactly what percentile I needed and how far I was from it each week."
  }
];

const TestimonialCard: React.FC<TestimonialProps> = ({ name, role, company, content }) => {
  // We're using setIsHovered but not isHovered
  const [, setIsHovered] = useState(false);
  
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
          <div className="bg-[#fff9ed] rounded-2xl shadow-md p-6 w-full max-w-sm mx-auto border border-black">
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
            Students who ranked. <span className="text-black">Students who stayed.</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 max-w-3xl mx-auto">
            Real results from real students — not cherry-picked toppers, just honest feedback from people who prepared with us.
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