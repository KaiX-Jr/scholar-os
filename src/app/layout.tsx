import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LiquidCursor } from "@/components/ui/LiquidCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scholar OS — Cognitive Operating System for Scholars",
  description: "High-performance scroll-driven canvas studio with optical blackboard LaTeX synthesis, active recall flashcards, and deep work neuro-acoustics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white antialiased selection:bg-cyan-500/30 min-h-screen overflow-x-hidden">
        <LiquidCursor />
        {children}
      </body>
    </html>
  );
}
