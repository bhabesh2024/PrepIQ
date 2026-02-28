import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, User as UserIcon, LogOut, Search, GraduationCap } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
        
        {/* Logo & Desktop Nav */}
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="bg-blue-500 p-1.5 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold inline-block text-xl tracking-tight text-gradient">
              PrepIQ
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/subjects" className="transition-colors hover:text-foreground/80 text-foreground/60">Subjects</Link>
            <Link to="/practice" className="transition-colors hover:text-foreground/80 text-foreground/60">Practice</Link>
            <Link to="/quiz" className="transition-colors hover:text-foreground/80 text-foreground/60">Mock Tests</Link>
            <Link to="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
            <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
            <Link to="/admin" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Admin Demo
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search Box - Hidden on mobile */}
          <div className="hidden md:flex items-center relative w-full max-w-[300px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="bg-background/50 border border-white/10 text-foreground text-sm rounded-full focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2 transition-all"
              placeholder="Search exams, topics..."
            />
          </div>

          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
            
            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                  >
                    <UserIcon className="h-4 w-4" />
                    <span className="sr-only">Profile</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="glow-button inline-flex items-center justify-center rounded-lg text-sm font-medium bg-foreground text-background shadow h-9 px-4 py-2"
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}
