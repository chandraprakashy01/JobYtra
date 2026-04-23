import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UploadCloud, CheckCircle, FileText, User } from 'lucide-react';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [skillsInput, setSkillsInput] = useState('');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        api.get('/student/profile')
            .then(res => {
                setProfile(res.data);
                setSkillsInput(res.data.skills.join(', '));
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        setProfile({...profile, [e.target.name]: e.target.value});
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const data = {
                ...profile,
                cgpa: parseFloat(profile.cgpa),
                skills: skillsInput.split(',').map(s => s.trim())
            };
            await api.put('/student/profile', data);
            setMessage('Profile updated successfully');
        } catch (error) {
            setMessage('Failed to update profile');
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/student/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(res.data);
            setMessage('Resume uploaded successfully');
            setFile(null);
        } catch (error) {
            setMessage('Failed to upload resume');
        } finally {
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto animate-fadeIn">
                <div className="h-8 w-48 skeleton rounded mb-8"></div>
                <div className="card mb-8 h-48 skeleton rounded-xl"></div>
                <div className="card h-[500px] skeleton rounded-xl"></div>
            </div>
        );
    }

    if (!profile) return <div className="text-center py-12 text-gray-500">Failed to load profile data.</div>;

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-3xl font-heading font-bold mb-8">My Profile</h1>
            
            {message && (
                <div className={`p-4 rounded-xl mb-6 flex items-center shadow-sm animate-slideUp ${message.toLowerCase().includes('success') ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">{message}</span>
                </div>
            )}

            <div className="card mb-8 border-t-4 border-t-accentBlue shadow-lg shadow-black/10">
                <h3 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4 flex items-center text-white">
                    <FileText className="w-5 h-5 mr-2 text-accentBlue" /> Resume Upload
                </h3>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-grow w-full">
                        <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${file ? 'border-accentBlue bg-accentBlue/5' : 'border-gray-700 bg-darkNavy/50 hover:border-accentBlue/50 hover:bg-darkNavy'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className={`w-10 h-10 mb-3 ${file ? 'text-accentBlue' : 'text-gray-500'}`} />
                                <p className="text-sm text-gray-400">
                                    <span className="font-semibold text-accentBlue">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs mt-2 font-medium bg-gray-800 px-3 py-1 rounded-full text-gray-300">
                                    {file ? file.name : "PDF up to 5MB"}
                                </p>
                            </div>
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        </label>
                    </div>
                    <button 
                        onClick={handleUpload} 
                        disabled={!file} 
                        className="btn-primary py-3.5 px-8 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accentBlue/20"
                    >
                        Upload Resume
                    </button>
                </div>
                {profile.resumeUrl && (
                    <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800 flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mr-4">
                                <FileText className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Current Resume</p>
                                <p className="text-xs text-gray-500">Available for recruiters</p>
                            </div>
                        </div>
                        <a href={`http://localhost:8080${profile.resumeUrl}`} target="_blank" rel="noreferrer" className="btn-secondary !py-2 !px-4 text-sm font-medium">
                            View PDF
                        </a>
                    </div>
                )}
            </div>

            <div className="card shadow-lg shadow-black/10">
                <h3 className="text-xl font-bold mb-6 border-b border-gray-800 pb-4 flex items-center text-white">
                    <User className="w-5 h-5 mr-2 text-accentBlue" /> Update Details
                </h3>
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <input type="text" className="input-field bg-gray-900/80 cursor-not-allowed text-gray-400 border-gray-800" value={profile.name} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                            <input type="email" className="input-field bg-gray-900/80 cursor-not-allowed text-gray-400 border-gray-800" value={profile.email} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Academic Branch</label>
                            <select name="branch" className="input-field shadow-inner" value={profile.branch} onChange={handleChange}>
                                <option value="CSE">Computer Science (CSE)</option>
                                <option value="IT">Information Technology (IT)</option>
                                <option value="ECE">Electronics (ECE)</option>
                                <option value="ME">Mechanical (ME)</option>
                                <option value="CE">Civil Engineering (CE)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current CGPA</label>
                            <input type="number" step="0.01" name="cgpa" className="input-field shadow-inner font-mono" value={profile.cgpa} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Technical Skills <span className="text-gray-500 font-normal">(Comma separated)</span></label>
                            <input 
                                type="text" 
                                className="input-field shadow-inner" 
                                placeholder="e.g. React, Java, Spring Boot, MongoDB"
                                value={skillsInput} 
                                onChange={(e) => setSkillsInput(e.target.value)} 
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end border-t border-gray-800">
                        <button type="submit" disabled={isSaving} className="btn-primary py-3 px-8 shadow-lg shadow-accentBlue/20 w-full md:w-auto">
                            {isSaving ? 'Saving Changes...' : 'Save Profile Details'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentProfile;
