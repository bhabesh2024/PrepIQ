import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Calculator, Brain, BookA, Globe, Newspaper, ArrowRight, Microscope, MonitorPlay, BookOpen, PenTool } from "lucide-react";

const subjects = [
  {
    id: "maths",
    name: "Mathematics",
    description: "Master quantitative aptitude, algebra, geometry, and advanced mathematics.",
    icon: Calculator,
    color: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-500/10",
    iconColor: "text-blue-500",
    topics: 24,
    questions: 1500
  },
  {
    id: "reasoning",
    name: "Reasoning",
    description: "Enhance your logical, analytical, and verbal reasoning skills.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-500/10",
    iconColor: "text-purple-500",
    topics: 18,
    questions: 1200
  },
  {
    id: "english",
    name: "English",
    description: "Improve grammar, vocabulary, reading comprehension, and verbal ability.",
    icon: BookA,
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    topics: 15,
    questions: 2000
  },
  {
    id: "gk",
    name: "General Knowledge",
    description: "Explore history, geography, polity, economics, and general science.",
    icon: Globe,
    color: "from-orange-500 to-amber-500",
    bgLight: "bg-orange-500/10",
    iconColor: "text-orange-500",
    topics: 30,
    questions: 3500
  },
  {
    id: "current-affairs",
    name: "Current Affairs",
    description: "Stay updated with the latest national and international events.",
    icon: Newspaper,
    color: "from-rose-500 to-red-500",
    bgLight: "bg-rose-500/10",
    iconColor: "text-rose-500",
    topics: 12,
    questions: 800
  },
  {
    id: "science-tech",
    name: "Science & Tech",
    description: "Learn about recent advancements in science, space, defense, and technology.",
    icon: Microscope,
    color: "from-indigo-500 to-violet-500",
    bgLight: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    topics: 20,
    questions: 1000
  },
  {
    id: "computer",
    name: "Computer",
    description: "Master computer fundamentals, networking, software, and basic programming.",
    icon: MonitorPlay,
    color: "from-sky-500 to-blue-500",
    bgLight: "bg-sky-500/10",
    iconColor: "text-sky-500",
    topics: 16,
    questions: 1100
  }
];

export function SubjectsPage() {
  const location = useLocation();
  const isPracticeMode = location.pathname.startsWith('/practice');

  return (
    <div className="relative flex flex-col items-center min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground/80 mb-4"
          >
            <span>{isPracticeMode ? "Practice Mode" : "Explore Our Curriculum"}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            Choose Your <span className="text-gradient">Subject</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground"
          >
            {isPracticeMode 
              ? "Select a subject to start practicing MCQs topic by topic." 
              : "Comprehensive study materials and practice tests for every topic."}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {subjects.map((subject, index) => {
            const Icon = subject.icon;
            return (
              <div 
                key={subject.id} 
                className="glass-card rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden flex flex-col h-full"
              >
                {/* Subtle gradient hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className={`h-16 w-16 rounded-2xl ${subject.bgLight} flex items-center justify-center mb-6`}>
                  <Icon className={`h-8 w-8 ${subject.iconColor}`} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{subject.name}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                  {subject.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-background/50 rounded-xl p-3 border border-white/5">
                    <div className="text-2xl font-bold text-foreground">{subject.topics}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Topics</div>
                  </div>
                  <div className="bg-background/50 rounded-xl p-3 border border-white/5">
                    <div className="text-2xl font-bold text-foreground">{subject.questions}+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Questions</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-auto">
                  {isPracticeMode ? (
                    <Link 
                      to={`/practice/${subject.id}`}
                      className="w-full glow-button bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      View Topics <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to={`/subjects/${subject.id}`}
                        className="w-full glow-button bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl text-center transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        Read Concepts <BookOpen className="w-4 h-4" />
                      </Link>
                      <div className="flex gap-3">
                        <Link 
                          to={`/practice/${subject.id}`}
                          className="flex-1 bg-background/50 border border-white/10 hover:bg-accent hover:text-accent-foreground text-foreground font-medium py-3 px-4 rounded-xl text-center transition-colors text-sm flex items-center justify-center gap-2"
                        >
                          <PenTool className="w-4 h-4" /> Practice
                        </Link>
                        <Link 
                          to={`/quiz?subject=${subject.id}`}
                          className="flex-1 bg-background/50 border border-white/10 hover:bg-accent hover:text-accent-foreground text-foreground font-medium py-3 px-4 rounded-xl text-center transition-colors text-sm"
                        >
                          Mock Test
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
