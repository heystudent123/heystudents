import React, { useState, useEffect } from 'react';

// Import local images
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
  autoplaySpeed?: number;
}

interface HostelImage {
  url: string;
  alt: string;
  caption: string;
}

const HostelCarousel: React.FC<HostelCarouselProps> = ({
  autoplaySpeed = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive hook
  const useScreenSize = () => {
    const [isMobile, setIsMobile] = useState(
      typeof window !== 'undefined' ? window.innerWidth < 640 : false
    );

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
  };

  const isMobile = useScreenSize();

  const hostelImages: HostelImage[] = [
    { url: hostelImageImports.img2978, alt: "Modern student accommodation", caption: "Premium Accommodations" },
    { url: hostelImageImports.img2989, alt: "Clean hostel room", caption: "Spacious Living Areas" },
    { url: hostelImageImports.img2991, alt: "Well-maintained facilities", caption: "Quality Facilities" },
    { url: hostelImageImports.img2992, alt: "Student-friendly hostel", caption: "Student-Friendly Environment" },
    { url: hostelImageImports.img2997, alt: "Study areas", caption: "Dedicated Study Areas" },
    { url: hostelImageImports.img2998, alt: "Common areas", caption: "Relaxing Common Spaces" },
    { url: hostelImageImports.img3004, alt: "Accommodation facilities", caption: "Modern Amenities" },
    { url: hostelImageImports.img5557, alt: "Comfortable housing", caption: "Comfortable Living" },
    { url: hostelImageImports.img7289, alt: "Secure residences", caption: "Secure Residences" },
    { url: hostelImageImports.img7296, alt: "Affordable options", caption: "Affordable Options" },
    { url: hostelImageImports.img7579, alt: "Prime locations", caption: "Prime Locations" },
    { url: hostelImageImports.img7580, alt: "All inclusive", caption: "All Inclusive Packages" }
  ];

  // Autoplay logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hostelImages.length);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [autoplaySpeed, hostelImages.length]);

  // 1 image for mobile, 3 for others
  const getVisibleCount = () => (isMobile ? 1 : 3);

  const getVisibleIndices = () => {
    const indices: number[] = [];
    const total = hostelImages.length;
    const visibleCount = getVisibleCount();
    const offset = Math.floor(visibleCount / 2);

    for (let i = -offset; i <= offset; i++) {
      let idx = (currentIndex + i + total) % total;
      indices.push(idx);
    }

    return indices;
  };

  return (
    <div className="relative py-8 md:py-12 bg-transparent overflow-hidden">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-gray-800">Featured Hostels</h2>
        <p className="mt-2 text-sm md:text-lg text-gray-600">
          Discover comfortable and affordable accommodation options near Delhi University
        </p>
      </div>

      <div className="relative h-auto flex justify-center items-center overflow-hidden">
        <div className="flex justify-center items-center gap-6 md:gap-10 relative">
          {getVisibleIndices().map((idx, position) => {
            const visibleCount = getVisibleCount();
            const center = Math.floor(visibleCount / 2);

            // Styling based on position
            let scale = 1;
            let opacity = 1;
            let zIndex = 3;
            let width = isMobile ? '90vw' : '440px';
            let height = isMobile ? 'auto' : '100%';

            if (position !== center) {
              scale = 0.85;
              opacity = 0.6;
              zIndex = 1;
              width = isMobile ? '90vw' : '340px';
            }

            return (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden transition-all duration-700 ease-in-out shadow-lg"
                style={{
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex,
                  width,
                  height
                }}
              >
                <div className="w-full aspect-[4/3]">
                  <img
                    src={hostelImages[idx].url}
                    alt={hostelImages[idx].alt}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {(position === center || isMobile) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2 text-center">
                    {hostelImages[idx].caption}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HostelCarousel;
