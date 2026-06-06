import { Navbar } from "../components/navbar";
import {
  User, Camera, Plus, X, Save, Loader2, CheckCircle, Upload,
  MapPin, Phone, GraduationCap, Briefcase, Link2, DollarSign, ShieldCheck,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../lib/auth-context";
import {
  getStudentByUid, createStudentProfile, updateStudentProfile,
  submitVerificationRequest,
  type StudentProfile,
} from "../../lib/firestore";

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const SKILL_CATEGORIES = ["Design", "Dev", "Marketing", "Photo", "Writing", "Music", "Video", "Other"];

type PortfolioItem = { id: number; image: string; title: string; url?: string };

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to convert file to base64."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

export function ProfileEditor() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profileId, setProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const idFileRef = useRef<HTMLInputElement>(null);

  // Verification state
  const [verStatus, setVerStatus] = useState<string>("Pending");
  const [verStudentId, setVerStudentId] = useState("");
  const [verSubmitting, setVerSubmitting] = useState(false);
  const [verSubmitted, setVerSubmitted] = useState(false);
  const [verIdFile, setVerIdFile] = useState<File | null>(null);
  const [verIdPreview, setVerIdPreview] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    bio: "",
    major: "",
    year: "Sophomore",
    university: "",
    location: "",
    phone: "",
    hourlyRate: "",
    whatsappNumber: "",
    whatsappEnabled: false,
    image: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/auth"); return; }
    getStudentByUid(user.uid)
      .then((p) => {
        if (p) {
          setProfileId(p.id || null);
          setForm({
            name: p.name || user.displayName || "",
            bio: p.bio || "",
            major: p.major || "",
            year: p.year || "Sophomore",
            university: p.university || "",
            location: p.location || "",
            phone: p.phone || "",
            hourlyRate: p.hourlyRate || "",
            whatsappNumber: p.whatsappNumber || "",
            whatsappEnabled: p.whatsappEnabled || false,
            image: p.image || user.photoURL || "",
          });
          setSkills(p.skills || []);
          setPortfolio(p.portfolio || []);
        } else {
          setForm((f) => ({
            ...f,
            name: user.displayName || "",
            image: user.photoURL || "",
          }));
          setVerStatus("Pending");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput("");
  };

  const handleSkillKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); }
  };

  const addPortfolioItem = () => {
    setPortfolio((prev) => [...prev, { id: Date.now(), image: "", title: "", url: "" }]);
  };

  const updatePortfolioItem = (id: number, key: keyof PortfolioItem, value: string) => {
    setPortfolio((prev) => prev.map((p) => p.id === id ? { ...p, [key]: value } : p));
  };

  const handleIdFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVerIdFile(file);
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setVerIdPreview(base64);
    } catch {
      alert("Failed to load verification image. Please try a different file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!user || !verStudentId.trim()) {
      alert("Please enter your student ID number.");
      return;
    }
    setVerSubmitting(true);
    try {
      let idImageUrl = "";
      if (verIdFile) {
        idImageUrl = await fileToBase64(verIdFile);
      }
      await submitVerificationRequest({
        uid: user.uid,
        name: form.name || user.displayName || "",
        email: user.email || "",
        major: form.major,
        year: form.year,
        university: form.university,
        studentId: verStudentId,
        idImage: idImageUrl,
      });
      setVerSubmitted(true);
      setVerStatus("Pending");
    } catch {
      alert("Verification submission failed. Please try again.");
    } finally {
      setVerSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setForm((f) => ({ ...f, image: base64 }));
    } catch {
      alert("Failed to load profile photo. Please try a different image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const data: Omit<StudentProfile, 'id' | 'uid'> = {
        ...form,
        skills,
        portfolio,
        email: user.email || "",
        experience: [],
        education: { degree: "", university: form.university, period: "", gpa: "" },
        reviews: [],
        rating: 0,
        completedGigs: 0,
        verificationStatus: "Pending",
        role: "Student",
        joinDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        gigs: 0,
      };
      if (profileId) {
        await updateStudentProfile(profileId, { ...data, uid: user.uid });
      } else {
        const newId = await createStudentProfile(user.uid, data);
        setProfileId(newId);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Save failed. Check your Firestore rules allow writes for authenticated users.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#EFF8FF] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#38B6FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF8FF]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#38B6FF] via-[#60c8ff] to-[#a8e0ff] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.25)_0%,_transparent_60%)]" />
        <div className="relative max-w-2xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white text-3xl" style={{ fontWeight: 900 }}>Edit Profile</h1>
          </div>
          <p className="text-white/80 text-sm" style={{ fontWeight: 500 }}>
            Build your public student profile and attract clients
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" fill="#EFF8FF" />
          </svg>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSave} className="space-y-6">

          {/* Profile Photo */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-[#1A1D20] mb-4" style={{ fontWeight: 800 }}>Profile Photo</h2>
            <div className="flex items-center gap-5">
              <div className="relative">
                {form.image ? (
                  <img src={form.image} alt="Profile" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#EFF8FF]" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center text-white text-2xl" style={{ fontWeight: 800 }}>
                    {form.name ? form.name[0].toUpperCase() : "?"}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#FFC107] flex items-center justify-center shadow-md hover:bg-[#FFD000] transition-colors"
                >
                  <Camera className="w-4 h-4 text-[#1A1D20]" />
                </button>
              </div>
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#EFF8FF] rounded-xl text-[#38B6FF] text-sm hover:bg-[#daeeff] transition-colors disabled:opacity-60"
                  style={{ fontWeight: 700 }}
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading…" : "Upload Photo"}
                </button>
                <p className="text-[#6b7a8d] text-xs mt-1.5" style={{ fontWeight: 500 }}>
                  Or paste a photo URL below
                </p>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="mt-1.5 w-full bg-[#EFF8FF] rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d]"
                  style={{ fontWeight: 500 }}
                />
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Basic Info</h2>

            <Field label="Full Name" icon={<User className="w-4 h-4" />}>
              <input type="text" placeholder="Your full name" required value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
            </Field>

            <Field label="Bio" icon={<Briefcase className="w-4 h-4" />}>
              <textarea placeholder="Tell clients about yourself, your skills, and experience..." rows={3}
                value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="input-style resize-none" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Hourly Rate" icon={<DollarSign className="w-4 h-4" />}>
                <input type="text" placeholder="e.g. $45/hr" value={form.hourlyRate}
                  onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
                  className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
              </Field>
              <Field label="Location" icon={<MapPin className="w-4 h-4" />}>
                <input type="text" placeholder="City, State" value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
              </Field>
            </div>

            <Field label="Phone" icon={<Phone className="w-4 h-4" />}>
              <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
            </Field>
          </div>

          {/* Education */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Education</h2>
            <Field label="University / College" icon={<GraduationCap className="w-4 h-4" />}>
              <input type="text" placeholder="e.g. State University" value={form.university}
                onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
                className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Major / Course">
                <input type="text" placeholder="e.g. Computer Science" value={form.major}
                  onChange={(e) => setForm((f) => ({ ...f, major: e.target.value }))}
                  className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
              </Field>
              <Field label="Year">
                <select value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Skills</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill (press Enter)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                className="flex-1 bg-[#EFF8FF] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d] text-sm"
                style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
              />
              <button type="button" onClick={addSkill}
                className="px-4 py-3 bg-[#38B6FF] rounded-xl text-white hover:bg-[#1a9fe8] transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {/* Quick add from categories */}
            <div className="flex flex-wrap gap-2">
              {SKILL_CATEGORIES.map((s) => (
                <button key={s} type="button"
                  onClick={() => { if (!skills.includes(s)) setSkills((p) => [...p, s]); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${skills.includes(s) ? "bg-[#38B6FF] text-white border-[#38B6FF]" : "bg-white text-[#6b7a8d] border-[#EFF8FF] hover:border-[#38B6FF] hover:text-[#38B6FF]"}`}
                  style={{ fontWeight: 600 }}>
                  {s}
                </button>
              ))}
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 bg-[#EFF8FF] text-[#38B6FF] text-sm px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
                    {s}
                    <button type="button" onClick={() => setSkills((prev) => prev.filter((x) => x !== s))}>
                      <X className="w-3.5 h-3.5 hover:text-red-400 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Portfolio</h2>
              {portfolio.length < 6 && (
                <button type="button" onClick={addPortfolioItem}
                  className="flex items-center gap-1.5 text-sm text-[#38B6FF] hover:text-[#1a9fe8] transition-colors"
                  style={{ fontWeight: 700 }}>
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              )}
            </div>
            {portfolio.length === 0 && (
              <p className="text-[#6b7a8d] text-sm" style={{ fontWeight: 500 }}>
                Add links to your work — designs, GitHub repos, Behance, Dribbble, etc.
              </p>
            )}
            <div className="space-y-3">
              {portfolio.map((item) => (
                <div key={item.id} className="bg-[#EFF8FF] rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#38B6FF]">
                      <Link2 className="w-4 h-4" />
                      <span className="text-sm" style={{ fontWeight: 700 }}>Portfolio Item</span>
                    </div>
                    <button type="button"
                      onClick={() => setPortfolio((p) => p.filter((x) => x.id !== item.id))}
                      className="text-[#6b7a8d] hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input type="text" placeholder="Title (e.g. Brand Identity Project)"
                    value={item.title}
                    onChange={(e) => updatePortfolioItem(item.id, "title", e.target.value)}
                    className="w-full bg-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d]"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                  <input type="url" placeholder="Link URL (https://...)"
                    value={item.url || ""}
                    onChange={(e) => updatePortfolioItem(item.id, "url", e.target.value)}
                    className="w-full bg-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d]"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                  <input type="url" placeholder="Image URL for preview (optional)"
                    value={item.image || ""}
                    onChange={(e) => updatePortfolioItem(item.id, "image", e.target.value)}
                    className="w-full bg-white rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d]"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Contact</h2>
            <Field label="WhatsApp Number" icon={<Phone className="w-4 h-4" />}>
              <input type="tel" placeholder="+1 234 567 8900" value={form.whatsappNumber}
                onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
                className="input-style" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
            </Field>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm((f) => ({ ...f, whatsappEnabled: !f.whatsappEnabled }))}
                className={`w-11 h-6 rounded-full transition-colors ${form.whatsappEnabled ? "bg-[#38B6FF]" : "bg-gray-200"} relative`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.whatsappEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
              <span className="text-[#1A1D20] text-sm" style={{ fontWeight: 600 }}>Show WhatsApp button on my profile</span>
            </label>
          </div>

          {/* Verification */}
          {verStatus !== "Verified" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/25 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[#1A1D20]" style={{ fontWeight: 800 }}>Get Verified</h2>
                  <p className="text-[#6b7a8d] text-xs" style={{ fontWeight: 500 }}>Upload your student ID to earn a Verified badge</p>
                </div>
              </div>

              {verSubmitted ? (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <p className="text-emerald-700 text-sm" style={{ fontWeight: 600 }}>
                    Submitted! The admin will review your ID and approve your account soon.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>
                      STUDENT ID NUMBER
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. STU-2023-12345"
                      value={verStudentId}
                      onChange={(e) => setVerStudentId(e.target.value)}
                      className="w-full bg-[#EFF8FF] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/30 text-[#1A1D20] placeholder:text-[#6b7a8d]"
                      style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#6b7a8d] mb-1.5 block" style={{ fontWeight: 700 }}>
                      UPLOAD STUDENT ID CARD
                    </label>
                    <input ref={idFileRef} type="file" accept="image/*" className="hidden" onChange={handleIdFileChange} />
                    {verIdPreview ? (
                      <div className="relative">
                        <img src={verIdPreview} alt="ID Preview" className="w-full h-40 object-cover rounded-2xl" />
                        <button
                          type="button"
                          onClick={() => { setVerIdFile(null); setVerIdPreview(""); }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => idFileRef.current?.click()}
                        className="w-full h-28 border-2 border-dashed border-[#38B6FF]/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-[#38B6FF] hover:bg-[#EFF8FF] transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>Click to upload your ID photo</span>
                        <span className="text-xs text-[#6b7a8d]" style={{ fontWeight: 500 }}>JPG, PNG — front side of your student card</span>
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmitVerification}
                    disabled={verSubmitting || !verStudentId.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-3.5 rounded-2xl shadow-md shadow-[#38B6FF]/25 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:scale-100 text-sm"
                    style={{ fontWeight: 700 }}
                  >
                    {verSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : <><ShieldCheck className="w-4 h-4" /> Submit for Verification</>}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/30 hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ fontWeight: 700, fontSize: "1rem" }}
          >
            {saving ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</>
            ) : saved ? (
              <><CheckCircle className="w-5 h-5" /> Profile Saved!</>
            ) : (
              <><Save className="w-5 h-5" /> Save Profile</>
            )}
          </button>

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="text-emerald-700 text-sm" style={{ fontWeight: 600 }}>
                Profile saved! Clients can now find you in the Profiles section.
              </p>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .input-style {
          width: 100%;
          background: #EFF8FF;
          border-radius: 12px;
          padding: 12px 16px;
          outline: none;
          color: #1A1D20;
          font-size: 0.875rem;
        }
        .input-style:focus {
          box-shadow: 0 0 0 2px rgba(56,182,255,0.3);
        }
        .input-style::placeholder { color: #6b7a8d; }
      `}</style>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs text-[#6b7a8d] mb-1.5" style={{ fontWeight: 700 }}>
        {icon && <span className="text-[#38B6FF]">{icon}</span>}
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}
