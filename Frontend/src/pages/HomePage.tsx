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

        {/* ── WHY HEY STUDENT ──────────────────────────────────────── */}
        <FadeIn>
          <section className="py-20 md:py-28 px-4" style={{ background: '#fff9ed' }}>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Why Hey Student?</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Because your preparation deserves<br />more than random YouTube videos.</h2>
                <p className="text-neutral-500 max-w-xl mx-auto text-base leading-relaxed">
                  Hey Student is built by All India Rankers, students currently studying in SRCC, Hindu &amp; Hansraj, and a team that has analysed 3 years of CUET trends.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: What we teach */}
                <div className="bg-black rounded-3xl p-8">
                  <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-4">What We Teach</p>
                  <h3 className="text-xl font-bold text-white mb-6">We don't teach chapters.</h3>
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
                <div className="bg-amber-400 rounded-3xl p-8">
                  <p className="text-xs font-bold tracking-widest uppercase text-black/60 mb-4">What Makes Us Different</p>
                  <h3 className="text-xl font-bold text-black mb-2">While others teach everything,<br />we decode what matters.</h3>
                  <p className="text-black/70 text-sm mb-6">That edge is the difference between a good score and SRCC.</p>
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
        <section className="py-20 md:py-28 px-4" style={{ background: '#fff9ed' }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Pricing</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black">Exam Decoders Batch</h2>
                <p className="text-neutral-500 mt-3 max-w-lg mx-auto">
                  Decode the Pattern. Master the Strategy. Dominate the Exam.<br/>
                  <span className="text-sm">3 years of CUET trend analysis in one structured system.</span>
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

export default HomePage; 