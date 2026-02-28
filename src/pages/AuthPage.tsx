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
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  // Naye States Error aur Attempts ke liye
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Purana error clear karo
    
    try {
      let data;
      if (loginMethod === "password") {
        data = await AuthAPI.login({ identifier, password });
      } else {
        data = await AuthAPI.verifyOtp({ identifier, otp });
      }
      onSuccess(data.token, data.user);
    } catch (error: any) {
      console.error("Login error", error);
      
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      // Agar 2 baar se zyada fail ho jaye
      if (newAttempts > 2 && loginMethod === "password") {
        setError("Having trouble? Forgot your password? Reset it to regain access.");
        return;
      }

      // Firebase Errors ko proper message mein convert karna
      switch (error.code) {
        case 'auth/user-not-found':
          setError("Account not found. Please check your email or create a new account.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-credential':
          setError("Invalid email or password. Please check your details.");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Failed to sign in. Please check your credentials.");
      }
    }
  };

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsOtpSent(true);
      alert("OTP sent to your registered email/phone!");
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {/* Error Message UI */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-xl text-center"
        >
          {error}
        </motion.div>
      )}

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
          <motion.div key="password-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <InputField label="Password" id="password" type="password" placeholder="••••••••" required value={password} onChange={(e: any) => setPassword(e.target.value)} />
          </motion.div>
        ) : (
          <motion.div key="otp-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3">
            {!isOtpSent ? (
              <button onClick={handleSendOtp} className="w-full rounded-xl bg-indigo-500/10 px-3 py-2.5 text-sm font-medium text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">Send OTP</button>
            ) : (
              <InputField label="Enter OTP" id="otp" type="text" placeholder="123456" required value={otp} onChange={(e: any) => setOtp(e.target.value)} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-end">
        <button type="button" onClick={() => setLoginMethod(loginMethod === "password" ? "otp" : "password")} className="text-xs font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
          {loginMethod === "password" ? "Login with OTP instead" : "Login with Password instead"}
        </button>
      </div>

      <button type="submit" className="glow-button flex w-full justify-center rounded-xl bg-foreground px-3 py-3 text-sm font-semibold text-background shadow-sm hover:bg-foreground/90 transition-all">
        Sign in
      </button>
      <div className="relative mt-6 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background/50 px-2 text-muted-foreground backdrop-blur-md rounded-lg">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={async () => {
          try {
            const data = await AuthAPI.loginWithGoogle();
            onSuccess(data.token, data.user);
          } catch (error: any) {
            console.error("Google Login Error", error);
            alert("Google login failed: " + error.message);
          }
        }}
        className="flex w-full justify-center items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-all"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Google
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
    navigate("/");
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