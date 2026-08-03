import React from 'react';
import { BookOpen, LifeBuoy, Mail, ShieldAlert, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const supportTopics = [
  {
    icon: FileText,
    title: 'Student Guides',
    desc: 'Learn how to construct a profile, upload resumes, and apply for placements.',
    link: '/faq',
  },
  {
    icon: LifeBuoy,
    title: 'Recruiter Playbook',
    desc: 'Understand how to create jobs, manage applicants, and run the AI Matchmaker.',
    link: '/faq',
  },
  {
    icon: ShieldAlert,
    title: 'Policy & Safety',
    desc: 'Read about our placement cell rules, terms of use, and privacy code.',
    link: '/privacy',
  },
];

const HelpCenter = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-accentBlue/10 border border-accentBlue/20 mb-4">
          <BookOpen className="w-8 h-8 text-accentBlue" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4">
          Welcome to the{' '}
          <span className="bg-gradient-to-r from-accentBlue to-blue-400 bg-clip-text text-transparent">
            Help Center
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Need support or assistance? Browse our resource categories below or contact our desk.
        </p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {supportTopics.map(({ icon: Icon, title, desc, link }) => (
          <div key={title} className="card hover:border-accentBlue/30 transition-colors flex flex-col justify-between">
            <div>
              <div className="inline-flex p-3 rounded-xl bg-accentBlue/10 border border-accentBlue/20 mb-4">
                <Icon className="w-6 h-6 text-accentBlue" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{desc}</p>
            </div>
            <Link to={link} className="text-accentBlue hover:text-hoverBlue font-medium inline-flex items-center gap-1.5 transition-colors">
              Read Guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Support Box */}
      <div className="card bg-accentBlue/5 border-accentBlue/25 p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-3">Still Need Assistance?</h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
          If you have technical platform issues or general placement queries, feel free to reach out directly to our helpdesk.
        </p>
        <a href="mailto:placements@jobytra.edu.in" className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-semibold">
          <Mail className="w-4 h-4" /> Email support@jobytra.edu.in
        </a>
      </div>
    </div>
  );
};

export default HelpCenter;
