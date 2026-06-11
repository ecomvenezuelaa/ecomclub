import React, { useState } from "react";
import logo from "../../../assets/logo.png";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from "../../../lib/api";
import { supabaseClient } from "../../../lib/supabaseClient";

interface LoginProps {
  onGoToRegister: () => void;
}

export default function Login({ onGoToRegister }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || data.detail || `Error ${res.status}: problema en el servidor`);
        return;
      }
      login(data.user, data.token);
    } catch (err) {
      setError(`Error de conexión: ${err instanceof Error ? err.message : "Intenta de nuevo"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setError("Error al iniciar sesión con Google. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Left Side: Branding */}
        <div className="hidden md:flex md:col-span-7 bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden flex-col justify-between min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-12">
              <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
              <span className="font-bold text-2xl tracking-tight">Ecom Club</span>
            </div>
            <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight">La comunidad de<br />Ecommerce más<br />grande de Venezuela.</h1>
            <p className="text-slate-400 text-lg font-medium max-w-sm">
              Aprende de los mejores, escala tus tiendas online y conecta con los principales referentes del comercio electrónico en el país.
            </p>
          </div>

          <div className="relative z-10 flex -space-x-3 mt-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 shadow-sm overflow-hidden">
                <img src={`https://i.pravatar.cc/100?u=auth${i}`} alt="user" />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-4 border-slate-900 bg-indigo-600 text-[10px] flex items-center justify-center font-bold text-white shadow-sm">
              +2k
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-5 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-center">
          <div className="flex md:hidden items-center gap-3 mb-8">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-xl tracking-tight text-slate-900">Ecom Club</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-8">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 font-medium bg-red-50 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Entrar <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-sm text-slate-400 font-medium mb-4">O continúa con</p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {/* Google SVG icon */}
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611 20.083H42V20H24v8h11.303C33.982 32.443 29.418 35 24 35c-6.075 0-11-4.925-11-11s4.925-11 11-11c2.804 0 5.352 1.057 7.287 2.783l5.657-5.657C33.237 7.609 28.832 6 24 6 13.954 6 6 13.954 6 24s7.954 18 18 18c10.045 0 18-7.954 18-18 0-1.215-.127-2.399-.389-3.917z" fill="#FFC107"/>
                <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c2.804 0 5.352 1.057 7.287 2.783l5.657-5.657C33.237 7.609 28.832 6 24 6 16.318 6 9.656 10.337 6.306 14.691z" fill="#FF3D00"/>
                <path d="M24 44c4.716 0 9.002-1.593 12.305-4.205l-6.007-5.083C28.55 36.492 26.344 37 24 37c-5.395 0-9.947-3.534-11.289-8.317l-6.51 5.017C9.476 40.069 16.228 44 24 44z" fill="#4CAF50"/>
                <path d="M43.611 20.083H42V20H24v8h11.303a11.04 11.04 0 01-4.016 5.391l.003-.002 6.007 5.083C36.932 39.205 44 34 44 24c0-1.215-.127-2.399-.389-3.917z" fill="#1976D2"/>
              </svg>
              Continuar con Google
            </button>
            <p className="mt-8 text-sm font-medium text-slate-500">
              ¿No tienes cuenta?{" "}
              <button onClick={onGoToRegister} className="text-indigo-600 font-bold hover:underline">
                Regístrate gratis
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
