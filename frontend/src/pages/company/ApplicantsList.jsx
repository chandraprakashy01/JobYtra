import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Users, CheckCircle } from 'lucide-react';

const ApplicantsList = () => {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then(res => setJob(res.data))
            .catch(err => console.log(err));
        
        api.get(`/company/applications/job/${id}`)
            .then(res => {
                setApplicants(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, [id]);

    const handleStatusChange = async (appId, newStatus, interviewDate) => {
        try {
            await api.put(`/company/applications/${appId}/status`, { status: newStatus, interviewDate });
            setApplicants(applicants.map(app => app.id === appId ? { ...app, status: newStatus, interviewDate } : app));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'shortlisted': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'selected': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-8 border-b border-gray-800 pb-6">
                <Link to="/company/dashboard" className="text-gray-400 hover:text-white mb-6 inline-flex items-center transition group font-medium text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                </Link>
                {job ? (
                    <div>
                        <h1 className="text-3xl font-heading font-bold mb-2">Applicants for <span className="text-accentBlue">{job.title}</span></h1>
                        <p className="text-gray-400 flex items-center"><Users className="w-4 h-4 mr-2"/> {applicants.length} Total Applicants</p>
                    </div>
                ) : (
                    <div className="h-10 w-3/4 skeleton rounded"></div>
                )}
            </div>

            <div className="table-container">
                <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                        <tr className="bg-darkNavy border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="p-4 font-medium">Student Reference</th>
                            <th className="p-4 font-medium">Applied Date</th>
                            <th className="p-4 font-medium">Current Status</th>
                            <th className="p-4 font-medium text-center">Manage Application</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td className="p-4"><div className="h-5 w-40 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-4 w-24 skeleton rounded"></div></td>
                                    <td className="p-4"><div className="h-6 w-24 skeleton rounded-full"></div></td>
                                    <td className="p-4"><div className="h-8 w-48 skeleton rounded mx-auto"></div></td>
                                </tr>
                            ))
                        ) : applicants.length > 0 ? (
                            applicants.map(app => (
                                <tr key={app.id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-mono text-sm font-medium bg-gray-800/80 inline-block px-3 py-1.5 rounded-md text-gray-300 border border-gray-700">
                                            ID: {app.studentId.substring(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300">{new Date(app.appliedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize inline-flex items-center ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                            {app.interviewDate && (
                                                <div className="text-xs font-medium text-gray-400 bg-gray-800/60 px-2.5 py-1 rounded-md border border-gray-700/50">
                                                    Interview: {new Date(app.interviewDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex flex-col gap-2 justify-center items-center max-w-[200px] mx-auto">
                                            <select 
                                                value={app.status} 
                                                onChange={(e) => handleStatusChange(app.id, e.target.value, app.interviewDate)}
                                                className="input-field !py-2 !px-3 text-sm w-full bg-gray-900 border-gray-700 shadow-inner"
                                            >
                                                <option value="applied">Applied (New)</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="selected">Selected</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            {app.status === 'shortlisted' && !app.interviewDate && (
                                                <input 
                                                    type="date"
                                                    className="input-field !py-2 !px-3 text-sm w-full bg-gray-900 border-gray-700 border-dashed"
                                                    onChange={(e) => handleStatusChange(app.id, app.status, new Date(e.target.value))}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-16 text-center text-gray-500">
                                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-gray-300">No applications received yet</p>
                                    <p className="text-sm mt-1 max-w-md mx-auto">When students apply for this position, they will appear here for review.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApplicantsList;
