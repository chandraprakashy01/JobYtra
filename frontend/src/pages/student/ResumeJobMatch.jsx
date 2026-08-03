import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  GitCompare, Upload, CheckCircle, AlertCircle,
  ChevronLeft, Loader2, ArrowRight, BookOpen, Map, Lightbulb
} from 'lucide-react';

const MatchScoreRing = ({ score }) => {
  const color = score >= 70 ? '#16a34a' : score >= 45 ? '#d97706' : '#dc2626';
  const label = score >= 70 ? 'Strong Match' : score >= 45 ? 'Moderate Match' : 'Weak Match';
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="12" />
          <circle
            cx="65" cy="65" r={radius} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900">{score}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-bold" style={{ color }}>{label}</span>
    </div>
  );
};

const SkillChip = ({ label, matched }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
    ${matched ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
    {matched ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
    {label}
  </span>
);

const ResumeJobMatch = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB.'); return; }
    setError(''); setFile(f); setResult(null);
  };

  const handleMatch = async () => {
    if (!file || !jobDescription.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('jobDescription', jobDescription);
      const res = await api.post('/student/ai/match-job', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to match resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl">
      <Link to="/student/ai" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to AI Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
          <GitCompare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">Resume vs Job Match</h1>
          <p className="text-sm text-slate-500">See how well your resume fits a job description</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Upload */}
        <div>
          <label className="label-text mb-2 block">Your Resume (PDF)</label>
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
              ${dragging ? 'border-purple-400 bg-purple-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-purple-300'}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            {file ? (
              <>
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-sm text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Click to change</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-sm text-slate-600">Drop resume here</p>
                <p className="text-xs text-slate-400 mt-0.5">PDF only · Max 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="label-text mb-2 block">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            className="input-field h-40 resize-none"
            placeholder="Paste the full job description here (requirements, responsibilities, skills required)..."
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <button
        onClick={handleMatch}
        disabled={!file || !jobDescription.trim() || loading}
        className="btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 mb-8"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing match...</>
        ) : (
          <><GitCompare className="w-5 h-5" /> Match Resume to Job</>
        )}
      </button>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card h-36 skeleton" />)}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score */}
          <div className="card p-6 flex flex-col md:flex-row items-center gap-8">
            <MatchScoreRing score={result.matchScore} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Match Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-emerald-700">{result.matchedSkills?.length || 0}</div>
                  <div className="text-xs text-emerald-600 font-medium">Skills Matched</div>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-red-700">{result.missingSkills?.length || 0}</div>
                  <div className="text-xs text-red-600 font-medium">Skills Missing</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900">Matched Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills?.length > 0
                  ? result.matchedSkills.map((s, i) => <SkillChip key={i} label={s} matched />)
                  : <p className="text-sm text-slate-400 italic">No direct matches found</p>}
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-slate-900">Missing Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.length > 0
                  ? result.missingSkills.map((s, i) => <SkillChip key={i} label={s} matched={false} />)
                  : <p className="text-sm text-slate-400 italic">No critical gaps found!</p>}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-900">Improvement Suggestions</h3>
              </div>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <ArrowRight className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning Roadmap */}
          {result.learningRoadmap?.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-5">
                <Map className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-slate-900">Your Learning Roadmap</h3>
              </div>
              <div className="space-y-3">
                {result.learningRoadmap.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-black">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm text-slate-700 font-medium">{step}</p>
                      {i < result.learningRoadmap.length - 1 && (
                        <div className="ml-3 mt-2 w-px h-4 bg-slate-200" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setResult(null); setFile(null); setJobDescription(''); }} className="btn-secondary w-full py-3 text-sm">
            Start New Match
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeJobMatch;
