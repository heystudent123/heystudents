import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import SharedNavbar from '../components/SharedNavbar';
import { coursesApi, paymentsApi, enrollmentsApi, authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window { Razorpay: any; }
}

interface Course {
  _id: string;
  title: string;
  description: string;
  subtitle?: string;
  category: string | string[];
  duration: string;
  level: string;
  instructor?: string;
  price: number;
  originalPrice?: number;
  referralPrice?: number;
  isPaid: boolean;
  features?: string[];
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
  const { isSignedIn: isClerkSignedIn } = useClerkAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Support both Clerk users and admin JWT users
  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();
  // effectiveUser is whoever is currently signed in (Clerk OR admin JWT)
  const user = clerkUser || (localStorage.getItem('token') && adminUser ? adminUser : null);

  // Premium course state
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [purchased, setPurchased] = useState(false);

  // Referral modal state
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<Course | null>(null);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [appliedReferralCode, setAppliedReferralCode] = useState<string | null>(null);
  const [referralInfo, setReferralInfo] = useState<{ name: string; _id: string } | null>(null);
  const [validatingReferral, setValidatingReferral] = useState(false);
  const [referralError, setReferralError] = useState('');
  const [referralDiscountedPrice, setReferralDiscountedPrice] = useState<number | null>(null);

  // Derive the featured paid course from what the backend returns
  const premiumCourse = courses.find(c => c.isPaid) || null;

  useEffect(() => {
    fetchCourses();
  }, []);

