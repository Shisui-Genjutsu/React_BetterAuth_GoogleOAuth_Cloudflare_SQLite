import { useEffect, useState } from 'react'
import { signIn } from '../lib/auth-client'
import './SignIn.css'

const SignIn = () => {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Check for error in URL
        const params = new URLSearchParams(window.location.search)
        const errorParam = params.get('error')

        if (errorParam === 'unable_to_create_user') {
            setError('Your email is not authorized to access this application. Please contact the administrator.')
            // Clear the error from URL
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [])

    const handleSignIn = async () => {
        setIsLoading(true)
        try {
            await signIn()
        } catch (err) {
            setIsLoading(false)
            setError('An error occurred during sign in. Please try again.')
        }
    }

    return (
        <div className="signin-container">
            <div className="signin-card">
                <div className="signin-header">
                    <div className="logo-circle">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 8C13.4 8 8 13.4 8 20C8 26.6 13.4 32 20 32C26.6 32 32 26.6 32 20C32 13.4 26.6 8 20 8ZM18 26L12 20L13.4 18.6L18 23.2L26.6 14.6L28 16L18 26Z" fill="url(#gradient)" />
                            <defs>
                                <linearGradient id="gradient" x1="8" y1="8" x2="32" y2="32">
                                    <stop offset="0%" stopColor="#667eea" />
                                    <stop offset="100%" stopColor="#764ba2" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1 className="signin-title">Welcome Back</h1>
                    <p className="signin-subtitle">Sign in to continue to your account</p>
                </div>

                {error && (
                    <div className="error-alert">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <button
                    className={`google-signin-btn ${isLoading ? 'loading' : ''}`}
                    onClick={handleSignIn}
                    disabled={isLoading}
                >
                    {!isLoading && (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4" />
                            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853" />
                            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05" />
                            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335" />
                        </svg>
                    )}
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        <span>Continue with Google</span>
                    )}
                </button>

                <div className="signin-footer">
                    <p>Secure authentication powered by Better Auth</p>
                </div>
            </div>
        </div>
    )
}

export default SignIn