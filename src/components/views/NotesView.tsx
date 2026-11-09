import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Edit2, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Tag, 
  StickyNote,
  Filter
} from 'lucide-react';
import { Note } from '../../types';
import { useCampusMate } from '../../context/CampusMateContext';

export const NotesView: React.FC = () => {
  const { state, addNote, updateNote, deleteNote, togglePinNote } = useCampusMate();

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS 1101');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [pinned, setPinned] = useState(false);

  // Course options
  const courseOptions = Array.from(
    new Set([
      'CS 1101',
      'MT 1001',
      'CS 1002',
      'HU 1001',
      'HU 1002',
      'General',
      ...state.notes.map(n => n.courseCode),
      ...state.classes.map(c => c.courseCode)
    ])
  );

  const openAddModal = () => {
    setEditingNoteId(null);
    setTitle('');
    setCourseCode('CS 1101');
    setContent('');
    setTagsInput('');
    setPinned(false);
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setCourseCode(note.courseCode);
    setContent(note.content);
    setTagsInput(note.tags.join(', '));
    setPinned(note.pinned);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        content: content.trim(),
        tags,
        pinned
      });
    } else {
      addNote({
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        content: content.trim(),
        tags,
        pinned
      });
    }

    setIsModalOpen(false);
  };

  const handleCopy = (note: Note) => {
    const textToCopy = `${note.title}\nCourse: ${note.courseCode}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (note: Note) => {
    const textToDownload = `${note.title}\nCourse: ${note.courseCode}\nDate: ${new Date(note.updatedAt).toLocaleDateString()}\n\n${note.content}`;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredNotes = state.notes.filter((note) => {
    if (courseFilter !== 'all' && note.courseCode !== courseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTag = note.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchContent || matchTag;
    }
    return true;
  });

  // Sort pinned first, then by updatedAt descending
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-blue-600" />
              <span>Personal Study & Lecture Notes</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review key algorithms, lecture takeaways, formulas, and study cheat sheets
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </button>
        </div>

        {/* Search and Course Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-slate-100">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search note titles, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Course:</span>
            </div>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            >
              <option value="all">All Courses</option>
              {courseOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <StickyNote className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No notes found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Create your first study note to record lecture concepts, formulas, or revision summaries.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Create a Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs ${
                note.pinned
                  ? 'border-blue-300 ring-1 ring-blue-100 bg-gradient-to-b from-blue-50/20 to-white'
                  : 'border-slate-200'
              }`}
            >
              <div className="p-5">
                {/* Header: Course Code & Pin Button */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold font-mono-numbers px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    {note.courseCode}
                  </span>

                  <button
                    onClick={() => togglePinNote(note.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.pinned
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                    }`}
                    title={note.pinned ? 'Unpin note' : 'Pin note to top'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-blue-600' : ''}`} />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {note.title}
                </h3>

                <div className="text-[11px] text-slate-400 font-mono-numbers mt-1 mb-3">
                  Updated {new Date(note.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>

                {/* Content preview */}
                <div className="text-xs text-slate-600 whitespace-pre-line line-clamp-6 leading-relaxed font-sans bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {note.content}
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {note.tags.map(t => (
                      <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/40 rounded-b-2xl">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(note)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors"
                    title="Copy note to clipboard"
                  >
                    {copiedId === note.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(note)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors"
                    title="Download as .txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(note)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded transition-colors"
                    title="Edit note"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 rounded transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {editingNoteId ? 'Edit Study Note' : 'Create New Study Note'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Record key course takeaways, definitions, and cheat sheet equations
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. CS 301: Graph Search & Dijkstra Shortest Path"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS 301"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Algorithms, Graphs, ExamPrep"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Note Content & Formulas</label>
                <textarea
                  rows={8}
                  placeholder="Write your notes here... Use bullet points, code or equation reminders..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono-numbers"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNoteCheck"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="pinNoteCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Pin note to top of page
                </label>
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
                  {editingNoteId ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
