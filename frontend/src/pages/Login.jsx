import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
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

        {/* ── Social Login Buttons ── */}
        <div className="flex flex-col gap-3 mb-7">
          <button
            id="btn-google-login"
            type="button"
            onClick={() => redirectToOAuth('google')}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 font-medium text-gray-200 group"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <button
            id="btn-github-login"
            type="button"
            onClick={() => redirectToOAuth('github')}
            className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 font-medium text-gray-200"
          >
            <GitHubIcon />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 mb-7">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">or continue with email</span>
          <div className="flex-1 h-px bg-gray-800"></div>
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

        {/* ── OAuth2 note ── */}
        <p className="text-center text-xs text-gray-600 mt-5">
          Google/GitHub sign-in creates a <span className="text-gray-500">Student</span> account automatically.
        </p>
        
        <p className="text-center mt-5 text-gray-400">
          Don't have an account? <Link to="/register" className="text-accentBlue hover:text-hoverBlue font-medium transition-colors ml-1">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
