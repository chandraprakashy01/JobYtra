import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileSearch, GitCompare, FileText, Zap, MessagesSquare,
  ArrowRight, Sparkles, Shield
} from 'lucide-react';

const tools = [
  {
    id: 'resume-analyzer',
    title: 'AI Resume Analyzer',
    description: 'Upload your PDF resume and get an instant ATS score, skill detection, keyword gaps, and improvement suggestions powered by Gemini AI.',
    icon: FileSearch,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-500',
    badge: 'Phase 1',
    badgeColor: 'bg-blue-100 text-blue-700',
    path: '/student/ai/resume-analyzer',
    features: ['ATS Score (0-100)', 'Skill Detection', 'Missing Keywords', 'AI Suggestions'],
  },
  {
    id: 'job-match',
    title: 'Resume vs Job Match',
    description: 'Compare your resume against any job description to get a match score, identify skill gaps, and receive a personalized learning roadmap.',
    icon: GitCompare,
    gradient: 'from-purple-500 to-violet-500',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    iconBg: 'bg-purple-500',
    badge: 'Phase 2',
    badgeColor: 'bg-purple-100 text-purple-700',
    path: '/student/ai/job-match',
    features: ['Match Score', 'Matched Skills', 'Missing Skills', 'Learning Roadmap'],
  },
  {
    id: 'cover-letter',
    title: 'AI Cover Letter',
    description: 'Generate personalized, professional cover letters tailored to any company and job description. Choose your tone and instantly download.',
    icon: FileText,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-500',
    badge: 'Phase 3',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    path: '/student/ai/cover-letter',
    features: ['Personalized Content', '3 Tone Options', 'Copy & Download', 'Editable Output'],
  },
  {
    id: 'interview-coach',
    title: 'AI Interview Coach',
    description: 'Prepare for interviews with AI-generated questions based on your role, skills, and difficulty level — complete with hints and sample answers.',
    icon: MessagesSquare,
    gradient: 'from-orange-500 to-rose-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    iconBg: 'bg-orange-500',
    badge: 'Phase 5',
    badgeColor: 'bg-orange-100 text-orange-700',
    path: '/student/ai/interview-coach',
    features: ['5 Targeted Questions', 'Hints & Answers', 'Follow-up Questions', 'Difficulty Levels'],
  },
];

const AIToolsHub = () => {
  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900">AI Tools</h1>
            <p className="text-slate-500 text-sm">Powered by Google Gemini</p>
          </div>
        </div>
        <p className="text-slate-600 max-w-2xl mt-4 leading-relaxed">
          Supercharge your job search with AI-powered tools. Analyze your resume, match it to jobs, 
          generate cover letters, and prepare for interviews — all in one place.
        </p>
      </div>

      {/* AI Powered banner */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl mb-8">
        <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-800">All tools powered by Google Gemini 1.5 Flash</p>
          <p className="text-xs text-blue-600 mt-0.5">Results are AI-generated. Always review before using in applications.</p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-blue-600 font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>Secure & Private</span>
        </div>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.path}
              className={`card group flex flex-col p-0 overflow-hidden hover:shadow-lg transition-all duration-300 border ${tool.border} hover:border-blue-200 hover:-translate-y-1`}
            >
              {/* Card header */}
              <div className={`${tool.bg} px-6 pt-6 pb-4`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${tool.iconBg} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{tool.description}</p>
              </div>

              {/* Features list */}
              <div className="px-6 py-4 bg-white flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.features.map((f) => (
                    <span key={f} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium">
                      {f}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                  Launch Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AIToolsHub;
