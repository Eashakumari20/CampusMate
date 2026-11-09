import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Circle, 
  CheckCircle2, 
  Edit2, 
  Trash2, 
  Clock, 
  Calendar, 
  Sparkles,
  Filter
} from 'lucide-react';
import { TodoTask, TodoCategory, Priority } from '../../types';
import { useCampusMate } from '../../context/CampusMateContext';

const CATEGORIES: TodoCategory[] = ['Academic', 'Project', 'Personal', 'Admin'];

const PRIORITY_BADGES: Record<Priority, { label: string; style: string }> = {
  high: { label: 'High', style: 'text-red-700 bg-red-50 border-red-200' },
  medium: { label: 'Medium', style: 'text-amber-700 bg-amber-50 border-amber-200' },
  low: { label: 'Low', style: 'text-slate-600 bg-slate-50 border-slate-200' },
};

export const TodoList: React.FC = () => {
  const { state, addTodo, updateTodo, deleteTodo, toggleTodo, clearCompletedTodos } = useCampusMate();

  const [quickInput, setQuickInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TodoCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoCategory>('Academic');
  const [priority, setPriority] = useState<Priority>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [dueDate, setDueDate] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    addTodo({
      title: quickInput.trim(),
      completed: false,
      priority: 'medium',
      category: selectedCategory === 'All' ? 'Academic' : selectedCategory
    });
    setQuickInput('');
  };

  const openAddModal = () => {
    setEditingTaskId(null);
    setTitle('');
    setCategory('Academic');
    setPriority('medium');
    setEstimatedMinutes(30);
    setDueDate(new Date().toISOString().slice(0, 10));
    setIsModalOpen(true);
  };

  const openEditModal = (task: TodoTask) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setCategory(task.category);
    setPriority(task.priority);
    setEstimatedMinutes(task.estimatedMinutes || 30);
    setDueDate(task.dueDate || '');
    setIsModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTaskId) {
      updateTodo(editingTaskId, {
        title: title.trim(),
        category,
        priority,
        estimatedMinutes: Number(estimatedMinutes),
        dueDate: dueDate || undefined
      });
    } else {
      addTodo({
        title: title.trim(),
        completed: false,
        category,
        priority,
        estimatedMinutes: Number(estimatedMinutes),
        dueDate: dueDate || undefined
      });
    }

    setIsModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = state.todos.filter((task) => {
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
    if (statusFilter === 'active' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;
    return true;
  });

  const totalTasks = state.todos.length;
  const completedCount = state.todos.filter((t) => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span>Daily Student To-Do List</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritize study tasks, administrative chores, and project milestones
            </p>
          </div>

          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <button
                onClick={clearCompletedTodos}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-slate-200"
              >
                Clear Completed ({completedCount})
              </button>
            )}
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Detailed Task</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Daily Progress</span>
            <span className="font-mono-numbers">
              {completedCount} of {totalTasks} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleQuickAdd} className="pt-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a new task and press Enter to add instantly..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors shrink-0"
          >
            Add Task
          </button>
        </form>

        {/* Categories and Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'active' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === 'completed' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No tasks found in this view.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors ${
                  task.completed ? 'bg-slate-50/40' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTodo(task.id)}
                    className="shrink-0 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <span className={`text-sm block ${task.completed ? 'line-through text-slate-400' : 'font-medium text-slate-900'}`}>
                      {task.title}
                    </span>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-600">{task.category}</span>
                      {task.estimatedMinutes && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-mono-numbers">
                            <Clock className="w-3 h-3" />
                            {task.estimatedMinutes}m
                          </span>
                        </>
                      )}
                      {task.dueDate && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 font-mono-numbers">
                            <Calendar className="w-3 h-3" />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${PRIORITY_BADGES[task.priority].style}`}>
                    {PRIORITY_BADGES[task.priority].label}
                  </span>

                  <button
                    onClick={() => openEditModal(task)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteTodo(task.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingTaskId ? 'Edit Task' : 'Add New Task'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set task details, priority, and category
            </p>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Complete CS 301 lab exercise 3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TodoCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Estimated Time (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    step="5"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                  />
                </div>
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
                  {editingTaskId ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
