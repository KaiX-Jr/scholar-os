"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, Sparkles, Camera, MapPin, ZoomIn } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  location: string;
  image: string;
  aspect: "tall" | "wide" | "square";
  caption: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Golden Hour on the Seine",
    location: "Pont Alexandre III",
    image: "/assets/paris-hero-1.jpg",
    aspect: "tall",
    caption: "The gilded bronze sculptures of Pont Alexandre III bathed in radiant amber sunset light."
  },
  {
    id: "g2",
    title: "Pyramide du Louvre at Twilight",
    location: "Cour Napoléon • 1st Arr.",
    image: "/assets/paris-hero-2.jpg",
    aspect: "wide",
    caption: "I.M. Pei's geometric glass structure glowing against the cobalt Parisian dusk sky."
  },
  {
    id: "g3",
    title: "Haussmannian Rooftops & Zinc Terraces",
    location: "Boulevard Saint-Germain",
    image: "/assets/paris-hero-3.jpg",
    aspect: "square",
    caption: "Classic 19th-century slate and zinc roofs overlooking the boulevard tree canopies."
  },
  {
    id: "g4",
    title: "The Iron Lady's Midnight Sparkle",
    location: "Champ de Mars",
    image: "/assets/paris-hero-1.jpg",
    aspect: "square",
    caption: "20,000 sparkling strobe flashes illuminating the Parisian sky at the top of the hour."
  },
  {
    id: "g5",
    title: "Montmartre Bohemian Alleyways",
    location: "Place du Tertre • 18th Arr.",
    image: "/assets/paris-hero-2.jpg",
    aspect: "tall",
    caption: "Cozy cobblestone passages lined with street easels, bistros, and ivy-draped facades."
  },
  {
    id: "g6",
    title: "Versailles Grand Fountains",
    location: "Royal Gardens • Versailles",
    image: "/assets/paris-hero-3.jpg",
    aspect: "wide",
    caption: "Grand sculpted fountains dancing to classical baroque music in Louis XIV's gardens."
  }
];

export const ParisGallery: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="relative py-28 bg-[#07070b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs font-mono mb-4">
            <Camera className="w-3.5 h-3.5 text-rose-400" />
            <span>VISUAL STORYTELLING</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-wide uppercase">
            Atmospheric Paris Gallery
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-400">
            A visual anthology capturing the cinematic spirit, gilded light, and timeless architecture of Paris.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => setActivePhoto(item)}
              className="group relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.08] cursor-pointer h-72 sm:h-80 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(244,63,94,0.2)] transition-all duration-500 hover:border-rose-400/40"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.88] group-hover:brightness-100"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Zoom Button on hover */}
              <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4" />
              </div>

              {/* Content bottom */}
              <div className="absolute bottom-5 inset-x-5">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-300 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>

                <h4 className="text-lg font-serif font-bold text-white tracking-wide">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-300 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full rounded-3xl bg-[#0c0c12] border border-white/15 overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-96 sm:h-[500px] w-full">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 bg-[#0c0c12] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-rose-400 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activePhoto.location}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">
                    {activePhoto.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">{activePhoto.caption}</p>
                </div>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="px-6 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white text-xs font-semibold"
                >
                  Close Photo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
