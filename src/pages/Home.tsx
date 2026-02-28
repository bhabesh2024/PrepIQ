import { Link } from "react-router-dom";
import { BookOpen, Clock, Award, Star, Sparkles, Zap, Brain } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Rahul S.", role: "JEE Aspirant", text: "PrepIQ completely changed my preparation strategy. The mock tests are incredibly realistic." },
  { name: "Priya M.", role: "UPSC Candidate", text: "The chapter-wise practice and AI explanations helped me clear my doubts instantly." },
  { name: "Amit K.", role: "NEET Aspirant", text: "I love the detailed performance tracking. It showed me exactly where I needed to improve." },
  { name: "Sneha R.", role: "Banking Aspirant", text: "The timed quizzes are perfect for building speed and accuracy. Highly recommended!" },
  { name: "Vikram T.", role: "SSC Candidate", text: "Best platform for competitive exams. The UI is so clean and distraction-free." },
];

export function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium text-foreground/80 mb-4"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>The Next Generation of Exam Prep</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl leading-tight"
          >
            Master Your Exams with <br className="hidden sm:block" />
            <span className="text-gradient">PrepIQ</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            The ultimate platform for untimed practice, timed mock tests, and AI-powered learning. Elevate your preparation today.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-6 mt-10"
          >
            <Link
              to="/practice"
              className="glow-button inline-flex items-center justify-center rounded-xl text-base font-semibold bg-foreground text-background shadow-lg h-14 px-8 z-10"
            >
              <Brain className="mr-2 h-5 w-5" />
              Start Practice
            </Link>
            <Link
              to="/quiz"
              className="glass-card inline-flex items-center justify-center rounded-xl text-base font-semibold hover:bg-accent/50 transition-colors h-14 px-8 z-10"
            >
              <Zap className="mr-2 h-5 w-5" />
              Take a Mock Test
            </Link>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left"
        >
          <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
              <BookOpen className="h-7 w-7 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Chapter Practice</h3>
            <p className="text-muted-foreground leading-relaxed">Master concepts topic by topic with detailed explanations and AI assistance.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Clock className="h-7 w-7 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Timed Quizzes</h3>
            <p className="text-muted-foreground leading-relaxed">Simulate real exam environments with reverse timers and negative marking.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
              <Award className="h-7 w-7 text-pink-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Performance Tracking</h3>
            <p className="text-muted-foreground leading-relaxed">Analyze your results, track progress, and identify areas for improvement.</p>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <div className="mt-40 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Aspirants</h2>
            <p className="text-muted-foreground">Join thousands of students who have transformed their preparation.</p>
          </div>
          
          <div className="relative w-full overflow-hidden py-4 mask-edges">
            {/* Gradient Masks for smooth fade out on edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
            
            <div className="flex w-[200%] animate-marquee gap-6">
              {/* Double the items for seamless looping */}
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl w-[350px] flex-shrink-0">
                  <div className="flex text-yellow-500 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-foreground/90 mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
