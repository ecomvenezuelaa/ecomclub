import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Rocket, 
  Sparkles, 
  Star, 
  BookOpen, 
  Award, 
  Shield, 
  Users, 
  MessageSquare,
  Lock,
  Trophy,
  Calendar,
  Sparkle
} from "lucide-react";
import { PROFILE_ACHIEVEMENTS } from "../data/profileMock";

const iconMap = {
  rocket: Rocket,
  sparkles: Sparkles,
  star: Star,
  bookOpen: BookOpen,
  award: Award,
  shield: Shield,
  users: Users,
  messageSquare: MessageSquare,
};

const tierStyles = {
  bronze: {
    ring: "ring-amber-700/40",
    bg: "bg-amber-950/10",
    text: "text-amber-700",
    label: "Bronce",
    badgeBg: "bg-amber-700/10 text-amber-700 border-amber-700/20"
  },
  silver: {
    ring: "ring-slate-400/40",
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    label: "Plata",
    badgeBg: "bg-slate-500/10 text-slate-400 border-slate-500/20"
  },
  gold: {
    ring: "ring-amber-500/40",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    label: "Oro",
    badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  diamond: {
    ring: "ring-cyan-400/40",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    label: "Diamante",
    badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  }
};

const categoryLabels = {
  all: "Todas",
  academic: "Academia",
  social: "Muro",
  special: "Especiales"
};

export default function ProfileAchievements() {
  const [activeTab, setActiveTab] = useState<"all" | "academic" | "social" | "special">("all");
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>("pionero");

  const filteredBadges = PROFILE_ACHIEVEMENTS.filter((badge) => {
    if (activeTab === "all") return true;
    return badge.category === activeTab;
  });

  const selectedBadge = PROFILE_ACHIEVEMENTS.find(b => b.id === selectedBadgeId);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Trophy size={20} className="text-amber-500" />
          Mis Logros & Insignias
        </h3>
        <span className="text-xs font-bold text-slate-500">
          {PROFILE_ACHIEVEMENTS.filter(b => b.earned).length} / {PROFILE_ACHIEVEMENTS.length} Desbloqueados
        </span>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-1.5 p-1 bg-slate-50 rounded-2xl mb-6 overflow-x-auto">
        {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab);
              // Si la insignia actualmente seleccionada no está en el filtro, seleccionamos la primera del filtro
              const inFilter = PROFILE_ACHIEVEMENTS.filter(b => tab === "all" || b.category === tab);
              if (inFilter.length > 0 && !inFilter.some(b => b.id === selectedBadgeId)) {
                setSelectedBadgeId(inFilter[0].id);
              }
            }}
            className={`relative flex-1 py-2 px-3 text-xs font-extrabold rounded-xl text-center whitespace-nowrap transition-colors z-10 ${
              activeTab === tab ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white shadow-sm border border-slate-100 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {categoryLabels[tab]}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge) => {
            const Icon = iconMap[badge.icon as keyof typeof iconMap] || Trophy;
            const tierStyle = tierStyles[badge.tier as keyof typeof tierStyles] || tierStyles.bronze;
            const isSelected = selectedBadgeId === badge.id;

            return (
              <motion.div
                layout
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBadgeId(badge.id)}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isSelected 
                      ? "border-indigo-500 bg-indigo-50 shadow-md ring-4 ring-indigo-500/20" 
                      : badge.earned 
                        ? "border-transparent bg-slate-50 hover:bg-slate-100" 
                        : "border-transparent bg-slate-100/50"
                  }`}
                >
                  {/* Badge Ring / Tier Icon Wrapper */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ring-2 ${
                      badge.earned 
                        ? `${tierStyle.ring} ${badge.bg}` 
                        : "ring-slate-200 bg-slate-100 opacity-60"
                    }`}
                  >
                    <Icon size={20} className={badge.earned ? badge.color : "text-slate-400"} strokeWidth={2.25} />
                  </div>

                  {/* Lock Overlay */}
                  {!badge.earned && (
                    <div className="absolute -bottom-1 -right-0.5 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center border-2 border-white shadow-sm">
                      <Lock size={10} />
                    </div>
                  )}

                  {/* Unlocked Sparkle Indicator */}
                  {badge.earned && isSelected && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }} 
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-1 -right-1 text-amber-400 bg-white rounded-full p-0.5 shadow-sm border border-slate-100"
                    >
                      <Sparkle size={10} className="fill-amber-400" />
                    </motion.div>
                  )}
                </div>
                
                <span
                  className={`text-[10px] font-black text-center leading-tight tracking-tight transition-colors ${
                    isSelected 
                      ? "text-indigo-600 font-black" 
                      : badge.earned 
                        ? "text-slate-700 font-bold" 
                        : "text-slate-400 font-medium"
                  }`}
                >
                  {badge.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected Badge Detail Panel */}
      <AnimatePresence mode="wait">
        {selectedBadge && (
          <motion.div
            key={selectedBadge.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            {/* Left/Top: Large Icon representation */}
            <div className={`p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm relative mx-auto sm:mx-0`}>
              {(() => {
                const Icon = iconMap[selectedBadge.icon as keyof typeof iconMap] || Trophy;
                const tierStyle = tierStyles[selectedBadge.tier as keyof typeof tierStyles] || tierStyles.bronze;
                return (
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ring-4 ${selectedBadge.earned ? `${tierStyle.ring} ${selectedBadge.bg}` : "ring-slate-200 bg-slate-100/50 grayscale"}`}>
                    <Icon size={28} className={selectedBadge.earned ? selectedBadge.color : "text-slate-400"} strokeWidth={2.25} />
                  </div>
                );
              })()}
              
              {!selectedBadge.earned && (
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-800 text-white border-2 border-white shadow-sm">
                  <Lock size={12} />
                </div>
              )}
            </div>

            {/* Right/Bottom: Badge Details */}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
                <h4 className="text-sm font-black text-slate-800">{selectedBadge.label}</h4>
                <div className="flex gap-1.5 justify-center sm:justify-start">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                    tierStyles[selectedBadge.tier as keyof typeof tierStyles]?.badgeBg
                  }`}>
                    {tierStyles[selectedBadge.tier as keyof typeof tierStyles]?.label}
                  </span>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-500 uppercase tracking-wider">
                    {categoryLabels[selectedBadge.category as keyof typeof categoryLabels]}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                {selectedBadge.description}
              </p>

              {/* Status footer */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-bold text-slate-500">
                {selectedBadge.earned ? (
                  <>
                    <Calendar size={12} className="text-indigo-500" />
                    <span>Desbloqueado el {selectedBadge.unlockedAt}</span>
                  </>
                ) : (
                  <>
                    <Lock size={12} className="text-slate-400" />
                    <span className="text-slate-400 uppercase tracking-wider">Bloqueado — Completa el logro para ganar +100 XP</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
