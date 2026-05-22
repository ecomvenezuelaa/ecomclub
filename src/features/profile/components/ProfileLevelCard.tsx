import React from "react";
import { PROFILE_LEVEL } from "../data/profileMock";

export default function ProfileLevelCard() {
  const progress = Math.round((PROFILE_LEVEL.xpCurrent / PROFILE_LEVEL.xpTarget) * 100);

  return (
    <div className="rounded-3xl border-2 border-orange-200 bg-sky-50/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="inline-flex px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider">
          Nivel actual
        </span>
        <span className="text-4xl font-black text-[#7c2d12] leading-none tabular-nums">
          {PROFILE_LEVEL.level}
        </span>
      </div>

      <h3 className="text-lg font-black text-slate-900">{PROFILE_LEVEL.title}</h3>
      <p className="text-sm font-medium text-slate-600 mt-1">
        ¡Faltan solo {PROFILE_LEVEL.xpToNext} XP para subir al nivel {PROFILE_LEVEL.level + 1}!
      </p>

      <div className="mt-5 h-3 rounded-full bg-white/80 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs font-bold text-slate-500">
        <span>{PROFILE_LEVEL.xpCurrent.toLocaleString()} XP</span>
        <span>{PROFILE_LEVEL.xpTarget.toLocaleString()} XP</span>
      </div>
    </div>
  );
}
