import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  PlayCircle, Lock, Unlock, Star, Timer, FileQuestion, 
  Calculator, Brain, BookA, Globe, Newspaper, Microscope, MonitorPlay, ArrowLeft
} from "lucide-react";
import { cn } from "../lib/utils";

// ==========================================
// 1. DATA SETUP: Subjects & Mocks Lists
// ==========================================

// 50 Full Mocks (1-4 Free, 5-50 Paid)
const fullMocksList = Array.from({ length: 50 }, (_, i) => ({
  id: `full-mock-${i + 1}`,
  title: `SSC CGL Full Mock Test ${i + 1}`,
  questions: 100,
  duration: 60,
  isFree: i < 4 
}));

// Subjects for Subject-wise Mocks
const subjects = [
  { id: "maths", name: "Mathematics", icon: Calculator, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "reasoning", name: "Reasoning", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "english", name: "English", icon: BookA, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "gk", name: "General Knowledge", icon: Globe, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "current-affairs", name: "Current Affairs", icon: Newspaper, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "science-tech", name: "Science & Tech", icon: Microscope, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { id: "computer", name: "Computer", icon: MonitorPlay, color: "text-sky-500", bg: "bg-sky-500/10" },
];

// 20 Subject Mocks Generator (1-5 Free, 6-20 Paid)
const generateSubjectMocks = (subId: string) => {
  const subName = subjects.find(s => s.id === subId)?.name || "Subject";
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${subId}-mock-${i + 1}`,
    title: `${subName} Mock Test ${i + 1}`,
    questions: 25,
    duration: 30,
    isFree: i < 5 
  }));
};

// ==========================================
// 2. MAIN PAGE COMPONENT
// ==========================================

export function MockTestsPage() {
  const [activeTab, setActiveTab] = useState<"full" | "subject">("full");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // PREMIUM CHECK LOGIC
  // Check if user has an active premium plan that hasn't expired
  const isPremium = user?.isPremium && user?.planExpiry && new Date(user.planExpiry) > new Date();

  // Reusable Mock Card Component (Light & Dark Theme Optimized)
  const MockCard = ({ mock, type }: { mock: any, type: "full" | "subject" }) => {
    // Lock logic: Agar test free nahi hai, aur user premium bhi nahi hai, tabhi lock hoga!
    const isLocked = !mock.isFree && !isPremium;

    return (
      <div className={cn(
        "p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 transition-all duration-300",
        // PERFECT LIGHT/DARK THEME CONTRAST
        isLocked 
          ? "bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 opacity-80 grayscale-[10%]" 
          : "bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
      )}>
        <div className="w-full sm:w-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border border-indigo-100 dark:border-indigo-500/20">
              <FileQuestion className="w-3.5 h-3.5" /> {mock.questions} Qs
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide border border-emerald-100 dark:border-emerald-500/20">
              <Timer className="w-3.5 h-3.5" /> {mock.duration} Mins
            </span>
            
            {/* TAGS: FREE OR PREMIUM */}
            {mock.isFree ? (
              <span className="flex items-center gap-1 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-bold border border-green-200 dark:border-green-500/20">
                <Unlock className="w-3.5 h-3.5" /> FREE
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-500/20 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-current" /> PREMIUM
              </span>
            )}
          </div>
          
          <h4 className="font-bold text-slate-900 dark:text-white text-lg">{mock.title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on the latest TCS exam pattern.</p>
        </div>
        
        <button 
          onClick={() => {
            if (isLocked) {
              navigate("/pricing"); // Paid mock click karne par pricing page
            } else {
              // Test page par random fetch hone ke liye type bhej rahe hain
              const route = type === "full" 
                ? `/quiz/full-mock/${mock.id}?type=random_full` 
                : `/quiz/${selectedSubject}/${mock.id}?type=random_subject`;
              navigate(route);
            }
          }}
          className={cn(
            "w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
            isLocked 
              ? "bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white/10"
              : "glow-button bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
          )}
        >
          {isLocked ? <><Lock className="w-4.5 h-4.5" /> Unlock Pro</> : <><PlayCircle className="w-4.5 h-4.5" /> Start Test</>}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-background pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-background/80 border-b border-slate-200 dark:border-white/10 pt-8 pb-4 sticky top-16 z-20 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Test Series</h1>
          <p className="text-slate-500 dark:text-muted-foreground mb-6">Attempt industry-grade mock tests to evaluate your preparation.</p>
          
          {/* Tabs */}
          <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => { setActiveTab("full"); setSelectedSubject(null); }} 
              className={cn("px-4 py-3 font-bold text-sm transition-all whitespace-nowrap border-b-2", activeTab === "full" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white")}
            >
              Full Length Mocks
            </button>
            <button 
              onClick={() => setActiveTab("subject")} 
              className={cn("px-4 py-3 font-bold text-sm transition-all whitespace-nowrap border-b-2", activeTab === "subject" ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white")}
            >
              Subject-wise Mocks
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: FULL MOCKS */}
          {activeTab === "full" && (
            <motion.div key="full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fullMocksList.map(mock => <MockCard key={mock.id} mock={mock} type="full" />)}
            </motion.div>
          )}

          {/* TAB 2: SUBJECT MOCKS */}
          {activeTab === "subject" && !selectedSubject && (
            <motion.div key="subjects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {subjects.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-[#1a1d24] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all group"
                >
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110", sub.bg)}>
                    <sub.icon className={cn("w-8 h-8", sub.color)} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sub.name}
                  </span>
                </button>
              ))}
            </motion.div>
          )}

          {/* TAB 2.1: SUBJECT MOCKS LIST (After selecting a subject) */}
          {activeTab === "subject" && selectedSubject && (
            <motion.div key="subject-mocks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button 
                onClick={() => setSelectedSubject(null)} 
                className="flex items-center gap-2 text-slate-600 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 font-bold transition-colors bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm w-max"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Subjects
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {generateSubjectMocks(selectedSubject).map(mock => <MockCard key={mock.id} mock={mock} type="subject" />)}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}