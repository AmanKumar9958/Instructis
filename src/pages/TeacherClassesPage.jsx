import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import Seo from '../components/Seo';
import {
  Plus,
  Video,
  Trash2,
  StopCircle,
  Loader2,
  ExternalLink,
  Clock,
  Users,
  CalendarDays,
  LinkIcon,
  Type,
  Tag,
} from 'lucide-react';

/* ── Helper: normalise a Google Meet link ── */
function normaliseMeetLink(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/* ── Target-group options ── */
const TARGET_GROUPS = ['Class 11', 'Class 12', 'GATE', 'CAT', 'General'];

export default function TeacherClassesPage() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  /* ── Form state ── */
  const [title, setTitle] = useState('');
  const [targetGroup, setTargetGroup] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [scheduledAt, setScheduledAt] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [publishing, setPublishing] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  /* ── Classes list state ── */
  const [classes, setClasses] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (!authLoading && (!user || !['Faculty', 'SuperAdmin'].includes(role))) {
      navigate('/', { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  /* ── Real-time listener for teacher's classes ── */
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'live_classes'),
      where('teacher_id', '==', user.uid),
      orderBy('created_at', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setClasses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setListLoading(false);
      },
      (err) => {
        console.error('live_classes listener error:', err);
        setListLoading(false);
      }
    );
    return unsub;
  }, [user?.uid]);

  /* ── Publish new class ── */
  const handlePublish = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });

    const link = normaliseMeetLink(meetLink);
    if (!link.includes('meet.google.com')) {
      setFormMsg({ type: 'error', text: 'Please enter a valid Google Meet link.' });
      return;
    }

    setPublishing(true);
    try {
      await addDoc(collection(db, 'live_classes'), {
        title: title.trim(),
        target_group: targetGroup,
        meet_link: link,
        teacher_name: user.displayName || user.name || 'Teacher',
        teacher_id: user.uid,
        scheduled_at: Timestamp.fromDate(new Date(scheduledAt)),
        is_active: true,
        created_at: serverTimestamp(),
      });
      setFormMsg({ type: 'success', text: 'Live class published successfully!' });
      setTitle('');
      setTargetGroup('');
      setMeetLink('');
      // reset scheduled to now
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setScheduledAt(now.toISOString().slice(0, 16));
    } catch (err) {
      console.error(err);
      setFormMsg({ type: 'error', text: 'Failed to publish. Please try again.' });
    } finally {
      setPublishing(false);
    }
  };

  /* ── End / reactivate session ── */
  const toggleActive = async (cls) => {
    setTogglingId(cls.id);
    try {
      await updateDoc(doc(db, 'live_classes', cls.id), {
        is_active: !cls.is_active,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  /* ── Delete class ── */
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'live_classes', id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  /* ── Format Firestore timestamp ── */
  const fmtDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading) return null;

  /* ── Derived stats ── */
  const activeCount = classes.filter((c) => c.is_active).length;
  const endedCount = classes.filter((c) => !c.is_active).length;

  return (
    <>
      <Seo title="Live Classes — Teacher Dashboard" description="Create and manage your live classes." />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* ── Page Header ── */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-brand-purple" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Live Classes</h1>
            </div>
            <p className="text-gray-500 ml-[52px]">Create, manage, and end your live class sessions.</p>
          </div>

          {/* ── Stat pills ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-black text-gray-900">{classes.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">Active</p>
              <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Ended</p>
              <p className="text-2xl font-black text-gray-500">{endedCount}</p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              SECTION 1 — Create New Live Class
             ══════════════════════════════════════════════════ */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                <Plus className="w-4.5 h-4.5 text-brand-purple" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Create New Live Class</h2>
            </div>

            {formMsg.text && (
              <div
                className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold text-center border ${
                  formMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-red-50 text-red-600 border-red-100'
                }`}
              >
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handlePublish} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <Type className="w-3.5 h-3.5 text-gray-400" /> Class Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rotational Motion — Doubt Solving"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 transition-all text-base"
                />
              </div>

              {/* Target Group */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-gray-400" /> Target Group
                </label>
                <select
                  required
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 text-gray-600 transition-all text-base"
                >
                  <option value="">Select category</option>
                  {TARGET_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Google Meet Link */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-gray-400" /> Google Meet Link
                </label>
                <input
                  type="text"
                  required
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="meet.google.com/abc-defg-hij"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 transition-all text-base"
                />
              </div>

              {/* Schedule Date & Time */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-gray-400" /> Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple bg-gray-50/50 transition-all text-base"
                />
              </div>

              {/* Spacer on md+ so button sits below Meet Link */}
              <div className="hidden md:block" />

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={publishing}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-bold text-base transition-all flex items-center justify-center gap-2 shadow-md ${
                    publishing
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-brand-purple hover:bg-brand-purple-dark hover:shadow-lg hover:shadow-brand-purple/20 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {publishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Publishing…
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" /> Publish Live Class
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* ══════════════════════════════════════════════════
              SECTION 2 — Active & Past Classes
             ══════════════════════════════════════════════════ */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                <Clock className="w-4.5 h-4.5 text-brand-purple" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your Classes</h2>
            </div>

            {listLoading ? (
              <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading classes…
              </div>
            ) : classes.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Video className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">No classes yet. Create your first live class above!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`bg-white rounded-2xl border shadow-sm p-5 sm:p-6 transition-all hover:shadow-md ${
                      cls.is_active ? 'border-emerald-200' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left — Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{cls.title}</h3>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              cls.is_active
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                cls.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                              }`}
                            />
                            {cls.is_active ? 'Active' : 'Ended'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" /> {cls.target_group}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3.5 h-3.5" /> {fmtDate(cls.scheduled_at)}
                          </span>
                          {cls.meet_link && (
                            <a
                              href={cls.meet_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-brand-purple hover:underline font-medium"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Meet Link
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Right — Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Toggle Active */}
                        <button
                          onClick={() => toggleActive(cls)}
                          disabled={togglingId === cls.id}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            cls.is_active
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          } disabled:opacity-50`}
                        >
                          {togglingId === cls.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <StopCircle className="w-3.5 h-3.5" />
                          )}
                          {cls.is_active ? 'End Session' : 'Reactivate'}
                        </button>

                        {/* Delete */}
                        {confirmDeleteId === cls.id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDelete(cls.id)}
                              disabled={deletingId === cls.id}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                              {deletingId === cls.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                'Confirm'
                              )}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(cls.id)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── Delete confirmation overlay (small screen fallback) ── */}
    </>
  );
}
