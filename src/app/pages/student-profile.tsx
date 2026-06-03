import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Mail, Phone, MapPin, Briefcase, Award, MessageCircle, Star, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Masonry from "react-responsive-masonry";
import { getStudentById, getStudents, type StudentProfile as SP } from "../../lib/firestore";

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<SP | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"portfolio" | "experience" | "reviews">("portfolio");

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto" />
            <p className="text-[#6b7a8d]" style={{ fontWeight: 500 }}>Loading profile…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#EFF8FF] flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8 text-[#38B6FF]" />
            </div>
            <p className="text-[#1A1D20] text-lg" style={{ fontWeight: 800 }}>Profile not found</p>
            <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>This student profile doesn't exist yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Hero header */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#60c8ff] to-[#a8e0ff] relative overflow-hidden pt-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 30C480 60 240 10 0 40L0 80Z" fill="#EFF8FF" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative">
        {/* Profile card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-[#38B6FF]/12 p-7 mb-6">
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
                  <h1 className="text-2xl text-[#1A1D20]" style={{ fontWeight: 900 }}>{student.name}</h1>
                  <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>
                    {student.major} · {student.year} · {student.university}
                  </p>
                </div>
                <span className="bg-[#FFC107] text-[#1A1D20] text-xs px-3 py-1.5 rounded-full flex items-center gap-1" style={{ fontWeight: 700 }}>
                  <Star className="w-3.5 h-3.5 fill-current" /> {student.rating} · Top Rated
                </span>
              </div>
              <p className="text-[#6b7a8d] text-sm leading-relaxed mb-4" style={{ fontWeight: 500 }}>{student.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map((skill) => (
                  <span key={skill} className="bg-[#EFF8FF] text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[#EFF8FF] flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-sm text-[#6b7a8d]" style={{ fontWeight: 500 }}>
              <Mail className="w-4 h-4 text-[#38B6FF]" /> {student.email}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-[#6b7a8d]" style={{ fontWeight: 500 }}>
              <MapPin className="w-4 h-4 text-[#38B6FF]" /> {student.location}
            </span>
            {student.whatsappEnabled && (
              <a
                href={`https://wa.me/${student.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto bg-[#25D366] text-white px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#20bd5a] transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#25D366]/25"
                style={{ fontWeight: 700 }}
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tabs */}
            <div className="bg-white rounded-2xl p-1.5 shadow-sm flex gap-1">
              {(["portfolio", "experience", "reviews"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-sm capitalize transition-all ${
                    activeTab === tab
                      ? "bg-[#38B6FF] text-white shadow-md shadow-[#38B6FF]/30"
                      : "text-[#6b7a8d] hover:text-[#1A1D20]"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "portfolio" && (
              <div className="bg-[#111214] rounded-3xl p-6 shadow-xl">
                <h2 className="text-white mb-5" style={{ fontWeight: 800 }}>Visual Portfolio</h2>
                {student.portfolio.length > 0 ? (
                  <Masonry columnsCount={2} gutter="0.75rem">
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
                <div className="bg-white rounded-3xl shadow-sm p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/25">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Experience</h2>
                  </div>
                  <div className="space-y-5">
                    {student.experience.map((exp, i) => (
                      <div key={i} className="border-l-4 border-[#38B6FF] pl-5 pb-5 last:pb-0">
                        <h3 className="text-[#1A1D20]" style={{ fontWeight: 700 }}>{exp.role}</h3>
                        <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>{exp.organization} · {exp.period}</p>
                        <p className="text-[#1A1D20] text-sm mt-2 leading-relaxed" style={{ fontWeight: 500 }}>{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFC107] to-[#ff9f00] flex items-center justify-center shadow-md shadow-[#FFC107]/25">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Education</h2>
                  </div>
                  <div className="border-l-4 border-[#FFC107] pl-5">
                    <h3 className="text-[#1A1D20]" style={{ fontWeight: 700 }}>{student.education.degree}</h3>
                    <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>{student.education.university} · {student.education.period}</p>
                    <p className="text-sm text-[#1A1D20] mt-1" style={{ fontWeight: 600 }}>GPA: {student.education.gpa}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="bg-white rounded-3xl shadow-sm p-7 space-y-4">
                <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Client Reviews</h2>
                {student.reviews.length > 0 ? student.reviews.map((review) => (
                  <div key={review.id} className="bg-[#EFF8FF] rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[#1A1D20]" style={{ fontWeight: 700 }}>{review.author}</p>
                        <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>{review.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#1A1D20] text-sm italic leading-relaxed" style={{ fontWeight: 500 }}>"{review.comment}"</p>
                    <p className="text-[#6b7a8d] text-xs mt-2" style={{ fontWeight: 500 }}>{review.date}</p>
                  </div>
                )) : (
                  <p className="text-[#6b7a8d] text-sm text-center py-8" style={{ fontWeight: 500 }}>No reviews yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] rounded-3xl p-6 text-white shadow-xl shadow-[#38B6FF]/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
              <h3 className="mb-5" style={{ fontWeight: 800 }}>Profile Stats</h3>
              <div className="space-y-4">
                {[
                  { value: `${student.completedGigs}+`, label: "Completed Projects" },
                  { value: "100%", label: "Satisfaction Rate" },
                  { value: student.education.gpa.split(" ")[0], label: "Academic GPA" },
                ].map((stat, i) => (
                  <div key={i} className={i > 0 ? "border-t border-white/20 pt-4" : ""}>
                    <p className="text-3xl" style={{ fontWeight: 900 }}>{stat.value}</p>
                    <p className="text-white/70 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h3 className="text-[#1A1D20] mb-4" style={{ fontWeight: 800 }}>Get in Touch</h3>
              <div className="space-y-3 mb-5">
                {[
                  { icon: <Mail className="w-4 h-4" />, text: student.email },
                  { icon: <Phone className="w-4 h-4" />, text: student.phone },
                  { icon: <MapPin className="w-4 h-4" />, text: student.location },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-[#6b7a8d]" style={{ fontWeight: 500 }}>
                    <span className="text-[#38B6FF]">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
              {student.whatsappEnabled && (
                <a
                  href={`https://wa.me/${student.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-2xl hover:bg-[#20bd5a] transition-all shadow-md shadow-[#25D366]/25 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontWeight: 700 }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Message on WhatsApp
                </a>
              )}
            </div>

            <div className="bg-[#FFC107] rounded-3xl p-6 shadow-lg shadow-[#FFC107]/25">
              <p className="text-[#1A1D20] mb-1" style={{ fontWeight: 800 }}>Ready to collaborate?</p>
              {student.hourlyRate && (
                <p className="text-[#1A1D20]/70 text-sm mb-4" style={{ fontWeight: 500 }}>Starting at {student.hourlyRate}</p>
              )}
              <button className="w-full bg-[#1A1D20] text-white py-3 rounded-2xl hover:bg-[#2d3339] transition-colors" style={{ fontWeight: 700 }}>
                Book {student.name.split(" ")[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
