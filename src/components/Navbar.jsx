import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, UploadCloud, GraduationCap, Users, Loader2, Search, ChevronDown } from 'lucide-react';
import { getFriendlyErrorMessage } from '../utils/errors';
import LoadingOverlay from './LoadingOverlay';
import MegaMenu from './MegaMenu';

const SearchOverlay = lazy(() => import('./SearchOverlay'));

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, loginWithGoogle, loginSuperAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Custom auth states
  const [selectedRole, setSelectedRole] = useState(null);

  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY;

      // Only toggle compact mode if there's a meaningful scroll delta (>10px)
      // and the page actually has enough content to scroll
      const isPageScrollable = document.documentElement.scrollHeight > window.innerHeight + 100;

      if (isPageScrollable && delta > 10 && current > 80) {
        setIsCompact(true);
      } else if (delta < -10 || current < 40) {
        setIsCompact(false);
      }

      lastScrollY = current;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
    setSelectedRole(null);
    setErrorText('');
    setIsMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setErrorText('');
  };

  const handleRoleSelect = async (r) => {
    setErrorText('');
    setSelectedRole(r);
    setLoading(true);
    try {
      await loginWithGoogle(r);
      handleCloseModal();
    } catch (err) {
      setErrorText(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };



  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const AuthStatusUI = ({ isMobile }) => {
    if (!user) {
      return (
        <button
          onClick={handleOpenModal}
          className={`bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-purple/20 ${isMobile ? 'w-full py-3 text-lg' : 'py-2.5 px-6 text-sm'}`}
        >
          Log In
        </button>
      );
    }

    return (
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center space-x-4'}`}>
        <div className="flex items-center space-x-3">
          {['Faculty', 'SuperAdmin'].includes(role) && (
            <Link
              to="/faculty/marks-upload"
              onClick={closeMobileMenu}
              className={`group relative text-gray-500 hover:text-brand-purple transition-colors p-2 flex items-center justify-center rounded-full hover:bg-purple-50 ${isMobile ? 'self-start mb-2 bg-gray-100' : ''}`}
            >
              <UploadCloud className="w-5 h-5" />
              <span className={`absolute ${isMobile ? 'left-10' : '-bottom-10 left-1/2 -translate-x-1/2'} opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-50`}>
                Marks Upload
              </span>
            </Link>
          )}

          {user.profile_url || user.photoURL || user.photoUrl ? (
            <img
              src={user.profile_url || user.photoURL || user.photoUrl}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-100"
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.name || 'U')}&background=random`; }}
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-brand-light-purple flex items-center justify-center text-brand-purple font-bold text-sm">
              {user.displayName?.charAt(0) || user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm">{user.displayName || user.name}</span>
            <span className="text-brand-orange font-semibold text-[10px] tracking-wider uppercase">{role}</span>
          </div>
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            setIsLoggingOut(true);
            try {
              await logout();
              setIsMobileMenuOpen(false);
              navigate('/');
            } finally {
              setLoading(false);
              setIsLoggingOut(false);
            }
          }}
          disabled={loading}
          className={`text-gray-500 hover:text-red-500 font-medium transition-colors border border-gray-200 hover:border-red-400 rounded-xl flex items-center justify-center gap-2 text-sm ${isMobile ? 'py-3 text-center w-full' : 'py-1.5 px-4'}`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  };

  return (
    <>
      <LoadingOverlay isOpen={isLoggingOut} label="Signing out..." />
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${isCompact ? 'bg-white/90 shadow-md backdrop-blur-xl' : 'bg-white/80 backdrop-blur-md shadow-sm'}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isCompact ? 'py-1' : 'py-2'}`}>
          <div className={`flex justify-between items-center transition-all duration-300 ${isCompact ? 'h-12' : 'h-16'}`}>
            {/* Logo */}
            <Link to="/" className={`font-black text-brand-purple tracking-tight transition-all duration-300 flex-shrink-0 ${isCompact ? 'text-xl' : 'text-2xl'}`}>
              INSTRUCTIS<span className="text-brand-orange">.</span>
            </Link>

            {/* Desktop Nav */}
            <div className={`hidden lg:flex items-center gap-1 transition-all duration-300 ${isCompact ? 'opacity-0 max-w-0 pointer-events-none overflow-hidden' : 'opacity-100 max-w-2xl'}`}>
              {/* Explore dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMegaMenu(!showMegaMenu)}
                  className={`flex items-center gap-1 text-sm transition-colors px-3 py-2 rounded-lg ${
                    ['/ai-ml', '/coding', '/careers'].some(path => pathname.startsWith(path))
                      ? 'text-brand-purple bg-brand-light-purple font-bold shadow-sm shadow-brand-purple/5'
                      : 'text-gray-600 hover:text-brand-purple hover:bg-gray-50 font-semibold'
                  }`}
                >
                  Explore
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMegaMenu ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <Link
                to="/competitive-exams"
                className={`text-sm transition-colors px-3 py-2 rounded-lg ${
                  pathname.startsWith('/competitive-exams') || pathname === '/jee' || pathname === '/neet'
                    ? 'text-brand-purple bg-brand-light-purple font-bold shadow-sm shadow-brand-purple/5'
                    : 'text-gray-600 hover:text-brand-purple hover:bg-gray-50 font-semibold'
                }`}
              >
                Exams
              </Link>
              <Link
                to="/centers"
                className={`text-sm transition-colors px-3 py-2 rounded-lg ${
                  pathname.startsWith('/centers')
                    ? 'text-brand-purple bg-brand-light-purple font-bold shadow-sm shadow-brand-purple/5'
                    : 'text-gray-600 hover:text-brand-purple hover:bg-gray-50 font-semibold'
                }`}
              >
                Centers
              </Link>
              <Link
                to="/about"
                className={`text-sm transition-colors px-3 py-2 rounded-lg ${
                  pathname.startsWith('/about')
                    ? 'text-brand-purple bg-brand-light-purple font-bold shadow-sm shadow-brand-purple/5'
                    : 'text-gray-600 hover:text-brand-purple hover:bg-gray-50 font-semibold'
                }`}
              >
                About
              </Link>
              {role === 'Faculty' ? (
                <Link
                  to="/faculty/classes"
                  className={`text-sm font-bold transition-all px-3 py-2 rounded-lg ${
                    pathname.startsWith('/faculty/classes')
                      ? 'text-white bg-brand-purple hover:bg-brand-purple-dark shadow-md shadow-brand-purple/20'
                      : 'text-brand-purple hover:text-brand-purple-dark hover:bg-brand-light-purple'
                  }`}
                >
                  Classes
                </Link>
              ) : role === 'Student' ? (
                <Link
                  to="/student/join-class"
                  className={`text-sm font-bold transition-all px-3 py-2 rounded-lg ${
                    pathname.startsWith('/student/join-class')
                      ? 'text-white bg-brand-purple hover:bg-brand-purple-dark shadow-md shadow-brand-purple/20'
                      : 'text-brand-purple hover:text-brand-purple-dark hover:bg-brand-light-purple'
                  }`}
                >
                  Join Class
                </Link>
              ) : (
                <Link
                  to="/partner"
                  className={`text-sm font-bold transition-all px-3 py-2 rounded-lg ${
                    pathname.startsWith('/partner')
                      ? 'text-white bg-brand-purple hover:bg-brand-purple-dark shadow-md shadow-brand-purple/20'
                      : 'text-brand-purple hover:text-brand-purple-dark hover:bg-brand-light-purple'
                  }`}
                >
                  Partner With Us
                </Link>
              )}
            </div>

            {/* Desktop right: search + auth */}
            <div className={`hidden lg:flex items-center gap-3 transition-all duration-300 ${isCompact ? 'scale-95' : 'scale-100'}`}>
              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors border border-gray-100"
              >
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline">Search...</span>
              </button>

              <AuthStatusUI isMobile={false} />
            </div>

            {/* Mobile right: search + hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="text-gray-500 hover:text-brand-purple p-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-brand-purple focus:outline-none p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <MegaMenu isOpen={showMegaMenu} onClose={() => setShowMegaMenu(false)} />

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pt-4 pb-6 absolute w-full shadow-lg z-40">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Link
                  to="/competitive-exams"
                  onClick={closeMobileMenu}
                  className={`text-base py-2 px-3 rounded-lg transition-all ${
                    pathname.startsWith('/competitive-exams') || pathname === '/jee' || pathname === '/neet'
                      ? 'font-bold text-brand-purple bg-brand-light-purple'
                      : 'font-semibold text-gray-700 hover:text-brand-purple hover:bg-gray-50 transition-colors'
                  }`}
                >
                  Competitive Exams
                </Link>
                <Link
                  to="/ai-ml"
                  onClick={closeMobileMenu}
                  className={`text-base py-2 px-3 rounded-lg transition-all ${
                    pathname.startsWith('/ai-ml')
                      ? 'font-bold text-brand-purple bg-brand-light-purple'
                      : 'font-semibold text-gray-700 hover:text-brand-purple hover:bg-gray-50 transition-colors'
                  }`}
                >
                  AI & Machine Learning
                </Link>
                <Link
                  to="/coding"
                  onClick={closeMobileMenu}
                  className={`text-base py-2 px-3 rounded-lg transition-all ${
                    pathname.startsWith('/coding')
                      ? 'font-bold text-brand-purple bg-brand-light-purple'
                      : 'font-semibold text-gray-700 hover:text-brand-purple hover:bg-gray-50 transition-colors'
                  }`}
                >
                  Coding & Programming
                </Link>
                <Link
                  to="/centers"
                  onClick={closeMobileMenu}
                  className={`text-base py-2 px-3 rounded-lg transition-all ${
                    pathname.startsWith('/centers')
                      ? 'font-bold text-brand-purple bg-brand-light-purple'
                      : 'font-semibold text-gray-700 hover:text-brand-purple hover:bg-gray-50 transition-colors'
                  }`}
                >
                  Centers
                </Link>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className={`text-base py-2 px-3 rounded-lg transition-all ${
                    pathname.startsWith('/about')
                      ? 'font-bold text-brand-purple bg-brand-light-purple'
                      : 'font-semibold text-gray-700 hover:text-brand-purple hover:bg-gray-50 transition-colors'
                  }`}
                >
                  About
                </Link>
                {role === 'Faculty' ? (
                  <Link
                    to="/faculty/classes"
                    onClick={closeMobileMenu}
                    className={`text-base font-bold transition-all py-2 px-3 rounded-lg ${
                      pathname.startsWith('/faculty/classes')
                        ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/20'
                        : 'text-brand-purple hover:bg-brand-light-purple transition-colors'
                    }`}
                  >
                    Classes
                  </Link>
                ) : role === 'Student' ? (
                  <Link
                    to="/student/join-class"
                    onClick={closeMobileMenu}
                    className={`text-base font-bold transition-all py-2 px-3 rounded-lg ${
                      pathname.startsWith('/student/join-class')
                        ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/20'
                        : 'text-brand-purple hover:bg-brand-light-purple transition-colors'
                    }`}
                  >
                    Join Class
                  </Link>
                ) : (
                  <Link
                    to="/partner"
                    onClick={closeMobileMenu}
                    className={`text-base font-bold transition-all py-2 px-3 rounded-lg ${
                      pathname.startsWith('/partner')
                        ? 'text-white bg-brand-purple shadow-md shadow-brand-purple/20'
                        : 'text-brand-purple hover:bg-brand-light-purple transition-colors'
                    }`}
                  >
                    Partner With Us
                  </Link>
                )}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <AuthStatusUI isMobile={true} />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay — lazy loaded */}
      <Suspense fallback={null}>
        <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
      </Suspense>

      {/* Role Selection / Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            {/* Top Branding Bar */}
            <div className="h-1.5 bg-gradient-to-r from-brand-purple to-brand-orange w-full" />
            
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
      {/* Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-brand-purple/10 border-t-brand-purple rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-tr from-brand-purple to-brand-purple-dark rounded-2xl rotate-45 animate-pulse shadow-lg shadow-brand-purple/20" />
            </div>
            <div className="absolute inset-0 animate-spin duration-700">
              <div className="w-3 h-3 bg-brand-orange rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-sm" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-brand-purple tracking-tighter">
              INSTRUCTIS<span className="text-brand-orange">.</span>
            </h3>
            <div className="flex items-center justify-center gap-1">
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Securely</span>
              <span className="text-brand-purple font-bold text-xs uppercase tracking-widest animate-pulse">Processing</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
