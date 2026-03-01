/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/layout/Navbar";
import { BottomNav } from "./components/layout/BottomNav";
import { Home } from "./pages/Home";
import { AuthPage } from "./pages/AuthPage";
import { PracticeSessionPage } from "./pages/PracticeSessionPage";
import { QuizPage } from "./pages/QuizPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminPanel } from "./pages/AdminPanel";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { SubjectsPage } from "./pages/SubjectsPage";
import { SubjectDetailsPage } from "./pages/SubjectDetailsPage";
import { LearnTopicPage } from "./pages/LearnTopicPage";
import { MockTestsPage } from "./pages/MockTestsPage";
export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="prepiq-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground font-sans antialiased pb-16 md:pb-0">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/practice" element={<SubjectsPage />} />
              <Route path="/practice/:subjectId" element={<SubjectDetailsPage />} />
              <Route path="/practice/:subjectId/:topicId" element={<PracticeSessionPage />} />
              <Route path="/mock-tests" element={<MockTestsPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:subjectId" element={<SubjectDetailsPage />} />
              <Route path="/learn/:subjectId/:topicId" element={<LearnTopicPage />} />
            </Routes>
            <BottomNav />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
