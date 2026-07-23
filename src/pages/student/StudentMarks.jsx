import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Seo from '../../components/Seo';
import {
  FileSpreadsheet,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Loader2,
  Trophy,
} from 'lucide-react';

export default function StudentMarks() {
  const { user } = useAuth();
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarks() {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, 'marks'),
          where('studentId', '==', user.uid)
        );
        const snap = await getDocs(q);
        const marks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort descending by timestamp
        marks.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
        setMarksData(marks);
      } catch (err) {
        console.error("Error fetching marks", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMarks();
  }, [user]);

  // Group by batchName
  const groupedMarks = marksData.reduce((acc, curr) => {
    const batch = curr.batchName || 'General';
    if (!acc[batch]) acc[batch] = [];
    acc[batch].push(curr);
    return acc;
  }, {});

  const totalTests = marksData.length;
  const bestPercentile = totalTests > 0 
    ? Math.max(...marksData.map(m => m.percentile || 0)).toFixed(1)
    : 0;

  return (
    <main className="flex-1 p-4 lg:p-8 font-sans w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Seo title="My Marks | Instructis" description="View your test marks and performance." noIndex />

      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-purple">My Marks</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            My <span className="bg-gradient-to-r from-brand-purple to-brand-orange bg-clip-text text-transparent">Marks</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your performance across all batches and subjects.
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Tests</p>
              <p className="text-lg font-bold text-gray-900 leading-none">{totalTests}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Best %ile</p>
              <p className="text-lg font-bold text-gray-900 leading-none">{bestPercentile}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-brand-purple animate-spin mb-4" />
          <p className="text-sm text-gray-500 font-medium">Loading your performance data...</p>
        </div>
      ) : marksData.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No marks available</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            You haven't been assigned any marks yet. Check back later once your faculty uploads test results.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMarks).map(([batchName, batchMarks]) => (
            <div key={batchName} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Batch Header */}
              <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-md">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{batchName}</h2>
                  <p className="text-xs text-gray-500 font-medium">{batchMarks.length} Tests Recorded</p>
                </div>
              </div>

              {/* Marks List */}
              <div className="divide-y divide-gray-100">
                {batchMarks.map((mark) => {
                  const dateStr = mark.timestamp 
                    ? new Date(mark.timestamp.seconds * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : 'Recent';

                  // Dynamic subjects
                  const subjectEntries = Object.entries(mark.subjectMarks || {});

                  return (
                    <div key={mark.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            {mark.testName || 'Test'}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {dateStr}
                          </div>
                        </div>

                        {/* Totals & Percentile badges */}
                        <div className="flex items-center gap-3">
                          <div className="px-4 py-2 bg-gray-100 rounded-xl text-center">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Total</p>
                            <p className="text-sm font-bold text-gray-900 tabular-nums">{mark.total}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-xl text-center ${mark.percentile >= 90 ? 'bg-emerald-50 text-emerald-700' : mark.percentile >= 70 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">Percentile</p>
                            <p className="text-sm font-bold tabular-nums">{mark.percentile}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Subjects Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {subjectEntries.map(([subject, score]) => (
                          <div key={subject} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-xs text-gray-500 font-medium mb-1 truncate" title={subject}>{subject}</p>
                            <p className="text-lg font-bold text-gray-900 tabular-nums">{score}</p>
                          </div>
                        ))}
                      </div>
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
