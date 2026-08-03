import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    setTempPassword('');
    
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      if (res.data.tempPassword) {
        setTempPassword(res.data.tempPassword);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset request. Please check the email.');
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
          <div className="w-16 h-16 bg-accentBlue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 transition-transform">
            <KeyRound className="w-8 h-8 text-accentBlue" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-2">Reset Password</h2>
          <p className="text-gray-400">Enter your email and we'll send you instructions to reset your password</p>
        </div>

        {message && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl mb-6 text-sm text-center flex flex-col items-center justify-center animate-fadeIn">
            <span className="font-semibold flex items-center mb-1"><CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" /> {message}</span>
            {tempPassword && (
              <span className="mt-2 block text-xs bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-500/30">
                Temporary Password: <strong className="text-white select-all">{tempPassword}</strong>
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center animate-fadeIn">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {!message && (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3.5 text-lg mt-2 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Send Reset Request"}
            </button>
          </form>
        )}

        <div className="text-center mt-8">
          <Link to="/login" className="text-gray-400 hover:text-white inline-flex items-center gap-1.5 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
