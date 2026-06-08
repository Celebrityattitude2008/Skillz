import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Briefcase, CheckCircle, Clock, XCircle, Star, TrendingUp, User,
  FileText, Zap, ChevronRight, Loader2, AlertCircle, Crown, Eye, MessageCircle, BarChart2,
  Gift, Copy, Check, Users,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { getStudentByUid, getStudentByEmail, getApplicationsByStudent, getReferralsByStudent, type StudentProfile, type Application, type Referral } from "../../lib/firestore";
import { useAuth } from "../../lib/auth-context";

function completionScore(s: StudentProfile): { score: number; items: { label: string; done: boolean; pts: number }[] } {
  const items = [
    { label: "Profile photo", done: !!(s.image && !s.image.includes("placeholder")), pts: 15 },
    { label: "Bio written", done: !!(s.bio && s.bio.length > 20), pts: 10 },
    { label: "3+ skills added", done: s.skills?.length >= 3, pts: 15 },
    { label: "Experience added", done: s.experience?.length > 0, pts: 15 },
    { label: "Portfolio item", done: s.portfolio?.length > 0, pts: 15 },
    { label: "WhatsApp linked", done: !!s.whatsappEnabled, pts: 10 },
    { label: "ID Verified", done: s.verificationStatus === "Verified", pts: 20 },
  ];
  const score = items.filter((i) => i.done).reduce((sum, i) => sum + i.pts, 0);
  return { score, items };
}

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <Clock className="w-3.5 h-3.5" />,
  Accepted: <CheckCircle className="w-3.5 h-3.5" />,
  Rejected: <XCircle className="w-3.5 h-3.5" />,
};
const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getStudentByUid(user.uid).then(async (s) => {
        if (s) return s;
        if (user.email) return getStudentByEmail(user.email);
        return null;
      }),
      getApplicationsByStudent(user.uid),
    ]).then(([s, apps]) => {
      setStudent(s);
      setApplications(apps);
      if (s?.id) getReferralsByStudent(s.id).then(setReferrals).catch(() => {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user]);

  const completion = useMemo(() => student ? completionScore(student) : null, [student]);
  const accepted = applications.filter((a) => a.status === "Accepted");
  const pending = applications.filter((a) => a.status === "Pending");

  const referralLink = student?.id
    ? `${window.location.origin}/auth?ref=${student.id}`
    : "";
  const referralDiscount = referrals.length * 500;
  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin" />
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] p-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-xl border border-white/60 dark:border-slate-700/40 p-12 text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-5">
              <User className="w-8 h-8 text-[#38B6FF]" />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl mb-2" style={{ fontWeight: 900 }}>No student profile yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm" style={{ fontWeight: 500 }}>
              Set up your student profile to start tracking applications and gigs.
            </p>
            <Link to="/profile/me"
              className="inline-flex items-center gap-2 bg-[#38B6FF] text-white px-6 py-3 rounded-2xl hover:bg-[#1a9fe8] transition-colors"
              style={{ fontWeight: 700 }}>
              Create Profile <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#2fa8f0] to-[#1a6fcc] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.2)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <ImageWithFallback src={student.image} alt={student.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl" />
              {student.verificationStatus === "Verified" && (
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#38B6FF] border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-white/70 text-sm mb-0.5" style={{ fontWeight: 500 }}>Welcome back 👋</p>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-white text-3xl" style={{ fontWeight: 900 }}>{student.name}</h1>
                {student.isPro && (
                  <span className="flex items-center gap-1 bg-[#FFC107] text-slate-900 text-xs px-2.5 py-1 rounded-full shadow-lg" style={{ fontWeight: 800 }}>
                    <Crown className="w-3 h-3 fill-slate-900" /> Pro
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm" style={{ fontWeight: 500 }}>{student.major} · {student.university}</p>
            </div>
            <div className="ml-auto hidden sm:flex gap-3">
              <Link to="/profile/me"
                className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-2.5 rounded-xl text-sm hover:bg-white/30 transition-colors"
                style={{ fontWeight: 600 }}>
                Edit Profile
              </Link>
              <Link to="/jobs"
                className="bg-[#FFC107] text-slate-900 px-4 py-2.5 rounded-xl text-sm hover:bg-[#FFD000] transition-colors shadow-md"
                style={{ fontWeight: 700 }}>
                Browse Gigs
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" className="fill-[#dbeafe] dark:fill-[#0d1321]" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { Icon: FileText, value: applications.length, label: "Applications Sent", color: "from-[#38B6FF] to-[#1a9fe8]" },
            { Icon: CheckCircle, value: accepted.length, label: "Accepted", color: "from-emerald-400 to-teal-500" },
            { Icon: Briefcase, value: student.completedGigs || 0, label: "Gigs Completed", color: "from-violet-400 to-purple-500" },
            { Icon: Star, value: student.rating > 0 ? student.rating.toFixed(1) : "—", label: "Rating", color: "from-[#FFC107] to-[#ff9f00]" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm border border-white/60 dark:border-slate-700/40 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                <stat.Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-xl" style={{ fontWeight: 900 }}>{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs" style={{ fontWeight: 500 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics row */}
        <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-sm">
                <BarChart2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 800 }}>Profile Analytics</h2>
                <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>
                  {student.isPro ? "How people are finding you" : "Pro feature — upgrade to unlock"}
                </p>
              </div>
            </div>
            {student.isPro && (
              <span className="flex items-center gap-1 bg-[#FFC107]/10 text-[#FFC107] text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 700 }}>
                <Crown className="w-3 h-3 fill-[#FFC107]" /> Pro
              </span>
            )}
          </div>

          <div className="relative">
            <div className={`grid grid-cols-3 gap-4 ${!student.isPro ? "blur-sm pointer-events-none select-none" : ""}`}>
              {[
                { Icon: Eye, value: student.profileViews ?? 0, label: "Profile Views", color: "text-[#38B6FF]", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { Icon: MessageCircle, value: student.whatsappClicks ?? 0, label: "WhatsApp Clicks", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                {
                  Icon: TrendingUp,
                  value: applications.length > 0 ? `${Math.round((accepted.length / applications.length) * 100)}%` : "—",
                  label: "Success Rate",
                  color: "text-violet-500",
                  bg: "bg-violet-50 dark:bg-violet-900/20",
                },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 shadow-sm">
                    <s.Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <p className="text-slate-900 dark:text-white text-lg" style={{ fontWeight: 900 }}>{s.value}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]" style={{ fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {!student.isPro && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl border border-amber-200/40 dark:border-amber-700/30 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC107]/15 flex items-center justify-center mx-auto mb-2">
                    <Crown className="w-5 h-5 text-[#FFC107] fill-[#FFC107]" />
                  </div>
                  <p className="text-slate-900 dark:text-white text-sm mb-0.5" style={{ fontWeight: 800 }}>Pro Analytics</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-3" style={{ fontWeight: 500 }}>See who's viewing &amp; clicking your profile</p>
                  <a
                    href={`mailto:skillz@zohomail.com?subject=Pro%20Upgrade%20Request&body=Hi%20Skillz%2C%20I%27d%20like%20to%20upgrade%20to%20Pro.%20My%20email%20is%3A%20${encodeURIComponent(student.email)}`}
                    className="inline-flex items-center gap-1.5 bg-[#FFC107] text-slate-900 text-xs px-4 py-2 rounded-full hover:bg-[#FFD000] transition-colors shadow-sm"
                    style={{ fontWeight: 800 }}>
                    <Crown className="w-3 h-3 fill-slate-900" /> Upgrade — ₦2,000/mo
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Applications list */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>My Applications</h2>
              {pending.length > 0 && (
                <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 700 }}>
                  {pending.length} pending
                </span>
              )}
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-7 h-7 text-[#38B6FF]" />
                </div>
                <p className="text-slate-900 dark:text-white mb-1" style={{ fontWeight: 700 }}>No applications yet</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4" style={{ fontWeight: 500 }}>Find a gig and submit your first application.</p>
                <Link to="/jobs"
                  className="inline-flex items-center gap-2 bg-[#38B6FF] text-white px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a9fe8] transition-colors"
                  style={{ fontWeight: 700 }}>
                  Browse Gigs <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.slice().reverse().map((app) => (
                  <div key={app.id} className="flex items-center gap-4 bg-blue-50/60 dark:bg-slate-700/40 rounded-2xl p-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center text-white flex-shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-white text-sm truncate" style={{ fontWeight: 700 }}>{app.gigTitle}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>{app.appliedDate}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${statusColors[app.status]}`} style={{ fontWeight: 600 }}>
                      {statusIcons[app.status]} {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Profile Completion + Quick Actions */}
          <div className="space-y-5">
            {/* Profile Completion */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Profile Score</h3>
                <span className="text-[#38B6FF] text-lg" style={{ fontWeight: 900 }}>{completion?.score}%</span>
              </div>
              <div className="w-full h-2.5 bg-blue-50 dark:bg-slate-700/50 rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] rounded-full transition-all duration-700"
                  style={{ width: `${completion?.score}%` }}
                />
              </div>
              <div className="space-y-2.5">
                {completion?.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    {item.done
                      ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      : <AlertCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />}
                    <span className={`text-xs ${item.done ? "text-slate-700 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}`}
                      style={{ fontWeight: item.done ? 600 : 500 }}>
                      {item.label}
                    </span>
                    {!item.done && (
                      <span className="ml-auto text-xs text-[#38B6FF]" style={{ fontWeight: 600 }}>+{item.pts}pts</span>
                    )}
                  </div>
                ))}
              </div>
              {completion && completion.score < 100 && (
                <Link to="/profile/me"
                  className="mt-4 flex items-center justify-center gap-2 w-full bg-blue-50 dark:bg-slate-700/50 text-[#38B6FF] py-2.5 rounded-xl text-sm hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                  style={{ fontWeight: 700 }}>
                  Complete Profile <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-6">
              <h3 className="text-slate-900 dark:text-white mb-4" style={{ fontWeight: 800 }}>Quick Actions</h3>
              <div className="space-y-2.5">
                {[
                  { to: `/profile/${student.id}`, Icon: User, label: "View My Profile", color: "text-[#38B6FF]" },
                  { to: "/profile/me", Icon: TrendingUp, label: "Edit Profile", color: "text-violet-500" },
                  { to: "/jobs", Icon: Zap, label: "Find Gigs", color: "text-[#FFC107]" },
                ].map(({ to, Icon, label, color }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <div className={`w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-700/50 flex items-center justify-center ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-200 text-sm" style={{ fontWeight: 600 }}>{label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Refer & Earn */}
            <div className="bg-gradient-to-br from-[#FFC107] via-[#ffb300] to-[#ff9f00] rounded-3xl p-6 shadow-lg shadow-amber-300/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/15 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    <Gift className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 text-sm leading-tight" style={{ fontWeight: 900 }}>Refer & Earn</h3>
                    <p className="text-slate-700 text-[11px]" style={{ fontWeight: 500 }}>₦500 off Pro per referral</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 bg-white/25 backdrop-blur-sm rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Users className="w-3.5 h-3.5 text-slate-900" />
                    </div>
                    <p className="text-slate-900 text-lg leading-none" style={{ fontWeight: 900 }}>{referrals.length}</p>
                    <p className="text-slate-700 text-[10px]" style={{ fontWeight: 600 }}>Referrals</p>
                  </div>
                  <div className="flex-1 bg-white/25 backdrop-blur-sm rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center gap-0.5 mb-0.5">
                      <span className="text-slate-900 text-[10px]" style={{ fontWeight: 700 }}>₦</span>
                    </div>
                    <p className="text-slate-900 text-lg leading-none" style={{ fontWeight: 900 }}>
                      {referralDiscount > 0 ? `${referralDiscount.toLocaleString()}` : "0"}
                    </p>
                    <p className="text-slate-700 text-[10px]" style={{ fontWeight: 600 }}>Saved</p>
                  </div>
                  <div className="flex-1 bg-white/25 backdrop-blur-sm rounded-xl p-2.5 text-center">
                    <div className="flex items-center justify-center mb-0.5">
                      <Crown className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
                    </div>
                    <p className="text-slate-900 text-lg leading-none" style={{ fontWeight: 900 }}>
                      {Math.max(0, 3 - referrals.length)}
                    </p>
                    <p className="text-slate-700 text-[10px]" style={{ fontWeight: 600 }}>to Free Pro</p>
                  </div>
                </div>

                {/* Referral link */}
                {referralLink && (
                  <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-1 flex items-center gap-2 mb-3">
                    <p className="flex-1 text-slate-800 text-[11px] px-2 truncate" style={{ fontWeight: 600 }}>
                      {referralLink.replace(/^https?:\/\//, "")}
                    </p>
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] transition-all flex-shrink-0 ${
                        copied
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                      style={{ fontWeight: 700 }}>
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}

                {referrals.length >= 3 ? (
                  <a
                    href={`mailto:skillz@zohomail.com?subject=Free%20Pro%20Month%20-%20${referrals.length}%20Referrals&body=Hi%20Skillz%20team%2C%20I%20have%20${referrals.length}%20successful%20referrals%20and%20would%20like%20to%20claim%20my%20free%20Pro%20month.%20My%20email%3A%20${encodeURIComponent(student.email)}`}
                    className="block w-full text-center bg-slate-900 text-white py-2.5 rounded-xl text-sm hover:bg-slate-800 transition-colors"
                    style={{ fontWeight: 700 }}>
                    Claim Free Pro Month!
                  </a>
                ) : (
                  <p className="text-slate-700 text-[11px] text-center" style={{ fontWeight: 500 }}>
                    {referrals.length === 0
                      ? "Share your link — each sign-up earns ₦500 off Pro"
                      : `${3 - referrals.length} more referral${3 - referrals.length !== 1 ? "s" : ""} = 1 month free Pro!`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
}
