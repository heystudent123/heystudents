import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';
import { coursesApi, paymentsApi, enrollmentsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window { Razorpay: any; }
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  instructor?: string;
  image?: string;
  materials?: CourseMaterial[];
  isActive: boolean;
}

interface CourseMaterial {
  _id: string;
  title: string;
  description?: string;
  materialType: 'file' | 'video' | 'link' | 'note' | 'pdf' | 'module';
  fileUrl?: string;
  fileType?: string;
  videoUrl?: string;
  externalUrl?: string;
  noteContent?: string;
}

const PREMIUM_COURSE = {
  slug: 'du-campus-advantage',
  title: 'DU Campus Advantage',
  subtitle: 'Your all-in-one guide to thriving at Delhi University',
  price: 499,
  originalPrice: 999,
  duration: '12 weeks',
  level: 'All Levels',
  features: [
    'Exclusive study guides & PYQs for DU colleges',
    'Hostel & accommodation insider tips',
    'Career roadmap for DU graduates',
    'Weekly live Q&A sessions with alumni',
    'Private student community access',
    'Expert mentorship & counselling sessions',
  ],
};

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

const CoursesPage: React.FC = () => {
  const { user: clerkUser } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Support both Clerk users and admin JWT users
  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();
  // effectiveUser is whoever is currently signed in (Clerk OR admin JWT)
  const user = clerkUser || (localStorage.getItem('token') && adminUser ? adminUser : null);

  // Premium course state
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentChecked, setEnrollmentChecked] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  // Check enrollment status once user is loaded
  useEffect(() => {
    if (!user) { setEnrollmentChecked(true); return; }
    enrollmentsApi
      .checkEnrollment(PREMIUM_COURSE.slug)
      .then((res) => {
        setIsEnrolled(res.isEnrolled);
        if (res.isEnrolled) navigate('/student/dashboard', { replace: true });
      })
      .catch(() => {})
      .finally(() => setEnrollmentChecked(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkUser]);

  const fetchCourses = async () => {
    try {
      const response = await coursesApi.getAll({ isActive: true });
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = selectedCourse?.materials?.filter(material =>
    materialFilter === 'all' || material.materialType === materialFilter
  ) || [];

  const getMaterialIcon = (type: string) => {
    switch(type) {
      case 'pdf': return '📕';
      case 'module': return '📚';
      case 'video': return '🎥';
      case 'link': return '🔗';
      case 'note': return '📝';
      default: return '📄';
    }
  };

  const handleEnroll = async () => {
    setPaymentError('');

    // 1. Must be logged in
    if (!user) {
      sessionStorage.setItem('postLoginRedirect', '/courses');
      navigate('/login');
      return;
    }

    // 2. Already enrolled → go to dashboard
    if (isEnrolled) {
      navigate('/student/dashboard');
      return;
    }

    setPaymentLoading(true);
    try {
      // 3. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setPaymentError('Could not load payment gateway. Please check your internet connection.');
        setPaymentLoading(false);
        return;
      }

      // 4. Create order on backend
      const orderRes = await paymentsApi.createOrder({
        amount: PREMIUM_COURSE.price,
        purpose: 'course_enrollment',
        courseSlug: PREMIUM_COURSE.slug,
      });
      const { orderId, amount, currency, keyId } = orderRes.data;

      // 5. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const options = {
          key: keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: 'Hey Students DU',
          description: PREMIUM_COURSE.title,
          order_id: orderId,
          prefill: {
            name: user.name,
            email: user.email || '',
            contact: user.phone || '',
          },
          theme: { color: '#f59e0b' },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
          handler: async (response: any) => {
            try {
              // 6. Verify payment on backend (auto-enrolls)
              await paymentsApi.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              setIsEnrolled(true);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          reject(new Error(response.error?.description || 'Payment failed'));
        });
        rzp.open();
      });

      // 7. Payment done → student dashboard
      navigate('/student/dashboard');
    } catch (err: any) {
      if (err?.message !== 'Payment cancelled') {
        setPaymentError(err?.message || 'Payment failed. Please try again.');
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <SharedNavbar />

      {/* Header Section */}
      <div className="pt-24 pb-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block bg-black/5 px-4 py-1.5 rounded-full mb-5">
            <span className="text-sm font-medium">Student Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Courses & Learning Resources</h1>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Discover curated courses and educational resources to enhance your academic journey and career prospects.
          </p>
        </div>
      </div>

      {/* ── PREMIUM COURSE SECTION ─────────────────────────────────────────── */}
      <div className="py-10 px-4 md:px-0">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="absolute top-0 right-0 w-64 h-64 text-white" fill="currentColor" viewBox="0 0 200 200">
                <circle cx="160" cy="40" r="80" />
              </svg>
              <svg className="absolute bottom-0 left-0 w-48 h-48 text-white" fill="currentColor" viewBox="0 0 200 200">
                <circle cx="40" cy="160" r="80" />
              </svg>
            </div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
              {/* Left: Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    ⭐ Flagship Course
                  </span>
                  <span className="bg-green-400/90 text-green-900 text-xs font-bold px-3 py-1 rounded-full">
                    50% OFF
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold mb-2">{PREMIUM_COURSE.title}</h2>
                <p className="text-white/90 text-lg mb-6">{PREMIUM_COURSE.subtitle}</p>

                <ul className="space-y-2.5 mb-6">
                  {PREMIUM_COURSE.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-white/95 text-sm">
                      <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3 text-sm text-white/80">
                  <span>🕐 {PREMIUM_COURSE.duration}</span>
                  <span>·</span>
                  <span>🎓 {PREMIUM_COURSE.level}</span>
                </div>
              </div>

              {/* Right: Enroll Card */}
              <div className="w-full md:w-72 bg-white rounded-2xl shadow-xl p-6 flex-shrink-0">
                <div className="text-center mb-5">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold text-gray-900">
                      ₹{PREMIUM_COURSE.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{PREMIUM_COURSE.originalPrice}
                    </span>
                  </div>
                  <p className="text-green-600 text-sm font-semibold mt-1">
                    Save ₹{PREMIUM_COURSE.originalPrice - PREMIUM_COURSE.price} today!
                  </p>
                </div>

                {paymentError && (
                  <p className="text-red-600 text-xs text-center mb-3 bg-red-50 p-2 rounded-lg">
                    {paymentError}
                  </p>
                )}

                <button
                  onClick={handleEnroll}
                  disabled={paymentLoading || (!enrollmentChecked && !!user)}
                  className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-base"
                >
                  {paymentLoading
                    ? 'Processing…'
                    : isEnrolled
                    ? '✓ Go to Dashboard →'
                    : !user
                    ? 'Login to Enroll'
                    : `Enroll Now · ₹${PREMIUM_COURSE.price}`}
                </button>

                {!user && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    You'll be asked to log in first
                  </p>
                )}

                <div className="mt-4 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                    Secured by Razorpay
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Instant access after payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ── END PREMIUM COURSE ─────────────────────────────────────────────── */}

      {/* Featured Courses Section */}
      <div className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-3">Featured Courses</h2>
            <p className="text-neutral-700 max-w-xl mx-auto">
              Popular courses chosen by students like you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Course Card 1 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">Technology</div>
                <h3 className="text-xl font-semibold text-black mb-2">Web Development Bootcamp</h3>
                <p className="text-neutral-600 mb-4">Master HTML, CSS, JavaScript, and modern frameworks to build responsive websites and applications.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">12 weeks</span>
                  <button className="text-black font-medium hover:underline">Learn More →</button>
                </div>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mb-3">Business</div>
                <h3 className="text-xl font-semibold text-black mb-2">Digital Marketing Essentials</h3>
                <p className="text-neutral-600 mb-4">Learn SEO, social media marketing, content strategy, and analytics to grow your online presence.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">8 weeks</span>
                  <button className="text-black font-medium hover:underline">Learn More →</button>
                </div>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-pink-500 to-red-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full mb-3">Design</div>
                <h3 className="text-xl font-semibold text-black mb-2">UI/UX Design Fundamentals</h3>
                <p className="text-neutral-600 mb-4">Create beautiful and intuitive user experiences with industry-standard design tools and principles.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">10 weeks</span>
                  <button className="text-black font-medium hover:underline">Learn More →</button>
                </div>
              </div>
            </div>

            {/* Course Card 4 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full mb-3">Data Science</div>
                <h3 className="text-xl font-semibold text-black mb-2">Data Analytics with Python</h3>
                <p className="text-neutral-600 mb-4">Master data analysis, visualization, and machine learning basics using Python and popular libraries.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">14 weeks</span>
                  <button className="text-black font-medium hover:underline">Learn More →</button>
                </div>
              </div>
            </div>

            {/* Course Card 5 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full mb-3">Career</div>
                <h3 className="text-xl font-semibold text-black mb-2">Interview Preparation</h3>
                <p className="text-neutral-600 mb-4">Ace your interviews with expert tips, mock sessions, and strategies for technical and HR rounds.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">6 weeks</span>
                  <button className="text-black font-medium hover:underline">Learn More →</button>
                </div>
              </div>
            </div>

            {/* Course Card 6 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full mb-3">Skills</div>
                <h3 className="text-xl font-semibold text-black mb-2">Communication & Soft Skills</h3>
                <p className="text-neutral-600 mb-4">Develop essential soft skills including communication, teamwork, and leadership for career success.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">8 weeks</span>
                  <button className="text-black font-medium hover:underline">Learn More →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Categories Section */}
      <div className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-3">Browse by Category</h2>
            <p className="text-neutral-700 max-w-xl mx-auto">Explore courses across different domains</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Programming</h3>
              <p className="text-sm text-neutral-600">24 courses</p>
            </div>
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Business</h3>
              <p className="text-sm text-neutral-600">18 courses</p>
            </div>
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Creative Arts</h3>
              <p className="text-sm text-neutral-600">15 courses</p>
            </div>
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Personal Dev.</h3>
              <p className="text-sm text-neutral-600">12 courses</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 md:px-0 mb-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-black rounded-2xl p-8 md:p-10 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Learning?</h2>
            <p className="text-neutral-300 max-w-xl mx-auto mb-6">
              Join thousands of students already enhancing their skills with our curated courses.
            </p>
            <button
              onClick={handleEnroll}
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-xl text-black bg-white hover:bg-neutral-100 transition-colors focus:outline-none"
            >
              {isEnrolled ? 'Go to Dashboard →' : 'Explore Premium Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
