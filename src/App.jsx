import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';
import PageSpinner from './components/PageSpinner';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const FacultyMarksUpload = lazy(() => import('./pages/FacultyMarksUpload'));
const JeePage = lazy(() => import('./pages/JeePage'));
const NeetPage = lazy(() => import('./pages/NeetPage'));
const CentersPage = lazy(() => import('./pages/CentersPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CompetitiveExamsPage = lazy(() => import('./pages/CompetitiveExamsPage'));
const ExamDetailPage = lazy(() => import('./pages/ExamDetailPage'));
const AiMlPage = lazy(() => import('./pages/AiMlPage'));
const CodingPage = lazy(() => import('./pages/CodingPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const PartnerPage = lazy(() => import('./pages/PartnerPage'));
const TeacherClassesPage = lazy(() => import('./pages/TeacherClassesPage'));
const StudentJoinClassPage = lazy(() => import('./pages/StudentJoinClassPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const FacultyLoginPage = lazy(() => import('./pages/FacultyLoginPage'));

// Admin panel
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const BatchManagement = lazy(() => import('./pages/admin/BatchManagement'));
const TeacherManagement = lazy(() => import('./pages/admin/TeacherManagement'));
const StudentManagement = lazy(() => import('./pages/admin/StudentManagement'));

// Teacher panel
const TeacherLayout = lazy(() => import('./components/teacher/TeacherLayout'));
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const TeacherClasses = lazy(() => import('./pages/teacher/TeacherClasses'));
const TeacherQuizzes = lazy(() => import('./pages/teacher/TeacherQuizzes'));
const TeacherStudents = lazy(() => import('./pages/teacher/TeacherStudents'));

const RouteFallback = () => <PageSpinner />;

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            {/* Category pages */}
            <Route path="competitive-exams" element={<CompetitiveExamsPage />} />
            <Route path="competitive-exams/:slug" element={<ExamDetailPage />} />
            <Route path="ai-ml" element={<AiMlPage />} />
            <Route path="coding" element={<CodingPage />} />
            <Route path="careers" element={<CareersPage />} />
            {/* Partner */}
            <Route path="partner" element={<PartnerPage />} />
            {/* Existing pages */}
            <Route path="centers" element={<CentersPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="faculty/marks-upload" element={<FacultyMarksUpload />} />
            {/* Note: /faculty/classes is replaced by the new /teacher/classes panel */}
            <Route path="student/join-class" element={<StudentJoinClassPage />} />
            {/* Legacy redirects */}
            <Route path="jee" element={<JeePage />} />
            <Route path="neet" element={<NeetPage />} />
          </Route>

          {/* Standalone login pages (no Navbar/Footer) */}
          <Route path="admin-login" element={<AdminLoginPage />} />
          <Route path="faculty-login" element={<FacultyLoginPage />} />

          {/* Admin Panel (standalone layout with sidebar) */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="batches" element={<BatchManagement />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="students" element={<StudentManagement />} />
          </Route>

          {/* Teacher Panel (standalone layout with sidebar) */}
          <Route path="teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="quizzes" element={<TeacherQuizzes />} />
            <Route path="students" element={<TeacherStudents />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
