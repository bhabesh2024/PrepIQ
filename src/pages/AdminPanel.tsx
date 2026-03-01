import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/firebase"; 
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, writeBatch, getCountFromServer, query, orderBy, getDoc, setDoc } from "firebase/firestore";
import { 
  LayoutDashboard, Database, AlertTriangle, Users, MessageSquare, 
  LifeBuoy, Settings, Search, Filter, MoreVertical, CheckCircle2, 
  XCircle, TrendingUp, Activity, Upload, Download, BookOpen, Edit2, Trash2
} from "lucide-react";
import { cn } from "../lib/utils";

type TabType = "analytics" | "questions" | "flagged" | "users" | "community" | "support" | "settings" | "concepts";

export function AdminPanel() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType | "concepts">("analytics");

  const [pendingFlagsCount, setPendingFlagsCount] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchFlagCount = async () => {
      try {
        const snapshot = await getDocs(collection(db, "flagged_issues"));
        const pending = snapshot.docs.filter(doc => doc.data().status !== "Resolved").length;
        setPendingFlagsCount(pending);
      } catch (error) { console.log(error); }
    };
    if (user?.role === "admin") fetchFlagCount();
  }, [activeTab, user]);

  if (loading || !user || user.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center">Loading Admin Securely...</div>;
  }

  const tabs = [
    { id: "analytics", label: "App Analytics", icon: LayoutDashboard },
    { id: "concepts", label: "Study Concepts", icon: BookOpen },
    { id: "questions", label: "Questions Database", icon: Database },
    { id: "flagged", label: "Flagged Issues", icon: AlertTriangle },
    { id: "users", label: "User Details", icon: Users },
    { id: "community", label: "Community Posts", icon: MessageSquare },
    { id: "support", label: "Help & Support", icon: LifeBuoy },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
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
                    isActive ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "text-foreground/70 hover:bg-white/5 hover:text-foreground border border-transparent"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-indigo-500" : "text-muted-foreground")} />
                  {tab.label}
                  {(tab.id === "flagged" && pendingFlagsCount > 0) && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {pendingFlagsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-x-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-muted-foreground mt-1">Manage and monitor your application backend.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder={`Search ${activeTab}...`} className="bg-background/50 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all" />
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
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

function AnalyticsView() {
  const [stats, setStats] = useState({ users: 0, questions: 0, concepts: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getCountFromServer(collection(db, "profiles"));
        const qSnap = await getCountFromServer(collection(db, "questions"));
        const cSnap = await getCountFromServer(collection(db, "concepts"));
        const rSnap = await getCountFromServer(collection(db, "flagged_issues"));

        setStats({
          users: usersSnap.data().count,
          questions: qSnap.data().count,
          concepts: cSnap.data().count,
          reports: rSnap.data().count
        });
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: loading ? "..." : stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Questions DB", value: loading ? "..." : stats.questions, icon: Database, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Study Concepts", value: loading ? "..." : stats.concepts, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Flagged Issues", value: loading ? "..." : stats.reports, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
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
      
      <div className="glass-card p-6 rounded-3xl flex flex-col items-center justify-center min-h-[300px]">
        <Activity className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-bold text-muted-foreground">More Analytics Coming Soon</h3>
        <p className="text-sm text-muted-foreground">Charts and graphs will be populated as user activity increases.</p>
      </div>
    </div>
  );
}

function FlaggedView() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "flagged_issues"), orderBy("reportedAt", "desc"));
      const snapshot = await getDocs(q);
      setIssues(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error("Error fetching flags", error); }
    setLoading(false);
  };

  useEffect(() => { fetchIssues(); }, []);

  const handleResolve = async (id: string) => {
    try {
      await updateDoc(doc(db, "flagged_issues", id), { status: "Resolved" });
      fetchIssues();
    } catch (error) { alert("Failed to resolve"); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this report?")) return;
    try {
      await deleteDoc(doc(db, "flagged_issues", id));
      fetchIssues();
    } catch (error) { alert("Failed to delete"); }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-muted-foreground">Fetching reported issues...</div>;
  if (issues.length === 0) return <div className="p-10 text-center text-muted-foreground">No issues reported yet. All good!</div>;

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div key={issue.id} className={cn("glass-card p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-start sm:items-center transition-all", issue.status === "Resolved" && "opacity-60")}>
          <div className={cn("p-4 rounded-2xl shrink-0", issue.status === "Resolved" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive")}>
            {issue.status === "Resolved" ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-lg">{issue.reason || "Reported Issue"}</h4>
              <span className="text-xs text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded">
                {issue.subject} • {issue.topic}
              </span>
            </div>
            <p className="text-foreground/80 text-sm mb-2 line-clamp-2 border-l-2 border-white/10 pl-3 italic">"{issue.questionText}"</p>
            <div className="text-xs text-muted-foreground">
              Status: <span className={issue.status === "Resolved" ? "text-emerald-400" : "text-amber-400"}>{issue.status || "Pending"}</span>
              {" • Date: " + new Date(issue.reportedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            {issue.status !== "Resolved" && (
              <button onClick={() => handleResolve(issue.id)} className="flex-1 sm:flex-none bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Mark Resolved
              </button>
            )}
            <button onClick={() => handleDelete(issue.id)} className="flex-1 sm:flex-none bg-destructive/10 text-destructive hover:bg-destructive/20 p-2 rounded-xl transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersView() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "profiles"));
        setUsersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-muted-foreground">Fetching users database...</div>;

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-medium">User Profile</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Exam Goal</th>
              <th className="px-6 py-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                      {(u.name || "U")[0]}
                    </div>
                    <div>
                      <div className="font-medium">{u.name || "Anonymous User"}</div>
                      <div className="text-xs text-muted-foreground">{u.email || "No email"}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("border px-2.5 py-1 rounded-lg text-xs font-medium", u.role === 'admin' ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-white/5 border-white/10")}>
                    {u.role || 'Student'}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{u.examGoal || "Not set"}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown"}
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
  const [subTab, setSubTab] = useState<"pending" | "create">("pending");
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [mcqQuestion, setMcqQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [isPosting, setIsPosting] = useState(false);

  const fetchPendingPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setPendingPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => p.status === "pending"));
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { if (subTab === "pending") fetchPendingPosts(); }, [subTab]);

  const handlePostApproval = async (id: string, action: "approved" | "rejected") => {
    try {
      await updateDoc(doc(db, "community_posts", id), { status: action });
      fetchPendingPosts();
    } catch (error) { alert("Action failed"); }
  };

  const handleCreateOfficialPost = async () => {
    if (!mcqQuestion.trim() || options.some(opt => !opt.trim())) {
      return alert("Please fill all fields!");
    }
    setIsPosting(true);
    try {
      await addDoc(collection(db, "community_posts"), {
        authorName: "PrepIQ",
        authorRole: "admin",
        isVerified: true, 
        type: "mcq",
        content: mcqQuestion,
        options: options,
        correctAnswer: options[correctOption],
        likes: [],
        comments: [],
        views: [],
        status: "approved",
        createdAt: new Date().toISOString()
      });
      alert("Official Post Published Successfully!");
      setMcqQuestion("");
      setOptions(["", "", "", ""]);
    } catch (error) { alert("Failed to post"); }
    setIsPosting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button onClick={() => setSubTab("pending")} className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-colors", subTab === "pending" ? "bg-indigo-500 text-white" : "bg-white/5 hover:bg-white/10 text-muted-foreground")}>
          Pending Approvals
        </button>
        <button onClick={() => setSubTab("create")} className={cn("px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2", subTab === "create" ? "bg-indigo-500 text-white" : "bg-white/5 hover:bg-white/10 text-muted-foreground")}>
          <CheckCircle2 className="w-4 h-4" /> Create Official Post
        </button>
      </div>

      {subTab === "pending" && (
        <div className="space-y-4">
          {loading ? <div className="text-center p-8 text-muted-foreground">Loading...</div> : pendingPosts.length === 0 ? <div className="text-center p-8 text-muted-foreground">No pending posts.</div> : pendingPosts.map((post) => (
            <div key={post.id} className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">{post.authorName?.[0] || "U"}</div>
                  <div>
                    <div className="font-medium">{post.authorName || "User"}</div>
                    <div className="text-xs text-muted-foreground">Posted • {new Date(post.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className="bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-lg text-xs font-semibold">Pending Review</span>
              </div>
              <p className="text-foreground/90 text-sm mb-6">{post.content}</p>
              <div className="flex gap-3">
                <button onClick={() => handlePostApproval(post.id, "approved")} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"><CheckCircle2 className="w-4 h-4" /> Approve</button>
                <button onClick={() => handlePostApproval(post.id, "rejected")} className="flex items-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"><XCircle className="w-4 h-4" /> Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {subTab === "create" && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl max-w-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-blue-500">PrepIQ</span> Official MCQ Post</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Question Text</label>
              <textarea value={mcqQuestion} onChange={e => setMcqQuestion(e.target.value)} rows={3} className="w-full bg-background/50 border border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Type your MCQ question here..." />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground block">Options (Select the correct one)</label>
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input type="radio" name="correctOpt" checked={correctOption === idx} onChange={() => setCorrectOption(idx)} className="w-5 h-5 accent-indigo-500" />
                  <input type="text" value={opt} onChange={e => { const newOpts = [...options]; newOpts[idx] = e.target.value; setOptions(newOpts); }} className="flex-1 bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder={`Option ${idx + 1}`} />
                </div>
              ))}
            </div>
            <button onClick={handleCreateOfficialPost} disabled={isPosting} className="w-full glow-button bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all mt-4">
              {isPosting ? "Publishing..." : "Publish Official Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SupportView() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "support_tickets"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setTickets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleResolve = async (id: string) => {
    try {
      await updateDoc(doc(db, "support_tickets", id), { status: "resolved" });
      fetchTickets();
    } catch (error) { alert("Failed to update"); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading tickets...</div>;

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">No Active Support Tickets</h3>
          <p className="text-muted-foreground max-w-md">All user inquiries have been resolved!</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className={cn("glass-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between gap-4", ticket.status === "resolved" && "opacity-60")}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{ticket.subject || "Support Query"}</h4>
                <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", ticket.status === "resolved" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                  {ticket.status || "Open"}
                </span>
              </div>
              <p className="text-sm text-foreground/80 mb-2">{ticket.message}</p>
              <div className="text-xs text-muted-foreground">From: {ticket.userEmail} • {new Date(ticket.createdAt).toLocaleDateString()}</div>
            </div>
            {ticket.status !== "resolved" && (
              <button onClick={() => handleResolve(ticket.id)} className="self-start sm:self-center shrink-0 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                Mark Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function SettingsView() {
  const [config, setConfig] = useState({ maintenanceMode: false, allowRegistrations: true });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, "config", "global_settings");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as any);
        } else {
          await setDoc(docRef, config);
        }
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const toggleSetting = async (field: keyof typeof config) => {
    const newVal = !config[field];
    setConfig(prev => ({ ...prev, [field]: newVal }));
    try {
      await updateDoc(doc(db, "config", "global_settings"), { [field]: newVal });
    } catch (error) { alert("Failed to update setting"); }
  };

  const handleClearCache = () => {
    if(window.confirm("Are you sure? This will clear local storage and reload the app.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-6">General Settings</h3>
        <div className="space-y-6 max-w-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Maintenance Mode</h4>
              <p className="text-sm text-muted-foreground">Show 'App under maintenance' to users.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
          <div className="border-t border-white/10 pt-6 flex items-center justify-between">
            <div>
              <h4 className="font-medium">Allow New Registrations</h4>
              <p className="text-sm text-muted-foreground">Enable or disable new user signups.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={config.allowRegistrations} onChange={() => toggleSetting('allowRegistrations')} className="sr-only peer" />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-destructive/20">
        <h3 className="text-xl font-bold mb-2 text-destructive flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-6">Irreversible actions for the application.</p>
        <button onClick={handleClearCache} className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          Clear Cache & Restart
        </button>
      </div>
    </div>
  );
}

function QuestionsView() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      const qData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setQuestions(qData);
    } catch (error) { console.error(error); }
    setLoading(false);
  };
  useEffect(() => { fetchQuestions(); }, []);

  const uniqueTopics = ["All", ...Array.from(new Set(questions.map(q => q.chapterId || q.topic))).filter(Boolean)];
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question?.toLowerCase().includes(searchQuery.toLowerCase()) || q.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === "All" || q.chapterId === topicFilter || q.topic === topicFilter;
    return matchesSearch && matchesTopic;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? setSelectedIds(filteredQuestions.map(q => q.id)) : setSelectedIds([]);
  const handleSelectOne = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0 || !window.confirm(`Permanently delete ${selectedIds.length} questions?`)) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => batch.delete(doc(db, "questions", id)));
      await batch.commit();
      alert(`Successfully deleted!`);
      setSelectedIds([]);
      fetchQuestions();
    } catch (error) { alert("Failed to delete."); }
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
        questionsArray.forEach((q) => batch.set(doc(collection(db, "questions")), q));
        await batch.commit();
        alert(`Successfully uploaded ${questionsArray.length} questions!`);
        fetchQuestions(); 
      } catch (error) { alert("Upload Failed!"); }
    };
    reader.readAsText(file);
  };

  const handleDownloadJSON = () => {
    const dataToExport = selectedIds.length > 0 ? questions.filter(q => selectedIds.includes(q.id)) : questions;
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
      <div className="p-6 border-b border-white/10 flex flex-col gap-4 bg-background/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            Question Bank <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">{questions.length}</span>
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {selectedIds.length > 0 && (
              <button onClick={handleBulkDelete} className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 px-4 py-2 rounded-xl text-sm font-semibold"><Trash2 className="w-4 h-4" /> Delete</button>
            )}
            <button onClick={handleDownloadJSON} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm font-semibold"><Download className="w-4 h-4" /> Download</button>
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="glow-button flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-semibold"><Upload className="w-4 h-4" /> Upload JSON</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-background/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          <select value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} className="bg-background/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-48">
            {uniqueTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        {loading ? <div className="p-8 text-center text-muted-foreground animate-pulse">Loading data...</div> : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-background/50 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
              <tr><th className="px-6 py-4 w-10"><input type="checkbox" onChange={handleSelectAll} checked={filteredQuestions.length > 0 && selectedIds.length === filteredQuestions.length} /></th><th className="px-6 py-4">Topic</th><th className="px-6 py-4">Preview</th><th className="px-6 py-4">Diff</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className={cn("transition-colors", selectedIds.includes(q.id) ? "bg-indigo-500/5" : "hover:bg-white/5")}>
                  <td className="px-6 py-4"><input type="checkbox" checked={selectedIds.includes(q.id)} onChange={() => handleSelectOne(q.id)} /></td>
                  <td className="px-6 py-4"><div className="font-medium">{q.subject}</div><div className="text-xs text-muted-foreground">{q.chapterId}</div></td>
                  <td className="px-6 py-4"><div className="line-clamp-2 max-w-md">{q.question}</div></td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-lg text-xs bg-white/10">{q.difficulty || "Medium"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
    } catch (error) { console.error(error); }
    setLoading(false);
  };
  useEffect(() => { fetchConcepts(); }, []);

  const uniqueTopics = ["All", ...Array.from(new Set(concepts.map(c => c.chapterId))).filter(Boolean)];
  const filteredConcepts = concepts.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = topicFilter === "All" || c.chapterId === topicFilter;
    return matchesSearch && matchesTopic;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => e.target.checked ? setSelectedIds(filteredConcepts.map(c => c.id)) : setSelectedIds([]);
  const handleSelectOne = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0 || !window.confirm(`Delete ${selectedIds.length} concepts?`)) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach(id => batch.delete(doc(db, "concepts", id)));
      await batch.commit();
      setSelectedIds([]);
      fetchConcepts();
    } catch (error) { alert("Failed to delete"); }
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        const array = Array.isArray(jsonData) ? jsonData : [jsonData]; 
        const batch = writeBatch(db);
        array.forEach((c) => batch.set(doc(collection(db, "concepts")), c));
        await batch.commit();
        fetchConcepts(); 
      } catch (error) { alert("Upload Failed"); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex flex-col gap-4 bg-background/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">Study Concepts</h3>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && <button onClick={handleBulkDelete} className="bg-destructive/10 text-destructive px-4 py-2 rounded-xl text-sm font-semibold">Delete</button>}
            <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="bg-foreground text-background px-4 py-2 rounded-xl text-sm font-semibold">Upload JSON</button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto max-h-[600px]">
        {loading ? <div className="p-8 text-center">Loading...</div> : (
          <table className="w-full text-sm text-left">
            <thead className="bg-background/50 border-b border-white/10 sticky top-0">
              <tr><th className="px-6 py-4 w-10"><input type="checkbox" onChange={handleSelectAll} checked={filteredConcepts.length > 0 && selectedIds.length === filteredConcepts.length} /></th><th className="px-6 py-4">Chapter</th><th className="px-6 py-4">Title</th></tr>
            </thead>
            <tbody>
              {filteredConcepts.map((c) => (
                <tr key={c.id} className={selectedIds.includes(c.id) ? "bg-white/10" : ""}>
                  <td className="px-6 py-4"><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => handleSelectOne(c.id)} /></td>
                  <td className="px-6 py-4">{c.chapterId}</td>
                  <td className="px-6 py-4">{c.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}