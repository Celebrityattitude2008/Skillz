import { Link, useLocation, useNavigate } from "react-router";
import { Zap, Menu, X, LogOut, User, ChevronDown, Shield, Edit, Sun, Moon, LayoutDashboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../../lib/firebase";
import { useAuth } from "../../lib/auth-context";
import { useTheme } from "../../lib/theme-context";
import { NotificationBell } from "./notification-bell";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const navLinks = [
    { label: "Find Gigs", to: "/jobs" },
    { label: "Profiles", to: "/profiles" },
  ];

  if (user) {
    navLinks.unshift({ label: "Dashboard", to: "/dashboard" });
  } else {
    navLinks.unshift({ label: "Discover", to: "/" });
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    navigate("/");
  };

  const avatarUrl = user?.photoURL || profile?.image;
  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-blue-100/60 dark:border-slate-700/60 shadow-sm shadow-blue-100/20 dark:shadow-slate-900/30">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/30">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }} className="text-slate-900 dark:text-white text-xl tracking-tight">
            Skillz<span className="text-[#38B6FF]">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  active
                    ? "bg-[#38B6FF] text-white shadow-md shadow-[#38B6FF]/30"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800"
                }`}
                style={{ fontWeight: 600 }}
              >
                {link.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 flex items-center gap-1.5 ${
                location.pathname === "/admin"
                  ? "bg-[#38B6FF] text-white shadow-md shadow-[#38B6FF]/30"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-800"
              }`}
              style={{ fontWeight: 600 }}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#38B6FF] dark:hover:text-[#38B6FF] transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user && <NotificationBell />}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-2xl px-3 py-2 transition-all"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-7 h-7 rounded-xl object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center text-white text-xs" style={{ fontWeight: 800 }}>
                    {initials}
                  </div>
                )}
                <span className="text-slate-800 dark:text-slate-200 text-sm max-w-[90px] truncate" style={{ fontWeight: 600 }}>{displayName}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-blue-100/30 dark:shadow-slate-900/50 border border-blue-100/50 dark:border-slate-700/50 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-blue-50 dark:border-slate-700/60">
                    <p className="text-slate-900 dark:text-white text-sm truncate" style={{ fontWeight: 700 }}>{displayName}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs truncate" style={{ fontWeight: 500 }}>{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors"
                      style={{ fontWeight: 600 }}>
                      <Shield className="w-4 h-4 text-[#38B6FF]" />
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors"
                    style={{ fontWeight: 600 }}>
                    <LayoutDashboard className="w-4 h-4 text-[#38B6FF]" />
                    My Dashboard
                  </Link>
                  {profile?.role !== "client" && (
                    <Link to="/profile/me" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors"
                      style={{ fontWeight: 600 }}>
                      <Edit className="w-4 h-4 text-[#38B6FF]" />
                      Edit My Profile
                    </Link>
                  )}
                  <Link to="/profiles" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/60 transition-colors"
                    style={{ fontWeight: 600 }}>
                    <User className="w-4 h-4 text-[#38B6FF]" />
                    Browse Profiles
                  </Link>
                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    style={{ fontWeight: 600 }}>
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/auth"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-2"
                style={{ fontWeight: 600 }}>
                Log In
              </Link>
              <Link to="/auth"
                className="bg-[#FFC107] text-slate-900 px-5 py-2.5 rounded-full text-sm shadow-md shadow-amber-300/30 hover:bg-[#FFD000] transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                style={{ fontWeight: 700 }}>
                Join Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + burger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-[#38B6FF]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-blue-100/50 dark:border-slate-700/50 px-6 py-4 space-y-1.5">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              style={{ fontWeight: 600 }}>
              {link.label}
            </Link>
          ))}
          {user && profile?.role !== "client" && (
            <Link to="/profile/me" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              style={{ fontWeight: 600 }}>
              <Edit className="w-4 h-4 text-[#38B6FF]" />
              Edit My Profile
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
              style={{ fontWeight: 600 }}>
              <Shield className="w-4 h-4 text-[#38B6FF]" />
              Admin Panel
            </Link>
          )}
          <div className="pt-2 border-t border-blue-50 dark:border-slate-700/50 flex gap-3">
            {user ? (
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }}
                className="flex-1 text-center py-2.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 text-sm"
                style={{ fontWeight: 600 }}>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full border border-[#38B6FF]/30 text-[#38B6FF] text-sm"
                  style={{ fontWeight: 600 }}>
                  Log In
                </Link>
                <Link to="/auth" onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full bg-[#FFC107] text-slate-900 text-sm"
                  style={{ fontWeight: 700 }}>
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
