import React, { useState, useEffect } from 'react';
import SharedNavbar from '../components/SharedNavbar';
import { coursesApi } from '../services/api';

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

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

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
                <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                  Technology
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Web Development Bootcamp</h3>
                <p className="text-neutral-600 mb-4">
                  Master HTML, CSS, JavaScript, and modern frameworks to build responsive websites and applications.
                </p>
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
                <div className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mb-3">
                  Business
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Digital Marketing Essentials</h3>
                <p className="text-neutral-600 mb-4">
                  Learn SEO, social media marketing, content strategy, and analytics to grow your online presence.
                </p>
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
                <div className="inline-block bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-full mb-3">
                  Design
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">UI/UX Design Fundamentals</h3>
                <p className="text-neutral-600 mb-4">
                  Create beautiful and intuitive user experiences with industry-standard design tools and principles.
                </p>
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
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full mb-3">
                  Data Science
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Data Analytics with Python</h3>
                <p className="text-neutral-600 mb-4">
                  Master data analysis, visualization, and machine learning basics using Python and popular libraries.
                </p>
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
                <div className="inline-block bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full mb-3">
                  Career
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Interview Preparation</h3>
                <p className="text-neutral-600 mb-4">
                  Ace your interviews with expert tips, mock sessions, and strategies for technical and HR rounds.
                </p>
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
                <div className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full mb-3">
                  Skills
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Communication & Soft Skills</h3>
                <p className="text-neutral-600 mb-4">
                  Develop essential soft skills including communication, teamwork, and leadership for career success.
                </p>
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
            <p className="text-neutral-700 max-w-xl mx-auto">
              Explore courses across different domains
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Programming</h3>
              <p className="text-sm text-neutral-600">24 courses</p>
            </div>

            {/* Category 2 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Business</h3>
              <p className="text-sm text-neutral-600">18 courses</p>
            </div>

            {/* Category 3 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Creative Arts</h3>
              <p className="text-sm text-neutral-600">15 courses</p>
            </div>

            {/* Category 4 */}
            <div className="bg-[#fff9ed] border border-neutral-200 rounded-xl p-6 text-center shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <div className="bg-black/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
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
            <button className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-xl text-black bg-white hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
              Explore All Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
