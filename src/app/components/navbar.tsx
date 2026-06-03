import { Link, useLocation } from "react-router";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Discover", to: "/" },
    { label: "Find Gigs", to: "/jobs" },
    { label: "Profiles", to: "/profile/1" },
  ];

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
            const active = location.pathname === link.to;
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
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className="text-sm text-[#6b7a8d] hover:text-[#1A1D20] transition-colors px-3 py-2"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
          >
            Log In
          </Link>
          <Link
            to="/"
            className="bg-[#FFC107] text-[#1A1D20] px-5 py-2.5 rounded-full text-sm shadow-md shadow-[#FFC107]/30 hover:bg-[#FFD000] transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}
          >
            Join Free
          </Link>
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
          <div className="pt-2 border-t border-[#EFF8FF] flex gap-3">
            <Link to="/" className="flex-1 text-center py-2.5 rounded-full border border-[#38B6FF]/20 text-[#38B6FF] text-sm" style={{ fontWeight: 600 }}>Log In</Link>
            <Link to="/" className="flex-1 text-center py-2.5 rounded-full bg-[#FFC107] text-[#1A1D20] text-sm" style={{ fontWeight: 700 }}>Join Free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
