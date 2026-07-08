import { Lock } from "lucide-react";

/** Mirrors the scoring items in dashboard.tsx's completionScore(), shown as a
 * locked roadmap before a student has created their profile. */
const CHECKLIST_PREVIEW = [
  { label: "Profile photo", pts: 15 },
  { label: "Bio written", pts: 10 },
  { label: "3+ skills added", pts: 15 },
  { label: "Experience added", pts: 15 },
  { label: "Portfolio item", pts: 15 },
  { label: "WhatsApp linked", pts: 10 },
  { label: "ID Verified", pts: 20 },
];

export function ProfileChecklistPreview() {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-3xl shadow-sm border border-white/60 dark:border-slate-700/40 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-slate-900 dark:text-white" style={{ fontWeight: 800 }}>What You'll Build</h3>
        <span className="text-slate-300 dark:text-slate-600 text-lg" style={{ fontWeight: 900 }}>0%</span>
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-xs mb-4" style={{ fontWeight: 500 }}>
        Your profile score roadmap — unlocks once you create your profile.
      </p>
      <div className="w-full h-2.5 bg-blue-50 dark:bg-slate-700/50 rounded-full mb-4 overflow-hidden" />
      <div className="space-y-2.5">
        {CHECKLIST_PREVIEW.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 opacity-60">
            <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            <span className="text-xs text-slate-400 dark:text-slate-500" style={{ fontWeight: 500 }}>
              {item.label}
            </span>
            <span className="ml-auto text-xs text-slate-300 dark:text-slate-600" style={{ fontWeight: 600 }}>
              +{item.pts}pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
