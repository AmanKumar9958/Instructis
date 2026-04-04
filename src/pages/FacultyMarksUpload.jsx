import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import {
  Save,
  FileText,
  MessageCircle,
  MoreVertical,
  Plus,
  Upload,
  BarChart,
  Award,
  Users
} from 'lucide-react';

export default function FacultyMarksUpload() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [exam, setExam] = useState('JEE');
  const [batch, setBatch] = useState('Select a batch');
  const [subject, setSubject] = useState('Select a subject');
  const [testName, setTestName] = useState('Select a test');
  const [uploading, setUploading] = useState(false);

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
    if (role && role !== 'Faculty' && role !== 'SuperAdmin') {
      navigate('/');
    }
  }, [role, navigate]);

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
      alert(`Saved marks for ${student.name} successfully!`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header / Filters Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 w-full">
            <h1 className="font-bold text-gray-800 text-lg mr-4">Class Filters</h1>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Exam:</span>
              <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple" value={exam} onChange={e => setExam(e.target.value)}>
                <option>JEE</option>
                <option>NEET</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Batch:</span>
              <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple" value={batch} onChange={e => setBatch(e.target.value)}>
                <option>Select a batch</option>
                <option>Titanium 2026</option>
                <option>Alpha 2025</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Subject:</span>
              <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple" value={subject} onChange={e => setSubject(e.target.value)}>
                <option>Select a subject</option>
                <option>All Subjects</option>
                <option>Maths</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-600">Test Name:</span>
              <select className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple" value={testName} onChange={e => setTestName(e.target.value)}>
                <option>Select a test</option>
                <option>Mains Mock Test 1</option>
                <option>Advanced Full Test</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4 lg:mt-0 lg:ml-auto">
            <div className="relative">
              <input 
                type="file" 
                accept=".xlsx, .csv" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Upload Excel or CSV"
              />
              <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors border border-gray-200 w-full lg:w-auto">
                <Upload className="w-5 h-5" />
                Upload Sheet
              </button>
            </div>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-light-purple text-brand-purple hover:bg-purple-100 font-semibold rounded-lg transition-colors w-full lg:w-auto border border-purple-200">
              <Plus className="w-5 h-5" />
              Add Student
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-100">
                <tr>
                  <th scope="col" className="p-4 w-12 text-center">
                    <input type="checkbox" className="w-4 h-4 text-brand-purple bg-gray-100 border-gray-300 rounded focus:ring-brand-purple" />
                  </th>
                  <th scope="col" className="px-4 py-4">Student Name</th>
                  <th scope="col" className="px-4 py-4 text-center">Math <span className="text-gray-400 font-normal ml-1">(300)</span></th>
                  <th scope="col" className="px-4 py-4 text-center">Physics <span className="text-gray-400 font-normal ml-1">(300)</span></th>
                  <th scope="col" className="px-4 py-4 text-center">Chemistry <span className="text-gray-400 font-normal ml-1">(300)</span></th>
                  <th scope="col" className="px-4 py-4 text-center">Total Marks <span className="text-gray-400 font-normal ml-1">(900)</span></th>
                  <th scope="col" className="px-4 py-4">Percentile</th>
                  <th scope="col" className="px-4 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const pointsTotal = student.mp + student.pp + student.cp;
                  const pointsColor = pointsTotal >= 20 ? 'text-green-600 bg-green-50' : 'text-orange-500 bg-orange-50';
                  
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-center">
                        <input type="checkbox" className="w-4 h-4 text-brand-purple bg-gray-100 border-gray-300 rounded focus:ring-brand-purple" />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.name}`} 
                            alt="avatar" 
                            className="w-10 h-10 rounded-full bg-gray-100"
                          />
                          <span className="font-semibold text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center">
                          <input 
                            type="number" 
                            className="w-16 text-center py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            value={student.math}
                            onChange={(e) => handleMarksChange(student.id, 'math', e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                           <input 
                            type="number" 
                            className="w-16 text-center py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            value={student.physics}
                            onChange={(e) => handleMarksChange(student.id, 'physics', e.target.value)}
                          />
                          {student.pp > 0 && <span className="text-xs font-bold text-green-500 w-6">↑+{student.pp}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                         <div className="flex items-center justify-center gap-2">
                           <input 
                            type="number" 
                            className="w-16 text-center py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple"
                            value={student.chemistry}
                            onChange={(e) => handleMarksChange(student.id, 'chemistry', e.target.value)}
                          />
                           {student.cp > 0 && <span className="text-xs font-bold text-green-500 w-6">↑+{student.cp}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-gray-900">
                        {student.total} <span className="text-gray-400 font-medium text-xs">/ 300</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${student.percentile >= 90 ? 'text-green-600' : 'text-orange-500'}`}>
                            {student.percentile}%
                          </span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${pointsColor}`}>
                            +{pointsTotal} Points
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                         <div className="flex items-center justify-center gap-2">
                           <button 
                              onClick={() => handleSave(student)}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                            >
                             <Save className="w-4 h-4" /> Save
                           </button>
                           <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-gray-100 transition-colors">
                             <FileText className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => handleWhatsApp(student)}
                             className="p-2 text-green-500 hover:bg-green-50 rounded-lg border border-gray-100 transition-colors"
                           >
                             <MessageCircle className="w-4 h-4" />
                           </button>
                           <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                             <MoreVertical className="w-4 h-4" />
                           </button>
                         </div>
                      </td>
                    </tr>
                  );
                })}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-gray-500 bg-gray-50/50">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-brand-purple">
                           <Upload className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-semibold text-gray-600 text-lg">No students to display</p>
                        <p className="text-gray-400 text-sm max-w-sm mt-1">Upload an Excel or CSV file to populate the table, or add a student manually.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Students</p>
              <p className="text-2xl font-black text-gray-800">{totalStudents}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <BarChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Avg. Marks</p>
              <p className="text-2xl font-black text-green-600">{avgMarks} <span className="text-sm text-gray-400 font-medium ml-1">/ 900</span></p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Highest Percentile</p>
              <p className="text-2xl font-black text-orange-500">{highestPercentile}%</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Parents Notified</p>
              <p className="text-2xl font-black text-emerald-600">{parentsNotified}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
