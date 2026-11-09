export type NavigationTab = 
  | 'dashboard'
  | 'courses'
  | 'timetable' 
  | 'assignments'
  | 'marks'
  | 'gpa'
  | 'exams'
  | 'planner' 
  | 'notes' 
  | 'todos'
  | 'about';

export type Priority = 'low' | 'medium' | 'high';

export type AssignmentStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string; // ISO date string YYYY-MM-DD or YYYY-MM-DDTHH:mm
  status: AssignmentStatus;
  priority: Priority;
  weightPercentage: number;
  description?: string;
  grade?: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ClassType = 'Lecture' | 'Lab' | 'Tutorial' | 'Seminar';

export type ColorTheme = 'blue' | 'indigo' | 'sky' | 'teal' | 'emerald' | 'violet';

export interface ClassSchedule {
  id: string;
  courseCode: string;
  courseName: string;
  day: DayOfWeek;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  instructor: string;
  color: ColorTheme;
  type: ClassType;
}

export interface ExamTopic {
  id: string;
  text: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  courseCode: string;
  courseName: string;
  examDate: string; // YYYY-MM-DDTHH:mm
  location: string;
  seatNumber?: string;
  weightPercentage: number;
  topics: ExamTopic[];
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  courseCode: string;
  content: string;
  pinned: boolean;
  updatedAt: string;
  tags: string[];
}

export type TodoCategory = 'Academic' | 'Personal' | 'Project' | 'Admin';

export interface TodoTask {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  estimatedMinutes?: number;
  category: TodoCategory;
}

export interface StudySession {
  id: string;
  courseCode: string;
  durationMinutes: number;
  completedAt: string;
  notes: string;
}

export interface StudentProfile {
  name: string;
  major: string;
  university: string;
  semester: string;
  gpa: number;
  targetGpa: number;
  avatarUrl?: string;
}

export type MarkAssessmentType = 'Quiz' | 'Assignment' | 'Lab Task' | 'Midterm' | 'Project' | 'Final';

export interface QuizResult {
  id: string;
  courseCode: string;
  title: string;
  type: MarkAssessmentType;
  obtainedMarks: number;
  totalMarks: number;
  weightPercentage?: number;
  date: string;
  remarks?: string;
}

export interface CourseDetail {
  code: string;
  name: string;
  creditHours: string;
  instructor: string;
  room: string;
  schedule: string;
  description: string;
  color: ColorTheme;
  syllabusTopics: string[];
}

export interface CampusMateState {
  profile: StudentProfile;
  assignments: Assignment[];
  classes: ClassSchedule[];
  exams: Exam[];
  notes: Note[];
  todos: TodoTask[];
  studySessions: StudySession[];
  quizResults: QuizResult[];
  weeklyStudyGoalHours: number;
}
