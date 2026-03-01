import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// Razorpay SDK load karne ka helper function
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Plans array mein 'priceValue' add kiya hai taaki calculation aasan ho
const plans = [
  {
    name: "Basic",
    price: "Free",
    priceValue: 0,
    period: "Forever",
    description: "Perfect for getting started with your preparation.",
    features: [
      "Full access to Practice Sessions",
      "Access to Concept Learning",
      "4 Full Mock Tests",
      "5 Subject-wise Mock Tests"
    ],
    buttonText: "Current Plan",
    popular: false,
  },
  {
    name: "Starter",
    price: "₹499",
    priceValue: 499,
    period: "for 3 months",
    description: "A short-term boost for your upcoming exams.",
    features: [
      "Complete Full Mock Test access",
      "Complete Subject-wise Mock Tests",
      "Help and Support",
      "Early access to new features",
      "Direct admin support",
      "Ad-free experience"
    ],
    buttonText: "Choose 3 Months",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹899",
    priceValue: 899,
    period: "for 6 months",
    badge: "Save 10%",
    description: "Ideal for thorough and consistent preparation.",
    features: [
      "Complete Full Mock Test access",
      "Complete Subject-wise Mock Tests",
      "Help and Support",
      "Early access to new features",
      "Direct admin support",
      "Ad-free experience"
    ],
    buttonText: "Choose 6 Months",
    popular: false,
  },
  {
    name: "Elite",
    price: "₹1499",
    priceValue: 1499,
    period: "for 1 year",
    badge: "Save ~25%",
    description: "For serious aspirants who want the ultimate edge.",
    features: [
      "Complete Full Mock Test access",
      "Complete Subject-wise Mock Tests",
      "Help and Support",
      "Early access to new features",
      "Direct admin support",
      "Ad-free experience"
    ],
    buttonText: "Best Value - 1 Year",
    popular: true,
  }
];

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const displayRazorpay = async (plan: any) => {
    // 1. Agar user logged in nahi hai, toh pehle login page par bhejo
    if (!user) {
      alert("Please login to subscribe to a plan.");
      navigate("/auth");
      return;
    }

    // 2. Free plan ke liye Razorpay mat kholo
    if (plan.priceValue === 0) {
      alert("You are already on the Free Basic plan. Start practicing!");
      navigate("/practice");
      return;
    }

    setIsProcessing(true);

    // 3. Razorpay script load karo
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    // 4. Razorpay Options Setup
    const options = {
      // YAHAN APNI TEST KEY DAALEIN
      key: "rzp_test_SJZF5HPMUW1jwi", 
      amount: plan.priceValue * 100, // Razorpay amount ko Paise (paisa) mein leta hai, isliye * 100
      currency: "INR",
      name: "PrepIQ",
      description: `Subscription for ${plan.name} Plan`,
      image: "/favicon.svg", // Aapke app ka logo
      handler: async function (response: any) {
        // 5. Payment Success hone par Firebase DB me save karna
        try {
          await addDoc(collection(db, "orders"), {
            userId: user.uid,
            userEmail: user.email,
            planName: `${plan.name} (${plan.period})`,
            amount: plan.priceValue,
            paymentId: response.razorpay_payment_id,
            status: "active",
            createdAt: new Date().toISOString()
          });

          alert(`Payment Successful! Welcome to PrepIQ ${plan.name}.`);
          navigate("/profile"); // Profile page par bhej do jahan 'My Orders' dikhega
        } catch (error) {
          console.error("Error saving order: ", error);
          alert("Payment received but failed to update database. Please contact support.");
        }
      },
      prefill: {
        name: user.name || "",
        email: user.email || "",
      },
      theme: {
        color: "#4f46e5", // Indigo 600 color to match your app
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
    setIsProcessing(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden bg-background py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl z-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
          >
            Simple, transparent <span className="text-gradient">pricing</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Choose the subscription plan that best fits your preparation journey.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={cn(
                "glass-card p-6 lg:p-8 rounded-3xl relative flex flex-col transition-all duration-300",
                plan.popular 
                  ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)] xl:scale-105 z-10 bg-indigo-500/5' 
                  : 'hover:border-white/20'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-4 h-4" /> Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  {plan.badge && (
                    <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-1 rounded-lg border border-emerald-500/20">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium text-indigo-500/80 mb-4">{plan.period}</div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Payment Button */}
              <button 
                onClick={() => displayRazorpay(plan)}
                disabled={isProcessing}
                className={cn(
                  "w-full py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50",
                  plan.popular 
                    ? "glow-button bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25" 
                    : "bg-background/80 border border-white/10 hover:bg-white/10 text-foreground"
                )}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}