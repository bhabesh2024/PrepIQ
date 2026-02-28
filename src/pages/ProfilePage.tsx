import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  Activity, 
  Bookmark, 
  ShoppingBag, 
  LifeBuoy, 
  LogOut,
  Edit3,
  Smartphone,
  Lock,
  Trash2,
  Share2,
  Star,
  FileText,
  ShieldAlert,
  Type,
  Send,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Info
} from "lucide-react";
import { cn } from "../lib/utils";

type TabType = "performance" | "edit-profile" | "saved-items" | "my-orders" | "pricing" | "support" | "settings";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("performance");
  const [showMobileMenu, setShowMobileMenu] = useState(true);

  // Reset to menu on resize to mobile, or content on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      } else {
        setShowMobileMenu(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const tabs = [
    { id: "performance", label: "Performance", icon: Activity },
    { id: "edit-profile", label: "Edit Profile", icon: Edit3 },
    { id: "saved-items", label: "Saved Items", icon: Bookmark },
    { id: "my-orders", label: "My Orders", icon: ShoppingBag },
    { id: "pricing", label: "Pricing & Plans", icon: CreditCard },
    { id: "support", label: "Support", icon: LifeBuoy },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  // --- Mobile Menu View ---
  const renderMobileMenu = () => (
    <div className="md:hidden flex flex-col w-full pb-20">
      <div className="p-6 flex items-center gap-4 border-b border-white/10 bg-background/50 backdrop-blur-xl sticky top-16 z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="overflow-hidden">
          <h2 className="font-bold text-xl truncate">{user.name}</h2>
          <p className="text-sm text-muted-foreground truncate">{user.email || "user@example.com"}</p>
        </div>
      </div>
      <div className="p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "pricing") {
                navigate("/pricing");
              } else {
                setActiveTab(tab.id as TabType);
                setShowMobileMenu(false);
              }
            }}
            className="w-full flex items-center justify-between p-4 glass-card rounded-2xl hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <tab.icon className="w-5 h-5" />
              </div>
              <span className="font-medium">{tab.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-between p-4 glass-card rounded-2xl mt-6 border-destructive/20 hover:bg-destructive/5 transition-colors"
        >
          <div className="flex items-center gap-4 text-destructive">
            <div className="p-2 rounded-xl bg-destructive/10">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );

  // --- Mobile Content View ---
  const renderMobileContent = () => (
    <div className="md:hidden flex flex-col w-full pb-20">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 sticky top-16 bg-background/80 backdrop-blur-xl z-40">
        <button 
          onClick={() => setShowMobileMenu(true)} 
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg">{tabs.find(t => t.id === activeTab)?.label}</h2>
      </div>
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "performance" && <PerformanceView />}
            {activeTab === "edit-profile" && <EditProfileView user={user} />}
            {activeTab === "saved-items" && <SavedItemsView />}
            {activeTab === "my-orders" && <MyOrdersView />}
            {activeTab === "support" && <SupportView />}
            {activeTab === "settings" && <SettingsView logout={logout} navigate={navigate} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Mobile View */}
      {showMobileMenu ? renderMobileMenu() : renderMobileContent()}

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-background/50 backdrop-blur-xl hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-lg truncate">{user.name}</h2>
              <p className="text-xs text-muted-foreground truncate">{user.email || "user@example.com"}</p>
            </div>
          </div>

          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Account</h3>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === "pricing") {
                      navigate("/pricing");
                    } else {
                      setActiveTab(tab.id as TabType);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                      : "text-foreground/70 hover:bg-white/5 hover:text-foreground border border-transparent"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-indigo-500" : "text-muted-foreground")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-destructive hover:bg-destructive/10 border border-transparent"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop Main Content */}
      <main className="hidden md:block flex-1 p-6 md:p-8 overflow-x-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "performance" && <PerformanceView />}
              {activeTab === "edit-profile" && <EditProfileView user={user} />}
              {activeTab === "saved-items" && <SavedItemsView />}
              {activeTab === "my-orders" && <MyOrdersView />}
              {activeTab === "support" && <SupportView />}
              {activeTab === "settings" && <SettingsView logout={logout} navigate={navigate} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub Views ---

function PerformanceView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Tests Taken", value: "12", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Average Score", value: "78%", icon: Star, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Questions Solved", value: "450", icon: Bookmark, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:blur-xl transition-all`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-muted-foreground font-medium mb-1 relative z-10">{stat.label}</h3>
            <div className="text-3xl font-bold text-foreground relative z-10">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-8 rounded-3xl min-h-[300px] flex flex-col items-center justify-center text-center">
        <Activity className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="text-xl font-bold mb-2">Detailed Analytics Coming Soon</h3>
        <p className="text-muted-foreground max-w-md">We are working on bringing you comprehensive charts and insights about your learning journey.</p>
      </div>
    </div>
  );
}

