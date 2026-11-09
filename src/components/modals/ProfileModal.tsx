import React, { useState } from 'react';
import { X, User, GraduationCap, Award, BookOpen } from 'lucide-react';
import { useCampusMate } from '../../context/CampusMateContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { state, updateProfile } = useCampusMate();

  const [name, setName] = useState(state.profile.name);
  const [major, setMajor] = useState(state.profile.major);
  const [university, setUniversity] = useState(state.profile.university);
  const [semester, setSemester] = useState(state.profile.semester);
  const [gpa, setGpa] = useState(state.profile.gpa);
  const [targetGpa, setTargetGpa] = useState(state.profile.targetGpa);

  React.useEffect(() => {
    if (isOpen) {
      setName(state.profile.name);
      setMajor(state.profile.major);
      setUniversity(state.profile.university);
      setSemester(state.profile.semester);
      setGpa(state.profile.gpa);
      setTargetGpa(state.profile.targetGpa);
    }
  }, [isOpen, state.profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      major: major.trim(),
      university: university.trim(),
      semester: semester.trim(),
      gpa: Number(gpa),
      targetGpa: Number(targetGpa)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Profile & Academic Goals</h3>
              <p className="text-xs text-slate-500">Configure your university standing & GPA goals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Student Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Degree & Major</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">University / College</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Current Term</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Current Cumulative GPA</label>
              <input
                type="number"
                step="0.01"
                min="0.00"
                max="4.00"
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Term GPA</label>
              <input
                type="number"
                step="0.01"
                min="0.00"
                max="4.00"
                value={targetGpa}
                onChange={(e) => setTargetGpa(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono-numbers"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
