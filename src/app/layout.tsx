"use client";

import "./globals.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { EggProvider, useEgg } from "@/egg/EggContext";
import GlobalEgg from "@/components/GlobalEgg";
import { Badge3D } from "@/components/Badge3D";
import { Badge3DView } from "@/components/Badge3DView";

/* Spinning badge modal */
function NineBadgeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="dialog" aria-modal="true">
      <div className="w-[min(92vw,480px)] rounded-3xl border border-white/10 bg-[#111]/95 p-5 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold">OT9 Mode Unlocked</h3>
          <button onClick={onClose} className="text-xs rounded-lg px-2 py-1 border border-white/20 hover:bg-white/10" aria-label="Close badge">
            Close
          </button>
        </div>

        <div className="mt-4">
          <Badge3DView />
          <p className="mt-4 text-sm text-white/70 text-center">
            Nine-member tribute enabled. Tap the 9 badge in the header anytime to view again.
          </p>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const pathname = usePathname();
  const is = (p: string) => pathname.startsWith(p);

  const colors = { pink: "#FFCCE5" };

  const {
    eggUnlocked,
    showEggPad,
    openEggPad,
    closeEggPad,
    exitEgg,
  } = useEgg();

  const [showBadgeModal, setShowBadgeModal] = React.useState(false);
  const openBadgeModal = () => setShowBadgeModal(true);
  const closeBadgeModal = () => setShowBadgeModal(false);

  React.useEffect(() => {
    const onUnlock = () => setShowBadgeModal(true);
    window.addEventListener("egg:unlocked", onUnlock as EventListener);
    return () => window.removeEventListener("egg:unlocked", onUnlock as EventListener);
  }, []);

  // Tap brand 5x → open Stage 2 keypad
  const [taps, setTaps] = React.useState(0);
  const timer = React.useRef<number | null>(null);
  const onBrandClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const n = taps + 1;
    setTaps(n);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTaps(0), 1200);
    if (n >= 5) {
      e.preventDefault();
      setTaps(0);
      openEggPad(2);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* left: brand */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-pink-300" style={{ background: colors.pink }} />
            <Link href="/" onClick={onBrandClick} className="font-bold tracking-widest">
              GIRLS&#39; GENERATION
            </Link>
            {eggUnlocked && !showBadgeModal && <Badge3D onClick={openBadgeModal} />}
          </div>

          {/* center: nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className={is("/era") ? "text-pink-200" : "hover:text-pink-200"} href="/era">Era</Link>
            <Link className={is("/members") ? "text-pink-200" : "hover:text-pink-200"} href="/members">Members</Link>
            <Link className={is("/discography") ? "text-pink-200" : "hover:text-pink-200"} href="/discography">Discography</Link>
            <Link className={is("/fan-space") ? "text-pink-200" : "hover:text-pink-200"} href="/fan-space">Fan Space</Link>
          </nav>

          {/* right: CTA + exit control */}
          <div className="flex items-center gap-2">

            {showEggPad && (
              <button
                onClick={closeEggPad}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs"
                title="Close keypad"
              >
                Close Keypad
              </button>
            )}

            {eggUnlocked && (
              <button
                onClick={() => { exitEgg(); setShowBadgeModal(false); }}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs"
                title="Exit Egg Mode"
              >
                Exit Egg Mode
              </button>
            )}
          </div>
        </div>
      </header>

      {showBadgeModal && <NineBadgeModal onClose={closeBadgeModal} />}
      <GlobalEgg onUnlock={openBadgeModal} />
      <BackToTop />
    </>
  );
}

function BackToTop() {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null; // hydration-safe

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed bottom-6 right-6 z-50 rounded-2xl px-3 py-2",
        "bg-white text-black text-sm font-semibold shadow-2xl border border-white/20",
        "hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-200/60",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
    >
      ↑ Top
    </button>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full overscroll-y-none">
      <body className="antialiased bg-[#0b0b0b] text-white h-full min-h-screen overflow-x-hidden overscroll-y-none">
        <EggProvider>
          <Header />
          {children}
        </EggProvider>
      </body>
    </html>
  );
}
