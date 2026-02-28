import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthAPI } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

// --- REUSABLE COMPONENTS ---

// 1. Reusable Input Field Component
const InputField = ({ label, id, type = "text", ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="relative block w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 placeholder:text-muted-foreground focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 bg-background/50 px-4 transition-all"
      {...props}
    />
  </div>
);

// 2. Login Form Component
const LoginForm = ({ onSuccess }: { onSuccess: (token: string, user: any) => void }) => {
  const [identifier, setIdentifier] = useState(""); // Email or Username
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let data;
      if (loginMethod === "password") {
        data = await AuthAPI.login({ identifier, password });
      } else {
        data = await AuthAPI.verifyOtp({ identifier, otp });
      }
      onSuccess(data.token, data.user);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Assuming you will add AuthAPI.sendOtp in your api.ts
      // await AuthAPI.sendOtp({ identifier });
      setIsOtpSent(true);
      alert("OTP sent to your registered email/phone!");
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <InputField
        label="Email or Username"
        id="identifier"
        placeholder="Enter your email or username"
        required
        value={identifier}
        onChange={(e: any) => setIdentifier(e.target.value)}
      />

      <AnimatePresence mode="wait">
        {loginMethod === "password" ? (
          <motion.div
            key="password-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="otp-field"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {!isOtpSent ? (
              <button
                onClick={handleSendOtp}
                className="w-full rounded-xl bg-indigo-500/10 px-3 py-2.5 text-sm font-medium text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
              >
                Send OTP
              </button>
            ) : (
              <InputField
                label="Enter OTP"
                id="otp"
                type="text"
                placeholder="123456"
                required
                value={otp}
                onChange={(e: any) => setOtp(e.target.value)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setLoginMethod(loginMethod === "password" ? "otp" : "password")}
          className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          {loginMethod === "password" ? "Login with OTP instead" : "Login with Password instead"}
        </button>
      </div>

      <button
        type="submit"
        className="glow-button flex w-full justify-center rounded-xl bg-foreground px-3 py-3 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 transition-all"
      >
        Sign in
      </button>
    </form>
  );
};

// 3. Signup Form Component
const SignupForm = ({ onSuccess }: { onSuccess: (token: string, user: any) => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    try {
      const data = await AuthAPI.signup(formData);
      onSuccess(data.token, data.user);
    } catch (error) {
      console.error("Signup error", error);
    }
  };

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Full Name" id="name" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
        <InputField label="Username" id="username" name="username" placeholder="johndoe123" required value={formData.username} onChange={handleChange} />
      </div>

      <InputField label="Phone Number" id="phone" name="phone" type="tel" placeholder="+91 9876543210" required value={formData.phone} onChange={handleChange} />
      <InputField label="Email address" id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} />
      
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Password" id="password" name="password" type="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
        <InputField label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required value={formData.confirmPassword} onChange={handleChange} />
      </div>

      <button
        type="submit"
        className="glow-button flex w-full justify-center rounded-xl mt-4 bg-foreground px-3 py-3 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 transition-all"
      >
        Sign up
      </button>
    </form>
  );
};

// --- MAIN PAGE COMPONENT ---
export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = (token: string, user: any) => {
    login(token, user);
    navigate("/profile");
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
        className="w-full max-w-md space-y-6 glass-card p-8 sm:p-10 rounded-3xl z-10"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-foreground">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isLogin ? "Enter your details to sign in" : "Sign up to get started"}
          </p>
        </div>

        {/* Render appropriate form based on state */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.2 }}
          >
            {isLogin ? (
              <LoginForm onSuccess={handleAuthSuccess} />
            ) : (
              <SignupForm onSuccess={handleAuthSuccess} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="text-center pt-2">
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