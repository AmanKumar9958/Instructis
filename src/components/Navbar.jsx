import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, UploadCloud } from 'lucide-react';

export default function Navbar() {
  const { user, role, logout, loginWithGoogle, loginSuperAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom auth states
  const [selectedRole, setSelectedRole] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleOpenModal = () => {
    setShowModal(true);
    setSelectedRole(null);
    setErrorText('');
    setIsMobileMenuOpen(false); // Close mobile menu when opening login modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setErrorText('');
  };

  const handleRoleSelect = async (r) => {
    setErrorText('');
    setSelectedRole(r);

    // If not SuperAdmin, directly trigger Google Auth mapping to that role
    if (r !== 'SuperAdmin') {
      try {
        await loginWithGoogle(r);
        handleCloseModal();
      } catch (err) {
        setErrorText(err.message || "Failed to log in via Google");
      }
    }
  };

  const handleSuperAdminLogin = async (e) => {
    e.preventDefault();
    try {
      await loginSuperAdmin(adminEmail, adminPass);
      handleCloseModal();
    } catch (err) {
      setErrorText("Invalid SuperAdmin Credentials");
    }
  };

  // Dedicated component for rendering auth status so we don't repeat it in mobile and desktop variants
  const AuthStatusUI = ({ isMobile }) => {
    if (!user) {
      return (
        <button
          onClick={handleOpenModal}
          className={`bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-lg transition-colors ${isMobile ? 'w-full py-3 text-lg' : 'py-2 px-6'}`}
        >
          Log In
        </button>
      );
    }

    return (
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center space-x-6'}`}>
        <div className="flex items-center space-x-3">
          {/* Marks Upload Icon beside username */}
          {['Faculty', 'SuperAdmin'].includes(role) && (
            <Link
              to="/faculty/marks-upload"
              className={`group relative text-gray-500 hover:text-brand-purple transition-colors p-2 flex items-center justify-center rounded-full hover:bg-purple-50 ${isMobile ? 'self-start mb-2 bg-gray-100' : ''}`}
            >
              <UploadCloud className="w-5 h-5" />
              <span className={`absolute ${isMobile ? 'left-10' : '-bottom-10 left-1/2 -translate-x-1/2'} opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50`}>
                Marks Upload
              </span>
            </Link>
          )}

          {user.profile_url ? (
            <img src={user.profile_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-light-purple flex items-center justify-center text-brand-purple font-bold">
              {user.displayName?.charAt(0) || user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
          <div className="flex flex-col text-sm">
            <span className="font-bold text-gray-900">{user.displayName || user.name}</span>
            <span className="text-brand-orange font-semibold text-xs tracking-wider uppercase">{role}</span>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            setIsMobileMenuOpen(false);
          }}
          className={`text-gray-500 hover:text-red-500 font-medium transition-colors border border-gray-300 hover:border-red-500 rounded-lg ${isMobile ? 'py-3 text-center w-full' : 'py-1.5 px-4'}`}
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo and Nav Links */}
            <div className="flex-shrink-0 flex items-center gap-8">
              <Link to="/" className="text-2xl font-black text-brand-purple tracking-tight">
                INSTRUCTIS<span className="text-brand-orange">.</span>
              </Link>
            </div>

            {/* Desktop Right: Auth / Profile */}
            <div className="hidden md:flex items-center space-x-4">
              <AuthStatusUI isMobile={false} />
            </div>

            {/* Mobile Right: Hamburger Toggle */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-brand-purple focus:outline-none p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-50 border-t border-gray-200 px-4 pt-4 pb-6 absolute w-full shadow-lg z-40">
            <div className="flex flex-col gap-4">
              <AuthStatusUI isMobile={true} />
            </div>
          </div>
        )}
      </nav>

      {/* Role Selection / Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Log into Instructis</h2>

            {errorText && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 font-semibold text-center border border-red-100">
                {errorText}
              </div>
            )}

            {!selectedRole ? (
              <div className="space-y-3">
                <p className="text-center text-gray-500 mb-6 text-sm">Select your role to continue</p>
                {['Student', 'Parents', 'Faculty', 'SuperAdmin'].map(r => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-lg transition-all ${r === 'SuperAdmin'
                        ? 'border-gray-200 text-gray-700 hover:border-gray-400'
                        : 'border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            ) : selectedRole === 'SuperAdmin' ? (
              <form onSubmit={handleSuperAdminLogin} className="space-y-4">
                <p className="text-center font-bold text-gray-700 mb-4">SuperAdmin Login</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 rounded-lg transition-colors mt-2"
                >
                  Authenticate
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedRole(null); setErrorText(''); }}
                  className="w-full text-gray-500 hover:text-gray-800 text-sm font-medium mt-4 transition-colors p-2"
                >
                  &larr; Back to Role Selection
                </button>
              </form>
            ) : (
              <div className="text-center text-gray-500 min-h-[150px] flex items-center justify-center">
                <p className="animate-pulse font-medium">Opening Google Sign-In for {selectedRole}...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