  // Check enrollment status when user is available
  useEffect(() => {
    if (!user) return;
    enrollmentsApi
      .getMyEnrollments()
      .then((res) => {
        const enrollments = res.data || [];
        setIsEnrolled(enrollments.length > 0);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkUser]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesApi.getAll({ isActive: true });
      setCourses(response.data || response.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (targetCourse: Course, referralCode?: string) => {
    if (!targetCourse) return;

    // 1. Must be logged in (use Clerk state to avoid false negatives from backend sync delays)
    if (!(isClerkSignedIn || user)) {
      sessionStorage.setItem('postLoginRedirect', '/courses');
      navigate('/login');
      return;
    }

    // 2. Already enrolled → go to dashboard
    if (isEnrolled) {
      navigate('/student/dashboard');
      return;
    }

    try {
      // 3. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        console.error('Could not load payment gateway.');
        return;
      }

      // 4. Create order on backend
      const effectivePrice = referralCode && targetCourse.referralPrice && targetCourse.referralPrice > 0
        ? targetCourse.referralPrice
        : targetCourse.price;

      const orderRes = await paymentsApi.createOrder({
        amount: effectivePrice,
        purpose: 'course_enrollment',
        courseSlug: targetCourse._id,
        referralCode: referralCode || undefined,
      });
      const { orderId, amount, currency, keyId } = orderRes.data;

      // 5. Open Razorpay checkout
      // user may be null if backend sync is delayed — fall back to clerkUser fields
      const prefillUser = user || clerkUser;
      await new Promise<void>((resolve, reject) => {
        const options = {
          key: keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: 'Heystudent',
          description: targetCourse.title,
          order_id: orderId,
          prefill: {
            name: (prefillUser as any)?.name || (prefillUser as any)?.fullName || '',
            email: (prefillUser as any)?.email || (prefillUser as any)?.primaryEmailAddress?.emailAddress || '',
            contact: (prefillUser as any)?.phone || '',
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
              setPurchased(true);
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

      // 7. Payment done → show confirmation then go to student dashboard
      setTimeout(() => navigate('/student/dashboard'), 3000);
    } catch (err: any) {
      if (err?.message !== 'Payment cancelled') {
        console.error('Payment error:', err?.message || 'Payment failed.');
      }
    }
  };

  // Open referral modal before purchase
  const handleEnrollClick = (course: Course) => {
    // Use Clerk sign-in state as the source of truth so a failed backend
    // sync never redirects an already-signed-in user to /login
    const isLoggedIn = !!(isClerkSignedIn || user);
    if (!isLoggedIn) {
      sessionStorage.setItem('postLoginRedirect', '/courses');
      navigate('/login');
      return;
    }
    if (isEnrolled) {
      navigate('/student/dashboard');
      return;
    }
    // Reset referral state
    setReferralCodeInput('');
    setAppliedReferralCode(null);
    setReferralInfo(null);
    setReferralError('');
    setReferralDiscountedPrice(null);
    setPendingCourse(course);
    setShowReferralModal(true);
  };

  const handleApplyReferralCode = async () => {
    if (!referralCodeInput.trim()) {
      setReferralError('Please enter a referral code.');
      return;
    }
    setValidatingReferral(true);
    setReferralError('');
    try {
      const res = await authApi.verifyReferralCode(referralCodeInput.trim().toUpperCase());
      if (res?.data?.valid && res?.data?.institute) {
        setAppliedReferralCode(referralCodeInput.trim().toUpperCase());
        setReferralInfo(res.data.institute);
        // Apply referral price if the course has one
        if (pendingCourse?.referralPrice && pendingCourse.referralPrice > 0) {
          setReferralDiscountedPrice(pendingCourse.referralPrice);
        } else {
          setReferralDiscountedPrice(null);
        }
        setReferralError('');
      } else {
        setReferralError('Invalid referral code. Please check and try again.');
      }
    } catch {
      setReferralError('Invalid referral code. Please check and try again.');
    } finally {
      setValidatingReferral(false);
    }
  };

  const handleProceedWithReferral = async () => {
    if (!pendingCourse) return;
    setShowReferralModal(false);
    await handleEnroll(pendingCourse, appliedReferralCode || undefined);
  };

  const handleSkipReferral = async () => {
    if (!pendingCourse) return;
    setShowReferralModal(false);
    await handleEnroll(pendingCourse);
  };

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <SharedNavbar />

      {/* Purchase success banner */}
      {purchased && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-black mb-2">You're in! 🎉</h2>
            <p className="text-neutral-500 mb-6">Your enrollment is confirmed. Redirecting you to your dashboard…</p>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* Referral Code Modal */}
      {showReferralModal && pendingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-extrabold text-black mb-1">Have a Referral Code?</h2>
            <p className="text-neutral-500 text-sm mb-6">
              Enter your institute's referral code to unlock a special price. You can skip this step if you don't have one.
            </p>

            {/* Price preview */}
            <div className="bg-neutral-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400 mb-0.5">Course Price</div>
                <div className="text-2xl font-extrabold text-black">
                  ₹{appliedReferralCode && referralDiscountedPrice ? referralDiscountedPrice : pendingCourse.price}
                </div>
                {appliedReferralCode && referralDiscountedPrice && referralDiscountedPrice < pendingCourse.price && (
                  <div className="text-sm text-neutral-400 line-through">₹{pendingCourse.price}</div>
                )}
              </div>
              {appliedReferralCode && referralInfo && (
                <div className="text-right">
                  <div className="text-xs text-green-600 font-semibold">Referral Applied ✓</div>
                  <div className="text-xs text-neutral-500">{referralInfo.name}</div>
                </div>
              )}
            </div>

            {/* Code input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={referralCodeInput}
                onChange={e => {
                  setReferralCodeInput(e.target.value.toUpperCase());
                  setReferralError('');
                  if (!e.target.value) {
                    setAppliedReferralCode(null);
                    setReferralInfo(null);
                    setReferralDiscountedPrice(null);
                  }
                }}
                placeholder="e.g. INST1234"
                className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm font-mono uppercase"
              />
              <button
                onClick={handleApplyReferralCode}
                disabled={validatingReferral || !referralCodeInput.trim()}
                className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {validatingReferral ? '...' : 'Apply'}
              </button>
            </div>

            {referralError && (
              <p className="text-red-500 text-xs mb-4">{referralError}</p>
            )}
            {appliedReferralCode && referralInfo && (
              <p className="text-green-600 text-xs mb-4">
                Code from <span className="font-semibold">{referralInfo.name}</span> applied successfully.
                {referralDiscountedPrice && referralDiscountedPrice < pendingCourse.price
                  ? ` You save ₹${pendingCourse.price - referralDiscountedPrice}!`
                  : ''}
              </p>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={handleProceedWithReferral}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors"
              >
                {appliedReferralCode ? `Pay ₹${referralDiscountedPrice || pendingCourse.price} →` : `Pay ₹${pendingCourse.price} →`}
              </button>
              <button
                onClick={handleSkipReferral}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-medium py-2.5 rounded-xl transition-colors text-sm"
              >
                Skip — Continue without referral code
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Featured Courses Section */}
      <div className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-3">Featured Courses</h2>
            <p className="text-neutral-700 max-w-xl mx-auto">
              Popular courses chosen by students like you
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-neutral-400 text-lg">Loading courses…</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 text-lg">No courses available right now.</div>
          ) : (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {courses.map((course) => {
              const cats = Array.isArray(course.category)
                ? course.category
                : course.category ? [course.category] : [];
              return (
                <div key={course._id} className="relative bg-[#0d0d0d] rounded-3xl overflow-hidden">
                  <div className="h-1 w-full bg-amber-400" />
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                      <div className="flex-1">
                        <span className="inline-block text-xs font-bold tracking-widest uppercase bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-1 rounded-full mb-6">
                          {cats[0] || 'Course'}
                        </span>
                        <div className="flex items-end gap-3 mb-2">
                          <span className="text-5xl font-extrabold text-white">₹{course.price}</span>
                          {course.originalPrice && course.originalPrice > course.price && (
                            <span className="text-xl text-neutral-500 line-through mb-1">₹{course.originalPrice}</span>
                          )}
                        </div>
                        <p className="text-neutral-400 text-sm mb-8">One-time payment · Instant access · No subscription</p>
                        <ul className="space-y-3">
                          {(course.features?.length ? course.features : [course.description]).map((item: string) => (
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
                            <div className="text-xs text-neutral-400 mb-0.5">Title</div>
                            <div className="text-white text-sm font-medium">{course.title}</div>
                            {course.subtitle && <div className="text-neutral-400 text-xs mt-0.5">{course.subtitle}</div>}
                          </div>
                          {cats.length > 0 && (
                            <>
                              <div className="h-px bg-white/10" />
                              <div>
                                <div className="text-xs text-neutral-400 mb-0.5">Category</div>
                                {cats.map(c => <div key={c} className="text-white text-sm font-medium">{c}</div>)}
                              </div>
                            </>
                          )}
                          {course.duration && (
                            <>
                              <div className="h-px bg-white/10" />
                              <div>
                                <div className="text-xs text-neutral-400 mb-0.5">Duration</div>
                                <div className="text-white text-sm font-medium">{course.duration}</div>
                              </div>
                            </>
                          )}
                          <button
                            onClick={() => handleEnrollClick(course)}
                            className="mt-2 w-full text-center bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-xl transition-colors text-sm"
                          >
                            {isEnrolled ? 'Go to Dashboard →' : 'Enroll Now →'}
                          </button>
                          <div className="flex items-center justify-center gap-1.5 text-neutral-500 text-xs">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                            Secured by Razorpay
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
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
              onClick={() => { const c = premiumCourse || courses[0]; if (c) handleEnrollClick(c); }}
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
