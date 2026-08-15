import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Assignment,
  BoardAnalysisResult,
  CourseAttendance,
  Flashcard,
  HabitCategory,
  HabitDay,
  HabitStreak,
  PomodoroSession,
  SavedBoardAnalysis,
  UserProfile,
} from "@/types/scholar";

export interface OnboardingCourseInput {
  courseCode: string;
  courseName: string;
  credits: number;
  schedule: string[];
  color?: string;
}

export interface OnboardingData {
  name: string;
  university: string;
  semester: string;
  targetCgpa: number;
  courses: OnboardingCourseInput[];
}

// Debounce helper
let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null;

interface ScholarStore {
  // Auth & User Profile
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  isOnboardingOpen: boolean;

  // Cloud Sync
  jwtToken: string | null;
  syncStatus: "idle" | "syncing" | "error";

  // Academic Modules
  courses: CourseAttendance[];
  assignments: Assignment[];

  // Habit Matrix
  habitStreaks: Record<HabitCategory, HabitStreak>;

  // Pomodoro Deep Work
  pomodoro: PomodoroSession;

  // Board Vision Studio
  activeBoardResult: BoardAnalysisResult | null;
  flashcards: Flashcard[];
  activeImageUri: string | null;
  boardHistory: SavedBoardAnalysis[];

  // Auth & Modal Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ error?: string }>;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: OnboardingData) => void;

  // Cloud Sync
  syncToCloud: () => Promise<void>;
  pullFromCloud: () => Promise<void>;
  scheduleSyncToCloud: () => void;

  // Course & Attendance Actions
  addCourse: (course: Omit<CourseAttendance, "id" | "attended" | "total">) => void;
  updateCourse: (id: string, updates: Partial<CourseAttendance>) => void;
  deleteCourse: (id: string) => void;
  logAttendance: (id: string, type: "present" | "absent" | "cancelled") => void;

  // Assignment Actions
  addAssignment: (assignment: Omit<Assignment, "id">) => void;
  updateAssignmentStatus: (id: string, status: Assignment["status"]) => void;
  deleteAssignment: (id: string) => void;

  // Habit Actions
  logHabit: (category: HabitCategory, date: string, intensity: number, units: number) => void;
  toggleHabitToday: (category: HabitCategory) => void;

  // Pomodoro Actions
  setPomodoroRunning: (isRunning: boolean) => void;
  setPomodoroMode: (mode: PomodoroSession["mode"]) => void;
  tickPomodoro: () => void;
  resetPomodoro: () => void;
  setPomodoroSound: (preset: PomodoroSession["soundPreset"]) => void;
  setPomodoroVolume: (volume: number) => void;

  // Vision Studio Actions
  setActiveBoardResult: (result: BoardAnalysisResult | null) => void;
  setActiveImageUri: (uri: string | null) => void;
  updateFlashcardMastery: (id: string, level: Flashcard["masteryLevel"]) => void;
  saveBoardToHistory: (result: BoardAnalysisResult, imageUri?: string) => void;
  deleteBoardFromHistory: (id: string) => void;
  loadBoardFromHistory: (id: string) => void;
  clearBoardHistory: () => void;

  // Daily AI Professor Check-In
  isDailyProfessorOpen: boolean;
  dailyOralQuestion: import("@/types/scholar").DailyOralQuestion | null;
  openDailyProfessor: () => void;
  closeDailyProfessor: () => void;
  setDailyOralQuestion: (question: import("@/types/scholar").DailyOralQuestion | null) => void;
  recordDailyOralAnswer: (isCorrect: boolean, feedback: string, userAnswer: string, masteryScore?: number) => void;

  // Zero-State Factory Reset
  resetAllData: () => void;
}

// Generate local date string YYYY-MM-DD
export const getLocalDateStr = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Generate clean 112 days (16 weeks x 7 days) of zero-intensity habit history
const generateZeroHabitHistory = (): HabitDay[] => {
  const history: HabitDay[] = [];
  const today = new Date();
  for (let i = 111; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    history.push({
      date: getLocalDateStr(d),
      count: 0,
      hoursOrUnits: 0,
    });
  }
  return history;
};

