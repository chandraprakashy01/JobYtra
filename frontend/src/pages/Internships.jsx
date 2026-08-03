import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin, Search, GraduationCap } from 'lucide-react';

const mockInternships = [
  {
    id: 1,
    title: 'Software Engineering Intern',
    company: 'Google India',
    location: 'Bangalore, India (Hybrid)',
    duration: '6 Months',
    stipend: '₹50,000 / month',
    startDate: 'Jan 2026',
    branch: 'CSE / IT',
  },
  {
    id: 2,
    title: 'Data Analyst Intern',
    company: 'Microsoft',
    location: 'Hyderabad, India (Remote)',
    duration: '3 Months',
    stipend: '₹40,000 / month',
    startDate: 'Feb 2026',
    branch: 'CSE / ECE / Data Science',
  },
  {
    id: 3,
    title: 'Frontend Developer Intern',
    company: 'Razorpay',
    location: 'Bangalore, India (On-site)',
    duration: '6 Months',
    stipend: '₹35,000 / month',
    startDate: 'Jan 2026',
    branch: 'Any Branch',
  },
];

const Internships = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInternships = mockInternships.filter(intern =>
    intern.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
          Explore{' '}
          <span className="bg-gradient-to-r from-accentBlue to-blue-400 bg-clip-text text-transparent">
            Internship Opportunities
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Gain hands-on industry experience, work on real projects, and accelerate your career with top organizations.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search internships by role or company..."
            className="input-field pl-12 py-3.5 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Internship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.length > 0 ? (
          filteredInternships.map((intern) => (
            <div key={intern.id} className="card hover:border-accentBlue/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-accentBlue uppercase tracking-wider bg-accentBlue/10 px-2.5 py-1 rounded">
                    {intern.duration}
                  </span>
                  <span className="text-sm text-green-400 font-medium">{intern.stipend}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{intern.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{intern.company}</p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {intern.location}</p>
                  <p className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Starts {intern.startDate}</p>
                  <p className="flex items-center"><GraduationCap className="w-4 h-4 mr-2" /> {intern.branch} Eligible</p>
                </div>
              </div>
              
              <button className="btn-primary w-full py-2.5 text-sm">
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No internship opportunities match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;
