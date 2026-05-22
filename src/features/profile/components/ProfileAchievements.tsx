import React from "react";
import { Rocket, Shield, Sparkles, Star } from "lucide-react";
import { PROFILE_ACHIEVEMENTS } from "../data/profileMock";

const iconMap = {
  rocket: Rocket,
  sparkles: Sparkles,
  star: Star,
  shield: Shield,
};

export default function ProfileAchievements() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-slate-900">Mis logros</h3>
        <button
          type="button"
          className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors"
        >
          Ver todos
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {PROFILE_ACHIEVEMENTS.map((badge) => {
          const Icon = iconMap[badge.icon];
          return (
            <div key={badge.id} className="flex flex-col items-center gap-2">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ring-2 ${badge.ring} ${badge.bg} ${!badge.earned ? "opacity-50 grayscale" : ""}`}
              >
                <Icon size={22} className={badge.color} strokeWidth={2} />
              </div>
              <span
                className={`text-[10px] font-bold text-center leading-tight ${badge.earned ? "text-slate-700" : "text-slate-400"}`}
              >
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
