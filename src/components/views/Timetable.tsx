import React, { useState } from 'react';
import { 
  Plus, 
  MapPin, 
  User, 
  Clock, 
  Edit2, 
  Trash2, 
  Calendar,
  Grid,
  ListFilter,
  Layers
} from 'lucide-react';
import { ClassSchedule, DayOfWeek, ClassType, ColorTheme } from '../../types';
import { useCampusMate } from '../../context/CampusMateContext';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const COLOR_CLASSES: Record<ColorTheme, { border: string; bg: string; text: string; badge: string }> = {
  blue: {
    border: 'border-blue-200',
    bg: 'bg-blue-50/70',
    text: 'text-blue-900',
    badge: 'bg-blue-100 text-blue-800'
  },
  indigo: {
    border: 'border-indigo-200',
    bg: 'bg-indigo-50/70',
    text: 'text-indigo-900',
    badge: 'bg-indigo-100 text-indigo-800'
  },
  sky: {
    border: 'border-sky-200',
    bg: 'bg-sky-50/70',
    text: 'text-sky-900',
    badge: 'bg-sky-100 text-sky-800'
  },
  teal: {
    border: 'border-teal-200',
    bg: 'bg-teal-50/70',
    text: 'text-teal-900',
    badge: 'bg-teal-100 text-teal-800'
  },
  emerald: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/70',
    text: 'text-emerald-900',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  violet: {
    border: 'border-violet-200',
    bg: 'bg-violet-50/70',
    text: 'text-violet-900',
    badge: 'bg-violet-100 text-violet-800'
  }
};

