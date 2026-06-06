import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Search, Plus, MapPin, Clock, Users, ChevronRight, Briefcase, DollarSign, X,
  Palette, Code2, PenLine, Camera, Megaphone, LayoutGrid, FileText, LogIn, Tag,
  CheckCircle, XCircle, SendHorizontal, Loader2, ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getGigs, addGig, applyToGig, hasApplied, getApplicationsByGig,
  updateApplicationStatus, updateGigStatus, getStudents,
  type Gig, type Application,
} from "../../lib/firestore";
import { useAuth } from "../../lib/auth-context";

const categoryIconMap: Record<string, React.ElementType> = {
  Design: Palette, Dev: Code2, Writing: PenLine, Photo: Camera,
  Marketing: Megaphone, All: LayoutGrid,
};
const categoryColorMap: Record<string, string> = {
  Design: "from-pink-400 to-rose-500", Dev: "from-violet-400 to-purple-500",
  Writing: "from-amber-400 to-orange-500", Photo: "from-sky-400 to-blue-500",
  Marketing: "from-orange-400 to-red-500", All: "from-[#38B6FF] to-[#1a9fe8]",
};
const categoryBadgeMap: Record<string, string> = {
  Design: "bg-pink-100 text-pink-600", Dev: "bg-violet-100 text-violet-600",
  Writing: "bg-amber-100 text-amber-600", Photo: "bg-sky-100 text-sky-600",
  Marketing: "bg-orange-100 text-orange-600",
};
const statusColors: Record<string, string> = {
  "Open": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Completed": "bg-gray-100 text-gray-600",
};
const appStatusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-600",
};
const categories = [
  { label: "All", Icon: LayoutGrid }, { label: "Design", Icon: Palette },
  { label: "Dev", Icon: Code2 }, { label: "Marketing", Icon: Megaphone },
  { label: "Photo", Icon: Camera }, { label: "Writing", Icon: PenLine },
];

