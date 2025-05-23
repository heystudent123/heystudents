import React, { useState, useMemo } from 'react';

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

  const filteredResources = useMemo(() => {
    return resourceData.filter((resource) => {
      const collegeMatch = selectedCollege === 'all' || resource.college === selectedCollege;
      const typeMatch = selectedType === 'all' || resource.type === selectedType;
      const yearMatch = selectedYear === 'all' || resource.year === selectedYear;
      const courseMatch = selectedCourse === 'all' || resource.course === selectedCourse;
      const searchMatch = 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return collegeMatch && typeMatch && yearMatch && courseMatch && searchMatch;
    });
  }, [selectedCollege, selectedType, selectedYear, selectedCourse, searchQuery]);

  const getCollegeName = (collegeKey: College): string => {
    const names: Record<College, string> = {
      all: 'All Colleges',
      hansraj: 'Hansraj College',
      miranda: 'Miranda House',
      stephens: 'St. Stephen\'s College',
      ramjas: 'Ramjas College',
      venky: 'Sri Venkateswara College',
      hindu: 'Hindu College',
      lsr: 'Lady Shri Ram College'
    };
    return names[collegeKey] || collegeKey;
  };

  const getResourceTypeName = (typeKey: ResourceType): string => {
    const names: Record<ResourceType, string> = {
      all: 'All Types',
      notes: 'Notes',
      papers: 'Question Papers',
      books: 'Books',
      videos: 'Video Lectures'
    };
    return names[typeKey] || typeKey;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-background-base to-background-dark text-text-primary font-sans">
      {/* This div ensures the colored background extends behind the navbar */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-primary-dark z-0"></div>
      <header className="pt-24 pb-12 bg-primary-dark shadow-xl">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
            Academic <span className="text-accent-light">Resources</span>
          </h1>
          <p className="mt-4 text-xl text-primary-100 max-w-3xl mx-auto">
            Access study materials, notes, past papers, and more from across Delhi University colleges.
          </p>
        </div>
      </header>
      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-12 border border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Search Input */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-neutral-dark mb-1">
                Search Resources
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title or description..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Resource Type Filter */}
            <div>
              <label htmlFor="resource-type" className="block text-sm font-medium text-neutral-dark mb-1">
                Resource Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <select
                  id="resource-type"
                  className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 shadow-sm appearance-none bg-white"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as ResourceType)}
                >
                  <option value="all">All Types</option>
                  <option value="notes">Notes</option>
                  <option value="papers">Question Papers</option>
                  <option value="books">Books</option>
                  <option value="videos">Video Lectures</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* College Filter */}
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-neutral-dark mb-1">
                College
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <select
                  id="college"
                  className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 shadow-sm appearance-none bg-white"
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value as College)}
                >
                  <option value="all">All Colleges</option>
                  <option value="hansraj">Hansraj College</option>
                  <option value="miranda">Miranda House</option>
                  <option value="stephens">St. Stephen's College</option>
                  <option value="ramjas">Ramjas College</option>
                  <option value="venky">Sri Venkateswara College</option>
                  <option value="hindu">Hindu College</option>
                  <option value="lsr">Lady Shri Ram College</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Course and Year Filter */}
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-neutral-dark mb-1">
                    Course
                  </label>
                  <select
                    id="course"
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 shadow-sm appearance-none bg-white"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value as Course)}
                  >
                    <option value="all">All</option>
                    <option value="ba">BA</option>
                    <option value="bsc">B.Sc</option>
                    <option value="bcom">B.Com</option>
                    <option value="ma">MA</option>
                    <option value="msc">M.Sc</option>
                    <option value="mcom">M.Com</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-neutral-dark mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 shadow-sm appearance-none bg-white"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value as Year)}
                  >
                    <option value="all">All</option>
                    <option value="1">1st</option>
                    <option value="2">2nd</option>
                    <option value="3">3rd</option>
                    <option value="4">4th</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tags Display */}
          {(selectedType !== 'all' || selectedCollege !== 'all' || selectedCourse !== 'all' || selectedYear !== 'all' || searchQuery) && (
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {selectedType !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    {getResourceTypeName(selectedType)}
                    <button
                      onClick={() => setSelectedType('all')}
                      className="ml-1.5 flex-shrink-0 text-primary hover:text-primary-dark p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label={`Remove ${getResourceTypeName(selectedType)} filter`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedCollege !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    {getCollegeName(selectedCollege)}
                    <button
                      onClick={() => setSelectedCollege('all')}
                      className="ml-1.5 flex-shrink-0 text-primary hover:text-primary-dark p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label={`Remove ${getCollegeName(selectedCollege)} filter`}
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedCourse !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    Course: {selectedCourse.toUpperCase()}
                    <button
                      onClick={() => setSelectedCourse('all')}
                      className="ml-1.5 flex-shrink-0 text-primary hover:text-primary-dark p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedYear !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    Year: {selectedYear}
                    <button
                      onClick={() => setSelectedYear('all')}
                      className="ml-1.5 flex-shrink-0 text-primary hover:text-primary-dark p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1.5 flex-shrink-0 text-primary hover:text-primary-dark p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label="Remove search query filter"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedCollege('all');
                    setSelectedCourse('all');
                    setSelectedYear('all');
                    setSearchQuery('');
                  }}
                  className="ml-auto text-sm font-medium text-primary hover:text-primary-dark transition-colors p-1 rounded-md hover:bg-primary/10"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resources Listing Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 pb-4 border-b border-neutral-200">
            <h2 className="text-3xl font-bold text-neutral-darkest flex items-center">
              Study Resources
              <span className="ml-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-base font-semibold">
                {filteredResources.length}
              </span>
            </h2>
            <div className="text-neutral-500 text-sm mt-2 sm:mt-0">
              Showing {filteredResources.length} of {resourceData.length} resources
            </div>
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white shadow-lg rounded-xl overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={resource.thumbnailUrl || 'https://via.placeholder.com/400x250?text=Resource'}
                      alt={resource.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 m-3">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md ${resource.type === 'notes' ? 'bg-blue-100 text-blue-700' : resource.type === 'papers' ? 'bg-amber-100 text-amber-700' : resource.type === 'books' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                        {getResourceTypeName(resource.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-neutral-darkest mb-2 leading-tight hover:text-primary transition-colors">
                          {resource.title}
                        </h3>
                        <span className="text-xs text-neutral-500 font-medium">
                          {getCollegeName(resource.college)}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                        {resource.description}
                      </p>
                    
                      <div className="space-y-3 text-sm text-neutral-600 mb-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Uploaded by {resource.uploadedBy}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(resource.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span>Course: {resource.course.toUpperCase()}, Year: {resource.year}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-4 mt-auto">
                      <div className="flex items-center justify-end">
                        <a
                          href={resource.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Download
                          <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-xl font-semibold text-neutral-darkest">No Resources Found</h3>
              <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 bg-gradient-to-r from-primary via-primary-dark to-secondary py-16 rounded-xl shadow-2xl text-white">
          <div className="container mx-auto px-6 md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Have study materials to share?
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl">
                Help your fellow DU students by uploading your notes, assignments, or other study resources. Your contribution can make a difference!
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-primary-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Upload Resources
                <svg className="ml-2 -mr-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage; 