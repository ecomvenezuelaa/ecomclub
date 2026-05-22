import React, { useState } from "react";
import { ArrowLeft, PlayCircle, CheckCircle } from "lucide-react";
import { Course } from "../../../types";
import { motion } from "motion/react";

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
}

export default function CourseDetail({ course, onBack }: CourseDetailProps) {
  const [activeModule, setActiveModule] = useState(0);

  const modules = [
    {
      title: "Clase 1: Introducción",
      duration: "10:00",
      videoUrl: "https://www.youtube.com/embed/kW91PzomLWw?start=10",
      completed: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto lg:max-w-4xl space-y-5 px-4 md:px-0 pb-4"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold transition-colors text-sm"
      >
        <ArrowLeft size={18} /> Volver a cursos
      </button>

      <div className="rounded-3xl overflow-hidden aspect-video shadow-lg border-2 border-orange-100 bg-slate-900 relative">
        <iframe
          src={modules[activeModule].videoUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>

      <div className="rounded-3xl border-2 border-orange-200 bg-sky-50/80 p-5 shadow-sm">
        <span className="inline-flex px-3 py-1 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider">
          {course.category}
        </span>
        <h1 className="text-xl font-black text-slate-900 mt-3 leading-tight">{course.title}</h1>
        <p className="text-sm font-medium text-slate-600 mt-2 leading-relaxed">{course.description}</p>

        <div className="mt-4 h-2.5 rounded-full bg-white/80 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <p className="text-xs font-bold text-slate-500 mt-2">{course.progress}% completado</p>
      </div>

      <section className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 mb-4">Módulos del curso</h3>

        <div className="space-y-2">
          {modules.map((mod, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveModule(idx)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                activeModule === idx
                  ? "border-orange-500 bg-orange-50 shadow-sm"
                  : "border-slate-100 hover:border-orange-200 bg-white"
              }`}
            >
              <div className={`mt-0.5 ${mod.completed ? "text-emerald-500" : "text-slate-400"}`}>
                {mod.completed ? <CheckCircle size={20} /> : <PlayCircle size={20} />}
              </div>
              <div className="min-w-0 flex-1">
                <h4
                  className={`font-bold text-sm ${activeModule === idx ? "text-orange-900" : "text-slate-700"}`}
                >
                  {mod.title}
                </h4>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{mod.duration}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
