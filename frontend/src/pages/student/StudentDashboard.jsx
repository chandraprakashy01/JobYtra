import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { FileText, Award, Calendar, Briefcase, MapPin, IndianRupee } from 'lucide-react';

const StudentDashboard = () => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [profile, setProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);

    useEffect(() => {
        api.get('/student/profile')
            .then(res => {
                setProfile(res.data);
                setIsLoadingProfile(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoadingProfile(false);
            });
            
        api.get('/jobs/recommended')
            .then(res => {
                setRecommendedJobs(res.data);
                setIsLoadingJobs(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoadingJobs(false);
            });
    }, []);

    const completionPercentage = profile ? 
        (Object.values(profile).filter(v => v !== null && v !== '').length / Object.keys(profile).length) * 100 
        : 0;

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {isLoadingProfile ? (
                    <>
                        <div className="card h-40 skeleton rounded-xl"></div>
                        <div className="card h-40 skeleton rounded-xl"></div>
                        <div className="card h-40 skeleton rounded-xl"></div>
                    </>
                ) : (
                    <>
                        <div className="card bg-gradient-to-br from-lightNavy to-[#1a2542] border-accentBlue/20 hover:border-accentBlue/50 transition-colors">
                            <h3 className="text-lg font-medium text-gray-400 mb-2">Profile Completion</h3>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-4xl font-bold text-white">{completionPercentage.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-darkNavy rounded-full h-2 mb-4">
                                <div className="bg-accentBlue h-2 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-1000 ease-out" style={{ width: `${completionPercentage}%` }}></div>
                            </div>
                            <Link to="/student/profile" className="text-accentBlue hover:text-hoverBlue text-sm inline-flex items-center font-medium group">
                                Complete your profile <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                        
                        <div className="card md:col-span-2 bg-gradient-to-br from-lightNavy to-[#1a2542] border-gray-800/50">
                            <h3 className="text-lg font-medium text-gray-400 mb-4">Verification Status</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                <div className="flex items-center gap-4 bg-darkNavy/50 py-3 px-5 rounded-xl border border-gray-800">
                                    <div className={`relative flex h-5 w-5`}>
                                        {profile?.isApproved && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-5 w-5 ${profile?.isApproved ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]'}`}></span>
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-wide">{profile?.isApproved ? 'Approved & Ready' : 'Pending Verification'}</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                                    {profile?.isApproved 
                                        ? "Your account is verified. You can now browse and apply for all available job opportunities."
                                        : "Our team is reviewing your profile. You'll be notified once you are approved to apply for jobs."}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold flex items-center"><Award className="mr-3 text-accentBlue w-6 h-6" /> Recommended for You</h2>
                <Link to="/jobs" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">View all jobs →</Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoadingJobs ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="card h-48 skeleton rounded-xl"></div>
                    ))
                ) : recommendedJobs.length > 0 ? (
                    recommendedJobs.map(job => (
                        <div key={job.id} className="card border-gray-800/60 hover:border-accentBlue/40 transition-colors group flex flex-col bg-gradient-to-b from-lightNavy/50 to-transparent">
                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-accentBlue transition-colors">{job.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-accentBlue mb-4 font-medium capitalize">
                                <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5"/> {job.type}</span>
                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5"/> {job.location}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">{job.description}</p>
                            <div className="flex justify-between items-center mt-auto border-t border-gray-800/80 pt-4">
                                <span className="text-xs font-semibold px-3 py-1.5 bg-green-500/10 text-green-400 rounded-md border border-green-500/20 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span> High Match
                                </span>
                                <Link to={`/jobs/${job.id}`} className="btn-secondary text-sm px-4 py-1.5 bg-gray-800 hover:bg-gray-700">View Details</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 bg-lightNavy/30 border border-gray-800 border-dashed rounded-2xl">
                        <Award className="w-12 h-12 text-gray-600 mb-4 opacity-50" />
                        <p className="text-lg font-medium text-gray-300 mb-2">No recommendations yet</p>
                        <p className="text-gray-500 text-center max-w-md">
                            Complete your profile with your skills and CGPA to start receiving personalized job recommendations.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
