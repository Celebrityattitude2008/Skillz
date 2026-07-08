import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, BriefcaseIcon, Star, Zap, X } from "lucide-react";
import { collection, query, where, orderBy, limit, onSnapshot, updateDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../lib/auth-context";
import { Link } from "react-router";

export interface AppNotification {
  id: string;
  userId: string;
  type: "application_accepted" | "application_rejected" | "new_review" | "new_gig";
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

const typeIcons: Record<string, React.ReactNode> = {
  application_accepted: <BriefcaseIcon className="w-4 h-4 text-emerald-500" />,
  application_rejected: <BriefcaseIcon className="w-4 h-4 text-red-400" />,
  new_review: <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />,
  new_gig: <Zap className="w-4 h-4 text-[#38B6FF]" />,
};

const typeBg: Record<string, string> = {
  application_accepted: "bg-emerald-50 dark:bg-emerald-900/20",
  application_rejected: "bg-red-50 dark:bg-red-900/20",
  new_review: "bg-amber-50 dark:bg-amber-900/20",
  new_gig: "bg-blue-50 dark:bg-blue-900/20",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    );
    const unsub = onSnapshot(q, (snap) => {
      setNotifs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification)));
    }, () => {});
    return unsub;
  }, [user]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifs.filter((n) => !n.read).length;

  const markRead = async (n: AppNotification) => {
    if (!n.read) {
      await updateDoc(doc(db, "notifications", n.id), { read: true });
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    const q2 = query(collection(db, "notifications"), where("userId", "==", user.uid), where("read", "==", false));
    const snap = await getDocs(q2);
    await Promise.all(snap.docs.map((d) => updateDoc(d.ref, { read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-[#38B6FF] dark:hover:text-[#38B6FF] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center leading-none" style={{ fontWeight: 800 }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full mt-0 sm:mt-2 w-auto sm:w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-blue-100/30 dark:shadow-slate-900/60 border border-blue-100/50 dark:border-slate-700/50 overflow-hidden z-50" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-50 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#38B6FF]" />
              <p className="text-slate-900 dark:text-white text-sm" style={{ fontWeight: 800 }}>Notifications</p>
              {unread > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full" style={{ fontWeight: 800 }}>{unread}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-[#38B6FF] hover:text-[#1a9fe8] transition-colors" style={{ fontWeight: 600 }}>
                  <CheckCheck className="w-3.5 h-3.5" /> All read
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-slate-200 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 dark:text-slate-500 text-sm" style={{ fontWeight: 500 }}>No notifications yet</p>
              </div>
            ) : (
              notifs.map((n) => {
                const inner = (
                  <div
                    onClick={() => markRead(n)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-blue-50/50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer ${!n.read ? "bg-blue-50/30 dark:bg-slate-700/20" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${typeBg[n.type] || "bg-blue-50 dark:bg-blue-900/20"} flex items-center justify-center flex-shrink-0`}>
                      {typeIcons[n.type] || <Bell className="w-4 h-4 text-[#38B6FF]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`} style={{ fontWeight: n.read ? 500 : 600 }}>
                        {n.message}
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5" style={{ fontWeight: 500 }}>{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-[#38B6FF] mt-1.5 flex-shrink-0" />}
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} to={n.link}>{inner}</Link>
                ) : (
                  <div key={n.id}>{inner}</div>
                );
              })
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-blue-50 dark:border-slate-700/60">
            <Link to="/dashboard" onClick={() => setOpen(false)}
              className="block text-center text-xs text-[#38B6FF] hover:text-[#1a9fe8] transition-colors" style={{ fontWeight: 600 }}>
              View Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
