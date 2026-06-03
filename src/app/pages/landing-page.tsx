import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ArrowRight, Search, Star, Zap, TrendingUp, Users, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const categories = [
  { label: "Design", emoji: "🎨", color: "from-pink-400 to-rose-500" },
  { label: "Dev", emoji: "💻", color: "from-violet-400 to-purple-500" },
  { label: "Writing", emoji: "✍️", color: "from-amber-400 to-orange-500" },
  { label: "Photo", emoji: "📸", color: "from-sky-400 to-blue-500" },
  { label: "Video", emoji: "🎬", color: "from-emerald-400 to-teal-500" },
  { label: "Music", emoji: "🎵", color: "from-fuchsia-400 to-purple-500" },
  { label: "Marketing", emoji: "📣", color: "from-orange-400 to-red-500" },
];

const featuredStudents = [
  {
    id: "1",
    name: "Sarah Johnson",
    major: "Graphic Design",
    university: "State University",
    rating: 4.9,
    reviews: 34,
    skills: ["UI/UX", "Branding", "Figma"],
    rate: "$45/hr",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&auto=format",
    badge: "⭐ Top Rated",
    badgeColor: "bg-[#FFC107] text-[#1A1D20]",
  },
  {
    id: "2",
    name: "Marcus Williams",
    major: "Computer Science",
    university: "Tech University",
    rating: 4.8,
    reviews: 27,
    skills: ["React", "Node.js", "TypeScript"],
    rate: "$60/hr",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
    badge: "🔥 Rising",
    badgeColor: "bg-orange-100 text-orange-600",
  },
  {
    id: "3",
    name: "Aisha Patel",
    major: "Marketing",
    university: "Business College",
    rating: 5.0,
    reviews: 19,
    skills: ["Content", "SEO", "Social Media"],
    rate: "$35/hr",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format",
    badge: "✨ New",
    badgeColor: "bg-[#EFF8FF] text-[#38B6FF]",
  },
];

const recentGigs = [
  {
    id: 1,
    title: "Logo Design for Coffee Shop",
    company: "Local Coffee Co.",
    budget: "$500",
    category: "Design",
    categoryColor: "bg-pink-100 text-pink-600",
    icon: "🎨",
    iconBg: "from-pink-400 to-rose-500",
    location: "Remote",
    applicants: 12,
  },
  {
    id: 2,
    title: "React Developer for Dashboard",
    company: "Fashion Boutique",
    budget: "$2,500",
    category: "Dev",
    categoryColor: "bg-violet-100 text-violet-600",
    icon: "💻",
    iconBg: "from-violet-400 to-purple-500",
    location: "Hybrid",
    applicants: 8,
  },
  {
    id: 3,
    title: "Social Media Content Package",
    company: "Tech Startup",
    budget: "$800/mo",
    category: "Marketing",
    categoryColor: "bg-orange-100 text-orange-600",
    icon: "📣",
    iconBg: "from-orange-400 to-red-500",
    location: "Remote",
    applicants: 15,
  },
  {
    id: 4,
    title: "Event Photography Coverage",
    company: "Alumni Association",
    budget: "$400",
    category: "Photo",
    categoryColor: "bg-sky-100 text-sky-600",
    icon: "📸",
    iconBg: "from-sky-400 to-blue-500",
    location: "On-site",
    applicants: 5,
  },
];

const studentOfWeek = {
  id: "1",
  name: "Sarah Johnson",
  major: "Graphic Design · Senior",
  university: "State University",
  image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=600&h=600&fit=crop&auto=format",
  skills: ["UI/UX Design", "Branding", "Illustration", "Figma"],
  review: "Working with Sarah was an absolute pleasure! Her creative vision and attention to detail transformed our startup's branding completely.",
  reviewer: "Michael Chen, Tech Founder",
  rating: 5,
  completedGigs: 34,
};

