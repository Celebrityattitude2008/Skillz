import { Navbar } from "../components/navbar";
import { Search, Plus, MapPin, Clock, Users, ChevronRight, Briefcase, DollarSign, X } from "lucide-react";
import { useState } from "react";

const gigsData = [
  {
    id: 1,
    title: "Logo Design for Coffee Shop",
    company: "Local Coffee Co.",
    description: "Looking for a creative designer to create a modern, minimalist logo for our new coffee shop. Must include brand colors and multiple format deliverables.",
    budget: "$500",
    applicants: 12,
    postedDate: "2 days ago",
    location: "Remote",
    category: "Design",
    skills: ["Logo Design", "Branding", "Adobe Illustrator"],
    emoji: "🎨",
    iconBg: "from-pink-400 to-rose-500",
    categoryColor: "bg-pink-100 text-pink-600",
  },
  {
    id: 2,
    title: "Website Development — E-commerce",
    company: "Fashion Boutique",
    description: "Need a full-stack developer to build an e-commerce website with payment integration, product catalog, and admin panel.",
    budget: "$2,500",
    applicants: 8,
    postedDate: "1 week ago",
    location: "Hybrid",
    category: "Dev",
    skills: ["React", "Node.js", "E-commerce"],
    emoji: "💻",
    iconBg: "from-violet-400 to-purple-500",
    categoryColor: "bg-violet-100 text-violet-600",
  },
  {
    id: 3,
    title: "Social Media Content Creation",
    company: "Tech Startup",
    description: "Seeking a creative content creator to produce engaging social media posts, reels, and stories. Must have experience with Instagram and TikTok.",
    budget: "$800/mo",
    applicants: 15,
    postedDate: "3 days ago",
    location: "Remote",
    category: "Marketing",
    skills: ["Content Creation", "Social Media", "Video Editing"],
    emoji: "📣",
    iconBg: "from-orange-400 to-red-500",
    categoryColor: "bg-orange-100 text-orange-600",
  },
  {
    id: 4,
    title: "Mobile App UI/UX Design",
    company: "Fitness App Co.",
    description: "Looking for an experienced UI/UX designer to redesign our fitness tracking app. Need wireframes, mockups, and interactive prototypes.",
    budget: "$1,200",
    applicants: 20,
    postedDate: "5 days ago",
    location: "Remote",
    category: "Design",
    skills: ["UI/UX", "Figma", "Mobile Design"],
    emoji: "✏️",
    iconBg: "from-pink-400 to-rose-500",
    categoryColor: "bg-pink-100 text-pink-600",
  },
  {
    id: 5,
    title: "Event Photography Coverage",
    company: "Alumni Association",
    description: "Need a skilled photographer for our annual alumni reunion event. Includes candid shots, group photos, and event coverage.",
    budget: "$400",
    applicants: 6,
    postedDate: "1 day ago",
    location: "On Campus",
    category: "Photo",
    skills: ["Photography", "Photo Editing", "Lightroom"],
    emoji: "📸",
    iconBg: "from-sky-400 to-blue-500",
    categoryColor: "bg-sky-100 text-sky-600",
  },
  {
    id: 6,
    title: "Tech Blog Writing — 5 Articles/Month",
    company: "Tech Review Blog",
    description: "Seeking tech-savvy writers to create in-depth reviews and articles about the latest gadgets and software. 1000+ words each.",
    budget: "$600/mo",
    applicants: 18,
    postedDate: "4 days ago",
    location: "Remote",
    category: "Writing",
    skills: ["Technical Writing", "SEO", "Research"],
    emoji: "✍️",
    iconBg: "from-amber-400 to-orange-500",
    categoryColor: "bg-amber-100 text-amber-600",
  },
];

const categories = [
  { label: "All", emoji: "✨" },
  { label: "Design", emoji: "🎨" },
  { label: "Dev", emoji: "💻" },
  { label: "Marketing", emoji: "📣" },
  { label: "Photo", emoji: "📸" },
  { label: "Writing", emoji: "✍️" },
];

