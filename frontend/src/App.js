import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { VerifyEmail } from "@/pages/Auth/VerifyEmail";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { Login, Register } from "@/pages/Auth";
import { Study } from "@/pages/Study";
import { Roots } from "@/pages/Roots";
import { Prefixes } from "@/pages/Prefixes";
import { Games } from "@/pages/Games";
import { Flashcards } from "@/pages/Flashcards";
import { MatchGame } from "@/pages/MatchGame";
import { Quiz } from "@/pages/Quiz";
import { ProgressPage } from "@/pages/Progress";
import { Profile } from "@/pages/Profile";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { checking, isAuthenticated } = useAuth();

  if (checking) return <div style={{ padding: 16 }}>Yükleniyor…</div>;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <div className="App min-h-screen bg-background">
      <Navbar />

      <Suspense fallback={<div style={{ padding: 16 }}>Yükleniyor…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/study" element={<Study />} />
          <Route path="/study/roots" element={<Roots />} />
          <Route path="/study/prefixes" element={<Prefixes />} />

          <Route path="/games" element={<Games />} />

          <Route
            path="/flashcards"
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match"
            element={
              <ProtectedRoute>
                <MatchGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
