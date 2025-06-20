import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import GoogleOAuthButton from '../../components/auth/GoogleOAuthButton';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const Register = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisterSuccess = (data) => {
    setMessage('Registration successful! Redirecting to your dashboard...');
    setError('');
    
    // Store user data (session cookie is already set by backend)
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    setTimeout(() => {
      // Role-based redirect after registration
      switch (data.user?.role) {
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
    }, 2000);
  };

  const handleRegisterError = (errorMsg) => {
    setError(errorMsg);
    setMessage('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">


        <div className="auth-content">
          {message && <SuccessMessage message={message} />}
          {error && <ErrorMessage message={error} />}

          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onError={handleRegisterError}
          />

          <GoogleOAuthButton />

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/auth/login')}
                className="link-button"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;