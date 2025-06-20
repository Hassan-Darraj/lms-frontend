import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children, showSidebar = true }) => {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {

      try {
        const response = await getCurrentUser();
        console.log('User data received:', response.data);

        if (response && response.data && response.data.success) {
          // Extract user data from the nested structure
          const userData = response.data.user;
          if (userData && (userData.id || userData._id)) {
            setUser(userData);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch  {

        setUser(null);
      } finally {
        setIsAuthChecked(true);
      }
    };

    fetchUser();
  }, []);

  // Show nothing until we know the auth state
  if (!isAuthChecked) {
    return null; // Or a loading spinner
  }

  return (
    <div className="layout">
      <Header user={user} />

      <div className="layout-body">
        {showSidebar && <Sidebar userRole={user?.role} />}

        <main className="main-content">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
