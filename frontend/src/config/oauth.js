/**
 * OAuth2 Configuration
 *
 * Fill in your OAuth2 Client IDs below.
 * Client IDs are public (safe to commit). Secrets are backend-only.
 *
 * Google:  https://console.cloud.google.com → APIs & Services → Credentials
 * GitHub:  https://github.com/settings/developers → OAuth Apps
 *
 * Set Callback URL to: http://localhost:5173/oauth2/callback
 */

const REDIRECT_URI = `${window.location.origin}/oauth2/callback`;

export const OAUTH_CONFIG = {
    google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        authUrl: 'https://accounts.google.com/login/auth/oauth2/auth',
        scope: 'openid email profile',
        redirectUri: REDIRECT_URI,
    },
    github: {
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
        authUrl: 'https://github.com/login/oauth/authorize',
        scope: 'read:user user:email',
        redirectUri: REDIRECT_URI,
    },
};

/**
 * Build the OAuth2 authorization URL and redirect the browser to it.
 * @param {('google'|'github')} provider
 */
export function redirectToOAuth(provider) {
    const config = OAUTH_CONFIG[provider];
    if (!config.clientId) {
        alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth2 is not configured.\nAdd VITE_${provider.toUpperCase()}_CLIENT_ID to your frontend .env file.`);
        return;
    }

    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: config.scope,
        // Add state for CSRF protection
        state: provider + '_' + Math.random().toString(36).substring(2),
    });

    // Store state in sessionStorage for verification in callback
    sessionStorage.setItem('oauth_state', params.get('state'));
    sessionStorage.setItem('oauth_provider', provider);

    window.location.href = `${config.authUrl}?${params.toString()}`;
}
