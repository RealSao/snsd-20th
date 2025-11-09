import type { Metadata } from 'next';
import HeroSection from './_components/HeroSection';

export const metadata: Metadata = {
  title: 'Girls’ Generation — 20th Anniversary Project',
  description:
    'A living, game-like hero experience for SNSD × SONE: 20 → ∞ → 20 particle morph animation and more.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      {/* Optional: a placeholder section to scroll to */}
      <section id="project-overview" className="max-w-5xl mx-auto px-6 py-16">
        <h3 className="text-2xl md:text-3xl font-semibold mb-4">Project Overview</h3>
        <p className="text-base md:text-lg text-white/80">
          This page will host interactive timelines, badges, and mini-games celebrating the
          twentieth anniversary and beyond. More sections coming next.
        </p>
      </section>
    </main>
  );
}
