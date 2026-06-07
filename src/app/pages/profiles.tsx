import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Search, Star, CheckCircle, Users, SlidersHorizontal, ArrowUpDown,
  Palette, Code2, PenLine, Camera, Megaphone, LayoutGrid, Loader2, X, Crown,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { getStudents, type StudentProfile } from "../../lib/firestore";
import { NIGERIAN_UNIVERSITIES } from "../../lib/nigerian-universities";

const CATEGORIES = [
  { label: "All", Icon: LayoutGrid },
  { label: "Design", Icon: Palette },
  { label: "Dev", Icon: Code2 },
  { label: "Writing", Icon: PenLine },
  { label: "Photo", Icon: Camera },
  { label: "Marketing", Icon: Megaphone },
];

const SKILL_MAP: Record<string, string[]> = {
  Design: ["Design", "UI/UX", "Figma", "Adobe", "Branding", "Illustration", "Typography", "Logo", "Graphic"],
  Dev: ["React", "Node", "TypeScript", "JavaScript", "Python", "Dev", "Developer", "Frontend", "Backend", "Web", "App", "Code", "Programming", "PostgreSQL", "MongoDB"],
  Writing: ["Writing", "SEO", "Content", "Blog", "Copywriting", "Research", "Technical Writing"],
  Photo: ["Photography", "Photo", "Lightroom", "Camera", "Editing"],
  Marketing: ["Marketing", "Social Media", "Analytics", "SEO", "Ads", "Strategy", "Instagram", "TikTok"],
};

function matchesCategory(student: StudentProfile, category: string): boolean {
  if (category === "All") return true;
  const keywords = SKILL_MAP[category] || [];
  return student.skills.some((s) => keywords.some((k) => s.toLowerCase().includes(k.toLowerCase()))) ||
    student.major.toLowerCase().includes(category.toLowerCase());
}

const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "gigs", label: "Most Gigs" },
  { value: "name", label: "A – Z" },
];

const BUDGET_OPTIONS = [
  { value: "all", label: "Any Rate" },
  { value: "low", label: "Under ₦5k/hr" },
  { value: "mid", label: "₦5k – ₦20k/hr" },
  { value: "high", label: "₦20k+/hr" },
];

