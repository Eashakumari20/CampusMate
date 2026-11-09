import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building, 
  MapPin, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Laptop,
  Code2,
  Sparkles,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import { useCampusMate } from '../../context/CampusMateContext';

export const AboutUsView: React.FC = () => {
  const { state } = useCampusMate();

  const [feedbackName, setFeedbackName] = useState(state.profile.name);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackSubject, setFeedbackSubject] = useState('Feature Request / Suggestion');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setSubmitted(true);
    setFeedbackMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Brand Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-xs">
            <GraduationCap className="w-4 h-4 text-blue-200" />
            <span>Mohammad Ali Jinnah University (MAJU), Karachi</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            About CampusMate — University Productivity Suite
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            CampusMate is a dedicated student academic operating system engineered specifically for students at Mohammad Ali Jinnah University (MAJU), Karachi. Designed to streamline lectures, coursework, continuous quiz evaluations, semester GPA simulation, and exam preparedness.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              PECHS Block 6, Shahrah-e-Faisal, Karachi
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-300" />
              Faculty of Computing & Applied Sciences
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Overview & Creator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission & Core Pillars (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Mission Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Our Academic Mission</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              At MAJU Karachi, computer science and engineering coursework requires rigorous attention to programming assignments, calculus derivations, laboratory tasks, and semester examinations. CampusMate eliminates academic friction by consolidating everything a university student needs into a single responsive, reliable, privacy-first interface.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">100% Client-Side Privacy</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Your grades, notes, and timetable remain securely inside your browser localStorage with zero tracking.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">MAJU Standard Aligned</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Tailored to the HEC / MAJU 4.00 grading scale and official BS Computer Science Semester curriculum.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Mobile First & Offline Ready</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Optimized for smartphones, tablets, and laptops in lecture halls without reliable internet.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Portability & Backups</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Export and restore your semester dataset anytime as clean JSON backups.
                </p>
              </div>
            </div>
          </div>

          {/* Key Platform Modules */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Platform Features Overview</h3>

            <div className="space-y-3">
              {[
                {
                  title: 'Complete MAJU Student Timetable',
                  desc: 'Comprehensive weekly schedule of lectures and lab blocks with classrooms, instructors, and day filters.'
                },
                {
                  title: 'Dedicated Course Portals',
                  desc: 'Individual deep-dive portals for Programming Fundamentals, Calculus, ICT, Functional English, and Ethics.'
                },
                {
                  title: 'Assignment Tracker (Pending & Completed)',
                  desc: 'One-click submission toggles, grade weightings, deadline countdowns, and Kanban view.'
                },
                {
                  title: 'Marks & Quiz Results Ledger',
                  desc: 'Track scores across quizzes, lab tasks, and midterms with predicted letter grades and overall averages.'
                },
                {
                  title: 'MAJU GPA & CGPA Simulator',
                  desc: 'Official 4.00 scale calculation with credit hour weighting, quality points, and Dean’s List tracking.'
                },
                {
                  title: 'Study Planner & Pomodoro Timer',
                  desc: 'Synthesized collegiate bell chimes, custom intervals, and weekly target hours tracking.'
                }
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                  <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold font-mono-numbers flex items-center justify-center text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{feat.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Student Creator & Contact / Feedback (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Creator Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs text-center">
            <img
              src="/src/assets/images/campus_student_avatar_1794130097197.jpg"
              alt="Esha Meghani"
              className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-blue-600 p-0.5 shadow-xs mb-3"
            />
            <h4 className="text-base font-bold text-slate-900">{state.profile.name}</h4>
            <p className="text-xs font-semibold text-blue-600 mt-0.5">{state.profile.major}</p>
            <p className="text-xs text-slate-500 mt-1">
              Mohammad Ali Jinnah University (MAJU), Karachi
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed text-left space-y-2">
              <p>
                Built by a university student for students to tackle semester workloads, organize lab code, and achieve a high GPA.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono-numbers">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Current Term: {state.profile.semester}</span>
              </div>
            </div>
          </div>

          {/* Quick University Links */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              MAJU Karachi Campus Resources
            </h4>

            <div className="space-y-2 text-xs">
              <a
                href="https://www.jinnah.edu"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/70 hover:bg-blue-50/50 flex items-center justify-between text-slate-700 hover:text-blue-700 transition-colors"
              >
                <span className="font-medium">MAJU Official Portal (jinnah.edu)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-slate-700">
                <span className="font-medium">PECHS Main Campus Library</span>
                <span className="text-[11px] text-slate-400 font-mono-numbers">08:00 - 20:00</span>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-slate-700">
                <span className="font-medium">CS Computer Labs 1 & 2</span>
                <span className="text-[11px] text-slate-400 font-mono-numbers">Block B, 2nd Floor</span>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Send Student Feedback or Feature Ideas
            </h4>

            {submitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your feedback has been recorded for the next CampusMate update.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Student Email (@jinnah.edu)"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    placeholder="What feature would you like to see next in CampusMate?"
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Feedback</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
