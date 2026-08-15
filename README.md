# 🎓 Scholar OS — Cognitive Academic Operating System

<div align="center">

![Scholar OS](https://img.shields.io/badge/Scholar%20OS-Academic%20Operating%20System-00f2fe?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMjAuNSA3VjE3TDEyIDIyTDMuNSAxN1Y3TDEyIDJaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGYyZmUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini 2.5](https://img.shields.io/badge/AI%20Vision-Gemini_2.5_Flash-8E75FF?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)
[![Cloud Sync](https://img.shields.io/badge/Cloud_Sync-Instant_Cross--Device-00E599?style=flat-square)](https://scholardashboard.vercel.app)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-Sign_In-EA4335?style=flat-square&logo=google)](https://developers.google.com/identity)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**A unified, cloud-synced academic operating system built for students and scholars: digitize classroom blackboards and assignment sheets into structured notes, take syllabus-grounded daily AI concept quizzes with active recall flashcards, simulate attendance thresholds (75% rule), track 10.0 CGPA benchmarks, and cultivate 120-day cognitive study streaks.**

[🚀 Open Live App](https://scholardashboard.vercel.app) · [✨ Core Features](#-core-features) · [🎯 Design Philosophy](#-design-philosophy) · [🛠️ Technical Stack](#-technical-stack) · [📱 Mobile Experience](#-mobile--cross-device-experience) · [👨‍💻 Author](#-author--maintainer)

</div>

---

## 🌟 Overview

**Scholar OS** is an all-in-one academic intelligence suite designed to eliminate fragmented student workflows. Instead of juggling separate note-taking apps, attendance calculators, flashcard tools, habit trackers, and focus timers, Scholar OS unifies the entire undergraduate and research journey into a responsive, high-performance dashboard.

### Why Scholar OS?
- **Unified Academic Hub**: Consolidates coursework, attendance, assignments, study streaks, and lecture notes into a single cohesive interface.
- **Physical-to-Digital Classroom Vision**: Ingests lecture blackboard photos, handwritten worksheets, and lab assignment PDFs with Gemini 2.5 Flash, generating structured notes, solution steps, and flashcard decks.
- **Strict 75% Attendance Analytics**: Built-in Bunk Simulator calculating exact safe skips and deficit recovery class requirements.
- **Standardized 10.0 CGPA Engine**: Honors trajectory tracker with dynamic semester GPA requirements.
- **Daily AI Oral Check-In & Active Recall**: Daily concept assessment grounded in your enrolled subjects with strict grading and automatic flashcard reinforcement.
- **Zero Dummy Data**: Fresh accounts start with a true Day 0 clean slate tailored to your real university semester.

---

## 🚀 Core Features

### 📸 1. Classroom Blackboard & Assignment Vision Studio
*Transform lecture blackboards, whiteboards, lab assignments, and handwritten sheets into structured digital study materials.*

- **Native Mobile Camera & File Upload**: Snap photos directly during live lectures with your mobile browser or upload high-resolution image files.
- **Course & Syllabus Grounding**: Tag snapshots to enrolled subjects (`[CS301] Data Structures`, `[DBMS] Database Systems`, `[MATH201] Linear Algebra`, `[OS] Operating Systems`, etc.) to ground AI reasoning in your syllabus.
- **Structured Lecture Notes**: Produces clean hierarchical markdown summaries with code blocks, key definitions, and takeaways.
- **Step-by-Step Problem & Solution Breakdowns**: Converts complex derivations, algorithm traces, and lab assignments (Linux shell scripts, SQL queries, proofs) into sequential, step-by-step solutions.
- **Active Recall Flashcard Generation**: Automatically generates spaced repetition flashcards with SM-2 difficulty ratings (`Again`, `Hard`, `Good`, `Easy`).
- **Real-Time Streaming AI Tutor**: Integrated chat assistant that directly answers homework questions, resolves doubts, and provides code solutions without boilerplate templates.
- **Saved Lecture History Shelf**: Instant access, search, and filtering for all previously analyzed lecture boards by course.

---

### 🎯 2. Daily AI Concept Quiz & Active Recall Studio
*Reinforce conceptual mastery every single day with personalized questions grounded in your coursework.*

- **Syllabus & Lecture Grounding**: Synthesizes daily concept questions from your active enrolled courses and recently uploaded notes.
- **Speech Synthesis (Voice Assistant)**: Audio voice toggle (`Voice ON/OFF`) to read questions and feedback aloud.
- **Dual Response Modes**: Answer via **Multiple Choice** or write a **Detailed Explanation** to test deeper recall.
- **Strict Deterministic Grading**: Instantly grades choices and evaluates written answers against ground-truth keys. If an answer is incorrect:
  - Clearly shows the student's selected option alongside the correct answer.
  - Automatically flips the interactive **Active Recall Flashcard** to display the complete solution, formulas, and memory tips.
  - Awards `Mastery Score: 0%` (`Grade: F`) without false score inflation.
- **Habit & Honors Attribution**: Logs daily deep study habit entries and awards honors CGPA trajectory points only on mastered responses.
- **Deep Work Flow Sprint**: One-tap launch into an automated 25-minute Pomodoro study block directly from the quiz.

---

### 🎓 3. Course Attendance & 75% Bunk Simulator
*Stay safely above mandatory university attendance thresholds (75% rule).*

- **True Zero-State Accuracy**: Fresh courses initialize at `0%` / `0 Classes Logged` without misleading mock numbers.
- **Multi-Course Management**: Track attendance individually for all subjects with course codes, credits, and weekly class schedules.
- **One-Tap Class Logging**: Record daily class outcomes with single-tap actions for `Present`, `Absent`, or `Cancelled`.
- **Safe Bunk Calculator**: Calculates the exact number of upcoming classes you can safely miss while remaining at or above 75%.
- **Deficit Recovery Calculator**: Computes the exact streak of consecutive classes you must attend to recover from an attendance deficit.
- **Visual Status Badges**: High-contrast indicators indicating good standing or urgent deficit warnings.

---

### 📈 4. 10.0 CGPA Benchmark & Academic Trajectory
*Standardized on the universal 10.0 Honors CGPA scale.*

- **Target Benchmark Progress Ring**: Visual progress dial displaying current cumulative CGPA against your target honors threshold (e.g. `9.20 / 10.00`).
- **Required Semester GPA Projection**: Dynamically calculates the average semester GPA needed across remaining semesters to graduate in your target honors tier.
- **Semester History Log**: Track your historical semester-by-semester GPA and academic momentum over time.

---

### 📋 5. Assignment Sprint & Milestone Board
*Track lab reports, deliverables, and exam deadlines.*

- **4-Column Visual Kanban**: Organize tasks through `Backlog`, `In Progress`, `Under Review`, and `Completed`.
- **Priority & Urgency Badges**: Color-coded indicators (`Urgent`, `High`, `Medium`, `Low`) for optimal daily prioritization.
- **Course Linking**: Associate each assignment with its respective enrolled course code.

---

### 🌿 6. 120-Day Habit Consistency Heatmap
*Build sustainable daily study habits and track consistency streaks.*

- **4 Key Habit Tracks**:
  - 📚 **Deep Study** (Target: 4h / day)
  - 💻 **Coding & Problem Solving** (Target: 2h / day)
  - 🏫 **Classroom Attendance** (Target: 100% daily)
  - 💧 **Hydration & Health** (Target: 2.5L water & exercise)
- **120-Day Contribution Heatmap**: Visual grid tracking daily dedication and study streaks.
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
- **Google OAuth & Academic Sign-In**: Quick login with Google OAuth or academic email credentials.
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

1. **Zero Dummy Data**: Scholar OS never pre-populates fake courses or mock attendance. You start with a clean slate tailored to your real university semester.
2. **Speed & Clarity**: High-contrast, dark-mode visual hierarchy with clear typography and minimal friction.
3. **Privacy & Ownership**: Your coursework, attendance records, and lecture notes remain secure and private to your account.

---

## 🛠️ Technical Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Vision & Chat**: [Google Gemini 2.5 Flash (`@google/genai`)](https://deepmind.google/technologies/gemini/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/) with Local & Cloud Persistence
- **Database & Sync**: [Upstash Redis](https://upstash.com/)
- **Typesetting**: [KaTeX](https://katex.org/) for mathematical and scientific notations
- **Audio Engine**: Web Audio API binaural frequency synthesis
- **Authentication**: Google OAuth 2.0 & Token-based Session Management
- **Deployment**: [Vercel](https://scholardashboard.vercel.app)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ installed
- npm, pnpm, or yarn

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
# UPSTASH_REDIS_REST_URL="your_redis_url"
# UPSTASH_REDIS_REST_TOKEN="your_redis_token"
# NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Author & Maintainer

**Swapnoneel Mondal** ([@KaiX-Jr](https://github.com/KaiX-Jr))
- GitHub: [https://github.com/KaiX-Jr](https://github.com/KaiX-Jr)
- Repository: [https://github.com/KaiX-Jr/scholar-os](https://github.com/KaiX-Jr/scholar-os)
- Live Platform: [https://scholardashboard.vercel.app](https://scholardashboard.vercel.app)

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

<div align="center">

**Empowering students and researchers with a modern academic operating system.**

[⭐ Star on GitHub](https://github.com/KaiX-Jr/scholar-os) · [🚀 Launch Scholar OS](https://scholardashboard.vercel.app)

</div>
