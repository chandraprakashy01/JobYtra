import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How do I register as a student?',
    answer: 'Go to the Registration page, choose the Student option, fill in your college ID, branch, CGPA, and resume, and submit. An administrator will verify and approve your profile.',
  },
  {
    question: 'How long does profile verification take?',
    answer: 'Profile verification by the placement cell typically takes 24-48 business hours. You will receive an email notification once your profile is approved.',
  },
  {
    question: 'Can I apply for multiple jobs at once?',
    answer: 'Yes, you can apply for multiple job openings as long as you meet the eligibility criteria (such as minimum CGPA and allowed branches) set by the recruiter.',
  },
  {
    question: 'How does the AI Candidate Matcher work?',
    answer: 'Recruiters can use our AI matcher to evaluate candidate resumes and profiles against specific job descriptions. The AI ranks candidates based on match scores and provides a short justification for the fit.',
  },
  {
    question: 'How do companies verify their recruiter profiles?',
    answer: 'Recruiter profiles require manual verification by the admin cell to ensure security and validity. Companies must provide valid official details during signup.',
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-accentBlue/10 border border-accentBlue/20 mb-4">
          <HelpCircle className="w-8 h-8 text-accentBlue" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-400 text-lg">
          Got questions? We've got answers. Explore our FAQs to get quick solutions.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className={`card cursor-pointer border transition-colors duration-250 ${
                isOpen ? 'border-accentBlue/40 bg-lightNavy/80' : 'border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-accentBlue" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {isOpen && (
                <div className="mt-4 pt-4 border-t border-gray-800/80 text-gray-400 text-sm leading-relaxed animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
