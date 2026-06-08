import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Mail, Phone, MapPin, Briefcase, Award, MessageCircle, Star,
  CheckCircle, Loader2, Send, Crown, Calendar,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Masonry from "react-responsive-masonry";
import {
  getStudentById, getStudents, addReview, incrementProfileView,
  incrementWhatsAppClick, updateAvailability,
  type StudentProfile as SP,
} from "../../lib/firestore";
import { useAuth } from "../../lib/auth-context";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
];

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110">
          <Star className={`w-7 h-7 ${n <= (hover || value) ? "text-[#FFC107] fill-[#FFC107]" : "text-slate-200 dark:text-slate-600"}`} />
        </button>
      ))}
    </div>
  );
}

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [student, setStudent] = useState<SP | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"portfolio" | "experience" | "reviews">("portfolio");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [showAvailForm, setShowAvailForm] = useState(false);
  const [availDays, setAvailDays] = useState<string[]>([]);
  const [availStart, setAvailStart] = useState("9:00 AM");
  const [availEnd, setAvailEnd] = useState("5:00 PM");
  const [savingAvail, setSavingAvail] = useState(false);

  const viewTracked = useRef(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!id) { setLoading(false); return; }
      let data = await getStudentById(id);
      if (!data) {
        const all = await getStudents();
        data = all[0] || null;
      }
      setStudent(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const isOwn = !!(user && student && user.uid === student.uid);
  const canReview = !!(user && !isOwn && !reviewSubmitted);

  useEffect(() => {
    if (student?.id && !isOwn && !viewTracked.current) {
      viewTracked.current = true;
      incrementProfileView(student.id);
    }
  }, [student?.id, isOwn]);

  useEffect(() => {
    if (showAvailForm && student?.availability) {
      setAvailDays(student.availability.days || []);
      setAvailStart(student.availability.startTime || "9:00 AM");
      setAvailEnd(student.availability.endTime || "5:00 PM");
    }
  }, [showAvailForm, student?.availability]);

  const reviews = (student?.reviews ?? []) as { id: number; author: string; role: string; rating: number; comment: string; date: string }[];
  const satisfactionRate = reviews.length > 0
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / reviews.length) * 100)
    : null;

  const whatsappMessage = student
    ? encodeURIComponent(`Hi ${student.name.split(" ")[0]}, I found your profile on Skillz Campus and I'd like to discuss a project with you. Are you available?`)
    : "";
  const whatsappUrl = student?.whatsappEnabled
    ? `https://wa.me/${student.whatsappNumber.replace(/\D/g, "")}?text=${whatsappMessage}`
    : "";

  const handleWhatsAppClick = () => {
    if (student?.id) incrementWhatsAppClick(student.id);
  };

  const bookDay = (day: string) => {
    if (!student) return;
    const timeRange = student.availability
      ? ` between ${student.availability.startTime}–${student.availability.endTime}` : "";
    const msg = encodeURIComponent(
      `Hi ${student.name.split(" ")[0]}, I'd like to book a consultation slot on ${day}${timeRange}. Are you available?`
    );
    if (student.whatsappEnabled && student.whatsappNumber) {
      if (student.id) incrementWhatsAppClick(student.id);
      window.open(`https://wa.me/${student.whatsappNumber.replace(/\D/g, "")}?text=${msg}`, "_blank");
    } else {
      window.open(`mailto:${student.email}?subject=Booking%20Request&body=${msg}`, "_blank");
    }
  };

  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student?.id) return;
    setSavingAvail(true);
    try {
      await updateAvailability(student.id, { days: availDays, startTime: availStart, endTime: availEnd });
      setStudent((prev) => prev ? { ...prev, availability: { days: availDays, startTime: availStart, endTime: availEnd } } : prev);
      setShowAvailForm(false);
    } catch { /* silent */ }
    setSavingAvail(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !student?.id || !reviewComment.trim()) return;
    setSubmitting(true);
    try {
      await addReview(student.id, {
        author: user.displayName || user.email?.split("@")[0] || "Client",
        role: reviewRole.trim() || "Client",
        rating: reviewRating,
        comment: reviewComment.trim(),
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        reviewerId: user.uid,
      });
      const newAvg =
        Math.round(([...reviews, { rating: reviewRating }].reduce((s, r) => s + r.rating, 0) /
          (reviews.length + 1)) * 10) / 10;
      setStudent((prev) => prev ? {
        ...prev,
        rating: newAvg,
        reviews: [...reviews, {
          id: Date.now(), author: user.displayName || user.email?.split("@")[0] || "Client",
          role: reviewRole.trim() || "Client", rating: reviewRating,
          comment: reviewComment.trim(),
          date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        }],
      } : prev);
      setReviewSubmitted(true);
      setReviewComment("");
      setReviewRole("");
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto" />
            <p className="text-slate-500 dark:text-slate-400" style={{ fontWeight: 500 }}>Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-[#38B6FF]" />
            </div>
            <p className="text-slate-900 dark:text-white text-lg" style={{ fontWeight: 800 }}>Profile not found</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>This student profile doesn't exist yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#2fa8f0] to-[#1a6fcc] relative overflow-hidden pt-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 30C480 60 240 10 0 40L0 80Z" className="fill-[#dbeafe] dark:fill-[#0d1321]" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative">
        {/* Profile card */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-xl shadow-blue-200/20 dark:shadow-slate-900/50 border border-white/60 dark:border-slate-700/40 p-7 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative flex-shrink-0">
              <ImageWithFallback src={student.image} alt={student.name} className="w-28 h-28 rounded-2xl object-cover shadow-lg" />
              {student.verificationStatus === "Verified" && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#38B6FF] flex items-center justify-center shadow-md">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl text-slate-900 dark:text-white" style={{ fontWeight: 900 }}>{student.name}</h1>
                    {student.isPro && (
                      <span className="flex items-center gap-1 bg-[#FFC107] text-slate-900 text-[11px] px-2.5 py-1 rounded-full shadow-sm" style={{ fontWeight: 800 }}>
                        <Crown className="w-3 h-3 fill-slate-900" /> Pro
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>
                    {student.major} · {student.year} · {student.university}
                  </p>
                </div>
                {student.rating > 0 && (
                  <span className="bg-[#FFC107] text-slate-900 text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ fontWeight: 700 }}>
                    <Star className="w-3.5 h-3.5 fill-current" /> {student.rating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4" style={{ fontWeight: 500 }}>{student.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill) => (
                  <span key={skill} className="bg-blue-50 dark:bg-blue-900/30 text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-blue-50 dark:border-slate-700/60 flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400" style={{ fontWeight: 500 }}>
              <Mail className="w-4 h-4 text-[#38B6FF]" /> {student.email}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400" style={{ fontWeight: 500 }}>
              <MapPin className="w-4 h-4 text-[#38B6FF]" /> {student.location}
            </span>
            {student.whatsappEnabled && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick}
                className="ml-auto bg-[#25D366] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#20bd5a] transition-all hover:scale-105 active:scale-95 shadow-md shadow-green-400/25"
                style={{ fontWeight: 700 }}>
                <MessageCircle className="w-4 h-4" />
                Contact on WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-1.5 shadow-sm border border-white/60 dark:border-slate-700/40 flex gap-1">
              {(["portfolio", "experience", "reviews"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-sm capitalize transition-all ${
                    activeTab === tab
                      ? "bg-[#38B6FF] text-white shadow-md shadow-[#38B6FF]/30"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  style={{ fontWeight: 600 }}>
                  {tab}
                  {tab === "reviews" && reviews.length > 0 && (
                    <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === "reviews" ? "bg-white/25" : "bg-[#38B6FF]/10 text-[#38B6FF]"}`}>
                      {reviews.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {activeTab === "portfolio" && (
              <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800">
                <h2 className="text-white mb-5" style={{ fontWeight: 800 }}>Visual Portfolio</h2>
                {student.portfolio.length > 0 ? (
                  <Masonry columnsCount={2} columnsCountBreakPoints={{ 350: 1, 768: 2 }} gutter="0.75rem">
                    {student.portfolio.map((item) => (
                      <div key={item.id} className="group relative overflow-hidden rounded-2xl">
                        <ImageWithFallback src={item.image} alt={item.title} className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-sm" style={{ fontWeight: 600 }}>{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </Masonry>
                ) : (
                  <p className="text-white/50 text-sm text-center py-10" style={{ fontWeight: 500 }}>No portfolio items yet.</p>
                )}
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/25">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Experience</h2>
                  </div>
                  <div className="space-y-5">
                    {student.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-[#38B6FF] pl-5 pb-5 last:pb-0">
                        <h3 className="text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>{exp.role}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>{exp.organization} · {exp.period}</p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed" style={{ fontWeight: 500 }}>{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFC107] to-[#ff9f00] flex items-center justify-center shadow-md shadow-amber-300/25">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Education</h2>
                  </div>
                  <div className="border-l-4 border-[#FFC107] pl-5">
                    <h3 className="text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>{student.education.degree}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>{student.education.university} · {student.education.period}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1" style={{ fontWeight: 600 }}>GPA: {student.education.gpa}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Reviews</h2>
                    {satisfactionRate !== null && (
                      <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 700 }}>
                        {satisfactionRate}% satisfied
                      </span>
                    )}
                  </div>
                  {reviews.length === 0 ? (
                    <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-6" style={{ fontWeight: 500 }}>No reviews yet.</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="border border-blue-50 dark:border-slate-700/60 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 700 }}>{r.author}</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>{r.role} · {r.date}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <Star key={n} className={`w-4 h-4 ${n <= r.rating ? "text-[#FFC107] fill-[#FFC107]" : "text-slate-200 dark:text-slate-600"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed" style={{ fontWeight: 500 }}>{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>

                {canReview && (
                  <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
                    <h3 className="text-slate-900 dark:text-white mb-4" style={{ fontWeight: 800 }}>Leave a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm mb-2" style={{ fontWeight: 600 }}>Rating</label>
                        <StarPicker value={reviewRating} onChange={setReviewRating} />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm mb-1.5" style={{ fontWeight: 600 }}>Your Role</label>
                        <input type="text" value={reviewRole} onChange={(e) => setReviewRole(e.target.value)}
                          placeholder="e.g. Marketing Manager, Startup Founder…"
                          className="w-full bg-blue-50/50 dark:bg-slate-700/50 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder:text-slate-400 border border-blue-100/50 dark:border-slate-600/40 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-sm"
                          style={{ fontWeight: 500 }} />
                      </div>
                      <div>
                        <label className="block text-slate-700 dark:text-slate-300 text-sm mb-1.5" style={{ fontWeight: 600 }}>Review</label>
                        <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                          placeholder={`Share your experience working with ${student.name.split(" ")[0]}…`}
                          rows={4}
                          className="w-full bg-blue-50/50 dark:bg-slate-700/50 rounded-xl px-4 py-2.5 text-slate-800 dark:text-white placeholder:text-slate-400 border border-blue-100/50 dark:border-slate-600/40 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-sm resize-none"
                          style={{ fontWeight: 500 }} />
                      </div>
                      <button type="submit" disabled={submitting || !reviewComment.trim()}
                        className="flex items-center gap-2 bg-[#38B6FF] text-white px-6 py-3 rounded-2xl hover:bg-[#1a9fe8] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#38B6FF]/25 hover:scale-[1.02] active:scale-[0.98]"
                        style={{ fontWeight: 700 }}>
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {submitting ? "Submitting…" : "Submit Review"}
                      </button>
                    </form>
                  </div>
                )}

                {reviewSubmitted && (
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl px-5 py-4 border border-emerald-200/40 dark:border-emerald-800/30">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p style={{ fontWeight: 600 }}>Thanks for your review! It's now live on this profile.</p>
                  </div>
                )}

                {!user && (
                  <div className="bg-blue-50/80 dark:bg-slate-700/50 rounded-2xl p-5 text-center border border-blue-100/30 dark:border-slate-600/30">
                    <p className="text-slate-600 dark:text-slate-300 text-sm" style={{ fontWeight: 500 }}>
                      Sign in to leave a review for {student.name.split(" ")[0]}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Profile Stats */}
            <div className="bg-gradient-to-br from-[#38B6FF] to-[#1a6fcc] rounded-3xl p-6 text-white shadow-xl shadow-blue-400/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
              <h3 className="mb-5" style={{ fontWeight: 800 }}>Profile Stats</h3>
              <div className="space-y-4">
                {[
                  { value: `${student.completedGigs}+`, label: "Completed Projects" },
                  { value: satisfactionRate !== null ? `${satisfactionRate}%` : "New", label: "Satisfaction Rate" },
                  { value: student.education.gpa.split(" ")[0], label: "Academic GPA" },
                ].map((stat, i) => (
                  <div key={i} className={i > 0 ? "border-t border-white/20 pt-4" : ""}>
                    <p className="text-3xl" style={{ fontWeight: 900 }}>{stat.value}</p>
                    <p className="text-white/70 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Get in Touch */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-6">
              <h3 className="text-slate-900 dark:text-white mb-4" style={{ fontWeight: 800 }}>Get in Touch</h3>
              <div className="space-y-3 mb-5">
                {[
                  { icon: <Mail className="w-4 h-4" />, text: student.email },
                  { icon: <Phone className="w-4 h-4" />, text: student.phone },
                  { icon: <MapPin className="w-4 h-4" />, text: student.location },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-slate-500 dark:text-slate-400" style={{ fontWeight: 500 }}>
                    <span className="text-[#38B6FF]">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
              {student.whatsappEnabled && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleWhatsAppClick}
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-2xl hover:bg-[#20bd5a] transition-all shadow-md shadow-green-400/20 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontWeight: 700 }}>
                  <MessageCircle className="w-5 h-5" />
                  Contact on WhatsApp
                </a>
              )}
            </div>

            {/* Book now */}
            <div className="bg-[#FFC107] rounded-3xl p-6 shadow-lg shadow-amber-300/25">
              <p className="text-slate-900 mb-1" style={{ fontWeight: 800 }}>Ready to collaborate?</p>
              {student.hourlyRate && (
                <p className="text-slate-700 text-sm mb-4" style={{ fontWeight: 500 }}>Starting at {student.hourlyRate}</p>
              )}
              <a
                href={`mailto:${student.email}?subject=Project%20Inquiry%20via%20Skillz%20Campus&body=Hi%20${encodeURIComponent(student.name.split(" ")[0])}%2C%20I%20found%20your%20profile%20on%20Skillz%20Campus%20and%20I%27d%20like%20to%20work%20with%20you.%20Are%20you%20available%3F`}
                className="block w-full text-center bg-slate-900 text-white py-3 rounded-2xl hover:bg-slate-800 transition-colors"
                style={{ fontWeight: 700 }}>
                Book {student.name.split(" ")[0]}
              </a>
            </div>

            {/* Booking Calendar */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-sm">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Book a Consultation</h3>
              </div>

              {isOwn ? (
                student.isPro ? (
                  <div>
                    {!showAvailForm ? (
                      <div>
                        {student.availability?.days?.length ? (
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-2" style={{ fontWeight: 500 }}>Your availability:</p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {student.availability.days.map((d) => (
                                <span key={d} className="bg-blue-50 dark:bg-blue-900/20 text-[#38B6FF] text-xs px-2.5 py-1 rounded-lg" style={{ fontWeight: 600 }}>{d}</span>
                              ))}
                            </div>
                            <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>
                              {student.availability.startTime} – {student.availability.endTime}
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-400 dark:text-slate-500 text-sm" style={{ fontWeight: 500 }}>No availability set yet.</p>
                        )}
                        <button onClick={() => setShowAvailForm(true)}
                          className="mt-3 text-[#38B6FF] text-sm hover:text-[#1a9fe8] transition-colors"
                          style={{ fontWeight: 600 }}>
                          {student.availability?.days?.length ? "Edit" : "Set"} Availability
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSaveAvailability} className="space-y-3">
                        <div>
                          <p className="text-slate-700 dark:text-slate-300 text-xs mb-2" style={{ fontWeight: 600 }}>Available days</p>
                          <div className="flex flex-wrap gap-1.5">
                            {DAYS_OF_WEEK.map((day) => (
                              <button key={day} type="button"
                                onClick={() => setAvailDays((prev) =>
                                  prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                                )}
                                className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                                  availDays.includes(day)
                                    ? "bg-[#38B6FF] text-white"
                                    : "bg-blue-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400"
                                }`}
                                style={{ fontWeight: 600 }}>
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-slate-700 dark:text-slate-300 text-xs mb-1" style={{ fontWeight: 600 }}>From</p>
                            <select value={availStart} onChange={(e) => setAvailStart(e.target.value)}
                              className="w-full bg-blue-50/50 dark:bg-slate-700/50 rounded-xl px-2 py-2 text-slate-800 dark:text-white text-xs border border-blue-100/50 dark:border-slate-600/40 outline-none"
                              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                              {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                            <p className="text-slate-700 dark:text-slate-300 text-xs mb-1" style={{ fontWeight: 600 }}>To</p>
                            <select value={availEnd} onChange={(e) => setAvailEnd(e.target.value)}
                              className="w-full bg-blue-50/50 dark:bg-slate-700/50 rounded-xl px-2 py-2 text-slate-800 dark:text-white text-xs border border-blue-100/50 dark:border-slate-600/40 outline-none"
                              style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                              {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" disabled={savingAvail || availDays.length === 0}
                            className="flex-1 bg-[#38B6FF] text-white py-2 rounded-xl text-xs hover:bg-[#1a9fe8] transition-colors disabled:opacity-50"
                            style={{ fontWeight: 700 }}>
                            {savingAvail ? "Saving…" : "Save"}
                          </button>
                          <button type="button" onClick={() => setShowAvailForm(false)}
                            className="px-4 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            style={{ fontWeight: 600 }}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <div className="w-10 h-10 rounded-xl bg-[#FFC107]/10 flex items-center justify-center mx-auto mb-3">
                      <Crown className="w-5 h-5 text-[#FFC107] fill-[#FFC107]" />
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-sm mb-1" style={{ fontWeight: 700 }}>Pro Feature</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-3" style={{ fontWeight: 500 }}>Upgrade to Pro to set your booking availability and let clients schedule slots</p>
                    <a
                      href={`mailto:skillz@zohomail.com?subject=Pro%20Upgrade%20Request&body=Hi%20Skillz%2C%20I%27d%20like%20to%20upgrade%20to%20Pro.%20My%20email%20is%3A%20${encodeURIComponent(student.email)}`}
                      className="inline-flex items-center gap-1.5 bg-[#FFC107] text-slate-900 text-xs px-3 py-2 rounded-full hover:bg-[#FFD000] transition-colors shadow-sm"
                      style={{ fontWeight: 800 }}>
                      <Crown className="w-3 h-3 fill-slate-900" /> Upgrade — ₦2,000/mo
                    </a>
                  </div>
                )
              ) : student.availability?.days?.length ? (
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-3" style={{ fontWeight: 500 }}>
                    {student.availability.startTime} – {student.availability.endTime}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {student.availability.days.map((day) => (
                      <button key={day} onClick={() => bookDay(day)}
                        className="bg-blue-50 dark:bg-blue-900/20 text-[#38B6FF] text-xs px-3 py-1.5 rounded-xl hover:bg-[#38B6FF] hover:text-white transition-colors"
                        style={{ fontWeight: 600 }}>
                        {day}
                      </button>
                    ))}
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-[11px]" style={{ fontWeight: 500 }}>Tap a day to request a slot via WhatsApp or email</p>
                </div>
              ) : (
                <p className="text-slate-400 dark:text-slate-500 text-sm" style={{ fontWeight: 500 }}>Availability not set yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
