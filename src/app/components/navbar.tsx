import { Link, useLocation, useNavigate } from "react-router";
import { Zap, Menu, X, LogOut, User, ChevronDown, Shield, Edit } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, ADMIN_EMAIL } from "../../lib/firebase";
import { useAuth } from "../../lib/auth-context";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const navLinks = [
    { label: "Discover", to: "/" },
    { label: "Find Gigs", to: "/jobs" },
    { label: "Profiles", to: "/profile/1" },
  ];

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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#38B6FF]/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/30">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }} className="text-[#1A1D20] text-xl tracking-tight">
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
                    : "text-[#6b7a8d] hover:text-[#1A1D20] hover:bg-[#EFF8FF]"
                }`}
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
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
                  : "text-[#6b7a8d] hover:text-[#1A1D20] hover:bg-[#EFF8FF]"
              }`}
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-[#EFF8FF] hover:bg-[#daeeff] rounded-2xl px-3 py-2 transition-all"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-xl object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center text-white text-xs" style={{ fontWeight: 800 }}>
                    {initials}
                  </div>
                )}
                <span className="text-[#1A1D20] text-sm max-w-[100px] truncate" style={{ fontWeight: 600 }}>{displayName}</span>
                <ChevronDown className={`w-4 h-4 text-[#6b7a8d] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl shadow-[#38B6FF]/15 border border-[#EFF8FF] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#EFF8FF]">
                    <p className="text-[#1A1D20] text-sm truncate" style={{ fontWeight: 700 }}>{displayName}</p>
                    <p className="text-[#6b7a8d] text-xs truncate" style={{ fontWeight: 500 }}>{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A1D20] hover:bg-[#EFF8FF] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <Shield className="w-4 h-4 text-[#38B6FF]" />
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile/me"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A1D20] hover:bg-[#EFF8FF] transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    <Edit className="w-4 h-4 text-[#38B6FF]" />
                    Edit My Profile
                  </Link>
                  <Link
                    to="/profile/1"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-[#1A1D20] hover:bg-[#EFF8FF] transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    <User className="w-4 h-4 text-[#38B6FF]" />
                    Browse Profiles
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm text-[#6b7a8d] hover:text-[#1A1D20] transition-colors px-3 py-2"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
              >
                Log In
              </Link>
              <Link
                to="/auth"
                className="bg-[#FFC107] text-[#1A1D20] px-5 py-2.5 rounded-full text-sm shadow-md shadow-[#FFC107]/30 hover:bg-[#FFD000] transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
              >
                Join Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden w-9 h-9 rounded-xl bg-[#EFF8FF] flex items-center justify-center text-[#38B6FF]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#38B6FF]/10 px-6 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-2xl text-[#1A1D20] hover:bg-[#EFF8FF] transition-colors"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/profile/me"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[#1A1D20] hover:bg-[#EFF8FF] transition-colors"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
            >
              <Edit className="w-4 h-4 text-[#38B6FF]" />
              Edit My Profile
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[#1A1D20] hover:bg-[#EFF8FF] transition-colors"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
            >
              <Shield className="w-4 h-4 text-[#38B6FF]" />
              Admin Panel
            </Link>
          )}
          <div className="pt-2 border-t border-[#EFF8FF] flex gap-3">
            {user ? (
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false); }}
                className="flex-1 text-center py-2.5 rounded-full bg-red-50 text-red-500 text-sm"
                style={{ fontWeight: 600 }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/auth" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full border border-[#38B6FF]/20 text-[#38B6FF] text-sm" style={{ fontWeight: 600 }}>Log In</Link>
                <Link to="/auth" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full bg-[#FFC107] text-[#1A1D20] text-sm" style={{ fontWeight: 700 }}>Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
