import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import FacultyMarksUploadPage from './pages/FacultyMarksUploadPage.jsx'
import HomePage from './pages/HomePage.jsx'
import JeePage from './pages/JeePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NeetPage from './pages/NeetPage.jsx'
import { ROLES } from './utils/roles.js'

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 justify-center px-4 pb-10 pt-24 md:px-6 md:pt-28">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/jee" element={<JeePage />} />
          <Route path="/neet" element={<NeetPage />} />
          <Route
            path="/faculty-marks-upload"
            element={
              <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
                <FacultyMarksUploadPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App