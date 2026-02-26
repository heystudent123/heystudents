import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export type AnimatedTestimonialItem = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  badge?: string;
};

const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: AnimatedTestimonialItem[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [autoplay, handleNext]);

  const isActive = (index: number) => index === active;

  const randomRotate = () => `${Math.floor(Math.random() * 14) - 7}deg`;

  return (
    <div className="mx-auto max-w-sm px-4 py-10 antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-20">

        {/* Image stacker */}
        <div className="flex items-center justify-center">
          <div className="relative h-80 w-full max-w-xs">
            <AnimatePresence>
              {testimonials.map((t, index) => (
                <motion.div
                  key={t.src}
                  initial={{ opacity: 0, scale: 0.9, y: 50, rotate: randomRotate() }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.4,
                    scale: isActive(index) ? 1 : 0.9,
                    y: isActive(index) ? 0 : 20,
                    zIndex: isActive(index) ? testimonials.length : testimonials.length - Math.abs(index - active),
                    rotate: isActive(index) ? '0deg' : randomRotate(),
                  }}
                  exit={{ opacity: 0, scale: 0.9, y: -50 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="absolute inset-0 origin-bottom"
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
                  {t.badge && isActive(index) && (
                    <motion.span
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow"
                    >
                      {t.badge}
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Text + controls */}
        <div className="flex flex-col justify-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <h3 className="text-2xl font-bold text-black">{testimonials[active].name}</h3>
              <p className="text-sm text-amber-600 font-semibold mt-0.5">{testimonials[active].designation}</p>
              <p className="mt-6 text-base text-neutral-600 leading-relaxed">
                "{testimonials[active].quote}"
              </p>
            </motion.div>
          </AnimatePresence>

          {/* dot indicators */}
          <div className="flex gap-1.5 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-amber-400' : 'w-1.5 bg-black/20'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* arrow controls */}
          <div className="flex gap-3 mt-6">
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
