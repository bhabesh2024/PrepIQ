import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, PenTool, User, FileQuestion } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Subjects", path: "/subjects" },
    { icon: PenTool, label: "Practice", path: "/practice" },
    { icon: FileQuestion, label: "Mock Test", path: "/quiz" },
    { icon: User, label: "Profile", path: user ? "/profile" : "/auth" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-around p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = path === item.path || (path.startsWith(item.path) && item.path !== "/");
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-12 gap-1 transition-colors",
                isActive ? "text-indigo-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-indigo-500/20")} />
              <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
