import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ClockAlert, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Edit2, 
  Trash2, 
  Calendar, 
  Award,
  BookOpen,
  X
} from 'lucide-react';
import { Exam } from '../../types';
import { useCampusMate } from '../../context/CampusMateContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const ExamCountdownView: React.FC = () => {
  const { 
    state, 
    addExam, 
    updateExam, 
    deleteExam, 
    toggleExamTopic, 
    addExamTopic, 
    deleteExamTopic 
  } = useCampusMate();

  const [countdowns, setCountdowns] = useState<Record<string, TimeLeft>>({});
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  // Form fields
  const [courseCode, setCourseCode] = useState('CS 301');
  const [courseName, setCourseName] = useState('');
  const [examDate, setExamDate] = useState('2026-11-20T09:00');
  const [location, setLocation] = useState('Science Hall - Room 304');
  const [seatNumber, setSeatNumber] = useState('');
  const [weightPercentage, setWeightPercentage] = useState(25);
  const [notes, setNotes] = useState('');

  // Ticking countdown effect
  useEffect(() => {
    const updateAllCountdowns = () => {
      const now = new Date().getTime();
      const updated: Record<string, TimeLeft> = {};

      state.exams.forEach((exam) => {
        const diff = new Date(exam.examDate).getTime() - now;
        if (diff <= 0) {
          updated[exam.id] = { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);
          updated[exam.id] = { days, hours, minutes, seconds, isPast: false };
        }
      });

      setCountdowns(updated);
    };

    updateAllCountdowns();
    const interval = setInterval(updateAllCountdowns, 1000);
    return () => clearInterval(interval);
  }, [state.exams]);

  const openAddModal = () => {
    setEditingExamId(null);
    setCourseCode('CS 1101');
    setCourseName('Programming Fundamentals Midterm Exam');
    setExamDate('2026-11-20T09:00');
    setLocation('MAJU Examination Hall B (PECHS Campus)');
    setSeatNumber('');
    setWeightPercentage(25);
    setNotes('2 blue/black ballpoints required. Covers C++ control flow, loops, arrays, functions & pointers.');
    setIsModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExamId(exam.id);
    setCourseCode(exam.courseCode);
    setCourseName(exam.courseName);
    setExamDate(exam.examDate.slice(0, 16));
    setLocation(exam.location);
    setSeatNumber(exam.seatNumber || '');
    setWeightPercentage(exam.weightPercentage);
    setNotes(exam.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim() || !examDate) return;

    if (editingExamId) {
      updateExam(editingExamId, {
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        examDate,
        location: location.trim(),
        seatNumber: seatNumber.trim() || undefined,
        weightPercentage: Number(weightPercentage),
        notes: notes.trim() || undefined
      });
    } else {
      addExam({
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        examDate,
        location: location.trim(),
        seatNumber: seatNumber.trim() || undefined,
        weightPercentage: Number(weightPercentage),
        notes: notes.trim() || undefined,
        topics: [
          { id: `top-${Date.now()}-1`, text: 'Core lecture slide concepts', completed: false },
          { id: `top-${Date.now()}-2`, text: 'Practice midterm & problem sets', completed: false }
        ]
      });
    }

    setIsModalOpen(false);
  };

  const handleAddTopic = (examId: string) => {
    const text = newTopicInputs[examId];
    if (!text || !text.trim()) return;
    addExamTopic(examId, text.trim());
    setNewTopicInputs(prev => ({ ...prev, [examId]: '' }));
  };

  // Sort exams by date
  const sortedExams = [...state.exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClockAlert className="w-5 h-5 text-blue-600" />
            <span>University Exam Countdowns</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time live countdowns, syllabus checklists, and exam hall seating
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam</span>
        </button>
      </div>

      {sortedExams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No exams scheduled</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Add your upcoming midterms and finals to activate the real-time countdown timer and syllabus checklists.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Add an Exam
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedExams.map((exam) => {
            const time = countdowns[exam.id] || { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
            const examDateObj = new Date(exam.examDate);

            // Calculate revision checklist readiness
            const totalTopics = exam.topics.length;
            const completedTopics = exam.topics.filter(t => t.completed).length;
            const readinessPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

            const isUrgent = !time.isPast && time.days < 3;
            const isApproaching = !time.isPast && time.days >= 3 && time.days < 7;

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Exam Card Top Header */}
                <div className={`p-5 border-b ${
                  isUrgent
                    ? 'bg-red-500/10 border-red-100'
                    : isApproaching
                    ? 'bg-amber-500/10 border-amber-100'
                    : 'bg-blue-900 text-white border-blue-950'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold font-mono-numbers px-2.5 py-1 rounded-md ${
                        isUrgent
                          ? 'bg-red-600 text-white'
                          : isApproaching
                          ? 'bg-amber-600 text-white'
                          : 'bg-white/20 text-white'
                      }`}>
                        {exam.courseCode}
                      </span>
                      <span className={`text-xs font-medium ${isUrgent || isApproaching ? 'text-slate-600' : 'text-blue-200'}`}>
                        {exam.weightPercentage}% of Final Grade
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(exam)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isUrgent || isApproaching
                            ? 'text-slate-500 hover:text-blue-600 hover:bg-white'
                            : 'text-blue-200 hover:text-white hover:bg-white/15'
                        }`}
                        title="Edit exam details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isUrgent || isApproaching
                            ? 'text-slate-500 hover:text-red-600 hover:bg-white'
                            : 'text-blue-200 hover:text-red-300 hover:bg-white/15'
                        }`}
                        title="Delete exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`text-base font-bold mt-2 leading-snug ${isUrgent || isApproaching ? 'text-slate-900' : 'text-white'}`}>
                    {exam.courseName}
                  </h3>

                  <p className={`text-xs mt-1 ${isUrgent || isApproaching ? 'text-slate-600' : 'text-blue-200/90'}`}>
                    {examDateObj.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {/* Live Countdown Boxes */}
                  {time.isPast ? (
                    <div className="mt-4 p-3 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Exam Concluded
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                      <div className={`rounded-xl p-2.5 backdrop-blur-xs ${
                        isUrgent ? 'bg-red-600/15 text-red-950' : isApproaching ? 'bg-amber-600/15 text-amber-950' : 'bg-white/10 text-white'
                      }`}>
                        <div className="text-2xl font-bold font-mono-numbers">{time.days}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Days</div>
                      </div>
                      <div className={`rounded-xl p-2.5 backdrop-blur-xs ${
                        isUrgent ? 'bg-red-600/15 text-red-950' : isApproaching ? 'bg-amber-600/15 text-amber-950' : 'bg-white/10 text-white'
                      }`}>
                        <div className="text-2xl font-bold font-mono-numbers">{time.hours}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Hours</div>
                      </div>
                      <div className={`rounded-xl p-2.5 backdrop-blur-xs ${
                        isUrgent ? 'bg-red-600/15 text-red-950' : isApproaching ? 'bg-amber-600/15 text-amber-950' : 'bg-white/10 text-white'
                      }`}>
                        <div className="text-2xl font-bold font-mono-numbers">{time.minutes}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Mins</div>
                      </div>
                      <div className={`rounded-xl p-2.5 backdrop-blur-xs ${
                        isUrgent ? 'bg-red-600/15 text-red-950' : isApproaching ? 'bg-amber-600/15 text-amber-950' : 'bg-white/10 text-white'
                      }`}>
                        <div className="text-2xl font-bold font-mono-numbers">{time.seconds}</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Secs</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Exam Hall Location & Venue Strip */}
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Venue: {exam.location}</span>
                  </div>
                  {exam.seatNumber && (
                    <div className="font-semibold text-slate-800">
                      {exam.seatNumber}
                    </div>
                  )}
                </div>

                {/* Syllabus Checklist Section */}
                <div className="p-5 flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Syllabus Revision Checklist</span>
                      </span>
                      <span className="font-mono-numbers text-slate-500 font-semibold">
                        {completedTopics}/{totalTopics} ({readinessPct}% ready)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${readinessPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {exam.topics.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div
                          onClick={() => toggleExamTopic(exam.id, t.id)}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                        >
                          {t.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 shrink-0 hover:text-blue-500" />
                          )}
                          <span className={`text-xs ${t.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {t.text}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteExamTopic(exam.id, t.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                          title="Remove topic"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add topic inline input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add syllabus topic to revise..."
                      value={newTopicInputs[exam.id] || ''}
                      onChange={(e) => setNewTopicInputs(prev => ({ ...prev, [exam.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopic(exam.id);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      onClick={() => handleAddTopic(exam.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {exam.notes && (
                    <div className="mt-3 p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900 leading-relaxed">
                      <span className="font-bold block mb-0.5">Permitted Materials:</span>
                      {exam.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingExamId ? 'Edit Exam Details' : 'Add University Exam'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter course information, venue, and exam date/time
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick MAJU Subject Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Quick Select MAJU Subject:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'CS 1101', name: 'Programming Fundamentals Midterm', loc: 'MAJU Examination Hall B' },
                    { code: 'MT 1001', name: 'Calculus & Analytical Geometry Midterm', loc: 'Block A - Room 405' },
                    { code: 'CS 1002', name: 'Information & Communication Tech Midterm', loc: 'Main Auditorium' },
                    { code: 'HU 1001', name: 'Functional English Midterm', loc: 'Block B - Room 201' },
                    { code: 'HU 1002', name: 'Ethics & Professional Conduct Midterm', loc: 'Block A - Room 304' },
                  ].map((sub) => (
                    <button
                      type="button"
                      key={sub.code}
                      onClick={() => {
                        setCourseCode(sub.code);
                        setCourseName(sub.name);
                        setLocation(sub.loc);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-md transition-colors"
                    >
                      {sub.code}: {sub.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS 1101"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono-numbers"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Exam Title / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Midterm II: Tree Structures & Graph Theory"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono-numbers"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Exam Venue / Hall</label>
                  <input
                    type="text"
                    placeholder="e.g. Science Hall 304"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Seat (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Seat E-14"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Allowed Materials & Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Scientific calculator permitted, 1 handwritten cheatsheet..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                  {editingExamId ? 'Save Changes' : 'Add Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