export const Timetable: React.FC = () => {
  const { state, addClass, updateClass, deleteClass } = useCampusMate();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);

  // Form state
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [location, setLocation] = useState('');
  const [instructor, setInstructor] = useState('');
  const [color, setColor] = useState<ColorTheme>('blue');
  const [type, setType] = useState<ClassType>('Lecture');

  const openAddModal = () => {
    setEditingClassId(null);
    setCourseCode('');
    setCourseName('');
    setDay(selectedDay === 'All' ? 'Monday' : selectedDay);
    setStartTime('09:00');
    setEndTime('10:30');
    setLocation('');
    setInstructor('');
    setColor('blue');
    setType('Lecture');
    setIsModalOpen(true);
  };

  const openEditModal = (cls: ClassSchedule) => {
    setEditingClassId(cls.id);
    setCourseCode(cls.courseCode);
    setCourseName(cls.courseName);
    setDay(cls.day);
    setStartTime(cls.startTime);
    setEndTime(cls.endTime);
    setLocation(cls.location);
    setInstructor(cls.instructor);
    setColor(cls.color);
    setType(cls.type);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim() || !location.trim()) return;

    if (editingClassId) {
      updateClass(editingClassId, {
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        day,
        startTime,
        endTime,
        location: location.trim(),
        instructor: instructor.trim() || 'Staff',
        color,
        type
      });
    } else {
      addClass({
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim(),
        day,
        startTime,
        endTime,
        location: location.trim(),
        instructor: instructor.trim() || 'Staff',
        color,
        type
      });
    }

    setIsModalOpen(false);
  };

  const filteredClasses = state.classes
    .filter((c) => selectedDay === 'All' || c.day === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Day selection tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDay('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedDay === 'All'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Days
          </button>
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedDay === d
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* View mode & Add Class CTA */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Weekly Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Schedule List View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'grid' && selectedDay === 'All' ? (
        /* Full Weekly Matrix */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Weekly Class Schedule Matrix</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {state.classes.length} active sessions
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-6 divide-x divide-slate-100 border-b border-slate-100">
              {DAYS.map((d) => {
                const dayClasses = state.classes
                  .filter((c) => c.day === d)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                  <div key={d} className="flex flex-col min-h-[460px]">
                    {/* Day Column Header */}
                    <div className="p-3 bg-slate-50/80 border-b border-slate-100 text-center">
                      <span className="text-xs font-bold text-slate-900 block">{d}</span>
                      <span className="text-[11px] text-slate-400 font-mono-numbers">
                        {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                      </span>
                    </div>

                    {/* Classes in Day */}
                    <div className="p-2 space-y-2 flex-1">
                      {dayClasses.map((item) => {
                        const style = COLOR_CLASSES[item.color] || COLOR_CLASSES.blue;
                        return (
                          <div
                            key={item.id}
                            className={`p-2.5 rounded-xl border ${style.border} ${style.bg} hover:shadow-xs transition-all group relative`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[11px] font-bold font-mono-numbers text-slate-700">
                                {item.startTime} - {item.endTime}
                              </span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${style.badge}`}>
                                {item.type}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                              {item.courseCode}
                            </h4>
                            <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                              {item.courseName}
                            </p>

                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>

                            {/* Hover Edit / Delete actions */}
                            <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-end gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1 text-slate-500 hover:text-blue-600 rounded transition-colors"
                                title="Edit class"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => deleteClass(item.id)}
                                className="p-1 text-slate-500 hover:text-red-600 rounded transition-colors"
                                title="Delete class"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {dayClasses.length === 0 && (
                        <div className="h-full flex items-center justify-center text-center p-4 text-[11px] text-slate-400">
                          No classes
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Detailed List / Cards View */
        <div className="space-y-4">
          {filteredClasses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No classes found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                No classes scheduled for {selectedDay === 'All' ? 'the selected filter' : selectedDay}.
              </p>
              <button
                onClick={openAddModal}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Add Your First Class
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.map((item) => {
                const style = COLOR_CLASSES[item.color] || COLOR_CLASSES.blue;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-mono-numbers">
                          {item.day}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${style.badge}`}>
                          {item.type}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mt-2">
                        {item.courseCode} · {item.courseName}
                      </h4>

                      <div className="space-y-2 mt-4 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-mono-numbers font-medium text-slate-800">
                            {item.startTime} – {item.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{item.instructor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteClass(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingClassId ? 'Edit Class Schedule' : 'Add Class to Timetable'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Enter course information, room location, and weekly timing
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Quick MAJU Subject presets */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Quick Select MAJU Subject Preset:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { code: 'CS 1101', name: 'Programming Fundamentals', type: 'Lecture' as ClassType, color: 'blue' as ColorTheme },
                    { code: 'CS 1101', name: 'Programming Fundamentals Lab', type: 'Lab' as ClassType, color: 'blue' as ColorTheme },
                    { code: 'MT 1001', name: 'Calculus & Analytical Geometry', type: 'Lecture' as ClassType, color: 'indigo' as ColorTheme },
                    { code: 'CS 1002', name: 'Information & Communication Tech (ICT)', type: 'Lecture' as ClassType, color: 'sky' as ColorTheme },
                    { code: 'HU 1001', name: 'Functional English', type: 'Seminar' as ClassType, color: 'teal' as ColorTheme },
                    { code: 'HU 1002', name: 'Ethics & Professional Conduct', type: 'Lecture' as ClassType, color: 'violet' as ColorTheme },
                  ].map((sub) => (
                    <button
                      type="button"
                      key={`${sub.code}-${sub.type}`}
                      onClick={() => {
                        setCourseCode(sub.code);
                        setCourseName(sub.name);
                        setType(sub.type);
                        setColor(sub.color);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-md transition-colors"
                    >
                      {sub.code}: {sub.name.split(' ')[0]} ({sub.type})
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
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Class Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ClassType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Course Name</label>
                <input
                  type="text"
                  placeholder="e.g. Programming Fundamentals"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Day of Week</label>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono-numbers"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono-numbers"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Room / Building</label>
                  <input
                    type="text"
                    placeholder="e.g. Turing Hall 101"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Professor / Instructor</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Alan Vance"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Color Accent</label>
                <div className="flex items-center gap-2">
                  {(['blue', 'indigo', 'sky', 'teal', 'emerald', 'violet'] as ColorTheme[]).map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        color === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'
                      } ${
                        c === 'blue' ? 'bg-blue-600' :
                        c === 'indigo' ? 'bg-indigo-600' :
                        c === 'sky' ? 'bg-sky-500' :
                        c === 'teal' ? 'bg-teal-600' :
                        c === 'emerald' ? 'bg-emerald-600' : 'bg-violet-600'
                      }`}
                    />
                  ))}
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
                  {editingClassId ? 'Save Changes' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
