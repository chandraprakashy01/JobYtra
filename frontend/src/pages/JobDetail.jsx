import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Building2, MapPin, Calendar, IndianRupee, ArrowLeft, Briefcase, CheckCircle, Clock } from 'lucide-react';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then(res => {
                setJob(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'ROLE_STUDENT') {
            setMessage("Only students can apply.");
            return;
        }
        setIsApplying(true);
        try {
            const res = await api.post(`/applications/apply/${id}`);
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to apply");
        } finally {
            setIsApplying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
                <div className="flex items-center mb-8">
                    <div className="h-6 w-32 skeleton rounded"></div>
                </div>
                <div className="card border-t-4 border-t-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="w-full">
                            <div className="h-10 w-3/4 md:w-1/2 skeleton rounded mb-4"></div>
                            <div className="flex gap-4">
                                <div className="h-5 w-32 skeleton rounded"></div>
                                <div className="h-5 w-24 skeleton rounded"></div>
                            </div>
                        </div>
                        <div className="h-12 w-full md:w-40 skeleton rounded-xl"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-darkNavy p-5 rounded-xl border border-gray-800">
                                <div className="h-4 w-20 skeleton rounded mb-3"></div>
                                <div className="h-6 w-24 skeleton rounded"></div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        <div className="h-6 w-40 skeleton rounded mb-6"></div>
                        <div className="h-4 w-full skeleton rounded"></div>
                        <div className="h-4 w-full skeleton rounded"></div>
                        <div className="h-4 w-5/6 skeleton rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Job not found</h2>
                <button onClick={() => navigate('/jobs')} className="btn-secondary">Return to Jobs</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fadeIn">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-8 transition group font-medium">
                <ArrowLeft className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" /> Back to Jobs
            </button>
            
            {message && (
                <div className={`p-4 rounded-xl mb-8 font-medium flex items-center shadow-sm animate-slideUp ${message.toLowerCase().includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                    {message.toLowerCase().includes('success') ? <CheckCircle className="w-5 h-5 mr-3" /> : <div className="w-5 h-5 rounded-full bg-red-400 mr-3 flex items-center justify-center text-darkNavy font-bold text-xs">!</div>}
                    {message}
                </div>
            )}

            <div className="card border-t-4 border-t-accentBlue p-6 md:p-10 shadow-lg shadow-black/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3">{job.title}</h1>
                        <div className="flex flex-wrap items-center text-gray-400 gap-x-6 gap-y-2 font-medium">
                            <span className="flex items-center"><Building2 className="w-5 h-5 mr-2 text-gray-500"/> Company #{job.companyId.substring(0, 5)}</span>
                            <span className="flex items-center capitalize"><MapPin className="w-5 h-5 mr-2 text-gray-500"/> {job.location}</span>
                            <span className="flex items-center text-accentBlue"><Clock className="w-5 h-5 mr-2"/> Posted Recently</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleApply} 
                        disabled={isApplying || (user && user.role !== 'ROLE_STUDENT')}
                        className={`text-lg px-10 py-3.5 w-full md:w-auto shadow-lg shadow-accentBlue/30 whitespace-nowrap ${isApplying ? 'btn-secondary flex justify-center opacity-70' : 'btn-primary'}`}
                    >
                        {isApplying ? (
                            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Apply Now'}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-darkNavy/50 p-5 rounded-xl border border-gray-800/80 hover:border-gray-700 transition">
                        <p className="text-sm text-gray-400 mb-2 flex items-center uppercase tracking-wider"><IndianRupee className="w-4 h-4 mr-1.5 text-green-500"/> Salary</p>
                        <p className="font-semibold text-lg">{job.salary}</p>
                    </div>
                    <div className="bg-darkNavy/50 p-5 rounded-xl border border-gray-800/80 hover:border-gray-700 transition">
                        <p className="text-sm text-gray-400 mb-2 flex items-center uppercase tracking-wider"><Briefcase className="w-4 h-4 mr-1.5 text-blue-500"/> Type</p>
                        <p className="font-semibold text-lg capitalize">{job.type}</p>
                    </div>
                    <div className="bg-darkNavy/50 p-5 rounded-xl border border-gray-800/80 hover:border-gray-700 transition">
                        <p className="text-sm text-gray-400 mb-2 flex items-center uppercase tracking-wider"><Calendar className="w-4 h-4 mr-1.5 text-orange-500"/> Deadline</p>
                        <p className="font-semibold text-lg">{new Date(job.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="bg-darkNavy/50 p-5 rounded-xl border border-gray-800/80 hover:border-gray-700 transition">
                        <p className="text-sm text-gray-400 mb-2 flex items-center uppercase tracking-wider"><CheckCircle className="w-4 h-4 mr-1.5 text-purple-500"/> Req. CGPA</p>
                        <p className="font-semibold text-lg">{job.eligibility?.minCgpa || 'N/A'}</p>
                    </div>
                </div>

                <div className="mb-10">
                    <h3 className="text-xl font-bold mb-5 border-b border-gray-800 pb-3 flex items-center text-white">
                        <FileText className="w-5 h-5 mr-2 text-accentBlue" /> Description
                    </h3>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">{job.description}</p>
                    </div>
                </div>

                <div className="bg-darkNavy p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-accentBlue" /> Eligibility & Requirements
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-gray-500 mt-2 mr-3"></div>
                            <div>
                                <span className="text-gray-400 font-medium">Minimum CGPA:</span>
                                <span className="ml-2 text-white font-semibold">{job.eligibility?.minCgpa}</span>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-2 h-2 rounded-full bg-gray-500 mt-2 mr-3"></div>
                            <div>
                                <span className="text-gray-400 font-medium">Eligible Branches:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {job.eligibility?.branches?.map(branch => (
                                        <span key={branch} className="bg-lightNavy border border-gray-700 px-3 py-1 rounded-md text-sm font-medium">{branch}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Fix missing imports
import { FileText } from 'lucide-react';
export default JobDetail;
