import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { useAuthContext } from './contexts/AuthContext';
import LoadingSpinner from "./components/common/LoadingSpinner";

// Auth components
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import GoogleCallback from "./pages/auth/GoogleCallback";

// Dashboard components
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import InstructorDashboard from "./pages/dashboard/InstructorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Profile from "./pages/dashboard/Profile";

// Course components
import CourseManagement from "./pages/courses/CourseManagement";
import CourseDetail from "./pages/courses/CourseDetail";
import MyEnrollments from "./pages/courses/MyEnrollments";

// Module components
import ModuleManagement from "./pages/modules/ModuleManagement";
import ModuleDetail from "./pages/modules/ModuleDetail";

// Lesson components
import LessonManagement from "./pages/lessons/LessonManagement";
import LessonDetail from "./pages/lessons/LessonDetail";

// Quiz components
import QuizManagement from "./pages/quizzes/QuizManagement";
import QuizTaking from "./pages/quizzes/QuizTaking";

// Assignment components
import AssignmentManagement from "./pages/assignments/AssignmentManagement";
import AssignmentDetail from "./pages/assignments/AssignmentDetail";

// Submission components
import SubmissionManagement from "./pages/submissions/SubmissionManagement";
import SubmissionUpload from "./pages/submissions/SubmissionUpload";
import SubmissionDetail from "./pages/submissions/SubmissionDetail";

// Enrollment components
import EnrollmentManagement from "./pages/enrollments/EnrollmentManagement";
import ProgressTracking from "./pages/enrollments/ProgressTracking";

// Category components
import CategoryManagement from "./pages/categories/CategoryManagement";

// Admin components
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";

// Search components
import SearchResults from "./pages/search/SearchResults";

// Error components
import NotFound from "./pages/error/NotFound";
import Unauthorized from "./pages/error/Unauthorized";

// Styles
import "./App.css";

// Enhanced Protected Route with ownership checking
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireOwnership = false,
  resourceUserId = null,
}) => {
  const { user, loading, isAuthenticated } = useAuthContext();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/error/unauthorized" replace />;
  }

  // Check ownership for student accessing their own resources
  if (
    requireOwnership &&
    user.role === "student" &&
    resourceUserId &&
    user.id !== parseInt(resourceUserId)
  ) {
    return <Navigate to="/error/unauthorized" replace />;
  }

  return children;
};

// Role-based Dashboard Redirect
const DashboardRedirect = () => {
  const { user, loading, isAuthenticated } = useAuthContext();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    // This ensures we only redirect after the auth state is fully loaded
    if (!loading) {
      setIsInitialized(true);
    }
  }, [loading]);

  if (loading || !isInitialized) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Ensure user role is available
  if (!user.role) {
    console.error('User role is missing:', user);
    return <Navigate to="/error/unauthorized" replace />;
  }

  // Role-based redirection
  const rolePathMap = {
    admin: "/dashboard/admin",
    instructor: "/dashboard/instructor",
    student: "/dashboard/student"
  };

  const redirectTo = rolePathMap[user.role.toLowerCase()] || "/dashboard/student";
  
  // Only redirect if we're not already on the correct path
  if (window.location.pathname !== redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If we're already on the correct path, render the appropriate dashboard
  switch (user.role.toLowerCase()) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'student':
    default:
      return <StudentDashboard />;
  }
};

// Main App component with routes
function AppRoutes() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ================================ */}
          {/* PUBLIC ROUTES (No Auth Required) */}
          {/* ================================ */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          {/* ================================ */}
          {/* DASHBOARD ROUTES - Role-specific */}
          {/* ================================ */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/student" element={<DashboardRedirect />} />
          <Route path="/dashboard/instructor" element={<DashboardRedirect />} />
          <Route path="/dashboard/admin" element={<DashboardRedirect />} />

          {/* ================================ */}
          {/* PROFILE - All authenticated users */}
          {/* ================================ */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* COURSE ROUTES */}
          {/* ================================ */}
          {/* Course browsing - All authenticated users */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CourseManagement />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          
          {/* Student-specific: My enrollments */}
          <Route
            path="/my-enrollments"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyEnrollments />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* MODULE ROUTES */}
          {/* ================================ */}
          {/* Module management - Admin, Instructor only */}
          <Route
            path="/modules/manage/:courseId"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <ModuleManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Module viewing - All authenticated users */}
          <Route
            path="/modules/:id"
            element={
              <ProtectedRoute>
                <ModuleDetail />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* LESSON ROUTES */}
          {/* ================================ */}
          {/* Lesson management - Admin, Instructor only */}
          <Route
            path="/lessons/manage"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <LessonManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Lesson viewing - All authenticated users */}
          <Route
            path="/lessons/:id"
            element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* QUIZ ROUTES */}
          {/* ================================ */}
          {/* Quiz management - Admin, Instructor only */}
          <Route
            path="/quizzes/manage"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <QuizManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Quiz taking - Students only */}
          <Route
            path="/quizzes/take/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <QuizTaking />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* ASSIGNMENT ROUTES */}
          {/* ================================ */}
          {/* Assignment management - Admin, Instructor only */}
          <Route
            path="/assignments/manage"
            element={
              <ProtectedRoute allowedRoles={["admin", "instructor"]}>
                <AssignmentManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Assignment viewing - All authenticated users */}
          <Route
            path="/assignments/:id"
            element={
              <ProtectedRoute>
                <AssignmentDetail />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* SUBMISSION ROUTES */}
          {/* ================================ */}
          {/* Submission management - Students see their own, Instructors/Admins see all */}
          <Route
            path="/submissions"
            element={
              <ProtectedRoute>
                <SubmissionManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Submission upload - Students only */}
          <Route
            path="/submissions/upload/:assignmentId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <SubmissionUpload />
              </ProtectedRoute>
            }
          />
          
          {/* Submission detail - All authenticated users */}
          <Route
            path="/submissions/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetail />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* ENROLLMENT ROUTES */}
          {/* ================================ */}
          {/* Enrollment management - Admin only */}
          <Route
            path="/admin/enrollments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EnrollmentManagement />
              </ProtectedRoute>
            }
          />
          
          {/* Progress tracking - All authenticated users */}
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressTracking />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* ADMIN ROUTES */}
          {/* ================================ */}
          {/* Category management - Admin only */}
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />

          {/* User management - Admin only */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Reports - Admin only */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* SEARCH ROUTES */}
          {/* ================================ */}
          {/* Search - All authenticated users */}
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />

          {/* ================================ */}
          {/* ERROR ROUTES */}
          {/* ================================ */}
          <Route path="/error/unauthorized" element={<Unauthorized />} />
          <Route path="/error/404" element={<NotFound />} />

          {/* ================================ */}
          {/* DEFAULT ROUTES */}
          {/* ================================ */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Main App component wrapped with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;