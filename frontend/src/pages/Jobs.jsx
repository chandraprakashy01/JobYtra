import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Briefcase, MapPin, IndianRupee } from 'lucide-react';

// Helper: derive logo URL from company website domain
const getCompanyLogoUrl = (website, companyName) => {
    if (website) {
        try {
            const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
            return `https://logo.clearbit.com/${domain}`;
        } catch (_) {}
    }
    return null;
};

// Fallback avatar with initials
const CompanyAvatar = ({ name, logoUrl, size = 'md' }) => {
    const [imgError, setImgError] = React.useState(false);
    const initials = name
        ? name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : '??';

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-xl',
    };

    const colors = [
        'from-blue-500 to-indigo-600',
        'from-purple-500 to-pink-600',
        'from-teal-500 to-cyan-600',
        'from-orange-500 to-red-600',
        'from-green-500 to-emerald-600',
    ];
    const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

    if (logoUrl && !imgError) {
        return (
            <img
                src={logoUrl}
                alt={name}
                onError={() => setImgError(true)}
                className={`${sizeClasses[size]} rounded-xl object-contain bg-white p-1 border border-gray-700/50 shadow-sm flex-shrink-0`}
            />
        );
    }

    return (
        <div
            className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center font-bold text-white flex-shrink-0 shadow-sm`}
        >
            {initials}
        </div>
    );
};

export { CompanyAvatar, getCompanyLogoUrl };

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
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
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
                        placeholder="Search titles, companies or locations..." 
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
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 skeleton rounded-xl flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="h-5 w-3/4 skeleton rounded mb-2"></div>
                                    <div className="h-4 w-1/2 skeleton rounded"></div>
                                </div>
                            </div>
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
                    filteredJobs.map((job, idx) => {
                        const logoUrl = getCompanyLogoUrl(job.companyWebsite, job.companyName);
                        return (
                            <div key={job.id} className={`card flex flex-col relative overflow-hidden group border-gray-800/60 bg-gradient-to-b from-lightNavy to-[#0f1629] animate-slideUp animate-stagger-${(idx % 3) + 1}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-accentBlue/5 rounded-bl-full -z-10 group-hover:scale-125 group-hover:bg-accentBlue/10 transition-all duration-500"></div>
                                
                                {/* Company header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <CompanyAvatar name={job.companyName} logoUrl={logoUrl} size="md" />
                                    <div className="min-w-0">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">Company</p>
                                        <p className="text-sm font-semibold text-gray-300 truncate">{job.companyName || 'Company'}</p>
                                    </div>
                                </div>

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
                        );
                    })
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
