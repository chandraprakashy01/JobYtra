import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { 
    ArrowLeft, Brain, Award, Users, Star, Mail, CheckCircle, 
    AlertCircle, Sparkles, ShieldCheck, Cpu, Terminal
} from 'lucide-react';

const AICandidateMatch = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzed, setAnalyzed] = useState(false);
    const [invitingIds, setInvitingIds] = useState({});
    const [invitedIds, setInvitedIds] = useState({});
    const [updatingStatusIds, setUpdatingStatusIds] = useState({});
    const [filterType, setFilterType] = useState('all'); // 'all' | 'applicants' | 'talents'

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then(res => {
                setJob(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [id]);

    const runAIMatch = async () => {
        setIsAnalyzing(true);
        try {
            const res = await api.get(`/company/jobs/${id}/ai-match`);
            setMatches(res.data);
            setAnalyzed(true);
        } catch (error) {
            alert('Failed to execute AI matching process.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleInvite = async (studentId) => {
        setInvitingIds(prev => ({ ...prev, [studentId]: true }));
        try {
            await api.post(`/company/jobs/${id}/invite/${studentId}`);
            setInvitedIds(prev => ({ ...prev, [studentId]: true }));
        } catch (error) {
            alert('Failed to send invitation.');
        } finally {
            setInvitingIds(prev => ({ ...prev, [studentId]: false }));
        }
    };

    const handleStatusChange = async (appId, studentId, newStatus) => {
        setUpdatingStatusIds(prev => ({ ...prev, [studentId]: true }));
        try {
            await api.put(`/company/applications/${appId}/status`, { status: newStatus });
            setMatches(prev => prev.map(m => m.applicationId === appId ? { ...m, student: { ...m.student }, justification: m.justification, matchScore: m.matchScore, hasApplied: m.hasApplied, applicationId: appId } : m));
            alert(`Candidate status updated to ${newStatus}`);
        } catch (error) {
            alert('Failed to update applicant status.');
        } finally {
            setUpdatingStatusIds(prev => ({ ...prev, [studentId]: false }));
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400 border-green-500/30 bg-green-500/10';
        if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
        return 'text-red-400 border-red-500/30 bg-red-500/10';
    };

    const filteredMatches = matches.filter(match => {
        if (filterType === 'applicants') return match.hasApplied;
        if (filterType === 'talents') return !match.hasApplied;
        return true;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-16 h-16 border-4 border-accentBlue border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">Loading Job Details...</p>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Link to="/company/dashboard" className="text-gray-400 hover:text-white mb-4 inline-flex items-center transition group font-medium text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
                        <Brain className="w-8 h-8 text-accentBlue animate-pulse" /> AI Candidate Matcher
                    </h1>
                    <p className="text-gray-400 mt-1">Evaluate applicants and discover qualified candidates matching <strong>{job?.title}</strong>.</p>
                </div>

                {!isAnalyzing && (
                    <button 
                        onClick={runAIMatch} 
                        className="btn-primary flex items-center shadow-lg shadow-accentBlue/20 px-6 py-3 font-semibold text-lg"
                    >
                        <Sparkles className="w-5 h-5 mr-2 animate-bounce" /> {analyzed ? 'Re-Run AI Matching' : 'Start AI Matchmaker'}
                    </button>
                )}
            </div>

            {/* Job Requirement Card */}
            {job && (
                <div className="card bg-gradient-to-br from-lightNavy to-[#161d36] border-accentBlue/20 p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs uppercase tracking-wider font-bold text-accentBlue px-2.5 py-1 rounded bg-accentBlue/10 border border-accentBlue/20">Target Profile</span>
                        <span className="text-sm text-gray-400 capitalize">{job.type} • {job.location}</span>
                    </div>
                    <h2 className="text-xl font-bold mb-3">{job.title}</h2>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-6 text-sm border-t border-gray-800/80 pt-4">
                        <div>
                            <span className="text-gray-500 block text-xs">Min CGPA</span>
                            <span className="font-semibold text-white">{job.eligibility?.minCgpa || 'No requirement'}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs">Eligible Branches</span>
                            <span className="font-semibold text-white">
                                {job.eligibility?.branches?.length > 0 ? job.eligibility.branches.join(', ') : 'All Branches'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs">Job Salary</span>
                            <span className="font-semibold text-white">{job.salary || 'Unspecified'}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Loading State */}
            {isAnalyzing && (
                <div className="card border-accentBlue/30 bg-lightNavy/40 py-16 text-center max-w-2xl mx-auto flex flex-col items-center justify-center my-10 animate-pulse">
                    <div className="relative mb-6">
                        <Cpu className="w-16 h-16 text-accentBlue animate-spin duration-1000" />
                        <Brain className="w-8 h-8 text-white absolute inset-0 m-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Analyzing Candidate Profiles</h3>
                    <div className="text-gray-400 space-y-2 max-w-md">
                        <p className="flex items-center justify-center text-sm"><Terminal className="w-4 h-4 mr-2 text-accentBlue" /> Fetching academic branches & CGPAs...</p>
                        <p className="flex items-center justify-center text-sm"><Terminal className="w-4 h-4 mr-2 text-accentBlue" /> Processing skill alignments using Google Gemini...</p>
                        <p className="flex items-center justify-center text-sm"><Terminal className="w-4 h-4 mr-2 text-accentBlue" /> Ranking matches by relevance suitability...</p>
                    </div>
                </div>
            )}

            {/* AI Results */}
            {analyzed && !isAnalyzing && (
                <div>
                    {/* Filters & Count */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-white">{filteredMatches.length} Matches Found</span>
                        </div>
                        <div className="flex bg-darkNavy/80 p-1 rounded-xl border border-gray-800">
                            <button 
                                onClick={() => setFilterType('all')} 
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'all' ? 'bg-accentBlue text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                All Results
                            </button>
                            <button 
                                onClick={() => setFilterType('applicants')} 
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'applicants' ? 'bg-accentBlue text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Applicants
                            </button>
                            <button 
                                onClick={() => setFilterType('talents')} 
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterType === 'talents' ? 'bg-accentBlue text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Talent Pool
                            </button>
                        </div>
                    </div>

                    {/* Candidate Cards Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {filteredMatches.length > 0 ? (
                            filteredMatches.map((match, idx) => (
                                <div key={match.student.id} className="card bg-gradient-to-r from-lightNavy/90 to-transparent hover:border-accentBlue/40 group flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6">
                                    {/* Left Content */}
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2.5">
                                            <h3 className="text-xl font-bold text-white group-hover:text-accentBlue transition-colors">{match.student.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${
                                                match.hasApplied 
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}>
                                                {match.hasApplied ? 'Applicant' : 'Talent Pool'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
                                            <span>Branch: <strong className="text-gray-200">{match.student.branch}</strong></span>
                                            <span>•</span>
                                            <span>CGPA: <strong className="text-gray-200">{match.student.cgpa || 'N/A'}</strong></span>
                                            <span>•</span>
                                            <span>Batch: <strong className="text-gray-200">{match.student.batch || 'N/A'}</strong></span>
                                        </div>

                                        {/* Skills list */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {match.student.skills?.map((skill, sIdx) => (
                                                <span key={sIdx} className="text-xs bg-gray-900 border border-gray-800 text-gray-300 px-2 py-1 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Justification Box */}
                                        <div className="bg-darkNavy/50 border border-gray-800/80 rounded-xl p-4 flex items-start gap-3">
                                            <Brain className="w-5 h-5 text-accentBlue shrink-0 mt-0.5" />
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 block mb-1 uppercase tracking-wider">AI Evaluation</span>
                                                <p className="text-sm text-gray-300 italic">{match.justification}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Content - Score & Actions */}
                                    <div className="flex lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto shrink-0 border-t lg:border-t-0 border-gray-800/80 pt-4 lg:pt-0 gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400 hidden lg:block font-medium">Suitability Match</span>
                                            <div className={`px-4 py-2 rounded-xl border text-xl font-bold flex items-center gap-2 ${getScoreColor(match.matchScore)}`}>
                                                <Star className="w-5 h-5 fill-current" />
                                                {match.matchScore}%
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-auto flex gap-2">
                                            {match.hasApplied ? (
                                                <div className="flex gap-2 w-full">
                                                    <button 
                                                        onClick={() => handleStatusChange(match.applicationId, match.student.id, 'shortlisted')}
                                                        disabled={updatingStatusIds[match.student.id]}
                                                        className="btn-primary !py-2 !px-4 text-sm w-full lg:w-auto"
                                                    >
                                                        {updatingStatusIds[match.student.id] ? 'Updating...' : 'Shortlist'}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusChange(match.applicationId, match.student.id, 'rejected')}
                                                        disabled={updatingStatusIds[match.student.id]}
                                                        className="btn-secondary !py-2 !px-4 text-sm w-full lg:w-auto border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => handleInvite(match.student.id)}
                                                    disabled={invitingIds[match.student.id] || invitedIds[match.student.id]}
                                                    className={`w-full lg:w-auto flex items-center justify-center font-medium rounded-xl text-sm py-2.5 px-5 transition duration-200 ${
                                                        invitedIds[match.student.id]
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : 'bg-accentBlue text-white hover:bg-hoverBlue'
                                                    }`}
                                                >
                                                    {invitingIds[match.student.id] ? (
                                                        'Sending...'
                                                    ) : invitedIds[match.student.id] ? (
                                                        <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1.5" /> Invited</span>
                                                    ) : (
                                                        <span className="flex items-center"><Mail className="w-4 h-4 mr-1.5" /> Invite to Apply</span>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-lightNavy/30 border border-gray-800 border-dashed rounded-2xl p-16 text-center">
                                <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold text-gray-300 mb-1">No matches found for filter</h3>
                                <p className="text-gray-500 max-w-sm mx-auto">Try clearing your filters or update the job requirements to match more students.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Initial Empty State */}
            {!analyzed && !isAnalyzing && (
                <div className="card bg-lightNavy/50 border border-dashed border-gray-800 text-center py-20">
                    <Brain className="w-20 h-20 text-accentBlue mx-auto mb-6 opacity-80 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">Find the Accurate Candidate with AI</h3>
                    <p className="text-gray-400 max-w-lg mx-auto mb-8 text-sm">
                        JobYtra's AI Candidate Matcher scans the applicant pool and analyzes our talent catalog to rank candidates according to eligibility, CGPA, and specific skillsets.
                    </p>
                    <button 
                        onClick={runAIMatch}
                        className="btn-primary inline-flex items-center shadow-lg shadow-accentBlue/20 px-8 py-3 text-lg font-semibold"
                    >
                        <Sparkles className="w-5 h-5 mr-2 animate-bounce" /> Run AI Matchmaker Analysis
                    </button>
                </div>
            )}
        </div>
    );
};

export default AICandidateMatch;
