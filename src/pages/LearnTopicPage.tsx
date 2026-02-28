import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Bookmark, Share2, Settings2, Sun, Moon } from "lucide-react";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

// Mock content generator for demonstration
const generateMockPages = (topicName: string) => {
  return [
    {
      pageNumber: 1,
      title: `Introduction to ${topicName}`,
      content: `
        <p class="mb-4 text-lg leading-relaxed">Welcome to the comprehensive guide on <strong>${topicName}</strong>. This topic forms the foundational building block for advanced concepts in this subject.</p>
        <p class="mb-4 text-lg leading-relaxed">In this chapter, we will explore the core principles, definitions, and primary classifications that you need to understand before diving into complex problem-solving.</p>
        <h3 class="text-xl font-bold mt-8 mb-4 text-foreground">Why is this important?</h3>
        <p class="mb-4 text-lg leading-relaxed">Understanding these basics will help you solve questions faster and with higher accuracy. Many competitive exams test your fundamental clarity rather than just your calculation speed.</p>
        <div class="bg-indigo-500/10 border-l-4 border-indigo-500 p-4 my-6 rounded-r-xl">
          <p class="text-indigo-700 dark:text-indigo-300 font-medium">Pro Tip: Always focus on the 'Why' before the 'How'. Memorizing formulas without understanding the underlying concept often leads to mistakes in tricky questions.</p>
        </div>
      `
    },
    {
      pageNumber: 2,
      title: `Core Concepts & Definitions`,
      content: `
        <h3 class="text-xl font-bold mb-4 text-foreground">Primary Classifications</h3>
        <p class="mb-4 text-lg leading-relaxed">Let's break down the primary classifications within ${topicName}. These categories help in organizing the information logically.</p>
        <ul class="list-disc pl-6 mb-6 space-y-2 text-lg text-muted-foreground">
          <li><strong class="text-foreground">Type A:</strong> The most common category, frequently asked in preliminary exams.</li>
          <li><strong class="text-foreground">Type B:</strong> Involves multi-step reasoning and is usually found in mains or advanced tiers.</li>
          <li><strong class="text-foreground">Type C:</strong> Exceptional cases and anomalies that test your depth of knowledge.</li>
        </ul>
        <p class="mb-4 text-lg leading-relaxed">Make sure to take notes of the exceptions, as examiners love to test students on the boundaries of a rule.</p>
      `
    },
    {
      pageNumber: 3,
      title: `Formulas and Rules`,
      content: `
        <h3 class="text-xl font-bold mb-4 text-foreground">Essential Rules to Remember</h3>
        <p class="mb-4 text-lg leading-relaxed">Here are the standard rules governing ${topicName}. Memorize these, but also try to derive them once to understand their origin.</p>
        
        <div class="glass-card p-6 rounded-2xl my-6 font-mono text-center text-lg bg-background/50">
          Rule 1: If A implies B, and B implies C, then A implies C.
        </div>
        
        <p class="mb-4 text-lg leading-relaxed">This transitive property is widely applicable. Let's look at a basic example to solidify this concept.</p>
        
        <div class="bg-muted/50 p-6 rounded-2xl my-6">
          <h4 class="font-bold mb-2">Example 1:</h4>
          <p class="mb-2">Apply the rule to find the missing variable when X = 10 and Y = 20.</p>
          <p class="font-medium text-emerald-600 dark:text-emerald-400">Solution: By applying Rule 1, the result is exactly 30.</p>
        </div>
      `
    },
    {
      pageNumber: 4,
      title: `Advanced Application`,
      content: `
        <h3 class="text-xl font-bold mb-4 text-foreground">Tackling Complex Problems</h3>
        <p class="mb-4 text-lg leading-relaxed">Now that we have covered the basics of ${topicName}, let's move on to advanced applications. These questions often combine multiple concepts.</p>
        <p class="mb-4 text-lg leading-relaxed">The key to solving advanced problems is breaking them down into smaller, manageable parts. Don't get overwhelmed by the length of the question.</p>
        <div class="bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl my-6">
          <h4 class="font-bold text-amber-600 dark:text-amber-400 mb-2">Common Pitfall</h4>
          <p class="text-amber-700 dark:text-amber-300">Students often rush to apply a formula without checking if the conditions for that formula are met. Always verify the prerequisites!</p>
        </div>
      `
    },
    {
      pageNumber: 5,
      title: `Summary & Next Steps`,
      content: `
        <h3 class="text-xl font-bold mb-4 text-foreground">Chapter Summary</h3>
        <p class="mb-4 text-lg leading-relaxed">Congratulations on completing the theory for ${topicName}! Let's quickly recap what we've learned:</p>
        <ul class="list-disc pl-6 mb-8 space-y-2 text-lg text-muted-foreground">
          <li>Understood the foundational definitions.</li>
          <li>Learned the primary classifications and exceptions.</li>
          <li>Memorized and applied the essential rules.</li>
          <li>Explored advanced problem-solving strategies.</li>
        </ul>
        <p class="mb-4 text-lg leading-relaxed">Your next step should be to practice as many questions as possible. Theory is only 20% of the preparation; the rest is practice.</p>
        <div class="text-center mt-8">
          <p class="text-muted-foreground mb-4">Ready to test your knowledge?</p>
        </div>
      `
    }
  ];
};

export function LearnTopicPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  // Format topic name from ID for display
  const topicName = topicId ? topicId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Topic";
  
  const [pages, setPages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    // Simulate fetching content
    setPages(generateMockPages(topicName));
    setCurrentPage(1);
  }, [topicName]);

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

  // Animation variants for page turn effect
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 50 : -50,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f8f9fa] dark:bg-[#0a0a0a] text-foreground font-serif selection:bg-indigo-500/30 pb-24 md:pb-12">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>

      {/* Reader Header */}
      <header className="sticky top-0 z-40 bg-[#f8f9fa]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between font-sans">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(`/subjects/${subjectId}`)}
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
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
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
      <main className="max-w-3xl mx-auto px-6 sm:px-12 py-12 md:py-16 min-h-[60vh]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
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
              dangerouslySetInnerHTML={{ __html: currentContent.content }}
            />
            
            {currentPage === totalPages && (
              <div className="mt-12 flex justify-center">
                <Link 
                  to={`/practice?subject=${subjectId}&topic=${topicId}`}
                  className="font-sans glow-button bg-indigo-500 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <BookOpen className="w-5 h-5" /> Start Practice
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Pagination Controls */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/90 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/90 pt-12 pb-6 px-4 z-30 font-sans">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => paginate(-1)}
            disabled={currentPage === 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              currentPage === 1 
                ? "opacity-0 pointer-events-none" 
                : "bg-white dark:bg-white/10 shadow-sm hover:shadow-md text-foreground"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Previous</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {pages.map((page) => (
              <button
                key={page.pageNumber}
                onClick={() => goToPage(page.pageNumber)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                  currentPage === page.pageNumber
                    ? "bg-indigo-500 text-white shadow-md scale-110"
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground"
                )}
              >
                {page.pageNumber}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            disabled={currentPage === totalPages}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
              currentPage === totalPages 
                ? "opacity-0 pointer-events-none" 
                : "bg-white dark:bg-white/10 shadow-sm hover:shadow-md text-foreground"
            )}
          >
            <span className="hidden sm:inline font-medium">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
