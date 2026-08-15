"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, DollarSign, ArrowRight, Sun, Moon, Utensils, Footprints, CheckCircle2 } from "lucide-react";

interface Activity {
  time: string;
  period: "morning" | "afternoon" | "evening" | "night";
  title: string;
  location: string;
  cost: number;
  duration: string;
  description: string;
  transportTip: string;
}

interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

const ITINERARIES: Record<string, { title: string; subtitle: string; days: DayPlan[] }> = {
  "3-day": {
    title: "3-Day Classic Romance & Icons",
    subtitle: "The quintessential Parisian journey for first-time and romantic travelers.",
    days: [
      {
        dayNumber: 1,
        theme: "Arrival, Royal Palaces & Eiffel Tower Sunset",
        activities: [
          {
            time: "09:30 AM",
            period: "morning",
            title: "Louvre Museum Masterpieces",
            location: "1st Arrondissement • Pyramide du Louvre",
            cost: 22,
            duration: "3 Hours",
            description: "Explore the Mona Lisa, Venus de Milo, and Napoleon III apartments with pre-booked early morning access.",
            transportTip: "Metro Line 1 to Palais-Royal - Musée du Louvre"
          },
          {
            time: "01:30 PM",
            period: "afternoon",
            title: "Lunch & Stroll in Jardin du Palais-Royal",
            location: "Jardin du Palais-Royal",
            cost: 45,
            duration: "2 Hours",
            description: "Dine on artisanal croque-monsieur and cafe au lait beneath the striped Buren columns and tranquil lime trees.",
            transportTip: "5 min walk from the Louvre"
          },
          {
            time: "06:00 PM",
            period: "evening",
            title: "Eiffel Tower Summit & Champagne Toast",
            location: "Champ de Mars • 7th Arrondissement",
            cost: 85,
            duration: "2.5 Hours",
            description: "Ascend to the 330m summit just before golden hour and witness the sparkling light show as the city turns to twilight.",
            transportTip: "RER C to Champ de Mars - Tour Eiffel"
          },
          {
            time: "09:30 PM",
            period: "night",
            title: "Private Seine River Night Cruise",
            location: "Port de la Bourdonnais",
            cost: 120,
            duration: "1.5 Hours",
            description: "Glide silently past illuminated bridges and Notre Dame with chilled champagne.",
            transportTip: "Direct boarding at base of Eiffel Tower"
          }
        ]
      },
      {
        dayNumber: 2,
        theme: "Bohemian Montmartre & Le Marais Boutiques",
        activities: [
          {
            time: "09:00 AM",
            period: "morning",
            title: "Sacré-Cœur Dome Climb & Place du Tertre",
            location: "18th Arrondissement • Montmartre",
            cost: 12,
            duration: "2.5 Hours",
            description: "Climb the panoramic dome for 360-degree views, followed by portrait sketching in the artists' square.",
            transportTip: "Metro Line 2 to Anvers + Montmartre Funicular"
          },
          {
            time: "01:00 PM",
            period: "afternoon",
            title: "Historic Marais Discovery & Falafel",
            location: "4th Arrondissement • Le Marais",
            cost: 35,
            duration: "3 Hours",
            description: "Explore 17th-century mansions, Place des Vosges, Victor Hugo's house, and world-famous L'As du Fallafel.",
            transportTip: "Metro Line 1 to Saint-Paul"
          },
          {
            time: "07:30 PM",
            period: "evening",
            title: "Michelin Gastronomic Dinner",
            location: "Saint-Germain-des-Prés",
            cost: 180,
            duration: "3 Hours",
            description: "Indulge in a 6-course modern French tasting menu celebrating seasonal truffles and Bordeaux grands crus.",
            transportTip: "Metro Line 4 to Saint-Germain-des-Prés"
          }
        ]
      },
      {
        dayNumber: 3,
        theme: "Gothic Heritage & Champs-Élysées Glamour",
        activities: [
          {
            time: "09:30 AM",
            period: "morning",
            title: "Notre-Dame & Sainte-Chapelle Stained Glass",
            location: "Île de la Cité • 4th Arrondissement",
            cost: 18,
            duration: "2.5 Hours",
            description: "Gaze at the breathtaking 1,113 stained glass panels of Sainte-Chapelle glowing in the morning sun.",
            transportTip: "Metro Line 4 to Cité"
          },
          {
            time: "02:00 PM",
            period: "afternoon",
            title: "Berthillon Artisan Gelato on Île Saint-Louis",
            location: "Île Saint-Louis",
            cost: 15,
            duration: "1.5 Hours",
            description: "Savor legendary wild strawberry and salted butter caramel gelato while relaxing by the riverbank.",
            transportTip: "Cross Pont Saint-Louis on foot"
          },
          {
            time: "06:30 PM",
            period: "evening",
            title: "Arc de Triomphe Sunset Rooftop",
            location: "Place Charles de Gaulle",
            cost: 16,
            duration: "2 Hours",
            description: "Watch the golden sun dip behind the Grande Arche of La Défense over the 12 radiating avenues.",
            transportTip: "Metro Line 1 to Charles de Gaulle - Étoile"
          }
        ]
      }
    ]
  },
  "5-day": {
    title: "5-Day Art, Culture & Royal Versailles",
    subtitle: "An enriched exploration featuring the Sun King's Palace and Impressionist masters.",
    days: [
      {
        dayNumber: 1,
        theme: "Louvre Masterpieces & Eiffel Tower",
        activities: [
          {
            time: "10:00 AM",
            period: "morning",
            title: "Louvre Museum VIP Guided Tour",
            location: "1st Arrondissement",
            cost: 68,
            duration: "3 Hours",
            description: "Guided private tour through Italian Renaissance galleries and French crown jewels.",
            transportTip: "Metro Line 1"
          },
          {
            time: "06:00 PM",
            period: "evening",
            title: "Eiffel Tower Champagne Sunset",
            location: "7th Arrondissement",
            cost: 85,
            duration: "2.5 Hours",
            description: "Panoramic golden hour vistas from the summit.",
            transportTip: "Taxi or Metro Line 9"
          }
        ]
      },
      {
        dayNumber: 2,
        theme: "Montmartre & Le Marais",
        activities: [
          {
            time: "09:30 AM",
            period: "morning",
            title: "Sacré-Cœur & Bohemian Artists Alley",
            location: "Montmartre",
            cost: 15,
            duration: "3 Hours",
            description: "Explore hidden vineyards, cabaret corners, and historic windmills.",
            transportTip: "Metro Line 2"
          }
        ]
      },
      {
        dayNumber: 3,
        theme: "Full Day Royal Versailles Sojourn",
        activities: [
          {
            time: "09:00 AM",
            period: "morning",
            title: "Hall of Mirrors & State Apartments",
            location: "Château de Versailles",
            cost: 32,
            duration: "4 Hours",
            description: "Marvel at the 357 mirrors reflecting the formal gardens and King Louis XIV's bedchamber.",
            transportTip: "RER C train from Paris directly to Versailles Château Rive Gauche"
          },
          {
            time: "02:00 PM",
            period: "afternoon",
            title: "Grand Canal Rowboats & Queen's Hamlet",
            location: "Versailles Gardens",
            cost: 25,
            duration: "3 Hours",
            description: "Rowboat along the royal canal and explore Marie Antoinette's fairytale rustic village.",
            transportTip: "Garden tram or electric golf cart"
          }
        ]
      },
      {
        dayNumber: 4,
        theme: "Musée d'Orsay Impressionists & Saint-Germain",
        activities: [
          {
            time: "10:00 AM",
            period: "morning",
            title: "Musée d'Orsay Masterworks",
            location: "7th Arrondissement • Quai d'Orsay",
            cost: 16,
            duration: "3 Hours",
            description: "Van Gogh's Starry Night, Monet's Water Lilies, and Renoir's Ball at Moulin de la Galette.",
            transportTip: "RER C to Musée d'Orsay"
          },
          {
            time: "04:00 PM",
            period: "afternoon",
            title: "Café de Flore Literary Afternoon",
            location: "Saint-Germain",
            cost: 30,
            duration: "2 Hours",
            description: "Sip decadent hot chocolate in the famous café where existential philosophy was born.",
            transportTip: "10 min walk through 6th Arrondissement"
          }
        ]
      },
      {
        dayNumber: 5,
        theme: "Haute Couture Shopping & Grand Opera",
        activities: [
          {
            time: "11:00 AM",
            period: "morning",
            title: "Galeries Lafayette Rooftop & Glass Dome",
            location: "9th Arrondissement • Boulevard Haussmann",
            cost: 0,
            duration: "2.5 Hours",
            description: "Admire the 1912 Art Nouveau glass stained dome and panoramic rooftop over the Opera.",
            transportTip: "Metro Line 7 to Chaussée d'Antin - La Fayette"
          },
          {
            time: "07:30 PM",
            period: "evening",
            title: "Palais Garnier Opera Performance",
            location: "Place de l'Opéra",
            cost: 140,
            duration: "3 Hours",
            description: "Experience world-class ballet in the gilded auditorium under Marc Chagall's ceiling.",
            transportTip: "Metro Line 3, 7, 8 to Opéra"
          }
        ]
      }
    ]
  }
};

