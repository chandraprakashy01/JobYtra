import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ChevronRight, Filter } from 'lucide-react';

const eventsList = [
  {
    id: 1,
    title: 'SRGI Mega Job Fair 2026',
    date: 'May 15, 2026',
    time: '9:00 AM – 5:00 PM',
    venue: 'SRGI Main Auditorium, Jabalpur',
    type: 'Job Fair',
    slots: 120,
    companies: 30,
    badge: 'upcoming',
    desc: 'The flagship annual placement drive with 30+ companies across IT, Core, and Management sectors. Open to all final-year students.',
  },
  {
    id: 2,
    title: 'Tech Internship Drive – Summer 2026',
    date: 'April 30, 2026',
    time: '10:00 AM – 3:00 PM',
    venue: 'Seminar Hall, Block B',
    type: 'Internship',
    slots: 80,
    companies: 12,
    badge: 'upcoming',
    desc: 'Exclusive internship opportunities from top-tier tech companies for pre-final year students.',
  },
  {
    id: 3,
    title: 'Resume & Interview Workshop',
    date: 'April 28, 2026',
    time: '11:00 AM – 1:00 PM',
    venue: 'Online (Zoom)',
    type: 'Workshop',
    slots: 200,
    companies: null,
    badge: 'live',
    desc: 'Industry experts share proven resume writing strategies and mock interview techniques.',
  },
  {
    id: 4,
    title: 'Core Engineering Recruitment Drive',
    date: 'March 10, 2026',
    time: '9:00 AM – 4:00 PM',
    venue: 'SRGI Campus',
    type: 'Job Fair',
    slots: 60,
    companies: 8,
    badge: 'completed',
    desc: 'On-campus drive for Mechanical, Civil, and Electrical engineering branches.',
  },
];

const badgeStyles = {
  upcoming:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  live:      'bg-green-500/15 text-green-400 border-green-500/30',
  completed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

const typeFilters = ['All', 'Job Fair', 'Internship', 'Workshop'];

const Events = () => {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? eventsList : eventsList.filter(e => e.type === active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accentBlue/10 border border-accentBlue/25 rounded-full text-accentBlue text-sm font-medium mb-6">
          <Calendar className="w-4 h-4" />
          Events & Drives
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4 leading-tight">
          Upcoming{' '}
          <span className="bg-gradient-to-r from-accentBlue to-blue-400 bg-clip-text text-transparent">
            Events
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Stay up to date with all placement drives, internship events, and career workshops happening at SRGI.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap mb-10">
        <Filter className="w-4 h-4 text-gray-500" />
        {typeFilters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              active === f
                ? 'bg-accentBlue text-white border-accentBlue'
                : 'border-gray-700 text-gray-400 hover:border-accentBlue/50 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map(ev => (
          <div key={ev.id} className="card flex flex-col gap-4">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white leading-snug">{ev.title}</h3>
              <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${badgeStyles[ev.badge]}`}>
                {ev.badge}
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">{ev.desc}</p>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-accentBlue shrink-0" />{ev.date}</span>
              <span className="flex items-center gap-1.5"><Clock    className="w-4 h-4 text-accentBlue shrink-0" />{ev.time}</span>
              <span className="flex items-center gap-1.5 col-span-2"><MapPin className="w-4 h-4 text-accentBlue shrink-0" />{ev.venue}</span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{ev.slots} seats</span>
                {ev.companies && <span>{ev.companies} companies</span>}
                <span className="px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400">{ev.type}</span>
              </div>
              {ev.badge !== 'completed' && (
                <button className="flex items-center gap-1 text-accentBlue text-sm font-medium hover:gap-2 transition-all duration-200">
                  Register <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">No events found for this category.</div>
      )}
    </div>
  );
};

export default Events;
