import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthAPI } from "../lib/api";
import { motion } from "framer-motion";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const data = await AuthAPI.login({ email, password });
        login(data.token, data.user);
        navigate("/profile");
      } else {
        const data = await AuthAPI.signup({ email, password });
        login(data.token, data.user);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Auth error", error);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md space-y-8 glass-card p-10 rounded-3xl z-10"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-foreground">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isLogin ? "Enter your details to sign in" : "Sign up to get started"}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-foreground mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-background/50 px-4 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-background/50 px-4 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="glow-button flex w-full justify-center rounded-xl bg-foreground px-3 py-3 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
