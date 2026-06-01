import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "./context/AuthContext";
import Layout from "./shared/layout/Layout";
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
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <AnimatedRoutes routes={authRoutes} fallback="/" />;
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
