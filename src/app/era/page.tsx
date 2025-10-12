"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ERAS } from "@/data/eras";

function cx(...xs: (string | false | undefined)[]) { return xs.filter(Boolean).join(" "); }

export default function EraPage() {
  const [active, setActive] = useState(ERAS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries.filter(e => e.isIntersecting)
          .sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (first?.target) setActive(first.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    ERAS.forEach(e => { const el = sectionRefs.current[e.id]; if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b0b0b,#141414)] text-white">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="text-sm tracking-widest">GIRLS&#39; GENERATION · ERA TIMELINE</div>
          <a href="/" className="text-xs opacity-80 hover:opacity-100 underline underline-offset-4">Home</a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-[200px,1fr] gap-8 py-8">
          <nav className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-1">
              {ERAS.map(e => (
                <a
                  key={e.id}
                  href={`#${e.id}`}
                  className={cx(
                    "px-3 py-2 rounded-lg text-sm transition",
                    active === e.id ? "bg-white text-black font-semibold" : "text-white/70 hover:bg-white/10"
                  )}
                >
                  {e.year}
                </a>
              ))}
            </div>
          </nav>

          <section className="flex flex-col gap-14">
            {ERAS.map((e, idx) => (
              <article key={e.id} id={e.id} ref={setRef(e.id)} className="scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-[16/10] md:aspect-[4/3]">
                      <Image
                        src={e.cover}
                        alt={`${e.year} · ${e.title}`}
                        fill
                        sizes="(min-width:1024px) 50vw, 100vw"
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                    <div className="p-5 md:p-7 flex flex-col">
                      <div className="text-sm md:text-base text-white/60">{e.year}</div>
                      <h2 className="mt-1 text-xl md:text-2xl font-extrabold">{e.title}</h2>
                      <ul className="mt-4 space-y-2 text-sm text-white/80">
                        {e.highlights.map((h, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto pt-5 flex gap-3">
                        <a
                          href={`https://www.youtube.com/results?search_query=Girls%27+Generation+${encodeURIComponent(e.title)}`}
                          target="_blank"
                          className="px-3 py-2 text-xs rounded-lg bg-white text-black font-semibold"
                        >
                          Watch Performances
                        </a>
                        <a href="/#discography" className="px-3 py-2 text-xs rounded-lg border border-white/20 hover:bg-white/10">
                          Discography
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
