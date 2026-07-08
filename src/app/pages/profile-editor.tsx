import { Navbar } from "../components/navbar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Plus, Trash2, Save, Camera, Upload, CheckCircle, AlertCircle,
  Loader2, GraduationCap, Award, Briefcase, X, Palette, Code2,
  PenLine, ChevronDown, Shield,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  getStudentByUid, updateStudentProfile, createStudentProfile,
  submitVerificationRequest, uploadVerificationId, type StudentProfile,
} from "../../lib/firestore";
import { useAuth } from "../../lib/auth-context";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

type PortfolioItem = { id: number; image: string; title: string; url?: string };
type ExperienceItem = { role: string; organization: string; period: string; description: string };

const SKILL_SUGGESTIONS = [
  "React", "TypeScript", "Node.js", "Python", "UI/UX", "Figma", "Branding",
  "Illustration", "Photography", "Video Editing", "Content Writing", "SEO",
  "Social Media", "Marketing", "Logo Design", "Animation", "Data Analysis",
];

const Field = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div>
    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

export function ProfileEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [existingId, setExistingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<StudentProfile>>({
    name: "", major: "", year: "", university: "", bio: "", email: "",
    phone: "", location: "", hourlyRate: "", whatsappEnabled: false, whatsappNumber: "",
    skills: [], portfolio: [],
    experience: [{ role: "", organization: "", period: "", description: "" }],
    education: { degree: "", university: "", period: "", gpa: "" },
    image: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [verificationIdNumber, setVerificationIdNumber] = useState("");
  const [verificationImage, setVerificationImage] = useState<File | null>(null);
  const [verificationPreview, setVerificationPreview] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoadingProfile(true);
    getStudentByUid(user.uid).then((data) => {
      if (data) { setExistingId(data.id!); setForm(data); }
      else setForm((f) => ({ ...f, name: user.displayName || "", email: user.email || "" }));
    }).catch(() => {}).finally(() => setLoadingProfile(false));
  }, [user]);

  const updateField = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleAddSkill = () => {
    const s = skillInput.trim();
    if (s && !(form.skills || []).includes(s)) updateField("skills", [...(form.skills || []), s]);
    setSkillInput("");
  };
  const handleSkillKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleAddSkill(); }
  };

  const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingImg(true);
    try {
      const storage = getStorage();
      const r = storageRef(storage, `profiles/${user.uid}/avatar`);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      updateField("image", url);
    } catch { setError("Failed to upload image."); } finally { setUploadingImg(false); }
  };

  const handlePortfolioImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !user) return;
    setUploadingPortfolio(true);
    try {
      const storage = getStorage();
      const results = await Promise.all(files.map(async (file, i) => {
        const r = storageRef(storage, `profiles/${user.uid}/portfolio/${Date.now()}-${i}`);
        await uploadBytes(r, file);
        const url = await getDownloadURL(r);
        return { id: `${Date.now()}-${i}`, title: file.name.replace(/\.[^/.]+$/, ""), image: url } as PortfolioItem;
      }));
      updateField("portfolio", [...(form.portfolio || []), ...results]);
    } catch { setError("Failed to upload portfolio images."); } finally { setUploadingPortfolio(false); }
  };

  const handleVerificationImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVerificationImage(file);
    setVerificationPreview(URL.createObjectURL(file));
  };

  const handleSubmitVerification = async () => {
    if (!user) return;
    setVerificationError("");
    setVerificationSuccess("");
    if (!verificationIdNumber.trim()) {
      setVerificationError("Please enter your student matric number.");
      return;
    }
    if (!verificationImage) {
      setVerificationError("Please upload your student ID image.");
      return;
    }

    setVerificationLoading(true);
    try {
      const idImageUrl = await uploadVerificationId(user.uid, verificationImage);
      await submitVerificationRequest({
        uid: user.uid,
        name: form.name || user.displayName || "",
        email: form.email || user.email || "",
        major: form.major || "",
        year: form.year || "",
        university: form.university || "",
        studentId: verificationIdNumber.trim(),
        idImage: idImageUrl,
      });
      setVerificationSuccess("Verification request submitted. Admin will review your ID soon.");
      setVerificationImage(null);
      setVerificationPreview("");
      setVerificationIdNumber("");
    } catch (err: any) {
      setVerificationError(err.message || "Failed to submit verification request.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const updateExperience = (idx: number, key: keyof ExperienceItem, val: string) => {
    const updated = [...(form.experience || [])];
    updated[idx] = { ...updated[idx], [key]: val };
    updateField("experience", updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true); setError("");
    try {
      const payload: Omit<StudentProfile, "id" | "uid"> = {
        name: form.name || "", major: form.major || "", year: form.year || "",
        university: form.university || "", bio: form.bio || "",
        email: form.email || user.email || "", phone: form.phone || "",
        location: form.location || "", hourlyRate: form.hourlyRate || "",
        skills: form.skills || [], portfolio: (form.portfolio || []) as StudentProfile["portfolio"],
        experience: form.experience || [], education: form.education || { degree: "", university: "", period: "", gpa: "" },
        image: form.image || "", rating: (form as StudentProfile).rating || 0,
        completedGigs: (form as StudentProfile).completedGigs || 0,
        reviews: (form as StudentProfile).reviews || [],
        verificationStatus: (form as StudentProfile).verificationStatus || "Pending",
        joinDate: (form as StudentProfile).joinDate || new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        gigs: (form as StudentProfile).gigs || 0,
        role: (form as StudentProfile).role || "student",
        whatsappEnabled: form.whatsappEnabled || false, whatsappNumber: form.whatsappNumber || "",
      };
      if (existingId) await updateStudentProfile(existingId, payload);
      else { const newId = await createStudentProfile(user.uid, payload); setExistingId(newId); }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) { setError(err.message || "Failed to save."); } finally { setSaving(false); }
  };

  if (!user) {
    return (
      <div className="min-h-screen page-bg" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <Navbar />
        <div className="flex items-center justify-center h-80">
          <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-md p-10 text-center border border-white/60 dark:border-slate-700/40">
            <p className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>You need to be signed in to edit your profile.</p>
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
        <div className="relative max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-white text-2xl sm:text-4xl" style={{ fontWeight: 900 }}>My Profile</h1>
          </div>
          <p className="text-white/80" style={{ fontWeight: 500 }}>Build your campus profile and attract clients</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 20C1200 40 960 0 720 15C480 30 240 5 0 20L0 40Z" className="fill-[#dbeafe] dark:fill-[#0d1321]" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loadingProfile ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#38B6FF] animate-spin mx-auto" />
              <p className="text-slate-500 dark:text-slate-400" style={{ fontWeight: 500 }}>Loading your profile…</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {saved && (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl px-5 py-4">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p style={{ fontWeight: 600 }}>Profile saved successfully!</p>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 rounded-2xl px-5 py-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p style={{ fontWeight: 600 }}>{error}</p>
              </div>
            )}

            {/* Profile photo */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/25">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Profile Photo</h2>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-blue-50 dark:bg-slate-700/50 flex-shrink-0">
                  {form.image ? (
                    <ImageWithFallback src={form.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  {uploadingImg && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-blue-50 dark:bg-slate-700/50 border border-blue-100/60 dark:border-slate-600/50 text-[#38B6FF] px-5 py-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                    style={{ fontWeight: 600 }}>
                    <Upload className="w-4 h-4" />
                    {form.image ? "Change Photo" : "Upload Photo"}
                  </button>
                  <p className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 500 }}>JPG, PNG, GIF · Max 5MB</p>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImage} />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md shadow-violet-400/25">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Basic Information</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="FULL NAME" required>
                  <input value={form.name || ""} onChange={(e) => updateField("name", e.target.value)} required placeholder="Your full name" className="input-style" />
                </Field>
                <Field label="EMAIL" required>
                  <input value={form.email || ""} onChange={(e) => updateField("email", e.target.value)} required type="email" placeholder="your@email.com" className="input-style" />
                </Field>
                <Field label="MAJOR / FIELD">
                  <input value={form.major || ""} onChange={(e) => updateField("major", e.target.value)} placeholder="e.g. Computer Science" className="input-style" />
                </Field>
                <Field label="YEAR">
                  <div className="relative">
                    <select value={form.year || ""} onChange={(e) => updateField("year", e.target.value)} className="input-style appearance-none">
                      <option value="">Select year…</option>
                      {["100L", "200L", "300L", "400L", "500L", "MSc", "PhD"].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </Field>
                <Field label="UNIVERSITY">
                  <input value={form.university || ""} onChange={(e) => updateField("university", e.target.value)} placeholder="e.g. University of Lagos" className="input-style" />
                </Field>
                <Field label="LOCATION">
                  <input value={form.location || ""} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Lagos, Nigeria" className="input-style" />
                </Field>
                <Field label="PHONE">
                  <input value={form.phone || ""} onChange={(e) => updateField("phone", e.target.value)} type="tel" placeholder="+234 800 000 0000" className="input-style" />
                </Field>
                <Field label="HOURLY RATE">
                  <input value={form.hourlyRate || ""} onChange={(e) => updateField("hourlyRate", e.target.value)} placeholder="e.g. ₦5,000/hr or $20/hr" className="input-style" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="BIO">
                    <textarea rows={4} value={form.bio || ""} onChange={(e) => updateField("bio", e.target.value)}
                      placeholder="Tell clients about yourself, your skills, and what makes you unique…"
                      className="input-style resize-none" />
                  </Field>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-md">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>WhatsApp Contact</h2>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.whatsappEnabled || false}
                    onChange={(e) => updateField("whatsappEnabled", e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer-checked:bg-[#25D366] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
              {form.whatsappEnabled && (
                <Field label="WHATSAPP NUMBER">
                  <input value={form.whatsappNumber || ""} onChange={(e) => updateField("whatsappNumber", e.target.value)}
                    type="tel" placeholder="+234 800 000 0000" className="input-style" />
                </Field>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFC107] to-[#ff9f00] flex items-center justify-center shadow-md shadow-amber-300/25">
                  <PenLine className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Skills & Expertise</h2>
              </div>
              <div className="flex gap-2 mb-3">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKey}
                  placeholder="Add a skill and press Enter"
                  className="flex-1 bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                <button type="button" onClick={handleAddSkill}
                  className="px-5 py-3 bg-[#38B6FF] text-white rounded-xl hover:bg-[#1a9fe8] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(form.skills || []).map((s) => (
                  <span key={s} className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-[#38B6FF] text-xs px-3 py-1.5 rounded-full" style={{ fontWeight: 600 }}>
                    {s}
                    <button type="button" onClick={() => updateField("skills", (form.skills || []).filter((x) => x !== s))}>
                      <X className="w-3 h-3 hover:text-red-400 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2" style={{ fontWeight: 600 }}>SUGGESTIONS</p>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS.filter((s) => !(form.skills || []).includes(s)).slice(0, 10).map((s) => (
                  <button key={s} type="button" onClick={() => updateField("skills", [...(form.skills || []), s])}
                    className="text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-[#38B6FF] transition-colors"
                    style={{ fontWeight: 600 }}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md shadow-pink-400/25">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Portfolio</h2>
                </div>
                <button type="button" onClick={() => portfolioInputRef.current?.click()}
                  className="flex items-center gap-2 bg-blue-50 dark:bg-slate-700/50 text-[#38B6FF] px-4 py-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                  style={{ fontWeight: 600 }}>
                  <Upload className="w-4 h-4" />
                  {uploadingPortfolio ? "Uploading…" : "Upload Images"}
                </button>
                <input ref={portfolioInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePortfolioImages} />
              </div>
              {(form.portfolio || []).length === 0 ? (
                <div className="border-2 border-dashed border-blue-100 dark:border-slate-600/50 rounded-2xl p-10 text-center">
                  <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>Upload your best work to attract clients</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(form.portfolio || []).map((item) => (
                    <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square">
                      <ImageWithFallback src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => updateField("portfolio", (form.portfolio || []).filter((p) => p.id !== item.id))}
                          className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-md shadow-[#38B6FF]/25">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Student Verification</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm" style={{ fontWeight: 500 }}>
                      {form.verificationStatus === "Verified"
                        ? "Your account is verified by admin."
                        : form.verificationStatus === "Pending"
                          ? "Verification is pending review."
                          : form.verificationStatus === "Rejected"
                            ? "Verification was rejected. Please re-submit your ID." : "Submit your student ID for verification."}
                    </p>
                  </div>
                </div>
              </div>

              {form.verificationStatus !== "Verified" && (
                <div className="space-y-4">
                  {verificationError && (
                    <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-300 px-4 py-3" style={{ fontWeight: 600 }}>
                      {verificationError}
                    </div>
                  )}
                  {verificationSuccess && (
                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-300 px-4 py-3" style={{ fontWeight: 600 }}>
                      {verificationSuccess}
                    </div>
                  )}

                  <Field label="Student Matric Number" required>
                    <input value={verificationIdNumber} onChange={(e) => setVerificationIdNumber(e.target.value)} required placeholder="e.g. STU-2024-1234" className="input-style" />
                  </Field>
                  <Field label="Upload Student ID Image" required>
                    <div className="space-y-3">
                      <button type="button" onClick={() => document.getElementById("verification-id-file")?.click()}
                        className="flex items-center gap-2 bg-blue-50 dark:bg-slate-700/50 border border-blue-100/60 dark:border-slate-600/50 text-[#38B6FF] px-4 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                        style={{ fontWeight: 600 }}>
                        <Upload className="w-4 h-4" />
                        {verificationImage ? "Change ID Image" : "Choose ID Image"}
                      </button>
                      <input id="verification-id-file" type="file" accept="image/*" className="hidden" onChange={handleVerificationImage} />
                      {verificationPreview && (
                        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50">
                          <img src={verificationPreview} alt="Verification preview" className="w-full h-40 object-cover" />
                        </div>
                      )}
                    </div>
                  </Field>

                  <button type="button" onClick={handleSubmitVerification} disabled={verificationLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#FFC107] text-slate-900 py-4 rounded-2xl shadow-sm hover:bg-[#FFD000] transition-all disabled:opacity-60" style={{ fontWeight: 700 }}>
                    {verificationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {verificationLoading ? "Submitting…" : "Submit Verification"}
                  </button>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-400/25">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Experience</h2>
                </div>
                <button type="button"
                  onClick={() => updateField("experience", [...(form.experience || []), { role: "", organization: "", period: "", description: "" }])}
                  className="flex items-center gap-2 bg-blue-50 dark:bg-slate-700/50 text-[#38B6FF] px-4 py-2.5 rounded-xl hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                  style={{ fontWeight: 600 }}>
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              <div className="space-y-5">
                {(form.experience || []).map((exp, idx) => (
                  <div key={idx} className="bg-blue-50/80 dark:bg-slate-700/50 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400 dark:text-slate-500" style={{ fontWeight: 700 }}>EXPERIENCE {idx + 1}</span>
                      {(form.experience || []).length > 1 && (
                        <button type="button" onClick={() => updateField("experience", (form.experience || []).filter((_, i) => i !== idx))}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="ROLE">
                        <input value={exp.role} onChange={(e) => updateExperience(idx, "role", e.target.value)} placeholder="e.g. Graphic Designer" className="input-style" />
                      </Field>
                      <Field label="ORGANIZATION">
                        <input value={exp.organization} onChange={(e) => updateExperience(idx, "organization", e.target.value)} placeholder="e.g. Freelance / Company" className="input-style" />
                      </Field>
                      <Field label="PERIOD">
                        <input value={exp.period} onChange={(e) => updateExperience(idx, "period", e.target.value)} placeholder="e.g. Jan 2024 – Present" className="input-style" />
                      </Field>
                    </div>
                    <Field label="DESCRIPTION">
                      <textarea rows={2} value={exp.description} onChange={(e) => updateExperience(idx, "description", e.target.value)}
                        placeholder="What did you achieve?" className="input-style resize-none" />
                    </Field>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFC107] to-[#ff9f00] flex items-center justify-center shadow-md shadow-amber-300/25">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>Education</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="DEGREE">
                  <input value={form.education?.degree || ""} onChange={(e) => updateField("education", { ...form.education, degree: e.target.value })} placeholder="e.g. B.Sc. Computer Science" className="input-style" />
                </Field>
                <Field label="UNIVERSITY">
                  <input value={form.education?.university || ""} onChange={(e) => updateField("education", { ...form.education, university: e.target.value })} placeholder="e.g. University of Lagos" className="input-style" />
                </Field>
                <Field label="PERIOD">
                  <input value={form.education?.period || ""} onChange={(e) => updateField("education", { ...form.education, period: e.target.value })} placeholder="e.g. 2021 – 2025" className="input-style" />
                </Field>
                <Field label="GPA">
                  <input value={form.education?.gpa || ""} onChange={(e) => updateField("education", { ...form.education, gpa: e.target.value })} placeholder="e.g. 4.5 / 5.0" className="input-style" />
                </Field>
              </div>
            </div>

            {/* Save */}
            <button type="submit" disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/30 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 text-base"
              style={{ fontWeight: 700 }}>
              {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</> : <><Save className="w-5 h-5" /> Save Profile</>}
            </button>
            <div className="h-6" />
          </form>
        )}
      </div>
    </div>
  );
}
