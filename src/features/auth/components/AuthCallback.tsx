import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../../lib/supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from "../../../lib/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

      if (sessionError || !sessionData.session) {
        if (!cancelled) setError("No se pudo obtener la sesión de Google. Intenta de nuevo.");
        return;
      }

      const token = sessionData.session.access_token;
      const supabaseUser = sessionData.session.user;

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            login(data.user, token);
            navigate("/muro", { replace: true });
          }
        } else {
          // Fallback: build user from Supabase metadata
          const name = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "Usuario";
          const avatar = supabaseUser.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${supabaseUser.id}`;
          if (!cancelled) {
            login(
              { id: supabaseUser.id, name, email: supabaseUser.email || "", role: "miembro", avatar },
              token
            );
            navigate("/muro", { replace: true });
          }
        }
      } catch (err) {
        if (!cancelled) setError("Error de conexión. Intenta de nuevo.");
      }
    }

    handleCallback();
    return () => { cancelled = true; };
  }, [login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <button
          onClick={() => navigate("/login", { replace: true })}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Iniciando sesión con Google…</p>
    </div>
  );
}
