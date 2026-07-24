import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import Seo from '../components/Seo';
import examData from '../data/examData';
import { aiMlCourses } from '../data/aiMlData';
import { codingCourses } from '../data/codingData';
import {
  Save,
  FileText,
  MessageCircle,
  MoreVertical,
  BarChart3,
  Award,
  Users,
  GraduationCap,
  FileSpreadsheet,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Search,
  X,
  Sparkles,
  UserPlus,
  Loader2,
  CheckSquare,
  Square,
  MinusSquare,
  Hash,
} from 'lucide-react';

/* ────────────────────────────────────────────────
   Subject mappings per batch / exam type
   ──────────────────────────────────────────────── */
const SUBJECT_MAP = {
  // Competitive Exams — keyed by examData id
  jee: ['Physics', 'Chemistry', 'Mathematics'],
  neet: ['Physics', 'Chemistry', 'Biology'],
  upsc: ['General Studies', 'CSAT', 'Optional Subject', 'Essay'],
  ssc: ['Quantitative Aptitude', 'English Language', 'General Intelligence & Reasoning', 'General Awareness'],
  banking: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General/Banking Awareness', 'Computer Knowledge'],
  cat: ['Verbal Ability & Reading Comprehension', 'Data Interpretation & Logical Reasoning', 'Quantitative Ability'],
  gate: ['Core Engineering Subject', 'Engineering Mathematics', 'General Aptitude'],
  cuet: ['Languages', 'Domain Subjects', 'General Test'],
  clat: ['English Language', 'Current Affairs & GK', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques'],
  nda: ['Mathematics', 'Geography', 'History', 'English', 'General Knowledge', 'Science'],
  ielts: ['Reading', 'Writing', 'Listening', 'Speaking'],
};

// For coding / AI-ML courses, build keys the same way TeacherDashboard does
const buildCourseSubjects = () => {
  const map = {};
  aiMlCourses.forEach(c => {
    const key = c.title.toLowerCase().replace(/\s+/g, '-');
    map[key] = c.tags || ['Project Work'];
  });
  codingCourses.forEach(c => {
    const key = c.title.toLowerCase().replace(/\s+/g, '-');
    map[key] = c.tags || ['Project Work'];
  });
  return map;
};

const COURSE_SUBJECT_MAP = buildCourseSubjects();

/** Returns the subject list for a given batch id */
function getSubjectsForBatch(batchId) {
  if (SUBJECT_MAP[batchId]) return SUBJECT_MAP[batchId];
  if (COURSE_SUBJECT_MAP[batchId]) return COURSE_SUBJECT_MAP[batchId];
  return ['General'];
}

/** Suggested default max marks for a batch (faculty can override) */
function getDefaultMaxMarks(batchId) {
  if (['jee', 'neet'].includes(batchId)) return 300;
  return 100;
}

/* ────────────────────────────────────────────────
   Reusable sub-components
   ──────────────────────────────────────────────── */

/* Animated Number Counter */
function AnimatedNumber({ value, duration = 1200, suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    }

    ref.current = requestAnimationFrame(tick);
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <span>{display}{suffix}</span>;
}

/* Tooltip */
function Tooltip({ children, text }) {
  return (
    <div className="relative group/tooltip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
      </div>
    </div>
  );
}

/* Filter Select */
function FilterSelect({ icon: Icon, label, value, onChange, children, disabled }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[160px]">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <select
        disabled={disabled}
        className="appearance-none bg-white/80 border border-gray-200/80 rounded-xl py-2.5 px-3.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all cursor-pointer hover:border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        value={value}
        onChange={onChange}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        {children}
      </select>
    </div>
  );
}

