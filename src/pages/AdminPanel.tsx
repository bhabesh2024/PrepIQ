import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/firebase"; // Firebase import kiya
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { 
  LayoutDashboard, 
  Database, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  LifeBuoy, 
  Settings, 
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
  Upload, Download, BookOpen, Edit2,
  Trash2
} from "lucide-react";
import { cn } from "../lib/utils";
type TabType = "analytics" | "questions" | "flagged" | "users" | "community" | "support" | "settings" | "concepts";

export function AdminPanel() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // Naya 'concepts' tab add kiya
  const [activeTab, setActiveTab] = useState<TabType | "concepts">("analytics");

  // --- SECURITY LOGIC ---
  useEffect(() => {
    // Agar loading khatam ho gayi, user nahi hai, ya user admin nahi hai, toh Home pe bhej do
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin Securely...</div>;
  }

  const tabs = [
    { id: "analytics", label: "App Analytics", icon: LayoutDashboard },
    { id: "concepts", label: "Study Concepts", icon: BookOpen }, // NAYA TAB
    { id: "questions", label: "Questions Database", icon: Database },
    { id: "flagged", label: "Flagged Issues", icon: AlertTriangle },
    { id: "users", label: "User Details", icon: Users },
    { id: "community", label: "Community Posts", icon: MessageSquare },
    { id: "support", label: "Help & Support", icon: LifeBuoy },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-background/50 backdrop-blur-xl hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Admin Controls</h2>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                      : "text-foreground/70 hover:bg-white/5 hover:text-foreground border border-transparent"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-indigo-500" : "text-muted-foreground")} />
                  {tab.label}
                  {tab.id === "flagged" && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                      14
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-muted-foreground mt-1">Manage and monitor your application.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search admin..." 
                  className="bg-background/50 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all"
                />
              </div>
              <button className="glass-card p-2 rounded-full hover:bg-white/10 transition-colors">
                <Filter className="w-5 h-5 text-foreground/70" />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "analytics" && <AnalyticsView />}
              {activeTab === "questions" && <QuestionsView />}
              {activeTab === "flagged" && <FlaggedView />}
              {activeTab === "users" && <UsersView />}
              {activeTab === "community" && <CommunityView />}
              {activeTab === "support" && <SupportView />}
              {activeTab === "settings" && <SettingsView />}
              {activeTab === "concepts" && <ConceptsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub Views ---

function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: "12,450", change: "+12%", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Tests", value: "842", change: "+5%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Questions Solved", value: "1.2M", change: "+18%", icon: Database, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Revenue", value: "₹4.2L", change: "+24%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl group-hover:blur-xl transition-all`} />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-emerald-500 text-sm font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <h3 className="text-muted-foreground font-medium mb-1 relative z-10">{stat.label}</h3>
            <div className="text-3xl font-bold text-foreground relative z-10">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl min-h-[300px] flex flex-col">
          <h3 className="font-semibold text-lg mb-4">User Growth</h3>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-background/30">
            <span className="text-muted-foreground">Chart Placeholder (Use Recharts here)</span>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl min-h-[300px] flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <div>
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">{i * 10} mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionsView() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- NAYE STATES (Search, Filter, Select) ---
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const qData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(qData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  // --- FILTER & SEARCH LOGIC ---
  const uniqueTopics = ["All", ...Array.from(new Set(questions.map(q => q.chapterId || q.topic))).filter(Boolean)];
  
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === "All" || q.chapterId === topicFilter || q.topic === topicFilter;
    return matchesSearch && matchesTopic;
  });

  // --- SELECTION LOGIC ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Sirf filter kiye hue questions ko select karo
      setSelectedIds(filteredQuestions.map(q => q.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // --- BULK DELETE LOGIC ---
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = `Are you sure you want to permanently delete ${selectedIds.length} questions?`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => {
        batch.delete(doc(db, "questions", id));
      });
      await batch.commit();
      
      alert(`Successfully deleted ${selectedIds.length} items!`);
      setSelectedIds([]);
      fetchQuestions(); // Refresh data
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete items.");
    }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const questionsArray = Array.isArray(jsonData) ? jsonData : [jsonData]; 
        const batch = writeBatch(db);
        questionsArray.forEach((q) => {
          batch.set(doc(collection(db, "questions")), q);
        });
        await batch.commit();
        alert(`Successfully uploaded ${questionsArray.length} questions!`);
        fetchQuestions(); 
      } catch (error) {
        alert("Invalid JSON format or Upload Failed!");
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadJSON = () => {
    // Agar kuch select kiya hai, toh sirf selected download hoga, warna sab kuch
    const dataToExport = selectedIds.length > 0 
      ? questions.filter(q => selectedIds.includes(q.id))
      : questions;
      
    const exportData = dataToExport.map(({ id, ...rest }) => rest);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "prepiq_questions_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      {/* Top Action Bar */}
      <div className="p-6 border-b border-white/10 flex flex-col gap-4 bg-background/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Question Bank <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">{questions.length} Total</span>
          </h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {selectedIds.length > 0 && (
              <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
              </button>
            )}
            <button onClick={handleDownloadJSON} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              <Download className="w-4 h-4" /> {selectedIds.length > 0 ? "Download Selected" : "Download All"}
            </button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="glow-button flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-semibold">
              <Upload className="w-4 h-4" /> Upload JSON
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search questions or subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <select 
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-48 transition-all"
          >
            {uniqueTopics.map(topic => (
              <option key={topic} value={topic}>{topic === "All" ? "All Topics" : topic}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading data...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No questions found matching your criteria.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-medium w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/20 bg-background/50 text-indigo-500 focus:ring-indigo-500"
                    onChange={handleSelectAll}
                    checked={filteredQuestions.length > 0 && selectedIds.length === filteredQuestions.length}
                  />
                </th>
                <th className="px-6 py-4 font-medium">Subject & Topic</th>
                <th className="px-6 py-4 font-medium">Question Preview</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className={cn("transition-colors", selectedIds.includes(q.id) ? "bg-indigo-500/5" : "hover:bg-white/5")}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/20 bg-background/50 text-indigo-500 focus:ring-indigo-500"
                      checked={selectedIds.includes(q.id)}
                      onChange={() => handleSelectOne(q.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{q.subject}</div>
                    <div className="text-xs text-muted-foreground">{q.chapterId || q.topic} {q.subtopic ? `- ${q.subtopic}` : ''}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="line-clamp-2 max-w-md">{q.question}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold",
                      q.difficulty === 'Easy' ? "bg-emerald-500/10 text-emerald-500" :
                      q.difficulty === 'Hard' ? "bg-destructive/10 text-destructive" :
                      "bg-amber-500/10 text-amber-500"
                    )}>{q.difficulty || "Medium"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function FlaggedView() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="p-4 rounded-2xl bg-destructive/10 text-destructive shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-lg">Incorrect Answer Key</h4>
              <span className="text-xs text-muted-foreground font-mono">#Q1042</span>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Reported by 3 users. The correct option should be B instead of C according to the latest NCERT syllabus.</p>
            <div className="text-xs text-muted-foreground">Reported 2 hours ago</div>
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              Resolve
            </button>
            <button className="flex-1 sm:flex-none bg-background/50 border border-white/10 hover:bg-white/5 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersView() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      U{i}
                    </div>
                    <div>
                      <div className="font-medium">User {i}</div>
                      <div className="text-xs text-muted-foreground">user{i}@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium">
                    Student
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">Oct 24, 2023</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommunityView() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <div className="font-medium">Aspirant123</div>
                <div className="text-xs text-muted-foreground">Posted in General Discussion • 1h ago</div>
              </div>
            </div>
            <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg text-xs font-semibold">
              Pending Review
            </span>
          </div>
          <h4 className="font-semibold text-lg mb-2">Tips for time management in Quant?</h4>
          <p className="text-muted-foreground text-sm mb-6">I always run out of time during the quantitative section. Any strategies on which questions to skip and which to attempt first?</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <CheckCircle2 className="w-4 h-4" /> Approve
            </button>
            <button className="flex items-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              <XCircle className="w-4 h-4" /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SupportView() {
  return (
    <div className="glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
        <LifeBuoy className="w-8 h-8 text-indigo-500" />
      </div>
      <h3 className="text-xl font-bold mb-2">No Active Support Tickets</h3>
      <p className="text-muted-foreground max-w-md">All user inquiries have been resolved. Great job keeping the community happy!</p>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-6">General Settings</h3>
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Maintenance Mode</h4>
              <p className="text-sm text-muted-foreground">Disable access to the app for all non-admin users.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <div>
              <h4 className="font-medium">Allow New Registrations</h4>
              <p className="text-sm text-muted-foreground">Enable or disable new user signups.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-destructive/20">
        <h3 className="text-xl font-bold mb-2 text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-6">Irreversible actions for the application.</p>
        <button className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          Clear Cache & Restart
        </button>
      </div>
    </div>
  );
}

function ConceptsView() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchConcepts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "concepts"));
      const cData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConcepts(cData);
    } catch (error) { console.error("Error fetching concepts:", error); }
    setLoading(false);
  };

  useEffect(() => { fetchConcepts(); }, []);

  const uniqueTopics = ["All", ...Array.from(new Set(concepts.map(c => c.chapterId))).filter(Boolean)];
  
  const filteredConcepts = concepts.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === "All" || c.chapterId === topicFilter;
    return matchesSearch && matchesTopic;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredConcepts.map(c => c.id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} concepts?`)) return;

    setLoading(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => {
        batch.delete(doc(db, "concepts", id));
      });
      await batch.commit();
      alert(`Successfully deleted ${selectedIds.length} concepts!`);
      setSelectedIds([]);
      fetchConcepts();
    } catch (error) { alert("Failed to delete items."); }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const conceptsArray = Array.isArray(jsonData) ? jsonData : [jsonData]; 
        const batch = writeBatch(db);
        conceptsArray.forEach((c) => {
          batch.set(doc(collection(db, "concepts")), c);
        });
        await batch.commit();
        alert(`Successfully uploaded ${conceptsArray.length} concepts!`);
        fetchConcepts(); 
      } catch (error) { alert("Invalid JSON format or Upload Failed!"); }
    };
    reader.readAsText(file);
  };

  const handleDownloadJSON = () => {
    const dataToExport = selectedIds.length > 0 
      ? concepts.filter(c => selectedIds.includes(c.id))
      : concepts;
    const exportData = dataToExport.map(({ id, ...rest }) => rest);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "prepiq_concepts_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex flex-col gap-4 bg-background/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Study Concepts <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">{concepts.length} Total</span>
          </h3>
          
          <div className="flex flex-wrap items-center gap-3">
            {selectedIds.length > 0 && (
              <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <Trash2 className="w-4 h-4" /> Delete ({selectedIds.length})
              </button>
            )}
            <button onClick={handleDownloadJSON} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
              <Download className="w-4 h-4" /> {selectedIds.length > 0 ? "Download Selected" : "Download All"}
            </button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="glow-button flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-semibold">
              <Upload className="w-4 h-4" /> Upload JSON
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search concepts or subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <select 
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-48 transition-all"
          >
            {uniqueTopics.map(topic => (
              <option key={topic} value={topic}>{topic === "All" ? "All Topics" : topic}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Loading data...</div>
        ) : filteredConcepts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No concepts found matching your criteria.</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 font-medium w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/20 bg-background/50 text-indigo-500 focus:ring-indigo-500"
                    onChange={handleSelectAll}
                    checked={filteredConcepts.length > 0 && selectedIds.length === filteredConcepts.length}
                  />
                </th>
                <th className="px-6 py-4 font-medium">Subject & Chapter</th>
                <th className="px-6 py-4 font-medium">Concept Title</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredConcepts.map((c) => (
                <tr key={c.id} className={cn("transition-colors", selectedIds.includes(c.id) ? "bg-indigo-500/5" : "hover:bg-white/5")}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/20 bg-background/50 text-indigo-500 focus:ring-indigo-500"
                      checked={selectedIds.includes(c.id)}
                      onChange={() => handleSelectOne(c.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{c.subject}</div>
                    <div className="text-xs text-muted-foreground">{c.chapterId}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-indigo-400">
                    {c.title}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
