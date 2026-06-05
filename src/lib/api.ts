import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export async function parseApiResponse<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();

  if (!text) {
    if (!res.ok) throw new Error(`Error del servidor (${res.status})`);
    return {} as T;
  }

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(
      res.ok
        ? "Respuesta inválida del servidor"
        : `Error del servidor (${res.status}): ${text.slice(0, 120)}`
    );
  }

  return data;
}

export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit,
  token?: string
): Promise<{ data: T; res: Response }> {
  const url =
    typeof input === "string" && input.startsWith("/")
      ? `${API_BASE}${input}`
      : input;

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  const data = await parseApiResponse<T>(res);

  if (!res.ok) {
    const d = typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
    const message = d.error ? String(d.error) : d.detail ? String(d.detail) : `Error (${res.status})`;
    throw new Error(message);
  }

  return { data, res };
}

/**
 * Hook que devuelve una versión de apiFetch con el token del usuario
 * autenticado inyectado automáticamente en cada llamada.
 *
 * Uso:
 *   const api = useApiFetch();
 *   const { data } = await api<Post[]>("/api/posts");
 */
export function useApiFetch() {
  const { token } = useAuth();
  return useCallback(
    <T = unknown>(input: RequestInfo | URL, init?: RequestInit) =>
      apiFetch<T>(input, init, token ?? undefined),
    [token]
  );
}
