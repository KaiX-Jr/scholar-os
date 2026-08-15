# 🎓 Scholar OS — The Cognitive Operating System for Scholars

<div align="center">

![Scholar OS Banner](https://img.shields.io/badge/Scholar%20OS-Cognitive%20Operating%20System-00f2fe?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMjAuNSA3VjE3TDEyIDIyTDMuNSAxN1Y3TDEyIDJaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGYyZmUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_API-AI_Powered-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-State_Manager-FF6B35?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

**A next-generation, full-stack academic productivity dashboard that combines optical board-to-study extraction, smart attendance tracking, habit streaks, milestone management, and deep work focus synthesis — all wrapped in a stunning liquid-glass, dark-obsidian UI.**

[🚀 Live Demo](#) · [📸 Screenshots](#screenshots) · [⚙️ Tech Stack](#tech-stack) · [🛠 Installation](#installation)

</div>

---

## ✨ What is Scholar OS?

**Scholar OS** is a premium, zero-state academic workspace built for students who want full control over their academic performance. It starts completely empty on Day 0 and grows with your data — your courses, your attendance, your streaks, your milestones.

It is not a template with dummy data. Every number you see, you logged.

---

## 🔑 Core Features

### 📸 Board-to-Study Optical OCR Studio
> *Powered by Google Gemini Vision API*

- **Upload or drag-drop** a lecture chalkboard/whiteboard photograph
- **Live Camera Capture** directly from browser
- **Gemini Vision AI** extracts all handwritten content with high accuracy
- **Auto-generates** structured LaTeX-formatted notes, derivation breakdowns, flashcards, and suggested exam questions
- **3D Flip Card Active Recall Deck** — keyboard-controlled (`Space`, `←`, `→`) for self-testing
- **Contextual Chat Drawer** — ask follow-up questions about the board content
- **KaTeX-rendered** mathematical formulas and equations
- **Sample Chalkboard Library** with pre-loaded quantum mechanics, Fourier transforms, and calculus problems

---

### 📊 CGPA Trajectory & Honors Projection Ring
- **Circular progress gauge** tracking current vs target CGPA (out of 4.0)
- **Remaining credit analysis** — calculates the GPA you need to maintain across remaining semesters to hit your target
- **Semester historical record** — visual grid of past GPA scores per semester
- **Magna Cum Laude / Degree completion** percentage tracker

---

### ✅ Assignment & Milestone Sprint Board (Kanban)
- **Drag-and-drop Kanban columns**: `Backlog → In Progress → Review → Done`
- **Quick add** assignments with: course code, deadline, priority level (`Urgent / High / Medium / Low`)
- **Priority color badges** with encoded urgency indicators
- **Dynamic count** per column with real-time updates
- All data persisted in `localStorage` via Zustand

---

### 🎓 Course Attendance Tracker & Bunk Simulator
> *The smartest attendance engine for Indian university students*

- **Add unlimited enrolled courses** with custom course code, name, and credits
- **Daily class logging** with three states: `Present (+1 attended, +1 total)`, `Absent (+1 total)`, `Off / Cancelled`
- **Real-time attendance percentage** computed per course
- **75% Mandatory Threshold enforcement** — color-coded `🟢 Safe` / `🔴 Low Attendance Alert` badges
- **Smart Bunk Calculator**:
  - If safe: *"You can safely skip X more classes"*
  - If in deficit: *"You must attend Y consecutive classes to reach 75%"*
- **Per-course analytics panel** with exact bunk count and recovery projection

---

### 🌿 120-Day Habit Consistency Heatmap
- **GitHub-style contribution heatmap** for academic habits (study hours, practice problems, reading, etc.)
- Starts at **Day 0** (completely empty) and fills as you log your days
- **Click any square** to cycle intensity: `0 → 1 → 2 → 3 → 4`
- **Live streak counter** — current active streak in days
- **Longest streak record** and total logged units
- **Category switcher**: Study Hours, Problems Solved, Books Read, Revision Sessions

---

### ⏱️ Deep Work Focus Synthesizer (Pomodoro Engine)
- **Circular SVG progress ring** with smooth animation
- **Three session modes**: `Focus (25 min)`, `Short Break (5 min)`, `Long Break (15 min)`
- **Auto-session cycling** — seamlessly transitions between work and breaks
- **Ambient Web Audio Synth** — generates real-time binaural tones:
  - Brown Noise, Alpha Waves, Rain Ambience, Coding Focus, Silence
- **Live frequency spectrum visualizer** (Web Audio API canvas bars)
- **Session completed counter** with focus hours logged

---

### 🔐 Authentication & Personalized Onboarding

#### Auth Modal
- **Sign Up / Sign In** via academic email with form validation
- Frosted liquid-glass dialog with **Magic UI MagicCard** and rotating **BorderBeam**
- Session persisted in `localStorage`

#### 3-Step Onboarding Wizard
1. **Academic Profile**: Full name, college/university, current semester (1–8), target CGPA slider (3.00–4.00)
2. **Enrolled Courses**: Add all your college subjects with course code, title, and credit hours — zero hardcoded dummy data
3. **Weekly Class Schedule**: Select which days of the week each course runs (Mon–Sat toggles per course)
4. **Celebration confetti** fires on workspace launch 🎉

---

### 👤 User Profile Dashboard
- **Avatar pill** in top-right with user initials and semester badge
- **Dropdown menu** showing:
  - Campus name and target CGPA summary
  - *Manage Enrolled Courses* — re-open onboarding wizard
  - *Reset Data to Zero State* — wipe all logs back to Day 0
  - *Log Out* — clear session

---

### 🎨 UI/UX — Premium Visual Design System

Scholar OS is built with a meticulously crafted **obsidian liquid-glass design language**:

#### Ambient Atmosphere
- **React Bits Aurora Background** — multi-layer fluid ambient mesh rendered behind all panels
- **Magnetic Liquid Cursor** — trailing cursor with spring inertia physics and click ripples

#### Magic UI Components
- **Animated Shiny Text** — specular shimmer effect on the hero headline
- **Magic Card** — interactive cursor-spotlight illumination with gradient glow
- **Border Beam** — rotating laser neon border on metric cards and auth modal
- **Circular Progress Meters** — SVG animated progress rings for CGPA and attendance

#### Kokonut UI Components
- **Spring-Physics Toggle Switch** — for daily habit check-ins
- **Glassmorphic Card Container** — with cursor spotlight and specular top refraction

#### Navigation
- **Magnifying Dock** (macOS-style icon magnification) — center navigation with hover spring physics
- **Infinite 3D Carousel Menu** — cylindrical continuous scroll menu for quick section navigation
- **Obsidian Capsule Buttons** — all buttons follow a unified `rounded-full backdrop-blur` system

#### Style Palette
```
Background:   #08080f / #0a0b16 (Deep Obsidian)
Glass:        backdrop-blur-3xl bg-white/[0.03-0.06]
Accent Cyan:  #00f2fe / #38bdf8
Accent Indigo:#6366f1
Accent Purple:#a855f7
Accent Emerald:#10b981
Border:       border-white/[0.08-0.15]
Shadow:       0_8px_32px_rgba(0,0,0,0.6) (Deep Liquid Glass)
```

---

## 🧠 Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + Vanilla CSS |
| **State Management** | Zustand with `persist` middleware (localStorage) |
| **AI / Vision** | Google Gemini API (`gemini-2.0-flash-exp`) |
| **Animations** | Framer Motion 11 |
| **Math Rendering** | KaTeX |
| **Audio Engine** | Web Audio API (oscillators + white noise) |
| **UI Libraries** | Magic UI, React Bits, Kokonut UI |
| **Icons** | Lucide React |
| **Fonts** | Inter, JetBrains Mono |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main app entry
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── api/
│       ├── analyze-board/          # Gemini Vision OCR endpoint
│       ├── chat/                   # Contextual board chat endpoint
│       └── concierge/              # Scholar AI assistant endpoint
├── components/
│   ├── academic/
│   │   ├── AcademicCommandCenter.tsx   # 2-column layout container
│   │   ├── AssignmentKanban.tsx        # Drag-and-drop Kanban board
│   │   ├── AttendanceTracker.tsx       # Daily logging + bunk simulator
│   │   └── CgpaProgressRing.tsx        # CGPA progress gauge + projection
│   ├── auth/
│   │   ├── AuthModal.tsx               # Sign in / Sign up modal
│   │   └── OnboardingWizard.tsx        # 3-step onboarding
│   ├── dashboard/
│   │   └── ScrollDashboardOverlay.tsx  # Hero section + metric cards
│   ├── habits/
│   │   ├── HabitStreakHeatmap.tsx      # 120-day contribution heatmap
│   │   ├── PomodoroTimer.tsx           # Deep work focus timer
│   │   ├── HabitProductivityMatrix.tsx # Layout container
│   │   └── AudioVisualizer.tsx         # Live frequency spectrum canvas
│   ├── navigation/
│   │   ├── TopNav.tsx                  # Top navigation bar
│   │   └── UserProfileMenu.tsx         # Avatar pill + dropdown
│   ├── vision/
│   │   ├── BoardToStudyStudio.tsx      # Main OCR studio layout
│   │   ├── ActiveRecallFlashcards.tsx  # 3D flip card deck
│   │   ├── ContextualChatDrawer.tsx    # Board chat interface
│   │   ├── DerivationBreakdown.tsx     # Step-by-step derivations
│   │   ├── StructuredNotesViewer.tsx   # Formatted notes + LaTeX
│   │   ├── SampleBoardsLibrary.ts      # Demo chalkboard data
│   │   └── HighResImageViewer.tsx      # Uploaded image viewer
│   └── ui/
│       ├── MagicCard.tsx               # Cursor spotlight card
│       ├── BorderBeam.tsx              # Rotating neon border
│       ├── AnimatedShinyText.tsx       # Shimmer headline text
│       ├── CircularProgress.tsx        # SVG progress rings
│       ├── PulsatingButton.tsx         # Capsule pulsating button
│       ├── InteractiveHoverButton.tsx  # Capsule hover button
│       ├── ScholarLogoButton.tsx       # Isometric brand logo pill
│       ├── InfiniteMenu.tsx            # 3D cylindrical carousel menu
│       ├── Dock.tsx                    # macOS magnification dock
│       ├── KokonutToggle.tsx           # Spring toggle switch
│       ├── KokonutGlassCard.tsx        # Glassmorphic card
│       ├── AuroraBackground.tsx        # Fluid ambient mesh layer
│       ├── LiquidCursor.tsx            # Magnetic trailing cursor
│       ├── Badge.tsx                   # Status badges
│       └── GlassCard.tsx              # Base glass card
├── store/
│   └── useScholarStore.ts              # Zustand global state
├── types/
│   └── scholar.ts                      # TypeScript types
├── hooks/
│   ├── useBoardAnalysis.ts             # Board OCR logic
│   └── useSoundSynth.ts               # Web Audio synth hook
└── lib/
    ├── gemini.ts                       # Gemini API client
    └── utils.ts                        # Utility helpers
```

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository
```bash
git clone https://github.com/KaiX-Jr/scholar-os.git
cd scholar-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🚀 Deploy to Vercel

The fastest way to deploy Scholar OS:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KaiX-Jr/scholar-os)

Or manually:
1. Push to GitHub (already done ✅)
2. Go to [vercel.com/new](https://vercel.com/new) and import `KaiX-Jr/scholar-os`
3. Add environment variable: `GEMINI_API_KEY = your_key`
4. Click **Deploy**

---

## 📱 Zero-State Philosophy

Scholar OS starts completely empty. There are **no pre-filled courses, no fake attendance records, no mock habit data**. When you first sign up:

- 📚 **Courses**: Empty → add via onboarding
- 📆 **Attendance**: `0/0` per course until you log classes
- 🌿 **Habit Heatmap**: All squares blank until you check in
- 📋 **Kanban**: Empty board until you add assignments
- 📈 **CGPA Ring**: Shows your entered target until you update

Your data. Your workspace. Built from Day 0.

---

## 🔒 Data & Privacy

All user data is stored **locally in your browser's `localStorage`** via Zustand `persist` middleware. No user data is sent to any server or database. The only external API call is to **Google Gemini** when you upload a board image for OCR analysis.

Your academic workspace is 100% yours.

---

## 🛠 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

[MIT](LICENSE) — Free to use, modify, and distribute.

---

<div align="center">

**Built with 🧠 by [KaiX-Jr](https://github.com/KaiX-Jr)**

*Scholar OS — Because your academic potential deserves a premium workspace.*

[![GitHub stars](https://img.shields.io/github/stars/KaiX-Jr/scholar-os?style=social)](https://github.com/KaiX-Jr/scholar-os/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/KaiX-Jr/scholar-os?style=social)](https://github.com/KaiX-Jr/scholar-os/network)

</div>
