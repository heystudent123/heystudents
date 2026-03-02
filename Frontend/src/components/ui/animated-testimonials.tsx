import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export type AnimatedTestimonialItem = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  badge?: string;
};

// Stable per-index rotations so they don't change on every render
const ROTATIONS = [-5, 4, -3, 6, -2, 5, -4, 3];

const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: AnimatedTestimonialItem[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goTo = (i: number) => {
    setActive(i);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  // Animate text panel on active change
  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.transition = 'none';
    textRef.current.style.opacity = '0';
    textRef.current.style.transform = 'translateY(16px)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!textRef.current) return;
        textRef.current.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        textRef.current.style.opacity = '1';
        textRef.current.style.transform = 'translateY(0)';
      });
    });
  }, [active]);

  return (
    <div className="mx-auto max-w-sm px-4 py-10 antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-20">

        {/* Image stacker */}
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-full max-w-xs">
            {testimonials.map((t, index) => {
              const isAct = index === active;
              const dist = Math.abs(index - active);
              const rot = isAct ? 0 : ROTATIONS[index % ROTATIONS.length];
              return (
                <div
                  key={t.src}
                  className="absolute inset-0 origin-bottom"
                  style={{
                    opacity: isAct ? 1 : 0.4,
                    transform: `scale(${isAct ? 1 : 0.9}) translateY(${isAct ? 0 : 20}px) rotate(${rot}deg)`,
                    zIndex: isAct ? testimonials.length : testimonials.length - dist,
                    transition: 'opacity 0.5s ease, transform 0.5s ease',
                  }}
                >
                  <img
                    src={t.src}
                    alt={t.name}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover shadow-2xl"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/500x500/1a1a1a/f59e0b?text=${encodeURIComponent(t.name.charAt(0))}`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  {/* rank badge overlay */}
                  {t.badge && (
                    <span
                      className="absolute bottom-4 left-4 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow"
                      style={{
                        opacity: isAct ? 1 : 0,
                        transform: `translateY(${isAct ? 0 : 8}px)`,
                        transition: 'opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s',
                      }}
                    >
                      {t.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Text + controls */}
        <div className="flex flex-col justify-center py-4">
          <div ref={textRef} style={{ opacity: 1, transform: 'translateY(0)' }}>
            <h3 className="text-2xl font-bold text-black">{testimonials[active].name}</h3>
            <p className="text-sm text-amber-600 font-semibold mt-0.5">{testimonials[active].designation}</p>
            <p className="mt-6 text-base text-neutral-600 leading-relaxed">
              "{testimonials[active].quote}"
            </p>
          </div>

          {/* dot indicators */}
          <div className="flex justify-center gap-1.5 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-amber-400' : 'w-1.5 bg-black/20'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* arrow controls */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/5 hover:bg-amber-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-black transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-black/5 hover:bg-amber-400 transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-black transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedTestimonials;
