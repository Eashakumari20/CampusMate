import { 
  LayoutDashboard, 
  BookOpenCheck, 
  CalendarDays, 
  FileCheck2, 
  ClockAlert, 
  StickyNote, 
  CheckSquare,
  GraduationCap,
  X,
  Sparkles,
  ChevronRight,
  BookOpen,
  Award,
  Calculator,
  Info
} from 'lucide-react';
import { NavigationTab } from '../types';
import { useCampusMate } from '../context/CampusMateContext';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onOpenProfile
}) => {
  const { state } = useCampusMate();

  const pendingAssignmentsCount = state.assignments.filter(
    a => a.status === 'not_started' || a.status === 'in_progress'
  ).length;

  const incompleteTodosCount = state.todos.filter(t => !t.completed).length;

  // Next exam days
  const now = new Date().getTime();
  const upcomingExams = state.exams
    .filter(e => new Date(e.examDate).getTime() > now)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  
  let nextExamDays: number | null = null;
  if (upcomingExams.length > 0) {
    const diff = new Date(upcomingExams[0].examDate).getTime() - now;
    nextExamDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const navItems: { tab: NavigationTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'courses', label: 'MAJU Courses (5)', icon: BookOpen, badge: 'Hub', badgeColor: 'bg-blue-100 text-blue-700 font-semibold' },
    { tab: 'timetable', label: 'Class Timetable', icon: CalendarDays },
    { 
      tab: 'assignments', 
      label: 'Assignments', 
      icon: FileCheck2, 
      badge: pendingAssignmentsCount > 0 ? `${pendingAssignmentsCount} pending` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-semibold'
    },
    { tab: 'marks', label: 'Marks & Quizzes', icon: Award, badge: state.quizResults.length },
    { tab: 'gpa', label: 'GPA Calculator', icon: Calculator, badge: `${state.profile.gpa.toFixed(2)}` },
    { 
      tab: 'exams', 
      label: 'Exam Countdown', 
      icon: ClockAlert,
      badge: nextExamDays !== null ? `${nextExamDays}d` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-semibold'
    },
    { tab: 'planner', label: 'Study Planner', icon: BookOpenCheck },
    { tab: 'notes', label: 'Personal Notes', icon: StickyNote, badge: state.notes.length },
    { 
      tab: 'todos', 
      label: 'Daily To-Do List', 
      icon: CheckSquare,
      badge: incompleteTodosCount > 0 ? incompleteTodosCount : undefined,
      badgeColor: 'bg-slate-200 text-slate-800'
    },
    { tab: 'about', label: 'About MAJU Hub', icon: Info },
  ];

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                CampusMate
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                MAJU Karachi
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Semester quick status banner */}
        <div className="px-5 py-3 bg-blue-50/70 border-b border-blue-100/60 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-blue-900 block">{state.profile.semester}</span>
            <span className="text-[11px] text-slate-500 font-medium">Mohammad Ali Jinnah University</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Target GPA</span>
            <span className="text-xs font-bold text-blue-700 font-mono-numbers">{state.profile.gpa.toFixed(2)} / {state.profile.targetGpa.toFixed(2)}</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Academic Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                  }`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-md font-mono-numbers transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : (item.badgeColor || 'bg-slate-100 text-slate-600')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Study Motivation Callout */}
        <div className="mx-4 my-2 p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl">
          <div className="flex items-start gap-2.5">
            <div className="p-1 rounded-md bg-blue-600 text-white shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-950">Study Milestone</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                {state.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0)} mins logged this term. Keep pushing!
              </p>
            </div>
          </div>
        </div>

        {/* Student Profile Card (Clickable to edit profile) */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
          >
            <img
              src={state.profile.avatarUrl || '/src/assets/images/campus_student_avatar_1794130097197.jpg'}
              alt={state.profile.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
              onError={(e) => {
                // styled fallback if avatar image is unavailable
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-slate-900 block truncate group-hover:text-blue-600 transition-colors">
                {state.profile.name}
              </span>
              <span className="text-[11px] text-blue-600 font-medium block truncate">
                Click to edit name / profile
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
