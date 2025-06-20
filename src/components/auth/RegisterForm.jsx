import { useState } from 'react';
import { register } from '../../services/authService';
import './RegisterForm.css';

const RegisterForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      errors.password = 'Password is too weak. Add numbers, symbols, and mixed case letters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return { text: 'Very Weak', className: 'very-weak' };
      case 2: return { text: 'Weak', className: 'weak' };
      case 3: return { text: 'Fair', className: 'fair' };
      case 4: return { text: 'Good', className: 'good' };
      case 5: return { text: 'Strong', className: 'strong' };
      default: return { text: '', className: '' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await register(formData);
      if (response.data.success) {
        // Store user data for UI purposes (token is in httpOnly cookie)
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        onSuccess?.(response.data);
      } else {
        onError?.(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed. Please try again.';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // const getRoleIcon = (role) => {
  //   switch (role) {
  //     case 'student': return '🎓';
  //     case 'instructor': return '👨‍🏫';
  //     case 'admin': return '👑';
  //     default: return '👤';
  //   }
  // };

  // const getRoleDescription = (role) => {
  //   switch (role) {
  //     case 'student': return 'Learn and take courses';
  //     case 'instructor': return 'Create and teach courses';
  //     case 'admin': return 'Manage the entire platform';
  //     default: return '';
  //   }
  // };

  const strengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <div className="register-form-container">
      <div className="form-header">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join our learning community</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">👤</span>
            <span className="label-text">Full Name</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${formErrors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {formData.name && (
              <div className="input-status">
                {formErrors.name ? '❌' : '✅'}
              </div>
            )}
          </div>
          {formErrors.name && (
            <span className="error-text">{formErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📧</span>
            <span className="label-text">Email Address</span>
          </label>
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${formErrors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {formData.email && (
              <div className="input-status">
                {formErrors.email ? '❌' : '✅'}
              </div>
            )}
          </div>
          {formErrors.email && (
            <span className="error-text">{formErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">🔒</span>
            <span className="label-text">Password</span>
          </label>
          <div className="input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${formErrors.password ? 'error' : ''}`}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {formData.password && (
            <div className="password-strength">
              <div className="strength-meter">
                <div 
                  className={`strength-fill strength-${strengthInfo.className}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <span className={`strength-text strength-${strengthInfo.className}`}>
                {strengthInfo.text}
              </span>
            </div>
          )}
          
          {formErrors.password && (
            <span className="error-text">{formErrors.password}</span>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Creating Account...
            </>
          ) : (
            <>
              <span className="btn-icon">🚀</span>
              Create Account
            </>
          )}
        </button>


      </form>
    </div>
  );
};

export default RegisterForm;