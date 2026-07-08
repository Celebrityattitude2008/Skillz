import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Quote as QuoteIcon, Share2, Loader2, Check } from "lucide-react";
import { getQuoteOfTheDay } from "../../lib/quotes";

/**
 * Glass-style motivational quote card. "Quote of the day" rotates
 * deterministically (see getQuoteOfTheDay) so every visitor sees the same
 * quote on a given day. The share action renders a branded 4:5 image off-
 * screen and shares/downloads it so students can post it to their WhatsApp
 * status.
 */
export function QuoteCard() {
  const quote = getQuoteOfTheDay();
  const exportRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const sharedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (sharedTimeoutRef.current) clearTimeout(sharedTimeoutRef.current);
    };
  }, []);

  const handleShare = async () => {
    if (!exportRef.current || sharing) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(exportRef.current, { pixelRatio: 2, cacheBust: true });

      let shared_ = false;
      if (navigator.share) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], "skillz-quote.png", { type: "image/png" });
          if (!navigator.canShare || navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: "Skillz — Quote of the Day",
              text: `"${quote.text}" — ${quote.author}`,
            });
            shared_ = true;
          }
        } catch (err) {
          // user cancelled the share sheet, or files unsupported — fall through to download
          if ((err as Error)?.name === "AbortError") { setSharing(false); return; }
        }
      }

      if (!shared_) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "skillz-quote-of-the-day.png";
        link.click();
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`"${quote.text}" — ${quote.author}\n\nvia Skillz`)}`,
          "_blank",
        );
      }

      setShared(true);
      if (sharedTimeoutRef.current) clearTimeout(sharedTimeoutRef.current);
      sharedTimeoutRef.current = setTimeout(() => setShared(false), 2500);
    } catch (err) {
      console.error("Failed to generate quote image", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-[#38B6FF] via-[#5b8ff5] to-[#7c5cff]" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/25 rounded-3xl" />
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/15 -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 translate-y-1/3 -translate-x-1/3" />

      <div className="relative p-6">
        <div className="w-9 h-9 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-4">
          <QuoteIcon className="w-4 h-4 text-white" />
        </div>
        <p className="text-white text-base leading-snug mb-3" style={{ fontWeight: 800 }}>
          "{quote.text}"
        </p>
        <p className="text-white/80 text-xs mb-4" style={{ fontWeight: 600 }}>— {quote.author}</p>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-70"
          style={{ fontWeight: 700 }}
        >
          {sharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : shared ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Share2 className="w-4 h-4" />
          )}
          {sharing ? "Preparing image…" : shared ? "Ready — check your share sheet!" : "Share to WhatsApp Status"}
        </button>
      </div>

      {/* Off-screen 4:5 branded template captured for sharing — not shown in the UI */}
      <div
        ref={exportRef}
        aria-hidden="true"
        role="presentation"
        style={{ position: "fixed", top: -99999, left: -99999, width: 1080, height: 1350 }}
        className="flex flex-col justify-between bg-gradient-to-br from-[#38B6FF] via-[#5b8ff5] to-[#7c5cff] p-16"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center">
            <QuoteIcon className="w-8 h-8 text-white" />
          </div>
          <span className="text-white text-4xl" style={{ fontWeight: 900, fontFamily: "'Nunito', sans-serif" }}>
            Skillz.
          </span>
        </div>
        <div>
          <p
            className="text-white leading-tight mb-10"
            style={{ fontWeight: 900, fontFamily: "'Nunito', sans-serif", fontSize: 56 }}
          >
            "{quote.text}"
          </p>
          <p className="text-white/85" style={{ fontWeight: 700, fontFamily: "'Nunito', sans-serif", fontSize: 28 }}>
            — {quote.author}
          </p>
        </div>
        <p className="text-white/70" style={{ fontWeight: 600, fontFamily: "'Nunito', sans-serif", fontSize: 24 }}>
          Discover Campus Talent · Skillz
        </p>
      </div>
    </div>
  );
}
