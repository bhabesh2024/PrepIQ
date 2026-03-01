import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../lib/firebase";
import { deleteUser, updatePassword } from "firebase/auth";
import { doc, deleteDoc, getDoc, updateDoc, collection, query, orderBy, getDocs, arrayUnion, arrayRemove, addDoc, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Settings, Activity, Bookmark, ShoppingBag, LifeBuoy, LogOut,
  Edit3, Smartphone, Lock, Trash2, Share2, Star, FileText, ShieldAlert,
  Type, Send, ChevronRight, ChevronLeft, CreditCard, Info, AlertTriangle, X,
  Users, MessageSquare, Heart, Eye, ShieldCheck, CheckCircle, Phone, GraduationCap
} from "lucide-react";
import { cn } from "../lib/utils";

type TabType = "performance" | "community" | "edit-profile" | "saved-items" | "my-orders" | "pricing" | "support" | "settings";

// ==========================================
// 1. UPDATED COMMUNITY POST COMPONENT
// ==========================================
const CommunityPost = ({ post, currentUser, onUpdate }: { post: any, currentUser: any, onUpdate: () => void }) => {
  const postRef = useRef<HTMLDivElement>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Comments ke liye naye states
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isLiked = post.likes?.includes(currentUser?.uid);
  const isSaved = post.savedBy?.includes(currentUser?.uid);
  const viewCount = post.views?.length || 0;
  const likeCount = post.likes?.length || 0;

  // UNIQUE VIEW COUNT LOGIC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentUser && !post.views?.includes(currentUser.uid)) {
          updateDoc(doc(db, "community_posts", post.id), {
            views: arrayUnion(currentUser.uid)
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (postRef.current) observer.observe(postRef.current);
    return () => observer.disconnect();
  }, [post, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return;
    const postDoc = doc(db, "community_posts", post.id);
    if (isLiked) await updateDoc(postDoc, { likes: arrayRemove(currentUser.uid) });
    else await updateDoc(postDoc, { likes: arrayUnion(currentUser.uid) });
    onUpdate();
  };

  const handleSave = async () => {
    if (!currentUser) return;
    const postDoc = doc(db, "community_posts", post.id);
    if (isSaved) await updateDoc(postDoc, { savedBy: arrayRemove(currentUser.uid) });
    else await updateDoc(postDoc, { savedBy: arrayUnion(currentUser.uid) });
    onUpdate();
  };

  const handleShare = () => {
    const text = `Check out this post on PrepIQ: ${post.content}`;
    if (navigator.share) navigator.share({ title: 'PrepIQ Community', text });
    else { navigator.clipboard.writeText(text); alert("Link copied!"); }
  };

  // NAYA FUNCTION: Comment add karne ke liye
  const handleAddComment = async () => {
    if (!commentText.trim() || !currentUser) return;
    setIsSubmittingComment(true);
    try {
      const newComment = {
        id: Date.now().toString(),
        text: commentText,
        authorId: currentUser.uid,
        authorName: currentUser.name || "Student",
        createdAt: new Date().toISOString()
      };
      await updateDoc(doc(db, "community_posts", post.id), {
        comments: arrayUnion(newComment)
      });
      setCommentText(""); // Clear input
      onUpdate(); // UI refresh
    } catch (error) {
      alert("Failed to post comment.");
    }
    setIsSubmittingComment(false);
  };

  return (
    <div ref={postRef} className="glass-card p-5 sm:p-6 rounded-3xl mb-6 shadow-sm border border-white/5 relative overflow-hidden">
      {post.isVerified && <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />}
      
      {/* Header with Graduation Cap & Blue Tick */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn("w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner", post.isVerified ? "bg-gradient-to-br from-blue-600 to-indigo-700" : "bg-gradient-to-br from-indigo-500 to-purple-500")}>
            {post.isVerified ? <GraduationCap className="w-6 h-6" /> : (post.authorName?.[0] || "U")}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-foreground text-[15px]">{post.authorName || "User"}</h4>
              {post.isVerified && <ShieldCheck className="w-4.5 h-4.5 text-blue-500" fill="currentColor" />}
            </div>
            <div className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        {post.type === "mcq" && (
          <span className="bg-indigo-500/10 text-indigo-500 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border border-indigo-500/20">MCQ Quiz</span>
        )}
      </div>

      <div className="mb-6 relative z-10">
        <p className="text-foreground/90 leading-relaxed font-medium mb-5">{post.content}</p>
        
        {/* MCQ Options with HIGH VISIBILITY */}
        {post.type === "mcq" && post.options && (
          <div className="space-y-3">
            {post.options.map((opt: string, idx: number) => {
              if (!opt) return null;
              const isCorrect = opt === post.correctAnswer;
              const isSelected = selectedOption === opt;
              
              // Base design abhi zayda clear aur visible hai
              let bgClass = "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5";
              
              if (hasVoted) {
                if (isCorrect) bgClass = "bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm";
                else if (isSelected && !isCorrect) bgClass = "bg-rose-500/10 border-rose-500/50 text-rose-600 dark:text-rose-400 shadow-sm";
                else bgClass = "bg-black/5 dark:bg-white/5 opacity-50 border-transparent";
              }

              return (
                <button
                  key={idx}
                  disabled={hasVoted}
                  onClick={() => { setHasVoted(true); setSelectedOption(opt); }}
                  className={cn("w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between", bgClass)}
                >
                  <span className="font-medium text-[15px]">{opt}</span>
                  {hasVoted && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10 text-muted-foreground relative z-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={handleLike} className={cn("flex items-center gap-1.5 transition-colors text-sm font-medium", isLiked ? "text-rose-500" : "hover:text-rose-400")}>
            <Heart className={cn("w-5 h-5", isLiked && "fill-current")} /> {likeCount > 0 && likeCount}
          </button>
          
          {/* COMMENT TOGGLE BUTTON */}
          <button onClick={() => setShowComments(!showComments)} className={cn("flex items-center gap-1.5 transition-colors text-sm font-medium hover:text-blue-500", showComments && "text-blue-500")}>
            <MessageSquare className={cn("w-5 h-5", showComments && "fill-current opacity-20")} /> {post.comments?.length || 0}
          </button>
          
          <button onClick={handleShare} className="flex items-center gap-1.5 transition-colors text-sm font-medium hover:text-emerald-500">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className={cn("transition-colors", isSaved ? "text-amber-500" : "hover:text-amber-400")}>
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
          </button>
          <div className="flex items-center gap-1.5 text-sm font-medium bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
            <Eye className="w-4 h-4 text-indigo-500" /> {viewCount}
          </div>
        </div>
      </div>

      {/* NEW SECTION: COMMENTS SYSTEM */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-5 mt-4 border-t border-black/5 dark:border-white/10 relative z-10">
              
              {/* Display Comments */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {(!post.comments || post.comments.length === 0) ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No comments yet. Start the discussion!</p>
                ) : (
                  post.comments.map((c: any, i: number) => (
                    <div key={i} className="bg-black/5 dark:bg-white/5 p-3.5 rounded-2xl text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-foreground">{c.authorName}</span>
                        <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-foreground/90">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
              
              {/* Add Comment Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your thoughts..."
                  className="flex-1 bg-background/50 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                  onClick={handleAddComment} 
                  disabled={isSubmittingComment || !commentText.trim()} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 2. MAIN PROFILE PAGE
// ==========================================
export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("performance");
  const [showMobileMenu, setShowMobileMenu] = useState(true);

  useEffect(() => {
    const handleResize = () => setShowMobileMenu(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return <Navigate to="/auth" replace />;

  const tabs = [
    { id: "performance", label: "Performance", icon: Activity },
    { id: "community", label: "Community Feed", icon: Users },
    { id: "edit-profile", label: "Edit Profile", icon: Edit3 },
    { id: "saved-items", label: "Saved Items", icon: Bookmark },
    { id: "my-orders", label: "My Orders", icon: ShoppingBag },
    { id: "pricing", label: "Pricing & Plans", icon: CreditCard },
    { id: "support", label: "Support", icon: LifeBuoy },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

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
              if (tab.id === "pricing") navigate("/pricing");
              else { setActiveTab(tab.id as TabType); setShowMobileMenu(false); }
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

  const renderMobileContent = () => (
    <div className="md:hidden flex flex-col w-full pb-20">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 sticky top-16 bg-background/80 backdrop-blur-xl z-40">
        <button onClick={() => setShowMobileMenu(true)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg">{tabs.find(t => t.id === activeTab)?.label}</h2>
      </div>
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {activeTab === "performance" && <PerformanceView />}
            {activeTab === "community" && <CommunityView user={user} />}
            {activeTab === "edit-profile" && <EditProfileView user={user} />}
            {activeTab === "saved-items" && <SavedItemsView />}
            {activeTab === "my-orders" && <MyOrdersView user={user} />}
            {activeTab === "support" && <SupportView />}
            {activeTab === "settings" && <SettingsView logout={logout} navigate={navigate} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {showMobileMenu ? renderMobileMenu() : renderMobileContent()}

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
                    if (tab.id === "pricing") navigate("/pricing");
                    else setActiveTab(tab.id as TabType);
                  }}
                  className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200", isActive ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]" : "text-foreground/70 hover:bg-white/5 hover:text-foreground border border-transparent")}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-indigo-500" : "text-muted-foreground")} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-6 border-t border-white/10">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-destructive hover:bg-destructive/10 border border-transparent">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="hidden md:block flex-1 p-6 md:p-8 overflow-x-hidden relative">
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
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === "performance" && <PerformanceView />}
              {activeTab === "community" && <CommunityView user={user} />}
              {activeTab === "edit-profile" && <EditProfileView user={user} />}
              {activeTab === "saved-items" && <SavedItemsView />}
              {activeTab === "my-orders" && <MyOrdersView user={user} />}
              {activeTab === "support" && <SupportView />}
              {activeTab === "settings" && <SettingsView logout={logout} navigate={navigate} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 3. SUB VIEWS
// ==========================================

function CommunityView({ user }: { user: any }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((p: any) => p.status === "approved"));
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "community_posts"), {
        authorName: user?.name || "Student",
        authorRole: "student",
        isVerified: false, 
        type: "text",
        content: newPostContent,
        likes: [],
        comments: [],
        views: [],
        status: "pending", 
        createdAt: new Date().toISOString()
      });
      alert("Your post has been submitted! It will appear in the feed once approved by an Admin.");
      setNewPostContent(""); 
    } catch (error) {
      alert("Failed to submit post. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <a href="https://whatsapp.com/channel/your-channel-link" target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98]">
        <div className="absolute -right-4 -top-4 opacity-20 pointer-events-none">
          <Phone className="w-40 h-40 text-white" />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-extrabold text-xl sm:text-2xl mb-1.5 flex items-center gap-2">
              Join PrepIQ WhatsApp <CheckCircle className="w-5 h-5" />
            </h3>
            <p className="text-white/90 font-medium text-sm sm:text-base">Get daily MCQs, current affairs & job alerts directly on your phone!</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-md">
            <ChevronRight className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </a>

      <div className="glass-card p-5 sm:p-6 rounded-3xl shadow-sm border border-white/5">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
          <Edit3 className="w-5 h-5 text-indigo-500" /> Start a Discussion
        </h3>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Have a doubt? Or want to share a study tip with the community?"
          rows={3}
          className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-3 transition-all"
        />
        <div className="flex justify-end">
          <button
            onClick={handleCreatePost}
            disabled={isSubmitting || !newPostContent.trim()}
            className="glow-button bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4" /> Post for Approval</>}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-500" /> Community Feed</h3>
        {loading ? <div className="text-center p-8 animate-pulse text-muted-foreground">Loading posts...</div> : posts.length === 0 ? (
          <div className="text-center p-10 text-muted-foreground glass-card rounded-3xl">No posts available right now.</div>
        ) : (
          posts.map(post => <CommunityPost key={post.id} post={post} currentUser={user} onUpdate={fetchPosts} />)
        )}
      </div>
    </div>
  );
}

function EditProfileView({ user }: { user: any }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  const [newPassword, setNewPassword] = useState("");
  const [isSavingPass, setIsSavingPass] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const docSnap = await getDoc(doc(db, "profiles", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || user.name || "");
          setPhone(data.phone || "");
        } else {
          setName(user.name || "");
        }
      } catch (error) { console.error(error); }
    };
    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateDoc(doc(db, "profiles", user.uid), { name, phone });
      alert("Profile updated successfully!");
    } catch (error) { alert("Failed to update profile."); }
    setIsSavingProfile(false);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) return alert("Password must be at least 6 characters.");
    setIsSavingPass(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        alert("Password updated successfully!");
        setNewPassword("");
      }
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, please log out and log in again to change your password.");
      } else {
        alert("Failed to change password. Error: " + error.message);
      }
    }
    setIsSavingPass(false);
  };

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <input
              type="email"
              value={user.email || "user@example.com"}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border-0 py-2.5 pl-10 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
              />
            </div>
          </div>
          <button onClick={handleSaveProfile} disabled={isSavingProfile} className="glow-button mt-4 w-full sm:w-auto bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
            {isSavingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-500" /> Change Password
        </h3>
        <div className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all"
            />
          </div>
          <button onClick={handleUpdatePassword} disabled={isSavingPass || !newPassword} className="bg-background/50 border border-white/10 hover:bg-white/5 text-foreground px-6 py-2.5 w-full sm:w-auto rounded-xl text-sm font-semibold transition-colors mt-2 disabled:opacity-50">
            {isSavingPass ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 sm:p-8 border-amber-500/20">
        <h3 className="text-xl font-bold mb-2 text-amber-500">App Data</h3>
        <p className="text-sm text-muted-foreground mb-6">Clear cached data to free up space or resolve issues.</p>
        <button onClick={() => { if(window.confirm("Clear App Cache?")) { localStorage.clear(); window.location.reload(); } }} className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 px-4 py-2 w-full sm:w-auto rounded-xl text-sm font-semibold transition-colors">
          Clear Cache
        </button>
      </div>
    </div>
  );
}

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
            <button className="flex-1 sm:flex-none glow-button bg-foreground text-background px-4 py-2 rounded-xl text-sm font-semibold">View</button>
            <button className="p-2 rounded-xl border border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyOrdersView({ user }: { user: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        // Firebase me 'orders' naam ka collection banega
        const q = query(
          collection(db, "orders"), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="text-center p-10 text-muted-foreground animate-pulse glass-card rounded-3xl">Loading your orders...</div>;
  }

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
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                  You haven't purchased any plans yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isActive = order.status === "active";
                return (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium">{order.planName}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 font-medium">₹{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                        isActive 
                          ? "bg-emerald-500/10 text-emerald-500" 
                          : "bg-white/5 text-muted-foreground"
                      )}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
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
            <input type="text" placeholder="E.g., Payment issue, Bug report" className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea rows={5} placeholder="Describe your issue in detail..." className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 bg-background/50 px-4 transition-all resize-none" />
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setIsDeleting(true);
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await deleteDoc(doc(db, "profiles", currentUser.uid));
        await deleteUser(currentUser);
        setShowDeleteModal(false);
        logout(); 
        navigate("/auth");
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          alert("Security alert: Please log out and log in again to verify your identity before deleting your account.");
          setShowDeleteModal(false);
        } else {
          alert("Failed to delete account.");
        }
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
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
            <div className="flex items-center gap-3"><Info className="w-5 h-5 text-blue-400" /><span className="font-medium">About PrepIQ</span></div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3"><Share2 className="w-5 h-5 text-indigo-500" /><span className="font-medium">Share App</span></div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3"><Star className="w-5 h-5 text-amber-500" /><span className="font-medium">Rate Us</span></div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3"><ShieldAlert className="w-5 h-5 text-emerald-500" /><span className="font-medium">Privacy Policy</span></div>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-blue-500" /><span className="font-medium">Terms and Conditions</span></div>
          </button>
        </div>
      </div>
      
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-destructive/20">
        <h3 className="text-xl font-bold mb-2 text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <button onClick={() => { setShowDeleteModal(true); setDeleteInput(""); }} className="bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 px-4 py-2 w-full sm:w-auto rounded-xl text-sm font-semibold transition-colors">
          Delete Account
        </button>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-destructive/20 blur-3xl rounded-full pointer-events-none" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-destructive" /></div>
                <button onClick={() => setShowDeleteModal(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground"><X className="w-5 h-5" /></button>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">Delete Account</h3>
              <p className="text-sm text-muted-foreground mb-6 relative z-10">This action <strong className="text-foreground">cannot be undone</strong>. This will permanently delete your account, performance history, and all saved data.</p>
              <div className="mb-6 relative z-10">
                <label className="block text-sm font-medium text-foreground mb-2">To confirm, type <strong className="text-destructive select-all">DELETE</strong> below:</label>
                <input type="text" value={deleteInput} onChange={(e) => setDeleteInput(e.target.value)} placeholder="Type DELETE" className="w-full rounded-xl border-0 py-2.5 text-foreground ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-destructive bg-background/50 px-4 transition-all uppercase" />
              </div>
              <div className="flex gap-3 relative z-10">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-foreground px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={confirmDeleteAccount} disabled={deleteInput !== "DELETE" || isDeleting} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                  {isDeleting ? "Deleting..." : "Permanently Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}