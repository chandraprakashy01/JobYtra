import React from 'react';
import { ScrollText, UserCheck, AlertTriangle, Scale, XCircle, Mail } from 'lucide-react';

const sections = [
  {
    icon: UserCheck,
    title: '1. Eligibility & Account Responsibility',
    content: [
      'SRGI Job Fare is available exclusively to currently enrolled SRGI students, faculty, and verified recruiting companies.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You must provide accurate, complete, and up-to-date information during registration.',
      'Each person may maintain only one active account on the platform.',
      'You must notify us immediately of any unauthorised use of your account.',
    ],
  },
  {
    icon: Scale,
    title: '2. Acceptable Use',
    content: [
      'Use the platform only for legitimate job search, recruitment, or career development activities.',
      'Do not upload false, misleading, or plagiarised resumes or company profiles.',
      'Do not contact other users outside the platform for purposes unrelated to placement.',
      'Do not attempt to scrape, crawl, or reverse-engineer any part of the platform.',
      'Respect all other users and maintain professional conduct at all times.',
    ],
  },
  {
    icon: AlertTriangle,
    title: '3. Content & Intellectual Property',
    content: [
      'Content you upload (resumes, job postings) remains your property; you grant us a limited licence to display it.',
      'SRGI Job Fare branding, design, and source code are protected intellectual property.',
      'Job postings must accurately represent roles; misleading postings will be removed.',
      'You may not reproduce or redistribute platform content without written permission.',
    ],
  },
  {
    icon: XCircle,
    title: '4. Termination',
    content: [
      'We reserve the right to suspend or terminate accounts that violate these terms.',
      'You may delete your account at any time via your profile settings.',
      'Upon termination, your data will be handled in accordance with our Privacy Policy.',
      'We are not liable for any loss resulting from account termination due to policy violations.',
    ],
  },
  {
    icon: ScrollText,
    title: '5. Limitation of Liability',
    content: [
      'SRGI Job Fare is a facilitator; we are not responsible for the outcome of job applications.',
      'We do not guarantee placement, interviews, or employment for any user.',
      'The platform is provided "as is" without warranties of any kind.',
      'Our liability to you shall not exceed the amount paid (if any) for platform access.',
    ],
  },
];

const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

    {/* Header */}
    <div className="text-center mb-14">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accentBlue/10 border border-accentBlue/25 rounded-full text-accentBlue text-sm font-medium mb-6">
        <ScrollText className="w-4 h-4" />
        Terms of Service
      </div>
      <h1 className="text-4xl font-heading font-bold text-white mb-4">Terms of Service</h1>
      <p className="text-gray-400 text-sm">Last updated: April 27, 2026</p>
      <p className="text-gray-400 mt-4 max-w-xl mx-auto leading-relaxed">
        By accessing and using SRGI Job Fare, you agree to be bound by these Terms of Service. Please read them carefully before using the platform.
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

    {/* Acceptance */}
    <div className="mt-12 card bg-accentBlue/5 border-accentBlue/20 text-center">
      <Mail className="w-8 h-8 text-accentBlue mx-auto mb-3" />
      <h3 className="text-white font-semibold mb-2">Have a legal question?</h3>
      <p className="text-gray-400 text-sm mb-4">
        For any concerns about these terms, contact the SRGI Placement Cell directly.
      </p>
      <a href="mailto:placements@srgi.edu.in" className="btn-primary inline-block">
        placements@srgi.edu.in
      </a>
    </div>
  </div>
);

export default Terms;
