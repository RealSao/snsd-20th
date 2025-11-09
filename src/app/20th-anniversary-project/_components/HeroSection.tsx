'use client';

import dynamic from 'next/dynamic';

// Load the GPU particles animation (Three.js + R3F) only on the client
const ParticlesR3F = dynamic(() => import('./ParticlesR3F'), { ssr: false });

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F10] via-[#2a1520] to-[#FFD7E1]" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 md:pt-14 text-center">
        <h1
          className="text-5xl md:text-8xl leading-tight text-[#EAEAEA]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          我们共同创造的世界
        </h1>
        <h2
          className="mt-4 text-xl md:text-3xl text-[#FFD7E1]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          少女时代 × SONE — 二十年的共生之旅
        </h2>
        <p
          className="mt-6 text-base md:text-xl leading-relaxed text-[#EAEAEA]/90 max-w-3xl mx-auto"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          二十年，我们的光与声、泪与笑，交织成同一个世界。<br className="hidden md:inline" />
          这不只是回忆，而是我们共同创造的存在。
        </p>
      </div>

      {/* GPU Particle Animation (20 ↔ ∞) */}
      <div className="relative z-10 w-full h-[62vh] md:h-[80vh] mt-8">
        <ParticlesR3F />
      </div>
    </section>
  );
}
