"use client";

import React from "react";
import { useEgg } from "@/egg/EggContext";

/* -------------------------------
   Secret Keypad (your exact style)
-------------------------------- */
function SecretKeypad({
  title,
  progress,
  total,
  onDigit,
  onClose,
}: {
  title: string;
  progress: number;
  total: number;
  onDigit: (d: string) => void;
  onClose: () => void;
}) {
  const digits = ["1","2","3","4","5","6","7","8","9","0"];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[min(92vw,360px)] rounded-3xl border border-white/10 bg-[#111]/95 p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          <button
            onClick={onClose}
            className="text-xs rounded-lg px-2 py-1 border border-white/20 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] text-white/60">Tap the tiles in order</div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {digits.slice(0, 9).map((d) => (
            <button
              key={d}
              onClick={() => onDigit(d)}
              className="aspect-square rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold hover:bg-white/10 active:scale-95 transition"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => onDigit("0")}
            className="aspect-square rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold hover:bg-white/10 active:scale-95 transition"
          >
            0
          </button>
          <div />
        </div>

        <div className="mt-3 text-[11px] text-white/50 text-center tracking-wider">
          {progress}/{total}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------
   Global Egg — same logic as your page
-------------------------------- */
const FIRST_CODE  = "20070805";   // Stage 1
const SECOND_CODE = "3458912256"; // Stage 2

export default function GlobalEgg({ onUnlock }: { onUnlock?: () => void }) {
  const { showEggPad, keypadStage, openEggPad, closeEggPad, markUnlocked } = useEgg();

  // typed buffer for opening Stage 2 by typing FIRST_CODE
  const [typed, setTyped] = React.useState("");

  // per-stage progress buffers
  const [firstSeq, setFirstSeq] = React.useState("");
  const [secondSeq, setSecondSeq] = React.useState("");

  React.useEffect(() => {
    if (showEggPad) {
      setFirstSeq("");
      setSecondSeq("");
    }
  }, [showEggPad]);

  // Typing FIRST_CODE anywhere opens Stage 2 keypad (mirrors your file)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.getAttribute("contenteditable") === "true")) {
        return;
      }
      if (e.key >= "0" && e.key <= "9") {
        const next = (typed + e.key).slice(-FIRST_CODE.length);
        setTyped(next);
        if (next === FIRST_CODE) {
          openEggPad(2);
          setSecondSeq("");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [typed, openEggPad]);

  // Handle keypad digit presses for current stage
  const onDigit = (d: string) => {
    if (keypadStage === 1) {
      const next = (firstSeq + d).slice(0, FIRST_CODE.length);
      if (FIRST_CODE.startsWith(next)) {
        setFirstSeq(next);
        if (next === FIRST_CODE) {
          openEggPad(2);
          setSecondSeq("");
        }
      } else {
        setFirstSeq("");
      }
    } else {
      const next = (secondSeq + d).slice(0, SECOND_CODE.length);
      if (SECOND_CODE.startsWith(next)) {
        setSecondSeq(next);
        if (next === SECOND_CODE) {
          markUnlocked();
          (async () => {
            try {
              const confetti = (await import("canvas-confetti")).default;
              confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
              setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.6 } }), 250);
            } catch {}
          })();
          setTimeout(() => {
            closeEggPad();
            onUnlock?.();
          }, 200);
        }
      } else {
        setSecondSeq("");
      }
    }
  };

  const handleClose = () => {
    setFirstSeq("");
    setSecondSeq("");
    closeEggPad();
  };

  if (!showEggPad) return null;

  const title = (keypadStage === 1) ? "Enter Code (1/2)" : "Enter Code (2/2)";
  const progress = (keypadStage === 1) ? firstSeq.length : secondSeq.length;
  const total = (keypadStage === 1) ? FIRST_CODE.length : SECOND_CODE.length;

  return (
    <SecretKeypad
      title={title}
      progress={progress}
      total={total}
      onDigit={onDigit}
      onClose={handleClose}
    />
  );
}
