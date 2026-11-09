import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  FileCheck2, 
  ClockAlert, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Play, 
  Plus, 
  MapPin, 
  User, 
  BookOpen,
  Sparkles,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { useCampusMate } from '../../context/CampusMateContext';

interface DashboardViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onQuickAdd: () => void;
  onOpenProfile?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onQuickAdd, onOpenProfile }) => {
  const { state, toggleTodo, addTodo, updateAssignment, updateStudentName } = useCampusMate();
  const [quickTodoText, setQuickTodoText] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(state.profile.name);

  // Sync tempName when profile changes
  useEffect(() => {
    setTempName(state.profile.name);
  }, [state.profile.name]);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempName.trim()) {
      updateStudentName(tempName.trim());
      setIsEditingName(false);
    }
  };

  // Determine current day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
  const currentDayName = daysOfWeek[new Date().getDay()];

  // Today's classes (if Sunday or weekend, show Monday's schedule to be helpful!)
  const displayDay = (currentDayName === 'Sunday' || currentDayName === 'Saturday') ? 'Monday' : currentDayName;
  const todayClasses = state.classes
    .filter(c => c.day === displayDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Upcoming pending assignments
  const pendingAssignments = state.assignments
    .filter(a => a.status !== 'submitted' && a.status !== 'graded')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Upcoming exams
  const now = new Date().getTime();
  const upcomingExams = state.exams
    .filter(e => new Date(e.examDate).getTime() > now)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const nextExam = upcomingExams[0];

  // Live timer for next exam
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextExam) return;

    const calculateTimeLeft = () => {
      const diff = new Date(nextExam.examDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [nextExam]);

  // Weekly study hours calculation
  const totalStudyMinutes = state.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const studyProgressPercent = Math.min(
    100,
    Math.round((totalStudyMinutes / (state.weeklyStudyGoalHours * 60)) * 100)
  );

  const handleQuickAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTodoText.trim()) return;
    addTodo({
      title: quickTodoText.trim(),
      completed: false,
      priority: 'medium',
      category: 'Academic'
    });
    setQuickTodoText('');
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-sm">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="/src/assets/images/campus_quad_banner_1794130097167.jpg"
            alt="Campus Quad"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/15 text-blue-100 text-xs font-medium mb-3 backdrop-blur-xs flex-wrap">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>{state.profile.semester} · {state.profile.university}</span>
            </div>

            {/* Interactive Student Name Display & Inline Editor */}
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your full name"
                  className="px-3 py-1.5 text-base sm:text-xl font-bold bg-white text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
                  title="Save Name"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(state.profile.name);
                    setIsEditingName(false);
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Welcome back, {state.profile.name}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1.5 text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  title="Click to edit your name"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Change Name</span>
                </button>
              </div>
            )}

            <p className="text-blue-100/90 text-sm sm:text-base mt-2 leading-relaxed">
              You have <strong className="text-white font-semibold">{todayClasses.length} classes</strong> scheduled for {displayDay}, <strong className="text-white font-semibold">{pendingAssignments.length} pending assignments</strong>, and your next MAJU exam is in <strong className="text-white font-semibold">{timeLeft.days} days</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-colors backdrop-blur-xs"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('planner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-sm font-semibold shadow-xs transition-colors"
            >
              <Play className="w-4 h-4 fill-blue-900" />
              <span>Start Study Timer</span>
            </button>
            <button
              onClick={onQuickAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700/70 hover:bg-blue-700 text-white text-sm font-medium border border-blue-500/50 transition-colors backdrop-blur-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Classes Today */}
        <div 
          onClick={() => onNavigate('timetable')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Classes ({displayDay})</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-numbers">{todayClasses.length}</span>
            <span className="text-xs text-slate-500">lectures & labs</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate">
              {todayClasses.length > 0 ? `Next: ${todayClasses[0].courseCode} (${todayClasses[0].startTime})` : 'No classes today'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Metric 2: Pending Assignments */}
        <div 
          onClick={() => onNavigate('assignments')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Due Assignments</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-numbers">{pendingAssignments.length}</span>
            <span className="text-xs text-slate-500">remaining</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate">
              {pendingAssignments.length > 0 ? `Soonest: ${pendingAssignments[0].courseCode}` : 'All caught up!'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Metric 3: Weekly Study Log */}
        <div 
          onClick={() => onNavigate('planner')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Study Hours</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-numbers">{totalStudyHours}h</span>
            <span className="text-xs text-slate-500">/ {state.weeklyStudyGoalHours}h goal</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${studyProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{studyProgressPercent}% achieved</span>
              <span>Pomodoro Ready</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Next Exam Countdown */}
        <div 
          onClick={() => onNavigate('exams')}
          className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Next Exam</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ClockAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-numbers">
              {nextExam ? `${timeLeft.days}d ${timeLeft.hours}h` : 'None'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate">
              {nextExam ? `${nextExam.courseCode} Midterm` : 'No exams logged'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Classes Schedule & Urgent Assignments (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Classes for {displayDay}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your daily collegiate lecture & lab agenda</p>
              </div>
              <button
                onClick={() => onNavigate('timetable')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="p-5">
              {todayClasses.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No classes scheduled for {displayDay}. Great day for self-study!
                </div>
              ) : (
                <div className="space-y-3">
                  {todayClasses.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="px-2.5 py-1.5 rounded-lg bg-blue-100/80 text-blue-800 text-xs font-bold font-mono-numbers shrink-0">
                          {item.startTime}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{item.courseCode}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-xs font-medium text-slate-700">{item.courseName}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {item.location}
                            </span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {item.instructor}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Urgent Assignments Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Active Assignments</h3>
                <p className="text-xs text-slate-500 mt-0.5">Upcoming course tasks and problem sets</p>
              </div>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>View All ({state.assignments.length})</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingAssignments.slice(0, 4).map((asg) => {
                const dueDateObj = new Date(asg.dueDate);
                const formattedDate = dueDateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
                const isOverdue = dueDateObj.getTime() < now;

                return (
                  <div key={asg.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => updateAssignment(asg.id, { status: 'submitted' })}
                        title="Mark as submitted"
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-blue-700 font-mono-numbers">{asg.courseCode}</span>
                          <span className="text-sm font-semibold text-slate-900">{asg.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                            Due {formattedDate}
                          </span>
                          <span>·</span>
                          <span>Weight: {asg.weightPercentage}%</span>
                          <span>·</span>
                          <span className="capitalize">{asg.priority} Priority</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                      asg.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {asg.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Exam Countdown Spotlight & Quick To-Dos (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Exam Countdown Spotlight */}
          {nextExam && (
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-wider text-blue-200 uppercase">
                  Exam Focus Spotlight
                </span>
                <button
                  onClick={() => onNavigate('exams')}
                  className="text-xs text-blue-200 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>All Exams</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <h4 className="text-base font-bold text-white">{nextExam.courseCode} · {nextExam.courseName}</h4>
              <p className="text-xs text-blue-200/80 mt-0.5">
                {new Date(nextExam.examDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>

              {/* Ticking Time Grid */}
              <div className="grid grid-cols-4 gap-2 my-4 text-center">
                <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{timeLeft.days}</div>
                  <div className="text-[10px] text-blue-200 uppercase font-semibold">Days</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{timeLeft.hours}</div>
                  <div className="text-[10px] text-blue-200 uppercase font-semibold">Hours</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{timeLeft.minutes}</div>
                  <div className="text-[10px] text-blue-200 uppercase font-semibold">Mins</div>
                </div>
                <div className="bg-white/10 rounded-lg p-2 backdrop-blur-xs">
                  <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-white">{timeLeft.seconds}</div>
                  <div className="text-[10px] text-blue-200 uppercase font-semibold">Secs</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-200/90 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {nextExam.location}
                </span>
                {nextExam.seatNumber && <span>{nextExam.seatNumber}</span>}
              </div>
            </div>
          )}

          {/* Daily To-Do List Quick Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Today's To-Do List</h3>
                <p className="text-xs text-slate-500 mt-0.5">Quick actions to get done today</p>
              </div>
              <button
                onClick={() => onNavigate('todos')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Full List</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick add inline input */}
            <form onSubmit={handleQuickAddTodo} className="p-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a quick task for today..."
                  value={quickTodoText}
                  onChange={(e) => setQuickTodoText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!quickTodoText.trim()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors shrink-0"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {state.todos.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => toggleTodo(task.id)}
                      className={`text-slate-400 hover:text-blue-600 transition-colors shrink-0 ${
                        task.completed ? 'text-blue-600' : ''
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`text-xs text-slate-800 truncate ${task.completed ? 'line-through text-slate-400' : 'font-medium'}`}>
                      {task.title}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Study Session Card */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/70 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Study Session Ready</h4>
                <p className="text-xs text-slate-600 mt-0.5">Launch a 25-minute Pomodoro study block now.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('planner')}
              className="px-3 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
