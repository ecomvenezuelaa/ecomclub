import React, { useState, useMemo } from "react";
import { useCourses } from "../hooks/useCourses";
import CourseCard from "./CourseCard";
import CourseDetail from "./CourseDetail";
import Spinner from "../../../shared/ui/Spinner";
import { Course } from "../../../types";

const YOUTUBE_COURSE: Course = {
  id: "youtube-demo",
  title: "Emprendimiento 101",
  category: "Negocios",
  module: "Clase 1: Introducción",
  progress: 0,
  description: "Aprende los fundamentos del emprendimiento en esta clase especial en video.",
  thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop",
};

export default function Classroom() {
  const { courses: apiCourses, isLoading } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const allCourses = useMemo(() => [YOUTUBE_COURSE, ...apiCourses], [apiCourses]);

  if (isLoading) return <Spinner />;

  if (selectedCourse) {
    return <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  return (
    <div className="max-w-lg mx-auto lg:max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Aula virtual</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Tus cursos y lecciones disponibles</p>
      </header>

      {allCourses.length === 0 ? (
        <div className="rounded-3xl border-2 border-orange-200 bg-sky-50/80 p-8 text-center">
          <p className="font-bold text-slate-700">No hay cursos disponibles</p>
          <p className="text-sm text-slate-500 mt-1">Vuelve pronto para ver nuevo contenido.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allCourses.map((course, idx) => (
            <CourseCard
              key={course.id}
              course={course}
              index={idx}
              onClick={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
