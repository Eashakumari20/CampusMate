import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  Save, 
  Award, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { useCampusMate } from '../../context/CampusMateContext';

interface CourseGradeRow {
  id: string;
  code: string;
  name: string;
  creditHours: number;
  grade: string;
}

const MAJU_GRADE_SCALE: Record<string, { points: number; range: string }> = {
  'A': { points: 4.00, range: '85 - 100%' },
  'A-': { points: 3.67, range: '80 - 84%' },
  'B+': { points: 3.33, range: '75 - 79%' },
  'B': { points: 3.00, range: '71 - 74%' },
  'B-': { points: 2.67, range: '68 - 70%' },
  'C+': { points: 2.33, range: '64 - 67%' },
  'C': { points: 2.00, range: '60 - 63%' },
  'C-': { points: 1.67, range: '57 - 59%' },
  'D': { points: 1.00, range: '50 - 56%' },
  'F': { points: 0.00, range: 'Below 50%' },
};

const INITIAL_ROWS: CourseGradeRow[] = [
  { id: 'g1', code: 'CS 1101', name: 'Programming Fundamentals (Theory + Lab)', creditHours: 4, grade: 'A' },
  { id: 'g2', code: 'MT 1001', name: 'Calculus & Analytical Geometry', creditHours: 3, grade: 'A-' },
  { id: 'g3', code: 'CS 1002', name: 'Information & Communication Tech (ICT)', creditHours: 3, grade: 'A' },
  { id: 'g4', code: 'HU 1001', name: 'Functional English', creditHours: 3, grade: 'B+' },
  { id: 'g5', code: 'HU 1002', name: 'Ethics & Professional Conduct', creditHours: 2, grade: 'A' },
];

