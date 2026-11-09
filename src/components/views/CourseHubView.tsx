import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  User, 
  Clock, 
  Award, 
  FileCheck2, 
  StickyNote, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MAJU_COURSES_DATA } from '../../data/initialData';
import { useCampusMate } from '../../context/CampusMateContext';
import { NavigationTab } from '../../types';

interface CourseHubViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onQuickAdd: () => void;
}

export const CourseHubView: React.FC<CourseHubViewProps> = ({ onNavigate, onQuickAdd }) => {
  const { state, toggleAssignmentSubmission } = useCampusMate();
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('CS 1101');

  const currentCourse = MAJU_COURSES_DATA.find(c => c.code === selectedCourseCode) || MAJU_COURSES_DATA[0];

  // Course assignments
  const courseAssignments = state.assignments.filter(a => a.courseCode === currentCourse.code);
  const pendingAssignments = courseAssignments.filter(a => a.status !== 'submitted' && a.status !== 'graded');
  const completedAssignments = courseAssignments.filter(a => a.status === 'submitted' || a.status === 'graded');

  // Course quizzes & marks
  const courseMarks = state.quizResults.filter(q => q.courseCode === currentCourse.code);
  const totalObtained = courseMarks.reduce((acc, q) => acc + q.obtainedMarks, 0);
  const totalPossible = courseMarks.reduce((acc, q) => acc + q.totalMarks, 0);
  const averageMarksPct = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100) : 0;

  // Course exam
  const courseExam = state.exams.find(e => e.courseCode === currentCourse.code);

  // Course notes
  const courseNotes = state.notes.filter(n => n.courseCode === currentCourse.code);

  // Study hours for this course
  const courseStudyMins = state.studySessions
    .filter(s => s.courseCode === currentCourse.code)
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const courseStudyHours = (courseStudyMins / 60).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
              <span>MAJU Karachi</span>
              <span>·</span>
              <span>Department of Computer Science</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              MAJU Semester Course Portals
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dedicated academic hubs for each of your 5 university subjects
            </p>
          </div>

          <button
            onClick={onQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course Item</span>
          </button>
        </div>

        {/* 5 Course Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          {MAJU_COURSES_DATA.map((course) => {
            const isSelected = course.code === selectedCourseCode;
            return (
              <button
                key={course.code}
                onClick={() => setSelectedCourseCode(course.code)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono-numbers ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {course.code}
                </span>
                <span>{course.name.split(' ')[0]} {course.name.split(' ')[1] || ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Course Hero Overview Card */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-white/20 text-white text-xs font-bold font-mono-numbers">
                {currentCourse.code}
              </span>
              <span className="text-xs font-medium text-blue-200">
                {currentCourse.creditHours}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {currentCourse.name}
            </h3>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              {currentCourse.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200 pt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-300" />
                {currentCourse.instructor}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-300" />
                {currentCourse.room}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 font-mono-numbers">
                <Clock className="w-3.5 h-3.5 text-blue-300" />
                {currentCourse.schedule}
              </span>
            </div>
          </div>

          {/* Quick Metrics Badge Column */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{averageMarksPct}%</div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Quiz Avg</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{pendingAssignments.length}</div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Pending Asg</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{courseStudyHours}h</div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Study Time</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-xs">
              <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{courseNotes.length}</div>
              <div className="text-[10px] text-blue-200 uppercase font-semibold">Notes Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Course Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Syllabus & Assignments (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Syllabus Topics Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900">Official Course Syllabus Topics</h4>
              </div>
              <span className="text-xs text-slate-500 font-mono-numbers">
                {currentCourse.syllabusTopics.length} core modules
              </span>
            </div>

            <div className="space-y-2">
              {currentCourse.syllabusTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex items-center gap-3 text-xs"
                >
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-bold font-mono-numbers flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium leading-relaxed">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Assignments Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Course Coursework & Submissions</h4>
                <p className="text-xs text-slate-500">Track pending and completed problem sets</p>
              </div>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>All Assignments</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {courseAssignments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No assignments logged for {currentCourse.code}.
              </div>
            ) : (
              <div className="space-y-2.5">
                {courseAssignments.map((asg) => {
                  const isDone = asg.status === 'submitted' || asg.status === 'graded';
                  return (
                    <div
                      key={asg.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleAssignmentSubmission(asg.id)}
                          className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                          title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                        <div>
                          <span className={`text-xs block ${isDone ? 'line-through text-slate-400' : 'font-bold text-slate-900'}`}>
                            {asg.title}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono-numbers">
                              Due: {new Date(asg.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span>·</span>
                            <span>Weight: {asg.weightPercentage}%</span>
                            {asg.grade && (
                              <>
                                <span>·</span>
                                <span className="font-semibold text-emerald-700">Grade: {asg.grade}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleAssignmentSubmission(asg.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 transition-colors ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isDone ? 'Completed' : 'Pending'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quizzes & Marks + Lecture Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quizzes & Evaluations in this Course */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Quiz & Evaluation Marks</h4>
                <p className="text-xs text-slate-500">Graded assessments for {currentCourse.code}</p>
              </div>
              <button
                onClick={() => onNavigate('marks')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {courseMarks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No quiz scores recorded yet for this course.
              </div>
            ) : (
              <div className="space-y-2">
                {courseMarks.map((mark) => (
                  <div
                    key={mark.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{mark.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-blue-700">{mark.type}</span> · {mark.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono-numbers text-slate-900 text-sm">
                        {mark.obtainedMarks} / {mark.totalMarks}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-semibold font-mono-numbers">
                        {Math.round((mark.obtainedMarks / mark.totalMarks) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exam Status for this course */}
          {courseExam && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Upcoming Exam
                </span>
                <button
                  onClick={() => onNavigate('exams')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Countdown
                </button>
              </div>
              <h5 className="text-sm font-bold text-slate-900">{courseExam.courseName}</h5>
              <div className="text-xs text-slate-600 mt-1 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-mono-numbers">
                    {new Date(courseExam.examDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{courseExam.location} ({courseExam.seatNumber || 'Seat TBA'})</span>
                </div>
              </div>
            </div>
          )}

          {/* Course Lecture Notes & Cheat Sheets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Subject Notes & Formulas</h4>
                <p className="text-xs text-slate-500">Lecture summaries for {currentCourse.code}</p>
              </div>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>All Notes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {courseNotes.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No personal notes created yet for {currentCourse.code}.
              </div>
            ) : (
              <div className="space-y-2.5">
                {courseNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                  >
                    <h5 className="text-xs font-bold text-slate-900">{note.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
