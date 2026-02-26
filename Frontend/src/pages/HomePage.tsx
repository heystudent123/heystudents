import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
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
    designation: 'AIR 19 · CUET 2023 · SRCC, Delhi University',
    badge: 'AIR 19 · Commerce',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    quote:
      'Scored 99.8 percentile across 5 subjects — Accountancy, Economics and Business Studies. I build exam-day strategy and time management frameworks that Commerce students can apply from their very first mock.',
  },
  {
    name: 'Naman Kumar',
    designation: 'AIR 63 · CUET 2023 · Hindu College, Delhi University',
    badge: 'AIR 63 · Humanities',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    quote:
      'Scored 99.5 percentile in Humanities — History, Political Science and Sociology. Known for distilling complex topics into clean, memorable frameworks that stick under exam conditions.',
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

  useEffect(() => {
    coursesApi.getAll({ isActive: true })
      .then((res) => setCourses(res.data || res.courses || []))
      .catch(() => {});
  }, []);

  const premiumCourse = courses.find(c => c.isPaid) || courses[0] || null;

  return (
    <div className="min-h-screen w-full" style={{ background: '#fff9ed' }}>
      <SharedNavbar />
      <div style={contentStyle}>
        <Hero className="relative min-h-[70vh] overflow-hidden" />

        {/* ── WHAT'S INCLUDED ──────────────────────────────────────── */}
        <FadeIn>
          <FeatureSteps
            title="Everything you need to rank."
            autoPlayInterval={4500}
            className="bg-[#fff9ed]"
            features={[
              {
                step: 'Live Classes',
                title: 'Live Strategy Sessions',
                content:
                  'Weekly live classes by AIR 19 & AIR 63 rankers — real exam strategy, not textbook theory. Every session recorded for replay anytime.',
                image:
                  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1171&q=80',
              },
              {
                step: 'Mock Tests',
                title: '20+ Full-Length Mocks',
                content:
                  'CUET-pattern mock tests with subject-wise performance breakdowns, percentile tracking, and detailed PYQ analysis after every test.',
                image:
                  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1170&q=80',
              },
              {
                step: 'Doubt Sessions',
                title: 'Weekly Doubt Clearing',
                content:
                  'Ask anything — live Q&A every week with your actual ranker teacher. No bot support, no ticket queue, no waiting.',
                image:
                  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1170&q=80',
              },
              {
                step: 'Track Your Rank',
                title: 'Rank Tracker & Community',
                content:
                  'See your percentile after every mock, know exactly which topics to fix, and stay accountable in a focused private student group.',
                image:
                  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1170&q=80',
              },
            ]}
          />
        </FadeIn>

        {/* ── PRICING CARD ─────────────────────────────────────────── */}
        <section className="py-20 md:py-28 px-4" style={{ background: '#fff9ed' }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Pricing</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black">One plan. Everything included.</h2>
                <p className="text-neutral-500 mt-3 max-w-md mx-auto">
                  No upsells, no hidden modules. A single flat price for the complete batch.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <div className="max-w-3xl mx-auto">
                <div className="relative bg-[#0d0d0d] rounded-3xl overflow-hidden">
                  <div className="h-1 w-full bg-amber-400" />
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                      <div className="flex-1">
                        <span className="inline-block text-xs font-bold tracking-widest uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full mb-6">
                          {premiumCourse?.title || 'Exam Decoders Batch'}
                        </span>
                        <div className="flex items-end gap-3 mb-2">
                          <span className="text-5xl font-extrabold text-white">₹{premiumCourse?.price ?? 2500}</span>
                          {(premiumCourse?.originalPrice ?? 4999) > 0 && (
                            <span className="text-xl text-neutral-500 line-through mb-1">₹{premiumCourse?.originalPrice ?? 4999}</span>
                          )}
                        </div>
                        <p className="text-neutral-400 text-sm mb-8">One-time payment &middot; Instant access &middot; No subscription</p>
                        <ul className="space-y-3">
                          {(premiumCourse?.features?.length ? premiumCourse.features : DEFAULT_FEATURES).map(item => (
                            <li key={item} className="flex items-start gap-3 text-neutral-300 text-sm">
                              <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="md:w-56 flex-shrink-0">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                          <div>
                            <div className="text-xs text-neutral-400 mb-0.5">Faculty</div>
                            <div className="text-white text-sm font-medium">AIR 19 &middot; Commerce</div>
                            <div className="text-white text-sm font-medium mt-0.5">AIR 63 &middot; Humanities</div>
                          </div>
                          <div className="h-px bg-white/10" />
                          <div>
                            <div className="text-xs text-neutral-400 mb-0.5">Streams</div>
                            <div className="text-white text-sm font-medium">Commerce</div>
                            <div className="text-white text-sm font-medium mt-0.5">Humanities</div>
                          </div>
                          <div className="h-px bg-white/10" />
                          <div>
                            <div className="text-xs text-neutral-400 mb-0.5">Duration</div>
                            <div className="text-white text-sm font-medium">{premiumCourse?.duration || '3 months live batch'}</div>
                          </div>
                          <Link
                            to="/courses"
                            className="mt-2 block w-full text-center bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors text-sm"
                          >
                            Enroll Now →
                          </Link>
                          <div className="flex items-center justify-center gap-1.5 text-neutral-500 text-xs">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                            Secured by Razorpay
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── FACULTY ──────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Faculty</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black">Taught by students who ranked.</h2>
                <p className="text-neutral-500 mt-3 max-w-md mx-auto">
                  Not career educators. Students who sat the same exam, scored in the national top 100, and came back to show you exactly how.
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Your rank is decided by the choices you make today.
              </h2>
              <p className="text-neutral-400 mb-10 text-lg leading-relaxed">
                Join the only CUET batch taught by students who actually ranked in the national top 100.
              </p>
              <Link
                to="/courses"
                className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-bold px-10 py-4 rounded-2xl text-base transition-colors"
              >
                Enroll in Exam Decoders Batch
              </Link>
              <p className="text-neutral-600 text-sm mt-4">One-time ₹{premiumCourse?.price ?? 2500} &middot; Instant access &middot; No subscription</p>
            </div>
          </section>
        </FadeIn>

        <div className="py-6 bg-black border-t border-white/10">
          <p className="text-center text-neutral-600 text-xs">
            © 2025 HeyStudent &middot; Built by CUET rankers, for CUET aspirants
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 