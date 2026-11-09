import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CampusMateState, 
  Assignment, 
  ClassSchedule, 
  Exam, 
  Note, 
  TodoTask, 
  StudySession, 
  StudentProfile,
  QuizResult
} from '../types';
import { initialData } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface CampusMateContextType {
  state: CampusMateState;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  updateStudentName: (name: string) => void;
  setWeeklyGoal: (hours: number) => void;
  
  // Assignments
  addAssignment: (item: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleAssignmentSubmission: (id: string) => void;

  // Classes / Timetable
  addClass: (item: Omit<ClassSchedule, 'id'>) => void;
  updateClass: (id: string, updates: Partial<ClassSchedule>) => void;
  deleteClass: (id: string) => void;

  // Exams
  addExam: (item: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  toggleExamTopic: (examId: string, topicId: string) => void;
  addExamTopic: (examId: string, text: string) => void;
  deleteExamTopic: (examId: string, topicId: string) => void;

  // Marks & Quiz Results
  addQuizResult: (item: Omit<QuizResult, 'id'>) => void;
  updateQuizResult: (id: string, updates: Partial<QuizResult>) => void;
  deleteQuizResult: (id: string) => void;

  // Notes
  addNote: (item: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Todos
  addTodo: (item: Omit<TodoTask, 'id'>) => void;
  updateTodo: (id: string, updates: Partial<TodoTask>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  clearCompletedTodos: () => void;

  // Study Sessions
  addStudySession: (item: { courseCode: string; durationMinutes: number; notes: string }) => void;
  deleteStudySession: (id: string) => void;

  // System
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
  resetToDemoData: () => void;
}

const STORAGE_KEY = 'campusmate_maju_v2';

const CampusMateContext = createContext<CampusMateContextType | undefined>(undefined);

export const CampusMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CampusMateState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile && parsed.assignments && parsed.classes && parsed.quizResults) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved state from localStorage:', e);
    }
    return initialData;
  });

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to auto-save to localStorage:', e);
    }
  }, [state]);

  const updateProfile = (profileUpdate: Partial<StudentProfile>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate }
    }));
  };

  const updateStudentName = (name: string) => {
    if (!name.trim()) return;
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, name: name.trim() }
    }));
  };

  const setWeeklyGoal = (hours: number) => {
    setState(prev => ({
      ...prev,
      weeklyStudyGoalHours: Math.max(1, Math.min(80, hours))
    }));
  };

  // Assignments
  const addAssignment = (item: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...item,
      id: `asg-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      assignments: [newAssignment, ...prev.assignments]
    }));
    soundManager.playSuccessClick();
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  };

  const deleteAssignment = (id: string) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => a.id !== id)
    }));
  };

  const toggleAssignmentSubmission = (id: string) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => {
        if (a.id === id) {
          const isDone = a.status === 'submitted' || a.status === 'graded';
          const nextStatus = isDone ? 'not_started' : 'submitted';
          if (!isDone) soundManager.playSuccessClick();
          return { ...a, status: nextStatus };
        }
        return a;
      })
    }));
  };

  // Classes
  const addClass = (item: Omit<ClassSchedule, 'id'>) => {
    const newClass: ClassSchedule = {
      ...item,
      id: `cls-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
    soundManager.playSuccessClick();
  };

  const updateClass = (id: string, updates: Partial<ClassSchedule>) => {
    setState(prev => ({
      ...prev,
      classes: prev.classes.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const deleteClass = (id: string) => {
    setState(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c.id !== id)
    }));
  };

  // Exams
  const addExam = (item: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...item,
      id: `ex-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      exams: [...prev.exams, newExam]
    }));
    soundManager.playSuccessClick();
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    setState(prev => ({
      ...prev,
      exams: prev.exams.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const deleteExam = (id: string) => {
    setState(prev => ({
      ...prev,
      exams: prev.exams.filter(e => e.id !== id)
    }));
  };

  const toggleExamTopic = (examId: string, topicId: string) => {
    setState(prev => ({
      ...prev,
      exams: prev.exams.map(e => {
        if (e.id !== examId) return e;
        return {
          ...e,
          topics: e.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t)
        };
      })
    }));
    soundManager.playSuccessClick();
  };

  const addExamTopic = (examId: string, text: string) => {
    if (!text.trim()) return;
    const newTopic = { id: `top-${Date.now()}`, text: text.trim(), completed: false };
    setState(prev => ({
      ...prev,
      exams: prev.exams.map(e => {
        if (e.id !== examId) return e;
        return {
          ...e,
          topics: [...e.topics, newTopic]
        };
      })
    }));
  };

  const deleteExamTopic = (examId: string, topicId: string) => {
    setState(prev => ({
      ...prev,
      exams: prev.exams.map(e => {
        if (e.id !== examId) return e;
        return {
          ...e,
          topics: e.topics.filter(t => t.id !== topicId)
        };
      })
    }));
  };

  // Marks & Quiz Results
  const addQuizResult = (item: Omit<QuizResult, 'id'>) => {
    const newResult: QuizResult = {
      ...item,
      id: `qz-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      quizResults: [newResult, ...prev.quizResults]
    }));
    soundManager.playSuccessClick();
  };

  const updateQuizResult = (id: string, updates: Partial<QuizResult>) => {
    setState(prev => ({
      ...prev,
      quizResults: prev.quizResults.map(q => q.id === id ? { ...q, ...updates } : q)
    }));
  };

  const deleteQuizResult = (id: string) => {
    setState(prev => ({
      ...prev,
      quizResults: prev.quizResults.filter(q => q.id !== id)
    }));
  };

  // Notes
  const addNote = (item: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...item,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      notes: [newNote, ...prev.notes]
    }));
    soundManager.playSuccessClick();
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n)
    }));
  };

  const deleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
  };

  const togglePinNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)
    }));
  };

  // Todos
  const addTodo = (item: Omit<TodoTask, 'id'>) => {
    const newTodo: TodoTask = {
      ...item,
      id: `td-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      todos: [newTodo, ...prev.todos]
    }));
    soundManager.playSuccessClick();
  };

  const updateTodo = (id: string, updates: Partial<TodoTask>) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTodo = (id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(t => t.id !== id)
    }));
  };

  const toggleTodo = (id: string) => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.map(t => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            soundManager.playSuccessClick();
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    }));
  };

  const clearCompletedTodos = () => {
    setState(prev => ({
      ...prev,
      todos: prev.todos.filter(t => !t.completed)
    }));
  };

  // Study Sessions
  const addStudySession = (item: { courseCode: string; durationMinutes: number; notes: string }) => {
    const newSession: StudySession = {
      id: `ss-${Date.now()}`,
      courseCode: item.courseCode,
      durationMinutes: item.durationMinutes,
      completedAt: new Date().toISOString(),
      notes: item.notes
    };
    setState(prev => ({
      ...prev,
      studySessions: [newSession, ...prev.studySessions]
    }));
  };

  const deleteStudySession = (id: string) => {
    setState(prev => ({
      ...prev,
      studySessions: prev.studySessions.filter(s => s.id !== id)
    }));
  };

  // Export / Import / Reset
  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `campusmate-maju-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile && parsed.assignments && parsed.classes) {
        setState({
          ...initialData,
          ...parsed,
          quizResults: parsed.quizResults || initialData.quizResults
        });
        return true;
      }
    } catch (e) {
      console.error('Import error:', e);
    }
    return false;
  };

  const resetToDemoData = () => {
    setState(initialData);
  };

  return (
    <CampusMateContext.Provider
      value={{
        state,
        updateProfile,
        updateStudentName,
        setWeeklyGoal,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentSubmission,
        addClass,
        updateClass,
        deleteClass,
        addExam,
        updateExam,
        deleteExam,
        toggleExamTopic,
        addExamTopic,
        deleteExamTopic,
        addQuizResult,
        updateQuizResult,
        deleteQuizResult,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        clearCompletedTodos,
        addStudySession,
        deleteStudySession,
        exportData,
        importData,
        resetToDemoData
      }}
    >
      {children}
    </CampusMateContext.Provider>
  );
};

export const useCampusMate = () => {
  const context = useContext(CampusMateContext);
  if (!context) {
    throw new Error('useCampusMate must be used within a CampusMateProvider');
  }
  return context;
};
