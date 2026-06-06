import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Search, Star, CheckCircle, Users, SlidersHorizontal, ArrowUpDown,
  Palette, Code2, PenLine, Camera, Megaphone, LayoutGrid, Loader2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { getStudents, type StudentProfile } from "../../lib/firestore";

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

const verificationColors: Record<string, string> = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-600",
};

export function ProfilesPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("rating");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") ?? "";
    const cat = params.get("category") ?? "All";
    setSearch(q);
    setCategory(cat);
  }, [location.search]);

  useEffect(() => {
    getStudents()
      .then((data) => setStudents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.major.toLowerCase().includes(q) ||
        s.university?.toLowerCase().includes(q) ||
        s.skills.some((sk) => sk.toLowerCase().includes(q)) ||
        s.bio?.toLowerCase().includes(q);
      return matchSearch && matchesCategory(s, category);
    });

    list = [...list].sort((a, b) => {
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sort === "gigs") return (b.completedGigs || 0) - (a.completedGigs || 0);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [students, search, category, sort]);

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#60c8ff] to-[#a8e0ff] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25)_0%,_transparent_60%)]" />
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

          {/* Search bar */}
          <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl shadow-[#38B6FF]/20 max-w-xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-[#6b7a8d] shrink-0" />
              <input
                type="text"
                placeholder="Search by name, skill, major, university…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-[#1A1D20] placeholder:text-[#6b7a8d] bg-transparent text-sm"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-[#6b7a8d] hover:text-[#1A1D20]">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" fill="#EFF8FF" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters + Sort row */}
        <div className="flex flex-col gap-3 items-stretch justify-between mb-6 sm:flex-row sm:items-center">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => setCategory(label)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  category === label
                    ? "bg-[#38B6FF] text-white shadow-lg shadow-[#38B6FF]/30"
                    : "bg-white text-[#6b7a8d] hover:bg-[#daeeff] hover:text-[#1A1D20]"
                }`}
                style={{ fontWeight: 600 }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-[#6b7a8d]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm text-[#1A1D20] outline-none bg-transparent"
              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-[#6b7a8d] text-sm mb-5" style={{ fontWeight: 600 }}>
          <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
          {filtered.length} student{filtered.length !== 1 ? "s" : ""} found
          {search && <> matching "<span className="text-[#38B6FF]">{search}</span>"</>}
          {category !== "All" && <> in <span className="text-[#38B6FF]">{category}</span></>}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto" />
              <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>Loading talent…</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF8FF] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#38B6FF]" />
            </div>
            <h3 className="text-[#1A1D20] text-lg mb-2" style={{ fontWeight: 800 }}>No students found</h3>
            <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>Try adjusting your search or category filter</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((s) => (
              <Link
                key={s.id}
                to={`/profile/${s.id}`}
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl hover:shadow-[#38B6FF]/10 transition-all hover:-translate-y-1 overflow-hidden"
              >
                {/* Card top */}
                <div className="relative h-28 bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
                  {s.verificationStatus === "Verified" && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-xs" style={{ fontWeight: 700 }}>Verified</span>
                    </div>
                  )}
                  {s.verificationStatus !== "Verified" && (
                    <div className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full ${verificationColors[s.verificationStatus] || ""}`} style={{ fontWeight: 600 }}>
                      {s.verificationStatus}
                    </div>
                  )}
                </div>

                <div className="px-5 pb-5">
                  {/* Avatar overlapping the header */}
                  <div className="relative -mt-8 mb-3 flex items-end justify-between">
                    <div className="relative">
                      <ImageWithFallback
                        src={s.image}
                        alt={s.name}
                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
                      />
                    </div>
                    {s.rating > 0 && (
                      <div className="flex items-center gap-1 bg-[#FFC107] rounded-full px-2.5 py-1 shadow-md">
                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                        <span className="text-white text-xs" style={{ fontWeight: 800 }}>{s.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-[#1A1D20] text-base leading-tight" style={{ fontWeight: 800 }}>{s.name}</h3>
                  <p className="text-[#6b7a8d] text-xs mt-0.5 mb-1" style={{ fontWeight: 500 }}>
                    {s.major} · {s.year}
                  </p>
                  {s.university && (
                    <p className="text-[#38B6FF] text-xs mb-3" style={{ fontWeight: 600 }}>
                      {s.university}
                    </p>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {s.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="bg-[#EFF8FF] text-[#38B6FF] text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
                        {sk}
                      </span>
                    ))}
                    {s.skills.length > 3 && (
                      <span className="bg-[#EFF8FF] text-[#6b7a8d] text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>
                        +{s.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="text-center">
                        <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 800 }}>{s.completedGigs || 0}</p>
                        <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>Gigs</p>
                      </div>
                      {s.hourlyRate && (
                        <div className="text-center">
                          <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 800 }}>{s.hourlyRate}</p>
                          <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>Rate</p>
                        </div>
                      )}
                    </div>
                    <span className="text-xs bg-[#FFC107] text-[#1A1D20] px-3 py-1.5 rounded-full group-hover:bg-[#FFD000] transition-colors" style={{ fontWeight: 700 }}>
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
