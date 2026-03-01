import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import SharedNavbar from '../components/SharedNavbar';
import Testimonials from '../components/Testimonials';
import { FeatureSteps } from '../components/ui/feature-steps';
import AnimatedTestimonials, { AnimatedTestimonialItem } from '../components/ui/animated-testimonials';
import { coursesApi } from '../services/api';

interface Course {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  instructor?: string;
  price: number;
  originalPrice?: number;
  isPaid: boolean;
  features?: string[];
  isActive: boolean;
}

/* ── Scroll-reveal wrapper ─────────────────────────────────────── */
const FadeIn: React.FC<{ children: ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-6');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

const FACULTY: AnimatedTestimonialItem[] = [
  {
    name: 'Moksh Jindal',
    designation: 'AIR 19 · CUET 2023 · Hansraj College, Delhi University',
    badge: 'AIR 19 · Commerce',
    src: '/Moksh.jpg',
    quote:
      '100 Percentile in English & Economics. BA (Hons) Economics at Hansraj College, DU. My preparation strategy is built around concept clarity with exam precision — understanding what actually gets asked, what can be skipped, and how to maximise marks in minimum time.',
  },
  {
    name: 'Naman Kumar',
    designation: 'AIR 63 · CUET · Hindu College, Delhi University',
    badge: 'AIR 63 · Commerce',
    src: '/Naman.jpeg',
    quote:
      '99.2 Percentile in Accountancy. 98.9 Percentile in Business Studies. B.Com (Hons) at Hindu College, DU. I teach smart Accountancy solving frameworks, Business Studies scoring strategy, and structured revision systems — not theory, execution.',
  },
];

const DEFAULT_FEATURES = [
  'Live weekly classes — Commerce & Humanities',
  'General Test: GK, English & Reasoning',
  '20+ full-length CUET-pattern mock tests',
  'Weekly doubt-clearing with faculty',
  'Chapter-wise PDF notes for all subjects',
  'Complete PYQ analysis & solutions',
  'Rank tracker after every mock',
  'Private student community access',
];

const HomePage: React.FC = () => {
  const contentStyle: React.CSSProperties = { paddingTop: '64px' };
  const [courses, setCourses] = useState<Course[]>([]);
  const { isSignedIn: isClerkSignedIn } = useClerkAuth();
  const { user: clerkUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    coursesApi.getAll({ isActive: true })
      .then((res) => setCourses(res.data || res.courses || []))
      .catch(() => {});
  }, []);

  const premiumCourse = courses.find(c => c.isPaid) || courses[0] || null;

  // Clicking "Enroll Now" → store intent, go to CoursesPage which handles the full flow
  const handleHomeEnroll = () => {
    sessionStorage.setItem('autoEnroll', 'true');
    navigate('/courses');
  };

  return (
    <div className="min-h-screen w-full" style={{ background: '#fff9ed' }}>
      <SharedNavbar />
      <div style={contentStyle}>
        <Hero className="relative min-h-[70vh] overflow-hidden" />

        {/* ── WHY HEYSTUDENT ──────────────────────────────────────── */}
        <FadeIn>
          <section className="py-20 md:py-28 px-4" style={{ background: '#fff9ed' }}>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Why Heystudent?</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Because your preparation deserves<br />more than random YouTube videos.</h2>
                <p className="text-neutral-500 max-w-xl mx-auto text-base leading-relaxed">
                  Heystudent is built by All India Rankers, students currently studying in SRCC, Hindu &amp; Hansraj, and a team that has analysed 3 years of CUET trends.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: What we teach */}
                <div className="bg-black rounded-3xl p-8 flex flex-col">
                  <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">What We Teach</p>
                  <h3 className="text-xl font-bold text-white mb-5">We don't teach chapters.</h3>
                  <ul className="space-y-4">
                    {[
                      { icon: '🎯', text: 'What actually gets asked' },
                      { icon: '⏭️', text: 'What can be skipped' },
                      { icon: '⚡', text: 'What gives maximum marks in minimum time' },
                      { icon: '🧠', text: 'How to structure preparation strategically' },
                    ].map(({ icon, text }) => (
                      <li key={text} className="flex items-start gap-3 text-neutral-300 text-sm">
                        <span className="text-lg leading-none mt-0.5">{icon}</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Right: What makes us different */}
                <div className="bg-amber-400 rounded-3xl p-8 flex flex-col">
                  <p className="text-xs font-bold tracking-widest uppercase text-black/60 mb-3">What Makes Us Different</p>
                  <h3 className="text-xl font-bold text-black mb-2">While others teach everything, we decode what matters.</h3>
                  <p className="text-black/70 text-sm mb-5">That edge is the difference between a good score and SRCC.</p>
                  <ul className="space-y-3">
                    {[
                      { icon: '🔍', text: 'Analyse previous year papers deeply' },
                      { icon: '📊', text: 'Identify high-probability patterns' },
                      { icon: '🎯', text: 'Predict high-probability areas' },
                      { icon: '🧠', text: 'Train you for smart attempt strategy' },
                    ].map(({ icon, text }) => (
                      <li key={text} className="flex items-start gap-3 text-black text-sm font-medium">
                        <span className="text-lg leading-none mt-0.5">{icon}</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* ── WHAT'S INCLUDED ──────────────────────────────────────── */}
        <FadeIn>
          <FeatureSteps
            title="Everything included in one batch."
            autoPlayInterval={4500}
            className="bg-[#fff9ed]"
            features={[
              {
                step: 'Live Classes',
                title: 'Live Interactive Classes',
                content:
                  'Complete syllabus covered live by AIR rankers. We solve Previous Year Questions in real-time and decode exactly what you can expect this year — recorded for replay anytime.',
                image:
                  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1171&q=80',
              },
              {
                step: 'Trend Analysis',
                title: 'Deep CUET Trend Analysis',
                content:
                  '3 years of CUET trends broken down. We identify high-probability topics, repeated patterns, and subject-wise scoring behaviour so you never study the wrong things.',
                image:
                  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1170&q=80',
              },
              {
                step: 'Mentorship',
                title: 'Personal Mentorship from DU Students',
                content:
                  'Direct guidance from students at SRCC, Hindu and Hansraj — college preference strategy, cut-off navigation, and real exam-day mindset from people who lived it.',
                image:
                  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1170&q=80',
              },
              {
                step: 'Strategy Sessions',
                title: 'Exclusive Ranker Strategy Sessions',
                content:
                  'All India Rankers share their real exam-day approaches — how to attempt smartly under pressure, manage time, and convert preparation into percentile.',
                image:
                  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1170&q=80',
              },
            ]}
          />
        </FadeIn>

        {/* ── PRICING CARD ─────────────────────────────────────────── */}
        <section className="py-10 md:py-16 px-4" style={{ background: '#fff9ed' }}>
          <div className="max-w-2xl mx-auto md:px-14">
            <FadeIn>
              <div className="text-center mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-2">Pricing</p>
                <h2 className="text-2xl md:text-3xl font-bold text-black">Exam Decoders Batch</h2>
                <p className="text-neutral-500 mt-1 text-sm">Decode the Pattern. Master the Strategy. Dominate the Exam.</p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <HomePricingCarousel courses={courses} defaultFeatures={DEFAULT_FEATURES} onEnroll={handleHomeEnroll} />
            </FadeIn>
          </div>
        </section>

        {/* ── FACULTY ──────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Meet The Founding Team</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black">You are not learning from someone<br/>who "heard about CUET."</h2>
                <p className="text-neutral-500 mt-3 max-w-lg mx-auto">
                  You are learning from those who lived it, cracked it, and analysed it — and came back to build a system around it.
                </p>
              </div>
            </FadeIn>
            <AnimatedTestimonials testimonials={FACULTY} autoplay />
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <FadeIn>
          <Testimonials />
        </FadeIn>

        {/* ── FINAL CTA ────────────────────────────────────────────── */}
        <FadeIn>
          <section className="py-20 md:py-28 px-4 bg-black">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-4">The Reality</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Every year, lakhs prepare.<br />Very few understand the pattern.
              </h2>
              <p className="text-neutral-400 mb-3 text-base leading-relaxed">
                Most students realise what they should have done — after results.
              </p>
              <p className="text-neutral-300 mb-10 text-lg font-medium">
                We don't want that to be you.
              </p>
              <Link
                to="/courses"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-bold px-10 py-4 rounded-2xl text-base transition-colors"
              >
                Explore
              </Link>
              <p className="text-neutral-600 text-sm mt-4">Not theory. Not guesswork. Just strategy + execution.</p>
            </div>
          </section>
        </FadeIn>


      </div>
    </div>
  );
};

/* ── Home Pricing Card ──────────────────────────────────────── */
const HomePricingCard: React.FC<{ course: Course; defaultFeatures: string[]; onEnroll: () => void }> = ({ course, defaultFeatures, onEnroll }) => {
  const [showAll, setShowAll] = useState(false);
  const allFeatures = course.features?.length ? course.features : defaultFeatures;
  const SHOW = 5;
  const visibleFeatures = showAll ? allFeatures : allFeatures.slice(0, SHOW);
  const overflowCount = allFeatures.length - SHOW;
  const hasSavings = (course.originalPrice ?? 0) > course.price;

  return (
    <div
      className="group relative bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.13)]"
      style={{ boxShadow: '0 6px 32px rgba(0,0,0,0.45)' }}
    >
      <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
      <div className="p-6 md:p-10">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-white font-extrabold text-lg md:text-2xl leading-tight text-center">{course.title}</h3>
        </div>
        {hasSavings && (
          <div className="flex justify-center mb-2">
            <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full whitespace-nowrap">
              Save ₹{((course.originalPrice ?? 0) - course.price).toLocaleString('en-IN')}
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-end gap-3 mb-5" style={{ filter: 'drop-shadow(0 0 18px rgba(251,191,36,0.25))' }}>
          <span className="text-5xl md:text-6xl font-black text-white tracking-tight">₹{course.price.toLocaleString('en-IN')}</span>
          {hasSavings && (
            <span className="text-xl text-neutral-500 line-through mb-2">₹{(course.originalPrice ?? 0).toLocaleString('en-IN')}</span>
          )}
          <span className="text-neutral-500 text-sm mb-2 ml-1">one-time</span>
        </div>

        {/* CTA */}
        <button
          onClick={onEnroll}
          className="group/btn w-full bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black font-extrabold text-base py-4 rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:shadow-[0_6px_28px_rgba(251,191,36,0.45)] mb-3 flex items-center justify-center gap-2"
        >
          <span>Enroll Now</span>
          <svg className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Trust */}
        <div className="flex items-center justify-center gap-1.5 text-neutral-600 text-xs mb-5">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
          </svg>
          Secured by Razorpay · 100% Safe Checkout
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.07] mb-5" />

        {/* Features */}
        <ul className="space-y-3">
          {visibleFeatures.map(item => (
            <li key={item} className="flex items-start gap-3 text-neutral-300 text-sm leading-snug">
              <span className="w-4 h-4 flex-shrink-0 mt-0.5 rounded-full bg-amber-400/15 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              {item}
            </li>
          ))}
          {!showAll && overflowCount > 0 && (
            <li>
              <button
                onClick={() => setShowAll(true)}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-xs font-semibold pl-7 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
                +{overflowCount} more included
              </button>
            </li>
          )}
          {showAll && (
            <li>
              <button
                onClick={() => setShowAll(false)}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-400 text-xs font-semibold pl-7 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
                Show less
              </button>
            </li>
          )}
        </ul>

        {/* Footer */}
        {course.instructor && (
          <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Faculty</div>
            <div className="text-white text-base font-extrabold tracking-wide">{course.instructor}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const HomePricingCarousel: React.FC<{ courses: Course[]; defaultFeatures: string[]; onEnroll: () => void }> = ({ courses, defaultFeatures, onEnroll }) => {
  const paidCourses = courses.filter(c => c.isPaid && c.isActive);
  const displayCourses = paidCourses.length > 0 ? paidCourses : (courses.length > 0 ? [courses[0]] : []);

  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prev = useCallback(() => setIdx(i => (i - 1 + displayCourses.length) % displayCourses.length), [displayCourses.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % displayCourses.length), [displayCourses.length]);

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = (touchStartX.current ?? 0) - (touchEndX.current ?? 0);
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  if (displayCourses.length === 0) {
    const placeholder: Course = { _id: '', title: 'Exam Decoders Batch', subtitle: '', description: '', category: 'Commerce', duration: '3 months', level: 'Beginner', price: 2500, originalPrice: 4999, isPaid: true, isActive: true, features: defaultFeatures };
    return <HomePricingCard course={placeholder} defaultFeatures={defaultFeatures} onEnroll={onEnroll} />;
  }

  return (
    <div className="relative">
      {/* Desktop side arrows */}
      {displayCourses.length > 1 && (
        <button
          onClick={prev}
          className="hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-amber-400/50 hover:bg-black items-center justify-center transition-all z-10"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <HomePricingCard course={displayCourses[idx]} defaultFeatures={defaultFeatures} onEnroll={onEnroll} />
      </div>

      {/* Desktop side arrows right */}
      {displayCourses.length > 1 && (
        <button
          onClick={next}
          className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-amber-400/50 hover:bg-black items-center justify-center transition-all z-10"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Dots (both mobile and desktop) + mobile arrows */}
      {displayCourses.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          {/* Mobile-only arrow left */}
          <button onClick={prev} className="md:hidden w-8 h-8 rounded-full bg-black/60 border border-white/10 hover:border-amber-400/50 hover:bg-black flex items-center justify-center transition-all">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-1.5">
            {displayCourses.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all duration-200 ${i === idx ? 'w-5 h-1.5 bg-amber-400' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`} />
            ))}
          </div>
          {/* Mobile-only arrow right */}
          <button onClick={next} className="md:hidden w-8 h-8 rounded-full bg-black/60 border border-white/10 hover:border-amber-400/50 hover:bg-black flex items-center justify-center transition-all">
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage; 