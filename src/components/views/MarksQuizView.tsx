import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  BarChart2,
  FileText
} from 'lucide-react';
import { QuizResult, MarkAssessmentType } from '../../types';
import { useCampusMate } from '../../context/CampusMateContext';
import { MAJU_COURSES_DATA } from '../../data/initialData';

const ASSESSMENT_TYPES: MarkAssessmentType[] = ['Quiz', 'Assignment', 'Lab Task', 'Midterm', 'Project', 'Final'];

export const MarksQuizView: React.FC = () => {
  const { state, addQuizResult, updateQuizResult, deleteQuizResult } = useCampusMate();

  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [courseCode, setCourseCode] = useState('CS 1101');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MarkAssessmentType>('Quiz');
  const [obtainedMarks, setObtainedMarks] = useState<number>(9);
  const [totalMarks, setTotalMarks] = useState<number>(10);
  const [weightPercentage, setWeightPercentage] = useState<number>(5);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [remarks, setRemarks] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setCourseCode('CS 1101');
    setTitle('');
    setType('Quiz');
    setObtainedMarks(9);
    setTotalMarks(10);
    setWeightPercentage(5);
    setDate(new Date().toISOString().slice(0, 10));
    setRemarks('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: QuizResult) => {
    setEditingId(item.id);
    setCourseCode(item.courseCode);
    setTitle(item.title);
    setType(item.type);
    setObtainedMarks(item.obtainedMarks);
    setTotalMarks(item.totalMarks);
    setWeightPercentage(item.weightPercentage || 5);
    setDate(item.date);
    setRemarks(item.remarks || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalMarks <= 0) return;

    if (editingId) {
      updateQuizResult(editingId, {
        courseCode,
        title: title.trim(),
        type,
        obtainedMarks: Number(obtainedMarks),
        totalMarks: Number(totalMarks),
        weightPercentage: Number(weightPercentage),
        date,
        remarks: remarks.trim() || undefined
      });
    } else {
      addQuizResult({
        courseCode,
        title: title.trim(),
        type,
        obtainedMarks: Number(obtainedMarks),
        totalMarks: Number(totalMarks),
        weightPercentage: Number(weightPercentage),
        date,
        remarks: remarks.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  // Filtered marks
  const filteredMarks = state.quizResults.filter((item) => {
    if (courseFilter !== 'all' && item.courseCode !== courseFilter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.courseCode.toLowerCase().includes(q) ||
        (item.remarks && item.remarks.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate statistics
  const totalObtained = state.quizResults.reduce((acc, q) => acc + q.obtainedMarks, 0);
  const totalPossible = state.quizResults.reduce((acc, q) => acc + q.totalMarks, 0);
  const overallPercentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : '0';

  // Per-course statistics
  const courseStats = MAJU_COURSES_DATA.map((c) => {
    const courseItems = state.quizResults.filter((q) => q.courseCode === c.code);
    const obtained = courseItems.reduce((acc, q) => acc + q.obtainedMarks, 0);
    const possible = courseItems.reduce((acc, q) => acc + q.totalMarks, 0);
    const percentage = possible > 0 ? Math.round((obtained / possible) * 100) : 0;
    
    let letterGrade = 'A';
    if (percentage >= 85) letterGrade = 'A (4.00)';
    else if (percentage >= 80) letterGrade = 'A- (3.67)';
    else if (percentage >= 75) letterGrade = 'B+ (3.33)';
    else if (percentage >= 71) letterGrade = 'B (3.00)';
    else if (percentage >= 68) letterGrade = 'B- (2.67)';
    else if (percentage >= 64) letterGrade = 'C+ (2.33)';
    else if (percentage >= 60) letterGrade = 'C (2.00)';
    else if (percentage >= 50) letterGrade = 'D (1.00)';
    else letterGrade = 'F (0.00)';

    return {
      ...c,
      count: courseItems.length,
      percentage,
      letterGrade
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Marks & Quiz Results Ledger</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Record, calculate, and monitor continuous assessment marks at MAJU Karachi
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assessment Mark</span>
          </button>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-900">Overall Average</span>
              <div className="text-2xl font-bold font-mono-numbers text-blue-950 mt-1">{overallPercentage}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-900">Assessments Graded</span>
              <div className="text-2xl font-bold font-mono-numbers text-emerald-950 mt-1">{state.quizResults.length} Tests</div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-900">Total Score Ratio</span>
              <div className="text-2xl font-bold font-mono-numbers text-indigo-950 mt-1">
                {totalObtained.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ {totalPossible}</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-600 text-white shadow-xs">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quiz, lab task, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="sm:col-span-6 flex items-center gap-2">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="all">All Subjects</option>
              {MAJU_COURSES_DATA.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}: {c.name.split(' ')[0]}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="all">All Types</option>
              {ASSESSMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Course Performance Breakdown Strips */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {courseStats.map((c) => (
          <div
            key={c.code}
            onClick={() => setCourseFilter(courseFilter === c.code ? 'all' : c.code)}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              courseFilter === c.code
                ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-blue-700 font-mono-numbers">{c.code}</span>
              <span className="text-[11px] font-bold text-emerald-700 font-mono-numbers">{c.letterGrade.split(' ')[0]}</span>
            </div>
            <div className="text-xs font-semibold text-slate-800 truncate">{c.name}</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden my-2">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${c.percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-numbers">
              <span>{c.percentage}% avg</span>
              <span>{c.count} items</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredMarks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No quiz or assessment results found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Assessment Title</th>
                  <th className="py-3 px-5">Course</th>
                  <th className="py-3 px-5">Type</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Marks</th>
                  <th className="py-3 px-5">Percentage</th>
                  <th className="py-3 px-5">Remarks</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarks.map((item) => {
                  const pct = Math.round((item.obtainedMarks / item.totalMarks) * 100);
                  const isPassing = pct >= 50;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-5 font-mono-numbers font-bold text-blue-700">
                        {item.courseCode}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 font-mono-numbers">
                        {item.date}
                      </td>
                      <td className="py-3.5 px-5 font-mono-numbers font-bold text-slate-900 text-sm">
                        {item.obtainedMarks} <span className="text-slate-400 font-normal text-xs">/ {item.totalMarks}</span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 rounded font-mono-numbers font-bold text-xs ${
                          pct >= 85 ? 'bg-emerald-100 text-emerald-800' :
                          pct >= 70 ? 'bg-blue-100 text-blue-800' :
                          pct >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
                        {item.remarks || '—'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                            title="Edit mark"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteQuizResult(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="Delete mark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Assessment Mark Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingId ? 'Edit Assessment Result' : 'Add Quiz / Evaluation Mark'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter your obtained marks, total score, and evaluation date
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assessment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Quiz 2: Loop Iterations & Pointers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Subject</label>
                  <select
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {MAJU_COURSES_DATA.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}: {c.name.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assessment Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as MarkAssessmentType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {ASSESSMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Obtained Marks</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={totalMarks}
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Evaluation Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Grade Weight (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={weightPercentage}
                    onChange={(e) => setWeightPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Instructor Remarks (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Well done on problem 2"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Record Marks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
