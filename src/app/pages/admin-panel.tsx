import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Users, CheckCircle, XCircle, Clock, Shield, Star, Trash2, AlertTriangle,
  Search, Loader2, RefreshCw, Database, Lock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getAdminUsers, updateAdminUser, getPendingVerifications, deleteVerification,
  getFlaggedContent, deleteFlaggedItem, getStudents, setSpotlightStudent,
  seedFirestore, approveVerification,
  type AdminUser, type PendingVerification, type FlaggedItem, type StudentProfile,
} from "../../lib/firestore";
import { useAuth } from "../../lib/auth-context";
import { ADMIN_EMAIL } from "../../lib/firebase";

const statusStyle: Record<string, string> = {
  Verified: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-600",
};

const statusIcon: Record<string, React.ReactNode> = {
  Verified: <CheckCircle className="w-3.5 h-3.5" />,
  Pending: <Clock className="w-3.5 h-3.5" />,
  Rejected: <XCircle className="w-3.5 h-3.5" />,
};

export function AdminPanel() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const [selectedTab, setSelectedTab] = useState<"users" | "verification" | "spotlight" | "moderation">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [flagged, setFlagged] = useState<FlaggedItem[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [spotlightSaved, setSpotlightSaved] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    const [u, v, f, s] = await Promise.all([
      getAdminUsers(),
      getPendingVerifications(),
      getFlaggedContent(),
      getStudents(),
    ]);
    setUsers(u);
    setVerifications(v);
    setFlagged(f);
    setStudents(s);
    if (s[0]?.id) setSelectedStudent(s[0].id);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    await seedFirestore();
    await loadAll();
    setSeeding(false);
  };

  const handleVerify = async (v: PendingVerification, approve: boolean) => {
    if (!v.id) return;
    if (approve) {
      await approveVerification(v);
      const match = users.find((u) => u.email === v.email);
      if (match?.id) await updateAdminUser(match.id, { verificationStatus: "Verified" });
      setUsers((prev) => prev.map((u) => u.email === v.email ? { ...u, verificationStatus: "Verified" } : u));
    } else {
      await deleteVerification(v.id);
    }
    setVerifications((prev) => prev.filter((x) => x.id !== v.id));
  };

  const handleDeleteFlagged = async (id: string) => {
    await deleteFlaggedItem(id);
    setFlagged((prev) => prev.filter((x) => x.id !== id));
  };

  const handleBan = async (user: AdminUser) => {
    if (!user.id) return;
    await updateAdminUser(user.id, { verificationStatus: "Rejected" });
    setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, verificationStatus: "Rejected" } : u));
  };

  const handleSpotlight = async () => {
    if (!selectedStudent) return;
    await setSpotlightStudent(selectedStudent);
    setSpotlightSaved(true);
    setTimeout(() => setSpotlightSaved(false), 2000);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { key: "users" as const, label: "Users", Icon: Users },
    { key: "verification" as const, label: "Verification", Icon: Shield, badge: verifications.length },
    { key: "spotlight" as const, label: "Spotlight", Icon: Star },
    { key: "moderation" as const, label: "Moderation", Icon: AlertTriangle, badge: flagged.length },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#EFF8FF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#38B6FF] animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#EFF8FF] flex items-center justify-center p-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-xl shadow-[#38B6FF]/10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-400/30">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-[#1A1D20] text-xl mb-2" style={{ fontWeight: 900 }}>Admin Access Only</h2>
          <p className="text-[#6b7a8d] text-sm mb-6" style={{ fontWeight: 500 }}>
            This page is restricted to the site administrator.
            {!user && " Please sign in with the admin account."}
            {user && !isAdmin && ` Signed in as ${user.email}.`}
          </p>
          <Link
            to={user ? "/jobs" : "/auth"}
            className="block bg-[#38B6FF] text-white py-3.5 rounded-2xl text-sm shadow-lg shadow-[#38B6FF]/25 hover:bg-[#1a9fe8] transition-all"
            style={{ fontWeight: 700 }}
          >
            {user ? "Back to Job Board" : "Sign In"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1A1D20] to-[#2d3339] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(56,182,255,0.18)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-lg shadow-[#38B6FF]/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-white text-3xl" style={{ fontWeight: 900 }}>Admin Dashboard</h1>
            </div>
            <p className="text-white/60 text-sm" style={{ fontWeight: 500 }}>Manage users, verify registrations, and moderate content</p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-all text-sm disabled:opacity-60"
            style={{ fontWeight: 600 }}
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Seed Data
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" fill="#EFF8FF" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { Icon: Users, value: users.length, label: "Total Users", color: "from-[#38B6FF] to-[#1a9fe8]" },
            { Icon: Clock, value: verifications.length, label: "Pending", color: "from-amber-400 to-orange-500" },
            { Icon: CheckCircle, value: users.filter((u) => u.verificationStatus === "Verified").length, label: "Verified", color: "from-emerald-400 to-teal-500" },
            { Icon: AlertTriangle, value: flagged.length, label: "Flagged", color: "from-red-400 to-rose-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                <stat.Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[#1A1D20] text-xl" style={{ fontWeight: 900 }}>{stat.value}</p>
                <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm flex gap-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm whitespace-nowrap transition-all ${
                selectedTab === tab.key
                  ? "bg-[#38B6FF] text-white shadow-md shadow-[#38B6FF]/30"
                  : "text-[#6b7a8d] hover:text-[#1A1D20] hover:bg-[#EFF8FF]"
              }`}
              style={{ fontWeight: 600 }}
            >
              <tab.Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedTab === tab.key ? "bg-white/25 text-white" : "bg-red-100 text-red-600"}`} style={{ fontWeight: 700 }}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm">
            <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto mb-3" />
            <p className="text-[#6b7a8d]" style={{ fontWeight: 500 }}>Loading data…</p>
          </div>
        ) : (
          <>
            {/* Users tab */}
            {selectedTab === "users" && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>All Users</h2>
                  <div className="flex items-center gap-2">
                    <button onClick={loadAll} className="w-9 h-9 rounded-xl bg-[#EFF8FF] flex items-center justify-center text-[#38B6FF] hover:bg-[#daeeff] transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a8d]" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2.5 rounded-xl bg-[#EFF8FF] outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-sm text-[#1A1D20] placeholder:text-[#6b7a8d] w-56"
                        style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
                      />
                    </div>
                  </div>
                </div>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-10 h-10 text-[#38B6FF] mx-auto mb-3 opacity-40" />
                    <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>No users found. Click "Seed Data" to add sample users.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-[#EFF8FF] transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center text-white flex-shrink-0 shadow-sm" style={{ fontWeight: 800 }}>
                          {user.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1A1D20] truncate" style={{ fontWeight: 700 }}>{user.name}</p>
                          <p className="text-[#6b7a8d] text-xs truncate" style={{ fontWeight: 500 }}>{user.email}</p>
                        </div>
                        <span className="bg-[#EFF8FF] text-[#38B6FF] text-xs px-3 py-1 rounded-full hidden sm:block" style={{ fontWeight: 600 }}>{user.role}</span>
                        <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${statusStyle[user.verificationStatus] || "bg-gray-100 text-gray-600"}`} style={{ fontWeight: 600 }}>
                          {statusIcon[user.verificationStatus]}
                          {user.verificationStatus}
                        </span>
                        <span className="text-[#6b7a8d] text-xs hidden md:block" style={{ fontWeight: 500 }}>{user.joinDate}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {user.verificationStatus === "Pending" && (
                            <button
                              onClick={() => updateAdminUser(user.id!, { verificationStatus: "Verified" }).then(() => setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, verificationStatus: "Verified" } : u)))}
                              className="text-xs text-emerald-600 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
                              style={{ fontWeight: 600 }}
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => handleBan(user)}
                            className="text-xs text-red-500 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
                            style={{ fontWeight: 600 }}
                          >
                            {user.verificationStatus === "Verified" ? "Ban" : "Reject"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Verification tab */}
            {selectedTab === "verification" && (
              <div className="space-y-5">
                {verifications.length === 0 ? (
                  <div className="bg-white rounded-3xl p-14 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>All Caught Up!</h3>
                    <p className="text-[#6b7a8d] text-sm mt-1" style={{ fontWeight: 500 }}>No pending verifications</p>
                  </div>
                ) : (
                  verifications.map((v) => (
                    <div key={v.id} className="bg-white rounded-3xl shadow-sm p-7">
                      <h3 className="text-[#1A1D20] mb-5" style={{ fontWeight: 800 }}>Pending ID Verification</h3>
                      <div className="grid md:grid-cols-2 gap-7">
                        <div className="space-y-3">
                          <p className="text-xs text-[#6b7a8d]" style={{ fontWeight: 700 }}>STUDENT DETAILS</p>
                          {[
                            { label: "Full Name", value: v.name },
                            { label: "Email", value: v.email },
                            { label: "University", value: v.university || "—" },
                            { label: "Major", value: v.major },
                            { label: "Year", value: v.year },
                            { label: "Student ID", value: v.studentId },
                            { label: "Submitted", value: v.submittedDate },
                          ].map((field) => (
                            <div key={field.label} className="bg-[#EFF8FF] rounded-xl px-4 py-3">
                              <p className="text-xs text-[#6b7a8d]" style={{ fontWeight: 600 }}>{field.label}</p>
                              <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 700 }}>{field.value}</p>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs text-[#6b7a8d] mb-3" style={{ fontWeight: 700 }}>UNIVERSITY ID CARD</p>
                          <div className="rounded-2xl overflow-hidden shadow-md border border-[#38B6FF]/15">
                            <ImageWithFallback src={v.idImage} alt="Student ID Card" className="w-full h-auto" />
                          </div>
                          <p className="text-xs text-[#6b7a8d] mt-3 italic" style={{ fontWeight: 500 }}>
                            Verify that the name and photo match the student's profile information
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6 pt-5 border-t border-[#EFF8FF]">
                        <button
                          onClick={() => handleVerify(v, true)}
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-2xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ fontWeight: 700 }}
                        >
                          <CheckCircle className="w-5 h-5" /> Approve
                        </button>
                        <button
                          onClick={() => handleVerify(v, false)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3.5 rounded-2xl hover:bg-red-600 transition-all shadow-md shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]"
                          style={{ fontWeight: 700 }}
                        >
                          <XCircle className="w-5 h-5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Spotlight tab */}
            {selectedTab === "spotlight" && (
              <div className="bg-white rounded-3xl shadow-sm p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFC107] to-[#ff9f00] flex items-center justify-center shadow-md shadow-[#FFC107]/25">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Student of the Week</h2>
                </div>
                <p className="text-[#6b7a8d] text-sm mb-5" style={{ fontWeight: 500 }}>
                  Select a featured student to showcase on the landing page
                </p>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>No students found. Click "Seed Data" to add sample students.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {students.map((student) => (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudent(student.id!)}
                          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${
                            selectedStudent === student.id
                              ? "border-[#38B6FF] bg-[#EFF8FF]"
                              : "border-transparent bg-[#EFF8FF]/50 hover:bg-[#EFF8FF]"
                          }`}
                        >
                          <ImageWithFallback src={student.image} alt={student.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                          <div className="flex-1 text-left">
                            <p className="text-[#1A1D20] text-sm" style={{ fontWeight: 700 }}>{student.name}</p>
                            <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>{student.major} · {student.completedGigs} gigs</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                            <span className="text-sm text-[#1A1D20]" style={{ fontWeight: 700 }}>{student.rating}</span>
                          </div>
                          {selectedStudent === student.id && (
                            <CheckCircle className="w-5 h-5 text-[#38B6FF] flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleSpotlight}
                      className={`w-full py-4 rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        spotlightSaved
                          ? "bg-emerald-500 text-white shadow-emerald-500/25"
                          : "bg-gradient-to-r from-[#FFC107] to-[#ff9f00] text-[#1A1D20] shadow-[#FFC107]/25"
                      }`}
                      style={{ fontWeight: 700 }}
                    >
                      {spotlightSaved ? "Saved!" : "Set as Student of the Week"}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Moderation tab */}
            {selectedTab === "moderation" && (
              <div className="bg-white rounded-3xl shadow-sm p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-md shadow-red-400/25">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Flagged Content</h2>
                </div>
                {flagged.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-[#1A1D20]" style={{ fontWeight: 800 }}>All Clear!</p>
                    <p className="text-[#6b7a8d] text-sm mt-1" style={{ fontWeight: 500 }}>No flagged content to review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flagged.map((item) => (
                      <div key={item.id} className="bg-[#EFF8FF] rounded-2xl p-5 border border-[#38B6FF]/10">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-red-100 text-red-600 text-xs px-2.5 py-1 rounded-full" style={{ fontWeight: 600 }}>{item.type}</span>
                              <span className="text-xs text-[#6b7a8d]" style={{ fontWeight: 500 }}>{item.date}</span>
                            </div>
                            <h3 className="text-[#1A1D20] text-sm" style={{ fontWeight: 700 }}>{item.title}</h3>
                            <p className="text-[#6b7a8d] text-xs mt-1" style={{ fontWeight: 500 }}>
                              <span style={{ fontWeight: 600 }}>Reason:</span> {item.reason} · Reported by {item.reporter}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button className="text-xs bg-[#38B6FF] text-white px-4 py-2 rounded-xl hover:bg-[#1a9fe8] transition-colors" style={{ fontWeight: 600 }}>
                            Review
                          </button>
                          <button className="text-xs bg-amber-100 text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-200 transition-colors" style={{ fontWeight: 600 }}>
                            Warn User
                          </button>
                          <button
                            onClick={() => item.id && handleDeleteFlagged(item.id)}
                            className="text-xs bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-1.5 ml-auto"
                            style={{ fontWeight: 600 }}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="h-16" />
    </div>
  );
}
