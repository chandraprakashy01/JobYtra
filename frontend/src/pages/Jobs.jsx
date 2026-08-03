import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Briefcase, MapPin, IndianRupee } from 'lucide-react';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/jobs')
            .then(res => {
                setJobs(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fadeIn">
                <div>
                    <h1 className="text-4xl font-heading font-bold mb-3">Explore Opportunities</h1>
                    <p className="text-gray-400 text-lg">Find your next internship or full-time position.</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Search titles or locations..." 
                        className="input-field w-full md:w-80 shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    // Skeletons
                    Array(6).fill(0).map((_, idx) => (
                        <div key={idx} className="card flex flex-col relative overflow-hidden">
                            <div className="h-7 w-3/4 skeleton rounded mb-3"></div>
                            <div className="h-5 w-1/2 skeleton rounded mb-5"></div>
                            <div className="space-y-2 mb-8 flex-grow">
                                <div className="h-4 w-full skeleton rounded"></div>
                                <div className="h-4 w-full skeleton rounded"></div>
                                <div className="h-4 w-2/3 skeleton rounded"></div>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-800 pt-5">
                                <div>
                                    <div className="h-3 w-10 skeleton rounded mb-2"></div>
                                    <div className="h-5 w-20 skeleton rounded"></div>
                                </div>
                                <div className="h-10 w-28 skeleton rounded-xl"></div>
                            </div>
                        </div>
                    ))
                ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job, idx) => (
                        <div key={job.id} className={`card flex flex-col relative overflow-hidden group border-gray-800/60 bg-gradient-to-b from-lightNavy to-[#0f1629] animate-slideUp animate-stagger-${(idx % 3) + 1}`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accentBlue/5 rounded-bl-full -z-10 group-hover:scale-125 group-hover:bg-accentBlue/10 transition-all duration-500"></div>
                            
                            <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-accentBlue transition-colors">{job.title}</h3>
                            
                            <div className="flex flex-wrap items-center text-accentBlue mb-5 font-medium text-sm capitalize gap-x-4 gap-y-2">
                                <span className="flex items-center"><Briefcase className="w-4 h-4 mr-1.5"/> {job.type}</span>
                                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5"/> {job.location}</span>
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-8 flex-grow line-clamp-3 leading-relaxed">{job.description}</p>
                            
                            <div className="flex justify-between items-center mt-auto border-t border-gray-800/80 pt-5">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Salary</p>
                                    <p className="font-semibold text-gray-200 flex items-center"><IndianRupee className="w-4 h-4 mr-1 text-gray-400"/> {job.salary}</p>
                                </div>
                                <Link to={`/jobs/${job.id}`} className="btn-secondary text-sm px-5 group-hover:border-accentBlue/50 group-hover:bg-gray-800 transition-colors">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-lightNavy/30 rounded-2xl border border-gray-800 border-dashed animate-fadeIn">
                        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
                            <Search className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-heading font-bold text-gray-300 mb-2">No jobs found</h3>
                        <p className="text-gray-500 max-w-md text-center">We couldn't find any opportunities matching "{searchTerm}". Try adjusting your search filters.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-6 text-accentBlue hover:text-hoverBlue font-medium transition-colors">
                            Clear search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
