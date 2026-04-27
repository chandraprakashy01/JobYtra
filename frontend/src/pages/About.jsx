import React from 'react';
import { Briefcase, Users, Building2, Target, Award, Globe } from 'lucide-react';

const stats = [
  { icon: Users,     value: '2,500+', label: 'Students Placed' },
  { icon: Building2, value: '150+',   label: 'Partner Companies' },
  { icon: Briefcase, value: '800+',   label: 'Active Jobs' },
  { icon: Award,     value: '98%',    label: 'Satisfaction Rate' },
];

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To bridge the gap between talented SRGI students and leading recruiters by providing a seamless, modern placement experience.' },
  { icon: Globe,  title: 'Our Vision',  desc: 'To become the most trusted college placement platform in Central India, empowering every student to find their ideal career.' },
  { icon: Award,  title: 'Our Values',  desc: 'Transparency, excellence, and student-first thinking drive every feature we build and every partnership we forge.' },
];

const About = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

    {/* Hero */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accentBlue/10 border border-accentBlue/25 rounded-full text-accentBlue text-sm font-medium mb-6">
        <Briefcase className="w-4 h-4" />
        About SRGI Job Fare
      </div>
      <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-6 leading-tight">
        Empowering Careers at{' '}
        <span className="bg-gradient-to-r from-accentBlue to-blue-400 bg-clip-text text-transparent">
          SRGI
        </span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
        SRGI Job Fare is the official campus placement portal of Shri Ram Group of Institutions. We connect driven students with top-tier recruiters across industries — making careers happen, one opportunity at a time.
      </p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      {stats.map(({ icon: Icon, value, label }) => (
        <div key={label} className="card text-center">
          <div className="inline-flex p-3 rounded-xl bg-accentBlue/10 border border-accentBlue/20 mb-4">
            <Icon className="w-6 h-6 text-accentBlue" />
          </div>
          <p className="text-3xl font-heading font-bold text-white mb-1">{value}</p>
          <p className="text-gray-400 text-sm">{label}</p>
        </div>
      ))}
    </div>

    {/* Values */}
    <div className="mb-20">
      <h2 className="text-2xl font-heading font-bold text-white text-center mb-10">
        What Drives Us
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card">
            <div className="inline-flex p-3 rounded-xl bg-accentBlue/10 border border-accentBlue/20 mb-4">
              <Icon className="w-6 h-6 text-accentBlue" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* College info */}
    <div className="card bg-accentBlue/5 border-accentBlue/20 text-center">
      <h2 className="text-xl font-heading font-bold text-white mb-3">Shri Ram Group of Institutions</h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
        Located in Jabalpur, Madhya Pradesh, SRGI is one of Central India's premier engineering and management institutions, consistently producing industry-ready graduates since 1998.
      </p>
      <a
        href="mailto:placements@srgi.edu.in"
        className="inline-block mt-6 btn-primary"
      >
        Contact Placement Cell
      </a>
    </div>
  </div>
);

export default About;
