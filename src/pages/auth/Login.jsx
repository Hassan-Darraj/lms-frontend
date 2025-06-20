import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import GoogleOAuthButton from "../../components/auth/GoogleOAuthButton";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";

const Login = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state (for protected route redirects)
  const from = location.state?.from?.pathname || null;

  const handleLoginSuccess = (data) => {
    setMessage("Login successful! Redirecting...");
    setError("");

    // Store user data (session cookie is already set by backend)
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    setTimeout(() => {
      // Redirect to intended page or role-based dashboard
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Role-based redirect
        switch (data.user?.role) {
          case "admin":
            navigate("/dashboard/admin", { replace: true });
            break;
          case "instructor":
            navigate("/dashboard/instructor", { replace: true });
            break;
          case "student":
          default:
            navigate("/dashboard/student", { replace: true });
            break;
        }
      }
    }, 1500);
  };

  const handleLoginError = (errorMsg) => {
    setError(errorMsg);
    setMessage("");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>B1 SCHOOL</h1>
        </div>
        <div className="auth-header">
          <p>
            Sign in to your <strong>Learning Management System</strong> account
          </p>
        </div>

        <div className="auth-content">
          {message && <SuccessMessage message={message} />}
          {error && <ErrorMessage message={error} />}

          <LoginForm
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />

          <GoogleOAuthButton />

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/auth/register")}
                className="link-button"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
