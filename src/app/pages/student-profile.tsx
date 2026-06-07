import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Mail, Phone, MapPin, Briefcase, Award, MessageCircle, Star,
  CheckCircle, Loader2, Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Masonry from "react-responsive-masonry";
import {
  getStudentById, getStudents, addReview,
  type StudentProfile as SP,
} from "../../lib/firestore";
import { useAuth } from "../../lib/auth-context";

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
                  <h1 className="text-2xl text-slate-900 dark:text-white" style={{ fontWeight: 900 }}>{student.name}</h1>
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
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="ml-auto bg-[#25D366] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#20bd5a] transition-all hover:scale-105 active:scale-95 shadow-md shadow-green-400/25"
                style={{ fontWeight: 700 }}>
                <MessageCircle className="w-4 h-4" />
                Contact on WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-1.5 shadow-sm border border-white/60 dark:border-slate-700/40 flex gap-1">
              {(["portfolio", "experience", "reviews"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-sm capitalize transition-all relative ${
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
                    <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Client Reviews</h2>
                    {satisfactionRate !== null && (
                      <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full text-sm" style={{ fontWeight: 700 }}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        {satisfactionRate}% satisfaction
                      </div>
                    )}
                  </div>

                  {reviews.length > 0 ? reviews.map((review) => (
                    <div key={review.id} className="bg-blue-50/80 dark:bg-slate-700/50 rounded-2xl p-5 border border-blue-100/30 dark:border-slate-600/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>{review.author}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>{review.role}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "text-[#FFC107] fill-[#FFC107]" : "text-slate-200 dark:text-slate-600"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed" style={{ fontWeight: 500 }}>"{review.comment}"</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-2" style={{ fontWeight: 500 }}>{review.date}</p>
                    </div>
                  )) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-6" style={{ fontWeight: 500 }}>No reviews yet — be the first!</p>
                  )}
                </div>

                {/* Review submission form */}
                {canReview && (
                  <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
                    <h3 className="text-slate-900 dark:text-white mb-4" style={{ fontWeight: 800 }}>Leave a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2" style={{ fontWeight: 700 }}>YOUR RATING</p>
                        <StarPicker value={reviewRating} onChange={setReviewRating} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2" style={{ fontWeight: 700 }}>YOUR ROLE / COMPANY <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span></p>
                        <input type="text" value={reviewRole} onChange={(e) => setReviewRole(e.target.value)}
                          placeholder="e.g. Marketing Manager at XYZ"
                          className="w-full bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400"
                          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2" style={{ fontWeight: 700 }}>YOUR REVIEW</p>
                        <textarea rows={3} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience working with this student…"
                          required
                          className="w-full bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 resize-none"
                          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                      </div>
                      <button type="submit" disabled={submitting || !reviewComment.trim()}
                        className="w-full flex items-center justify-center gap-2 bg-[#FFC107] text-slate-900 py-3.5 rounded-2xl shadow-md shadow-amber-300/25 hover:bg-[#FFD000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-3" style={{ fontWeight: 500 }}>
                      Sign in to leave a review for {student.name.split(" ")[0]}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-[#38B6FF] to-[#1a6fcc] rounded-3xl p-6 text-white shadow-xl shadow-blue-400/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
              <h3 className="mb-5" style={{ fontWeight: 800 }}>Profile Stats</h3>
              <div className="space-y-4">
                {[
                  { value: `${student.completedGigs}+`, label: "Completed Projects" },
                  {
                    value: satisfactionRate !== null ? `${satisfactionRate}%` : "New",
                    label: "Satisfaction Rate",
                  },
                  { value: student.education.gpa.split(" ")[0], label: "Academic GPA" },
                ].map((stat, i) => (
                  <div key={i} className={i > 0 ? "border-t border-white/20 pt-4" : ""}>
                    <p className="text-3xl" style={{ fontWeight: 900 }}>{stat.value}</p>
                    <p className="text-white/70 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

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
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-2xl hover:bg-[#20bd5a] transition-all shadow-md shadow-green-400/20 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontWeight: 700 }}>
                  <MessageCircle className="w-5 h-5" />
                  Contact on WhatsApp
                </a>
              )}
            </div>

            <div className="bg-[#FFC107] rounded-3xl p-6 shadow-lg shadow-amber-300/25">
              <p className="text-slate-900 mb-1" style={{ fontWeight: 800 }}>Ready to collaborate?</p>
              {student.hourlyRate && (
                <p className="text-slate-700 text-sm mb-4" style={{ fontWeight: 500 }}>Starting at {student.hourlyRate}</p>
              )}
              {student.whatsappEnabled ? (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center bg-slate-900 text-white py-3 rounded-2xl hover:bg-slate-800 transition-colors"
                  style={{ fontWeight: 700 }}>
                  Book {student.name.split(" ")[0]}
                </a>
              ) : (
                <button className="w-full bg-slate-900 text-white py-3 rounded-2xl hover:bg-slate-800 transition-colors" style={{ fontWeight: 700 }}>
                  Book {student.name.split(" ")[0]}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
