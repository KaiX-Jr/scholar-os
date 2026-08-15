export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  semester: string; // e.g. "Semester 5"
  targetCgpa: number;
  currentCgpa: number;
  completedCredits: number;
  totalRequiredCredits: number;
  isOnboarded: boolean;
  avatarId: number; // 1-8 mapped to SVG avatar options
  createdAt: string;
}

export interface DerivationStep {
  stepNumber: number;
  title: string;
  explanation: string;
  formula?: string;
  intuition?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic?: string;
  masteryLevel?: 'learning' | 'review' | 'mastered';
  lastReviewed?: string;
}

export interface BoardAnalysisResult {
  topicTitle: string;
  summary: string;
  structuredNotes: string; // Markdown with LaTeX $...$ and $$...$$
  steps: DerivationStep[];
  flashcards: Flashcard[];
  keyFormulas?: string[];
  suggestedQuestions?: string[];
  courseCode?: string;
  courseName?: string;
}

export interface SavedBoardAnalysis extends BoardAnalysisResult {
  id: string;
  imageUri?: string;
  analyzedAt: string;
  courseCode?: string;
  courseName?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface CourseAttendance {
  id: string;
  courseCode: string;
  courseName: string;
  professor?: string;
  attended: number;
  total: number;
  minThreshold: number; // default 75%
  credits: number;
  schedule: string[]; // e.g. ["Mon", "Wed", "Fri"]
  color?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  estimatedHours: number;
  description?: string;
}

export type HabitCategory = 'study' | 'coding' | 'attendance' | 'hydration';

export interface HabitDay {
  date: string; // YYYY-MM-DD
  count: number; // 0 to 4 intensity
  hoursOrUnits: number;
  notes?: string;
}

export interface HabitStreak {
  category: HabitCategory;
  name: string;
  targetUnit: string;
  currentStreak: number;
  longestStreak: number;
  history: HabitDay[];
}

export interface PomodoroSession {
  mode: 'work' | 'short_break' | 'long_break';
  durationMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  sessionsCompleted: number;
  soundPreset: 'none' | 'binaural_alpha' | 'deep_theta' | 'rain_focus' | 'stellar_ambient';
  volume: number;
}

export interface DailyOralQuestion {
  id: string;
  courseCode: string;
  courseName: string;
  question: string;
  topic: string;
  sourceType: 'board' | 'syllabus';
  options?: string[];
  correctOptionIndex?: number;
  sampleAnswer?: string;
  explanation: string;
  formula?: string;
  date: string;
  isCompleted?: boolean;
  answeredCorrectly?: boolean;
  userAnswer?: string;
  feedback?: string;
  masteryScore?: number;
}

