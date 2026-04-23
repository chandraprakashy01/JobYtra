import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

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
