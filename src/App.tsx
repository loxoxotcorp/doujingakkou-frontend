import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "./hooks/use-auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import CompaniesPage from "./pages/CompaniesPage";
import VacanciesPage from "./pages/VacanciesPage";
import CandidatesPage from "./pages/CandidatesPage";
import CandidateDatabasePage from "./pages/CandidateDatabasePage";
import AuditTrailPage from "./pages/AuditTrailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<div className="p-4 text-center">Загрузка...</div>}>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Index />} />

              {/* Protected */}
              <Route path="/companies" element={<ProtectedRoute><CompaniesPage /></ProtectedRoute>} />
              <Route path="/vacancies" element={<ProtectedRoute><VacanciesPage /></ProtectedRoute>} />
              <Route path="/candidates" element={<ProtectedRoute><CandidatesPage /></ProtectedRoute>} />
              <Route path="/candidates/database" element={<ProtectedRoute><CandidateDatabasePage /></ProtectedRoute>} />
              <Route path="/audit" element={<ProtectedRoute><AuditTrailPage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
