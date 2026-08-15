"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Sparkles, Check, Compass, Ticket, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface ParisBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
}

const PACKAGES = [
  { id: "eiffel-vip", name: "Eiffel Tower Summit Champagne VIP", basePrice: 85 },
  { id: "louvre-guided", name: "Louvre Museum Masterpiece Private Tour", basePrice: 68 },
  { id: "seine-yacht", name: "Private Sunset Mahogany Yacht on the Seine", basePrice: 340 },
  { id: "michelin-3star", name: "Michelin 3-Star Gastronomic Dining Experience", basePrice: 280 },
  { id: "vintage-2cv", name: "Vintage Citroën 2CV Open-Top City Tour", basePrice: 160 },
  { id: "versailles-heli", name: "Versailles Royal Estate Helicopter Flight", basePrice: 420 },
];

export const ParisBookingModal: React.FC<ParisBookingModalProps> = ({
  isOpen,
  onClose,
  defaultPackage,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<string>(
    defaultPackage || PACKAGES[0].name
  );
  const [date, setDate] = useState<string>("2026-09-15");
  const [guests, setGuests] = useState<number>(2);
  const [addons, setAddons] = useState<string[]>([
    "Private Chauffeur Airport Transfer",
  ]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const matchedPkg =
    PACKAGES.find((p) => p.name.toLowerCase().includes(selectedPkg.toLowerCase()) || selectedPkg.toLowerCase().includes(p.name.toLowerCase())) ||
    PACKAGES[0];

  const addonPrices: Record<string, number> = {
    "Private Chauffeur Airport Transfer": 120,
    "Dedicated English/French Art Historian": 90,
    "Professional Parisian Portrait Photographer": 150,
    "Grand Cru Sommelier Champagne Welcome": 80,
  };

  const addonsTotal = addons.reduce((sum, a) => sum + (addonPrices[a] || 0), 0);
  const totalCost = matchedPkg.basePrice * guests + addonsTotal;

  const toggleAddon = (addon: string) => {
    setAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#ffffff"],
      });
    } catch (err) {}
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl rounded-3xl bg-[#0c0c12] border border-amber-400/30 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIP CONCIERGE RESERVATION</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase tracking-wide">
              Reserve Your Paris Journey
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              Guaranteed skip-the-line VIP passes, certified private art historians, and bespoke itineraries.
            </p>

            <form onSubmit={handleBookingSubmit} className="mt-6 space-y-5">
              {/* Package Selector */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                  Select Experience or Monument
                </label>
                <select
                  value={selectedPkg}
                  onChange={(e) => setSelectedPkg(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400/50"
                >
                  {PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.name} className="bg-[#0c0c12] text-white">
                      {pkg.name} (€{pkg.basePrice} base)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Guests Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                          guests === num
                            ? "bg-amber-400 text-black shadow-md"
                            : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/5"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* VIP Add-on options */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                  Complimentary &amp; VIP Upgrades
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(addonPrices).map(([addonName, addonCost]) => {
                    const isChecked = addons.includes(addonName);
                    return (
                      <div
                        key={addonName}
                        onClick={() => toggleAddon(addonName)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isChecked
                            ? "bg-amber-500/10 border-amber-400/40 text-white"
                            : "bg-white/[0.02] border-white/5 text-slate-400 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isChecked ? "bg-amber-400 border-amber-400 text-black" : "border-white/20"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="line-clamp-1">{addonName}</span>
                        </div>
                        <span className="font-mono text-amber-300 text-[11px] font-bold">
                          +€{addonCost}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                    Primary Traveler Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                    Email for VIP Confirmation
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. eleanor@luxury.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Total Estimated Investment ({guests} Guests)
                  </span>
                  <span className="text-2xl font-serif font-bold text-amber-300 font-mono">
                    €{totalCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-black text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 transition-all"
                  >
                    Confirm VIP Pass
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
              RESERVATION CONFIRMED
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Félicitations, {name || "Esteemed Traveler"}!
            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your VIP reservation for <strong className="text-amber-300">{selectedPkg}</strong> on {date} has been confirmed. Your digital pass and itinerary documentation have been dispatched to <strong className="text-white">{email}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-sm mx-auto text-xs font-mono space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Confirmation ID:</span>
                <span className="text-amber-300 font-bold">PARIS-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <span className="text-white">{guests} Persons</span>
              </div>
              <div className="flex justify-between">
                <span>VIP Upgrades:</span>
                <span className="text-white">{addons.length} Selected</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-lg"
            >
              Done &amp; Return to Dashboard
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
