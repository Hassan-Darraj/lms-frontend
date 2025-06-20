import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../services/authService";
import "./Sidebar.css";

const Sidebar = ({ userRole = "student" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUserName(storedUser.name);
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/auth/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const menuItems = {
    student: [
      { label: "Dashboard", path: "/dashboard/student", icon: "🏠" },
      { label: "Browse Courses", path: "/courses", icon: "📚" },
      { label: "My Enrollments", path: "/my-enrollments", icon: "📖" },
      { label: "My Progress", path: "/progress", icon: "📊" },
      { label: "Search", path: "/search", icon: "🔍" },
      { label: "Profile", path: "/profile", icon: "👤" },
    ],
    instructor: [
      { label: "Dashboard", path: "/dashboard/instructor", icon: "🏠" },
      { label: "View Courses", path: "/courses", icon: "📚" },
      { label: "Manage Lessons", path: "/lessons/manage", icon: "📝" },
      { label: "Manage Quizzes", path: "/quizzes/manage", icon: "❓" },
      { label: "Manage Assignments", path: "/assignments/manage", icon: "📋" },
      { label: "Review Submissions", path: "/submissions", icon: "✅" },
      { label: "Search", path: "/search", icon: "🔍" },
      { label: "Profile", path: "/profile", icon: "👤" },
    ],
    admin: [
      { label: "Dashboard", path: "/dashboard/admin", icon: "🏠" },
      { label: "Manage Users", path: "/admin/users", icon: "👥" },
      { label: "Manage Categories", path: "/admin/categories", icon: "📁" },
      { label: "Manage Enrollments", path: "/admin/enrollments", icon: "📋" },
      { label: "View Reports", path: "/admin/reports", icon: "📊" },
      { label: "All Courses", path: "/courses", icon: "📚" },
      { label: "Search", path: "/search", icon: "🔍" },
      { label: "Profile", path: "/profile", icon: "👤" },
    ],
  };

  const currentMenuItems = menuItems[userRole] || menuItems.student;

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const getRoleDisplay = () => {
    const roleConfig = {
      student: { label: "Student", color: "#3b82f6" },
      instructor: { label: "Instructor", color: "#10b981" },
      admin: { label: "Admin", color: "#6712f2" },
    };
    return roleConfig[userRole] || roleConfig.student;
  };

  const roleInfo = getRoleDisplay();

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-logo">🎓</div>
          {!isCollapsed && (
            <div className="brand-text">
              <h3 className="brand-name">LMS</h3>
              <span className="user-name">{userName}</span>
              <span
                className="role-badge"
                style={{ backgroundColor: roleInfo.color }}
              >
                {roleInfo.label}
              </span>
            </div>
          )}
        </div>

        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {currentMenuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <button
                onClick={() => handleNavigation(item.path)}
                className={`nav-button ${
                  isActiveRoute(item.path) ? "active" : ""
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
                {isActiveRoute(item.path) && (
                  <div className="active-indicator"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="logout-button"
            title={isCollapsed ? "Logout" : ""}
          >
            <span className="logout-icon">{loading ? "⟳" : "🚪"}</span>
            {!isCollapsed && (
              <span className="logout-text">
                {loading ? "Logging out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
