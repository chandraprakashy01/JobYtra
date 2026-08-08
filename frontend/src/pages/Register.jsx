import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { redirectToOAuth } from '../config/oauth';

// Google Icon SVG
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

// GitHub Icon SVG
const GitHubIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
    </svg>
);

const Register = () => {
    const [role, setRole] = useState('student');
    const { registerStudent, registerCompany } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', 
        branch: 'CSE', cgpa: '', skills: '', batch: '', collegeId: '',
        website: '', about: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (role === 'student') {
                const data = {
                    ...formData,
                    cgpa: parseFloat(formData.cgpa),
                    skills: formData.skills.split(',').map(s => s.trim())
                };
                await registerStudent(data);
                alert("Student registered successfully! Wait for Admin approval.");
                navigate('/login');
            } else {
                await registerCompany(formData);
                alert("Company registered successfully! Wait for Admin approval.");
                navigate('/login');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accentBlue/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="card w-full max-w-2xl animate-fadeIn relative z-10 border-gray-800/60 bg-lightNavy/90 backdrop-blur-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-accentBlue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 transition-transform hover:-rotate-3">
                        <UserPlus className="w-8 h-8 text-accentBlue" />
                    </div>
                    <h2 className="text-3xl font-bold font-heading mb-2">Create Account</h2>
                    <p className="text-gray-400">Join the placement portal today</p>
                </div>
                
                <div className="flex justify-center mb-10">
                    <div className="bg-darkNavy p-1.5 rounded-xl flex border border-gray-800 shadow-inner">
                        <button 
                            type="button"
                            className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-300 ${role === 'student' ? 'bg-accentBlue text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            onClick={() => setRole('student')}
                        >
                            Student
                        </button>
                        <button 
                            type="button"
                            className={`px-8 py-2.5 rounded-lg font-medium transition-all duration-300 ${role === 'company' ? 'bg-accentBlue text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                            onClick={() => setRole('company')}
                        >
                            Company
                        </button>
                    </div>
                </div>

                {role === 'student' && (
                    <>
                        {/* ── Social Register Buttons ── */}
                        <div className="flex flex-col gap-3 mb-7">
                            <button
                                type="button"
                                onClick={() => redirectToOAuth('google')}
                                className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 font-medium text-gray-200 group"
                            >
                                <GoogleIcon />
                                <span>Register with Google</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => redirectToOAuth('github')}
                                className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 font-medium text-gray-200"
                            >
                                <GitHubIcon />
                                <span>Register with GitHub</span>
                            </button>
                        </div>

                        {/* ── Divider ── */}
                        <div className="flex items-center gap-4 mb-7">
                            <div className="flex-1 h-px bg-gray-800"></div>
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">or register with email</span>
                            <div className="flex-1 h-px bg-gray-800"></div>
                        </div>
                    </>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 animate-slideUp">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="md:col-span-2">
                            <label className="label-text">Full Name / Company Name</label>
                            <input type="text" name="name" className="input-field" onChange={handleChange} required placeholder="Enter name" />
                        </div>
                        <div>
                            <label className="label-text">Email Address</label>
                            <input type="email" name="email" className="input-field" onChange={handleChange} required placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="label-text">Password</label>
                            <input type="password" name="password" className="input-field" onChange={handleChange} required placeholder="••••••••" />
                        </div>

                        {role === 'student' && (
                            <>
                                <div>
                                    <label className="label-text">Branch</label>
                                    <select name="branch" className="input-field cursor-pointer" onChange={handleChange}>
                                        <option value="CSE">Computer Science (CSE)</option>
                                        <option value="IT">Information Technology (IT)</option>
                                        <option value="ECE">Electronics (ECE)</option>
                                        <option value="ME">Mechanical (ME)</option>
                                        <option value="CE">Civil (CE)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label-text">CGPA</label>
                                    <input type="number" step="0.01" name="cgpa" className="input-field" onChange={handleChange} required placeholder="e.g. 8.5" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label-text">Skills</label>
                                    <input type="text" name="skills" placeholder="Java, React, MongoDB (comma separated)" className="input-field" onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="label-text">Batch</label>
                                    <input type="text" name="batch" placeholder="e.g. 2023-2027" className="input-field" onChange={handleChange} required />
                                </div>
                                <div>
                                    <label className="label-text">College ID</label>
                                    <input type="text" name="collegeId" className="input-field" onChange={handleChange} required placeholder="Roll Number / ID" />
                                </div>
                            </>
                        )}

                        {role === 'company' && (
                            <>
                                <div>
                                    <label className="label-text">Website URL</label>
                                    <input type="url" name="website" className="input-field" onChange={handleChange} placeholder="https://example.com" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label-text">About Company</label>
                                    <textarea name="about" rows="4" className="input-field resize-none" onChange={handleChange} placeholder="Tell us about your company..."></textarea>
                                </div>
                            </>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary w-full py-4 mt-8 text-lg flex justify-center items-center shadow-lg shadow-accentBlue/20"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : `Register as ${role === 'student' ? 'Student' : 'Company'}`}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-400">
                    Already have an account? <Link to="/login" className="text-accentBlue hover:text-hoverBlue font-medium transition-colors ml-1">Sign in here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
