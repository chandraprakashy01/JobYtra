import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  MessagesSquare, ChevronLeft, Loader2, ChevronDown, ChevronUp,
  Lightbulb, CheckCircle, ArrowRight, User, BarChart3, Zap
} from 'lucide-react';

const skillOptions = [
  'Java', 'Python', 'React', 'Node.js', 'Spring Boot', 'SQL', 'MongoDB',
  'Docker', 'Kubernetes', 'AWS', 'Git', 'JavaScript', 'TypeScript',
  'Data Structures', 'System Design', 'REST APIs', 'Machine Learning', 'C++'
];

const difficultyColors = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Medium: 'bg-amber-50 text-amber-700 border-amber-100',
  Hard: 'bg-red-50 text-red-700 border-red-100',
};

const QuestionCard = ({ q, index, total }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showFollowup, setShowFollowup] = useState(false);
  const diffColor = difficultyColors[q.difficulty] || difficultyColors['Medium'];

  return (
    <div className="card p-0 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-700 rounded-xl flex items-center justify-center text-sm font-black">
              {index + 1}
            </div>
            <p className="text-slate-900 font-semibold text-base leading-relaxed">{q.question}</p>
          </div>
          <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${diffColor}`}>
            {q.difficulty || 'Medium'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {q.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all
                ${showHint ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-200'}`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
              {showHint ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all
              ${showAnswer ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-200'}`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {showAnswer ? 'Hide Answer' : 'View Answer'}
            {showAnswer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {q.followUp && (
            <button
              onClick={() => setShowFollowup(!showFollowup)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all
                ${showFollowup ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-200'}`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              {showFollowup ? 'Hide Follow-up' : 'Follow-up'}
            </button>
          )}
        </div>
      </div>

      {(showHint || showAnswer || showFollowup) && (
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {showHint && q.hint && (
            <div className="px-5 py-3 bg-amber-50/60">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">💡 Hint</p>
              <p className="text-sm text-amber-800 leading-relaxed">{q.hint}</p>
            </div>
          )}
          {showAnswer && q.expectedAnswer && (
            <div className="px-5 py-3 bg-blue-50/60">
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">✅ Expected Answer</p>
              <p className="text-sm text-blue-800 leading-relaxed">{q.expectedAnswer}</p>
            </div>
          )}
          {showFollowup && q.followUp && (
            <div className="px-5 py-3 bg-purple-50/60">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1">🔄 Follow-up Question</p>
              <p className="text-sm text-purple-800 leading-relaxed">{q.followUp}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InterviewCoach = () => {
  const [role, setRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState('Fresher');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleGenerate = async () => {
    if (!role.trim()) { setError('Please enter a role.'); return; }
    setLoading(true); setError(''); setQuestions([]);
    try {
      const res = await api.post('/student/ai/interview-prep', {
        role: role.trim(),
        skills: selectedSkills,
        experience,
        difficulty
      });
      setQuestions(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const experienceLevels = ['Fresher', 'Intern', '1-2 Years', '3-5 Years', '5+ Years'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  return (
    <div className="animate-fadeIn max-w-4xl">
      <Link to="/student/ai" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to AI Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
          <MessagesSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">AI Interview Coach</h1>
          <p className="text-sm text-slate-500">Practice with AI-generated interview questions</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="space-y-5">
          {/* Role */}
          <div>
            <label className="label-text">Target Role</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                className="input-field pl-9"
                placeholder="e.g., Software Engineer, Full Stack Developer, Data Analyst"
                value={role}
                onChange={e => setRole(e.target.value)}
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="label-text">
              Select Your Skills
              <span className="ml-2 text-xs font-normal text-slate-400">({selectedSkills.length} selected)</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Experience */}
            <div>
              <label className="label-text flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-slate-400" /> Experience Level</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {experienceLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setExperience(level)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      experience === level
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="label-text flex items-center gap-1.5"><Zap className="w-4 h-4 text-slate-400" /> Difficulty</label>
              <div className="flex gap-2 mt-2">
                {difficulties.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      difficulty === d
                        ? d === 'Easy' ? 'bg-emerald-500 text-white border-emerald-500'
                          : d === 'Medium' ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mt-4 text-sm text-red-700">
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!role.trim() || loading}
          className="btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 mt-5"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generating questions...</>
          ) : (
            <><MessagesSquare className="w-5 h-5" /> Generate 5 Interview Questions</>
          )}
        </button>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="card h-24 skeleton" />)}
        </div>
      )}

      {questions.length > 0 && !loading && (
        <div className="animate-fadeIn space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900">
              {questions.length} Questions for <span className="text-orange-600">{role}</span>
            </h2>
            <button onClick={handleGenerate} className="text-sm text-slate-500 hover:text-orange-600 flex items-center gap-1">
              <Loader2 className="w-4 h-4" /> Regenerate
            </button>
          </div>
          {questions.map((q, i) => (
            <QuestionCard key={i} q={q} index={i} total={questions.length} />
          ))}
          <button onClick={() => setQuestions([])} className="btn-secondary w-full py-3 text-sm">
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewCoach;
