import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, XCircle, ChevronRight, ChevronLeft, 
  LayoutGrid, Award, RotateCcw, Home, GraduationCap, ListOrdered, 
  Landmark, Languages, Sparkles, Share2, Flag, Bookmark, Sun, Moon
} from "lucide-react";
import { cn } from "../lib/utils";
import { QuestionsAPI } from "../lib/api";
import { useTheme } from "../context/ThemeContext";

type Question = {
  id: number;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
};

export function PracticeSessionPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Track user answers: { questionIndex: selectedOption }
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  
  // Track if session is finished
  const [isFinished, setIsFinished] = useState(false);
  
  // Toggle question palette on mobile
  const [showPalette, setShowPalette] = useState(false);

  const topicName = topicId ? topicId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Topic';

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        let data = await QuestionsAPI.fetchBySubject(subjectId || "Maths", topicId || "Algebra");
        if (!data || data.length === 0) {
          data = await QuestionsAPI.fetchBySubject("Maths", "Algebra");
        }
        setQuestions(data);
      } catch (error) {
        console.error("Failed to load questions", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [subjectId, topicId]);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = userAnswers[currentIndex];
  const isAnswered = !!selectedAnswer;
  const isCorrect = isAnswered && selectedAnswer === currentQuestion?.answer;

  const handleAnswerSelect = (option: string) => {
    if (isAnswered || isFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setCurrentIndex(index);
    setShowPalette(false);
  };

  const finishPractice = () => {
    setIsFinished(true);
  };

  const restartPractice = () => {
    setUserAnswers({});
    setBookmarked({});
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const toggleBookmark = () => {
    setBookmarked(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const clearAnswer = () => {
    if (isFinished) return;
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentIndex];
      return newAnswers;
    });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#0f1117]">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading practice session...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#0f1117] p-4 text-center">
        <h2 className="text-2xl font-bold mb-2 text-foreground dark:text-white">No Questions Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find any practice questions for this topic.</p>
        <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium">
          Go Back
        </button>
      </div>
    );
  }

  // --- Results View ---
  if (isFinished) {
    const totalQuestions = questions.length;
    const attempted = Object.keys(userAnswers).length;
    const correctAnswers = Object.entries(userAnswers).filter(
      ([index, answer]) => questions[Number(index)].answer === answer
    ).length;
    const wrongAnswers = attempted - correctAnswers;
    const accuracy = attempted > 0 ? Math.round((correctAnswers / attempted) * 100) : 0;

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9fa] dark:bg-[#0f1117] py-12 px-4 sm:px-6 text-foreground dark:text-white">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1a1d24] rounded-3xl p-8 text-center relative overflow-hidden border border-black/5 dark:border-white/5 shadow-sm"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
            
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-blue-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Practice Completed!</h1>
            <p className="text-muted-foreground mb-8">Here is a detailed summary of your performance.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/5 dark:bg-black/20 rounded-2xl p-4 border border-black/5 dark:border-white/5">
                <div className="text-3xl font-bold text-foreground dark:text-white mb-1">{totalQuestions}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</div>
              </div>
              <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20">
                <div className="text-3xl font-bold text-emerald-500 mb-1">{correctAnswers}</div>
                <div className="text-xs text-emerald-500 uppercase tracking-wider font-semibold">Correct</div>
              </div>
              <div className="bg-rose-500/10 rounded-2xl p-4 border border-rose-500/20">
                <div className="text-3xl font-bold text-rose-500 mb-1">{wrongAnswers}</div>
                <div className="text-xs text-rose-500 uppercase tracking-wider font-semibold">Wrong</div>
              </div>
              <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-500 mb-1">{accuracy}%</div>
                <div className="text-xs text-blue-500 uppercase tracking-wider font-semibold">Accuracy</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={restartPractice}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 font-medium transition-colors"
              >
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
              <button 
                onClick={() => {
                  setIsFinished(false);
                  setCurrentIndex(0);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-500 hover:bg-blue-600 hover:text-white font-medium transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" /> Review Answers
              </button>
              <Link 
                to="/practice"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background hover:opacity-90 font-medium transition-colors"
              >
                <Home className="w-5 h-5" /> Back to Subjects
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const attemptedCount = Object.keys(userAnswers).length;

  // --- Practice View ---
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8f9fa] dark:bg-[#0f1117] text-foreground dark:text-gray-100">
      {/* Header */}
      <header className="h-16 border-b border-black/5 dark:border-white/10 bg-white dark:bg-[#0f1117] flex items-center justify-between px-4 sm:px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-500" />
            <h1 className="font-bold text-lg hidden sm:block">{topicName} Practice</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full text-sm font-medium ml-2 sm:ml-4">
            <ListOrdered className="w-4 h-4 text-muted-foreground" />
            <span>Q. {currentIndex + 1}/{questions.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full uppercase tracking-wider hidden sm:block">
            Learning Mode
          </span>
          <button 
            onClick={finishPractice}
            className="text-sm font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 bg-rose-500/10 px-5 py-1.5 rounded-full hover:bg-rose-500/20 transition-colors"
          >
            Exit
          </button>
          <button 
            onClick={() => setShowPalette(!showPalette)}
            className="lg:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Question Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto p-4 sm:p-6 pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Question Card */}
                <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 sm:p-8 mb-6 border border-black/5 dark:border-white/5 shadow-sm">
                  {/* Tags Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        Question {currentIndex + 1}
                      </span>
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5" /> SSC CGL 2023
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full transition-colors">
                        <Languages className="w-3.5 h-3.5" /> Hindi
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-3.5 h-3.5" /> ASK AI
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full transition-colors hidden sm:flex">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                      <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full transition-colors hidden sm:flex">
                        <Flag className="w-3.5 h-3.5" /> Report
                      </button>
                    </div>
                  </div>
                  
                  {/* Question Text */}
                  <h2 className="text-lg sm:text-xl font-medium leading-relaxed text-foreground dark:text-gray-100">
                    {currentQuestion.text}
                  </h2>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectOption = option === currentQuestion.answer;
                    
                    const showCorrect = isAnswered && isCorrectOption;
                    const showIncorrect = isAnswered && isSelected && !isCorrectOption;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={isAnswered}
                        className={cn(
                          "w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between group",
                          !isAnswered && "bg-white dark:bg-[#1a1d24] border-black/5 dark:border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 shadow-sm",
                          showCorrect && "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400",
                          showIncorrect && "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400",
                          isAnswered && !showCorrect && !showIncorrect && "bg-white/50 dark:bg-[#1a1d24]/50 border-transparent opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                            !isAnswered && "bg-black/5 dark:bg-white/10 text-muted-foreground group-hover:bg-blue-500 group-hover:text-white",
                            showCorrect && "bg-emerald-500 text-white",
                            showIncorrect && "bg-rose-500 text-white",
                            isAnswered && !showCorrect && !showIncorrect && "bg-black/5 dark:bg-white/10 text-muted-foreground"
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-medium text-base">{option}</span>
                        </div>
                        {showCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />}
                        {showIncorrect && <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-black/5 dark:border-white/5 shadow-sm">
                        <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Explanation
                        </h3>
                        <p className="text-foreground/80 dark:text-gray-300 leading-relaxed">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-80 shrink-0 border-l border-black/5 dark:border-white/10 bg-white dark:bg-[#0f1117]">
          <div className="p-6 border-b border-black/5 dark:border-white/10">
            <h3 className="font-bold text-sm tracking-widest uppercase mb-6">Question Palette</h3>
            <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Review
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-4 gap-3">
              {questions.map((q, idx) => {
                const answered = !!userAnswers[idx];
                const isReview = bookmarked[idx];
                
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToQuestion(idx)}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative",
                      currentIndex === idx ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : 
                      answered ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : 
                      "bg-black/5 dark:bg-[#1a1d24] border border-transparent dark:border-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
                    )}
                  >
                    {idx + 1}
                    {isReview && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white dark:border-[#0f1117]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="p-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-center bg-black/5 dark:bg-black/20">
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{attemptedCount}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attempted</div>
            </div>
            <div className="w-px h-8 bg-black/10 dark:bg-white/10" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-foreground dark:text-gray-300">{questions.length - attemptedCount}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Left</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Palette Drawer */}
      <AnimatePresence>
        {showPalette && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPalette(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1117] rounded-t-3xl z-50 p-6 pb-safe border-t border-black/5 dark:border-white/10 shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 shrink-0" />
              <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                  <LayoutGrid className="w-5 h-5 text-blue-500" /> Palette
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Ans</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Rev</div>
                </div>
              </div>
              <div className="overflow-y-auto flex-1 -mx-2 px-2 pb-4">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                  {questions.map((q, idx) => {
                    const answered = !!userAnswers[idx];
                    const isReview = bookmarked[idx];
                    return (
                      <button
                        key={idx}
                        onClick={() => jumpToQuestion(idx)}
                        className={cn(
                          "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative",
                          currentIndex === idx ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : 
                          answered ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : 
                          "bg-black/5 dark:bg-[#1a1d24] border border-transparent dark:border-white/5 text-muted-foreground"
                        )}
                      >
                        {idx + 1}
                        {isReview && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white dark:border-[#0f1117]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="h-20 border-t border-black/5 dark:border-white/10 bg-white dark:bg-[#0f1117] flex items-center justify-between px-4 sm:px-6 shrink-0 z-40">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">Prev</span>
          </button>
          <button 
            onClick={toggleBookmark}
            className="p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Bookmark className={cn("w-5 h-5", bookmarked[currentIndex] && "fill-amber-500 text-amber-500")} />
          </button>
        </div>
        
        <button 
          onClick={clearAnswer}
          disabled={!isAnswered}
          className="text-sm font-bold text-muted-foreground hover:text-foreground px-4 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          CLEAR
        </button>
        
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/20 transition-all"
        >
          {currentIndex === questions.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
