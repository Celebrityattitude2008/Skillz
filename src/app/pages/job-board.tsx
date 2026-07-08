import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Search, Plus, MapPin, Clock, Users, Briefcase, DollarSign, X,
  Palette, Code2, PenLine, Camera, Megaphone, LayoutGrid, FileText, LogIn, Tag,
  CheckCircle, XCircle, SendHorizontal, Loader2, ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getGigs, addGig, deleteGig, applyToGig, hasApplied, getApplicationsByGig,
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
  Design: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  Dev: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  Writing: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  Photo: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  Marketing: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
};
const statusColors: Record<string, string> = {
  "Open": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Completed": "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-400",
};
const appStatusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};
const categories = [
  { label: "All", Icon: LayoutGrid }, { label: "Design", Icon: Palette },
  { label: "Dev", Icon: Code2 }, { label: "Marketing", Icon: Megaphone },
  { label: "Photo", Icon: Camera }, { label: "Writing", Icon: PenLine },
];

function GigDetailModal({ gig, onClose, onGigUpdate, onGigDelete }: { gig: Gig; onClose: () => void; onGigUpdate?: (updated: Gig) => void; onGigDelete?: (id: string) => void; }) {
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
    if (user && !isOwner) hasApplied(gig.id, user.uid).then(setApplied).catch(() => {});
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
        gigId: gig.id, gigTitle: gig.title,
        studentId: user.uid,
        studentName: user.displayName || user.email || "Student",
        studentImage: user.photoURL || "", coverLetter, status: "Pending",
        appliedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        gigPosterId: gig.postedBy,
      });
      setApplied(true); setShowApplyForm(false);
    } catch { alert("Application failed. Please try again."); }
    finally { setApplying(false); }
  };

  const handleStatusChange = async (newStatus: "Open" | "In Progress" | "Completed") => {
    if (!gig.id) return;
    setStatusUpdating(true);
    await updateGigStatus(gig.id, newStatus);
    setCurrentStatus(newStatus);
    onGigUpdate?.({ ...gig, status: newStatus });
    setStatusUpdating(false);
  };

  const handleDeleteGig = async () => {
    if (!gig.id) return;
    if (!window.confirm("Delete this gig? This cannot be undone.")) return;
    await deleteGig(gig.id);
    onGigDelete?.(gig.id);
    onClose();
  };

  const handleAppStatus = async (appId: string, status: "Accepted" | "Rejected") => {
    await updateApplicationStatus(appId, status);
    setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-200/20 dark:shadow-slate-900/60 border border-white/60 dark:border-slate-700/40"
        onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'Nunito', sans-serif" }}>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: <DollarSign className="w-4 h-4" />, label: "Budget", value: gig.budget, color: "text-[#38B6FF]" },
              { icon: <Users className="w-4 h-4" />, label: "Applicants", value: `${gig.applicants} applied`, color: "text-violet-500" },
              { icon: <MapPin className="w-4 h-4" />, label: "Location", value: gig.location, color: "text-emerald-500" },
              { icon: <Clock className="w-4 h-4" />, label: "Posted", value: gig.postedDate, color: "text-orange-500" },
            ].map((item) => (
              <div key={item.label} className="bg-blue-50/80 dark:bg-slate-700/50 rounded-2xl p-3">
                <div className={`flex items-center gap-1.5 ${item.color} mb-1`}>
                  {item.icon}
                  <span className="text-xs text-slate-500 dark:text-slate-400" style={{ fontWeight: 600 }}>{item.label}</span>
                </div>
                <p className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 700 }}>{item.value}</p>
              </div>
            ))}
          </div>

          {gig.deadline && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400" style={{ fontWeight: 500 }}>
              <Clock className="w-4 h-4 text-[#38B6FF]" />
              <span>Deadline: <span className="text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>{gig.deadline}</span></span>
            </div>
          )}

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2" style={{ fontWeight: 700 }}>DESCRIPTION</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed" style={{ fontWeight: 500 }}>{gig.description}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2" style={{ fontWeight: 700 }}>SKILLS REQUIRED</p>
            <div className="flex flex-wrap gap-2">
              {gig.skills.map((skill) => (
                <span key={skill} className="bg-blue-50 dark:bg-blue-900/30 text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>{skill}</span>
              ))}
            </div>
          </div>

          {isOwner && (
            <div className="border-t border-blue-50 dark:border-slate-700/60 pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400" style={{ fontWeight: 700 }}>MANAGE STATUS</p>
                {statusUpdating && <Loader2 className="w-4 h-4 text-[#38B6FF] animate-spin" />}
              </div>
              <div className="flex gap-2">
                {(["Open", "In Progress", "Completed"] as const).map((s) => (
                  <button key={s} onClick={() => handleStatusChange(s)} disabled={statusUpdating}
                    className={`flex-1 py-2.5 rounded-xl text-xs transition-all ${currentStatus === s ? statusColors[s] + " ring-2 ring-offset-1 ring-current" : "bg-blue-50/80 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-slate-700"}`}
                    style={{ fontWeight: 700 }}>
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t border-blue-50 dark:border-slate-700/60">
                <button onClick={handleDeleteGig}
                  className="px-4 py-3 rounded-2xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                  Delete Gig
                </button>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3" style={{ fontWeight: 700 }}>APPLICANTS ({applications.length})</p>
                {loadingApps ? (
                  <div className="text-center py-4"><Loader2 className="w-5 h-5 text-[#38B6FF] animate-spin mx-auto" /></div>
                ) : applications.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-4 bg-blue-50/80 dark:bg-slate-700/50 rounded-2xl" style={{ fontWeight: 500 }}>No applications yet</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-blue-50/80 dark:bg-slate-700/50 rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3">
                            {app.studentImage ? (
                              <ImageWithFallback src={app.studentImage} alt={app.studentName} className="w-9 h-9 rounded-xl object-cover" />
                            ) : (
                              <div className="w-9 h-9 rounded-xl bg-[#38B6FF] flex items-center justify-center text-white text-sm" style={{ fontWeight: 800 }}>{app.studentName[0]}</div>
                            )}
                            <div>
                              <p className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 700 }}>{app.studentName}</p>
                              <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>{app.appliedDate}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full ${appStatusColors[app.status]}`} style={{ fontWeight: 600 }}>{app.status}</span>
                        </div>
                        {app.coverLetter && (
                          <p className="text-slate-600 dark:text-slate-400 text-xs italic mb-3 leading-relaxed" style={{ fontWeight: 500 }}>"{app.coverLetter}"</p>
                        )}
                        {app.status === "Pending" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleAppStatus(app.id!, "Accepted")}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500 text-white rounded-xl text-xs hover:bg-emerald-600 transition-colors"
                              style={{ fontWeight: 700 }}>
                              <CheckCircle className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button onClick={() => handleAppStatus(app.id!, "Rejected")}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
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

          {!isOwner && (
            <>
              {!user ? (
                <Link to="/auth" onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/25 hover:shadow-xl transition-all"
                  style={{ fontWeight: 700 }}>
                  <LogIn className="w-5 h-5" /> Sign In to Apply
                </Link>
              ) : applied ? (
                <div className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 py-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/40"
                  style={{ fontWeight: 700 }}>
                  <CheckCircle className="w-5 h-5" /> Application Submitted
                </div>
              ) : showApplyForm ? (
                <div className="space-y-3 border-t border-blue-50 dark:border-slate-700/60 pt-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400" style={{ fontWeight: 700 }}>COVER LETTER (OPTIONAL)</p>
                  <textarea rows={4}
                    placeholder="Tell the client why you're a great fit…"
                    value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                  <div className="flex gap-3">
                    <button onClick={() => setShowApplyForm(false)}
                      className="flex-1 py-3.5 rounded-2xl bg-blue-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-sm hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                      style={{ fontWeight: 600 }}>Cancel</button>
                    <button onClick={handleApply} disabled={applying}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#FFC107] text-slate-900 text-sm shadow-lg shadow-amber-300/25 hover:bg-[#FFD000] transition-all disabled:opacity-60"
                      style={{ fontWeight: 700 }}>
                      {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                      {applying ? "Sending…" : "Submit Application"}
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowApplyForm(true)}
                  className="w-full bg-[#FFC107] text-slate-900 py-4 rounded-2xl shadow-lg shadow-amber-300/25 hover:bg-[#FFD000] transition-all hover:scale-[1.02] active:scale-[0.98]"
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
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const isClient = profile?.role === "client";
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", budget: "", description: "", category: "Design", location: "Remote", deadline: "" });
  const [gigSkills, setGigSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    Promise.all([getGigs(), getStudents()]).then(([g, s]) => {
      setGigs(g); setStudentCount(s.length);
    }).finally(() => setLoading(false));
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch && (selectedCategory === "All" || gig.category === selectedCategory);
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
      const newGig: Omit<Gig, "id"> = { ...form, skills: gigSkills, applicants: 0, postedDate: "Just now", postedBy: user.uid, status: "Open" };
      const ref = await addGig(newGig);
      setGigs((prev) => [{ id: ref.id, ...newGig }, ...prev]);
      setShowPostForm(false);
      setForm({ title: "", company: "", budget: "", description: "", category: "Design", location: "Remote", deadline: "" });
      setGigSkills([]); setSkillInput("");
    } finally { setPosting(false); }
  };

  const handleGigUpdate = (updated: Gig) => {
    setGigs((prev) => prev.map((g) => g.id === updated.id ? updated : g));
    if (selectedGig?.id === updated.id) setSelectedGig(updated);
  };

  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#2fa8f0] to-[#1a6fcc] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 900 }}>Find Your Next Gig</h1>
          <p className="text-white/80 mb-7" style={{ fontWeight: 500 }}>
            Real opportunities from local businesses · {gigs.length} active listings
          </p>
          <div className="flex gap-3 bg-white dark:bg-slate-800/95 rounded-2xl p-2 shadow-2xl shadow-blue-900/20 max-w-xl">
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input type="text" placeholder="Search gigs, skills, companies..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-slate-800 dark:text-white placeholder:text-slate-400 bg-transparent"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
            </div>
            {(user && isClient) && (
              <button onClick={() => setShowPostForm(true)}
                className="bg-[#FFC107] text-slate-900 px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-[#FFD000] transition-all hover:scale-105 active:scale-95 shrink-0"
                style={{ fontWeight: 700 }}>
                <Plus className="w-4 h-4" /> Post Gig
              </button>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" className="fill-[#dbeafe] dark:fill-[#0d1321]" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { Icon: Briefcase, value: gigs.length.toString(), label: "Active Gigs", color: "from-[#38B6FF] to-[#1a9fe8]" },
            { Icon: Users, value: studentCount > 0 ? studentCount.toString() : "—", label: "Students", color: "from-violet-400 to-purple-500" },
            { Icon: DollarSign, value: `${gigs.filter(g => g.status === "Completed").length}`, label: "Completed Gigs", color: "from-emerald-400 to-teal-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-800/80 rounded-2xl p-3 sm:p-4 shadow-sm shadow-blue-100/20 dark:shadow-slate-900/30 border border-white/60 dark:border-slate-700/40 flex flex-col items-center text-center gap-2 sm:flex-row sm:text-left sm:gap-3">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                <stat.Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm sm:text-base" style={{ fontWeight: 800 }}>{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs leading-tight" style={{ fontWeight: 500 }}>{stat.label}</p>
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
                  : "bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 border border-white/60 dark:border-slate-700/40 hover:text-slate-900 dark:hover:text-white"
              }`}
              style={{ fontWeight: 600 }}>
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4" style={{ fontWeight: 600 }}>
          {filteredGigs.length} gig{filteredGigs.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 h-24 animate-pulse flex gap-4 items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-700/50 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-blue-50 dark:bg-slate-700/50 rounded w-2/3" />
                  <div className="h-3 bg-blue-50 dark:bg-slate-700/50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGigs.map((gig) => {
              const Icon = categoryIconMap[gig.category] || Briefcase;
              const color = categoryColorMap[gig.category] || "from-[#38B6FF] to-[#1a9fe8]";
              const badgeColor = categoryBadgeMap[gig.category] || "bg-blue-50 text-[#38B6FF]";
              const status = gig.status || "Open";
              return (
                <button key={gig.id} onClick={() => setSelectedGig(gig)}
                  className="w-full flex items-center gap-4 bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm shadow-blue-100/20 dark:shadow-slate-900/30 hover:shadow-md hover:shadow-blue-200/20 dark:hover:shadow-slate-900/40 transition-all border border-white/60 dark:border-slate-700/40 text-left group hover:-translate-y-0.5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-slate-900 dark:text-white truncate" style={{ fontWeight: 700 }}>{gig.title}</h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full flex-shrink-0 hidden sm:block ${badgeColor}`} style={{ fontWeight: 600 }}>{gig.category}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>{gig.company}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{gig.location}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{gig.applicants} applicants</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status]}`} style={{ fontWeight: 600 }}>{status}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>{gig.budget}</p>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-end mt-1">
                      <Clock className="w-3 h-3" /> {gig.postedDate}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredGigs.length === 0 && (
              <div className="bg-white dark:bg-slate-800/80 rounded-3xl p-14 text-center shadow-sm border border-white/60 dark:border-slate-700/40">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-[#38B6FF]" />
                </div>
                <h3 className="text-slate-900 dark:text-white text-lg mb-2" style={{ fontWeight: 800 }}>No gigs found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>Try a different search or category</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gig Detail Modal */}
      {selectedGig && <GigDetailModal gig={selectedGig} onClose={() => setSelectedGig(null)} onGigUpdate={handleGigUpdate} onGigDelete={(id) => setGigs((prev) => prev.filter((gig) => gig.id !== id))} />}

      {/* Post Gig Modal */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPostForm(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-white/60 dark:border-slate-700/40"
            onClick={(e) => e.stopPropagation()} style={{ fontFamily: "'Nunito', sans-serif" }}>
            <div className="bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] p-7 rounded-t-3xl relative">
              <button onClick={() => setShowPostForm(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-white hover:bg-white/40">
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-white text-xl" style={{ fontWeight: 800 }}>Post a New Gig</h2>
              <p className="text-white/80 text-sm mt-1" style={{ fontWeight: 500 }}>Find the right student for the job</p>
            </div>

            <form onSubmit={handlePostGig} className="p-7 space-y-4">
              {!user && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4 flex items-center gap-3">
                  <LogIn className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-amber-700 dark:text-amber-400 text-sm" style={{ fontWeight: 500 }}>
                    <Link to="/auth" onClick={() => setShowPostForm(false)} className="underline font-bold">Sign in</Link> to post a gig
                  </p>
                </div>
              )}

              {[
                { label: "JOB TITLE", key: "title", placeholder: "e.g. Brand Identity Design", type: "text" },
                { label: "COMPANY / NAME", key: "company", placeholder: "e.g. TechStartup Lagos", type: "text" },
                { label: "BUDGET", key: "budget", placeholder: "e.g. ₦50,000 or $200", type: "text" },
                { label: "DEADLINE (OPTIONAL)", key: "deadline", placeholder: "e.g. June 30, 2025", type: "text" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>{label}</label>
                  <input type={type} placeholder={placeholder} required={key !== "deadline"}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                </div>
              ))}

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>DESCRIPTION</label>
                <textarea rows={4} placeholder="Describe what you need done, requirements, and expectations..."
                  value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required
                  className="w-full bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                  style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1" style={{ fontWeight: 700 }}>
                    <Tag className="w-3 h-3" /> CATEGORY
                  </label>
                  <div className="relative">
                    <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white appearance-none"
                      style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>
                      {["Design", "Dev", "Marketing", "Photo", "Writing"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1" style={{ fontWeight: 700 }}>
                    <MapPin className="w-3 h-3" /> LOCATION
                  </label>
                  <div className="relative">
                    <select value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                      className="w-full bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white appearance-none"
                      style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>
                      {["Remote", "On-site", "Hybrid"].map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>SKILLS NEEDED</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Add skill (press Enter)"
                    value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKey}
                    className="flex-1 bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                  <button type="button" onClick={addGigSkill}
                    className="px-4 py-3 bg-[#38B6FF] text-white rounded-xl hover:bg-[#1a9fe8] transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {gigSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gigSkills.map((s) => (
                      <span key={s} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
                        {s}
                        <button type="button" onClick={() => setGigSkills((p) => p.filter((x) => x !== s))}>
                          <X className="w-3 h-3 hover:text-red-400 transition-colors" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={posting || !user}
                className="w-full bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/30 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 mt-2 flex items-center justify-center gap-2"
                style={{ fontWeight: 700 }}>
                {posting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting…</> : "Post Gig"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
