import React, { useState } from 'react';

type College = 'all' | 'hansraj' | 'miranda' | 'stephens' | 'ramjas' | 'venky' | 'hindu' | 'lsr';
type ResourceType = 'all' | 'notes' | 'papers' | 'books' | 'videos';
type Year = 'all' | '1' | '2' | '3' | '4';
type Course = 'all' | 'ba' | 'bsc' | 'bcom' | 'ma' | 'msc' | 'mcom';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  college: College;
  course: Course;
  year: Year;
  uploadedBy: string;
  uploadDate: string;
  downloadLink: string;
  thumbnailUrl: string;
}

const resourceData: Resource[] = [
  {
    id: '1',
    title: 'Economics Semester 1 Notes',
    description: 'Comprehensive notes for Microeconomics (Sem 1)',
    type: 'notes',
    college: 'stephens',
    course: 'ba',
    year: '1',
    uploadedBy: 'Rahul Sharma',
    uploadDate: '2023-05-15',
    downloadLink: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    title: 'Physics Previous Year Papers (2018-2022)',
    description: 'Collection of previous year papers for B.Sc Physics Hons',
    type: 'papers',
    college: 'hansraj',
    course: 'bsc',
    year: '2',
    uploadedBy: 'Priya Patel',
    uploadDate: '2023-06-20',
    downloadLink: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '3',
    title: 'English Literature Core Books PDF',
    description: 'Digital copies of prescribed texts for BA English Hons',
    type: 'books',
    college: 'miranda',
    course: 'ba',
    year: '3',
    uploadedBy: 'Aditya Singh',
    uploadDate: '2023-04-10',
    downloadLink: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '4',
    title: 'Commerce Taxation Video Lectures',
    description: 'Video series explaining Indian taxation system for B.Com students',
    type: 'videos',
    college: 'ramjas',
    course: 'bcom',
    year: '3',
    uploadedBy: 'Neha Kapoor',
    uploadDate: '2023-07-05',
    downloadLink: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '5',
    title: 'Chemistry Lab Manuals',
    description: 'Complete lab manuals for B.Sc Chemistry practical sessions',
    type: 'notes',
    college: 'venky',
    course: 'bsc',
    year: '2',
    uploadedBy: 'Vikram Mehta',
    uploadDate: '2023-03-25',
    downloadLink: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '6',
    title: 'Mathematics Formulae Handbook',
    description: 'Comprehensive collection of formulae for all mathematics papers',
    type: 'notes',
    college: 'hindu',
    course: 'bsc',
    year: '1',
    uploadedBy: 'Riya Gupta',
    uploadDate: '2023-01-30',
    downloadLink: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
  },
];

const ResourcesPage: React.FC = () => {
  const [selectedCollege, setSelectedCollege] = useState<College>('all');
  const [selectedType, setSelectedType] = useState<ResourceType>('all');
  const [selectedYear, setSelectedYear] = useState<Year>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = resourceData.filter((resource) => {
    const collegeMatch = selectedCollege === 'all' || resource.college === selectedCollege;
    const typeMatch = selectedType === 'all' || resource.type === selectedType;
    const yearMatch = selectedYear === 'all' || resource.year === selectedYear;
    const courseMatch = selectedCourse === 'all' || resource.course === selectedCourse;
    const searchMatch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return collegeMatch && typeMatch && yearMatch && courseMatch && searchMatch;
  });

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
            Student Resources
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Access study materials, previous year papers, books, and more
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-8 bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for resources..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ResourceType)}
              >
                <option value="all">All Types</option>
                <option value="notes">Notes</option>
                <option value="papers">Previous Papers</option>
                <option value="books">Books</option>
                <option value="videos">Video Lectures</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value as College)}
              >
                <option value="all">All Colleges</option>
                <option value="hansraj">Hansraj College</option>
                <option value="miranda">Miranda House</option>
                <option value="stephens">St. Stephen's College</option>
                <option value="ramjas">Ramjas College</option>
                <option value="venky">Venkateshwara College</option>
                <option value="hindu">Hindu College</option>
                <option value="lsr">Lady Shri Ram College</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value as Course)}
              >
                <option value="all">All Courses</option>
                <option value="ba">BA</option>
                <option value="bsc">B.Sc</option>
                <option value="bcom">B.Com</option>
                <option value="ma">MA</option>
                <option value="msc">M.Sc</option>
                <option value="mcom">M.Com</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value as Year)}
              >
                <option value="all">All Years</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white overflow-hidden shadow-md rounded-lg transition-transform hover:scale-105"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-primary">{resource.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent">
                      {resource.type}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{resource.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      <p>Uploaded by {resource.uploadedBy}</p>
                      <p>Date: {resource.uploadDate}</p>
                    </div>
                    <a
                      href={resource.downloadLink}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-500">No resources match your criteria.</p>
              <p className="mt-2 text-primary">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>

        {/* Upload Resources CTA */}
        <div className="mt-16 bg-primary rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Have study materials to share?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-primary-100">
                Help your fellow DU students by uploading your notes, assignments, or other study resources.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex-shrink-0">
              <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-primary-50">
                Upload Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage; 