import React, { useState } from 'react';
import { 
  X, 
  FileCheck2, 
  CalendarDays, 
  ClockAlert, 
  CheckSquare, 
  StickyNote 
} from 'lucide-react';
import { useCampusMate } from '../../context/CampusMateContext';
import { AssignmentStatus, Priority, DayOfWeek, ClassType, ColorTheme, TodoCategory } from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AddTab = 'assignment' | 'class' | 'exam' | 'todo' | 'note';

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { addAssignment, addClass, addExam, addTodo, addNote } = useCampusMate();
  const [activeTab, setActiveTab] = useState<AddTab>('assignment');

  // Assignment fields
  const [asgTitle, setAsgTitle] = useState('');
  const [asgCourse, setAsgCourse] = useState('CS 1101');
  const [asgDueDate, setAsgDueDate] = useState('2026-11-20T23:59');
  const [asgPriority, setAsgPriority] = useState<Priority>('medium');
  const [asgWeight, setAsgWeight] = useState(15);

  // Class fields
  const [clsCode, setClsCode] = useState('CS 1101');
  const [clsName, setClsName] = useState('Programming Fundamentals');
  const [clsDay, setClsDay] = useState<DayOfWeek>('Monday');
  const [clsStart, setClsStart] = useState('09:00');
  const [clsEnd, setClsEnd] = useState('10:30');
  const [clsLocation, setClsLocation] = useState('Block B - Room 302 (Main Campus)');
  const [clsType, setClsType] = useState<ClassType>('Lecture');

  // Exam fields
  const [exCode, setExCode] = useState('CS 1101');
  const [exName, setExName] = useState('Programming Fundamentals Midterm');
  const [exDate, setExDate] = useState('2026-11-20T09:00');
  const [exLocation, setExLocation] = useState('MAJU Examination Hall B');
  const [exWeight, setExWeight] = useState(25);

  // Todo fields
  const [todoTitle, setTodoTitle] = useState('');
  const [todoCat, setTodoCat] = useState<TodoCategory>('Academic');
  const [todoPriority, setTodoPriority] = useState<Priority>('medium');
  const [todoMins, setTodoMins] = useState(30);

  // Note fields
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCourse, setNoteCourse] = useState('CS 1101');
  const [noteContent, setNoteContent] = useState('');

  if (!isOpen) return null;

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;
    addAssignment({
      title: asgTitle.trim(),
      courseCode: asgCourse.trim().toUpperCase(),
      courseName: asgCourse.trim(),
      dueDate: asgDueDate,
      status: 'not_started',
      priority: asgPriority,
      weightPercentage: Number(asgWeight)
    });
    onClose();
  };

  const handleClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clsCode.trim() || !clsLocation.trim()) return;
    addClass({
      courseCode: clsCode.trim().toUpperCase(),
      courseName: clsName.trim() || clsCode.trim(),
      day: clsDay,
      startTime: clsStart,
      endTime: clsEnd,
      location: clsLocation.trim(),
      instructor: 'Staff',
      color: 'blue',
      type: clsType
    });
    onClose();
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exCode.trim()) return;
    addExam({
      courseCode: exCode.trim().toUpperCase(),
      courseName: exName.trim() || `${exCode.trim()} Examination`,
      examDate: exDate,
      location: exLocation.trim() || 'Exam Hall',
      weightPercentage: Number(exWeight),
      topics: [
        { id: `top-${Date.now()}-1`, text: 'Lecture Slide Review', completed: false },
        { id: `top-${Date.now()}-2`, text: 'Practice Exams', completed: false }
      ]
    });
    onClose();
  };

  const handleTodoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;
    addTodo({
      title: todoTitle.trim(),
      completed: false,
      priority: todoPriority,
      category: todoCat,
      estimatedMinutes: Number(todoMins)
    });
    onClose();
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    addNote({
      title: noteTitle.trim(),
      courseCode: noteCourse.trim().toUpperCase(),
      content: noteContent.trim(),
      pinned: false,
      tags: ['QuickNote']
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">CampusMate Quick Add</h3>
            <p className="text-xs text-slate-500">Create new academic entries with one click</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('assignment')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'assignment' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Assignment</span>
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'class' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Class</span>
          </button>
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'exam' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClockAlert className="w-3.5 h-3.5" />
            <span>Exam</span>
          </button>
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'todo' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>To-Do</span>
          </button>
          <button
            onClick={() => setActiveTab('note')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors ${
              activeTab === 'note' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <StickyNote className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>
        </div>

        {/* Tab 1: Assignment */}
        {activeTab === 'assignment' && (
          <form onSubmit={handleAssignmentSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Graph Algorithms Homework 4"
                value={asgTitle}
                onChange={(e) => setAsgTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS 301"
                  value={asgCourse}
                  onChange={(e) => setAsgCourse(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                <select
                  value={asgPriority}
                  onChange={(e) => setAsgPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Due Date & Time</label>
                <input
                  type="datetime-local"
                  value={asgDueDate}
                  onChange={(e) => setAsgDueDate(e.target.value)}
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
                  value={asgWeight}
                  onChange={(e) => setAsgWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors mt-2"
            >
              Add Assignment
            </button>
          </form>
        )}

        {/* Tab 2: Class */}
        {activeTab === 'class' && (
          <form onSubmit={handleClassSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS 301"
                  value={clsCode}
                  onChange={(e) => setClsCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Type</label>
                <select
                  value={clsType}
                  onChange={(e) => setClsType(e.target.value as ClassType)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Lab</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Algorithms & Data Structures"
                value={clsName}
                onChange={(e) => setClsName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Day</label>
                <select
                  value={clsDay}
                  onChange={(e) => setClsDay(e.target.value as DayOfWeek)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                    <option key={d} value={d}>{d.slice(0, 3)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Start</label>
                <input
                  type="time"
                  value={clsStart}
                  onChange={(e) => setClsStart(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg font-mono-numbers"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">End</label>
                <input
                  type="time"
                  value={clsEnd}
                  onChange={(e) => setClsEnd(e.target.value)}
                  className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg font-mono-numbers"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Room / Location</label>
              <input
                type="text"
                placeholder="e.g. Science Building 204"
                value={clsLocation}
                onChange={(e) => setClsLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors mt-2"
            >
              Add Class
            </button>
          </form>
        )}

        {/* Tab 3: Exam */}
        {activeTab === 'exam' && (
          <form onSubmit={handleExamSubmit} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Course Code</label>
                <input
                  type="text"
                  placeholder="e.g. CS 301"
                  value={exCode}
                  onChange={(e) => setExCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Grade Weight (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={exWeight}
                  onChange={(e) => setExWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Exam Description</label>
              <input
                type="text"
                placeholder="e.g. Final Comprehensive Exam"
                value={exName}
                onChange={(e) => setExName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={exDate}
                  onChange={(e) => setExDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono-numbers"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Hall / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Grand Auditorium"
                  value={exLocation}
                  onChange={(e) => setExLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors mt-2"
            >
              Add Exam
            </button>
          </form>
        )}

        {/* Tab 4: To-Do */}
        {activeTab === 'todo' && (
          <form onSubmit={handleTodoSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Task Title</label>
              <input
                type="text"
                placeholder="e.g. Review lecture recording on Dijkstra"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={todoCat}
                  onChange={(e) => setTodoCat(e.target.value as TodoCategory)}
                  className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  <option value="Academic">Academic</option>
                  <option value="Project">Project</option>
                  <option value="Personal">Personal</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                <select
                  value={todoPriority}
                  onChange={(e) => setTodoPriority(e.target.value as Priority)}
                  className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Minutes</label>
                <input
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={todoMins}
                  onChange={(e) => setTodoMins(Number(e.target.value))}
                  className="w-full px-2 py-2 text-xs border border-slate-200 rounded-lg font-mono-numbers"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors mt-2"
            >
              Add To-Do
            </button>
          </form>
        )}

        {/* Tab 5: Note */}
        {activeTab === 'note' && (
          <form onSubmit={handleNoteSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Note Title</label>
              <input
                type="text"
                placeholder="e.g. Key take-aways from today's lecture"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Course Code</label>
              <input
                type="text"
                placeholder="e.g. CS 301"
                value={noteCourse}
                onChange={(e) => setNoteCourse(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Content</label>
              <textarea
                rows={4}
                placeholder="Write your notes or reminders..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors mt-2"
            >
              Save Note
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
