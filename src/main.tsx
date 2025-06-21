import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Loading from "./components/loading";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./features/auth/components/protected-route";
import PublicRoute from "./features/auth/components/public-route";

const queryClient = new QueryClient();

const HomePage = lazy(() => import("./pages/home-page"));

// Authtentication
const SignInPage = lazy(() => import("./pages/sign-in-page"));
const SignUpPage = lazy(() => import("./pages/sign-up-page"));

const DashboardPage = lazy(() => import("./pages/dashboard-page"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/sign-in"
              element={
                <PublicRoute>
                  <SignInPage />
                </PublicRoute>
              }
            />
            <Route
              path="/sign-up"
              element={
                <PublicRoute>
                  <SignUpPage />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
