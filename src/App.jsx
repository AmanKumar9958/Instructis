import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FacultyMarksUpload from './pages/FacultyMarksUpload';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="faculty/marks-upload" element={<FacultyMarksUpload />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
