import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Flame, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useCampusMate } from '../../context/CampusMateContext';
import { soundManager } from '../../utils/audio';

type TimerMode = 'focus' | 'short_break' | 'long_break';

const TIMER_CONFIGS: Record<TimerMode, { label: string; defaultMinutes: number }> = {
  focus: { label: 'Focus Block', defaultMinutes: 25 },
  short_break: { label: 'Short Break', defaultMinutes: 5 },
  long_break: { label: 'Long Break', defaultMinutes: 15 },
};

export const StudyPlannerView: React.FC = () => {
  const { state, addStudySession, deleteStudySession, setWeeklyGoal } = useCampusMate();

  // Pomodoro timer state
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('CS 1101');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  // Manual session logging modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [manualCourse, setManualCourse] = useState('CS 1101');
  const [manualMinutes, setManualMinutes] = useState(50);
  const [manualNotes, setManualNotes] = useState('');

  // Weekly Goal editing state
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(state.weeklyStudyGoalHours);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch timer mode
  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_CONFIGS[newMode].defaultMinutes * 60);
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedCourse]);

  const handleTimerComplete = () => {
    soundManager.playPomodoroChime();

    if (mode === 'focus') {
      const minutesSpent = TIMER_CONFIGS.focus.defaultMinutes;
      addStudySession({
        courseCode: selectedCourse,
        durationMinutes: minutesSpent,
        notes: sessionNotes.trim() || 'Pomodoro 25m Focus Block'
      });
      setCompletedSessionsCount((c) => c + 1);
      setSessionNotes('');

      // Auto switch to short break
      setMode('short_break');
      setTimeLeft(TIMER_CONFIGS.short_break.defaultMinutes * 60);
    } else {
      // Return to focus
      setMode('focus');
      setTimeLeft(TIMER_CONFIGS.focus.defaultMinutes * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_CONFIGS[mode].defaultMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalModeSeconds = TIMER_CONFIGS[mode].defaultMinutes * 60;
  const progressPercent = ((totalModeSeconds - timeLeft) / totalModeSeconds) * 100;

  // Study hours calculations
  const totalStudyMinutes = state.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const studyProgressPercent = Math.min(
    100,
    Math.round((totalStudyMinutes / (state.weeklyStudyGoalHours * 60)) * 100)
  );

  // Group study time by course
  const courseTimeMap: Record<string, number> = {};
  state.studySessions.forEach((s) => {
    courseTimeMap[s.courseCode] = (courseTimeMap[s.courseCode] || 0) + s.durationMinutes;
  });

  const uniqueCourses = Array.from(
    new Set([
      'CS 1101',
      'MT 1001',
      'CS 1002',
      'HU 1001',
      'HU 1002',
      ...state.classes.map((c) => c.courseCode),
      ...state.assignments.map((a) => a.courseCode),
    ])
  );

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setWeeklyGoal(goalInput);
    setIsEditingGoal(false);
  };

  const handleManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    addStudySession({
      courseCode: manualCourse,
      durationMinutes: Number(manualMinutes),
      notes: manualNotes.trim() || 'Logged Study Session'
    });
    setManualNotes('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Pomodoro & Study Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pomodoro Timer Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs flex flex-col items-center text-center">
          {/* Mode Selector Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl mb-6">
            <button
              onClick={() => switchMode('focus')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'focus'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => switchMode('short_break')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'short_break'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => switchMode('long_break')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'long_break'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Large Visual Timer Display */}
          <div className="relative my-4 flex items-center justify-center">
            {/* Circular Ring SVG */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center relative shadow-inner">
              <div
                className={`absolute inset-0 rounded-full border-8 border-transparent transition-all duration-300 ${
                  mode === 'focus'
                    ? 'border-t-blue-600 border-r-blue-600'
                    : mode === 'short_break'
                    ? 'border-t-emerald-500 border-r-emerald-500'
                    : 'border-t-indigo-500 border-r-indigo-500'
                }`}
                style={{
                  transform: `rotate(${(progressPercent / 100) * 360}deg)`,
                }}
              />
              <span className="text-5xl sm:text-6xl font-bold font-mono-numbers tracking-tight text-slate-900">
                {formattedTime}
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wider">
                {mode === 'focus' ? `${selectedCourse} Focus` : TIMER_CONFIGS[mode].label}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3 rounded-xl font-bold text-sm text-white shadow-sm transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              title="Reset Timer"
              className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleTimerComplete}
              title="Complete / Skip"
              className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Session details selector */}
          <div className="w-full max-w-md mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Target Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {uniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                Session Objective
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 4 problem set"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Right: Weekly Goal Tracker & Course Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Goal Progress Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Weekly Study Goal</h3>
                  <p className="text-xs text-slate-500">Track and meet your semester targets</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditingGoal(!isEditingGoal)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                {isEditingGoal ? 'Cancel' : 'Edit Goal'}
              </button>
            </div>

            {isEditingGoal ? (
              <form onSubmit={handleSaveGoal} className="p-3 bg-slate-50 rounded-xl mb-4 flex items-center gap-2">
                <label className="text-xs text-slate-600 font-medium">Weekly Target:</label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={goalInput}
                  onChange={(e) => setGoalInput(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs border border-slate-300 rounded font-mono-numbers"
                />
                <span className="text-xs text-slate-500">hrs</span>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </form>
            ) : null}

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-bold text-slate-900 font-mono-numbers">{totalStudyHours}h</span>
              <span className="text-xs font-medium text-slate-500">Goal: {state.weeklyStudyGoalHours}h / week</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${studyProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>{studyProgressPercent}% accomplished</span>
              <span>{Math.max(0, state.weeklyStudyGoalHours - Number(totalStudyHours)).toFixed(1)}h remaining</span>
            </div>

            {/* Course hours breakdown */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Time Logged by Course
              </span>
              {Object.entries(courseTimeMap).map(([code, mins]) => {
                const hours = (mins / 60).toFixed(1);
                const pct = Math.min(100, Math.round((mins / (totalStudyMinutes || 1)) * 100));
                return (
                  <div key={code} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-800 font-bold">{code}</span>
                      <span className="text-slate-600 font-mono-numbers">{hours} hrs ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick study technique tip */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  The Feynman Technique
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  After finishing a 25-minute study block, spend 2 minutes explaining the concept in plain words as if teaching a freshman student. If you get stuck, re-check that specific page!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Study Sessions History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Study Session Log</h3>
            <p className="text-xs text-slate-500">Record of your recent academic deep work sessions</p>
          </div>
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Offline Study Session</span>
          </button>
        </div>

        {state.studySessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No study sessions logged yet. Start the Pomodoro timer above or log an offline session!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Course</th>
                  <th className="py-3 px-6">Duration</th>
                  <th className="py-3 px-6">Completed Time</th>
                  <th className="py-3 px-6">Notes / Topic</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.studySessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-blue-700 font-mono-numbers">
                      {session.courseCode}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-slate-900 font-mono-numbers">
                      {session.durationMinutes} mins
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-mono-numbers">
                      {new Date(session.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 max-w-xs truncate">
                      {session.notes || '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => deleteStudySession(session.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete session log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Study Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Log Study Session</h3>
            <p className="text-xs text-slate-500 mb-4">Record study time spent offline or in library</p>

            <form onSubmit={handleManualLog} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Course Code</label>
                <select
                  value={manualCourse}
                  onChange={(e) => setManualCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {uniqueCourses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="600"
                  step="5"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono-numbers"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Topics Reviewed</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Completed problem set #3 on page 142"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Log Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
