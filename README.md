# 🎓 Scholar OS — Academic Operating System for Students & Scholars

<div align="center">

![Scholar OS](https://img.shields.io/badge/Scholar%20OS-Academic%20Operating%20System-00f2fe?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMjAuNSA3VjE3TDEyIDIyTDMuNSAxN1Y3TDEyIDJaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGYyZmUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Cloud Sync](https://img.shields.io/badge/Cloud_Sync-Instant_Cross--Device-00E599?style=flat-square)](https://scholardashboard.vercel.app)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-Sign_In-EA4335?style=flat-square&logo=google)](https://developers.google.com/identity)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**A unified, cloud-synced academic workspace designed for university students: digitize classroom blackboards and assignment sheets into structured notes, take daily syllabus-grounded concept quizzes with active recall flashcards, simulate attendance thresholds (75% rule), track 10.0 CGPA benchmarks, and build 120-day study habits.**

[🚀 Open Scholar OS](https://scholardashboard.vercel.app) · [✨ Core Features](#-core-features) · [🎯 Design Philosophy](#-design-philosophy) · [🛠️ Technical Stack](#-technical-stack) · [📱 Mobile Experience](#-mobile--cross-device-experience)

</div>

---

## 🌟 Overview

**Scholar OS** is an all-in-one academic operating system built to streamline university coursework, daily study routines, and academic planning into a unified, high-performance interface.

### Why Scholar OS?
- **No Fragmented Tools**: Replaces disconnected note apps, attendance calculators, habit spreadsheets, and timers with a single synchronized dashboard.
- **Physical Classroom to Digital Notes**: Captures classroom chalkboard snapshots and assignment sheets, producing clean markdown notes, solution steps, and flashcard decks.
- **Strict 75% Attendance Analytics**: Built-in Bunk Simulator calculating exact safe skips and deficit recovery requirements.
- **10.0 Honors Benchmark**: Standardized on the 10.0 CGPA scale with semester GPA projection.
- **True Zero-State**: Clean start on Day 0 with zero dummy data or placeholder records.

---

## 🚀 Core Features

### 📸 1. Classroom Blackboard & Assignment Vision Studio
*Transform lecture blackboards, whiteboards, lab assignments, and handwritten sheets into structured digital study materials.*

- **Native Mobile Camera & Upload**: Snap photos directly during live lectures using your phone's native camera with auto-focus, or upload existing image files from your device.
- **Course & Syllabus Grounding**: Tag snapshots to enrolled subjects (`[CS301] Data Structures`, `[DBMS] Database Systems`, `[MATH201] Linear Algebra`) to ground explanations directly in your syllabus.
- **Structured Lecture Notes**: Generates hierarchical markdown notes with code snippets, headings, and key takeaways.
- **Step-by-Step Problem & Solution Breakdown**: Breaks down complex mathematical problems, lab tasks (Linux shell scripts, SQL queries, algorithms), and theoretical derivations into clear sequential steps.
- **Active Recall Flashcards**: Automatically creates study flashcard decks with difficulty ratings (`Again`, `Hard`, `Good`, `Easy`) and spaced repetition support.
- **Interactive AI Study Tutor**: Integrated conversational study tutor with streaming responses that directly answers questions, explains homework problems, and provides code solutions without boilerplate templates.
- **Lecture History Shelf**: Filter and search through all previously scanned lecture boards by subject.

---

### 🎯 2. Daily AI Concept Quiz & Active Recall Studio
*Reinforce conceptual mastery every day with personalized questions grounded in your coursework.*

- **Syllabus & Note Grounding**: Synthesizes daily concept questions based on your enrolled courses and recently uploaded lecture notes.
- **Speech Synthesis (Voice Assistant)**: Audio voice toggle (`Voice ON/OFF`) to read questions and feedback aloud.
- **Dual Response Modes**: Answer via **Multiple Choice** or write a **Detailed Explanation** to test deeper recall.
- **Instant Academic Evaluation**: Evaluates conceptual understanding, awarding letter grades (`A+` through `C`), explanations, and key takeaways.
- **Interactive Memory Flashcard**: Flip between question and answer to reinforce core concepts.
- **Automatic Matrix Sync**:
  - **Habit Heatmap**: Automatically logs `+3.0 hrs` study momentum for the day upon completion.
  - **Honors CGPA**: Increments trajectory by `+0.03` mastery points on the 10.0 scale.
  - **Deep Work Sprint**: One-tap launch into a 25-minute focused study session.
- **Touch-Friendly Modal**: Sticky header with prominent close button, background scroll lock, and responsive layout for mobile and desktop.

---

### 🎓 3. Course Attendance & Bunk Simulator
*Stay safely above mandatory attendance thresholds (75% rule).*

- **True Zero-State Accuracy**: Displays `0%` / `0 Classes Logged` for fresh courses without misleading pre-set data.
- **Multi-Course Management**: Track attendance individually for all subjects with course codes, credits, and weekly lecture schedules.
- **One-Tap Class Logging**: Record daily class outcomes with single-tap actions for `Present`, `Absent`, or `Cancelled`.
- **Safe Bunk Calculator**: Calculates the exact number of upcoming classes you can safely miss while remaining at or above 75%.
- **Deficit Recovery Calculator**: Computes the exact streak of consecutive classes you must attend to recover from an attendance dip.
- **Visual Status Badges**: High-contrast indicators indicating good standing or deficit warnings.

---

### 📈 4. 10.0 CGPA Benchmark & Academic Trajectory
*Standardized on the 10.0 Honors CGPA scale.*

- **Target Benchmark Ring**: Visual progress dial displaying current cumulative CGPA against your target honors threshold (e.g. `9.00 / 10.00`).
- **Required GPA Projection**: Dynamically computes the average semester GPA needed across remaining semesters to graduate with your target honors tier.
- **Semester History Log**: Track your historical semester-by-semester GPA and academic momentum over time.

---

### 📋 5. Assignment Sprint & Milestone Board
*Track deliverables, lab reports, and exam deadlines.*

- **4-Column Visual Kanban**: Organize assignments through `Backlog`, `In Progress`, `Under Review`, and `Completed`.
- **Priority & Urgency Tags**: Color-coded badges (`Urgent`, `High`, `Medium`, `Low`) to prioritize daily tasks.
- **Course Linking**: Assign each deliverable to its specific enrolled subject.

---

### 🌿 6. 120-Day Habit Consistency Heatmap
*Build sustainable daily study habits and track consistency streaks.*

- **4 Habit Tracks**:
  - 📚 **Deep Study** (Target: 4h / day)
  - 💻 **Coding & Problem Solving** (Target: 2h / day)
  - 🏫 **Classroom Attendance** (Target: 100% daily)
  - 💧 **Hydration & Health** (Target: 2.5L water & exercise)
- **120-Day Contribution Grid**: Visual grid tracking daily dedication and study streaks.
- **One-Tap Check-In**: Quick toggle to log daily completion across all categories.
- **Streak Records**: Displays active consecutive streaks and all-time consistency milestones.

---

### ⏱️ 7. Deep Work Focus Studio & Ambient Audio Synthesizer
*Distraction-free environment for intense study sprints.*

- **Pomodoro Timer**: Structured intervals for `Focus (25m)`, `Short Break (5m)`, and `Long Break (15m)` with automated phase transitions.
- **Native Web Audio Synthesizer**: Web-native ambient audio generator for deep focus:
  - **Alpha Waves (10 Hz)** for memory retention and calm focus.
  - **Brown Noise** for deep concentration and blocking background noise.
  - **Rain Ambience** for relaxing study sessions.
  - **Coding Flow Tones** for analytical problem solving.
- **Live Soundwave Visualizer**: Responsive visualizer animating in real-time with ambient frequencies.

---

### ☁️ 8. Real-Time Cloud Sync & Authentication
*Seamless continuity across all your devices.*

- **Instant Cross-Device Parity**: Snap a chalkboard photo on your phone in class; view your structured notes, flashcards, and attendance on your laptop immediately.
- **Google OAuth & Academic Sign-In**: Quick login with Google OAuth or academic email.
- **Custom Scholar Profiles**: Select custom avatar badges, department titles, and semester details.
- **Offline Resilience**: Automatically caches data locally and synchronizes updates once connection resumes.

---

## 📱 Mobile & Cross-Device Experience

Scholar OS is engineered with a mobile-first responsive architecture:
- 📱 **Smartphones**: Floating bottom navigation bar, native camera capture triggers, touch-optimized modal dialogs with fixed close buttons, and zero horizontal overflow.
- 💻 **Laptops & Desktops**: Multi-column HUD layout with holographic benchmark rings and fast navigation menus.
- 📱 **Tablets**: Split-pane views for simultaneous lecture note review, step solutions, and habit tracking.

---

## 🎯 Design Philosophy

1. **Zero Dummy Data**: Scholar OS does not populate your account with fake courses or mock attendance. You start with a clean slate tailored to your real university semester.
2. **Speed & Clarity**: High-contrast, dark-mode visual hierarchy with clear typography and minimal friction.
3. **Privacy & Ownership**: Your coursework, attendance records, and lecture notes remain secure and private to your account.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Typesetting**: [KaTeX](https://katex.org/) for mathematical and scientific notations
- **Audio**: Web Audio API binaural frequency synthesis
- **Authentication**: Google OAuth 2.0 & Token-based Session Management
- **Deployment**: [Vercel](https://scholardashboard.vercel.app)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/KaiX-Jr/scholar-os.git

# Navigate to the project directory
cd scholar-os

# Install dependencies
npm install

# Set up environment variables (.env.local)
# GEMINI_API_KEY="your_api_key_here"

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

<div align="center">

**Empowering students and researchers with a modern academic operating system.**

[⭐ Star on GitHub](https://github.com/KaiX-Jr/scholar-os) · [🚀 Launch Scholar OS](https://scholardashboard.vercel.app)

</div>