const initialHabitStreaks: Record<HabitCategory, HabitStreak> = {
  study: {
    category: "study",
    name: "Deep Study",
    targetUnit: "hours",
    currentStreak: 0,
    longestStreak: 0,
    history: generateZeroHabitHistory(),
  },
  coding: {
    category: "coding",
    name: "Algorithms & Code",
    targetUnit: "hours",
    currentStreak: 0,
    longestStreak: 0,
    history: generateZeroHabitHistory(),
  },
  attendance: {
    category: "attendance",
    name: "Classroom Lecture",
    targetUnit: "classes",
    currentStreak: 0,
    longestStreak: 0,
    history: generateZeroHabitHistory(),
  },
  hydration: {
    category: "hydration",
    name: "Hydration & Health",
    targetUnit: "ml",
    currentStreak: 0,
    longestStreak: 0,
    history: generateZeroHabitHistory(),
  },
};

const initialPomodoro: PomodoroSession = {
  mode: "work",
  durationMinutes: 25,
  remainingSeconds: 25 * 60,
  isRunning: false,
  sessionsCompleted: 0,
  soundPreset: "binaural_alpha",
  volume: 65,
};

const COURSE_COLORS = [
  "#00f2fe",
  "#6366f1",
  "#a855f7",
  "#10b981",
  "#f59e0b",
  "#ec4899",
];

