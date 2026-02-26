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
  subtitle?: string;
  category: string | string[];
  duration: string;
  level: string;
  instructor?: string;
  price: number;
  originalPrice?: number;
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

  const handleEnroll = async (targetCourse: Course) => {
    if (!targetCourse) return;

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

    try {
      // 3. Load Razorpay SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        console.error('Could not load payment gateway.');
        return;
      }

      // 4. Create order on backend
      const orderRes = await paymentsApi.createOrder({
        amount: targetCourse.price,
        purpose: 'course_enrollment',
        courseSlug: targetCourse._id,
      });
      const { orderId, amount, currency, keyId } = orderRes.data;

      // 5. Open Razorpay checkout
      await new Promise<void>((resolve, reject) => {
        const options = {
          key: keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: 'HeyStudent',
          description: targetCourse.title,
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
                            onClick={() => handleEnroll(course)}
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
              onClick={() => { const c = premiumCourse || courses[0]; if (c) handleEnroll(c); }}
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
