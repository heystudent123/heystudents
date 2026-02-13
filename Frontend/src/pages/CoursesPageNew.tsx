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

      {/* Courses List */}
      <div className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-3">Available Courses</h2>
            <p className="text-neutral-700 max-w-xl mx-auto">
              Explore our courses and access their learning materials
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {courses.map((course) => (
                <div key={course._id} className="bg-[#fff9ed] border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {course.image ? (
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                      {course.category}
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">{course.title}</h3>
                    <p className="text-neutral-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-neutral-500">{course.duration}</span>
                      <span className="text-xs bg-neutral-200 px-2 py-1 rounded">{course.level}</span>
                    </div>
                    {course.materials && course.materials.length > 0 && (
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="w-full text-black font-medium hover:bg-black hover:text-white border border-black rounded-md py-2 transition-colors"
                      >
                        View Materials ({course.materials.length})
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Materials Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black">{selectedCourse.title}</h2>
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-500 hover:text-black"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Material Type Filter Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Material Type</label>
                <select
                  value={materialFilter}
                  onChange={(e) => setMaterialFilter(e.target.value)}
                  className="w-full md:w-64 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">📚 All Materials</option>
                  <option value="pdf">📕 PDF Documents</option>
                  <option value="module">📚 Course Modules</option>
                  <option value="video">🎥 Video Links</option>
                  <option value="link">🔗 External Links</option>
                  <option value="note">📝 Notes</option>
                  <option value="file">📄 General Files</option>
                </select>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {materialFilter === 'all' 
                    ? 'No materials available for this course yet.' 
                    : `No ${materialFilter} materials available.`}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMaterials.map((material) => (
                    <div key={material._id} className="border border-neutral-200 rounded-lg p-4 flex items-start justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">{getMaterialIcon(material.materialType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-black">{material.title}</h4>
                            <span className="text-xs bg-neutral-200 px-2 py-0.5 rounded uppercase">
                              {material.materialType}
                            </span>
                          </div>
                          {material.description && (
                            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
                          )}

                          {/* Video Link */}
                          {material.materialType === 'video' && material.videoUrl && (
                            <a 
                              href={material.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline break-all"
                            >
                              {material.videoUrl}
                            </a>
                          )}

                          {/* External Link */}
                          {material.materialType === 'link' && material.externalUrl && (
                            <a 
                              href={material.externalUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline break-all"
                            >
                              {material.externalUrl}
                            </a>
                          )}

                          {/* Note Content */}
                          {material.materialType === 'note' && material.noteContent && (
                            <div className="mt-2 p-3 bg-yellow-50 rounded border border-yellow-200 max-h-40 overflow-y-auto">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{material.noteContent}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {(material.materialType === 'file' || material.materialType === 'pdf' || material.materialType === 'module') && material.fileUrl && (
                          <a
                            href={material.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                          >
                            Download
                          </a>
                        )}
                        {material.materialType === 'video' && material.videoUrl && (
                          <a
                            href={material.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                          >
                            Watch
                          </a>
                        )}
                        {material.materialType === 'link' && material.externalUrl && (
                          <a
                            href={material.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                          >
                            Open
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto bg-black rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Learning?</h2>
          <p className="text-neutral-300 max-w-2xl mx-auto mb-8">
            Join thousands of students who are already enhancing their skills and advancing their careers.
          </p>
          <button className="px-8 py-3 bg-white text-black rounded-md font-medium hover:bg-neutral-100">
            Explore All Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