const CURRENCY_RATES: Record<string, { symbol: string; rate: number }> = {
  EUR: { symbol: "€", rate: 1 },
  USD: { symbol: "$", rate: 1.08 },
  GBP: { symbol: "£", rate: 0.85 },
  INR: { symbol: "₹", rate: 90.5 }
};

export const ParisItineraryBuilder: React.FC = () => {
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>("3-day");
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [travelerTier, setTravelerTier] = useState<"standard" | "luxury" | "vip">("luxury");
  const [currency, setCurrency] = useState<string>("EUR");

  const plan = ITINERARIES[selectedPlanKey];
  const activeDay = plan.days[activeDayIndex] || plan.days[0];

  const rate = CURRENCY_RATES[currency].rate;
  const symbol = CURRENCY_RATES[currency].symbol;

  // Calculate day and total plan costs
  const dayActivityCost = activeDay.activities.reduce((acc, a) => acc + a.cost, 0);
  const tierDailyAccommodation = travelerTier === "vip" ? 650 : travelerTier === "luxury" ? 280 : 140;
  const totalDayEstimate = (dayActivityCost + tierDailyAccommodation) * rate;

  return (
    <section id="itinerary" className="relative py-28 bg-[#07070b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-mono mb-4">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>INTERACTIVE TRAVEL BLUEPRINT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide uppercase">
            Curated Itineraries &amp; Budget Planner
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Select a custom journey blueprint with hour-by-hour milestones, transit routes, and live expenditure forecasts tailored to your travel style.
          </p>

          {/* Plan Duration Selector */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
            <button
              onClick={() => {
                setSelectedPlanKey("3-day");
                setActiveDayIndex(0);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedPlanKey === "3-day"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3-Day Classic Romance
            </button>

            <button
              onClick={() => {
                setSelectedPlanKey("5-day");
                setActiveDayIndex(0);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedPlanKey === "5-day"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              5-Day Art &amp; Versailles
            </button>
          </div>
        </div>

        {/* Main Itinerary Interactive Workspace */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Day Selector Tabs & Budget HUD (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Day Selector Buttons */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider block mb-3">
                Select Day
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {plan.days.map((d, idx) => (
                  <button
                    key={d.dayNumber}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                      activeDayIndex === idx
                        ? "bg-purple-500/15 border-purple-400/50 shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-slate-400"
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-mono font-bold block ${
                        activeDayIndex === idx ? "text-purple-300" : "text-slate-400"
                      }`}>
                        DAY 0{d.dayNumber}
                      </span>
                      <p className="text-xs text-white font-medium line-clamp-1 mt-0.5">
                        {d.theme}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform ${
                      activeDayIndex === idx ? "text-purple-400 translate-x-1" : "text-slate-500"
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Budget & Currency Calculator */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-purple-500/[0.04] border border-purple-400/20 backdrop-blur-2xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-purple-300 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  BUDGET ESTIMATOR
                </span>

                {/* Currency Switcher */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
                  {Object.keys(CURRENCY_RATES).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => setCurrency(cur)}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        currency === cur
                          ? "bg-purple-500 text-white font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tier Toggle */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Travel Style</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", label: "Boutique" },
                    { id: "luxury", label: "Luxury 5★" },
                    { id: "vip", label: "VIP Palace" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTravelerTier(t.id as any)}
                      className={`py-2 rounded-xl text-[11px] font-mono font-medium transition-all ${
                        travelerTier === t.id
                          ? "bg-purple-500/25 border border-purple-400 text-purple-200"
                          : "bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Day Activities &amp; Passes</span>
                  <span className="text-white font-mono">{symbol}{Math.round(dayActivityCost * rate)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hotel &amp; Dining Baseline</span>
                  <span className="text-white font-mono">{symbol}{Math.round(tierDailyAccommodation * rate)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="font-bold text-white uppercase text-xs">Estimated Day Total</span>
                  <span className="text-xl font-serif font-bold text-purple-300 font-mono">
                    {symbol}{Math.round(totalDayEstimate).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Detailed Hour-by-Hour Timeline (8 cols) */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl">
              {/* Day Title & Header */}
              <div className="pb-6 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-purple-400 tracking-wider uppercase block">
                    DAY 0{activeDay.dayNumber} TIMELINE
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mt-1">
                    {activeDay.theme}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono border border-purple-500/30">
                  {activeDay.activities.length} Curated Stops
                </span>
              </div>

              {/* Timeline Cards */}
              <div className="mt-8 space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-indigo-500/40 before:to-transparent">
                {activeDay.activities.map((act, aIdx) => (
                  <motion.div
                    key={aIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: aIdx * 0.1 }}
                    className="relative pl-12 group"
                  >
                    {/* Timeline Pin Indicator */}
                    <div className="absolute left-3.5 top-5 -translate-x-1/2 w-4 h-4 rounded-full bg-[#07070b] border-2 border-purple-400 group-hover:scale-125 group-hover:border-amber-400 transition-all duration-300 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:bg-amber-400" />
                    </div>

                    {/* Activity Card */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-purple-400/40 transition-all duration-300">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                            {act.time}
                          </span>
                          <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {act.duration}
                          </span>
                        </div>

                        <span className="text-xs font-mono font-bold text-amber-300">
                          {act.cost === 0 ? "Free Entry" : `${symbol}${Math.round(act.cost * rate)}`}
                        </span>
                      </div>

                      <h4 className="text-lg font-serif font-bold text-white group-hover:text-purple-200 transition-colors">
                        {act.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-xs text-rose-400/90 font-mono mt-1 mb-2.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{act.location}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {act.description}
                      </p>

                      {/* Transit Tip */}
                      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <Footprints className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Transit: {act.transportTip}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
