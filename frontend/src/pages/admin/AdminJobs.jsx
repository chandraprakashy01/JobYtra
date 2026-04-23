import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/jobs/pending')
            .then(res => {
                setJobs(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/jobs/${id}/approve`);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (error) {
            alert('Failed to approve');
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold mb-8">Pending Jobs</h1>
            
            <div className="table-container">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-darkNavy border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Job Title</th>
                            <th className="p-4 font-medium">Company ID</th>
                            <th className="p-4 font-medium">Type / Location</th>
                            <th className="p-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="p-4"><div className="h-5 w-40 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-24 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-32 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-8 w-24 skeleton rounded ml-auto"></div></td>
                                </tr>
                            ))
                        ) : jobs.length > 0 ? (
                            jobs.map(job => (
                                <tr key={job.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white mb-1">{job.title}</div>
                                        <Link to={`/jobs/${job.id}`} className="text-accentBlue hover:text-hoverBlue transition-colors text-xs flex items-center">
                                            View Details <ArrowRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </td>
                                    <td className="p-4 text-gray-400 font-mono text-sm">{job.companyId.substring(0,8)}...</td>
                                    <td className="p-4 text-gray-300 capitalize">
                                        <span className="bg-gray-800 px-2.5 py-1 rounded-md text-xs mr-2">{job.type}</span>
                                        {job.location}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleApprove(job.id)} className="btn-primary flex items-center ml-auto !py-1.5 !px-3 text-sm hover:shadow-green-500/20 hover:bg-green-600 hover:border-green-600">
                                            <CheckCircle className="w-4 h-4 mr-1.5"/> Approve
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-gray-500">
                                    <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-gray-400">No pending jobs to approve</p>
                                    <p className="text-sm mt-1">All job postings are currently up to date.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminJobs;
