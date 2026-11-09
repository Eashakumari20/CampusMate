import React, { useState } from 'react';
import { NavigationTab } from './types';
import { CampusMateProvider } from './context/CampusMateContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { StudyPlannerView } from './components/views/StudyPlannerView';
import { Timetable } from './components/views/Timetable';
import { AssignmentTrackerView } from './components/views/AssignmentTrackerView';
import { ExamCountdownView } from './components/views/ExamCountdownView';
import { NotesView } from './components/views/NotesView';
import { TodoList } from './components/views/TodoList';
import { CourseHubView } from './components/views/CourseHubView';
import { MarksQuizView } from './components/views/MarksQuizView';
import { GpaCalculatorView } from './components/views/GpaCalculatorView';
import { AboutUsView } from './components/views/AboutUsView';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { DataManagementModal } from './components/modals/DataManagementModal';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenDataModal={() => setIsDataModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentTab}
              onQuickAdd={() => setIsQuickAddOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          )}
          {currentTab === 'courses' && (
            <CourseHubView
              onNavigate={setCurrentTab}
              onQuickAdd={() => setIsQuickAddOpen(true)}
            />
          )}
          {currentTab === 'timetable' && <Timetable />}
          {currentTab === 'assignments' && <AssignmentTrackerView />}
          {currentTab === 'marks' && <MarksQuizView />}
          {currentTab === 'gpa' && <GpaCalculatorView />}
          {currentTab === 'exams' && <ExamCountdownView />}
          {currentTab === 'planner' && <StudyPlannerView />}
          {currentTab === 'notes' && <NotesView />}
          {currentTab === 'todos' && <TodoList />}
          {currentTab === 'about' && <AboutUsView />}
        </main>
      </div>

      {/* Global Modals */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CampusMateProvider>
      <AppContent />
    </CampusMateProvider>
  );
}
