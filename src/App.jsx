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

const RouteFallback = () => <PageSpinner />;

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="jee" element={<JeePage />} />
            <Route path="neet" element={<NeetPage />} />
            <Route path="centers" element={<CentersPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="faculty/marks-upload" element={<FacultyMarksUpload />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
