# 🎓 Scholar OS — The Cognitive Operating System for Scholars

<div align="center">

![Scholar OS Banner](https://img.shields.io/badge/Scholar%20OS-Cognitive%20Operating%20System-00f2fe?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMjAuNSA3VjE3TDEyIDIyTDMuNSAxN1Y3TDEyIDJaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGYyZmUiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_API-AI_Powered-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Upstash Redis](https://img.shields.io/badge/Upstash_Redis-Cloud_Sync-00E599?style=flat-square&logo=redis)](https://upstash.com/)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-Sign_In-EA4335?style=flat-square&logo=google)](https://developers.google.com/identity)
[![Zustand](https://img.shields.io/badge/Zustand-State_Manager-FF6B35?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

**A next-generation, full-stack academic productivity operating system combining optical board-to-study AI extraction, real-time cross-device cloud sync, smart attendance tracking, milestone pipelines, habit streak heatmaps, and deep work focus synthesis — all rendered in a liquid-glass obsidian design language.**

[🚀 Live Deployment](https://scholar-os.vercel.app) · [⚙️ Tech Stack](#-technology-stack) · [🛠 Installation & Setup](#-installation--setup) · [📱 Zero-State Philosophy](#-zero-state-philosophy)

</div>

---

## ✨ What is Scholar OS?

**Scholar OS** is a premium, zero-state academic workspace built for university scholars and students who want complete mastery over their academic trajectory. It starts completely empty on Day 0 and organically adapts to your exact college subjects, attendance records, study milestones, and habit streaks.

Every metric in your workspace is 100% verified and synchronized across all your devices (desktop, laptop, tablet, mobile) via a reactive cloud sync engine.

---

## 🔑 Core Features & Architectures

### 📸 Board-to-Study Optical OCR Studio & Saved Board Shelf
> *Powered by Google Gemini 2.0 Flash Vision API & Upstash Serverless Redis*

- **Photograph-to-Notes Pipeline**: Upload or drag-drop chalkboard or whiteboard snapshots from live university lectures.
- **In-Browser Classroom Camera Capture**: Take real-time high-resolution snaps of lecture boards directly from your device camera.
- **Interactive Subject & Course Tagging**: Intercepts uploads with a sleek modal dropdown to tag boards to your enrolled courses (`[CS301]`, `[MATH201]`, etc.) or custom subjects.
- **Curriculum-Grounded Multimodal AI**: Gemini 2.0 Flash extracts handwritten derivations, proofs, diagrams, and formulas tailored to your course syllabus.
- **LaTeX & Markdown Formatting**: Generates clean, structured lecture notes, derivation breakdowns, key takeaways, and flashcards with instant KaTeX math rendering.
- **Lecture History & Saved Boards Shelf**:
  - Kokonut UI / Magic UI `BorderBeam` animated horizontal carousel.
  - One-click switching between past saved lecture boards.
  - Distinct course badges and **Subject Filter Bar** (`All`, `[PHYS301]`, `[CS420]`, etc.) to filter boards by course.
  - 100% synchronized across all your devices via Cloud Redis.
- **3D Flip-Card Active Recall Deck**: Interactive spaced repetition deck with 3-column mobile-responsive rating grid (`Again`, `Hard`, `Good`, `Easy`) and keyboard controls (`Space` to flip, `←` / `→` to navigate).
- **Contextual Study Chat Assistant**: Ask clarifying questions, request proof explanations, and solve practice problems dynamically grounded in the active board notes and LaTeX formulas.
- **Pre-Loaded Sample Library**: Interactive demonstrations covering Quantum Mechanics, Deep Neural Networks, and Fourier Analysis.

---

### ☁️ Real-Time Cross-Device Cloud Sync
> *Powered by Upstash Serverless Redis & Reactive Zustand Subscriptions*

- **Instant Cross-Device Parity**: Log in from your laptop, tablet, or phone — your enrolled courses, attendance records, milestone tasks, habit heatmaps, avatar selections, and **saved lecture boards** immediately sync in real time.
- **Debounced Auto-Sync Engine**: State mutations automatically trigger non-blocking cloud delta synchronization.
- **Zero Data Loss Guarantee**: Local storage persistence acts as an offline cache with instant Redis cloud reconciliation on reconnection.

---

### 🔐 Google OAuth & React Bits Specular Button
- **One-Tap Google Sign-In**: Integrated with Google Identity Services (GSI) and server-side token verification.
- **React Bits Specular Button**: Interactive glass-style Google authentication button with cursor-tracking specular rim light and dynamic ambient glare.
- **Custom Academic Email Authentication**: Secure password hashing with JWT session tokens.

---

### 👤 Kokonut UI Profile Dropdown & Avatar System
- **Signature Bending Line Indicator**: Smooth SVG indicator responding dynamically to hover and dropdown toggle states.
- **Multi-Color Gradient Halo Ring**: Elegant purple-to-orange glowing ring surrounding the user's avatar.
- **Academic Status Badges**: Real-time display of current Campus/University, Semester, and Target CGPA.
- **Procedural SVG Avatar Picker**: 4 unique SVG avatar faces with animated selection glow stage and thumbnail checkmark selectors, synced to your account.
- **Quick Controls**: One-click *Manage Enrolled Courses*, *Reset Workspace to Zero State*, and *Sign Out*.

---

### 📊 CGPA Trajectory & Honors Projection Ring
- **Holographic Circular Gauge**: Ultra-smooth progress meter tracking cumulative CGPA toward a 4.00 honors target.
- **Remaining Term GPA Projection**: Automatically calculates the average GPA required across remaining terms to reach your target honors degree tier.
- **Historical Semester Record**: Clean visual breakdown of past semester GPAs and credit load.
- **Degree Progress Meter**: Real-time percentage tracking toward degree completion.

---

### 🎓 Course Attendance Tracker & Bunk Simulator
> *Tailored for mandatory minimum attendance policies (75% threshold)*

- **Unlimited Course Management**: Add courses with custom course codes, names, credits, and weekly class schedules.
- **One-Tap Class Logging**: Mark daily classes as `Present (+1 attended, +1 total)`, `Absent (+1 total)`, or `Class Cancelled`.
- **Smart Bunk Calculator**:
  - *Safe Zone*: Calculates exactly how many upcoming lectures you can safely skip without dropping below 75%.
  - *Deficit Zone*: Computes the exact number of consecutive classes you must attend to recover your attendance status.
- **Color-Coded Status Badges**: Instant visual indicators for `🟢 Safe` and `🔴 Low Attendance Warning`.

---

### 🌿 120-Day Academic Habit Consistency Heatmap
- **GitHub-Style Contribution Grid**: 120-day heatmap tracking consistency in Deep Study, Problem Solving, and Reading.
- **Interactive Multi-Level Logging**: Click any grid square to cycle intensity (`0 → 1 → 2 → 3 → 4`).
- **Streak Velocity Engine**: Real-time active streak counters, longest streak record, and completion percentage.

---

### ⏱️ Deep Work Focus Synthesizer (Pomodoro Engine)
- **Three Mode Intervals**: `Focus (25m)`, `Short Break (5m)`, `Long Break (15m)` with automatic mode progression.
- **Binaural Ambience Synthesizer**: Generates real-time audio tones using Web Audio API oscillators:
  - *Brown Noise, Alpha Waves (10Hz), Rain Ambience, Coding Flow, Silence*.
- **Live Frequency Spectrum Visualizer**: Animated canvas audio visualizer reflecting active audio frequencies.

---

### ✅ Milestone & Assignment Sprint Kanban
- **Drag-and-Drop Workflow**: Move tasks across `Backlog → In Progress → Review → Done`.
- **Priority Urgency Badges**: Encoded color tags for `Urgent`, `High`, `Medium`, and `Low` priority deadlines.
- **Course Linking**: Tag assignments directly to enrolled college courses.

---

## 🎨 Design System & Aesthetics

Scholar OS is designed with an **Obsidian Liquid-Glass** aesthetic:

| Component | Design Pattern |
|---|---|
| **Atmosphere** | React Bits multi-layer fluid Aurora mesh background |
| **Cursor** | Magnetic liquid cursor with spring inertia physics & click ripples |
| **Lighting** | Magic UI Border Beam neon lasers + Specular cursor highlights |
| **Dials** | Immersive holographic glass dials with native SVG glow filters |
| **Navigation** | macOS-style magnifying dock with spring hover physics |
| **Buttons** | React Bits Specular Buttons & obsidian capsule pills |

---

## 🧠 Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + Vanilla CSS Variables |
| **Cloud Database** | Upstash Serverless Redis (REST API) |
| **State Management** | Zustand with reactive auto-sync subscriptions |
| **AI / Multimodal Vision** | Google Gemini API (`gemini-2.0-flash-exp`) |
| **Authentication** | Google Identity Services OAuth + JWT Session Tokens |
| **Animations** | Framer Motion 11 |
| **Math Typesetting** | KaTeX |
| **Audio Engine** | Web Audio API (OscillatorNode & AudioContext) |
| **UI Components** | React Bits, Kokonut UI, Magic UI |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main OS Dashboard entry
│   ├── globals.css                 # Obsidian dark tokens & animations
│   ├── layout.tsx                  # Root metadata & font configurations
│   └── api/
│       ├── analyze-board/          # Gemini Vision multimodal OCR endpoint
│       ├── auth/
│       │   ├── google/             # Google OAuth token verification
│       │   ├── login/              # Email/password authentication
│       │   └── register/           # New scholar account registration
│       ├── chat/                   # Board-contextual AI chat endpoint
│       ├── concierge/              # Scholar OS AI assistant endpoint
│       └── sync/                   # Upstash Redis push/pull cloud synchronization
├── components/
│   ├── academic/
│   │   ├── AcademicCommandCenter.tsx   # Layout container
│   │   ├── AssignmentKanban.tsx        # Drag-and-drop assignment sprint board
│   │   ├── AttendanceTracker.tsx       # 75% threshold attendance + bunk simulator
│   │   └── CgpaProgressRing.tsx        # Holographic CGPA trajectory dial
│   ├── auth/
│   │   ├── AuthModal.tsx               # Sign in / Sign up modal with Google OAuth
│   │   ├── AvatarPicker.tsx            # Kokonut UI SVG procedural avatar picker
│   │   └── OnboardingWizard.tsx        # 3-step zero-state onboarding wizard
│   ├── canvas/
│   │   └── ScrollCanvasSequence.tsx    # 250-frame 4K scroll sequence background
│   ├── dashboard/
│   │   └── ScrollDashboardOverlay.tsx  # Hero showcase + metric dials
│   ├── habits/
│   │   ├── AppleActivityCard.tsx       # Kokonut UI concentric activity rings
│   │   ├── HabitStreakHeatmap.tsx      # 120-day habit contribution heatmap
│   │   ├── PomodoroTimer.tsx           # Deep work focus timer + Web Audio synth
│   │   └── AudioVisualizer.tsx         # Live Web Audio frequency visualizer
│   ├── navigation/
│   │   ├── TopNav.tsx                  # Floating glass navigation pill
│   │   └── UserProfileMenu.tsx         # Kokonut UI profile dropdown with bending line
│   ├── vision/
│   │   ├── BoardToStudyStudio.tsx      # Main OCR workspace
│   │   ├── BoardHistoryShelf.tsx       # Kokonut UI lecture history & saved board carousel
│   │   ├── ActiveRecallFlashcards.tsx  # 3D active recall flip deck
│   │   ├── ContextualChatDrawer.tsx    # Chalkboard AI chat interface
│   │   ├── DerivationBreakdown.tsx     # Step-by-step mathematical proofs
│   │   ├── StructuredNotesViewer.tsx   # KaTeX formatted lecture notes
│   │   ├── SampleBoardsLibrary.ts      # Preloaded sample board library
│   │   └── HighResImageViewer.tsx      # Pan & zoom board image viewer with course selector
│   └── ui/
│       ├── SpecularButton.tsx          # React Bits cursor-tracking specular button
│       ├── CircularProgress.tsx        # Immersive holographic progress dial
│       ├── MagicCard.tsx               # Cursor spotlight card with Border Beam
│       ├── BorderBeam.tsx              # Rotating neon laser border
│       ├── AnimatedShinyText.tsx       # Shimmer headline typography
│       ├── AuroraBackground.tsx        # Ambient fluid Aurora mesh layer
│       ├── LiquidCursor.tsx            # Trailing magnetic cursor
│       ├── Dock.tsx                    # macOS spring magnification dock
│       ├── KokonutToggle.tsx           # Spring toggle switch
│       └── Badge.tsx                   # Status indicator badges
├── store/
│   └── useScholarStore.ts              # Zustand global store + reactive Redis sync
├── types/
│   └── scholar.ts                      # TypeScript interfaces & domain types
├── hooks/
│   ├── useBoardAnalysis.ts             # Multimodal board analysis hook
│   └── useSoundSynth.ts               # Web Audio binaural frequency generator
└── lib/
    ├── gemini.ts                       # Google Gemini API client
    ├── redis.ts                        # Upstash Redis client configuration
    └── utils.ts                        # Styling utilities
```

---

## ⚡ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- A free [Google Gemini API Key](https://aistudio.google.com/app/apikey)
- A free [Upstash Redis Database](https://upstash.com/)
- (Optional) A [Google Cloud OAuth Client ID](https://console.cloud.google.com/apis/credentials) for Google Sign-In

### 1. Clone the Repository
```bash
git clone https://github.com/KaiX-Jr/scholar-os.git
cd scholar-os
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Upstash Redis (For cross-device cloud sync)
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token_here

# Google OAuth (For Google Sign-In)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
```

### 4. Launch Development Server
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

## 🚀 Deployment (Vercel)

Deploy your own Scholar OS instance with a single click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KaiX-Jr/scholar-os)

### Manual Setup on Vercel:
1. Push your repository to GitHub.
2. Import the repository into [Vercel Dashboard](https://vercel.com/new).
3. In **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. Click **Deploy**.

---

## 📱 Zero-State Philosophy

Scholar OS is strictly zero-state. There are **no dummy courses, mock grades, or placeholder logs**. When a new scholar creates an account:

- 📚 **Courses**: Blank → configured via the 3-step Onboarding Wizard.
- 📆 **Attendance**: Starts at `0/0` until you log your first class.
- 🌿 **Habit Heatmap**: All 120 squares start blank.
- 📋 **Kanban**: Empty sprint board awaiting your actual deadlines.
- 📈 **CGPA Gauge**: Reflects your entered target honors tier.

---

## 🔒 Security & Privacy

- **Data Privacy**: Academic notes, courses, and habit records belong solely to the user.
- **Secure Cloud Sync**: Cross-device synchronization is encrypted via HTTPS and secured with Upstash Redis tokens.
- **Authentication**: Passwords are securely hashed; Google OAuth authentication is validated directly against Google's public token authority.

---

## 📄 License

[MIT](LICENSE) © [KaiX-Jr](https://github.com/KaiX-Jr) — Free to use, fork, and build upon.

---

<div align="center">

**Crafted with 🧠 for students and scholars worldwide.**

[![GitHub stars](https://img.shields.io/github/stars/KaiX-Jr/scholar-os?style=social)](https://github.com/KaiX-Jr/scholar-os/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/KaiX-Jr/scholar-os?style=social)](https://github.com/KaiX-Jr/scholar-os/network)

</div>
