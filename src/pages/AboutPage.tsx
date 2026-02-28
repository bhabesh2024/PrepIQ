import { motion } from "framer-motion";
import { Users, Target, Zap, ShieldCheck } from "lucide-react";

export function AboutPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl"
          >
            Empowering Aspirants with <span className="text-gradient">AI-Driven Learning</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            PrepIQ was founded with a simple mission: to make high-quality, personalized exam preparation accessible to everyone.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
        >
          <div className="glass-card p-10 rounded-3xl">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We started PrepIQ because we saw a gap in the traditional education system. Students were spending hours on generic practice materials that didn't adapt to their individual needs.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By combining cutting-edge AI technology with expert-curated content, we've created a platform that understands how you learn and helps you improve faster than ever before.
            </p>
          </div>
          <div className="glass-card p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
             <div className="text-center">
               <div className="text-5xl font-extrabold text-gradient mb-2">100k+</div>
               <div className="text-lg font-medium text-foreground/80">Active Learners</div>
               <div className="text-5xl font-extrabold text-gradient mt-8 mb-2">5M+</div>
               <div className="text-lg font-medium text-foreground/80">Questions Solved</div>
             </div>
          </div>
        </motion.div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Core Values</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Student First</h3>
            <p className="text-muted-foreground">Every feature we build is designed to help you succeed.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Precision</h3>
            <p className="text-muted-foreground">Accurate content and precise analytics for targeted improvement.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-muted-foreground">Constantly pushing the boundaries of ed-tech with AI.</p>
          </div>
          <div className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <ShieldCheck className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Integrity</h3>
            <p className="text-muted-foreground">Transparent pricing, secure data, and honest feedback.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
