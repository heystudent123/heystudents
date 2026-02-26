import React from 'react';
import { Link } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <SharedNavbar />

      {/* ── HEADER ── */}
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-black/5 px-4 py-1.5 rounded-full mb-5">
            <span className="text-sm font-medium">About HeyStudent</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-5 leading-tight">
            We built the resource<br />we wish we had.
          </h1>
          <p className="text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
            HeyStudent is a CUET preparation platform built by students who ranked in the national top 100 — not coaching veterans, just people who sat the same exam and figured out what actually works.
          </p>
        </div>
      </div>

      {/* ── STORY ── */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-4">Our Story</p>
              <h2 className="text-3xl font-bold text-black mb-5">Started by two rankers who saw the gap.</h2>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                After scoring AIR 19 and AIR 63 in CUET 2023, Moksh and Naman kept getting the same questions from juniors: <em>"Which chapters actually matter? How did you manage time? What did you do differently?"</em>
              </p>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                Coaching centers give you syllabus. We give you strategy. There's a big difference — and that difference is what separates a 70 percentile from a 99.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                HeyStudent started because we wanted to share exactly what we did, in a format that's honest, affordable, and built around how CUET actually works — not how coaching centers teach it.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden h-72 md:h-80">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1171&q=80"
                alt="Students studying together"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── VALUES ── */}
      <div className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">What We Stand For</p>
            <h2 className="text-3xl font-bold text-black">The principles behind everything we build.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Ranker-First Teaching',
                desc: "We only teach what we personally used to rank. No recycled content, no generic strategy — everything is based on first-hand experience of scoring in the national top 100.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
              {
                title: 'Radical Honesty',
                desc: 'We tell you which chapters to skip, which sections are free marks, and which mock score ranges actually translate to good DU colleges. No hype, no false promises.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
              {
                title: 'Affordable Access',
                desc: 'Great CUET preparation should not cost ₹40,000. We built a complete batch at ₹2,500 because the quality of your preparation should not depend on what your parents can afford.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map(v => (
              <div key={v.title} className="bg-white/60 border border-black/[0.07] rounded-2xl p-7 hover:shadow-md transition-shadow duration-200">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white mb-5">
                  {v.icon}
                </div>
                <h3 className="text-lg font-semibold text-black mb-3">{v.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">The Team</p>
            <h2 className="text-3xl font-bold text-black">Who's behind HeyStudent.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { initials: 'MJ', name: 'Moksh Jindal', role: 'Co-Founder & Commerce Faculty', detail: 'AIR 19 · CUET 2023 · SRCC, DU' },
              { initials: 'NK', name: 'Naman Kumar', role: 'Co-Founder & Humanities Faculty', detail: 'AIR 63 · CUET 2023 · Hindu College, DU' },
            ].map(m => (
              <div key={m.name} className="flex items-center gap-5 bg-[#fff9ed] border border-black/[0.07] rounded-2xl p-6">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {m.initials}
                </div>
                <div>
                  <div className="font-bold text-black text-lg">{m.name}</div>
                  <div className="text-sm text-neutral-600 mt-0.5">{m.role}</div>
                  <div className="inline-block bg-amber-400/15 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2">{m.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-16 px-4 mb-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-black rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Have a question?</h2>
            <p className="text-neutral-400 max-w-md mx-auto mb-6">
              For course enquiries, partnerships, or anything else — reach us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:heystudentyt@gmail.com"
                className="inline-flex items-center justify-center px-6 py-2.5 text-base font-medium rounded-xl text-black bg-white hover:bg-neutral-100 transition-colors"
              >
                heystudentyt@gmail.com
              </a>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-6 py-2.5 text-base font-medium rounded-xl text-white bg-amber-500 hover:bg-amber-400 transition-colors"
              >
                View the Batch →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;