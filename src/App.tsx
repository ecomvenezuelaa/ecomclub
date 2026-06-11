import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "./context/AuthContext";
import Layout from "./shared/layout/Layout";
import AccountStatus from "./features/auth/components/AccountStatus";
import SessionExpired from "./features/auth/components/SessionExpired";
import { needsActiveSubscription, hasActiveSubscription } from "./lib/permissions";
import { authRoutes, appRoutes, AppRoute } from "./routes";

function AnimatedRoutes({ routes, fallback }: { routes: AppRoute[]; fallback: string }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<Navigate to={fallback} replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { user, isAuthenticated, logout, sessionExpired } = useAuth();
  const location = useLocation();

  // Always allow the OAuth callback to complete, even if session isn't set yet
  if (location.pathname === "/auth/callback") {
    const AuthCallback = React.lazy(() => import("./features/auth/components/AuthCallback"));
    return <React.Suspense fallback={null}><AuthCallback /></React.Suspense>;
  }

  if (sessionExpired) {
    return <SessionExpired />;
  }

  if (!isAuthenticated) {
    return <AnimatedRoutes routes={authRoutes} fallback="/" />;
  }

  if (needsActiveSubscription(user?.role) && !hasActiveSubscription(user?.subscription_status)) {
    return <AccountStatus />;
  }

  return (
    <Layout onLogout={logout}>
      <AnimatedRoutes routes={appRoutes} fallback="/muro" />
    </Layout>
  );
}

export default function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <AppContent key={user?.id} />
    </BrowserRouter>
  );
}
