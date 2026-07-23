import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Seo from '../components/Seo';
import {
  History,
  ChevronRight,
  TrendingUp,
  Loader2,
  Calendar,
  Users,
  Search,
  X,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function FacultyMarksHistory() {
  const { user } = useAuth();
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTests, setExpandedTests] = useState(new Set()); // Tracks which tests are expanded

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'marks'),
          where('facultyUid', '==', user.uid)
        );
        const snap = await getDocs(q);
        const marks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by timestamp descending
        marks.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setMarksData(marks);
      } catch (err) {
        console.error("Error fetching marks history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

  const toggleTest = (testKey) => {
    setExpandedTests(prev => {
      const next = new Set(prev);
      if (next.has(testKey)) next.delete(testKey);
      else next.add(testKey);
      return next;
    });
  };

  // 1. Filter by search
  const filteredMarks = marksData.filter(m => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (m.studentName || '').toLowerCase().includes(term) ||
      (m.batchName || '').toLowerCase().includes(term) ||
      (m.testName || '').toLowerCase().includes(term)
    );
  });

  // 2. Group by Batch -> Test
  const groupedMarks = filteredMarks.reduce((acc, curr) => {
    const b = curr.batchName || 'General';
    const t = curr.testName || 'Test';
    
    if (!acc[b]) acc[b] = {};
    if (!acc[b][t]) acc[b][t] = { students: [], timestamp: curr.timestamp };
    
    acc[b][t].students.push(curr);
    // Keep the most recent timestamp for the test group
    if (curr.timestamp?.seconds > (acc[b][t].timestamp?.seconds || 0)) {
      acc[b][t].timestamp = curr.timestamp;
    }
    
    return acc;
  }, {});

  const totalRecords = marksData.length;

  return (
    <main className="flex-1 p-4 lg:p-8 font-sans w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Seo title="Marks History | Instructis" description="View past marks uploaded." noIndex />

      {/* Header section */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-purple">Marks History</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Marks <span className="bg-gradient-to-r from-brand-purple to-brand-orange bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review the past test results you have uploaded.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick Stat */}
          <div className="hidden md:flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Uploads</p>
              <p className="text-lg font-bold text-gray-900 leading-none">{totalRecords}</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-all w-full sm:w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-purple animate-spin mb-4" />
          <p className="text-sm text-gray-500 font-medium">Loading your history...</p>
        </div>
      ) : Object.keys(groupedMarks).length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSpreadsheet className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No history found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            {searchTerm ? "No results match your search." : "You haven't uploaded any marks yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {Object.entries(groupedMarks).map(([batchName, tests]) => (
            <div key={batchName} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Batch Header */}
              <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{batchName}</h2>
                  <p className="text-xs text-gray-500 font-medium">{Object.keys(tests).length} Tests</p>
                </div>
              </div>

              {/* Tests Accordion */}
              <div className="divide-y divide-gray-100">
                {Object.entries(tests).map(([testName, testData]) => {
                  const testKey = `${batchName}-${testName}`;
                  const isExpanded = expandedTests.has(testKey);
                  
                  const dateStr = testData.timestamp 
                    ? new Date(testData.timestamp.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Recent';

                  // Derive subjects from the first student in this test
                  const sampleStudent = testData.students[0];
                  const subjects = sampleStudent?.subjectMarks ? Object.keys(sampleStudent.subjectMarks) : [];

                  return (
                    <div key={testKey} className="group transition-colors">
                      {/* Accordion Header */}
                      <button
                        onClick={() => toggleTest(testKey)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-brand-purple/10 text-brand-purple' : 'bg-gray-100 text-gray-500'}`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                          <div className="text-left">
                            <h3 className="text-base font-bold text-gray-900">{testName}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 font-medium">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dateStr}</span>
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {testData.students.length} Students</span>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Accordion Body (Students Table) */}
                      {isExpanded && (
                        <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                          <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Student</th>
                                  {subjects.map(sub => (
                                    <th key={sub} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{sub}</th>
                                  ))}
                                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">%ile</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 bg-white">
                                {testData.students.map(student => (
                                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                      <p className="text-sm font-semibold text-gray-900">{student.studentName}</p>
                                    </td>
                                    {subjects.map(sub => (
                                      <td key={sub} className="px-4 py-3 text-sm text-gray-600 tabular-nums">
                                        {student.subjectMarks?.[sub] ?? '-'}
                                      </td>
                                    ))}
                                    <td className="px-4 py-3 text-sm font-bold text-gray-900 tabular-nums">
                                      {student.total}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tabular-nums ${
                                        student.percentile >= 90 ? 'bg-emerald-50 text-emerald-700' : 
                                        student.percentile >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                                      }`}>
                                        {student.percentile}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
