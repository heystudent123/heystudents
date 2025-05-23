import React, { useState, useEffect } from 'react';

type EventCategory = 'all' | 'cultural' | 'academic' | 'sports' | 'workshop' | 'seminar' | 'fest';
type College = 'all' | 'hansraj' | 'miranda' | 'stephens' | 'ramjas' | 'venky' | 'hindu' | 'lsr' | 'srcc';

interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  college: College;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  registerLink: string;
  imageUrl: string;
  isFeatured: boolean;
}

const eventsData: Event[] = [
  {
    id: '1',
    title: 'Reverie 2023',
    description: 'Annual cultural fest of Delhi University featuring music performances, dance competitions, and theatrical displays.',
    category: 'fest',
    college: 'hansraj',
    date: '2023-03-15',
    time: '10:00 AM - 9:00 PM',
    venue: 'Hansraj College Main Ground',
    organizer: 'Hansraj College Students Union',
    registerLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Economics Symposium',
    description: 'Panel discussion on emerging economic trends post-pandemic with industry experts and economists.',
    category: 'seminar',
    college: 'srcc',
    date: '2023-02-20',
    time: '2:00 PM - 5:00 PM',
    venue: 'SRCC Auditorium',
    organizer: 'Economics Society, SRCC',
    registerLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isFeatured: false,
  },
  {
    id: '3',
    title: 'Coding Bootcamp',
    description: 'Three-day intensive coding workshop focusing on web development and machine learning basics.',
    category: 'workshop',
    college: 'ramjas',
    date: '2023-03-05',
    time: '9:00 AM - 4:00 PM',
    venue: 'Computer Science Department, Ramjas College',
    organizer: 'Tech Society, Ramjas College',
    registerLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isFeatured: true,
  },
  {
    id: '4',
    title: 'DU Sports Festival',
    description: 'Inter-college sports competition featuring cricket, football, basketball, and athletics.',
    category: 'sports',
    college: 'all',
    date: '2023-04-10',
    time: '8:00 AM - 6:00 PM',
    venue: 'Delhi University Sports Complex',
    organizer: 'DU Sports Council',
    registerLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isFeatured: false,
  },
  {
    id: '5',
    title: 'Literary Festival',
    description: 'Annual literature fest featuring book launches, author interactions, debates, and poetry competitions.',
    category: 'cultural',
    college: 'stephens',
    date: '2023-03-18',
    time: '11:00 AM - 7:00 PM',
    venue: 'St. Stephen\'s College',
    organizer: 'Literary Society, St. Stephen\'s College',
    registerLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Science Exhibition',
    description: 'Showcase of innovative projects and research work by science students across Delhi University.',
    category: 'academic',
    college: 'miranda',
    date: '2023-05-02',
    time: '10:00 AM - 5:00 PM',
    venue: 'Miranda House Science Block',
    organizer: 'Science Society, Miranda House',
    registerLink: '#',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543019a69b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isFeatured: false,
  },
];