/* Filter Input (for test name) */
function FilterInput({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[180px]">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <input
        type="text"
        className="bg-white/80 border border-gray-200/80 rounded-xl py-2.5 px-3.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all hover:border-gray-300 hover:bg-white placeholder:text-gray-400 placeholder:font-normal"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

/* Percentile Bar */
function PercentileBar({ value }) {
  const color = value >= 90
    ? 'from-emerald-400 to-emerald-500'
    : value >= 70
      ? 'from-amber-400 to-amber-500'
      : 'from-rose-400 to-rose-500';

  const textColor = value >= 90
    ? 'text-emerald-700'
    : value >= 70
      ? 'text-amber-700'
      : 'text-rose-700';

  const bgColor = value >= 90
    ? 'bg-emerald-50'
    : value >= 70
      ? 'bg-amber-50'
      : 'bg-rose-50';

  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className={`relative w-full h-2 rounded-full ${bgColor} overflow-hidden`}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className={`text-sm font-bold tabular-nums ${textColor} min-w-[48px] text-right`}>
        {value}%
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Student Picker Modal
   ──────────────────────────────────────────────── */
function StudentPickerModal({ students, loading, onConfirm, onClose }) {
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');

  const filtered = search
    ? students.filter(s => (s.name || '').toLowerCase().includes(search.toLowerCase()))
    : students;

  const allFilteredSelected = filtered.length > 0 && filtered.every(s => selected.has(s.id));
  const someFilteredSelected = filtered.some(s => selected.has(s.id));

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(s => next.delete(s.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(s => next.add(s.id));
        return next;
      });
    }
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-elevated w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Select Students</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all"
              aria-label="Search students"
            />
          </div>
        </div>

        {/* Student list */}
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-brand-purple">
              <Loader2 className="w-7 h-7 animate-spin mb-3" />
              <p className="text-sm text-gray-500 font-medium">Loading students…</p>
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No students found</p>
              <p className="text-xs text-gray-400 mt-1">There are no students enrolled in your selected batch.</p>
            </div>
          ) : (
            <>
              {/* Select all */}
              <button
                onClick={toggleAll}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 mb-1"
              >
                {allFilteredSelected
                  ? <CheckSquare className="w-5 h-5 text-brand-purple" />
                  : someFilteredSelected
                    ? <MinusSquare className="w-5 h-5 text-brand-purple/60" />
                    : <Square className="w-5 h-5 text-gray-400" />
                }
                Select all ({filtered.length})
              </button>

              {filtered.map(student => {
                const isSelected = selected.has(student.id);
                return (
                  <button
                    key={student.id}
                    onClick={() => toggleOne(student.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${isSelected ? 'bg-brand-purple/5' : 'hover:bg-gray-50'
                      }`}
                  >
                    {isSelected
                      ? <CheckSquare className="w-5 h-5 text-brand-purple flex-shrink-0" />
                      : <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    }
                    <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple font-bold text-xs overflow-hidden flex-shrink-0">
                      {student.profile_url ? (
                        <img src={student.profile_url} alt={student.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name || 'S')}&background=random`; }} />
                      ) : (
                        (student.name || '?').charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`font-medium truncate ${isSelected ? 'text-brand-purple' : 'text-gray-800'}`}>
                        {student.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{student.email || 'No email'}</p>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-xs text-gray-500 font-medium">
            {selected.size} student{selected.size !== 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(students.filter(s => selected.has(s.id)))}
              disabled={selected.size === 0}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-purple to-brand-purple-light rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 duration-200"
            >
              Add {selected.size > 0 ? selected.size : ''} Student{selected.size !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────── */
export default function FacultyMarksUpload() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  // ── Batches state ──
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(true);

  // ── Filter state ──
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [subject, setSubject] = useState('All Subjects');
  const [testName, setTestName] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);

  // ── Student picker ──
  const [showPicker, setShowPicker] = useState(false);
  const [batchStudents, setBatchStudents] = useState([]); // raw from Firestore
  const [loadingStudents, setLoadingStudents] = useState(false);

  // ── Table students (added to marks table) ──
  const [students, setStudents] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [parentsNotified, setParentsNotified] = useState(0);

  // Derived subjects for selected batch
  const subjects = selectedBatchId ? getSubjectsForBatch(selectedBatchId) : [];
  const totalMaxMarks = subjects.length * maxMarks;

  // ── Stats ──
  const totalStudents = students.length;
  const avgMarks = students.length > 0
    ? Math.round(students.reduce((acc, curr) => acc + (curr.total || 0), 0) / students.length)
    : 0;
  const highestPercentile = students.length > 0
    ? Math.max(...students.map(s => s.percentile || 0)).toFixed(1)
    : 0;

  // ── Protect route ──
  useEffect(() => {
    if (!loading) {
      if (!user || (role !== 'Faculty' && role !== 'SuperAdmin')) {
        navigate('/');
      }
    }
  }, [user, role, loading, navigate]);

  // ── Fetch assigned batches (same pattern as TeacherDashboard / TeacherStudents) ──
  useEffect(() => {
    async function fetchBatches() {
      if (!user) return;
      setLoadingBatches(true);
      try {
        let assignedBatchesArr = user.assigned_batches || [];
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            assignedBatchesArr = userDocSnap.data().assigned_batches || assignedBatchesArr;
          }
        } catch (err) {
          console.warn("Could not fetch fresh user", err);
        }

        if (assignedBatchesArr.length > 0) {
          let firebaseBatchList = [];
          try {
            const batchesQuery = query(collection(db, 'batches'));
            const batchesSnapshot = await getDocs(batchesQuery);
            firebaseBatchList = batchesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          } catch (batchErr) {
            console.warn("Could not fetch batches", batchErr);
          }

          const staticBatches = [
            ...examData.map(e => ({ id: e.id, name: e.shortName || e.name })),
            ...aiMlCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title })),
            ...codingCourses.map(c => ({ id: c.title.toLowerCase().replace(/\s+/g, '-'), name: c.title }))
          ];

          const allSystemBatches = [...staticBatches, ...firebaseBatchList];
          const uniqueBatchesMap = new Map();
          allSystemBatches.forEach(b => uniqueBatchesMap.set(b.id, b));
          const finalBatchList = Array.from(uniqueBatchesMap.values());

          const assigned = finalBatchList.filter(b => assignedBatchesArr.includes(b.id));
          setAssignedBatches(assigned);

          if (assigned.length > 0) {
            setSelectedBatchId(assigned[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoadingBatches(false);
      }
    }
    fetchBatches();
  }, [user]);

  // ── Reset table & subject when batch changes ──
  useEffect(() => {
    setStudents([]);
    setSavedIds(new Set());
    setSubject('All Subjects');
    setTestName('');
    setMaxMarks(selectedBatchId ? getDefaultMaxMarks(selectedBatchId) : 100);
  }, [selectedBatchId]);

  // ── Fetch students for the picker (when it opens) ──
  const openStudentPicker = async () => {
    if (!selectedBatchId) return;
    setShowPicker(true);
    setLoadingStudents(true);
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'Student'),
        where('assigned_batches', 'array-contains', selectedBatchId)
      );
      const snap = await getDocs(studentsQuery);
      setBatchStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  // ── Confirm student selection from picker ──
  const handleStudentsConfirmed = (selectedStudents) => {
    // Only add students not already in the table
    const existingIds = new Set(students.map(s => s.id));
    const newStudents = selectedStudents
      .filter(s => !existingIds.has(s.id))
      .map(s => {
        // Build an object with a marks field for each subject
        const marks = {};
        subjects.forEach(sub => {
          marks[sub] = 0;
        });
        return {
          id: s.id,
          name: s.name || 'Unknown',
          email: s.email || '',
          profile_url: s.profile_url || '',
          parentPhone: s.parentPhone || '',
          phone: s.phone || '',
          marks,
          total: 0,
          percentile: 0,
        };
      });

    setStudents(prev => [...prev, ...newStudents]);
    setShowPicker(false);
  };

  // ── Inline marks editing ──
  const handleMarksChange = (studentId, subjectName, value) => {
    const numValue = value === '' ? 0 : parseInt(value);
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedMarks = { ...student.marks, [subjectName]: numValue };
        const total = Object.values(updatedMarks).reduce((sum, v) => sum + (v || 0), 0);
        const percentage = (total / totalMaxMarks) * 100;
        const percentile = isNaN(percentage) ? 0 : parseFloat(Math.min(percentage + (Math.random() * 5), 100).toFixed(1));
        return { ...student, marks: updatedMarks, total, percentile };
      }
      return student;
    }));
    setSavedIds(prev => {
      const next = new Set(prev);
      next.delete(studentId);
      return next;
    });
  };

  // ── Save marks to Firestore ──
  const handleSave = async (student) => {
    try {
      const marksRef = collection(db, 'marks');
      await addDoc(marksRef, {
        studentName: student.name,
        studentId: student.id,
        subjectMarks: student.marks,
        total: student.total,
        percentile: student.percentile,
        batchId: selectedBatchId,
        batchName: assignedBatches.find(b => b.id === selectedBatchId)?.name || selectedBatchId,
        testName,
        facultyUid: user?.uid || 'unknown',
        timestamp: serverTimestamp()
      });
      setSavedIds(prev => new Set(prev).add(student.id));
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Failed to save marks: " + error.message);
    }
  };

  // ── WhatsApp notification ──
  const [whatsAppTarget, setWhatsAppTarget] = useState(null); // student object awaiting phone input
  const [whatsAppPhone, setWhatsAppPhone] = useState('');

  /** Normalize phone: strip non-digits, auto-prepend 91 for 10-digit Indian numbers */
  const normalizePhone = (raw) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  /** Build the WhatsApp message for a student */
  const buildWhatsAppMessage = (student) => {
    const batchName = assignedBatches.find(b => b.id === selectedBatchId)?.name || selectedBatchId;
    const marksLines = subjects.map(sub => `📘 ${sub}: ${student.marks[sub] || 0}/${maxMarks}`).join('\n');
    return (
      `📋 *Instructis — Student Report*\n\n` +
      `👤 *Student:* ${student.name}\n` +
      `📚 *Batch:* ${batchName}\n` +
      `📝 *Test:* ${testName || 'Test'}\n\n` +
      `${marksLines}\n\n` +
      `📊 *Total:* ${student.total}/${totalMaxMarks}\n` +
      `🏆 *Percentile:* ${student.percentile}%\n\n` +
      `_Best Regards, Instructis._`
    );
  };

  /** Open WhatsApp with the given phone and message */
  const openWhatsApp = (phone, student) => {
    const cleanPhone = normalizePhone(phone);
    const message = buildWhatsAppMessage(student);
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    // Use a dynamically created anchor to bypass popup blockers
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setParentsNotified(prev => prev + 1);
  };

  /** Main handler: if phone exists, open immediately; otherwise show phone input modal */
  const handleWhatsApp = (student) => {
    const phone = student.parentPhone || student.phone;

    if (phone) {
      openWhatsApp(phone, student);
    } else {
      // Show inline phone input modal
      setWhatsAppTarget(student);
      setWhatsAppPhone('');
    }
  };

  /** Called when faculty submits the phone number from the modal */
  const handleWhatsAppPhoneSubmit = () => {
    if (!whatsAppPhone.trim() || !whatsAppTarget) return;

    const phone = whatsAppPhone.trim();
    const studentId = whatsAppTarget.id;

    // Save phone to Firestore (fire-and-forget)
    const userRef = doc(db, 'users', studentId);
    updateDoc(userRef, { parentPhone: phone }).catch(err => {
      console.error("Could not save phone number:", err);
    });

    // Update local state so it doesn't ask again
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, parentPhone: phone } : s));

    // Open WhatsApp
    openWhatsApp(phone, whatsAppTarget);

    // Close modal
    setWhatsAppTarget(null);
    setWhatsAppPhone('');
  };

  // ── Filtered students for search ──
  const filteredStudents = searchTerm
    ? students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : students;

  // ── Performance tier for avatar ring ──
  const getAvatarRing = (percentile) => {
    if (percentile >= 90) return 'ring-2 ring-emerald-400 ring-offset-2';
    if (percentile >= 70) return 'ring-2 ring-amber-400 ring-offset-2';
    return 'ring-2 ring-gray-200 ring-offset-2';
  };

  // Mark validation
  const isMarkValid = (val) => val >= 0 && val <= maxMarks;

  // Current batch name
  const currentBatchName = assignedBatches.find(b => b.id === selectedBatchId)?.name || '';

  return (
    <main className="font-sans space-y-6" aria-label="Faculty Marks Upload">
      <Seo
        title="Faculty marks upload"
        description="Secure internal portal for faculty to upload and manage student marks."
        noIndex
      />

      {/* ─── Page Header ─── */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-purple">Marks Upload</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-brand-purple via-brand-purple-light to-brand-orange bg-clip-text text-transparent">
              Marks Upload
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a batch, add students, enter marks, and notify parents — all in one place.
          </p>
        </div>
        {students.length > 0 && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all w-64"
                aria-label="Search students"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ─── Filter Panel ─── */}
      <section
        className="glass-card rounded-2xl p-5 shadow-card transition-shadow hover:shadow-card-hover"
        aria-label="Class Filters"
      >
        <div className="flex flex-col xl:flex-row xl:items-end gap-5">
          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4 flex-1">
            {/* Exam / Batch dropdown — dynamically populated from assigned batches */}
            <FilterSelect
              icon={GraduationCap}
              label="Exam / Batch"
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              disabled={loadingBatches}
            >
              {loadingBatches ? (
                <option value="">Loading batches…</option>
              ) : assignedBatches.length === 0 ? (
                <option value="">No batches assigned</option>
              ) : (
                <>
                  <option value="">Select a batch</option>
                  {assignedBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </>
              )}
            </FilterSelect>

            {/* Subject dropdown — dynamic based on selected batch */}
            <FilterSelect
              icon={Sparkles}
              label="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              disabled={!selectedBatchId}
            >
              <option value="All Subjects">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </FilterSelect>

            {/* Test Name — text input */}
            <FilterInput
              icon={FileText}
              label="Test Name"
              value={testName}
              onChange={e => setTestName(e.target.value)}
              placeholder="e.g. Mock Test 1"
            />

            {/* Max Marks per subject — faculty editable */}
            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Hash className="w-3.5 h-3.5" />
                Max Marks <span className="text-gray-400 font-normal normal-case">(per subject)</span>
              </label>
              <input
                type="number"
                min="1"
                className="bg-white/80 border border-gray-200/80 rounded-xl py-2.5 px-3.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all hover:border-gray-300 hover:bg-white w-full tabular-nums"
                value={maxMarks}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v > 0) setMaxMarks(v);
                }}
                aria-label="Maximum marks per subject"
              />
            </div>
          </div>

          {/* Add Student button */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={openStudentPicker}
              disabled={!selectedBatchId}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 border border-brand-purple/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
              aria-label="Add students from batch"
            >
              <UserPlus className="w-4.5 h-4.5" />
              <span className="text-sm">Add Students</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── KPI Stats Strip ─── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Performance overview">
        {/* Students */}
        <div className="group glass-card rounded-2xl p-5 flex items-center gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-purple/10 to-brand-purple-light/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Users className="w-5.5 h-5.5 text-brand-purple" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Students</p>
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums leading-tight mt-0.5">
              <AnimatedNumber value={totalStudents} />
            </p>
          </div>
        </div>

        {/* Avg Marks */}
        <div className="group glass-card rounded-2xl p-5 flex items-center gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-emerald/10 to-emerald-200/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <BarChart3 className="w-5.5 h-5.5 text-accent-emerald" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg. Marks</p>
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums leading-tight mt-0.5">
              <AnimatedNumber value={avgMarks} />
              <span className="text-sm text-gray-400 font-medium ml-1">/ {totalMaxMarks}</span>
            </p>
          </div>
        </div>

        {/* Highest Percentile */}
        <div className="group glass-card rounded-2xl p-5 flex items-center gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-amber/10 to-amber-200/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Award className="w-5.5 h-5.5 text-accent-amber" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Highest %ile</p>
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums leading-tight mt-0.5">
              <AnimatedNumber value={parseFloat(highestPercentile)} suffix="%" />
            </p>
          </div>
        </div>

        {/* Parents Notified */}
        <div className="group glass-card rounded-2xl p-5 flex items-center gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-rose/10 to-rose-200/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <MessageCircle className="w-5.5 h-5.5 text-accent-rose" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Parents Notified</p>
            <p className="text-2xl font-extrabold text-gray-900 tabular-nums leading-tight mt-0.5">
              <AnimatedNumber value={parentsNotified} />
            </p>
          </div>
        </div>
      </section>

      {/* ─── Data Table ─── */}
      <section
        className="glass-card rounded-2xl shadow-card overflow-hidden transition-shadow hover:shadow-card-hover"
        aria-label="Student marks table"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50/90 to-gray-100/70 border-b-2 border-brand-purple/10">
                <th scope="col" className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-brand-purple bg-white border-gray-300 rounded focus:ring-brand-purple/40 cursor-pointer"
                    aria-label="Select all students"
                  />
                </th>
                <th scope="col" className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                {/* Dynamic subject columns */}
                {(subject === 'All Subjects' ? subjects : subjects.filter(s => s === subject)).map(sub => (
                  <th key={sub} scope="col" className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {sub} <span className="text-gray-400 font-normal">({maxMarks})</span>
                  </th>
                ))}
                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total <span className="text-gray-400 font-normal">({totalMaxMarks})</span>
                </th>
                <th scope="col" className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Percentile
                </th>
                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {filteredStudents.map((student, index) => {
                const isSaved = savedIds.has(student.id);
                const visibleSubjects = subject === 'All Subjects' ? subjects : subjects.filter(s => s === subject);

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-brand-purple/[0.02] transition-colors duration-150 group/row"
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-brand-purple bg-white border-gray-300 rounded focus:ring-brand-purple/40 cursor-pointer"
                        aria-label={`Select ${student.name}`}
                      />
                    </td>

                    {/* Student Name + Avatar */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 ${getAvatarRing(student.percentile)} transition-all duration-300`}>
                          {student.profile_url ? (
                            <img
                              src={student.profile_url}
                              alt={`${student.name} avatar`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`; }}
                            />
                          ) : (
                            <img
                              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`}
                              alt={`${student.name} avatar`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 text-sm">{student.name}</span>
                          {isSaved && (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Saved
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Dynamic subject mark inputs */}
                    {visibleSubjects.map(sub => (
                      <td key={sub} className="px-4 py-4">
                        <div className="flex justify-center">
                          <input
                            type="number"
                            min="0"
                            max={maxMarks}
                            className={`w-[72px] text-center py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${!isMarkValid(student.marks[sub] || 0)
                              ? 'border-rose-300 bg-rose-50/50 text-rose-700 focus:ring-rose-300'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 focus:ring-brand-purple/30 focus:border-brand-purple'
                              }`}
                            value={student.marks[sub] || 0}
                            onChange={(e) => handleMarksChange(student.id, sub, e.target.value)}
                            aria-label={`${student.name} ${sub} marks`}
                          />
                        </div>
                      </td>
                    ))}

                    {/* Total */}
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-baseline gap-1">
                        <span className="text-base font-bold text-gray-900 tabular-nums">{student.total}</span>
                        <span className="text-xs text-gray-400 font-medium">/ {totalMaxMarks}</span>
                      </div>
                    </td>

                    {/* Percentile */}
                    <td className="px-4 py-4">
                      <PercentileBar value={student.percentile} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <div className="inline-flex items-center bg-gray-50 rounded-xl p-1 gap-0.5 opacity-70 group-hover/row:opacity-100 transition-opacity duration-200">
                          <Tooltip text={isSaved ? 'Saved!' : 'Save marks'}>
                            <button
                              onClick={() => handleSave(student)}
                              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${isSaved
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'hover:bg-brand-purple/10 text-gray-500 hover:text-brand-purple'
                                }`}
                              aria-label={`Save marks for ${student.name}`}
                            >
                              {isSaved
                                ? <CheckCircle2 className="w-4 h-4" />
                                : <Save className="w-4 h-4" />
                              }
                            </button>
                          </Tooltip>
                          <Tooltip text="Notify via WhatsApp">
                            <button
                              onClick={() => handleWhatsApp(student)}
                              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-emerald-100 text-gray-500 hover:text-emerald-600 transition-all duration-200"
                              aria-label={`Notify parent of ${student.name} via WhatsApp`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* ─── Empty State ─── */}
              {students.length === 0 && (
                <tr>
                  <td colSpan={subjects.length + 5} className="px-4 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      {/* Decorative icon cluster */}
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-brand-purple/5 to-brand-orange/5 rounded-2xl flex items-center justify-center rotate-3">
                          <FileSpreadsheet className="w-9 h-9 text-brand-purple/40" />
                        </div>
                        <div className="absolute -top-2 -right-3 w-10 h-10 bg-gradient-to-br from-accent-emerald/10 to-emerald-100/30 rounded-xl flex items-center justify-center -rotate-12 shadow-sm">
                          <TrendingUp className="w-5 h-5 text-accent-emerald/60" />
                        </div>
                        <div className="absolute -bottom-2 -left-3 w-10 h-10 bg-gradient-to-br from-accent-amber/10 to-amber-100/30 rounded-xl flex items-center justify-center rotate-6 shadow-sm">
                          <Award className="w-5 h-5 text-accent-amber/60" />
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mb-1.5">No students added yet</h3>
                      <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
                        {selectedBatchId
                          ? `Click "Add Students" to fetch students from the ${currentBatchName} batch and start entering marks.`
                          : 'Select a batch from the filters above first, then add students to start entering marks.'
                        }
                      </p>
                      {selectedBatchId && (
                        <button
                          onClick={openStudentPicker}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 text-sm"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add Students
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Search no results */}
              {students.length > 0 && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={subjects.length + 5} className="px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-base font-bold text-gray-600 mb-1">No results found</h3>
                      <p className="text-sm text-gray-400">
                        No students match "<span className="font-medium text-gray-500">{searchTerm}</span>"
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with count */}
        {students.length > 0 && (
          <div className="px-5 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">
              Showing <span className="text-gray-600 font-semibold">{filteredStudents.length}</span> of{' '}
              <span className="text-gray-600 font-semibold">{students.length}</span> students
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple/50" />
              <span>Percentiles are approximate</span>
            </div>
          </div>
        )}
      </section>

      {/* ─── Student Picker Modal ─── */}
      {showPicker && (
        <StudentPickerModal
          students={batchStudents}
          loading={loadingStudents}
          onConfirm={handleStudentsConfirmed}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* ─── WhatsApp Phone Input Modal ─── */}
      {whatsAppTarget && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setWhatsAppTarget(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Send via WhatsApp</h3>
                <p className="text-xs text-gray-500">Enter parent's number for <span className="font-semibold text-gray-700">{whatsAppTarget.name}</span></p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">+91</span>
                <input
                  type="tel"
                  autoFocus
                  value={whatsAppPhone}
                  onChange={(e) => setWhatsAppPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleWhatsAppPhoneSubmit()}
                  placeholder="9876543210"
                  className="flex-1 bg-white border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  maxLength={15}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">Enter 10 digit mobile number (91 prefix is added automatically)</p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setWhatsAppTarget(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleWhatsAppPhoneSubmit}
                disabled={!whatsAppPhone.trim()}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-500 rounded-xl shadow-md hover:bg-emerald-600 hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Send on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
