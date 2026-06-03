import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Users, CheckCircle, XCircle, Clock, Shield, Star, Trash2, AlertTriangle, Search,
} from "lucide-react";
import { useState } from "react";

const usersData = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@university.edu", role: "Student", verificationStatus: "Verified", joinDate: "Jan 2026", gigs: 15 },
  { id: 2, name: "Michael Chen", email: "m.chen@business.com", role: "Client", verificationStatus: "Verified", joinDate: "Feb 2026", gigs: 3 },
  { id: 3, name: "Emily Rodriguez", email: "emily.r@university.edu", role: "Student", verificationStatus: "Pending", joinDate: "May 2026", gigs: 0 },
  { id: 4, name: "David Park", email: "david.p@university.edu", role: "Student", verificationStatus: "Rejected", joinDate: "May 2026", gigs: 0 },
  { id: 5, name: "Lisa Thompson", email: "lisa.t@startup.io", role: "Client", verificationStatus: "Verified", joinDate: "Mar 2026", gigs: 7 },
];

const pendingVerifications = [
  { id: 1, name: "Emily Rodriguez", email: "emily.r@university.edu", major: "Computer Science", year: "Junior", studentId: "STU-2023-4567", idImage: "https://images.unsplash.com/photo-1668903678359-e810dd966016?w=600&h=350&fit=crop&auto=format", submittedDate: "May 30, 2026" },
  { id: 2, name: "James Wilson", email: "j.wilson@university.edu", major: "Graphic Design", year: "Senior", studentId: "STU-2021-8901", idImage: "https://images.unsplash.com/photo-1668903678359-e810dd966016?w=600&h=350&fit=crop&auto=format", submittedDate: "June 1, 2026" },
];

const studentsList = [
  { id: 1, name: "Sarah Johnson", image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=300&h=300&fit=crop&auto=format", major: "Graphic Design", rating: 5.0, completedGigs: 15 },
  { id: 2, name: "Marcus Williams", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format", major: "Computer Science", rating: 4.8, completedGigs: 12 },
  { id: 3, name: "Aisha Patel", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format", major: "Marketing", rating: 4.9, completedGigs: 18 },
];

const flaggedContent = [
  { id: 1, type: "Gig Post", title: "Suspicious gig posting — potential scam", reporter: "User #2547", date: "June 2, 2026", reason: "Contains suspicious payment request" },
  { id: 2, type: "Profile", title: "Inappropriate portfolio content", reporter: "User #1893", date: "June 1, 2026", reason: "Contains copyrighted material" },
];

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
  const [selectedTab, setSelectedTab] = useState<"users" | "verification" | "spotlight" | "moderation">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(studentsList[0].id);

  const filteredUsers = usersData.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { key: "users" as const, label: "Users", emoji: "👥" },
    { key: "verification" as const, label: "Verification", emoji: "🔐", badge: pendingVerifications.length },
    { key: "spotlight" as const, label: "Spotlight", emoji: "⭐" },
    { key: "moderation" as const, label: "Moderation", emoji: "🚩", badge: flaggedContent.length },
  ];

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1A1D20] to-[#2d3339] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(56,182,255,0.18)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-lg shadow-[#38B6FF]/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-3xl" style={{ fontWeight: 900 }}>Admin Dashboard</h1>
          </div>
          <p className="text-white/60 text-sm" style={{ fontWeight: 500 }}>Manage users, verify registrations, and moderate content</p>
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
            { icon: <Users className="w-5 h-5" />, value: usersData.length, label: "Total Users", color: "from-[#38B6FF] to-[#1a9fe8]" },
            { icon: <Clock className="w-5 h-5" />, value: pendingVerifications.length, label: "Pending", color: "from-amber-400 to-orange-500" },
            { icon: <CheckCircle className="w-5 h-5" />, value: usersData.filter((u) => u.verificationStatus === "Verified").length, label: "Verified", color: "from-emerald-400 to-teal-500" },
            { icon: <AlertTriangle className="w-5 h-5" />, value: flaggedContent.length, label: "Flagged", color: "from-red-400 to-rose-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                {stat.icon}
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
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedTab === tab.key ? "bg-white/25 text-white" : "bg-red-100 text-red-600"}`} style={{ fontWeight: 700 }}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {selectedTab === "users" && (
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>All Users</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a8d]" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl bg-[#EFF8FF] outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-sm text-[#1A1D20] placeholder:text-[#6b7a8d] w-64"
                  style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
                />
              </div>
            </div>

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
                  <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${statusStyle[user.verificationStatus]}`} style={{ fontWeight: 600 }}>
                    {statusIcon[user.verificationStatus]}
                    {user.verificationStatus}
                  </span>
                  <span className="text-[#6b7a8d] text-xs hidden md:block" style={{ fontWeight: 500 }}>{user.joinDate}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {user.verificationStatus === "Pending" && (
                      <button className="text-xs text-emerald-600 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors" style={{ fontWeight: 600 }}>
                        Verify
                      </button>
                    )}
                    <button className="text-xs text-red-500 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 transition-colors" style={{ fontWeight: 600 }}>
                      {user.verificationStatus === "Verified" ? "Ban" : "Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification tab */}
        {selectedTab === "verification" && (
          <div className="space-y-5">
            {pendingVerifications.length === 0 ? (
              <div className="bg-white rounded-3xl p-14 text-center shadow-sm">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>All Caught Up!</h3>
                <p className="text-[#6b7a8d] text-sm mt-1" style={{ fontWeight: 500 }}>No pending verifications</p>
              </div>
            ) : (
              pendingVerifications.map((v) => (
                <div key={v.id} className="bg-white rounded-3xl shadow-sm p-7">
                  <h3 className="text-[#1A1D20] mb-5" style={{ fontWeight: 800 }}>Pending ID Verification</h3>
                  <div className="grid md:grid-cols-2 gap-7">
                    <div className="space-y-3">
                      <p className="text-xs text-[#6b7a8d]" style={{ fontWeight: 700 }}>STUDENT DETAILS</p>
                      {[
                        { label: "Full Name", value: v.name },
                        { label: "Email", value: v.email },
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
                    <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-2xl hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]" style={{ fontWeight: 700 }}>
                      <CheckCircle className="w-5 h-5" /> Approve
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3.5 rounded-2xl hover:bg-red-600 transition-all shadow-md shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98]" style={{ fontWeight: 700 }}>
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

            <div className="space-y-3 mb-6">
              {studentsList.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border-2 ${
                    selectedStudent === student.id
                      ? "border-[#38B6FF] bg-[#EFF8FF]"
                      : "border-transparent bg-[#EFF8FF]/50 hover:bg-[#EFF8FF]"
                  }`}
                >
                  <ImageWithFallback
                    src={student.image}
                    alt={student.name}
                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                  />
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

            <button className="w-full bg-gradient-to-r from-[#FFC107] to-[#ff9f00] text-[#1A1D20] py-4 rounded-2xl shadow-md shadow-[#FFC107]/25 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ fontWeight: 700 }}>
              Set as Student of the Week
            </button>
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

            <div className="space-y-4">
              {flaggedContent.map((item) => (
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
                    <button className="text-xs bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-1.5 ml-auto" style={{ fontWeight: 600 }}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-16" />
    </div>
  );
}