const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('all');
  const [selectedCollege, setSelectedCollege] = useState<College>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = eventsData.filter((event) => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    const collegeMatch = selectedCollege === 'all' || event.college === selectedCollege;
    const searchMatch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && collegeMatch && searchMatch;
  });

  const sortedEvents: Event[] = filteredEvents;

  const getCollegeName = (collegeKey: College): string => {
    const names: Record<College, string> = {
      all: 'All Colleges',
      hansraj: 'Hansraj College',
      miranda: 'Miranda House',
      stephens: 'St. Stephen\'s College',
      ramjas: 'Ramjas College',
      venky: 'Sri Venkateswara College',
      hindu: 'Hindu College',
      lsr: 'Lady Shri Ram College',
      srcc: 'SRCC',
    };
    return names[collegeKey] || collegeKey;
  };

  const getCategoryName = (categoryKey: EventCategory): string => {
    const names: Record<EventCategory, string> = {
      all: 'All Categories',
      cultural: 'Cultural',
      academic: 'Academic',
      sports: 'Sports',
      workshop: 'Workshop',
      seminar: 'Seminar',
      fest: 'Fest',
    };
    return names[categoryKey] || categoryKey;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light via-background-base to-background-dark text-text-primary font-sans">
      {/* This div ensures the colored background extends behind the navbar */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-primary-dark z-0"></div>
      {/* Header Section */}
      <header className="pt-24 pb-12 bg-primary-dark shadow-xl">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
            Find Your Next <span className="text-accent-light">Event</span>
          </h1>
          <p className="mt-4 text-xl text-primary-100 max-w-3xl mx-auto">
            Discover exciting events happening across Delhi University. From cultural fests to academic seminars, there's something for everyone.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-12">
        {/* Search and Filters Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl mb-12 border border-neutral-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Search Input */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-neutral-dark mb-1">
                Search Events
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

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-dark mb-1">
                Filter by Category
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <select
                  id="category"
                  className="w-full pl-10 pr-10 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-shadow duration-200 shadow-sm appearance-none bg-white"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as EventCategory)}
                >
                  <option value="all">All Categories</option>
                  <option value="cultural">Cultural</option>
                  <option value="academic">Academic</option>
                  <option value="sports">Sports</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="fest">Fest</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* College Filter */}
            <div>
              <label htmlFor="college" className="block text-sm font-medium text-neutral-dark mb-1">
                Filter by College
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                  <option value="srcc">SRCC</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tags Display */}
          {(selectedCategory !== 'all' || selectedCollege !== 'all' || searchQuery) && (
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Active Filters:</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                    {getCategoryName(selectedCategory)}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="ml-1.5 flex-shrink-0 text-primary hover:text-primary-dark p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label={`Remove ${getCategoryName(selectedCategory)} filter`}
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
                    setSelectedCategory('all');
                    setSelectedCollege('all');
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

        {/* Events Listing Section */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 pb-4 border-b border-neutral-200">
            <h2 className="text-3xl font-bold text-neutral-darkest flex items-center">
              All Events
              <span className="ml-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-base font-semibold">
                {sortedEvents.length}
              </span>
            </h2>
            <div className="text-neutral-500 text-sm mt-2 sm:mt-0">
              Showing {sortedEvents.length} of {eventsData.length} events
            </div>
          </div>

          {sortedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedEvents.map((event: Event) => (
                <div key={event.id} className="bg-white shadow-lg rounded-xl overflow-hidden border border-neutral-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
                  <div className="relative h-56 w-full overflow-hidden">
                    <img 
                      src={event.imageUrl || 'https://via.placeholder.com/400x250?text=Event+Image'}
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {event.isFeatured && (
                        <span className="absolute top-3 right-3 bg-accent text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                            Featured
                        </span>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${event.category === 'fest' ? 'bg-pink-100 text-pink-700' : event.category === 'sports' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {getCategoryName(event.category)}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">
                                {getCollegeName(event.college)}
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-darkest mb-2 leading-tight hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                            {event.description}
                        </p>
                    
                        <div className="space-y-3 text-sm text-neutral-600 mb-4">
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{event.time}</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>{event.venue}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-4 mt-auto">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-neutral-500 flex items-center">
                                <svg className="w-4 h-4 text-primary mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                                <span>{event.organizer}</span>
                            </div>
                            <a
                                href={event.registerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Register
                                <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M11 9V5a1 1 0 10-2 0v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4z" />
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
              <h3 className="mt-2 text-xl font-semibold text-neutral-darkest">No Events Found</h3>
              <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 bg-gradient-to-r from-primary via-primary-dark to-secondary py-16 rounded-xl shadow-2xl text-white">
          <div className="container mx-auto px-6 md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Organizing an event at your college?
              </h2>
              <p className="mt-4 text-lg text-primary-100 max-w-2xl">
                Add your event to our platform and reach thousands of students across Delhi University. It's free and easy!
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:ml-8 flex-shrink-0">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary bg-white hover:bg-primary-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                Add Your Event
                <svg className="ml-2 -mr-0.5 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M11 9V5a1 1 0 10-2 0v4H5a1 1 0 100 2h4v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventsPage;