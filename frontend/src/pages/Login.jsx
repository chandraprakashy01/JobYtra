import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      const role = data.role.replace('ROLE_', '').toLowerCase();
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accentBlue/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>

      <div className="card w-full max-w-md animate-fadeIn relative z-10 border-gray-800/60 bg-lightNavy/80 backdrop-blur-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accentBlue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 transition-transform hover:rotate-6">
            <LogIn className="w-8 h-8 text-accentBlue" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2">Welcome Back</h2>
          <p className="text-gray-400">Login to your Student, Company, or Admin dashboard</p>
        </div>


        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center animate-fadeIn">
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="label-text">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                id="login-email"
                className="input-field" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label-text mb-0">Password</label>
              <Link to="/forgot-password" className="text-sm text-accentBlue hover:text-hoverBlue transition-colors">Forgot password?</Link>
            </div>
            <div className="relative">
              <input 
                type="password" 
                id="login-password"
                className="input-field" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            id="btn-email-login"
            className="btn-primary w-full py-3.5 text-lg mt-2 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Sign In"}
          </button>
        </form>


        <p className="text-center mt-5 text-gray-400">
          Don't have an account? <Link to="/register" className="text-accentBlue hover:text-hoverBlue font-medium transition-colors ml-1">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