function EditProfileView({ user }: { user: any }) {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-500" /> Personal Information
        </h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <input
              type="email"
              defaultValue={user.email || "user@example.com"}
              disabled
              className="w-full rounded-xl border-0 py-2.5 text-muted-foreground ring-1 ring-inset ring-white/10 bg-background/30 px-4 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Smartphone className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                type="tel"
                placeholder="+91 9876543210"
                className="w-full rounded-xl border-0 py-2.5 pl-10 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
              />
            </div>
          </div>
          <button className="glow-button mt-4 w-full sm:w-auto bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-semibold">
            Save Changes
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-500" /> Change Password
        </h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
            <input
              type="password"
              className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
            <input
              type="password"
              className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
            />
          </div>
          <button className="bg-background/50 border border-white/10 hover:bg-white/5 text-foreground px-6 py-2.5 w-full sm:w-auto rounded-xl text-sm font-semibold transition-colors mt-2">
            Update Password
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border-amber-500/20">
        <h3 className="text-xl font-bold mb-2 text-amber-500">App Data</h3>
        <p className="text-sm text-muted-foreground mb-6">Clear cached data to free up space or resolve issues.</p>
        <button className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 px-4 py-2 w-full sm:w-auto rounded-xl text-sm font-semibold transition-colors">
          Clear Cache
        </button>
      </div>
    </div>
  );
}

function SavedItemsView() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between group">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded text-xs font-semibold">Mathematics</span>
              <span className="text-xs text-muted-foreground">Saved 2 days ago</span>
            </div>
            <h4 className="font-semibold text-lg">Important Algebra Formula Sheet</h4>
            <p className="text-sm text-muted-foreground mt-1">Quick revision notes for quadratic equations and polynomials.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none glow-button bg-foreground text-background px-4 py-2 rounded-xl text-sm font-semibold">
              View
            </button>
            <button className="p-2 rounded-xl border border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyOrdersView() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Plan</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-mono text-muted-foreground">#ORD-98234</td>
              <td className="px-6 py-4 font-medium">Pro Plan (Monthly)</td>
              <td className="px-6 py-4 text-muted-foreground">Oct 24, 2023</td>
              <td className="px-6 py-4 font-medium">₹499</td>
              <td className="px-6 py-4">
                <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  Active
                </span>
              </td>
            </tr>
            <tr className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 font-mono text-muted-foreground">#ORD-87123</td>
              <td className="px-6 py-4 font-medium">Basic Plan</td>
              <td className="px-6 py-4 text-muted-foreground">Sep 10, 2023</td>
              <td className="px-6 py-4 font-medium">Free</td>
              <td className="px-6 py-4">
                <span className="bg-white/5 text-muted-foreground px-2.5 py-1 rounded-lg text-xs font-semibold">
                  Expired
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupportView() {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
            <LifeBuoy className="w-8 h-8 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">How can we help?</h3>
          <p className="text-muted-foreground">Raise a ticket and our support team will get back to you within 24 hours.</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
            <input
              type="text"
              placeholder="E.g., Payment issue, Bug report"
              className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              rows={5}
              placeholder="Describe your issue in detail..."
              className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all resize-none"
            />
          </div>
          <button type="button" className="glow-button w-full flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl text-sm font-semibold mt-4">
            <Send className="w-4 h-4" /> Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}

function SettingsView({ logout, navigate }: { logout: () => void, navigate: any }) {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-6">App Preferences</h3>
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5"><Type className="w-5 h-5 text-muted-foreground" /></div>
              <div>
                <h4 className="font-medium">Font Size</h4>
                <p className="text-sm text-muted-foreground hidden sm:block">Adjust the text size for better readability.</p>
              </div>
            </div>
            <select className="bg-background/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Small</option>
              <option selected>Medium</option>
              <option>Large</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-6">About & Legal</h3>
        <div className="space-y-2 max-w-2xl">
          <button onClick={() => navigate('/about')} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-400" />
              <span className="font-medium">About PrepIQ</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-indigo-500" />
              <span className="font-medium">Share App</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="font-medium">Rate Us</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">Privacy Policy</span>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Terms and Conditions</span>
            </div>
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-destructive/20">
        <h3 className="text-xl font-bold mb-2 text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 px-4 py-2 w-full sm:w-auto rounded-xl text-sm font-semibold transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
