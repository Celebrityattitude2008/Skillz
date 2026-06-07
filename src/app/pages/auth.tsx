import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../../lib/firebase";
import { Zap, Mail, Lock, User, Eye, EyeOff, AlertCircle, Chrome, GraduationCap, ChevronDown } from "lucide-react";
import { NIGERIAN_UNIVERSITIES } from "../../lib/nigerian-universities";

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "client">("student");
  const [university, setUniversity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const friendlyError = (code: string) => {
    const map: Record<string, string> = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    };
    return map[code] || "Something went wrong. Please try again.";
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        await setDoc(doc(db, "users", cred.user.uid), {
          name, email, role,
          university: role === "student" ? university : "",
          verificationStatus: "Pending",
          joinDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          gigs: 0, image: "",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.exists()) {
        await setDoc(doc(db, "users", cred.user.uid), {
          name: cred.user.displayName || "",
          email: cred.user.email || "",
          role: "client", university: "",
          verificationStatus: "Pending",
          joinDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
          gigs: 0, image: cred.user.photoURL || "",
        });
      }
      navigate("/");
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg flex items-center justify-center p-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-xl shadow-[#38B6FF]/30">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <span className="text-slate-900 dark:text-white text-2xl" style={{ fontWeight: 900 }}>
              Skillz<span className="text-[#38B6FF]">.</span>
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2" style={{ fontWeight: 500 }}>
            {mode === "login" ? "Welcome back! Sign in to continue." : "Join campus students and clients."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-2xl shadow-blue-200/30 dark:shadow-slate-900/60 border border-white/60 dark:border-slate-700/40 overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-blue-50 dark:border-slate-700/60">
            {(["login", "signup"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                className={`flex-1 py-4 text-sm transition-all ${
                  mode === m
                    ? "text-[#38B6FF] border-b-2 border-[#38B6FF]"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
                style={{ fontWeight: 700 }}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="p-7">
            {/* Google */}
            <button onClick={handleGoogle} disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-50 dark:bg-slate-700/50 hover:bg-blue-100 dark:hover:bg-slate-700 border border-blue-100/70 dark:border-slate-600/50 rounded-2xl py-3.5 text-slate-700 dark:text-slate-200 transition-all mb-5 disabled:opacity-60"
              style={{ fontWeight: 600 }}>
              <Chrome className="w-5 h-5 text-[#38B6FF]" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-blue-100/60 dark:bg-slate-700/60" />
              <span className="text-slate-400 dark:text-slate-500 text-xs" style={{ fontWeight: 600 }}>OR</span>
              <div className="flex-1 h-px bg-blue-100/60 dark:bg-slate-700/60" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>FULL NAME</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Your full name" value={name}
                      onChange={(e) => setName(e.target.value)} required
                      className="w-full pl-10 pr-4 py-3.5 bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                      style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>EMAIL</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" placeholder="you@university.edu.ng" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    className="w-full pl-10 pr-4 py-3.5 bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "signup" ? "Min. 6 characters" : "Your password"}
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    className="w-full pl-10 pr-11 py-3.5 bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                    style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === "signup" && (
                <>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block" style={{ fontWeight: 700 }}>I AM A</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["student", "client"] as const).map((r) => (
                        <button key={r} type="button" onClick={() => setRole(r)}
                          className={`py-3 rounded-xl text-sm capitalize transition-all border-2 ${
                            role === r
                              ? "border-[#38B6FF] bg-[#38B6FF]/10 dark:bg-[#38B6FF]/20 text-[#38B6FF]"
                              : "border-blue-100/60 dark:border-slate-600/50 text-slate-500 dark:text-slate-400 hover:border-[#38B6FF]/40"
                          }`}
                          style={{ fontWeight: 600 }}>
                          {r === "student" ? "Student" : "Business / Client"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {role === "student" && (
                    <div>
                      <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5" style={{ fontWeight: 700 }}>
                        <GraduationCap className="w-3.5 h-3.5 text-[#38B6FF]" /> UNIVERSITY
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select value={university} onChange={(e) => setUniversity(e.target.value)} required
                          className="w-full pl-10 pr-10 py-3.5 bg-blue-50/80 dark:bg-slate-700/50 border border-blue-100/50 dark:border-slate-600/50 rounded-xl outline-none focus:ring-2 focus:ring-[#38B6FF]/25 text-slate-900 dark:text-white appearance-none"
                          style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 500 }}>
                          <option value="">Select your university…</option>
                          {NIGERIAN_UNIVERSITIES.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm" style={{ fontWeight: 500 }}>{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-[#38B6FF] to-[#1a9fe8] text-white py-4 rounded-2xl shadow-lg shadow-[#38B6FF]/30 hover:shadow-xl hover:shadow-[#38B6FF]/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 mt-2"
                style={{ fontWeight: 700 }}>
                {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-5" style={{ fontWeight: 500 }}>
          By continuing, you agree to our
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
          <Link to="/terms" className="text-[#38B6FF] font-semibold hover:underline">Terms of Service</Link>
          <span className="text-slate-400 dark:text-slate-500">and</span>
          <Link to="/privacy" className="text-[#38B6FF] font-semibold hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
