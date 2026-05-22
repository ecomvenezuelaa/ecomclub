import React from "react";
import { GraduationCap, Heart } from "lucide-react";
import { PROFILE_ACTIVITY } from "../data/profileMock";

const iconMap = {
  graduation: GraduationCap,
  heart: Heart,
};

function renderActivityText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold text-slate-900">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function ProfileActivity() {
  return (
    <section>
      <h3 className="text-lg font-black text-slate-900 mb-4">Actividad reciente</h3>

      <div className="space-y-3">
        {PROFILE_ACTIVITY.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm"
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.iconBg}`}
              >
                <Icon size={20} className={item.iconColor} strokeWidth={2.25} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  {renderActivityText(item.text)}
                </p>
                <p className="text-xs font-bold text-slate-400 mt-2">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