type Gig = typeof gigsData[0];

function GigDetailModal({ gig, onClose }: { gig: Gig; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${gig.iconBg} p-7 rounded-t-3xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-4xl mb-3">{gig.emoji}</div>
          <h2 className="text-white text-xl leading-tight" style={{ fontWeight: 800 }}>{gig.title}</h2>
          <p className="text-white/80 text-sm mt-1" style={{ fontWeight: 500 }}>{gig.company}</p>
        </div>

        <div className="p-7 space-y-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <DollarSign className="w-4 h-4" />, label: "Budget", value: gig.budget, color: "text-[#38B6FF]" },
              { icon: <Users className="w-4 h-4" />, label: "Applicants", value: `${gig.applicants} applied`, color: "text-violet-500" },
              { icon: <MapPin className="w-4 h-4" />, label: "Location", value: gig.location, color: "text-emerald-500" },
              { icon: <Clock className="w-4 h-4" />, label: "Posted", value: gig.postedDate, color: "text-orange-500" },
            ].map((item) => (
              <div key={item.label} className="bg-[#EFF8FF] rounded-2xl p-3">
                <div className={`flex items-center gap-1.5 ${item.color} mb-1`}>
                  {item.icon}
                  <span className="text-xs text-[#6b7a8d]" style={{ fontWeight: 600 }}>{item.label}</span>
                </div>
                <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-[#6b7a8d] mb-2" style={{ fontWeight: 700 }}>DESCRIPTION</p>
            <p className="text-[#1A1D20] text-sm leading-relaxed" style={{ fontWeight: 500 }}>{gig.description}</p>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs text-[#6b7a8d] mb-2" style={{ fontWeight: 700 }}>SKILLS REQUIRED</p>
            <div className="flex flex-wrap gap-2">
              {gig.skills.map((skill) => (
                <span key={skill} className="bg-[#EFF8FF] text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/30 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ fontWeight: 700 }}>
            Apply for This Gig
          </button>
        </div>
      </div>
    </div>
  );
}

export function JobBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  const filteredGigs = gigsData.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || gig.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header banner */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#60c8ff] to-[#a8e0ff] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 900 }}>
            Find Your Next Gig
          </h1>
          <p className="text-white/80 mb-7" style={{ fontWeight: 500 }}>
            Real opportunities from local businesses · {gigsData.length} active listings
          </p>

          {/* Search bar */}
          <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl shadow-[#38B6FF]/20 max-w-xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-[#6b7a8d] shrink-0" />
              <input
                type="text"
                placeholder="Search gigs, skills, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-[#1A1D20] placeholder:text-[#6b7a8d] bg-transparent"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
              />
            </div>
            <button
              onClick={() => setShowPostForm(true)}
              className="bg-[#FFC107] text-[#1A1D20] px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95 shrink-0"
              style={{ fontWeight: 700 }}
            >
              <Plus className="w-4 h-4" />
              Post Gig
            </button>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" fill="#EFF8FF" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Briefcase className="w-5 h-5" />, value: gigsData.length.toString(), label: "Active Gigs", color: "from-[#38B6FF] to-[#1a9fe8]" },
            { icon: <Users className="w-5 h-5" />, value: "2,547", label: "Students", color: "from-violet-400 to-purple-500" },
            { icon: <DollarSign className="w-5 h-5" />, value: "$45K+", label: "Paid Out", color: "from-emerald-400 to-teal-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[#1A1D20]" style={{ fontWeight: 800 }}>{stat.value}</p>
                <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat.label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.label
                  ? "bg-[#38B6FF] text-white shadow-lg shadow-[#38B6FF]/30"
                  : "bg-white text-[#6b7a8d] hover:bg-[#daeeff] hover:text-[#1A1D20]"
              }`}
              style={{ fontWeight: 600 }}
            >
              <span>{cat.emoji}</span>
              <span className="text-sm">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-[#6b7a8d] text-sm mb-4" style={{ fontWeight: 600 }}>
          {filteredGigs.length} gig{filteredGigs.length !== 1 ? "s" : ""} found
        </p>

        {/* Gig list — app-listing style inspired by the reference */}
        <div className="space-y-3">
          {filteredGigs.map((gig) => (
            <button
              key={gig.id}
              onClick={() => setSelectedGig(gig)}
              className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-[#38B6FF]/10 transition-all group hover:-translate-y-0.5 text-left"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gig.iconBg} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                {gig.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[#1A1D20] truncate" style={{ fontWeight: 700 }}>{gig.title}</h3>
                  <span className="text-[#1A1D20] flex-shrink-0" style={{ fontWeight: 800 }}>{gig.budget}</span>
                </div>
                <p className="text-[#6b7a8d] text-sm mb-2" style={{ fontWeight: 500 }}>{gig.company}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full ${gig.categoryColor}`} style={{ fontWeight: 600 }}>
                    {gig.emoji} {gig.category}
                  </span>
                  <span className="text-xs text-[#6b7a8d] flex items-center gap-1" style={{ fontWeight: 500 }}>
                    <MapPin className="w-3 h-3" /> {gig.location}
                  </span>
                  <span className="text-xs text-[#6b7a8d] flex items-center gap-1" style={{ fontWeight: 500 }}>
                    <Clock className="w-3 h-3" /> {gig.postedDate}
                  </span>
                  <span className="text-xs text-[#6b7a8d]" style={{ fontWeight: 500 }}>{gig.applicants} applicants</span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#38B6FF] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filteredGigs.length === 0 && (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-[#1A1D20] text-lg mb-2" style={{ fontWeight: 800 }}>No gigs found</h3>
            <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>Try adjusting your search or category filters</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-[#1A1D20] to-[#2d3339] rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,182,255,0.12)_0%,_transparent_70%)]" />
          <div className="relative">
            <p className="text-2xl text-white mb-2" style={{ fontWeight: 900 }}>Need Help with a Project?</p>
            <p className="text-white/60 text-sm mb-6" style={{ fontWeight: 500 }}>Post your gig and connect with talented campus students</p>
            <button
              onClick={() => setShowPostForm(true)}
              className="bg-[#FFC107] text-[#1A1D20] px-8 py-3.5 rounded-full shadow-lg shadow-[#FFC107]/25 hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95"
              style={{ fontWeight: 700 }}
            >
              Post a Gig Now
            </button>
          </div>
        </div>
      </div>

      {/* Gig detail modal */}
      {selectedGig && (
        <GigDetailModal gig={selectedGig} onClose={() => setSelectedGig(null)} />
      )}

      {/* Post gig modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostForm(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <div className="bg-gradient-to-br from-[#FFC107] to-[#ff9f00] p-7 relative">
              <button
                onClick={() => setShowPostForm(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-4xl mb-3">📋</div>
              <h2 className="text-white text-xl" style={{ fontWeight: 800 }}>Post a Gig</h2>
              <p className="text-white/80 text-sm" style={{ fontWeight: 500 }}>Connect with campus talent</p>
            </div>
            <div className="p-7 space-y-4">
              {[
                { label: "Gig Title", placeholder: "e.g. Logo Design for Restaurant" },
                { label: "Your Company / Name", placeholder: "e.g. Local Coffee Co." },
                { label: "Budget", placeholder: "e.g. $500 or $200/month" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>{field.label.toUpperCase()}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full bg-[#EFF8FF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d]"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>DESCRIPTION</label>
                <textarea
                  placeholder="Describe the gig requirements..."
                  rows={3}
                  className="w-full bg-[#EFF8FF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d] resize-none"
                  style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
                />
              </div>
              <button className="w-full bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/30 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ fontWeight: 700 }}>
                Submit Gig Listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
