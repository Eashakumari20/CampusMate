import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Edit2, 
  Trash2, 
  LayoutList, 
  KanbanSquare, 
  Filter
} from 'lucide-react';
import { Assignment, AssignmentStatus, Priority } from '../../types';
import { useCampusMate } from '../../context/CampusMateContext';

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; badge: string; colBg: string }> = {
  not_started: { label: 'Not Started', badge: 'bg-slate-100 text-slate-700', colBg: 'bg-slate-50/70' },
  in_progress: { label: 'In Progress', badge: 'bg-amber-100 text-amber-800', colBg: 'bg-amber-50/40' },
  submitted: { label: 'Submitted', badge: 'bg-blue-100 text-blue-800', colBg: 'bg-blue-50/40' },
  graded: { label: 'Graded', badge: 'bg-emerald-100 text-emerald-800', colBg: 'bg-emerald-50/40' },
};

const PRIORITY_BADGES: Record<Priority, string> = {
  high: 'text-red-700 bg-red-50 border-red-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  low: 'text-slate-600 bg-slate-50 border-slate-200',
};

export const AssignmentTrackerView: React.FC = () => {
  const { state, addAssignment, updateAssignment, deleteAssignment } = useCampusMate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS 301');
  const [courseName, setCourseName] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-15T23:59');
  const [status, setStatus] = useState<AssignmentStatus>('not_started');
  const [priority, setPriority] = useState<Priority>('medium');
  const [weightPercentage, setWeightPercentage] = useState(10);
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('');

  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const now = new Date().getTime();

  // All distinct course codes
  const courseOptions = Array.from(
    new Set([
      'CS 1101',
      'MT 1001',
      'CS 1002',
      'HU 1001',
      'HU 1002',
      ...state.assignments.map(a => a.courseCode),
      ...state.classes.map(c => c.courseCode)
    ])
  );

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCourseCode('CS 1101');
    setCourseName('Programming Fundamentals');
    setDueDate('2026-11-18T23:59');
    setStatus('not_started');
    setPriority('medium');
    setWeightPercentage(15);
    setDescription('');
    setGrade('');
    setIsModalOpen(true);
  };

  const openEditModal = (asg: Assignment) => {
    setEditingId(asg.id);
    setTitle(asg.title);
    setCourseCode(asg.courseCode);
    setCourseName(asg.courseName);
    setDueDate(asg.dueDate.slice(0, 16));
    setStatus(asg.status);
    setPriority(asg.priority);
    setWeightPercentage(asg.weightPercentage);
    setDescription(asg.description || '');
    setGrade(asg.grade || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseCode.trim()) return;

    if (editingId) {
      updateAssignment(editingId, {
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim() || courseCode.trim(),
        dueDate,
        status,
        priority,
        weightPercentage: Number(weightPercentage),
        description: description.trim(),
        grade: grade.trim() || undefined
      });
    } else {
      addAssignment({
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim() || courseCode.trim(),
        dueDate,
        status,
        priority,
        weightPercentage: Number(weightPercentage),
        description: description.trim(),
        grade: grade.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  const filteredAssignments = state.assignments.filter((asg) => {
    const isDone = asg.status === 'submitted' || asg.status === 'graded';
    if (submissionFilter === 'pending' && isDone) return false;
    if (submissionFilter === 'completed' && !isDone) return false;
    if (statusFilter !== 'all' && asg.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && asg.priority !== priorityFilter) return false;
    if (courseFilter !== 'all' && asg.courseCode !== courseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        asg.title.toLowerCase().includes(q) ||
        asg.courseCode.toLowerCase().includes(q) ||
        asg.courseName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Summary counts
  const pendingCount = state.assignments.filter(a => a.status === 'not_started' || a.status === 'in_progress').length;
  const completedCount = state.assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Stats & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Assignment Tracker & Submissions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {pendingCount} Pending · {completedCount} Completed · Total: {state.assignments.length} assignments
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap">
            {/* Quick Pending vs Completed Filter */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setSubmissionFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  submissionFilter === 'all' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({state.assignments.length})
              </button>
              <button
                onClick={() => setSubmissionFilter('pending')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  submissionFilter === 'pending' ? 'bg-white shadow-2xs text-amber-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setSubmissionFilter('completed')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  submissionFilter === 'completed' ? 'bg-white shadow-2xs text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'kanban' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Kanban Board View"
              >
                <KanbanSquare className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Assignment</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assignments or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="sm:col-span-7 flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none shrink-0"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>

            {/* Course Filter */}
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none shrink-0"
            >
              <option value="all">All Courses</option>
              {courseOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none shrink-0"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        /* List / Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No assignments match your search or filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">Assignment & Course</th>
                    <th className="py-3 px-5">Due Date</th>
                    <th className="py-3 px-5">Priority</th>
                    <th className="py-3 px-5">Weight</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Grade</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssignments.map((asg) => {
                    const dueDateObj = new Date(asg.dueDate);
                    const isOverdue = dueDateObj.getTime() < now && asg.status !== 'submitted' && asg.status !== 'graded';
                    const diffDays = Math.ceil((dueDateObj.getTime() - now) / (1000 * 60 * 60 * 24));

                    return (
                      <tr key={asg.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-start gap-2.5">
                            <button
                              onClick={() => {
                                const nextStatus = asg.status === 'submitted' || asg.status === 'graded' ? 'not_started' : 'submitted';
                                updateAssignment(asg.id, { status: nextStatus });
                              }}
                              className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                              title={asg.status === 'submitted' ? 'Mark as incomplete' : 'Mark as submitted'}
                            >
                              {asg.status === 'submitted' || asg.status === 'graded' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{asg.title}</div>
                              <div className="text-slate-500 text-[11px] mt-0.5">
                                <span className="font-bold text-blue-700 font-mono-numbers">{asg.courseCode}</span> · {asg.courseName}
                              </div>
                              {asg.description && (
                                <div className="text-slate-500 text-[11px] line-clamp-1 mt-1 max-w-md">
                                  {asg.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className={`font-mono-numbers font-medium ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                            {dueDateObj.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {isOverdue ? (
                              <span className="text-red-600 font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Overdue
                              </span>
                            ) : diffDays === 0 ? (
                              <span className="text-amber-600 font-semibold">Due today</span>
                            ) : diffDays === 1 ? (
                              <span className="text-amber-600 font-semibold">Due tomorrow</span>
                            ) : (
                              <span>in {diffDays} days</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${PRIORITY_BADGES[asg.priority]}`}>
                            {asg.priority}
                          </span>
                        </td>

                        <td className="py-3.5 px-5 whitespace-nowrap font-mono-numbers font-semibold text-slate-700">
                          {asg.weightPercentage}%
                        </td>

                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              const isDone = asg.status === 'submitted' || asg.status === 'graded';
                              updateAssignment(asg.id, { status: isDone ? 'not_started' : 'submitted' });
                            }}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                              asg.status === 'submitted' || asg.status === 'graded'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                            title="Click to toggle submission status between Pending and Completed"
                          >
                            {asg.status === 'submitted' || asg.status === 'graded' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Completed</span>
                              </>
                            ) : (
                              <>
                                <Circle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Pending</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-5 whitespace-nowrap font-mono-numbers font-bold text-slate-900">
                          {asg.grade ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              {asg.grade}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-5 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(asg)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                              title="Edit assignment"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteAssignment(asg.id)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
                              title="Delete assignment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['not_started', 'in_progress', 'submitted', 'graded'] as AssignmentStatus[]).map((colStatus) => {
            const colConfig = STATUS_CONFIG[colStatus];
            const colAssignments = filteredAssignments.filter((a) => a.status === colStatus);

            return (
              <div
                key={colStatus}
                className={`rounded-2xl border border-slate-200/80 p-4 ${colConfig.colBg} min-h-[500px] flex flex-col`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {colConfig.label}
                    </span>
                    <span className="text-xs font-bold font-mono-numbers px-2 py-0.5 rounded-full bg-white shadow-2xs text-slate-700">
                      {colAssignments.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colAssignments.map((item) => {
                    const dueDateObj = new Date(item.dueDate);
                    const isOverdue = dueDateObj.getTime() < now && colStatus !== 'submitted' && colStatus !== 'graded';

                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-blue-700 font-mono-numbers">
                            {item.courseCode}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_BADGES[item.priority]}`}>
                            {item.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className={`font-mono-numbers ${isOverdue ? 'text-red-600 font-bold' : ''}`}>
                            Due {dueDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="font-mono-numbers font-medium">
                            {item.weightPercentage}%
                          </span>
                        </div>

                        {item.grade && (
                          <div className="text-[11px] text-emerald-700 font-bold font-mono-numbers bg-emerald-50 px-2 py-0.5 rounded text-center">
                            Grade: {item.grade}
                          </div>
                        )}

                        <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-100">
                          {/* Quick move dropdown */}
                          <select
                            value={item.status}
                            onChange={(e) => updateAssignment(item.id, { status: e.target.value as AssignmentStatus })}
                            className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-600 focus:outline-none"
                          >
                            <option value="not_started">Move: Not Started</option>
                            <option value="in_progress">Move: In Progress</option>
                            <option value="submitted">Move: Submitted</option>
                            <option value="graded">Move: Graded</option>
                          </select>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                              title="Edit assignment"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteAssignment(item.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete assignment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {colAssignments.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-center text-xs text-slate-400">
                      No assignments
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingId ? 'Edit Assignment' : 'Add New Assignment'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Set assignment deadlines, priority, and course weighting
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Balanced Binary Trees Implementation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              {/* Quick MAJU Course Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Quick Select MAJU Course:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'CS 1101', name: 'Programming Fundamentals' },
                    { code: 'MT 1001', name: 'Calculus & Analytical Geometry' },
                    { code: 'CS 1002', name: 'Information & Communication Tech (ICT)' },
                    { code: 'HU 1001', name: 'Functional English' },
                    { code: 'HU 1002', name: 'Ethics & Professional Conduct' },
                  ].map((sub) => (
                    <button
                      type="button"
                      key={sub.code}
                      onClick={() => {
                        setCourseCode(sub.code);
                        setCourseName(sub.name);
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Course Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Data Structures"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Due Date & Time</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono-numbers"
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="graded">Graded</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Grade (if graded)</label>
                  <input
                    type="text"
                    placeholder="e.g. 95% or A"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description & Requirements</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Include unit tests, submit ZIP to university portal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  {editingId ? 'Save Changes' : 'Add Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
