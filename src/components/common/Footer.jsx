import './Footer.css';

const Footer = () => {
  return (
    <footer 
      className="footer" 
      role="contentinfo"
      aria-label="Website footer"
    >
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div 
              className="brand-logo"
              role="img"
              aria-label="Graduation cap logo"
            >
              🎓
            </div>
            <div className="brand-info">
              <h2 className="brand-name">B1 SCHOOL</h2>
              <p className="brand-tagline">Empowering education through technology</p>
            </div>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Learning Management System. All rights reserved.</p>
          </div>
          <div className="footer-meta">
            <span className="version" aria-label="Version">v2.1.0</span>
            <span className="separator" aria-hidden="true">•</span>
            <span className="status">
              <span className="visually-hidden">System status: </span>
              <span aria-hidden="true">🟢</span> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;