export function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Sky-blue gradient bg matching the inspiration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#38B6FF] via-[#60c8ff] to-[#a8e0ff] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_60%)]" />

        {/* Floating decorative blobs */}
        <div className="absolute top-16 right-16 w-24 h-24 rounded-full bg-white/20 blur-xl" />
        <div className="absolute bottom-8 left-12 w-16 h-16 rounded-full bg-[#FFC107]/30 blur-lg" />

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
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

              {/* Search */}
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
                <button className="bg-[#FFC107] text-[#1A1D20] px-5 py-3 rounded-xl shadow-md hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95" style={{ fontWeight: 700 }}>
                  Search
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                {[
                  { value: "2,547", label: "Students" },
                  { value: "12,891", label: "Gigs Done" },
                  { value: "47", label: "Departments" },
                ].map((stat) => (
                  <div key={stat.label} className="text-white">
                    <p className="text-2xl" style={{ fontWeight: 800 }}>{stat.value}</p>
                    <p className="text-white/70 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="relative hidden lg:block h-[440px]">
              {/* Main profile card */}
              <div className="absolute right-0 top-0 w-64 bg-white rounded-3xl shadow-2xl shadow-[#38B6FF]/20 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=220&fit=crop&auto=format"
                  alt="Students collaborating"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 800 }}>Sarah Johnson</p>
                  <p className="text-[#6b7a8d] text-xs mb-3" style={{ fontWeight: 500 }}>UI/UX Design · $45/hr</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                      <span className="text-xs text-[#1A1D20]" style={{ fontWeight: 700 }}>4.9</span>
                    </div>
                    <span className="text-xs bg-[#EFF8FF] text-[#38B6FF] px-3 py-1 rounded-full" style={{ fontWeight: 700 }}>View Profile</span>
                  </div>
                </div>
              </div>

              {/* Floating stat: Users */}
              <div className="absolute left-0 top-10 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 -rotate-3 hover:rotate-0 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/30">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[#1A1D20] text-base" style={{ fontWeight: 800 }}>2,547</p>
                  <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>Active Portfolios</p>
                </div>
              </div>

              {/* Floating stat: Trending */}
              <div className="absolute left-6 bottom-20 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3 rotate-2 hover:rotate-0 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC107] to-[#ff9f00] flex items-center justify-center shadow-md shadow-[#FFC107]/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[#1A1D20] text-base" style={{ fontWeight: 800 }}>+340</p>
                  <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>New This Month</p>
                </div>
              </div>

              {/* Rating bubble */}
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

        {/* Wave divider */}
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

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Link
              to="/jobs"
              key={cat.label}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {cat.emoji}
              </div>
              <span className="text-[#1A1D20] text-xs whitespace-nowrap" style={{ fontWeight: 700 }}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Talent */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1A1D20] text-xl" style={{ fontWeight: 800 }}>Featured Talent</h2>
          <Link to="/profile/1" className="text-[#38B6FF] text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ fontWeight: 700 }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {featuredStudents.map((student) => (
            <Link
              to={`/profile/${student.id}`}
              key={student.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md shadow-[#38B6FF]/08 hover:shadow-xl hover:shadow-[#38B6FF]/15 transition-all hover:-translate-y-1 group"
            >
              <div className="relative">
                <ImageWithFallback
                  src={student.image}
                  alt={student.name}
                  className="w-full h-44 object-cover"
                />
                <span className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full ${student.badgeColor}`} style={{ fontWeight: 700 }}>
                  {student.badge}
                </span>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                  <span className="text-xs text-[#1A1D20]" style={{ fontWeight: 700 }}>{student.rating}</span>
                  <span className="text-xs text-[#6b7a8d]">({student.reviews})</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-[#1A1D20] mb-0.5" style={{ fontWeight: 800 }}>{student.name}</h3>
                <p className="text-[#6b7a8d] text-sm mb-3" style={{ fontWeight: 500 }}>{student.major}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {student.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-[#EFF8FF] text-[#38B6FF] px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#38B6FF]" style={{ fontWeight: 800 }}>{student.rate}</span>
                  <span className="text-xs text-white bg-[#38B6FF] px-4 py-1.5 rounded-full group-hover:bg-[#1a9fe8] transition-colors" style={{ fontWeight: 700 }}>
                    Hire
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Gigs */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#1A1D20] text-xl" style={{ fontWeight: 800 }}>Open Gigs</h2>
          <Link to="/jobs" className="text-[#38B6FF] text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ fontWeight: 700 }}>
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentGigs.map((gig) => (
            <Link
              to="/jobs"
              key={gig.id}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-[#38B6FF]/10 transition-all group hover:-translate-y-0.5"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gig.iconBg} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                {gig.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-[#1A1D20] truncate" style={{ fontWeight: 700 }}>{gig.title}</h3>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>{gig.company}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${gig.categoryColor}`} style={{ fontWeight: 600 }}>{gig.category}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#6b7a8d] flex items-center gap-1" style={{ fontWeight: 500 }}>
                    <MapPin className="w-3 h-3" />{gig.location}
                  </span>
                  <span className="text-xs text-[#6b7a8d]" style={{ fontWeight: 500 }}>{gig.applicants} applicants</span>
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="text-[#1A1D20]" style={{ fontWeight: 800 }}>{gig.budget}</p>
                <ChevronRight className="w-4 h-4 text-[#38B6FF] ml-auto mt-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Student of the Week */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] rounded-3xl overflow-hidden shadow-2xl shadow-[#38B6FF]/30 relative">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#FFC107] text-[#1A1D20] px-4 py-2 rounded-full text-sm" style={{ fontWeight: 700 }}>
                <Star className="w-4 h-4 fill-current" />
                Student of the Week
              </div>

              <div>
                <h2 className="text-white text-3xl mb-1" style={{ fontWeight: 900 }}>{studentOfWeek.name}</h2>
                <p className="text-white/80" style={{ fontWeight: 500 }}>{studentOfWeek.major}</p>
                <p className="text-white/60 text-sm" style={{ fontWeight: 500 }}>{studentOfWeek.university}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {studentOfWeek.skills.map((skill) => (
                  <span key={skill} className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
                    {skill}
                  </span>
                ))}
              </div>

              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-white/90 text-sm italic leading-relaxed">"{studentOfWeek.review}"</p>
                <p className="text-white/60 text-xs mt-2" style={{ fontWeight: 600 }}>— {studentOfWeek.reviewer}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/profile/${studentOfWeek.id}`}
                  className="bg-white text-[#38B6FF] px-6 py-3 rounded-full text-sm hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                  style={{ fontWeight: 700 }}
                >
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
                <ImageWithFallback
                  src={studentOfWeek.image}
                  alt={studentOfWeek.name}
                  className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 800 }}>{studentOfWeek.completedGigs} Gigs</p>
                  <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-[#1A1D20] text-2xl text-center mb-10" style={{ fontWeight: 900 }}>How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Create Your Profile", desc: "Showcase your skills, portfolio, and set your rates. Get verified by your campus.", icon: "✨", color: "from-[#38B6FF] to-[#1a9fe8]" },
            { step: "02", title: "Discover Gigs", desc: "Browse real opportunities posted by local businesses and community members.", icon: "🔍", color: "from-[#FFC107] to-[#ff9f00]" },
            { step: "03", title: "Get Paid", desc: "Complete the work, receive payment directly, and build your reputation.", icon: "💰", color: "from-emerald-400 to-teal-500" },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-3xl p-7 shadow-md shadow-[#38B6FF]/08 hover:shadow-xl hover:shadow-[#38B6FF]/12 transition-all hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg mb-5`}>
                {item.icon}
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
              to="/jobs"
              className="inline-flex items-center gap-2 bg-[#38B6FF] text-white px-8 py-4 rounded-full hover:bg-[#1a9fe8] transition-all shadow-xl shadow-[#38B6FF]/30 hover:scale-105 active:scale-95"
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-[#1A1D20]" style={{ fontWeight: 900 }}>Skillz Campus</span>
          </div>
          <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>© 2026 Skillz Campus · Empowering student talent</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a key={item} href="#" className="text-[#6b7a8d] text-sm hover:text-[#38B6FF] transition-colors" style={{ fontWeight: 600 }}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
