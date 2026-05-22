export const PROFILE_LEVEL = {
  level: 12,
  title: "Maestro del Caos",
  subtitle: "Explorador de Ideas",
  xpCurrent: 1260,
  xpTarget: 1500,
  xpToNext: 240,
};

export const PROFILE_STATS = [
  { label: "Días de Racha", value: "15", icon: "flame" as const, bg: "bg-violet-100", iconColor: "text-violet-600" },
  { label: "Impacto Social", value: "1.2k", icon: "users" as const, bg: "bg-amber-100", iconColor: "text-amber-600" },
  { label: "Lecciones", value: "48", icon: "book" as const, bg: "bg-orange-100", iconColor: "text-orange-600" },
  { label: "Insignias", value: "8", icon: "trophy" as const, bg: "bg-sky-100", iconColor: "text-sky-600" },
];

export const PROFILE_ACHIEVEMENTS = [
  { id: "pionero", label: "Pionero", icon: "rocket" as const, earned: true, ring: "ring-orange-200", bg: "bg-orange-50", color: "text-orange-500" },
  { id: "creativo", label: "Creativo", icon: "sparkles" as const, earned: true, ring: "ring-violet-200", bg: "bg-violet-50", color: "text-violet-500" },
  { id: "lider", label: "Líder", icon: "star" as const, earned: true, ring: "ring-amber-200", bg: "bg-amber-50", color: "text-amber-500" },
  { id: "guardian", label: "Guardián", icon: "shield" as const, earned: false, ring: "ring-slate-200", bg: "bg-slate-50", color: "text-slate-300" },
];

export const PROFILE_RANKING = [
  { rank: 1, name: "Sofia M.", xp: "1,450 XP", avatar: "https://i.pravatar.cc/150?u=sofia", isYou: false },
  { rank: 2, name: "Alex C.", xp: "1,260 XP", avatar: "https://i.pravatar.cc/150?u=alex", isYou: true },
  { rank: 3, name: "Carlos R.", xp: "1,100 XP", avatar: "https://i.pravatar.cc/150?u=carlos", isYou: false },
];

export const PROFILE_ACTIVITY = [
  {
    id: "1",
    text: "Completaste la lección **'Diseño de Sistemas'**",
    time: "Hace 2 horas",
    icon: "graduation" as const,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: "2",
    text: "Reaccionaste con ❤️ al comentario de **María**",
    time: "Hace 5 horas",
    icon: "heart" as const,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-500",
  },
];
