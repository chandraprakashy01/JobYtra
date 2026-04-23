import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Briefcase, Building2, Calendar, IndianRupee, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';

const PostJob = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', salary: '', location: '', type: 'full-time', deadline: '',
        minCgpa: '', branches: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                title: formData.title,
                description: formData.description,
                salary: formData.salary,
                location: formData.location,
                type: formData.type,
                deadline: new Date(formData.deadline),
                eligibility: {
                    minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : null,
                    branches: formData.branches ? formData.branches.split(',').map(s=>s.trim()) : []
                }
            };
            const res = await api.post('/company/jobs/create', data);
            setMessage(res.data.message);
            setTimeout(() => navigate('/company/dashboard'), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to post job');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-6 transition group font-medium text-sm">
                <ArrowLeft className="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" /> Back to Dashboard
            </button>
            
            <div className="mb-10">
                <h1 className="text-4xl font-heading font-bold mb-3 flex items-center">
                    <Briefcase className="w-8 h-8 mr-3 text-accentBlue" /> Post New Job
                </h1>
                <p className="text-gray-400 text-lg">Create a new opportunity for students. Your posting will be reviewed by administrators before becoming public.</p>
            </div>
            
            {message && (
                <div className={`p-4 rounded-xl mb-8 flex items-center font-medium shadow-sm animate-slideUp ${message.toLowerCase().includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                    {message.toLowerCase().includes('success') ? <CheckCircle className="w-5 h-5 mr-3" /> : <div className="w-5 h-5 rounded-full bg-red-400 mr-3 flex items-center justify-center text-darkNavy font-bold text-xs">!</div>}
                    {message}
                </div>
            )}

            <div className="card shadow-lg shadow-black/20 border-t-4 border-t-accentBlue p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div>
                        <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800 text-white flex items-center">
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
                                <input type="text" name="title" className="input-field text-lg" placeholder="e.g. Frontend Developer Intern" onChange={handleChange} required />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><Briefcase className="w-4 h-4 mr-1.5 text-gray-500"/> Job Type *</label>
                                <div className="relative">
                                    <select name="type" className="input-field appearance-none" onChange={handleChange}>
                                        <option value="full-time">Full-Time</option>
                                        <option value="internship">Internship</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-gray-500"/> Location *</label>
                                <input type="text" name="location" placeholder="e.g. Bangalore, Remote" className="input-field" onChange={handleChange} required />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><IndianRupee className="w-4 h-4 mr-1.5 text-gray-500"/> Salary / Stipend *</label>
                                <input type="text" name="salary" placeholder="e.g. 12 LPA or 30k/month" className="input-field" onChange={handleChange} required />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-gray-500"/> Application Deadline *</label>
                                <input type="date" name="deadline" className="input-field" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800 text-white">
                            Job Description
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Description & Responsibilities *</label>
                            <textarea 
                                name="description" 
                                rows="6" 
                                placeholder="Describe the role, responsibilities, and what you are looking for..."
                                className="input-field resize-y" 
                                onChange={handleChange} 
                                required
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-2 text-right">Markdown formatting is not currently supported.</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-800 text-white">
                            Eligibility Requirements <span className="text-gray-500 font-normal text-sm ml-2">(Optional)</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Minimum CGPA</label>
                                <input type="number" step="0.01" min="0" max="10" name="minCgpa" placeholder="e.g. 7.5" className="input-field" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Eligible Branches</label>
                                <input type="text" name="branches" placeholder="e.g. CSE, IT, ECE" className="input-field" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-gray-800 flex justify-end">
                        <button type="button" onClick={() => navigate('/company/dashboard')} className="btn-secondary mr-4 px-8">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="btn-primary py-3 px-10 text-lg shadow-lg shadow-accentBlue/20 flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : 'Submit for Approval'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
