import React, { useState } from 'react';
import { 
  Menu, 
  Plus, 
  Volume2, 
  VolumeX, 
  Database,
  Calendar
} from 'lucide-react';
import { NavigationTab } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenSidebar: () => void;
  onQuickAdd: () => void;
  onOpenDataModal: () => void;
}

const TAB_TITLES: Record<NavigationTab, { title: string; subtitle: string }> = {
  dashboard: { title: 'Academic Dashboard', subtitle: 'Overview of courses, deadlines, and study performance' },
  courses: { title: 'MAJU Course Portals', subtitle: 'Detailed hubs for PF, Calculus, ICT, English & Ethics' },
  timetable: { title: 'Class Timetable', subtitle: 'Weekly schedule of lectures, labs, and tutorials' },
  assignments: { title: 'Assignment Tracker', subtitle: 'Course coursework, milestones, and grading deadlines' },
  marks: { title: 'Marks & Quiz Results', subtitle: 'Continuous assessments, lab tasks, and predicted grades' },
  gpa: { title: 'GPA & CGPA Calculator', subtitle: 'Simulate semester grade point average on MAJU 4.00 scale' },
  exams: { title: 'Exam Countdown', subtitle: 'Upcoming university examinations, venues, and topic checklists' },
  planner: { title: 'Study Planner & Pomodoro', subtitle: 'Deep work sessions, timers, and weekly study tracking' },
  notes: { title: 'Personal Lecture Notes', subtitle: 'Organized course notes, cheat sheets, and study concepts' },
  todos: { title: 'Daily To-Do List', subtitle: 'Prioritized daily academic and personal task management' },
  about: { title: 'About MAJU CampusMate', subtitle: 'University student portal information and mission' }
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSidebar,
  onQuickAdd,
  onOpenDataModal
}) => {
  const [isMuted, setIsMuted] = useState(() => soundManager.isMuted());

  const toggleSound = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const currentInfo = TAB_TITLES[currentTab];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left zone: Mobile toggle and breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span>CampusMate</span>
            <span aria-hidden="true">/</span>
            <span className="text-blue-600 font-semibold">{currentInfo.title}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Right zone: Date, audio toggle, data manager, and Quick Add button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/80 rounded-lg text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono-numbers">{todayStr}</span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute notification sounds' : 'Mute notification sounds'}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60"
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? <VolumeX className="w-4.5 h-4.5 text-slate-400" /> : <Volume2 className="w-4.5 h-4.5 text-blue-600" />}
        </button>

        {/* Data backup / reset button */}
        <button
          onClick={onOpenDataModal}
          title="Backup, export or reset semester data"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span className="whitespace-nowrap">Backup Data</span>
        </button>

        {/* Global Quick Add Action Button */}
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Add</span>
        </button>
      </div>
    </header>
  );
};
