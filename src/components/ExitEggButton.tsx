"use client";

import React from "react";
import { useEgg } from "@/egg/EggContext";

export default function ExitEggButton({ afterExit }: { afterExit?: () => void }) {
  const { eggUnlocked, exitEgg } = useEgg();

  if (!eggUnlocked) return null;

  return (
    <button
      onClick={() => {
        exitEgg();
        afterExit?.();
      }}
      className="text-xs rounded-lg px-2 py-1 border border-white/25 hover:bg-white/10"
      aria-label="Exit Egg Mode"
      title="Exit Egg Mode"
    >
      Exit Egg Mode
    </button>
  );
}
