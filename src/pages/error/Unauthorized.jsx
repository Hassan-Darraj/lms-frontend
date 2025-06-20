import Layout from '../../components/common/Layout';

const Unauthorized = () => {
  return (
    <Layout showSidebar={false}>
      <div className="error-page">
        <div className="error-content">
          <h1>401</h1>
          <h2>Unauthorized Access</h2>
          <p>You don't have permission to access this page or your session has expired.</p>
          
          <div className="error-actions">
            <a href="/auth/login" className="primary-button">
              Login
            </a>
            <a href="/" className="secondary-button">
              Go Home
            </a>
          </div>
          
          <div className="error-info">
            <h3>Common reasons for this error:</h3>
            <ul>
              <li>You need to log in to access this page</li>
              <li>Your session has expired</li>
              <li>You don't have the required permissions</li>
              <li>This page requires a specific user role (student, instructor, admin)</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Unauthorized;