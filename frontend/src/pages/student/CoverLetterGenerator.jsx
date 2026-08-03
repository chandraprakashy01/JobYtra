import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText, Upload, CheckCircle, AlertCircle, ChevronLeft,
  Loader2, Copy, Download, RefreshCw
} from 'lucide-react';

const tones = [
  { value: 'Professional', label: 'Professional', desc: 'Formal and polished', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'Confident', label: 'Confident', desc: 'Bold and assertive', color: 'border-purple-300 bg-purple-50 text-purple-700' },
  { value: 'Friendly', label: 'Friendly', desc: 'Warm and approachable', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
];

const CoverLetterGenerator = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [editableLetter, setEditableLetter] = useState('');
  const fileInputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB.'); return; }
    setError(''); setFile(f); setResult(null);
  };

  const handleGenerate = async () => {
    if (!file || !companyName.trim() || !jobDescription.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('companyName', companyName.trim());
      form.append('jobDescription', jobDescription.trim());
      form.append('tone', tone);
      const res = await api.post('/student/ai/cover-letter', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
      setEditableLetter(res.data.coverLetter || '');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([editableLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover_letter_${companyName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fadeIn max-w-4xl">
      <Link to="/student/ai" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to AI Tools
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-900">AI Cover Letter Generator</h1>
          <p className="text-sm text-slate-500">Generate personalized cover letters in seconds</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-6">
          {/* Step 1: Upload */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</div>
              <h3 className="font-bold text-slate-900">Upload Your Resume</h3>
            </div>
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${dragging ? 'border-emerald-400 bg-emerald-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-emerald-300'}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <div className="text-left">
                    <p className="font-semibold text-sm text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-400">Click to change</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-sm text-slate-600">Drop PDF or click to browse</p>
                </>
              )}
            </div>
          </div>

          {/* Step 2: Company + Job */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black">2</div>
              <h3 className="font-bold text-slate-900">Job Details</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label-text">Company Name</label>
                <input
                  className="input-field"
                  placeholder="e.g., Google, Microsoft, Razorpay"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="label-text">Job Description</label>
                <textarea
                  className="input-field h-36 resize-none"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Tone */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-black">3</div>
              <h3 className="font-bold text-slate-900">Choose Tone</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {tones.map(t => (
                <button
                  key={t.value}
                  onClick={() => setTone(t.value)}
                  className={`border-2 rounded-xl p-3 text-center transition-all ${
                    tone === t.value ? t.color + ' border-current' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm">{t.label}</div>
                  <div className="text-xs mt-0.5 opacity-70">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!file || !companyName.trim() || !jobDescription.trim() || loading}
            className="btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Generating cover letter...</>
            ) : (
              <><FileText className="w-5 h-5" /> Generate Cover Letter</>
            )}
          </button>
        </div>
      ) : (
        <div className="animate-fadeIn">
          {/* Result header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Your Cover Letter</h3>
              <p className="text-sm text-slate-500">
                Generated for <span className="font-semibold text-emerald-700">{result.companyName}</span>
                {' '}· <span className="capitalize">{result.tone}</span> tone
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary text-sm px-3 py-2 flex items-center gap-1.5">
                {copied ? <><CheckCircle className="w-4 h-4 text-emerald-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
              </button>
              <button onClick={handleDownload} className="btn-secondary text-sm px-3 py-2 flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>

          {/* Editable letter */}
          <div className="card p-0 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-slate-400 font-mono">cover_letter.txt — editable</span>
            </div>
            <textarea
              value={editableLetter}
              onChange={e => setEditableLetter(e.target.value)}
              className="w-full p-6 text-sm text-slate-700 leading-relaxed font-mono resize-none focus:outline-none bg-white"
              rows={20}
            />
          </div>

          <button
            onClick={() => { setResult(null); setFile(null); setCompanyName(''); setJobDescription(''); }}
            className="btn-secondary w-full py-3 mt-4 text-sm flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Generate Another Letter
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;
