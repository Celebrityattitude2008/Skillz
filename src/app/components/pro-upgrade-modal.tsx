import { useState, useEffect } from "react";
import { Crown, X, BarChart2, Calendar, TrendingUp, Star, CheckCircle } from "lucide-react";
import { useLocation } from "react-router";
import { useAuth } from "../../lib/auth-context";
import { getStudentByUid } from "../../lib/firestore";

const PRO_BENEFITS = [
  { Icon: Crown, label: "Gold Pro Badge", desc: "Stand out with a verified Pro crown on every listing", color: "text-[#FFC107]" },
  { Icon: TrendingUp, label: "Boosted in Search", desc: "Appear at the top of student search results", color: "text-[#38B6FF]" },
  { Icon: BarChart2, label: "Analytics Dashboard", desc: "See who's viewing your profile & clicking WhatsApp", color: "text-violet-500" },
  { Icon: Calendar, label: "Booking Calendar", desc: "Let clients book consultation slots directly", color: "text-emerald-500" },
  { Icon: Star, label: "Featured on Homepage", desc: "Get spotlighted in the Student of the Week section", color: "text-orange-400" },
];

export function ProUpgradeModal() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Clients don't see the Pro modal — it's for students only
    if (profile?.role === "client") { setShow(false); return; }
    setShow(false);

    let timer: ReturnType<typeof setTimeout>;

    getStudentByUid(user.uid)
      .then((student) => {
        if (student?.isPro) return;
        timer = setTimeout(() => setShow(true), 2500);
      })
      .catch(() => {
        timer = setTimeout(() => setShow(true), 2500);
      });

    return () => clearTimeout(timer);
  }, [user, profile?.role, location.pathname]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShow(false)} />

      <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-900/40 w-full max-w-md max-h-[90vh] overflow-y-auto animate-[slideUp_0.4s_ease-out]">
        <div className="bg-gradient-to-br from-[#FFC107] via-[#ffb300] to-[#ff8f00] p-6 relative overflow-hidden sticky top-0 rounded-t-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/15 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />
          <button
            onClick={() => setShow(false)}
            aria-label="Close"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/30 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="relative flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-white/30 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ fontWeight: 800 }}>New</span>
              </div>
              <h2 className="text-white text-xl leading-tight" style={{ fontWeight: 900 }}>Go Pro on Skillz</h2>
            </div>
          </div>
          <p className="text-white/90 text-sm relative" style={{ fontWeight: 500 }}>
            Unlock premium features and get hired faster for just <span style={{ fontWeight: 800 }}>₦2,000/month</span>
          </p>
        </div>

        <div className="p-5">
          <div className="space-y-3 mb-5">
            {PRO_BENEFITS.map(({ Icon, label, desc, color }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 700 }}>{label}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs" style={{ fontWeight: 500 }}>{desc}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>

          <a
            href={`mailto:skillz@zohomail.com?subject=Pro%20Upgrade%20Request&body=Hi%20Skillz%20team%2C%20I%27d%20like%20to%20upgrade%20to%20Pro.%20My%20account%20email%20is%3A%20${encodeURIComponent(user?.email ?? '')}`}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#FFC107] to-[#ff9f00] text-slate-900 py-3.5 rounded-2xl shadow-lg shadow-amber-300/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mb-2"
            style={{ fontWeight: 800, fontSize: "15px" }}
            onClick={() => setShow(false)}
          >
            <Crown className="w-4 h-4 fill-slate-900" />
            Upgrade to Pro — ₦2,000/mo
          </a>
          <button
            onClick={() => setShow(false)}
            className="w-full text-slate-400 dark:text-slate-500 text-sm py-2 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            style={{ fontWeight: 600 }}
          >
            Maybe later
          </button>

          <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-2" style={{ fontWeight: 500 }}>
            Email <span className="text-[#38B6FF]">skillz@zohomail.com</span> to upgrade
          </p>
        </div>
      </div>
    </div>
  );
}