function GigDetailModal({
  gig, onClose, onGigUpdate,
}: {
  gig: Gig;
  onClose: () => void;
  onGigUpdate?: (updated: Gig) => void;
}) {
  const { user } = useAuth();
  const Icon = categoryIconMap[gig.category] || Briefcase;
  const color = categoryColorMap[gig.category] || "from-[#38B6FF] to-[#1a9fe8]";

  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>(gig.status || "Open");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const isOwner = !!(user && gig.postedBy && gig.postedBy === user.uid);

  useEffect(() => {
    if (!gig.id) return;
    if (user && !isOwner) {
      hasApplied(gig.id, user.uid).then(setApplied).catch(() => {});
    }
    if (isOwner) {
      setLoadingApps(true);
      getApplicationsByGig(gig.id).then(setApplications).catch(() => {}).finally(() => setLoadingApps(false));
    }
  }, [gig.id, user, isOwner]);

  const handleApply = async () => {
    if (!user || !gig.id) return;
    setApplying(true);
    try {
      await applyToGig({
        gigId: gig.id,
        gigTitle: gig.title,
        studentId: user.uid,
        studentName: user.displayName || user.email || "Student",
        studentImage: user.photoURL || "",
        coverLetter,
        status: "Pending",
        appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        gigPosterId: gig.postedBy,
      });
      setApplied(true);
      setShowApplyForm(false);
    } catch {
      alert("Application failed. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleStatusChange = async (newStatus: "Open" | "In Progress" | "Completed") => {
    if (!gig.id) return;
    setStatusUpdating(true);
    await updateGigStatus(gig.id, newStatus);
    setCurrentStatus(newStatus);
    onGigUpdate?.({ ...gig, status: newStatus });
    setStatusUpdating(false);
  };

  const handleAppStatus = async (appId: string, status: "Accepted" | "Rejected") => {
    await updateApplicationStatus(appId, status);
    setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${color} p-7 rounded-t-3xl relative`}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-white text-xl leading-tight" style={{ fontWeight: 800 }}>{gig.title}</h2>
              <p className="text-white/80 text-sm mt-1" style={{ fontWeight: 500 }}>{gig.company}</p>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-full ${statusColors[currentStatus] || statusColors["Open"]}`} style={{ fontWeight: 700 }}>
              {currentStatus}
            </span>
          </div>
        </div>

        <div className="p-7 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {gig.deadline && (
            <div className="flex items-center gap-2 text-sm text-[#6b7a8d]" style={{ fontWeight: 500 }}>
              <Clock className="w-4 h-4 text-[#38B6FF]" />
              <span>Deadline: <span className="text-[#1A1D20]" style={{ fontWeight: 700 }}>{gig.deadline}</span></span>
            </div>
          )}

          <div>
            <p className="text-xs text-[#6b7a8d] mb-2" style={{ fontWeight: 700 }}>DESCRIPTION</p>
            <p className="text-[#1A1D20] text-sm leading-relaxed" style={{ fontWeight: 500 }}>{gig.description}</p>
          </div>

          <div>
            <p className="text-xs text-[#6b7a8d] mb-2" style={{ fontWeight: 700 }}>SKILLS REQUIRED</p>
            <div className="flex flex-wrap gap-2">
              {gig.skills.map((skill) => (
                <span key={skill} className="bg-[#EFF8FF] text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>{skill}</span>
              ))}
            </div>
          </div>

          {/* ── Gig Owner Section ─────────────────────────── */}
          {isOwner && (
            <div className="border-t border-[#EFF8FF] pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#6b7a8d]" style={{ fontWeight: 700 }}>MANAGE STATUS</p>
                {statusUpdating && <Loader2 className="w-4 h-4 text-[#38B6FF] animate-spin" />}
              </div>
              <div className="flex gap-2">
                {(["Open", "In Progress", "Completed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={statusUpdating}
                    className={`flex-1 py-2.5 rounded-xl text-xs transition-all ${currentStatus === s ? statusColors[s] + " ring-2 ring-offset-1 ring-current" : "bg-[#EFF8FF] text-[#6b7a8d] hover:bg-[#daeeff]"}`}
                    style={{ fontWeight: 700 }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div>
                <p className="text-xs text-[#6b7a8d] mb-3" style={{ fontWeight: 700 }}>
                  APPLICANTS ({applications.length})
                </p>
                {loadingApps ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-5 h-5 text-[#38B6FF] animate-spin mx-auto" />
                  </div>
                ) : applications.length === 0 ? (
                  <p className="text-[#6b7a8d] text-sm text-center py-4 bg-[#EFF8FF] rounded-2xl" style={{ fontWeight: 500 }}>
                    No applications yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-[#EFF8FF] rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3">
                            {app.studentImage ? (
                              <ImageWithFallback src={app.studentImage} alt={app.studentName}
                                className="w-9 h-9 rounded-xl object-cover" />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-[#38B6FF] flex items-center justify-center text-white text-sm" style={{ fontWeight: 800 }}>
                                {app.studentName[0]}
                              </div>
                            )}
                            <div>
                              <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 700 }}>{app.studentName}</p>
                              <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>{app.appliedDate}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full ${appStatusColors[app.status]}`} style={{ fontWeight: 600 }}>
                            {app.status}
                          </span>
                        </div>
                        {app.coverLetter && (
                          <p className="text-[#1A1D20] text-xs italic mb-3 leading-relaxed" style={{ fontWeight: 500 }}>
                            "{app.coverLetter}"
                          </p>
                        )}
                        {app.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAppStatus(app.id!, "Accepted")}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 text-white rounded-xl text-xs hover:bg-emerald-600 transition-colors"
                              style={{ fontWeight: 700 }}>
                              <CheckCircle className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              onClick={() => handleAppStatus(app.id!, "Rejected")}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-100 text-red-600 rounded-xl text-xs hover:bg-red-200 transition-colors"
                              style={{ fontWeight: 700 }}>
                              <XCircle className="w-3.5 h-3.5" /> Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Non-owner / Student Apply Section ─────────── */}
          {!isOwner && (
            <>
              {!user ? (
                <Link to="/auth" onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 bg-[#38B6FF] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/25 hover:bg-[#1a9fe8] transition-all"
                  style={{ fontWeight: 700 }}>
                  <LogIn className="w-5 h-5" /> Sign In to Apply
                </Link>
              ) : applied ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-4 rounded-2xl border border-emerald-200"
                  style={{ fontWeight: 700 }}>
                  <CheckCircle className="w-5 h-5" /> Application Submitted
                </div>
              ) : showApplyForm ? (
                <div className="space-y-3 border-t border-[#EFF8FF] pt-4">
                  <p className="text-xs text-[#6b7a8d]" style={{ fontWeight: 700 }}>COVER LETTER (OPTIONAL)</p>
                  <textarea
                    rows={4}
                    placeholder="Tell the client why you're a great fit, your relevant experience, and your approach…"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full bg-[#EFF8FF] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d] resize-none"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setShowApplyForm(false)}
                      className="flex-1 py-3.5 rounded-2xl bg-[#EFF8FF] text-[#6b7a8d] text-sm hover:bg-[#daeeff] transition-colors"
                      style={{ fontWeight: 600 }}>
                      Cancel
                    </button>
                    <button onClick={handleApply} disabled={applying}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#FFC107] text-[#1A1D20] text-sm shadow-lg shadow-[#FFC107]/25 hover:bg-[#FFD000] transition-all disabled:opacity-60"
                      style={{ fontWeight: 700 }}>
                      {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                      {applying ? "Sending…" : "Submit Application"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="w-full bg-[#FFC107] text-[#1A1D20] py-4 rounded-2xl shadow-lg shadow-[#FFC107]/25 hover:bg-[#FFD000] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontWeight: 700 }}>
                  Apply for This Gig
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function JobBoard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", budget: "", description: "", category: "Design", location: "Remote", deadline: "" });
  const [gigSkills, setGigSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    Promise.all([
      getGigs(),
      getStudents(),
    ]).then(([g, s]) => {
      setGigs(g);
      setStudentCount(s.length);
    }).finally(() => setLoading(false));
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || gig.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addGigSkill = () => {
    const s = skillInput.trim();
    if (s && !gigSkills.includes(s)) setGigSkills((p) => [...p, s]);
    setSkillInput("");
  };

  const handleSkillKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addGigSkill(); }
  };

  const handlePostGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowPostForm(false); return; }
    setPosting(true);
    try {
      const newGig: Omit<Gig, "id"> = {
        ...form,
        skills: gigSkills,
        applicants: 0,
        postedDate: "Just now",
        postedBy: user.uid,
        status: "Open",
      };
      const ref = await addGig(newGig);
      setGigs((prev) => [{ id: ref.id, ...newGig }, ...prev]);
      setShowPostForm(false);
      setForm({ title: "", company: "", budget: "", description: "", category: "Design", location: "Remote", deadline: "" });
      setGigSkills([]);
      setSkillInput("");
    } finally {
      setPosting(false);
    }
  };

  const handleGigUpdate = (updated: Gig) => {
    setGigs((prev) => prev.map((g) => g.id === updated.id ? updated : g));
    if (selectedGig?.id === updated.id) setSelectedGig(updated);
  };

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#60c8ff] to-[#a8e0ff] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 900 }}>Find Your Next Gig</h1>
          <p className="text-white/80 mb-7" style={{ fontWeight: 500 }}>
            Real opportunities from local businesses · {gigs.length} active listings
          </p>
          <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl shadow-[#38B6FF]/20 max-w-xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-[#6b7a8d] shrink-0" />
              <input type="text" placeholder="Search gigs, skills, companies..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-[#1A1D20] placeholder:text-[#6b7a8d] bg-transparent"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
            </div>
            <button onClick={() => setShowPostForm(true)}
              className="bg-[#FFC107] text-[#1A1D20] px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95 shrink-0"
              style={{ fontWeight: 700 }}>
              <Plus className="w-4 h-4" /> Post Gig
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" fill="#EFF8FF" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { Icon: Briefcase, value: gigs.length.toString(), label: "Active Gigs", color: "from-[#38B6FF] to-[#1a9fe8]" },
            { Icon: Users, value: studentCount > 0 ? studentCount.toString() : "—", label: "Students", color: "from-violet-400 to-purple-500" },
            { Icon: DollarSign, value: `${gigs.filter(g => g.status === "Completed").length}`, label: "Completed Gigs", color: "from-emerald-400 to-teal-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                <stat.Icon className="w-5 h-5" />
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
          {categories.map(({ label, Icon }) => (
            <button key={label} onClick={() => setSelectedCategory(label)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === label
                  ? "bg-[#38B6FF] text-white shadow-lg shadow-[#38B6FF]/30"
                  : "bg-white text-[#6b7a8d] hover:bg-[#daeeff] hover:text-[#1A1D20]"
              }`}
              style={{ fontWeight: 600 }}>
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        <p className="text-[#6b7a8d] text-sm mb-4" style={{ fontWeight: 600 }}>
          {filteredGigs.length} gig{filteredGigs.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-24 animate-pulse flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#EFF8FF] flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#EFF8FF] rounded w-2/3" />
                  <div className="h-3 bg-[#EFF8FF] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGigs.map((gig) => {
              const Icon = categoryIconMap[gig.category] || Briefcase;
              const color = categoryColorMap[gig.category] || "from-[#38B6FF] to-[#1a9fe8]";
              const badgeColor = categoryBadgeMap[gig.category] || "bg-[#EFF8FF] text-[#38B6FF]";
              const status = gig.status || "Open";
              return (
                <button key={gig.id} onClick={() => setSelectedGig(gig)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:shadow-[#38B6FF]/10 transition-all group hover:-translate-y-0.5 text-left">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[#1A1D20] truncate" style={{ fontWeight: 700 }}>{gig.title}</h3>
                      <span className="text-[#1A1D20] flex-shrink-0" style={{ fontWeight: 800 }}>{gig.budget}</span>
                    </div>
                    <p className="text-[#6b7a8d] text-sm mb-2" style={{ fontWeight: 500 }}>{gig.company}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${badgeColor}`} style={{ fontWeight: 600 }}>{gig.category}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full ${statusColors[status]}`} style={{ fontWeight: 600 }}>{status}</span>
                      <span className="text-xs text-[#6b7a8d] flex items-center gap-1" style={{ fontWeight: 500 }}>
                        <MapPin className="w-3 h-3" /> {gig.location}
                      </span>
                      <span className="text-xs text-[#6b7a8d] flex items-center gap-1" style={{ fontWeight: 500 }}>
                        <Clock className="w-3 h-3" /> {gig.postedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs bg-[#FFC107] text-[#1A1D20] px-3 py-1.5 rounded-full" style={{ fontWeight: 700 }}>View</span>
                    <ChevronRight className="w-4 h-4 text-[#38B6FF] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!loading && filteredGigs.length === 0 && (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF8FF] flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#38B6FF]" />
            </div>
            <h3 className="text-[#1A1D20] text-lg mb-2" style={{ fontWeight: 800 }}>No gigs found</h3>
            <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>Try adjusting your search or category filters</p>
          </div>
        )}

        <div className="mt-10 bg-gradient-to-br from-[#1A1D20] to-[#2d3339] rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(56,182,255,0.12)_0%,_transparent_70%)]" />
          <div className="relative">
            <p className="text-2xl text-white mb-2" style={{ fontWeight: 900 }}>Need Help with a Project?</p>
            <p className="text-white/60 text-sm mb-6" style={{ fontWeight: 500 }}>Post your gig and connect with talented campus students</p>
            <button onClick={() => setShowPostForm(true)}
              className="bg-[#FFC107] text-[#1A1D20] px-8 py-3.5 rounded-full shadow-lg shadow-[#FFC107]/25 hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95"
              style={{ fontWeight: 700 }}>
              Post a Gig Now
            </button>
          </div>
        </div>
      </div>

      {selectedGig && (
        <GigDetailModal gig={selectedGig} onClose={() => setSelectedGig(null)} onGigUpdate={handleGigUpdate} />
      )}

      {/* Post Gig Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="bg-gradient-to-br from-[#FFC107] to-[#ff9f00] p-7 relative flex-shrink-0">
              <button onClick={() => setShowPostForm(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white text-xl" style={{ fontWeight: 800 }}>Post a Gig</h2>
              <p className="text-white/80 text-sm" style={{ fontWeight: 500 }}>Connect with campus talent</p>
            </div>

            {!user ? (
              <div className="p-8 text-center flex-1">
                <div className="w-14 h-14 rounded-2xl bg-[#EFF8FF] flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-7 h-7 text-[#38B6FF]" />
                </div>
                <h3 className="text-[#1A1D20] text-lg mb-2" style={{ fontWeight: 800 }}>Sign In to Post</h3>
                <p className="text-[#6b7a8d] text-sm mb-6" style={{ fontWeight: 500 }}>
                  Create a free account to post gigs and connect with campus talent.
                </p>
                <Link to="/auth" onClick={() => setShowPostForm(false)}
                  className="block bg-[#38B6FF] text-white py-3.5 rounded-2xl text-sm shadow-lg shadow-[#38B6FF]/25 hover:bg-[#1a9fe8] transition-all"
                  style={{ fontWeight: 700 }}>
                  Sign In / Join Free
                </Link>
              </div>
            ) : (
              <form onSubmit={handlePostGig} className="p-7 space-y-4 overflow-y-auto flex-1">
                {[
                  { key: "title", label: "Gig Title", placeholder: "e.g. Logo Design for Restaurant" },
                  { key: "company", label: "Your Company / Name", placeholder: "e.g. Local Coffee Co." },
                  { key: "budget", label: "Budget", placeholder: "e.g. ₦50,000 or ₦20,000/month" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>{field.label.toUpperCase()}</label>
                    <input type="text" placeholder={field.placeholder}
                      value={(form as Record<string, string>)[field.key]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                      required
                      className="w-full bg-[#EFF8FF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d] text-sm"
                      style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                  </div>
                ))}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>CATEGORY</label>
                    <div className="relative">
                      <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        className="w-full bg-[#EFF8FF] rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] text-sm appearance-none"
                        style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>
                        {["Design", "Dev", "Marketing", "Photo", "Writing", "Music", "Video"].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a8d] pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>LOCATION</label>
                    <div className="relative">
                      <select value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                        className="w-full bg-[#EFF8FF] rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] text-sm appearance-none"
                        style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>
                        {["Remote", "On Campus", "Hybrid", "In Person"].map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a8d] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>DEADLINE (OPTIONAL)</label>
                  <input type="date" value={form.deadline}
                    onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                    className="w-full bg-[#EFF8FF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] text-sm"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                </div>

                <div>
                  <label className="text-xs text-[#6b7a8d] mb-1.5 flex items-center gap-1.5" style={{ fontWeight: 700 }}>
                    <Tag className="w-3.5 h-3.5 text-[#38B6FF]" /> SKILLS NEEDED
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="Add a skill (press Enter)"
                      value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKey}
                      className="flex-1 bg-[#EFF8FF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d] text-sm"
                      style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                    <button type="button" onClick={addGigSkill}
                      className="px-4 bg-[#38B6FF] rounded-xl text-white hover:bg-[#1a9fe8] transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {gigSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {gigSkills.map((s) => (
                        <span key={s} className="flex items-center gap-1.5 bg-[#EFF8FF] text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
                          {s}
                          <button type="button" onClick={() => setGigSkills((p) => p.filter((x) => x !== s))}>
                            <X className="w-3 h-3 hover:text-red-400 transition-colors" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>DESCRIPTION</label>
                  <textarea placeholder="Describe the gig requirements, deliverables, and any specific skills needed..." rows={3}
                    value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    required
                    className="w-full bg-[#EFF8FF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d] resize-none text-sm"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                </div>

                <button type="submit" disabled={posting}
                  className="w-full bg-gradient-to-r from-[#FFC107] to-[#ff9f00] text-[#1A1D20] py-4 rounded-2xl shadow-lg shadow-[#FFC107]/25 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ fontWeight: 700 }}>
                  {posting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</> : "Post Gig"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
