'use client';

import dynamic from 'next/dynamic';

type GlowProps = {
  className?: string;
  split?: number;                        // 0..1 boundary between top (star) / bottom (silhouette)
  containerSelector?: string;            // e.g. '#hero' to lock canvas size to the section
  starMinPx?: number;
  starMaxPx?: number;
  silhouetteSrc?: string;                // PNG in /public, e.g. '/silhouette.png'
  silhouetteMaxWidthRatio?: number;      // 0..1, max width of image inside bottom band
  silhouetteMaxHeightRatio?: number;     // 0..1, max height of image inside bottom band
  silhouetteBottomMarginRatio?: number;  // 0..1, lift image above band bottom
  silhouetteFadeInMs?: number;           // fade-in duration (ms)
  silhouetteFadeOutMs?: number;          // fade-out duration (ms)
};

const GlowSilhouetteCanvas = dynamic<GlowProps>(
  () => import('./GlowSilhouetteCanvas'),
  { ssr: false }
);

export default function HeroSection() {
  const split = 0.5; // tune so it matches your gradient break

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] md:min-h-screen overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F10] via-[#2a1520] to-[#FFD7E1]" />

      {/* Canvas overlay (above text so the star appears over copy) */}
      <GlowSilhouetteCanvas
        className="absolute inset-0 z-40"
        containerSelector="#hero"
        split={split}
        starMinPx={14}
        starMaxPx={28}
        silhouetteSrc="/silhouette.png"
        silhouetteMaxWidthRatio={0.92}
        silhouetteMaxHeightRatio={0.9}
        silhouetteBottomMarginRatio={0.06}
        silhouetteFadeInMs={1000}    // slow fade in
        silhouetteFadeOutMs={1000}   // slower fade out
      />

      {/* Text content (below overlay) */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 pt-14 pb-16 text-center">
        <h1
          className="text-5xl md:text-7xl leading-tight text-[#EAEAEA]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          我们共同创造的世界
        </h1>
        <h2
          className="mt-3 text-xl md:text-3xl text-[#FFD7E1]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          少女时代 × SONE — 二十年的共生之旅
        </h2>
        <p
          className="mt-5 text-base md:text-xl leading-relaxed text-[#EAEAEA]/90 max-w-3xl mx-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          二十年，我们的光与声、泪与笑，交织成同一个世界。<br className="hidden md:inline" />
          这不只是回忆，而是我们共同创造的存在。
        </p>
      </div>

      <div className="h-10" />
    </section>
  );
}
