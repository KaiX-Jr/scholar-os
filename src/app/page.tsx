import { ScrollCanvasSequence } from "@/components/canvas/ScrollCanvasSequence";
import { ScrollDashboardOverlay } from "@/components/dashboard/ScrollDashboardOverlay";
import { AmbientParticlesMesh } from "@/components/ui/AmbientParticlesMesh";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { LiquidCursor } from "@/components/ui/LiquidCursor";
import { AuthModal } from "@/components/auth/AuthModal";
import { OnboardingWizard } from "@/components/auth/OnboardingWizard";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* 1. Fluid Magnetic Fluid Cursor (React Bits) */}
      <LiquidCursor />

      {/* 2. Base Sticky Fixed Canvas Scroll Animation (z-0) */}
      <ScrollCanvasSequence />

      {/* 3. React Bits Aurora Glow Atmosphere (z-[3]) */}
      <AuroraBackground />

      {/* 4. Interactive GPU Ambient Particle Constellation (z-[5]) */}
      <AmbientParticlesMesh />

      {/* 5. Interactive Scholar Dashboard Overlays (z-10) */}
      <div className="relative z-10">
        <ScrollDashboardOverlay />
      </div>

      {/* 6. Global Modals: Auth & Onboarding Wizard */}
      <AuthModal />
      <OnboardingWizard />
    </main>
  );
}
