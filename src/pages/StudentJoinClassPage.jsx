import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import Seo from '../components/Seo';
import {
  Video,
  User,
  Clock,
  Radio,
  History,
  ChevronDown,
  BookOpen,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

/* ── Motivational quotes shown on empty/error states ── */
const QUOTES = [
  { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
  { text: 'The beautiful thing about learning is that nobody can take it away from you.', author: 'B.B. King' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  { text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
];

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

/* ── Filter options ── */
// FILTERS is now dynamically computed inside the component

/* ── Category badge colour map ── */
const CATEGORY_COLORS = {
  'Class 11': 'bg-blue-50 text-blue-700 border-blue-200',
  'Class 12': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  GATE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CAT: 'bg-amber-50 text-amber-700 border-amber-200',
  General: 'bg-purple-50 text-purple-700 border-purple-200',
};

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-24 bg-gray-200 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-3" />
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-200 rounded mb-6" />
      <div className="h-12 w-full bg-gray-200 rounded-xl" />
    </div>
  );
}

/* ── Format timestamp ── */
function formatTime(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const timeStr = d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const dateStr = d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
  return `${dateStr}, ${timeStr}`;
}

/* ══════════════════════════════════════════════════════════════
   StudentJoinClassPage — Live Classes Feed
   ══════════════════════════════════════════════════════════════ */
export default function StudentJoinClassPage() {
  const { user, role, loading: authLoading } = useAuth();

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [quote] = useState(() => getRandomQuote());

  /* ── Past (ended) classes ── */
  const [pastClasses, setPastClasses] = useState([]);
  const [pastLoading, setPastLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  /* ── Firestore real-time listener (only active classes) ── */
  useEffect(() => {
    const q = query(
      collection(db, 'live_classes'),
      where('is_active', '==', true),
      orderBy('created_at', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setClasses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setIsLoading(false);
        setError('');
      },
      (err) => {
        console.error('Firestore read error:', err);
        setError(err.message || 'Unable to load live classes right now. Please try again shortly.');
        setIsLoading(false);
      }
    );

    return unsub;
  }, []);

  /* ── Firestore listener for ended classes ── */
  useEffect(() => {
    const q = query(
      collection(db, 'live_classes'),
      where('is_active', '==', false),
      orderBy('created_at', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPastClasses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setPastLoading(false);
      },
      (err) => {
        console.error('Past classes error:', err);
        setPastLoading(false);
      }
    );
    return unsub;
  }, []);

  /* ── Dynamic Filters ── */
  const dynamicFilters = useMemo(() => {
    const allTargets = new Set();
    classes.forEach(c => {
      if (c.target_group) allTargets.add(c.target_group);
    });
    pastClasses.forEach(c => {
      if (c.target_group) allTargets.add(c.target_group);
    });
    // Keep standard ones as defaults, plus dynamically added ones
    ['Class 11', 'Class 12', 'GATE', 'CAT', 'General'].forEach(t => allTargets.add(t));
    return ['All', ...Array.from(allTargets)];
  }, [classes, pastClasses]);

  /* ── Derived: filtered lists ── */
  const filteredClasses = useMemo(() => {
    if (activeFilter === 'All') return classes;
    return classes.filter((c) => c.target_group === activeFilter);
  }, [classes, activeFilter]);

  const filteredPast = useMemo(() => {
    if (activeFilter === 'All') return pastClasses;
    return pastClasses.filter((c) => c.target_group === activeFilter);
  }, [pastClasses, activeFilter]);

  if (authLoading) return null;

  return (
    <>
      <Seo
        title="Live Classes — Join Now"
        description="Browse and join live classes from India's best teachers."
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* ── Header ── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Radio className="w-5 h-5 text-red-500" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Live Classes</h1>
              {classes.length > 0 && (
                <span className="ml-1 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  {classes.length} Live
                </span>
              )}
            </div>
            <p className="text-gray-500 ml-[52px]">
              Join a live session with your teachers — just one click away.
            </p>
          </div>

          {/* ── Filter Tabs ── */}
          <div className="mb-8 overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex gap-2 min-w-max">
              {dynamicFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    activeFilter === f
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ── Error State ── */}
          {error && (
            <div className="bg-white rounded-3xl border border-amber-200 shadow-sm p-8 sm:p-12 text-center mb-8">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
              <div className="bg-amber-50/50 rounded-2xl p-5 max-w-lg mx-auto border border-amber-100">
                <Sparkles className="w-4 h-4 text-amber-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 italic leading-relaxed">"{quote.text}"</p>
                <p className="text-xs text-gray-400 mt-2 font-semibold">— {quote.author}</p>
              </div>
            </div>
          )}

          {/* ── Loading Skeletons ── */}
          {isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ── Empty State ── */}
          {!isLoading && !error && filteredClasses.length === 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-14 text-center">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-9 h-9 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No live classes happening right now
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                Check back later or review past study materials! Your teachers will be live again soon.
              </p>
              <div className="bg-indigo-50/50 rounded-2xl p-5 max-w-lg mx-auto border border-indigo-100">
                <Sparkles className="w-4 h-4 text-indigo-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 italic leading-relaxed">"{quote.text}"</p>
                <p className="text-xs text-gray-400 mt-2 font-semibold">— {quote.author}</p>
              </div>
            </div>
          )}

          {/* ── Live Class Cards Grid ── */}
          {!isLoading && !error && filteredClasses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Card top bar — gradient accent */}
                  <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Row: Category + LIVE badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          CATEGORY_COLORS[cls.target_group] || 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {cls.target_group}
                      </span>

                      {/* LIVE NOW badge */}
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                        </span>
                        LIVE NOW
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug group-hover:text-indigo-700 transition-colors line-clamp-2">
                      {cls.title}
                    </h3>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{cls.teacher_name || 'Instructor'}</span>
                    </div>

                    {/* Scheduled time */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>Started at {formatTime(cls.scheduled_at)}</span>
                    </div>

                    {/* Spacer to push CTA to bottom */}
                    <div className="flex-1" />

                    {/* Join CTA */}
                    <a
                      href={cls.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 active:scale-[0.98]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Join Class
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              CLASS HISTORY — Past / Ended Classes
             ══════════════════════════════════════════════════ */}
          <section className="mt-12">
            <button
              onClick={() => setShowHistory((p) => !p)}
              className="flex items-center gap-3 mb-6 group w-full text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <History className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Class History</h2>
                <p className="text-sm text-gray-400">Past sessions from your teachers</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  showHistory ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showHistory && (
              <>
                {pastLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredPast.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                    <p className="text-gray-400 font-medium">No past classes found for this filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPast.map((cls) => (
                      <div
                        key={cls.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400" />
                        <div className="p-5 sm:p-6 flex flex-col flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                CATEGORY_COLORS[cls.target_group] || 'bg-gray-50 text-gray-600 border-gray-200'
                              }`}
                            >
                              {cls.target_group}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                              Ended
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-gray-800 mb-2 leading-snug line-clamp-2">
                            {cls.title}
                          </h3>

                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{cls.teacher_name || 'Instructor'}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{formatTime(cls.scheduled_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
