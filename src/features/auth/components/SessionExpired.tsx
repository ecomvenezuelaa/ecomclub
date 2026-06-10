import React from "react";
import { LogOut, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../../context/AuthContext";

export default function SessionExpired() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-brand-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm text-center"
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-amber-50 text-amber-500">
          <ShieldAlert size={32} />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black mb-4 bg-amber-50 text-amber-700 border border-amber-200">
          Sesión expirada
        </span>
        <h2 className="text-2xl font-black text-slate-900 mb-3">Tu sesión ha expirado</h2>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">
          Por seguridad, cerramos tu sesión tras un periodo de inactividad. Vuelve a iniciar sesión para continuar.
        </p>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98]"
        >
          <LogOut size={18} /> Iniciar sesión nuevamente
        </button>
      </motion.div>
    </div>
  );
}
