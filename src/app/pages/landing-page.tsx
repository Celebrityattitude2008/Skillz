import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  ArrowRight, Search, Star, TrendingUp, Users, ChevronRight, MapPin, Sparkles,
  Palette, Code2, PenLine, Camera, Video, Music, Megaphone, Briefcase,
  UserPlus, Banknote, Zap,
} from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getGigs, getStudents, type Gig, type StudentProfile } from "../../lib/firestore";

const categoryDefs = [
  { label: "Design", Icon: Palette, color: "from-pink-400 to-rose-500" },
  { label: "Dev", Icon: Code2, color: "from-violet-400 to-purple-500" },
  { label: "Writing", Icon: PenLine, color: "from-amber-400 to-orange-500" },
  { label: "Photo", Icon: Camera, color: "from-sky-400 to-blue-500" },
  { label: "Video", Icon: Video, color: "from-emerald-400 to-teal-500" },
  { label: "Music", Icon: Music, color: "from-fuchsia-400 to-purple-500" },
  { label: "Marketing", Icon: Megaphone, color: "from-orange-400 to-red-500" },
];

const categoryIconMap: Record<string, React.ElementType> = {
  Design: Palette,
  Dev: Code2,
  Writing: PenLine,
  Photo: Camera,
  Video: Video,
  Music: Music,
  Marketing: Megaphone,
};

const categoryColorMap: Record<string, string> = {
  Design: "from-pink-400 to-rose-500",
  Dev: "from-violet-400 to-purple-500",
  Writing: "from-amber-400 to-orange-500",
  Photo: "from-sky-400 to-blue-500",
  Video: "from-emerald-400 to-teal-500",
  Music: "from-fuchsia-400 to-purple-500",
  Marketing: "from-orange-400 to-red-500",
};

const badgeColors = [
  "bg-[#FFC107] text-[#1A1D20]",
  "bg-orange-100 text-orange-600",
  "bg-[#EFF8FF] text-[#38B6FF]",
];
const badgeLabels = ["Top Rated", "Rising", "New"];

