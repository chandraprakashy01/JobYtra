import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [jobsMap, setJobsMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const appRes = await api.get('/applications/mine');
                setApplications(appRes.data);
                
                // Fetch job details for each application
                const jobIds = [...new Set(appRes.data.map(app => app.jobId))];
                const jobPromises = jobIds.map(id => api.get(`/jobs/${id}`).catch(() => null));
                const jobResponses = await Promise.all(jobPromises);
                
                const map = {};
                jobResponses.forEach(res => {
                    if (res && res.data) {
                        map[res.data.id] = res.data;
                    }
                });
                setJobsMap(map);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'applied': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'shortlisted': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'selected': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold mb-8">My Applications</h1>
            
            <div className="table-container">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-darkNavy border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Job Role</th>
                            <th className="p-4 font-medium">Applied Date</th>
                            <th className="p-4 font-medium">Interview Date</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {isLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="p-4"><div className="h-5 w-48 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-24 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-32 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-6 w-24 skeleton rounded-full"></div></td>
                                    <td className="p-4"><div className="h-4 w-20 skeleton rounded ml-auto"></div></td>
                                </tr>
                            ))
                        ) : applications.length > 0 ? (
                            applications.map(app => {
                                const job = jobsMap[app.jobId];
                                return (
                                    <tr key={app.id} className="hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-white mb-1">{job ? job.title : <span className="text-gray-500 italic">Job Unavailable</span>}</div>
                                            {job && <div className="text-xs text-gray-400 font-mono capitalize">{job.type}</div>}
                                        </td>
                                        <td className="p-4 text-gray-300">{new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                        <td className="p-4 text-gray-300 font-medium">
                                            {app.interviewDate ? (
                                                <span className="text-accentBlue bg-accentBlue/10 px-2 py-1 rounded-md">
                                                    {new Date(app.interviewDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">TBD</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize inline-flex items-center ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link to={`/jobs/${app.jobId}`} className="text-accentBlue hover:text-hoverBlue transition-colors text-sm font-medium inline-flex items-center group">
                                                View Details <ArrowRight className="w-3.5 h-3.5 ml-1 transform transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-16 text-center text-gray-500">
                                    <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-gray-300">No applications found</p>
                                    <p className="text-sm mt-2 mb-6 max-w-md mx-auto">You haven't applied to any positions yet. Start exploring opportunities to launch your career.</p>
                                    <Link to="/jobs" className="btn-primary inline-flex items-center">
                                        Browse Jobs <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentApplications;
