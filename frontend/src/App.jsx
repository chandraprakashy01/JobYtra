import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import About from './pages/About';
import Events from './pages/Events';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Internships from './pages/Internships';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import HostEvent from './pages/HostEvent';
import ForgotPassword from './pages/ForgotPassword';


// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentApplications from './pages/student/StudentApplications';
import AIToolsHub from './pages/student/AIToolsHub';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import ResumeJobMatch from './pages/student/ResumeJobMatch';
import CoverLetterGenerator from './pages/student/CoverLetterGenerator';
import InterviewCoach from './pages/student/InterviewCoach';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import PostJob from './pages/company/PostJob';
import ApplicantsList from './pages/company/ApplicantsList';
import AICandidateMatch from './pages/company/AICandidateMatch';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/events/host" element={<HostEvent />} />

        </Route>

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute allowedRoles={['ROLE_STUDENT']}>
            <DashboardLayout role="student" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="ai" element={<AIToolsHub />} />
          <Route path="ai/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="ai/job-match" element={<ResumeJobMatch />} />
          <Route path="ai/cover-letter" element={<CoverLetterGenerator />} />
          <Route path="ai/interview-coach" element={<InterviewCoach />} />
        </Route>

        {/* Company Routes */}
        <Route path="/company" element={
          <ProtectedRoute allowedRoles={['ROLE_COMPANY']}>
            <DashboardLayout role="company" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="job/:id/applicants" element={<ApplicantsList />} />
          <Route path="job/:id/ai-match" element={<AICandidateMatch />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="jobs" element={<AdminJobs />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
