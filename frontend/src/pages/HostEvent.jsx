import React, { useState } from 'react';
import { Calendar, Building, Send, Sparkles, Trophy, Users } from 'lucide-react';

const HostEvent = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    eventType: 'Drive',
    proposedDate: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
          Host an Event at{' '}
          <span className="bg-gradient-to-r from-accentBlue to-blue-400 bg-clip-text text-transparent">
            JobYtra
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Connect directly with students through recruitment drives, technical workshops, seminars, and networking sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left - Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Event Categories We Support</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              We provide facilities, audit halls, projector equipment, labs, and student coordination volunteers to ensure your event runs smoothly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start card bg-[#141b30] border-gray-800 p-5">
              <Building className="w-6 h-6 text-accentBlue shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Campus Placement Drives</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Host pre-placement talks, written aptitude examinations, and face-to-face interviews on our campus.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start card bg-[#141b30] border-gray-800 p-5">
              <Users className="w-6 h-6 text-accentBlue shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Technical Seminars & Webinars</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Deliver tech talks, career orientation sessions, or discuss emerging technology trends directly with our student audience.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start card bg-[#141b30] border-gray-800 p-5">
              <Trophy className="w-6 h-6 text-accentBlue shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-1">Hackathons & Coding Contests</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Launch competitive challenges, judge candidate skills in real-time, and award internship offers to top performers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="card">
          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex p-3 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <Sparkles className="w-8 h-8 text-green-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Submitted!</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                Thank you for your interest. The Placement Cell will review your proposed details and contact you shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary py-2 px-4">
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-white mb-4">Inquire / Propose an Event</h2>
              
              <div>
                <label className="label-text">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google India"
                  className="input-field"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div>
                <label className="label-text">Official Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="recruiter@company.com"
                  className="input-field"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Event Type</label>
                  <select
                    className="input-field py-2.5"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  >
                    <option value="Drive">Placement Drive</option>
                    <option value="Seminar">Tech Seminar</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="label-text">Proposed Date</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.proposedDate}
                    onChange={(e) => setFormData({ ...formData, proposedDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="label-text">Brief Description</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Share details about the eligibility criteria, duration, or seminar topics..."
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Request
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostEvent;
