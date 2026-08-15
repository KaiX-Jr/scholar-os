"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Star, Sparkles, ArrowUpRight, Check, X, Compass, Info, Ticket } from "lucide-react";

interface Monument {
  id: string;
  name: string;
  frenchName: string;
  category: "spire" | "museum" | "historic" | "palace";
  image: string;
  arrondissement: string;
  description: string;
  highlights: string[];
  insiderTip: string;
  hours: string;
  price: string;
  vipPrice: string;
  rating: number;
  reviews: number;
}

const MONUMENTS_DATA: Monument[] = [
  {
    id: "eiffel-tower",
    name: "The Eiffel Tower",
    frenchName: "La Tour Eiffel",
    category: "spire",
    image: "/assets/paris-hero-1.jpg",
    arrondissement: "7th Arrondissement • Champ de Mars",
    description: "The supreme global icon of Paris and architectural triumph engineered by Gustave Eiffel for the 1889 World's Fair. Soars 330 meters above the Seine.",
    highlights: [
      "Summit Champagne Bar with panoramic views",
      "Nightly 20,000-bulb sparkling light show every hour",
      "1st floor transparent glass floor suspended 57m high",
      "Michelin-starred Le Jules Verne dining on level 2"
    ],
    insiderTip: "For the most cinematic sunset photos, visit Pont de Bir-Hakeim or Avenue de Camoens where the tower aligns perfectly between classic Haussmann buildings.",
    hours: "09:00 - 23:45 Daily",
    price: "€29.40",
    vipPrice: "€85.00 (Skip-the-Line Lift)",
    rating: 4.9,
    reviews: 14280,
  },
  {
    id: "louvre-museum",
    name: "The Louvre Museum",
    frenchName: "Musée du Louvre",
    category: "museum",
    image: "/assets/paris-hero-2.jpg",
    arrondissement: "1st Arrondissement • Rue de Rivoli",
    description: "The world's largest art museum and historic royal palace housing over 35,000 masterpieces across 73,000 square meters of exhibition space.",
    highlights: [
      "Leonardo da Vinci's enigmatic Mona Lisa",
      "The Winged Victory of Samothrace & Venus de Milo",
      "I.M. Pei's iconic glass pyramid courtyard",
      "Opulent Napoleon III State Apartments"
    ],
    insiderTip: "Enter through the Carrousel du Louvre underground entrance on Rue de Rivoli to bypass the long exterior pyramid security lines.",
    hours: "09:00 - 18:00 (Open late Fri until 21:45)",
    price: "€22.00",
    vipPrice: "€68.00 (Masterpiece Guided Tour)",
    rating: 4.8,
    reviews: 19850,
  },
  {
    id: "arc-de-triomphe",
    name: "Arc de Triomphe",
    frenchName: "Arc de Triomphe de l'Étoile",
    category: "historic",
    image: "/assets/paris-hero-3.jpg",
    arrondissement: "8th Arrondissement • Place Charles de Gaulle",
    description: "Commissioned by Napoleon in 1806 to honor the Grande Armée. Anchors the western end of the world-famous Avenue des Champs-Élysées.",
    highlights: [
      "Panoramic rooftop terrace overlooking 12 radiating boulevards",
      "Tomb of the Unknown Soldier & eternal flame rekindling ceremony (18:30)",
      "Intricate neoclassical bas-relief military sculptures",
      "Direct line of sight along the Historical Axis to La Défense"
    ],
    insiderTip: "Access via the underground pedestrian tunnel beneath the roundabout—never try to cross the chaotic traffic above ground!",
    hours: "10:00 - 22:30 Daily",
    price: "€16.00",
    vipPrice: "€38.00 (Priority Sunset Pass)",
    rating: 4.8,
    reviews: 8920,
  },
  {
    id: "notre-dame",
    name: "Notre-Dame Cathedral",
    frenchName: "Cathédrale Notre-Dame de Paris",
    category: "historic",
    image: "/assets/paris-hero-1.jpg",
    arrondissement: "4th Arrondissement • Île de la Cité",
    description: "The crowning jewel of French Gothic architecture founded in 1163 on the historic cradle island of Paris, meticulously restored after the 2019 fire.",
    highlights: [
      "Gothic rose stained glass windows dating back to the 13th century",
      "Restored golden rooster spire rising 96 meters",
      "Great 8,000-pipe organ and bell towers",
      "Archaeological Crypt beneath the parvis square"
    ],
    insiderTip: "Stroll along Quai de Montebello at twilight for reflection views of the flying buttresses glowing across the Seine.",
    hours: "08:00 - 19:00 Daily",
    price: "Free (Nave)",
    vipPrice: "€18.00 (Tower & Crypt Access)",
    rating: 4.9,
    reviews: 11400,
  },
  {
    id: "sacre-coeur",
    name: "Sacré-Cœur & Montmartre",
    frenchName: "Basilique du Sacré-Cœur",
    category: "historic",
    image: "/assets/paris-hero-2.jpg",
    arrondissement: "18th Arrondissement • Montmartre Hill",
    description: "Perched atop the highest peak of Paris, this Romano-Byzantine white travertine basilica overlooks the historic bohemian artists' quarter.",
    highlights: [
      "Unrivaled 360-degree panorama across all 20 arrondissements",
      "Place du Tertre open-air portrait artists and historic bistros",
      "Vignes du Clos Montmartre (historic working Parisian vineyard)",
      "Historic cabaret landmarks like Le Consulat and Maison Rose"
    ],
    insiderTip: "Ride the Montmartre Funicular with a standard metro ticket to save energy before climbing up the dome terrace.",
    hours: "06:30 - 22:30 Daily",
    price: "Free (Basilica)",
    vipPrice: "€12.00 (Dome Climb Pass)",
    rating: 4.7,
    reviews: 9340,
  },
  {
    id: "versailles",
    name: "Palace of Versailles",
    frenchName: "Château de Versailles",
    category: "palace",
    image: "/assets/paris-hero-3.jpg",
    arrondissement: "Versailles • Île-de-France (30 min from Paris)",
    description: "The opulent epicenter of the French monarchy transformed by Sun King Louis XIV into the grandest palace and formal garden complex in Europe.",
    highlights: [
      "The legendary 73-meter Hall of Mirrors (Galerie des Glaces)",
      "King and Queen's Grand State Apartments with gold leaf ceilings",
      "800 hectares of Royal Gardens, Grand Canal & Musical Fountains",
      "Marie Antoinette's picturesque rustic hamlet (Le Hameau de la Reine)"
    ],
    insiderTip: "Rent an electric golf cart or rowboat on the Grand Canal to explore the vast estate without fatigue.",
    hours: "09:00 - 18:30 (Closed Mondays)",
    price: "€32.00 (Passport)",
    vipPrice: "€95.00 (Royal Private Guided Tour)",
    rating: 4.9,
    reviews: 16750,
  }
];

