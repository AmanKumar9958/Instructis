import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import Seo from '../components/Seo';
import {
  Save,
  FileText,
  MessageCircle,
  MoreVertical,
  Plus,
  Upload,
  BarChart3,
  Award,
  Users,
  GraduationCap,
  Filter,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Search,
  X,
  Sparkles,
  ArrowUpRight,
  CloudUpload,
  UserPlus,
} from 'lucide-react';

/* ── Animated Number Counter ── */
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

/* ── Tooltip wrapper ── */
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

/* ── Filter Select ── */
function FilterSelect({ icon: Icon, label, value, onChange, children }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[160px]">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      <select
        className="appearance-none bg-white/80 border border-gray-200/80 rounded-xl py-2.5 px-3.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all cursor-pointer hover:border-gray-300 hover:bg-white"
        value={value}
        onChange={onChange}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        {children}
      </select>
    </div>
  );
}

/* ── Percentile Bar ── */
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

export default function FacultyMarksUpload() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [exam, setExam] = useState('JEE');
  const [batch, setBatch] = useState('Select a batch');
  const [subject, setSubject] = useState('Select a subject');
  const [testName, setTestName] = useState('Select a test');
  const [uploading, setUploading] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Stats
  const totalStudents = students.length;
  const avgMarks = students.length > 0
    ? Math.round(students.reduce((acc, curr) => acc + (curr.total || 0), 0) / students.length)
    : 0;
  const highestPercentile = students.length > 0
    ? Math.max(...students.map(s => s.percentile || 0)).toFixed(1)
    : 0;
  const [parentsNotified, setParentsNotified] = useState(0);

  // Protect route
  useEffect(() => {
    if (!loading) {
      if (!user || (role !== 'Faculty' && role !== 'SuperAdmin')) {
        navigate('/');
      }
    }
  }, [user, role, loading, navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const parsedStudents = jsonData.map((row) => {
        const math = row.Math || row.math || 0;
        const physics = row.Physics || row.physics || 0;
        const chemistry = row.Chemistry || row.chemistry || 0;
        const total = math + physics + chemistry;
        // Mock percentile calculation based on total out of 900
        const percentage = (total / 900) * 100;
        const percentile = isNaN(percentage) ? 0 : Math.min(percentage + (Math.random() * 5), 100); // just a mock bump

        return {
          id: row.id || Math.random().toString(36).substring(7),
          name: row.Name || row.name || 'Unknown',
          math: parseInt(math),
          physics: parseInt(physics),
          chemistry: parseInt(chemistry),
          total: total,
          percentile: parseFloat(percentile.toFixed(1)),
          // Mock points for demonstration
          mp: Math.floor(Math.random() * 20),
          pp: Math.floor(Math.random() * 20),
          cp: Math.floor(Math.random() * 20),
        };
      });

      setStudents(parsedStudents);
      setSavedIds(new Set());
    };
    reader.readAsArrayBuffer(file);
  };

  const handleMarksChange = (id, field, value) => {
    const numValue = value === '' ? 0 : parseInt(value);
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student, [field]: numValue };
        updated.total = updated.math + updated.physics + updated.chemistry;
        updated.percentile = parseFloat(((updated.total / 900) * 100 + (Math.random() * 5)).toFixed(1)); // mock update
        return updated;
      }
      return student;
    }));
    // Remove saved state if edited again
    setSavedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleSave = async (student) => {
    try {
      const marksRef = collection(db, 'marks');
      await addDoc(marksRef, {
        studentName: student.name,
        subjectMarks: {
          Math: student.math,
          Physics: student.physics,
          Chemistry: student.chemistry,
        },
        total: student.total,
        percentile: student.percentile,
        batch,
        examType: exam,
        testName,
        facultyUid: user?.uid || 'unknown',
        timestamp: serverTimestamp()
      });
      setSavedIds(prev => new Set(prev).add(student.id));
    } catch (error) {
      console.error("Error saving marks:", error);
      alert("Failed to save marks.");
    }
  };

  const handleWhatsApp = (student) => {
    const message = `Hello Parent, here is the recent performance of ${student.name} for the ${exam} (${testName}) test:\nMath: ${student.math}/300\nPhysics: ${student.physics}/300\nChemistry: ${student.chemistry}/300\nTotal: ${student.total}/900\nPercentile: ${student.percentile}%\nBest Regards, Instructis.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setParentsNotified(prev => prev + 1);
  };

  // Filtered students by search
  const filteredStudents = searchTerm
    ? students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : students;

  // Performance tier for avatar ring
  const getAvatarRing = (percentile) => {
    if (percentile >= 90) return 'ring-2 ring-emerald-400 ring-offset-2';
    if (percentile >= 70) return 'ring-2 ring-amber-400 ring-offset-2';
    return 'ring-2 ring-gray-200 ring-offset-2';
  };

  // Mark validation
  const isMarkValid = (val) => val >= 0 && val <= 300;

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
            Upload student marks, track performance, and notify parents — all in one place.
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
            <FilterSelect
              icon={GraduationCap}
              label="Exam"
              value={exam}
              onChange={e => setExam(e.target.value)}
            >
              <option>JEE</option>
              <option>NEET</option>
            </FilterSelect>

            <FilterSelect
              icon={BookOpen}
              label="Batch"
              value={batch}
              onChange={e => setBatch(e.target.value)}
            >
              <option>Select a batch</option>
              <option>Titanium 2026</option>
              <option>Alpha 2025</option>
            </FilterSelect>

            <FilterSelect
              icon={Sparkles}
              label="Subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            >
              <option>Select a subject</option>
              <option>All Subjects</option>
              <option>Maths</option>
            </FilterSelect>

            <FilterSelect
              icon={FileText}
              label="Test Name"
              value={testName}
              onChange={e => setTestName(e.target.value)}
            >
              <option>Select a test</option>
              <option>Mains Mock Test 1</option>
              <option>Advanced Full Test</option>
            </FilterSelect>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-shrink-0">
            <div className="relative group">
              <input
                type="file"
                accept=".xlsx, .csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title="Upload Excel or CSV"
                aria-label="Upload spreadsheet file"
              />
              <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all border border-gray-200 shadow-sm hover:shadow-md group-hover:-translate-y-0.5 duration-200">
                <CloudUpload className="w-4.5 h-4.5 text-brand-purple group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm">Upload Sheet</span>
              </button>
            </div>
            <button
              className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 border border-brand-purple/20"
              aria-label="Add a student manually"
            >
              <UserPlus className="w-4.5 h-4.5" />
              <span className="text-sm">Add Student</span>
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
              <span className="text-sm text-gray-400 font-medium ml-1">/ 900</span>
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
                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Math <span className="text-gray-400 font-normal">(300)</span>
                </th>
                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Physics <span className="text-gray-400 font-normal">(300)</span>
                </th>
                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Chemistry <span className="text-gray-400 font-normal">(300)</span>
                </th>
                <th scope="col" className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total <span className="text-gray-400 font-normal">(900)</span>
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
                const pointsTotal = student.mp + student.pp + student.cp;

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-brand-purple/[0.02] transition-colors duration-150 group/row"
                    style={{ animationDelay: `${index * 40}ms` }}
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
                        <img
                          src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`}
                          alt={`${student.name} avatar`}
                          className={`w-10 h-10 rounded-full bg-gray-50 ${getAvatarRing(student.percentile)} transition-all duration-300`}
                        />
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

                    {/* Math */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min="0"
                          max="300"
                          className={`w-[72px] text-center py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            !isMarkValid(student.math)
                              ? 'border-rose-300 bg-rose-50/50 text-rose-700 focus:ring-rose-300'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 focus:ring-brand-purple/30 focus:border-brand-purple'
                          }`}
                          value={student.math}
                          onChange={(e) => handleMarksChange(student.id, 'math', e.target.value)}
                          aria-label={`${student.name} Math marks`}
                        />
                      </div>
                    </td>

                    {/* Physics */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min="0"
                          max="300"
                          className={`w-[72px] text-center py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            !isMarkValid(student.physics)
                              ? 'border-rose-300 bg-rose-50/50 text-rose-700 focus:ring-rose-300'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 focus:ring-brand-purple/30 focus:border-brand-purple'
                          }`}
                          value={student.physics}
                          onChange={(e) => handleMarksChange(student.id, 'physics', e.target.value)}
                          aria-label={`${student.name} Physics marks`}
                        />
                      </div>
                    </td>

                    {/* Chemistry */}
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min="0"
                          max="300"
                          className={`w-[72px] text-center py-2 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            !isMarkValid(student.chemistry)
                              ? 'border-rose-300 bg-rose-50/50 text-rose-700 focus:ring-rose-300'
                              : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 focus:ring-brand-purple/30 focus:border-brand-purple'
                          }`}
                          value={student.chemistry}
                          onChange={(e) => handleMarksChange(student.id, 'chemistry', e.target.value)}
                          aria-label={`${student.name} Chemistry marks`}
                        />
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-baseline gap-1">
                        <span className="text-base font-bold text-gray-900 tabular-nums">{student.total}</span>
                        <span className="text-xs text-gray-400 font-medium">/ 900</span>
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
                              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                                isSaved
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
                          <Tooltip text="View report">
                            <button
                              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-accent-rose/10 text-gray-500 hover:text-accent-rose transition-all duration-200"
                              aria-label={`View report for ${student.name}`}
                            >
                              <FileText className="w-4 h-4" />
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
                          <Tooltip text="More options">
                            <button
                              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200/70 text-gray-500 hover:text-gray-700 transition-all duration-200"
                              aria-label={`More options for ${student.name}`}
                            >
                              <MoreVertical className="w-4 h-4" />
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
                  <td colSpan="8" className="px-4 py-20">
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
                      <h3 className="text-lg font-bold text-gray-700 mb-1.5">No students to display</h3>
                      <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
                        Upload an Excel or CSV file to populate the table, or add a student manually to get started.
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <input
                            type="file"
                            accept=".xlsx, .csv"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            title="Upload Excel or CSV"
                            aria-label="Upload spreadsheet file"
                          />
                          <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-purple-light text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 text-sm">
                            <CloudUpload className="w-4 h-4" />
                            Upload Sheet
                          </button>
                        </div>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-xl border border-gray-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 text-sm">
                          <UserPlus className="w-4 h-4" />
                          Add Manually
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {/* Search no results */}
              {students.length > 0 && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-16">
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
    </main>
  );
}