export const GpaCalculatorView: React.FC = () => {
  const { state, updateProfile } = useCampusMate();

  const [courses, setCourses] = useState<CourseGradeRow[]>(INITIAL_ROWS);
  const [priorCredits, setPriorCredits] = useState<number>(0);
  const [priorCgpa, setPriorCgpa] = useState<number>(3.80);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // New course input
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newGrade, setNewGrade] = useState('A');

  // Calculate Semester GPA
  const totalCredits = courses.reduce((acc, c) => acc + c.creditHours, 0);
  const totalGradePoints = courses.reduce((acc, c) => {
    const points = MAJU_GRADE_SCALE[c.grade]?.points || 0;
    return acc + (c.creditHours * points);
  }, 0);

  const semesterGpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
  const formattedSemesterGpa = Number(semesterGpa.toFixed(2));

  // Calculate Projected Cumulative CGPA
  const combinedCredits = priorCredits + totalCredits;
  const combinedPoints = (priorCredits * priorCgpa) + totalGradePoints;
  const projectedCgpa = combinedCredits > 0 ? (combinedPoints / combinedCredits) : semesterGpa;
  const formattedCgpa = Number(projectedCgpa.toFixed(2));

  const handleGradeChange = (id: string, grade: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, grade } : c));
  };

  const handleCreditsChange = (id: string, creditHours: number) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, creditHours: Math.max(1, creditHours) } : c));
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newCourse: CourseGradeRow = {
      id: `cg-${Date.now()}`,
      code: newCode.trim().toUpperCase() || 'ELEC',
      name: newName.trim(),
      creditHours: Number(newCredits),
      grade: newGrade
    };
    setCourses(prev => [...prev, newCourse]);
    setNewCode('');
    setNewName('');
    setNewCredits(3);
    setNewGrade('A');
  };

  const handleSaveToProfile = () => {
    updateProfile({ gpa: formattedSemesterGpa });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Academic standing
  let standingTitle = "Dean's Honor Roll";
  let standingDesc = 'Outstanding academic performance. Eligible for semester merit recognition.';
  let standingBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';

  if (formattedSemesterGpa >= 3.50) {
    standingTitle = "Dean's Honor Roll (Distinction)";
    standingDesc = 'Top academic standing at MAJU Karachi.';
    standingBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  } else if (formattedSemesterGpa >= 3.00) {
    standingTitle = 'Good Standing (First Division)';
    standingDesc = 'Above average academic progress across BSCS courses.';
    standingBadge = 'bg-blue-100 text-blue-800 border-blue-200';
  } else if (formattedSemesterGpa >= 2.00) {
    standingTitle = 'Satisfactory Standing';
    standingDesc = 'Meeting minimum graduation standards.';
    standingBadge = 'bg-amber-100 text-amber-800 border-amber-200';
  } else {
    standingTitle = 'Academic Probation Warning';
    standingDesc = 'GPA below MAJU minimum 2.00 requirement.';
    standingBadge = 'bg-red-100 text-red-800 border-red-200';
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>HEC & MAJU Karachi Standard</span>
              <span>·</span>
              <span>4.00 Maximum Scale</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>MAJU Semester GPA & CGPA Calculator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate your semester grade point average and project your cumulative standing
            </p>
          </div>

          <button
            onClick={handleSaveToProfile}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save GPA to My Profile</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Updated your official student profile GPA to {formattedSemesterGpa.toFixed(2)}!</span>
          </div>
        )}
      </div>

      {/* Main Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Score Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xs text-center">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block">
              Calculated Semester GPA
            </span>
            <div className="text-6xl font-extrabold font-mono-numbers text-white my-3 tracking-tight">
              {formattedSemesterGpa.toFixed(2)}
            </div>
            <div className="text-xs text-blue-200 font-mono-numbers">
              {totalGradePoints.toFixed(1)} Quality Points / {totalCredits} Credit Hours
            </div>

            <div className={`mt-5 p-3 rounded-xl border text-xs font-semibold ${standingBadge}`}>
              <div className="font-bold">{standingTitle}</div>
              <div className="text-[11px] font-normal opacity-90 mt-0.5">{standingDesc}</div>
            </div>
          </div>

          {/* Cumulative CGPA Projection Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Projected Cumulative CGPA</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Optional: Enter previous completed credit hours and previous CGPA
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Prior Credits</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={priorCredits}
                  onChange={(e) => setPriorCredits(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-mono-numbers"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Prior CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={priorCgpa}
                  onChange={(e) => setPriorCgpa(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg font-mono-numbers"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Projected CGPA:</span>
              <span className="text-lg font-bold text-blue-700 font-mono-numbers">
                {formattedCgpa.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Official MAJU Grading Scale Reference */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              MAJU Grading Scale Reference
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {Object.entries(MAJU_GRADE_SCALE).map(([gr, val]) => (
                <div key={gr} className="flex justify-between p-1.5 bg-slate-50 rounded font-mono-numbers text-[11px]">
                  <span className="font-bold text-slate-800">{gr} ({val.points.toFixed(2)})</span>
                  <span className="text-slate-500">{val.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Course Grade Table & Add Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Courses Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Semester Registered Courses ({courses.length} Courses · {totalCredits} Credits)
              </h3>
              <span className="text-xs text-blue-600 font-medium">
                Adjust grades to re-calculate instantly
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Expected Grade</th>
                    <th className="py-3 px-4">Grade Points</th>
                    <th className="py-3 px-4 text-right">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => {
                    const points = MAJU_GRADE_SCALE[course.grade]?.points || 0;
                    const totalCoursePoints = (points * course.creditHours).toFixed(2);

                    return (
                      <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{course.name}</div>
                          <div className="text-[11px] font-mono-numbers text-blue-700">{course.code}</div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            min="1"
                            max="6"
                            value={course.creditHours}
                            onChange={(e) => handleCreditsChange(course.id, Number(e.target.value))}
                            className="w-14 px-2 py-1 text-xs border border-slate-200 rounded font-mono-numbers"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={course.grade}
                            onChange={(e) => handleGradeChange(course.id, e.target.value)}
                            className="px-2.5 py-1 text-xs font-bold border border-slate-200 rounded bg-white text-slate-800"
                          >
                            {Object.keys(MAJU_GRADE_SCALE).map((g) => (
                              <option key={g} value={g}>
                                {g} ({MAJU_GRADE_SCALE[g].points.toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                          {totalCoursePoints}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleRemoveCourse(course.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                            title="Remove course from calculator"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Another Course Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Add Extra / Retake Course to Simulator
            </h4>

            <form onSubmit={handleAddCourse} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS 2001"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Discrete Mathematics"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={newCredits}
                  onChange={(e) => setNewCredits(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Grade</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg font-bold"
                >
                  {Object.keys(MAJU_GRADE_SCALE).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1">
                <button
                  type="submit"
                  className="w-full py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center"
                  title="Add course to calculation"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
