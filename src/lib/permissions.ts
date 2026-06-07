export type Role = "admin" | "miembro" | "invitado";

export function isAdmin(role: string | undefined): boolean {
  return role === "admin";
}

export function requireAdmin(role: string | undefined, action = "realizar esta acción"): boolean {
  if (isAdmin(role)) return true;
  alert(`Solo los administradores pueden ${action}.`);
  return false;
}

/**
 * Los usuarios con role='invitado' están exentos de la validación de suscripción.
 * Cualquier otro rol necesita subscription_status='active' para usar la app.
 */
export function needsActiveSubscription(role: string | undefined): boolean {
  return role !== "invitado" && role !== "admin";
}

export function hasActiveSubscription(subscriptionStatus: string | null | undefined): boolean {
  return subscriptionStatus === "active";
}
