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
            <Route path="faculty/classes" element={<TeacherClassesPage />} />
            {/* Legacy redirects */}
            <Route path="jee" element={<JeePage />} />
            <Route path="neet" element={<NeetPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