const howItWorks = [
  { step: "01", title: "Create Your Profile", desc: "Showcase your skills, portfolio, and set your rates. Get verified by your campus.", Icon: UserPlus, color: "from-[#38B6FF] to-[#1a9fe8]" },
  { step: "02", title: "Discover Gigs", desc: "Browse real opportunities posted by local businesses and community members.", Icon: Search, color: "from-[#FFC107] to-[#ff9f00]" },
  { step: "03", title: "Get Paid", desc: "Complete the work, receive payment directly, and build your reputation.", Icon: Banknote, color: "from-emerald-400 to-teal-500" },
];

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  useEffect(() => {
    getGigs().then((data) => setGigs(data)).catch(() => {});
    getStudents().then((data) => setStudents(data)).catch(() => {});
  }, []);

  const spotlightStudent = students[0];

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#38B6FF] via-[#60c8ff] to-[#a8e0ff] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_60%)]" />
        <div className="absolute top-16 right-16 w-24 h-24 rounded-full bg-white/20 blur-xl" />
        <div className="absolute bottom-8 left-12 w-16 h-16 rounded-full bg-[#FFC107]/30 blur-lg" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm" style={{ fontWeight: 700 }}>
                <Sparkles className="w-4 h-4" />
                Campus Marketplace · 2,500+ Students
              </div>

              <div className="space-y-3">
                <h1 className="text-5xl lg:text-6xl text-white leading-[1.1]" style={{ fontWeight: 900 }}>
                  Discover<br />
                  <span className="text-[#FFC107]">Campus</span><br />
                  Talent
                </h1>
                <p className="text-white/85 text-lg max-w-md leading-relaxed" style={{ fontWeight: 500 }}>
                  Connect with verified students offering real skills. Build your portfolio, earn income, grow together.
                </p>
              </div>

              <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl shadow-[#38B6FF]/20 max-w-md">
                <div className="flex-1 flex items-center gap-3 px-3">
                  <Search className="w-5 h-5 text-[#6b7a8d] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search skills or gigs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-[#1A1D20] placeholder:text-[#6b7a8d] bg-transparent"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
                  />
                </div>
                <Link
                  to={`/jobs${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                  className="bg-[#FFC107] text-[#1A1D20] px-5 py-3 rounded-xl shadow-md hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95"
                  style={{ fontWeight: 700 }}
                >
                  Search
                </Link>
              </div>

              <div className="flex gap-6">
                {[
                  { value: students.length > 0 ? `${students.length}+` : "—", label: "Students" },
                  { value: gigs.length > 0 ? `${gigs.length}+` : "—", label: "Active Gigs" },
                  { value: gigs.filter(g => g.status === "Completed").length > 0 ? `${gigs.filter(g => g.status === "Completed").length}` : "Live", label: "Gigs Done" },
                ].map((stat) => (
                  <div key={stat.label} className="text-white">
                    <p className="text-2xl" style={{ fontWeight: 800 }}>{stat.value}</p>
                    <p className="text-white/70 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right floating cards */}
            <div className="relative hidden lg:block h-[440px]">
              {students[0] && (
                <div className="absolute right-0 top-0 w-64 bg-white rounded-3xl shadow-2xl shadow-[#38B6FF]/20 overflow-hidden">
                  <ImageWithFallback
                    src={students[0].image}
                    alt={students[0].name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 800 }}>{students[0].name}</p>
                    <p className="text-[#6b7a8d] text-xs mb-3" style={{ fontWeight: 500 }}>
                      {students[0].major}{students[0].hourlyRate ? ` · ${students[0].hourlyRate}` : ""}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                        <span className="text-xs text-[#1A1D20]" style={{ fontWeight: 700 }}>{students[0].rating}</span>
                      </div>
                      <span className="text-xs bg-[#EFF8FF] text-[#38B6FF] px-3 py-1 rounded-full" style={{ fontWeight: 700 }}>View Profile</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute left-0 top-10 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 -rotate-3 hover:rotate-0 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[#1A1D20] text-base" style={{ fontWeight: 800 }}>{students.length > 0 ? students.length : "—"}</p>
                  <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>Active Profiles</p>
                </div>
              </div>

              <div className="absolute left-6 bottom-20 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 rotate-2 hover:rotate-0 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#ff9f00] flex items-center justify-center shadow-md shadow-[#FFC107]/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[#1A1D20] text-base" style={{ fontWeight: 800 }}>+340</p>
                  <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>New This Month</p>
                </div>
              </div>

              <div className="absolute right-4 bottom-12 bg-[#FFC107] rounded-2xl shadow-xl px-4 py-3 rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-white" style={{ fontWeight: 800 }}>4.9 / 5.0</span>
                </div>
                <p className="text-white/80 text-xs mt-0.5" style={{ fontWeight: 500 }}>Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 10 0 30L0 60Z" fill="#EFF8FF" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1A1D20] text-xl" style={{ fontWeight: 800 }}>Browse by Category</h2>
          <Link to="/jobs" className="text-[#38B6FF] text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ fontWeight: 700 }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categoryDefs.map(({ label, Icon, color }) => (
            <Link to="/jobs" key={label} className="flex-shrink-0 flex flex-col items-center gap-2 group">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-[#1A1D20] text-xs whitespace-nowrap" style={{ fontWeight: 700 }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Talent */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1A1D20] text-xl" style={{ fontWeight: 800 }}>Featured Talent</h2>
          <Link to="/profiles" className="text-[#38B6FF] text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ fontWeight: 700 }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {students.length === 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md h-64 animate-pulse">
                <div className="h-44 bg-[#EFF8FF]" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-[#EFF8FF] rounded w-3/4" />
                  <div className="h-3 bg-[#EFF8FF] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {students.slice(0, 3).map((student, idx) => (
              <Link
                to={`/profile/${student.id}`}
                key={student.id}
                className="bg-white rounded-3xl overflow-hidden shadow-md shadow-[#38B6FF]/08 hover:shadow-xl hover:shadow-[#38B6FF]/15 transition-all hover:-translate-y-1 group"
              >
                <div className="relative">
                  <ImageWithFallback src={student.image} alt={student.name} className="w-full h-44 object-cover" />
                  <span className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full ${badgeColors[idx % badgeColors.length]}`} style={{ fontWeight: 700 }}>
                    {idx === 0 ? <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> Top Rated</span> : badgeLabels[idx % badgeLabels.length]}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                    <span className="text-xs text-[#1A1D20]" style={{ fontWeight: 700 }}>{student.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[#1A1D20] mb-0.5" style={{ fontWeight: 800 }}>{student.name}</h3>
                  <p className="text-[#6b7a8d] text-sm mb-3" style={{ fontWeight: 500 }}>{student.major}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {student.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="text-xs bg-[#EFF8FF] text-[#38B6FF] px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>{skill}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#38B6FF]" style={{ fontWeight: 800 }}>{student.hourlyRate || "Contact"}</span>
                    <span className="text-xs text-white bg-[#FFC107] text-[#1A1D20] px-4 py-1.5 rounded-full group-hover:bg-[#FFD000] transition-colors" style={{ fontWeight: 700, color: "#1A1D20" }}>
                      View Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Open Gigs */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1A1D20] text-xl" style={{ fontWeight: 800 }}>Open Gigs</h2>
          <Link to="/jobs" className="text-[#38B6FF] text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ fontWeight: 700 }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {gigs.length === 0
            ? [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-20 animate-pulse flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#EFF8FF] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#EFF8FF] rounded w-2/3" />
                    <div className="h-3 bg-[#EFF8FF] rounded w-1/3" />
                  </div>
                </div>
              ))
            : gigs.map((gig) => {
                const Icon = categoryIconMap[gig.category] || Briefcase;
                const color = categoryColorMap[gig.category] || "from-[#38B6FF] to-[#1a9fe8]";
                return (
                  <Link
                    to="/jobs"
                    key={gig.id}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-[#38B6FF]/10 transition-all group hover:-translate-y-0.5"
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#1A1D20] truncate" style={{ fontWeight: 700 }}>{gig.title}</h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>{gig.company}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#6b7a8d] flex items-center gap-1" style={{ fontWeight: 500 }}>
                          <MapPin className="w-3 h-3" />{gig.location}
                        </span>
                        <span className="text-xs text-[#6b7a8d]" style={{ fontWeight: 500 }}>{gig.applicants} applicants</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right space-y-1">
                      <p className="text-[#1A1D20]" style={{ fontWeight: 800 }}>{gig.budget}</p>
                      <span className="text-xs bg-[#FFC107] text-[#1A1D20] px-3 py-1 rounded-full block text-center" style={{ fontWeight: 700 }}>View Now</span>
                    </div>
                  </Link>
                );
              })}
        </div>
      </section>

      {/* Student of the Week */}
      {spotlightStudent && (
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] rounded-3xl overflow-hidden shadow-2xl shadow-[#38B6FF]/30 relative">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
            <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-[#FFC107] text-[#1A1D20] px-4 py-2 rounded-full text-sm" style={{ fontWeight: 700 }}>
                  <Star className="w-4 h-4 fill-current" />
                  Student of the Week
                </div>
                <div>
                  <h2 className="text-white text-3xl mb-1" style={{ fontWeight: 900 }}>{spotlightStudent.name}</h2>
                  <p className="text-white/80" style={{ fontWeight: 500 }}>{spotlightStudent.major} · {spotlightStudent.year}</p>
                  <p className="text-white/60 text-sm" style={{ fontWeight: 500 }}>{spotlightStudent.university}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {spotlightStudent.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>{skill}</span>
                  ))}
                </div>
                {spotlightStudent.reviews?.[0] && (
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-white/90 text-sm italic leading-relaxed">"{spotlightStudent.reviews[0].comment}"</p>
                    <p className="text-white/60 text-xs mt-2" style={{ fontWeight: 600 }}>— {spotlightStudent.reviews[0].author}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <Link to={`/profile/${spotlightStudent.id}`} className="bg-white text-[#38B6FF] px-6 py-3 rounded-full text-sm hover:shadow-lg transition-all hover:scale-105 active:scale-95" style={{ fontWeight: 700 }}>
                    View Profile
                  </Link>
                  <button className="bg-[#FFC107] text-[#1A1D20] px-6 py-3 rounded-full text-sm hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95" style={{ fontWeight: 700 }}>
                    Book Now
                  </button>
                </div>
              </div>
              <div className="relative flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-3xl bg-white/20 rotate-6" />
                  <ImageWithFallback src={spotlightStudent.image} alt={spotlightStudent.name} className="relative w-full h-full object-cover rounded-3xl shadow-2xl" />
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl">
                    <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 800 }}>{spotlightStudent.completedGigs} Gigs</p>
                    <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-[#1A1D20] text-2xl text-center mb-10" style={{ fontWeight: 900 }}>How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {howItWorks.map((item) => (
            <div key={item.step} className="bg-white rounded-3xl p-7 shadow-md shadow-[#38B6FF]/08 hover:shadow-xl hover:shadow-[#38B6FF]/12 transition-all hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg mb-5`}>
                <item.Icon className="w-7 h-7 text-white" />
              </div>
              <span className="text-[#38B6FF]/40 text-sm" style={{ fontWeight: 800 }}>{item.step}</span>
              <h3 className="text-[#1A1D20] mt-1 mb-2" style={{ fontWeight: 800 }}>{item.title}</h3>
              <p className="text-[#6b7a8d] text-sm leading-relaxed" style={{ fontWeight: 500 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-[#1A1D20] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,182,255,0.15)_0%,_transparent_70%)]" />
          <div className="relative space-y-5">
            <h2 className="text-white text-3xl md:text-4xl" style={{ fontWeight: 900 }}>Ready to Unleash Your Potential?</h2>
            <p className="text-white/60 max-w-md mx-auto" style={{ fontWeight: 500 }}>Join 2,500+ students already building their careers on Skillz Campus.</p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-[#FFC107] text-[#1A1D20] px-8 py-4 rounded-full hover:bg-[#FFD000] transition-all shadow-xl shadow-[#FFC107]/30 hover:scale-105 active:scale-95"
              style={{ fontWeight: 700 }}
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#38B6FF]/10 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-[#1A1D20] text-lg" style={{ fontWeight: 900 }}>Skillz<span className="text-[#38B6FF]">.</span></span>
          </div>
          <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>© 2026 Skillz Campus. All rights reserved.</p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="text-[#6b7a8d] text-sm hover:text-[#38B6FF] transition-colors" style={{ fontWeight: 500 }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
