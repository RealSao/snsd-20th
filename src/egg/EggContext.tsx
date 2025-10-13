"use client";

import React from "react";

export type KeypadStage = 1 | 2;

type EggCtx = {
  eggUnlocked: boolean;         // persisted "in egg mode"
  eggActive: boolean;           // kept for compatibility (same as eggUnlocked)
  showEggPad: boolean;          // keypad modal visibility
  keypadStage: KeypadStage;

  openEggPad: (stage?: KeypadStage) => void; // stage defaults to 2
  closeEggPad: () => void;

  markUnlocked: () => void;     // set unlocked + broadcast
  exitEgg: () => void;          // leave egg mode, must redo both stages
};

const Ctx = React.createContext<EggCtx | null>(null);
export function useEgg(): EggCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useEgg must be used inside <EggProvider>");
  return ctx;
}

const STORAGE_KEY = "eggUnlocked";

export function EggProvider({ children }: { children: React.ReactNode }) {
  const [eggUnlocked, setEggUnlocked] = React.useState(false);
  const [showEggPad, setShowEggPad] = React.useState(false);
  const [keypadStage, setKeypadStage] = React.useState<KeypadStage>(2);

  // hydrate once
  React.useEffect(() => {
    try {
      setEggUnlocked(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}
  }, []);

  // persist unlocked
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, eggUnlocked ? "1" : "0");
    } catch {}
  }, [eggUnlocked]);

  const openEggPad = React.useCallback((stage: KeypadStage = 2) => {
    setKeypadStage(stage);
    setShowEggPad(true);
  }, []);

  const closeEggPad = React.useCallback(() => setShowEggPad(false), []);

  const markUnlocked = React.useCallback(() => {
    setEggUnlocked(true);
    // let header react immediately
    requestAnimationFrame(() => {
      try { window.dispatchEvent(new CustomEvent("egg:unlocked")); } catch {}
    });
  }, []);

  const exitEgg = React.useCallback(() => {
    setShowEggPad(false);
    setEggUnlocked(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    try { window.dispatchEvent(new CustomEvent("egg:exited")); } catch {}
  }, []);

  const value: EggCtx = {
    eggUnlocked,
    eggActive: eggUnlocked, // compatibility with existing pages
    showEggPad,
    keypadStage,
    openEggPad,
    closeEggPad,
    markUnlocked,
    exitEgg,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// (kept for any default-imports you might have elsewhere)
export default { useEgg, EggProvider };
