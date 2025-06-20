import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const GoogleCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Check for error in URL params first
        const errorParam = searchParams.get('error');
        
        if (errorParam) {
          let errorMessage = 'Google authentication failed';
          
          switch (errorParam) {
            case 'oauth_failed':
              errorMessage = 'Google OAuth authentication failed. Please try again.';
              break;
            case 'login_failed':
              errorMessage = 'Failed to complete login after Google authentication.';
              break;
            case 'processing_error':
              errorMessage = 'Error processing Google authentication.';
              break;
            case 'access_denied':
              errorMessage = 'Access denied. Please grant necessary permissions.';
              break;
            default:
              errorMessage = 'Google authentication failed. Please try again.';
          }
          
          setError(errorMessage);
          setLoading(false);
          
          // Redirect to login after showing error
          setTimeout(() => {
            navigate('/auth/login', { replace: true });
          }, 5000);
          
          return;
        }

        // Check for success parameter
        const successParam = searchParams.get('success');
        
        if (successParam === 'true') {
          // Google OAuth was successful, now get user data
          try {
            const response = await getCurrentUser();
            const user = response.data.user;
            
            if (user) {
              // Store user data (session cookie is already set by backend)
              localStorage.setItem('user', JSON.stringify(user));
              
              // Show success message briefly
              setLoading(false);
              
              // Role-based redirect after short delay
              setTimeout(() => {
                switch (user.role) {
                  case 'admin':
                    navigate('/dashboard/admin', { replace: true });
                    break;
                  case 'instructor':
                    navigate('/dashboard/instructor', { replace: true });
                    break;
                  case 'student':
                  default:
                    navigate('/dashboard/student', { replace: true });
                    break;
                }
              }, 1500);
            } else {
              throw new Error('User data not found');
            }
          } catch (authError) {
            console.error('Auth error:', authError);
            setError('Authentication completed but failed to get user data. Please try logging in again.');
            setLoading(false);
            
            setTimeout(() => {
              navigate('/auth/login', { replace: true });
            }, 5000);
          }
        } else {
          // No success parameter, might still be processing
          // Wait a bit longer for backend to complete OAuth flow
          setTimeout(async () => {
            try {
              const response = await getCurrentUser();
              const user = response.data.user;
              
              if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                setLoading(false);
                
                setTimeout(() => {
                  switch (user.role) {
                    case 'admin':
                      navigate('/dashboard/admin', { replace: true });
                      break;
                    case 'instructor':
                      navigate('/dashboard/instructor', { replace: true });
                      break;
                    case 'student':
                    default:
                      navigate('/dashboard/student', { replace: true });
                      break;
                  }
                }, 1500);
              } else {
                throw new Error('Authentication not completed');
              }
            } catch (delayedError) {
              setError('Google authentication is taking longer than expected. Please try logging in manually.');
              setLoading(false);
              
              setTimeout(() => {
                navigate('/auth/login', { replace: true });
              }, 5000);
            }
          }, 2000);
        }
        
      } catch (error) {
        console.error('Callback error:', error);
        setError('An unexpected error occurred during authentication.');
        setLoading(false);
        
        setTimeout(() => {
          navigate('/auth/login', { replace: true });
        }, 5000);
      }
    };

    // Start the callback handling process
    handleGoogleCallback();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>🔄 Processing Authentication</h1>
          </div>
          <div className="auth-content">
            <LoadingSpinner message="Completing Google sign-in..." />
            <div className="callback-info">
              <p>We're securely processing your Google authentication.</p>
              <p>This should only take a moment...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!error) {
    // Success state
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <h1>✅ Welcome</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>❌ Authentication Error</h1>
        </div>
        
        <div className="auth-content">
          <ErrorMessage message={error} />
          <div className="error-actions">
            <p>You will be redirected to the login page in a few seconds.</p>
            <button 
              onClick={() => navigate('/auth/login', { replace: true })}
              className="btn btn-primary"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;