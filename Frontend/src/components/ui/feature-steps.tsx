import React, { useState, useEffect } from "react";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
}

export function FeatureSteps({
  features,
  className = "",
  title = "How It Works",
  autoPlayInterval = 4000,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentFeature((c) => (c + 1) % features.length);
          return 0;
        }
        return prev + 100 / (autoPlayInterval / 100);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [features.length, autoPlayInterval]);

  return (
    <div className={`px-4 py-10 md:py-14 ${className}`}>
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">
            What's Inside
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-black">{title}</h2>
          <p className="text-neutral-500 mt-2 max-w-lg mx-auto text-sm">
            Commerce &amp; Humanities streams covered end-to-end, General Test
            included.
          </p>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10 items-center">
          {/* Left — step list */}
          <div className="order-2 md:order-1 space-y-2 w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-5 cursor-pointer"
                style={{
                  opacity: index === currentFeature ? 1 : 0.35,
                  transition: 'opacity 0.4s ease',
                }}
                onClick={() => {
                  setCurrentFeature(index);
                  setProgress(0);
                }}
              >
                {/* Circle indicator */}
                <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                  <div
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors duration-300 ${
                      index === currentFeature
                        ? "bg-black border-black text-white"
                        : "bg-neutral-100 border-neutral-300 text-neutral-500"
                    }`}
                    style={{
                      transform: index === currentFeature ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {index < currentFeature ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {/* Connector line */}
                  {index < features.length - 1 && (
                    <div className="w-px flex-1 mt-2 min-h-[28px] bg-neutral-200" />
                  )}
                </div>

                {/* Text */}
                <div className="pb-3">
                  <h3 className="text-base md:text-lg font-semibold text-black leading-snug">
                    {feature.title || feature.step}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed">
                    {feature.content}
                  </p>

                  {/* Progress bar — only on active */}
                  {index === currentFeature && (
                    <div className="mt-3 h-0.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${progress}%`,
                          transition: 'width 0.1s linear',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right — image */}
          <div className="order-1 md:order-2 relative w-full h-[200px] md:h-[340px] rounded-2xl overflow-hidden bg-neutral-100 shadow-md">
            {features.map((feature, index) => (
              <div
                key={index}
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  opacity: index === currentFeature ? 1 : 0,
                  transform: index === currentFeature
                    ? 'translateY(0) rotateX(0deg)'
                    : 'translateY(60px) rotateX(-10deg)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  pointerEvents: index === currentFeature ? 'auto' : 'none',
                }}
              >
                <img
                  src={feature.image}
                  alt={feature.step}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                {/* Step label overlay */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-block bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    {feature.step}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
