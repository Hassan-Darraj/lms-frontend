import Layout from '../../components/common/Layout';

const NotFound = () => {
  return (
    <Layout showSidebar={false}>
      <div className="error-page">
        <div className="error-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          
          <div className="error-actions">
            <a href="/" className="primary-button">
              Go Home
            </a>
            <button onClick={() => window.history.back()} className="secondary-button">
              Go Back
            </button>
          </div>
          
          <div className="helpful-links">
            <h3>Try these instead:</h3>
            <ul>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/courses">Browse Courses</a></li>
              <li><a href="/search">Search</a></li>
              <li><a href="/profile">My Profile</a></li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
