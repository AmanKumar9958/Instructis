import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, UploadCloud, GraduationCap, Users, BookOpen, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

export default function Navbar() {
  const { user, role, logout, loginWithGoogle, loginSuperAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom auth states
  const [selectedRole, setSelectedRole] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        await loginWithGoogle(r);
        handleCloseModal();
      } catch (err) {
        setErrorText(err.message || "Failed to log in via Google");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSuperAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginSuperAdmin(adminEmail, adminPass);
      handleCloseModal();
    } catch (err) {
      setErrorText("Invalid SuperAdmin Credentials");
    } finally {
      setLoading(false);
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
          onClick={async () => {
            setLoading(true);
            try {
              await logout();
              setIsMobileMenuOpen(false);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className={`text-gray-500 hover:text-red-500 font-medium transition-colors border border-gray-300 hover:border-red-500 rounded-lg flex items-center justify-center gap-2 ${isMobile ? 'py-3 text-center w-full' : 'py-1.5 px-4'}`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Logging out...' : 'Logout'}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            {/* Top Branding Bar */}
            <div className="h-2 bg-gradient-to-r from-brand-purple to-brand-orange w-full" />
            
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-2xl bg-brand-light-purple text-brand-purple mb-4">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
                <p className="text-gray-500 mt-2 font-medium">Log into your Instructis account</p>
              </div>

              {errorText && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-semibold text-center border border-red-100 flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                  {errorText}
                </div>
              )}

              {!selectedRole ? (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'Student', icon: <GraduationCap />, label: 'Student' },
                    { id: 'Parents', icon: <Users />, label: 'Parent' },
                    { id: 'Faculty', icon: <BookOpen />, label: 'Faculty' },
                    { id: 'SuperAdmin', icon: <ShieldCheck />, label: 'Admin' }
                  ].map(r => (
                    <button
                      key={r.id}
                      disabled={loading}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`group flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 transition-all duration-300 transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-brand-purple hover:bg-brand-light-purple/50 hover:-translate-y-1'}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-brand-purple flex items-center justify-center mb-3 transition-colors shadow-sm">
                        {loading && selectedRole === r.id ? <Loader2 className="w-6 h-6 animate-spin text-brand-purple" /> : r.icon}
                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-brand-purple transition-colors">{r.label}</span>
                    </button>
                  ))}
                </div>
              ) : selectedRole === 'SuperAdmin' ? (
                <form onSubmit={handleSuperAdminLogin} className="space-y-5">
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                    <ShieldCheck className="text-brand-purple w-6 h-6" />
                    <span className="font-bold text-gray-700">Admin Authentication</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="Admin Email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        placeholder="Password"
                        value={adminPass}
                        onChange={(e) => setAdminPass(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-purple/20 transform hover:-translate-y-0.5 active:translate-y-0 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {loading ? 'Authenticating...' : 'Log In as Admin'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedRole(null); setErrorText(''); }}
                    className="w-full text-gray-400 hover:text-brand-purple text-sm font-bold mt-4 transition-colors flex items-center justify-center gap-2"
                  >
                    &larr; Change Role
                  </button>
                </form>
              ) : (
                <div className="text-center py-10">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-brand-purple rounded-full animate-ping opacity-20" />
                    <div className="relative w-20 h-20 bg-brand-light-purple rounded-full flex items-center justify-center text-brand-purple">
                      <GraduationCap className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Google Auth</h3>
                  <p className="text-gray-500 font-medium">Opening secure sign-in for {selectedRole}...</p>
                </div>
              )}
              
              <p className="text-[10px] text-center text-gray-400 mt-8 leading-relaxed">
                By continuing, you agree to Instructis' <span className="underline hover:text-brand-purple cursor-pointer">Terms</span> and <span className="underline hover:text-brand-purple cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
