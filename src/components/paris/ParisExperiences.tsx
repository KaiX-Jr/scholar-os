"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Wine, Ship, Car, Compass, Clock, Users, ArrowUpRight, Check, Heart } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  category: string;
  duration: string;
  groupSize: string;
  price: string;
  image: string;
  description: string;
  inclusions: string[];
  badge?: string;
}

const EXPERIENCES: Experience[] = [
  {
    id: "seine-yacht",
    title: "Private Sunset Yacht on the Seine",
    category: "River Romance & Champagne",
    duration: "2.5 Hours",
    groupSize: "Up to 6 Guests",
    price: "€340 / Charter",
    image: "/assets/paris-hero-1.jpg",
    description: "Glide silently past the illuminated facade of Notre-Dame and the Louvre aboard an Italian mahogany river yacht, accompanied by chilled Dom Pérignon and live jazz.",
    inclusions: [
      "Vintage Champagne & Caviar pairing",
      "Private Captain & Sommelier",
      "Prime front-row Eiffel Tower sparkle view",
      "High-fidelity sound system"
    ],
    badge: "Most Requested"
  },
  {
    id: "michelin-dining",
    title: "Michelin 3-Star Gastronomic Odyssey",
    category: "Haute Cuisine & Grand Cru",
    duration: "3.5 Hours",
    groupSize: "2 - 4 Guests",
    price: "€280 / Person",
    image: "/assets/paris-hero-2.jpg",
    description: "An extraordinary 8-course culinary symphony celebrating French terroir, crafted by master chefs and accompanied by rare Grand Cru vintage wine pairings.",
    inclusions: [
      "8-Course Chef's Seasonal Tasting Menu",
      "Rare vintage Grand Cru wine pairings",
      "Private kitchen salon tour & Chef meet",
      "Signed keepsake menu"
    ],
    badge: "Epicurean"
  },
  {
    id: "vintage-2cv",
    title: "Vintage Citroën 2CV Open-Top Tour",
    category: "Bohemian Nostalgia",
    duration: "2 Hours",
    groupSize: "1 - 3 Guests",
    price: "€160 / Tour",
    image: "/assets/paris-hero-3.jpg",
    description: "Feel the Parisian breeze in a charming 1970s open-top Citroën 2CV, navigating bohemian Montmartre alleys, hidden courtyards, and secret panoramic viewpoints.",
    inclusions: [
      "Charming local Parisian guide & driver",
      "Open-top roof for uninterrupted photography",
      "Boutique macaron & espresso pit stop",
      "Custom pickup from your hotel"
    ],
    badge: "Popular"
  },
  {
    id: "fashion-atelier",
    title: "Haute Couture & Private Perfume Atelier",
    category: "Artisan Luxury",
    duration: "3 Hours",
    groupSize: "Private Session",
    price: "€210 / Person",
    image: "/assets/paris-hero-1.jpg",
    description: "Exclusive access to private Parisian fashion ateliers on Rue Saint-Honoré followed by a master perfumer workshop to formulate your own bespoke signature fragrance.",
    inclusions: [
      "Private atelier tour & artisan talk",
      "50ml personalized bespoke perfume bottle",
      "Champagne reception in historic salon",
      "VIP styling consultation"
    ]
  },
  {
    id: "literary-salon",
    title: "Saint-Germain Literary & Wine Walk",
    category: "Intellectual Heritage",
    duration: "2.5 Hours",
    groupSize: "Up to 8 Guests",
    price: "€120 / Person",
    image: "/assets/paris-hero-2.jpg",
    description: "Retrace the steps of Hemingway, Fitzgerald, and Simone de Beauvoir through legendary cafés like Café de Flore and Les Deux Magots with wine tastings.",
    inclusions: [
      "Historic literary historian guide",
      "3 classic French wine & cheese pairings",
      "Visit to historic rare bookshops",
      "Printed literary anthology map"
    ]
  },
  {
    id: "chateau-helicopter",
    title: "Aerial Helicopter Flight over Versailles",
    category: "Aviation Panorama",
    duration: "45 Min Flight",
    groupSize: "Up to 5 Guests",
    price: "€420 / Person",
    image: "/assets/paris-hero-3.jpg",
    description: "Ascend high above the western skyline of Paris, sweeping over the immense geometric fountains of Versailles and the meandering loops of the Seine.",
    inclusions: [
      "Helipad VIP lounge & safety briefing",
      "Bose noise-canceling pilot headsets",
      "HD cockpit aerial video recording",
      "Champagne toast upon landing"
    ],
    badge: "Ultra Luxury"
  }
];

export const ParisExperiences: React.FC<{ onBookExperience: (expTitle: string) => void }> = ({ onBookExperience }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section id="experiences" className="relative py-28 bg-[#09090e]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>BESPOKE FRENCH EXPERIENCES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide uppercase">
              Curated Parisian Moments
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl">
              Elevate your stay with handpicked private yachts, Michelin-starred tasting menus, and rare artisan ateliers designed for unforgettable memories.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-2xl font-serif font-bold text-amber-300">100%</span>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Private Concierge</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
              <span className="text-2xl font-serif font-bold text-cyan-300">4.98★</span>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Guest Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Experience Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-400/40 backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-[0.88]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090e] via-[#09090e]/30 to-transparent" />

                {/* Badge if available */}
                {exp.badge && (
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-bold font-mono uppercase tracking-wider shadow-lg">
                    {exp.badge}
                  </div>
                )}

                {/* Favorite Bookmark Button */}
                <button
                  onClick={() => toggleFavorite(exp.id)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-white hover:scale-110 transition-transform"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favorites.includes(exp.id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-slate-300"
                    }`}
                  />
                </button>

                {/* Category Subtitle */}
                <div className="absolute bottom-3 left-5">
                  <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest block">
                    {exp.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                    {exp.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta Specs */}
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-3 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{exp.groupSize}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Key Inclusions */}
                  <div className="mt-4 space-y-1.5">
                    {exp.inclusions.slice(0, 3).map((inc, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Investment</span>
                    <span className="text-base font-serif font-bold text-cyan-300">{exp.price}</span>
                  </div>

                  <button
                    onClick={() => onBookExperience(exp.title)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-cyan-400 hover:text-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10 hover:border-cyan-400 transition-all duration-300 shadow-md"
                  >
                    <span>Reserve</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
