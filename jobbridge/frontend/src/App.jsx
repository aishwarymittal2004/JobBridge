import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/public/Landing";
import CandidateLogin from "./pages/public/CandidateLogin";
import CandidateSignup from "./pages/public/CandidateSignup";
import HRLogin from "./pages/public/HRLogin";
import HRSignup from "./pages/public/HRSignup";

import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateProfile from "./pages/candidate/Profile";
import CareerFeed from "./pages/candidate/CareerFeed";
import HRMessages from "./pages/candidate/HRMessages";

import HRDashboard from "./pages/hr/Dashboard";
import CandidateDetails from "./pages/hr/CandidateDetails";

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950 text-slate-900 dark:text-mist-100 transition-colors duration-300">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<CandidateLogin />} />
        <Route path="/signup" element={<CandidateSignup />} />
        <Route path="/hr/login" element={<HRLogin />} />
        <Route path="/hr/signup" element={<HRSignup />} />

        {/* Candidate */}
        <Route element={<ProtectedRoute role="candidate" />}>
          <Route path="/dashboard" element={<CandidateDashboard />} />
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/feed" element={<CareerFeed />} />
          <Route path="/messages" element={<HRMessages />} />
        </Route>

        {/* HR */}
        <Route element={<ProtectedRoute role="hr" />}>
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/candidates/:id" element={<CandidateDetails />} />
        </Route>

        <Route path="*" element={<Landing />} />
      </Routes>
    </div>
  );
}
