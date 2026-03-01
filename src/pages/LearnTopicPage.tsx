import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Bookmark, Settings2, Lightbulb } from "lucide-react";
import { cn } from "../lib/utils";
import { db } from "../lib/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import katex from 'katex';

// Mock content generator fallback
const generateMockPages = (topicName: string) => {
  return [
    {
      pageNumber: 1,
      title: `Introduction to ${topicName}`,
      content: `
        <p class="mb-4 text-lg leading-relaxed">Welcome to the comprehensive guide on <strong>${topicName}</strong>. This topic forms the foundational building block for advanced concepts.</p>
        <p class="mb-4 text-lg leading-relaxed">In this chapter, we will explore the core principles that you need to understand before diving into complex problem-solving.</p>
        <h3 class="text-xl font-bold mt-8 mb-4 text-foreground">Why is this important?</h3>
        <p class="mb-4 text-lg leading-relaxed">Understanding these basics will help you solve questions faster and with higher accuracy.</p>
      `,
      proTip: "Always focus on the 'Why' before the 'How'. Memorizing formulas without understanding the underlying concept often leads to mistakes in tricky questions."
    },
    {
      pageNumber: 2,
      title: `Formulas and Rules`,
      content: `
        <h3 class="text-xl font-bold mb-4 text-foreground">Essential Rules to Remember</h3>
        <p class="mb-4 text-lg leading-relaxed">Here are the standard rules governing ${topicName}. Memorize these, but also try to derive them once.</p>
        <div class="glass-card p-6 rounded-2xl my-6 font-mono text-center text-lg bg-background/50 border border-border">
          Rule 1: Practice makes perfect.
        </div>
      `,
      proTip: "Try to derive the formula by yourself. It builds strong muscle memory."
    }
  ];
};

export function LearnTopicPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  
  const topicName = topicId ? topicId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Topic";
  
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0); 

    // --- NAYA FUNCTION: HTML ke andar se $...$ dhundh kar Math banayega ---
  const renderHtmlWithMath = (htmlString: string) => {
    if (!htmlString) return "";
    return htmlString.replace(/\$(.*?)\$/g, (match, math) => {
      try {
        return katex.renderToString(math, { throwOnError: false, displayMode: false });
      } catch (e) {
        return match;
      }
    });
  };

  // --- NAYA FETCH LOGIC ---
  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        // NAYA LOGIC: URL ke short name ko Database ke real name se match karne ke liye Dictionary
        const subjectMap: Record<string, string> = {
          "maths": "Mathematics",
          "reasoning": "Reasoning",
          "english": "English",
          "gk": "General Knowledge",
          "current-affairs": "Current Affairs",
          "science-tech": "Science & Tech",
          "computer": "Computer"
        };
        
        // Agar URL me 'maths' hai toh ye automatic usko 'Mathematics' bana dega
        const formattedSubject = subjectId ? (subjectMap[subjectId] || subjectId) : "Mathematics";
        const formattedTopic = topicId || "algebra";
        
        const q = query(
          collection(db, "concepts"),
          where("subject", "==", formattedSubject),
          where("chapterId", "==", formattedTopic)
        );
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc, index) => {
          const docData = doc.data();
          return {
            id: doc.id,
            pageNumber: docData.pageNumber || index + 1,
            title: docData.title || `Concept ${index + 1}`,
            content: docData.content || "",
            proTip: docData.proTip || null,
            ...docData
          };
        });
        
        if (data.length > 0) {
          data.sort((a, b) => a.pageNumber - b.pageNumber);
          setPages(data);
        } else {
          setPages(generateMockPages(topicName));
        }
      } catch (error) {
        console.error("Error fetching concepts", error);
        setPages(generateMockPages(topicName));
      }
    };
    
    fetchConcepts();
    setCurrentPage(1);
  }, [subjectId, topicId, topicName]);


  const totalPages = pages.length;

  const paginate = (newDirection: number) => {
    const newPage = currentPage + newDirection;
    if (newPage >= 1 && newPage <= totalPages) {
      setDirection(newDirection);
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (page: number) => {
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pages.length === 0) return null;
  const currentContent = pages[currentPage - 1];
  if (!currentContent) return null;

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>

      {/* Reader Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between font-sans">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{subjectId}</span>
              <h1 className="text-sm font-bold truncate max-w-[200px] sm:max-w-[400px]">{topicName}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground hidden sm:block">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Reader Content Area */}
      <main className="max-w-3xl mx-auto w-full px-6 sm:px-12 py-12 pb-32 min-h-[70vh]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="reader-content"
          >
            <div className="mb-12 text-center">
              <span className="text-sm font-sans font-bold text-muted-foreground tracking-widest uppercase mb-4 block">
                Chapter {currentPage}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {currentContent.title}
              </h2>
            </div>
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-sans prose-p:text-foreground/90 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderHtmlWithMath(currentContent.content) }}
            />
            
            {/* --- NAYA HIGH CONTRAST PRO TIP BOX --- */}
            {currentContent.proTip && (
              <div className="relative overflow-hidden bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 p-6 sm:p-8 my-10 rounded-3xl shadow-md">
                {/* Background Watermark Icon */}
                <div className="absolute -top-6 -right-6 p-4 opacity-10 dark:opacity-10 pointer-events-none">
                  <Lightbulb className="w-40 h-40 text-amber-700 dark:text-amber-400" />
                </div>
                
                <div className="relative z-10">
                  <h4 className="flex items-center gap-2 font-extrabold text-amber-800 dark:text-amber-500 mb-3 uppercase tracking-widest text-xs">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 dark:bg-amber-500/20">
                      <Lightbulb className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    </span>
                    Pro Tip
                  </h4>
                  {/* Light Mode me Dark Black (text-gray-900), Dark mode me White (text-gray-100) */}
                  <p className="text-gray-900 dark:text-gray-100 font-semibold text-[15px] sm:text-[17px] leading-relaxed">
                    {currentContent.proTip}
                  </p>
                </div>
              </div>
            )}
            {/* --- PRO TIP BOX END --- */}
            
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Pagination Controls - Start Practice Button is inside here now! */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 pt-4 pb-4 sm:pb-6 px-4 z-50 font-sans shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none transition-all">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          
          <button
            onClick={() => paginate(-1)}
            disabled={currentPage === 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all",
              currentPage === 1 
                ? "opacity-0 pointer-events-none" 
                : "bg-card border border-border shadow-sm hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-semibold text-sm">Previous</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {pages.map((page) => (
              <button
                key={page.pageNumber}
                onClick={() => goToPage(page.pageNumber)}
                className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  currentPage === page.pageNumber
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-110"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                )}
              >
                {page.pageNumber}
              </button>
            ))}
          </div>

          {/* DYNAMIC NEXT / START PRACTICE BUTTON */}
          {currentPage === totalPages ? (
            <Link 
              to={`/practice/${subjectId}/${topicId}`}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <span className="hidden sm:inline">Start Practice</span>
              <span className="sm:hidden">Practice</span>
              <BookOpen className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => paginate(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all bg-card border border-border shadow-sm hover:bg-black/5 dark:hover:bg-white/5 text-foreground"
            >
              <span className="hidden sm:inline font-semibold text-sm">Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
