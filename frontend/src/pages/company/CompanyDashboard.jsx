import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Briefcase, Users, PlusCircle, ExternalLink, Calendar, MapPin, Edit, FileText, Brain } from 'lucide-react';

const CompanyDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/company/jobs')
            .then(res => {
                setJobs(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    const activeJobs = jobs.filter(j => j.isApproved).length;
    const pendingJobs = jobs.filter(j => !j.isApproved).length;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold mb-2">Company Dashboard</h1>
                    <p className="text-gray-400">Manage your job postings and applicants.</p>
                </div>
                <Link to="/company/post-job" className="btn-primary flex items-center shadow-lg shadow-accentBlue/20 px-6 py-3 whitespace-nowrap">
                    <PlusCircle className="w-5 h-5 mr-2" /> Post New Job
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card h-32 skeleton rounded-xl"></div>
                    ))
                ) : (
                    <>
                        <div className="card bg-gradient-to-br from-lightNavy to-[#1a2542] border-accentBlue/30 hover:border-accentBlue/60 transition-colors">
                            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center uppercase tracking-wider">
                                <Briefcase className="w-4 h-4 mr-2 text-accentBlue"/> Total Jobs Posted
                            </h3>
                            <p className="text-4xl font-bold text-white mt-4">{jobs.length}</p>
                        </div>
                        <div className="card bg-gradient-to-br from-lightNavy to-[#1a2542] border-green-500/20 hover:border-green-500/50 transition-colors">
                            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center uppercase tracking-wider">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div> Active Listings
                            </h3>
                            <p className="text-4xl font-bold text-green-400 mt-4">{activeJobs}</p>
                        </div>
                        <div className="card bg-gradient-to-br from-lightNavy to-[#1a2542] border-amber-500/20 hover:border-amber-500/50 transition-colors">
                            <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center uppercase tracking-wider">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div> Pending Approval
                            </h3>
                            <p className="text-4xl font-bold text-amber-400 mt-4">{pendingJobs}</p>
                        </div>
                    </>
                )}
            </div>

            <h2 className="text-2xl font-heading font-bold mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-accentBlue" /> Your Listings
            </h2>
            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="card h-40 skeleton rounded-xl"></div>
                    ))
                ) : jobs.length > 0 ? (
                    jobs.map(job => (
                        <div key={job.id} className="card flex flex-col md:flex-row justify-between md:items-center group hover:border-gray-700 transition-colors bg-gradient-to-r from-lightNavy/50 to-transparent">
                            <div className="mb-6 md:mb-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-accentBlue transition-colors">{job.title}</h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center border ${job.isApproved ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.isApproved ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                                        {job.isApproved ? 'Active' : 'Pending'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                                    <span className="flex items-center capitalize"><Briefcase className="w-4 h-4 mr-1.5 text-gray-500"/> {job.type}</span>
                                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-500"/> {job.location}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5"/> Posted: {new Date(job.postedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                                    <span className="flex items-center text-orange-400/80"><Calendar className="w-3.5 h-3.5 mr-1.5"/> Deadline: {new Date(job.deadline).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link to={`/jobs/${job.id}`} className="btn-secondary flex items-center justify-center bg-gray-800/80 hover:bg-gray-700">
                                    <ExternalLink className="w-4 h-4 mr-2" /> View Public
                                </Link>
                                <Link to={`/company/job/${job.id}/ai-match`} className="btn-secondary flex items-center justify-center border-accentBlue/30 hover:border-accentBlue/50 text-accentBlue hover:bg-accentBlue/10">
                                    <Brain className="w-4 h-4 mr-2" /> AI Matcher
                                </Link>
                                <Link to={`/company/job/${job.id}/applicants`} className="btn-primary flex items-center justify-center shadow-lg shadow-accentBlue/20">
                                    <Users className="w-4 h-4 mr-2" /> View Applicants
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full bg-lightNavy/30 border border-gray-800 border-dashed rounded-2xl p-16 text-center">
                        <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-6 opacity-50" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">No Job Listings</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't posted any jobs yet. Create your first listing to start accepting applications from top students.</p>
                        <Link to="/company/post-job" className="btn-primary inline-flex items-center">
                            <PlusCircle className="w-5 h-5 mr-2" /> Create First Job
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDashboard;
