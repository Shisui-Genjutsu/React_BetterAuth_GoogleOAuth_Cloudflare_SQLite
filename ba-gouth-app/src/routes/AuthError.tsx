import { useSearchParams, Link } from 'react-router'

const AuthError = () => {
    const [searchParams] = useSearchParams()
    const error = searchParams.get('error')

    const getErrorMessage = (errorCode: string | null) => {
        switch (errorCode) {
            case 'unable_to_create_user':
                return {
                    title: 'Access Denied',
                    message: 'Your email is not authorized to access this application. Please contact the administrator to request access.'
                }
            case 'unauthorized_email':
                return {
                    title: 'Unauthorized Email',
                    message: 'Your email address is not on the approved list. Please contact support for assistance.'
                }
            default:
                return {
                    title: 'Authentication Error',
                    message: 'An error occurred during authentication. Please try again.'
                }
        }
    }

    const errorInfo = getErrorMessage(error)

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '500px',
                width: '100%',
                padding: '40px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ color: '#d32f2f', marginBottom: '16px' }}>
                    {errorInfo.title}
                </h1>
                <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>
                    {errorInfo.message}
                </p>
                <Link 
                    to="/"
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px'
                    }}
                >
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default AuthError