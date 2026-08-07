import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { OAUTH_CONFIG } from '../config/oauth';

/**
 * OAuthCallback — handles the redirect from Google/GitHub after user consents.
 *
 * URL shape: /oauth2/callback?code=xxx&state=yyy
 * 1. Reads `code` and `state` from URL params
 * 2. Verifies state matches what we stored (CSRF protection)
 * 3. POSTs code to backend /api/auth/oauth2/{provider}
 * 4. Stores JWT and navigates to student dashboard
 */
const OAuthCallback = () => {
    const [status, setStatus] = useState('Completing sign-in...');
    const [error, setError] = useState('');
    const { loginWithToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        const errorParam = params.get('error');

        // Handle provider-side errors (e.g. user denied access)
        if (errorParam) {
            setError(`Sign-in was cancelled or denied: ${errorParam}`);
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (!code) {
            setError('No authorization code received from provider.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        // Verify CSRF state
        const savedState = sessionStorage.getItem('oauth_state');
        const provider = sessionStorage.getItem('oauth_provider');
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_provider');

        if (!provider || (savedState && state && savedState !== state)) {
            setError('Security check failed. Please try signing in again.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        if (!provider) {
            setError('Unknown OAuth provider. Please try again.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }

        const config = OAUTH_CONFIG[provider];
        setStatus(`Signing you in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);

        // Exchange code for JWT via backend
        fetch(`https://jobytra.onrender.com/api/auth/oauth2/${provider}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri: config.redirectUri }),
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Sign-in failed');
                }
                return data;
            })
            .then(data => {
                loginWithToken(data);
                setStatus('Success! Redirecting to your dashboard...');
                // Always redirect to student dashboard for OAuth2 users
                setTimeout(() => navigate('/student/dashboard'), 800);
            })
            .catch(err => {
                setError(err.message || 'Something went wrong during sign-in.');
                setTimeout(() => navigate('/login'), 3500);
            });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accentBlue/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>

            <div className="card w-full max-w-sm text-center animate-fadeIn border-gray-800/60 bg-lightNavy/80 backdrop-blur-xl py-12">
                {error ? (
                    <>
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">Sign-in Failed</h2>
                        <p className="text-red-400 text-sm mb-4">{error}</p>
                        <p className="text-gray-500 text-xs">Redirecting to login page...</p>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-accentBlue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="animate-spin w-8 h-8 text-accentBlue" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-3">Authenticating</h2>
                        <p className="text-gray-400 text-sm">{status}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;
