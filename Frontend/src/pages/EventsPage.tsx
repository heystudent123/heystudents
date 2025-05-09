import React, { useState } from 'react';

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

  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get featured events
  const featuredEvents = eventsData.filter(event => event.isFeatured);

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary sm:text-4xl">
            Campus Events
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover upcoming events, fests, workshops, and more across Delhi University
          </p>
        </div>

        {/* Featured Events Carousel */}
        {featuredEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Featured Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <div 
                  key={event.id}
                  className="relative overflow-hidden rounded-lg shadow-lg h-80 group"
                >
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-white bg-accent rounded-full">
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-300 mb-3">{event.date} | {event.venue}</p>
                    <a 
                      href={event.registerLink}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent/90"
                    >
                      Register Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mt-12 bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for events..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
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
                <option value="srcc">SRCC</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-primary mb-6">Upcoming Events</h2>
          <div className="space-y-8">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 h-48 md:h-auto md:w-48">
                      <img
                        className="h-full w-full object-cover"
                        src={event.imageUrl}
                        alt={event.title}
                      />
                    </div>
                    <div className="p-6 md:flex-1">
                      <div className="flex flex-wrap justify-between items-start">
                        <h3 className="text-xl font-bold text-primary">{event.title}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent mt-1 md:mt-0">
                          {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-500">{event.description}</p>
                      <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {event.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {event.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <svg className="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {event.venue}
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Organized by: {event.organizer}
                        </div>
                        <a
                          href={event.registerLink}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                        >
                          Register
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No events match your criteria.</p>
                <p className="mt-2 text-primary">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Event CTA */}
        <div className="mt-16 bg-primary rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Organizing an event at your college?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-primary-100">
                Add your event to our platform and reach students across Delhi University.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex-shrink-0">
              <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-primary-50">
                Add Your Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage; 