const verificationColors: Record<string, string> = {
  Verified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

function parseRate(rateStr?: string): number | null {
  if (!rateStr) return null;
  const match = rateStr.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function matchesBudget(student: StudentProfile, budget: string): boolean {
  if (budget === "all") return true;
  const rate = parseRate(student.hourlyRate);
  if (rate === null) return budget === "all";
  if (budget === "low") return rate < 5000;
  if (budget === "mid") return rate >= 5000 && rate <= 20000;
  if (budget === "high") return rate > 20000;
  return true;
}

export function ProfilesPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("rating");
  const [university, setUniversity] = useState("");
  const [budget, setBudget] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("q") ?? "");
    setCategory(params.get("category") ?? "All");
  }, [location.search]);

  useEffect(() => {
    getStudents().then((data) => setStudents(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch = !q || (s.name ?? "").toLowerCase().includes(q) || (s.major ?? "").toLowerCase().includes(q) ||
        (s.university ?? "").toLowerCase().includes(q) || s.skills.some((sk) => sk.toLowerCase().includes(q)) || (s.bio ?? "").toLowerCase().includes(q);
      const matchUni = !university || s.university === university;
      const matchVerified = !verifiedOnly || s.verificationStatus === "Verified";
      return matchSearch && matchesCategory(s, category) && matchUni && matchBudget(s, budget) && matchVerified;
    });
    list = [...list].sort((a, b) => {
      if (Number(b.isPro) !== Number(a.isPro)) return Number(b.isPro) - Number(a.isPro);
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sort === "gigs") return (b.completedGigs || 0) - (a.completedGigs || 0);
      return (a.name ?? "").localeCompare(b.name ?? "");
    });
    return list;
  }, [students, search, category, sort, university, budget, verifiedOnly]);

  function matchBudget(s: StudentProfile, b: string) { return matchesBudget(s, b); }

  const activeFilterCount = [
    university !== "",
    budget !== "all",
    verifiedOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setUniversity("");
    setBudget("all");
    setVerifiedOnly(false);
  };

  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#2fa8f0] to-[#1a6fcc] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white text-4xl" style={{ fontWeight: 900 }}>Student Profiles</h1>
          </div>
          <p className="text-white/80 mb-7" style={{ fontWeight: 500 }}>
            {loading ? "Loading talent…" : `${students.length} verified students ready to work`}
          </p>
          <div className="flex gap-3 bg-white dark:bg-slate-800/95 rounded-2xl p-2 shadow-2xl shadow-blue-900/20 max-w-xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input type="text" placeholder="Search by name, skill, major, university…"
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-slate-800 dark:text-white placeholder:text-slate-400 bg-transparent text-sm"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
              {search && (
                <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="w-4 h-4" /></button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" className="fill-[#dbeafe] dark:fill-[#0d1321]" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Skill category pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map(({ label, Icon }) => (
            <button key={label} onClick={() => setCategory(label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                category === label
                  ? "bg-[#38B6FF] text-white shadow-lg shadow-[#38B6FF]/30"
                  : "bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 border border-white/60 dark:border-slate-700/40 hover:text-slate-900 dark:hover:text-white"
              }`}
              style={{ fontWeight: 600 }}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-3 items-center mb-5">
          {/* Sort */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 rounded-xl px-3 py-2 shadow-sm border border-white/60 dark:border-slate-700/40">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="text-sm text-slate-800 dark:text-slate-200 outline-none bg-transparent"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Budget filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 rounded-xl px-3 py-2 shadow-sm border border-white/60 dark:border-slate-700/40">
            <select value={budget} onChange={(e) => setBudget(e.target.value)}
              className="text-sm text-slate-800 dark:text-slate-200 outline-none bg-transparent"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
              {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* University filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800/80 rounded-xl px-3 py-2 shadow-sm border border-white/60 dark:border-slate-700/40 flex-1 min-w-[200px] max-w-xs">
            <select value={university} onChange={(e) => setUniversity(e.target.value)}
              className="text-sm text-slate-800 dark:text-slate-200 outline-none bg-transparent w-full"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
              <option value="">All Universities</option>
              {NIGERIAN_UNIVERSITIES.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          {/* Verified only toggle */}
          <button onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all border ${
              verifiedOnly
                ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-300/30"
                : "bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-white/60 dark:border-slate-700/40 hover:bg-blue-50 dark:hover:bg-slate-700"
            }`}
            style={{ fontWeight: 600 }}>
            <CheckCircle className="w-4 h-4" />
            Verified
          </button>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              style={{ fontWeight: 600 }}>
              <X className="w-3.5 h-3.5" /> Clear ({activeFilterCount})
            </button>
          )}
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5" style={{ fontWeight: 600 }}>
          <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          {filtered.length} student{filtered.length !== 1 ? "s" : ""} found
          {search && <> matching "<span className="text-[#38B6FF]">{search}</span>"</>}
          {category !== "All" && <> in <span className="text-[#38B6FF]">{category}</span></>}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto" />
              <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>Loading talent…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-14 text-center shadow-sm border border-white/60 dark:border-slate-700/40">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#38B6FF]" />
            </div>
            <h3 className="text-slate-900 dark:text-white text-lg mb-2" style={{ fontWeight: 800 }}>No students found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4" style={{ fontWeight: 500 }}>Try adjusting your search or filters</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-[#38B6FF] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a9fe8] transition-colors"
                style={{ fontWeight: 700 }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <Link key={s.id} to={`/profile/${s.id}`}
                className="group bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm shadow-blue-100/20 dark:shadow-slate-900/30 hover:shadow-xl hover:shadow-blue-200/20 dark:hover:shadow-slate-900/50 transition-all hover:-translate-y-1 overflow-hidden border border-white/60 dark:border-slate-700/40">
                <div className="relative h-28 bg-gradient-to-br from-[#38B6FF] to-[#1a6fcc]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
                  {s.isPro && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#FFC107] rounded-full px-2.5 py-1 shadow-lg">
                      <Crown className="w-3 h-3 text-slate-900 fill-slate-900" />
                      <span className="text-slate-900 text-[11px]" style={{ fontWeight: 800 }}>Pro</span>
                    </div>
                  )}
                  {s.verificationStatus === "Verified" ? (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/25 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/20">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-xs" style={{ fontWeight: 700 }}>Verified</span>
                    </div>
                  ) : (
                    <div className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full ${verificationColors[s.verificationStatus] || ""}`} style={{ fontWeight: 600 }}>
                      {s.verificationStatus}
                    </div>
                  )}
                </div>

                <div className="px-5 pb-5">
                  <div className="relative -mt-8 mb-3 flex items-end justify-between">
                    <div className="relative">
                      <ImageWithFallback src={s.image} alt={s.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-md" />
                    </div>
                    {s.rating > 0 && (
                      <div className="flex items-center gap-1 bg-[#FFC107] rounded-full px-2.5 py-1 shadow-md">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                        <span className="text-white text-xs" style={{ fontWeight: 800 }}>{s.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-slate-900 dark:text-white text-base leading-tight" style={{ fontWeight: 800 }}>{s.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 mb-1" style={{ fontWeight: 500 }}>
                    {s.major} · {s.year}
                  </p>
                  {s.university && (
                    <p className="text-[#38B6FF] text-xs mb-3 truncate" style={{ fontWeight: 600 }}>{s.university}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {s.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="bg-blue-50 dark:bg-blue-900/30 text-[#38B6FF] text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>{sk}</span>
                    ))}
                    {s.skills.length > 3 && (
                      <span className="bg-blue-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>+{s.skills.length - 3}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="text-center">
                        <p className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 800 }}>{s.completedGigs || 0}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>Gigs</p>
                      </div>
                      {s.hourlyRate && (
                        <div className="text-center">
                          <p className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 800 }}>{s.hourlyRate}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>Rate</p>
                        </div>
                      )}
                    </div>
                    <span className="text-xs bg-[#FFC107] text-slate-900 px-3 py-1.5 rounded-full group-hover:bg-[#FFD000] transition-colors" style={{ fontWeight: 700 }}>
                      View Profile
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
