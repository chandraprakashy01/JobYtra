import React from 'react';
import { Shield, Eye, Lock, Database, Mail, RefreshCw } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: '1. Information We Collect',
    content: [
      'Personal identification information (name, email address, phone number)',
      'Academic information (branch, year, CGPA, roll number)',
      'Resume and portfolio files you upload to the platform',
      'Job application records and interaction history',
      'Device and browser information for analytics and security purposes',
    ],
  },
  {
    icon: Eye,
    title: '2. How We Use Your Information',
    content: [
      'To match students with relevant job and internship opportunities',
      'To allow recruiters to review and shortlist candidate profiles',
      'To send placement notifications, event reminders, and updates',
      'To improve platform performance and personalise your experience',
      'To comply with institutional and legal reporting requirements',
    ],
  },
  {
    icon: Lock,
    title: '3. Data Security',
    content: [
      'All data is encrypted in transit using TLS/HTTPS',
      'Passwords are hashed using industry-standard bcrypt algorithms',
      'Access to student data is restricted to verified recruiters only',
      'Regular security audits are performed on the platform',
      'We never sell your personal data to third parties',
    ],
  },
  {
    icon: Shield,
    title: '4. Your Rights',
    content: [
      'Right to access your personal data stored on our platform',
      'Right to request correction of inaccurate information',
      'Right to request deletion of your account and data',
      'Right to withdraw consent for data processing at any time',
      'Right to lodge a complaint with the institutional data officer',
    ],
  },
  {
    icon: RefreshCw,
    title: '5. Updates to This Policy',
    content: [
      'This Privacy Policy may be updated periodically to reflect changes in our practices or applicable laws.',
      'We will notify you of significant changes via email or a prominent notice on the platform.',
      'Continued use of the platform after updates constitutes acceptance of the revised policy.',
    ],
  },
];

const Privacy = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

    {/* Header */}
    <div className="text-center mb-14">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accentBlue/10 border border-accentBlue/25 rounded-full text-accentBlue text-sm font-medium mb-6">
        <Shield className="w-4 h-4" />
        Privacy Policy
      </div>
      <h1 className="text-4xl font-heading font-bold text-white mb-4">Your Privacy Matters</h1>
      <p className="text-gray-400 text-sm">Last updated: April 27, 2026</p>
      <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-relaxed">
        JobYtra Job Fare is committed to protecting your personal information. This policy explains what data we collect, why we collect it, and how we keep it safe.
      </p>
    </div>

    {/* Sections */}
    <div className="space-y-8">
      {sections.map(({ icon: Icon, title, content }) => (
        <div key={title} className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accentBlue/10 border border-accentBlue/20">
              <Icon className="w-5 h-5 text-accentBlue" />
            </div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <ul className="space-y-2">
            {content.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-400 text-sm leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accentBlue shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Contact */}
    <div className="mt-12 card bg-accentBlue/5 border-accentBlue/20 text-center">
      <Mail className="w-8 h-8 text-accentBlue mx-auto mb-3" />
      <h3 className="text-white font-semibold mb-2">Questions about your privacy?</h3>
      <p className="text-gray-400 text-sm mb-4">Reach out to our placement cell and we'll respond within 48 hours.</p>
      <a href="mailto:placements@jobytra.edu.in" className="btn-primary inline-block">
        placements@jobytra.edu.in
      </a>
    </div>
  </div>
);

export default Privacy;
