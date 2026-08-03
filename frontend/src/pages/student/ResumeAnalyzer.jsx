import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Upload, FileText, CheckCircle, AlertCircle, Lightbulb,
  ChevronLeft, Loader2, Target, Star, Search, TrendingUp
} from 'lucide-react';

const ScoreGauge = ({ score }) => {
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Good' : 'Needs Work';
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
          <span className="text-4xl font-black text-slate-900">{score}</span>
          <span className="text-xs text-slate-500 font-medium">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-bold" style={{ color }}>{label}</span>
      <span className="text-xs text-slate-500 mt-0.5">ATS Score</span>
    </div>
  );
};

const Chip = ({ label, color }) => (
  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${color}`}>
    {label}
  </span>
);

const Section = ({ icon: Icon, title, items, chipColor, emptyText }) => (
  <div className="card p-5">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-600" />
      </div>
      <h3 className="font-bold text-slate-900 text-base">{title}</h3>
      <span className="ml-auto text-xs text-slate-400 font-medium">{items?.length || 0} items</span>
    </div>
    {items && items.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => <Chip key={i} label={item} color={chipColor} />)}
      </div>
    ) : (
      <p className="text-sm text-slate-400 italic">{emptyText}</p>
    )}
  </div>
);

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are accepted.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB.');
      return;
    }
    setError('');
    setFile(f);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await api.post('/student/ai/analyze-resume', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-4xl">
      {/* Breadcrumb */}
      <Link to="/student/ai" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to AI Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">AI Resume Analyzer</h1>
          <p className="text-sm text-slate-500">Get your ATS score and personalized improvement tips</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 mb-4
          ${dragging ? 'border-blue-400 bg-blue-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/50'}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        {file ? (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-bold text-slate-900 text-lg">{file.name}</p>
            <p className="text-sm text-slate-500 mt-1">{(file.size / 1024).toFixed(0)} KB · PDF · Click to change</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-700 text-lg mb-1">Drop your resume here</p>
            <p className="text-sm text-slate-500">or click to browse · PDF only · Max 5MB</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!file || loading}
        className="btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center gap-2 mb-8"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing your resume...</>
        ) : (
          <><Search className="w-5 h-5" /> Analyze Resume</>
        )}
      </button>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card h-36 skeleton" />)}
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score + Summary */}
          <div className="card p-6 flex flex-col md:flex-row items-center md:items-start gap-8">
            <ScoreGauge score={result.atsScore} />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Summary</h3>
              <p className="text-slate-600 leading-relaxed">{result.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>{result.detectedSkills?.length || 0} skills found</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>{result.missingKeywords?.length || 0} keywords missing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section
              icon={CheckCircle} title="Detected Skills"
              items={result.detectedSkills}
              chipColor="bg-emerald-50 text-emerald-700 border border-emerald-100"
              emptyText="No known skills detected"
            />
            <Section
              icon={AlertCircle} title="Missing Keywords"
              items={result.missingKeywords}
              chipColor="bg-red-50 text-red-700 border border-red-100"
              emptyText="No critical keywords missing"
            />
            <Section
              icon={Star} title="Strengths"
              items={result.strengths}
              chipColor="bg-blue-50 text-blue-700 border border-blue-100"
              emptyText="No specific strengths identified"
            />
            <Section
              icon={Lightbulb} title="Improvement Suggestions"
              items={result.suggestions}
              chipColor="bg-amber-50 text-amber-700 border border-amber-100"
              emptyText="Resume looks good!"
            />
          </div>

          <button
            onClick={() => { setResult(null); setFile(null); }}
            className="btn-secondary w-full py-3 text-sm"
          >
            Analyze Another Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