export const useScholarStore = create<ScholarStore>()(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      isAuthModalOpen: false,
      isOnboardingOpen: false,
      jwtToken: null,
      syncStatus: "idle" as const,

      // Zero-State Data
      courses: [],
      assignments: [],
      habitStreaks: initialHabitStreaks,
      pomodoro: initialPomodoro,
      activeBoardResult: null,
      flashcards: [],
      activeImageUri: null,
      boardHistory: [],

      // Daily AI Professor State
      isDailyProfessorOpen: false,
      dailyOralQuestion: null,

      // Modal Controls
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
      openOnboarding: () => set({ isOnboardingOpen: true }),
      closeOnboarding: () => set({ isOnboardingOpen: false }),
      openDailyProfessor: () => set({ isDailyProfessorOpen: true }),
      closeDailyProfessor: () => set({ isDailyProfessorOpen: false }),
      setDailyOralQuestion: (question) => set({ dailyOralQuestion: question }),


      // Cloud Sync
      syncToCloud: async () => {
        const { jwtToken, user, courses, assignments, habitStreaks, pomodoro, boardHistory } = get();
        if (!jwtToken || !user) return;
        set({ syncStatus: "syncing" });
        try {
          await fetch("/api/sync", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ user, courses, assignments, habitStreaks, pomodoro, boardHistory }),
          });
          set({ syncStatus: "idle" });
        } catch {
          set({ syncStatus: "error" });
        }
      },

      scheduleSyncToCloud: () => {
        if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
        syncDebounceTimer = setTimeout(() => get().syncToCloud(), 3000);
      },

      pullFromCloud: async () => {
        const { jwtToken } = get();
        if (!jwtToken) return;
        try {
          const res = await fetch("/api/sync", {
            headers: { Authorization: `Bearer ${jwtToken}` },
          });
          const { cloudData } = await res.json();
          if (cloudData) {
            set({
              user: cloudData.user ?? get().user,
              courses: cloudData.courses ?? [],
              assignments: cloudData.assignments ?? [],
              habitStreaks: cloudData.habitStreaks ?? get().habitStreaks,
              pomodoro: cloudData.pomodoro ? { ...cloudData.pomodoro, isRunning: false } : get().pomodoro,
              boardHistory: cloudData.boardHistory ?? get().boardHistory,
            });
          }
        } catch {
          // silently fail — local data takes over
        }
      },

      // Auth Operations
      login: async (email: string, password: string) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { error: data.error };

          const profile: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            university: data.cloudData?.user?.university || "",
            semester: data.cloudData?.user?.semester || "Semester 1",
            targetCgpa: data.cloudData?.user?.targetCgpa || 3.9,
            currentCgpa: data.cloudData?.user?.currentCgpa || 0,
            completedCredits: data.cloudData?.user?.completedCredits || 0,
            totalRequiredCredits: data.cloudData?.user?.totalRequiredCredits || 128,
            isOnboarded: data.cloudData?.user?.isOnboarded || false,
            avatarId: data.cloudData?.user?.avatarId || 1,
            createdAt: data.user.createdAt,
          };

          const cloudBoards = data.cloudData?.boardHistory ?? [];
          const activeBoard = cloudBoards.length > 0 ? cloudBoards[0] : null;

          set({
            jwtToken: data.token,
            user: profile,
            isAuthModalOpen: false,
            isOnboardingOpen: !profile.isOnboarded,
            courses: data.cloudData?.courses ?? [],
            assignments: data.cloudData?.assignments ?? [],
            habitStreaks: data.cloudData?.habitStreaks ?? get().habitStreaks,
            pomodoro: data.cloudData?.pomodoro ? { ...data.cloudData.pomodoro, isRunning: false } : get().pomodoro,
            boardHistory: cloudBoards,
            activeBoardResult: activeBoard ? activeBoard : get().activeBoardResult,
            activeImageUri: activeBoard?.imageUri ?? get().activeImageUri,
            flashcards: activeBoard?.flashcards ?? get().flashcards,
          });
          return {};
        } catch {
          return { error: "Connection error. Please check your internet." };
        }
      },

      signup: async (name: string, email: string, password: string) => {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await res.json();
          if (!res.ok) return { error: data.error };

          const newUser: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            university: "",
            semester: "Semester 1",
            targetCgpa: 3.9,
            currentCgpa: 0,
            completedCredits: 0,
            totalRequiredCredits: 128,
            isOnboarded: false,
            avatarId: 1,
            createdAt: data.user.createdAt,
          };
          set({
            jwtToken: data.token,
            user: newUser,
            isAuthModalOpen: false,
            isOnboardingOpen: true,
          });
          return {};
        } catch {
          return { error: "Connection error. Please check your internet." };
        }
      },

      loginWithGoogle: async (credential: string) => {
        try {
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential }),
          });
          const data = await res.json();
          if (!res.ok) return { error: data.error };

          const profile: UserProfile = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            university: data.cloudData?.user?.university || "",
            semester: data.cloudData?.user?.semester || "Semester 1",
            targetCgpa: data.cloudData?.user?.targetCgpa || 3.9,
            currentCgpa: data.cloudData?.user?.currentCgpa || 0,
            completedCredits: data.cloudData?.user?.completedCredits || 0,
            totalRequiredCredits: data.cloudData?.user?.totalRequiredCredits || 128,
            isOnboarded: data.cloudData?.user?.isOnboarded || false,
            avatarId: data.cloudData?.user?.avatarId || 1,
            createdAt: data.user.createdAt,
          };

          const cloudBoards = data.cloudData?.boardHistory ?? [];
          const activeBoard = cloudBoards.length > 0 ? cloudBoards[0] : null;

          set({
            jwtToken: data.token,
            user: profile,
            isAuthModalOpen: false,
            isOnboardingOpen: !profile.isOnboarded,
            courses: data.cloudData?.courses ?? [],
            assignments: data.cloudData?.assignments ?? [],
            habitStreaks: data.cloudData?.habitStreaks ?? get().habitStreaks,
            pomodoro: data.cloudData?.pomodoro ? { ...data.cloudData.pomodoro, isRunning: false } : get().pomodoro,
            boardHistory: cloudBoards,
            activeBoardResult: activeBoard ? activeBoard : get().activeBoardResult,
            activeImageUri: activeBoard?.imageUri ?? get().activeImageUri,
            flashcards: activeBoard?.flashcards ?? get().flashcards,
          });
          return {};
        } catch {
          return { error: "Connection error. Please check your internet." };
        }
      },

      logout: () => {
        set({
          user: null,
          jwtToken: null,
          isAuthModalOpen: false,
          isOnboardingOpen: false,
        });
      },

      updateUserProfile: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;
        set({ user: { ...currentUser, ...updates } });
      },

      completeOnboarding: (data: OnboardingData) => {
        const currentUser = get().user;
        const existingCourses = get().courses;

        const newCourses: CourseAttendance[] = data.courses.map((c, idx) => {
          const code = c.courseCode.toUpperCase().trim();
          const existing = existingCourses.find(
            (ec) => ec.courseCode.toUpperCase() === code
          );

          return {
            id: existing?.id || `course-${Date.now()}-${idx}`,
            courseCode: code,
            courseName: c.courseName.trim(),
            attended: existing?.attended ?? 0,
            total: existing?.total ?? 0,
            minThreshold: existing?.minThreshold ?? 75,
            credits: c.credits || existing?.credits || 4,
            schedule: c.schedule || existing?.schedule || ["Mon", "Wed", "Fri"],
            color: existing?.color || COURSE_COLORS[idx % COURSE_COLORS.length],
          };
        });

        const updatedUser: UserProfile = {
          id: currentUser?.id || "user-" + Date.now(),
          name: data.name.trim() || currentUser?.name || "Scholar",
          email: currentUser?.email || "scholar@university.edu",
          university: data.university.trim() || "University Campus",
          semester: data.semester || "Semester 1",
          targetCgpa: data.targetCgpa || 3.9,
          currentCgpa: 0,
          completedCredits: 0,
          totalRequiredCredits: 120,
          isOnboarded: true,
          avatarId: currentUser?.avatarId || 1,
          createdAt: currentUser?.createdAt || new Date().toISOString(),
        };

        set({
          user: updatedUser,
          courses: newCourses,
          isOnboardingOpen: false,
        });
        // Immediately sync new profile + courses to cloud
        setTimeout(() => get().syncToCloud(), 500);
      },


      // Course Management
      addCourse: (course) => {
        const newCourse: CourseAttendance = {
          ...course,
          id: `course-${Date.now()}`,
          attended: 0,
          total: 0,
          minThreshold: 75,
          color:
            course.color ||
            COURSE_COLORS[get().courses.length % COURSE_COLORS.length],
        };
        set((state) => ({ courses: [...state.courses, newCourse] }));
      },

      updateCourse: (id, updates) => {
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCourse: (id) => {
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== id),
          assignments: state.assignments.filter((a) => a.courseCode !== id),
        }));
      },

      // Dynamic Daily Attendance Logging
      logAttendance: (id, type) => {
        set((state) => {
          const updatedCourses = state.courses.map((course) => {
            if (course.id !== id) return course;

            if (type === "present") {
              return {
                ...course,
                attended: course.attended + 1,
                total: course.total + 1,
              };
            } else if (type === "absent") {
              return {
                ...course,
                total: course.total + 1,
              };
            }
            // type === "cancelled" => no count change
            return course;
          });

          // Also log a habit attendance day if present
          let updatedHabits = state.habitStreaks;
          if (type === "present") {
            const todayStr = new Date().toISOString().split("T")[0];
            const attStreak = state.habitStreaks.attendance;
            const history = attStreak.history.map((day) =>
              day.date === todayStr
                ? {
                    ...day,
                    count: Math.min(4, day.count + 1),
                    hoursOrUnits: day.hoursOrUnits + 1,
                  }
                : day
            );
            updatedHabits = {
              ...state.habitStreaks,
              attendance: {
                ...attStreak,
                currentStreak: attStreak.currentStreak + 1,
                longestStreak: Math.max(
                  attStreak.longestStreak,
                  attStreak.currentStreak + 1
                ),
                history,
              },
            };
          }

          return {
            courses: updatedCourses,
            habitStreaks: updatedHabits,
          };
        });
      },

      // Assignment Management
      addAssignment: (assignment) => {
        const newAssignment: Assignment = {
          ...assignment,
          id: `asg-${Date.now()}`,
        };
        set((state) => ({ assignments: [...state.assignments, newAssignment] }));
      },

      updateAssignmentStatus: (id, status) => {
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        }));
      },

      deleteAssignment: (id) => {
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
        }));
      },

      // Habit Tracking
      logHabit: (category, date, intensity, units) => {
        set((state) => {
          const streakObj = state.habitStreaks[category] || {
            category,
            name: category,
            targetUnit: "hours",
            currentStreak: 0,
            longestStreak: 0,
            history: generateZeroHabitHistory(),
          };

          let found = false;
          let updatedHistory = (streakObj.history || []).map((day) => {
            if (day.date === date) {
              found = true;
              return { ...day, count: intensity, hoursOrUnits: units };
            }
            return day;
          });

          if (!found) {
            updatedHistory = [
              ...updatedHistory,
              { date, count: intensity, hoursOrUnits: units },
            ];
            // Keep up to 112 days
            if (updatedHistory.length > 112) {
              updatedHistory = updatedHistory.slice(updatedHistory.length - 112);
            }
          }

          // Calculate current streak from the end
          let currentStreak = 0;
          for (let i = updatedHistory.length - 1; i >= 0; i--) {
            if (updatedHistory[i].count > 0) {
              currentStreak++;
            } else {
              break;
            }
          }

          const longestStreak = Math.max(streakObj.longestStreak || 0, currentStreak);

          return {
            habitStreaks: {
              ...state.habitStreaks,
              [category]: {
                ...streakObj,
                currentStreak,
                longestStreak,
                history: updatedHistory,
              },
            },
          };
        });
        get().scheduleSyncToCloud();
      },

      toggleHabitToday: (category) => {
        const todayStr = getLocalDateStr();
        const state = get();
        const streakObj = state.habitStreaks[category];
        const todayDay = streakObj?.history?.find((d) => d.date === todayStr);
        const isLogged = (todayDay?.count || 0) > 0;

        if (isLogged) {
          // Toggle OFF
          get().logHabit(category, todayStr, 0, 0);
        } else {
          // Toggle ON
          const unitMultiplier =
            category === "hydration" ? 1500 : category === "study" ? 2.5 : category === "coding" ? 2.0 : 2;
          get().logHabit(category, todayStr, 2, unitMultiplier);
        }
      },

      // Pomodoro Operations
      setPomodoroRunning: (isRunning) => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, isRunning },
        }));
      },

      setPomodoroMode: (mode) => {
        const minutes = mode === "work" ? 25 : mode === "short_break" ? 5 : 15;
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            mode,
            durationMinutes: minutes,
            remainingSeconds: minutes * 60,
            isRunning: false,
          },
        }));
      },

      tickPomodoro: () => {
        set((state) => {
          const { remainingSeconds, isRunning, sessionsCompleted, mode } =
            state.pomodoro;
          if (!isRunning) return state;

          if (remainingSeconds <= 1) {
            const nextMode = mode === "work" ? "short_break" : "work";
            const nextMinutes = nextMode === "work" ? 25 : 5;
            const newSessions =
              mode === "work" ? sessionsCompleted + 1 : sessionsCompleted;

            // Log habit progress on session completion
            if (mode === "work") {
              const todayStr = new Date().toISOString().split("T")[0];
              const studyStreak = state.habitStreaks.study;
              const history = studyStreak.history.map((day) =>
                day.date === todayStr
                  ? {
                      ...day,
                      count: Math.min(4, day.count + 1),
                      hoursOrUnits: +(day.hoursOrUnits + 0.42).toFixed(1),
                    }
                  : day
              );
              return {
                pomodoro: {
                  ...state.pomodoro,
                  mode: nextMode,
                  durationMinutes: nextMinutes,
                  remainingSeconds: nextMinutes * 60,
                  isRunning: false,
                  sessionsCompleted: newSessions,
                },
                habitStreaks: {
                  ...state.habitStreaks,
                  study: {
                    ...studyStreak,
                    history,
                  },
                },
              };
            }

            return {
              pomodoro: {
                ...state.pomodoro,
                mode: nextMode,
                durationMinutes: nextMinutes,
                remainingSeconds: nextMinutes * 60,
                isRunning: false,
                sessionsCompleted: newSessions,
              },
            };
          }

          return {
            pomodoro: {
              ...state.pomodoro,
              remainingSeconds: remainingSeconds - 1,
            },
          };
        });
      },

      resetPomodoro: () => {
        set((state) => ({
          pomodoro: {
            ...state.pomodoro,
            remainingSeconds: state.pomodoro.durationMinutes * 60,
            isRunning: false,
          },
        }));
      },

      setPomodoroSound: (preset) => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, soundPreset: preset },
        }));
      },

      setPomodoroVolume: (volume) => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, volume },
        }));
      },

      // Vision Studio
      setActiveBoardResult: (result) => {
        set({
          activeBoardResult: result,
          flashcards: result?.flashcards || [],
        });
      },

      setActiveImageUri: (uri) => {
        set({ activeImageUri: uri });
      },

      updateFlashcardMastery: (id, level) => {
        set((state) => {
          const updatedCards = state.flashcards.map((fc) =>
            fc.id === id
              ? {
                  ...fc,
                  masteryLevel: level,
                  lastReviewed: new Date().toISOString(),
                }
              : fc
          );
          return {
            flashcards: updatedCards,
            activeBoardResult: state.activeBoardResult
              ? { ...state.activeBoardResult, flashcards: updatedCards }
              : null,
          };
        });
      },

      saveBoardToHistory: (result, imageUri) => {
        set((state) => {
          // Check if already in history by matching topic or create unique ID
          const existingIndex = state.boardHistory.findIndex(
            (b) => b.topicTitle.toLowerCase() === result.topicTitle.toLowerCase()
          );

          const newSavedBoard: SavedBoardAnalysis = {
            ...result,
            id: `board-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            imageUri: imageUri || state.activeImageUri || undefined,
            analyzedAt: new Date().toISOString(),
          };

          let updatedHistory: SavedBoardAnalysis[];
          if (existingIndex >= 0) {
            // Update existing entry with newer timestamp and data, move to top
            updatedHistory = [
              newSavedBoard,
              ...state.boardHistory.filter((_, i) => i !== existingIndex),
            ];
          } else {
            updatedHistory = [newSavedBoard, ...state.boardHistory];
          }

          // Keep up to 25 recent lecture boards
          return {
            boardHistory: updatedHistory.slice(0, 25),
            activeBoardResult: result,
            activeImageUri: imageUri || state.activeImageUri,
            flashcards: result.flashcards || [],
          };
        });
      },

      deleteBoardFromHistory: (id) => {
        set((state) => {
          const filtered = state.boardHistory.filter((b) => b.id !== id);
          return { boardHistory: filtered };
        });
      },

      loadBoardFromHistory: (id) => {
        const board = get().boardHistory.find((b) => b.id === id);
        if (board) {
          set({
            activeBoardResult: board,
            activeImageUri: board.imageUri || null,
            flashcards: board.flashcards || [],
          });
        }
      },

      clearBoardHistory: () => {
        set({ boardHistory: [] });
      },

      // Record Daily Oral Check-In & Update Habits + CGPA Mastery
      recordDailyOralAnswer: (isCorrect, feedback, userAnswer, masteryScore = 95) => {
        const todayStr = getLocalDateStr();
        const currentQ = get().dailyOralQuestion;
        if (currentQ) {
          set({
            dailyOralQuestion: {
              ...currentQ,
              isCompleted: true,
              answeredCorrectly: isCorrect,
              feedback,
              userAnswer,
              masteryScore,
            },
          });
        }

        // Auto-log today's Deep Study Habit Matrix
        get().logHabit("study", todayStr, isCorrect ? 4 : 3, 3.0);

        // Adjust academic momentum towards Target CGPA on 10.0 scale
        const currentUser = get().user;
        if (currentUser) {
          const rawCurrent = currentUser.currentCgpa || 8.5;
          const current = rawCurrent <= 4.0 ? rawCurrent * 2.5 : rawCurrent;
          const rawTarget = currentUser.targetCgpa || 9.2;
          const target = rawTarget <= 4.0 ? rawTarget * 2.5 : rawTarget;

          const boost = isCorrect ? 0.03 : 0.01;
          const newCurrent = Math.min(target, Number((current + boost).toFixed(2)));

          set({
            user: {
              ...currentUser,
              currentCgpa: newCurrent,
            },
          });
        }

        // Trigger debounced cloud synchronization
        get().scheduleSyncToCloud();
      },

      // Reset to pure Day 0 Zero-State
      resetAllData: () => {
        set({
          user: null,
          isAuthModalOpen: false,
          isOnboardingOpen: false,
          courses: [],
          assignments: [],
          habitStreaks: {
            study: {
              category: "study",
              name: "Deep Study",
              targetUnit: "hours",
              currentStreak: 0,
              longestStreak: 0,
              history: generateZeroHabitHistory(),
            },
            coding: {
              category: "coding",
              name: "Algorithms & Code",
              targetUnit: "hours",
              currentStreak: 0,
              longestStreak: 0,
              history: generateZeroHabitHistory(),
            },
            attendance: {
              category: "attendance",
              name: "Classroom Lecture",
              targetUnit: "classes",
              currentStreak: 0,
              longestStreak: 0,
              history: generateZeroHabitHistory(),
            },
            hydration: {
              category: "hydration",
              name: "Hydration & Health",
              targetUnit: "ml",
              currentStreak: 0,
              longestStreak: 0,
              history: generateZeroHabitHistory(),
            },
          },
          pomodoro: initialPomodoro,
          activeBoardResult: null,
          flashcards: [],
          activeImageUri: null,
          boardHistory: [],
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("scholar_os_storage_v3");
        }
      },
    }),
    {
      name: "scholar_os_storage_v3",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        jwtToken: state.jwtToken,
        courses: state.courses,
        assignments: state.assignments,
        habitStreaks: state.habitStreaks,
        boardHistory: state.boardHistory,
        dailyOralQuestion: state.dailyOralQuestion,
        pomodoro: {
          ...state.pomodoro,
          isRunning: false,
        },
      }),
    }
  )
);

// ─── Auto-Sync Subscriber ───────────────────────────────────────────
// Watches for meaningful state changes and auto-pushes to cloud.
// This is the critical bridge that was missing — without it, data only
// lived in localStorage and never reached Redis.
let _prevSyncSnapshot: string | null = null;

useScholarStore.subscribe((state) => {
  // Only sync if user is logged in
  if (!state.jwtToken || !state.user) return;

  // Build a snapshot of syncable data to detect real changes
  const snapshot = JSON.stringify({
    user: state.user,
    courses: state.courses,
    assignments: state.assignments,
    habitStreaks: state.habitStreaks,
    boardHistoryLength: state.boardHistory.length,
    boardHistoryLatest: state.boardHistory[0]?.id,
    pomodoro: { ...state.pomodoro, isRunning: false, remainingSeconds: 0 },
  });

  if (_prevSyncSnapshot !== null && snapshot !== _prevSyncSnapshot) {
    state.scheduleSyncToCloud();
  }
  _prevSyncSnapshot = snapshot;
});