export const ParisMonuments: React.FC<{ onBookMonument: (monumentName: string) => void }> = ({ onBookMonument }) => {
  const [filter, setFilter] = useState<string>("all");
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);

  const filtered = filter === "all"
    ? MONUMENTS_DATA
    : MONUMENTS_DATA.filter((m) => m.category === filter);

  return (
    <section id="monuments" className="relative py-28 bg-[#07070b] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[600px] h-[600px] bg-rose-500/[0.04] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-mono mb-4">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>ARCHITECTURAL WONDERS OF PARIS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide uppercase">
            Iconic Landmarks &amp; Monuments
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400">
            From the soaring iron lattice of the Eiffel Tower to the royal corridors of the Louvre, explore the eternal landmarks that define the spirit of France.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Monuments" },
              { id: "spire", label: "Iconic Spire" },
              { id: "museum", label: "Art & Museum" },
              { id: "historic", label: "Historic & Gothic" },
              { id: "palace", label: "Royal Palaces" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                  filter === tab.id
                    ? "bg-amber-400 text-black font-semibold shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-105"
                    : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/[0.08]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Glass Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((monument, idx) => (
            <motion.div
              key={monument.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/40 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.15)] flex flex-col justify-between"
            >
              {/* Image Banner */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={monument.image}
                  alt={monument.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-[#07070b]/20 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-mono text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{monument.rating}</span>
                  <span className="text-slate-400 text-[10px]">({monument.reviews.toLocaleString()})</span>
                </div>

                {/* Category Pill */}
                <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-[11px] font-mono text-amber-300 uppercase">
                  {monument.category}
                </div>

                {/* French Subtitle */}
                <div className="absolute bottom-3 left-5">
                  <span className="text-[11px] font-mono text-amber-300/80 tracking-widest uppercase block">
                    {monument.frenchName}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
                    {monument.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{monument.arrondissement}</span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {monument.description}
                  </p>

                  {/* Highlights Pill List */}
                  <div className="mt-4 space-y-1.5">
                    {monument.highlights.slice(0, 2).map((item, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Standard Entry</span>
                    <span className="text-base font-serif font-bold text-amber-300">{monument.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMonument(monument)}
                      className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 transition-all text-xs flex items-center gap-1"
                      title="View Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => onBookMonument(monument.name)}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all hover:scale-105"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Monument Detail Modal */}
      <AnimatePresence>
        {selectedMonument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#0e0e14] border border-amber-400/30 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMonument(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>{selectedMonument.frenchName}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {selectedMonument.name}
              </h3>

              <p className="text-xs font-mono text-rose-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {selectedMonument.arrondissement}
              </p>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                {selectedMonument.description}
              </p>

              {/* Hours & Insider Tip */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>VISITING HOURS</span>
                  </div>
                  <p className="text-xs text-white font-medium">{selectedMonument.hours}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>INSIDER RECOMMENDATION</span>
                  </div>
                  <p className="text-xs text-amber-100">{selectedMonument.insiderTip}</p>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mt-6">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Key Architectural &amp; Art Highlights
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedMonument.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Tier Footer & Book CTA */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">VIP Priority Pass</span>
                  <span className="text-xl font-serif font-bold text-amber-300">{selectedMonument.vipPrice}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMonument(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      const name = selectedMonument.name;
                      setSelectedMonument(null);
                      onBookMonument(name);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-all"
                  >
                    Reserve Tickets
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
