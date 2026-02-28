import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for getting started with your preparation.",
    features: [
      "Access to 100+ practice questions",
      "1 Mock Test per month",
      "Basic performance tracking",
      "Community forum access"
    ],
    buttonText: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "₹499/mo",
    description: "Everything you need to ace your exams.",
    features: [
      "Unlimited practice questions",
      "Unlimited Mock Tests",
      "Advanced AI explanations",
      "Detailed performance analytics",
      "Priority community support"
    ],
    buttonText: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Elite",
    price: "₹999/mo",
    description: "For serious aspirants who want the edge.",
    features: [
      "Everything in Pro",
      "1-on-1 Mentorship sessions",
      "Customized study plans",
      "Early access to new features",
      "Ad-free experience"
    ],
    buttonText: "Go Elite",
    popular: false
  }
];

export function PricingPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] overflow-hidden bg-background py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl z-10">
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
            Choose the plan that best fits your preparation needs.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`glass-card p-8 rounded-3xl relative flex flex-col ${plan.popular ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)] scale-105 z-10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-extrabold mb-4">{plan.price}</div>
              <p className="text-muted-foreground mb-8">{plan.description}</p>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular ? 'glow-button bg-foreground text-background' : 'bg-background/50 border border-white/10 hover:bg-accent hover:text-accent-foreground'}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
