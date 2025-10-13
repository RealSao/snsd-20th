"use client";

import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ERAS } from "@/data/eras";
import { monthToNumber, dayToNumber, pad2, ymdKey } from "@/lib/date";

function cx(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

/** Accept both data shapes */
type TimelineEra = {
  id?: string;
  year: number;
  month: number | string;
  day?: number | string;
  label: string;
  img: string;
};

type DetailedEra = {
  id?: string;
  year: number;
  month: number | string;
  day?: number | string;
  title: string;
  cover: string;
  highlights: string[];
};

type RawEra = TimelineEra | DetailedEra;

type EraNormalized = {
  uid: string;        // YYYY-MM-DD-slug (used for id / anchor / key)
  year: number;
  mm: number;
  dd: number;
  title: string;
  cover: string;
  highlights: string[];
};

/** ── Type guards (no `any`) ─────────────────────────────────────────────── */
function isDetailedEra(e: RawEra): e is DetailedEra {
  return "title" in e && "cover" in e;
}
function isTimelineEra(e: RawEra): e is TimelineEra {
  return "label" in e && "img" in e;
}

/** ── Normalizer (no `any`) ──────────────────────────────────────────────── */
function normalize(e: RawEra): EraNormalized {
  const title = isDetailedEra(e) ? e.title : isTimelineEra(e) ? e.label : "";
  const cover = isDetailedEra(e) ? e.cover : isTimelineEra(e) ? e.img : "";
  const mm = monthToNumber(e.month);
  const dd = dayToNumber(e.day ?? 1);
  const uid = e.id ?? ymdKey(e.year, mm, dd, title);
  const highlights = isDetailedEra(e) ? e.highlights : [];
  return { uid, year: e.year, mm, dd, title, cover, highlights };
}

/** Keep tuple typing for better type safety */
const MONTH_SHORT = [
  "" , "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
] as const;

export default function EraPage(): JSX.Element {
  // Normalize + sort once
  const items = useMemo<EraNormalized[]>(() => {
    const list = (ERAS as ReadonlyArray<RawEra>).map(normalize);
    list.sort((a, b) => a.year - b.year || a.mm - b.mm || a.dd - b.dd);
    return list;
  }, []);

  // Build groups: Year -> Month -> Items
  const groups = useMemo(() => {
    const byYear = new Map<number, EraNormalized[]>();
    items.forEach((e) => {
      if (!byYear.has(e.year)) byYear.set(e.year, []);
      byYear.get(e.year)!.push(e);
    });
    return Array.from(byYear.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, arr]) => {
        const byMonth = new Map<number, EraNormalized[]>();
        arr.forEach((e) => {
          if (!byMonth.has(e.mm)) byMonth.set(e.mm, []);
          byMonth.get(e.mm)!.push(e);
        });
        const months = Array.from(byMonth.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([mm, mArr]) => ({
            year,
            mm,
            items: mArr.sort((a, b) => a.dd - b.dd),
          }));
        return { year, months, count: arr.length };
      });
  }, [items]);

  // Active section highlighting
  const [active, setActive] = useState<string>(items[0]?.uid ?? "");
  useEffect(() => {
    if (items[0]?.uid) setActive(items[0].uid);
  }, [items]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // Only update active — do NOT auto-open anything
        const first = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (first?.target) setActive((first.target as HTMLElement).id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    items.forEach((e) => {
      const el = sectionRefs.current[e.uid];
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  // Collapse state: open years + open months (user-controlled only)
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());
  const [openMonths, setOpenMonths] = useState<Set<string>>(new Set()); // key: `${year}-${mm}`

  const toggleYear = (y: number) =>
    setOpenYears((prev) => {
      const s = new Set(prev);
      s.has(y) ? s.delete(y) : s.add(y);
      return s;
    });

  const toggleMonth = (y: number, m: number) =>
    setOpenMonths((prev) => {
      const k = `${y}-${m}`;
      const s = new Set(prev);
      s.has(k) ? s.delete(k) : s.add(k);
      return s;
    });

  // Derived info for highlighting (no auto-open)
  const activeMeta = useMemo(() => {
    const cur = items.find((x) => x.uid === active);
    return cur ? { year: cur.year, monthKey: `${cur.year}-${cur.mm}` } : null;
  }, [active, items]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b0b0b,#141414)] text-white">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/60 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="text-sm tracking-widest">GIRLS&#39; GENERATION · ERA TIMELINE</div>
          <Link href="/" className="text-xs opacity-80 hover:opacity-100 underline underline-offset-4">
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-[220px,1fr] gap-8 py-8">
          {/* Side nav with conditional dropdowns (user-controlled only) */}
          <nav className="hidden lg:block">
            <div className="sticky top-24 flex flex-col gap-1">
              {groups.map(({ year, months, count }) => {
                const multiYear = count > 1;

                if (!multiYear) {
                  // Single item in this year → simple link
                  const only = months[0].items[0];
                  const isActive = active === only.uid;
                  return (
                    <a
                      key={year}
                      href={`#${only.uid}`}
                      className={cx(
                        "px-3 py-2 rounded-lg text-sm transition",
                        isActive
                          ? "bg-white text-black font-semibold"
                          : "text-white/70 hover:bg-white/10"
                      )}
                    >
                      {year}
                    </a>
                  );
                }

                // Year with multiple items → dropdown (do NOT auto-open)
                const isOpen = openYears.has(year);
                const yearIsActive = activeMeta?.year === year;

                return (
                  <div key={year} className="rounded-lg">
                    <button
                      onClick={() => toggleYear(year)}
                      className={cx(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between",
                        yearIsActive ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"
                      )}
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold">{year}</span>
                      <span className="text-xs opacity-70">{isOpen ? "▾" : "▸"}</span>
                    </button>

                    {isOpen && (
                      <div className="ml-2 mt-1 flex flex-col gap-1">
                        {months.map(({ year: y, mm, items: list }) => {
                          const multiMonth = list.length > 1;
                          const monthKey = `${y}-${mm}`;
                          const monthIsActive = activeMeta?.monthKey === monthKey;

                          if (!multiMonth) {
                            const only = list[0];
                            const isActive = active === only.uid;
                            return (
                              <a
                                key={monthKey}
                                href={`#${only.uid}`}
                                className={cx(
                                  "px-3 py-1.5 rounded-md text-xs transition",
                                  isActive
                                    ? "bg-white text-black font-semibold"
                                    : monthIsActive
                                    ? "bg-white/10 text-white"
                                    : "text-white/70 hover:bg-white/10"
                                )}
                              >
                                {MONTH_SHORT[mm]}
                              </a>
                            );
                          }

                          const mOpen = openMonths.has(monthKey);

                          return (
                            <div key={monthKey}>
                              <button
                                onClick={() => toggleMonth(y, mm)}
                                className={cx(
                                  "w-full text-left px-3 py-1.5 rounded-md text-xs flex items-center justify-between transition",
                                  monthIsActive ? "bg-white/10 text-white" : "text-white/80 hover:bg-white/10"
                                )}
                                aria-expanded={mOpen}
                              >
                                <span className="font-medium">{MONTH_SHORT[mm]}</span>
                                <span className="text-[10px] opacity-70">{mOpen ? "▾" : "▸"}</span>
                              </button>

                              {mOpen && (
                                <div className="ml-2 mt-1 flex flex-col gap-1">
                                  {list.map((it) => {
                                    const isActive = active === it.uid;
                                    return (
                                      <a
                                        key={it.uid}
                                        href={`#${it.uid}`}
                                        className={cx(
                                          "px-3 py-1.5 rounded-md text-xs transition",
                                          isActive
                                            ? "bg-white text-black font-semibold"
                                            : "text-white/70 hover:bg-white/10"
                                        )}
                                      >
                                        {pad2(it.dd)} · {it.title}
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Sections */}
          <section className="flex flex-col gap-14">
            {items.map((e, idx) => {
              const dateStr = `${e.year}.${pad2(e.mm)}.${pad2(e.dd)}`;
              const safeCover = (e.cover ?? "").trim();
              const hasCover = safeCover.length > 0;

              return (
                <article key={e.uid} id={e.uid} ref={setRef(e.uid)} className="scroll-mt-24">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10% 0px" }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
                  >
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative aspect-[16/10] md:aspect-[4/3]">
                        {hasCover ? (
                          <Image
                            src={safeCover}
                            alt={`${dateStr} · ${e.title}`}
                            fill
                            sizes="(min-width:1024px) 50vw, 100vw"
                            className="object-cover"
                            priority={idx === 0}
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center bg-white/5">
                            <div className="text-center px-4">
                              <div className="text-sm opacity-70">No cover image</div>
                              <div className="mt-1 text-xs opacity-50">{e.title}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-5 md:p-7 flex flex-col">
                        <div className="text-sm md:text-base text-white/60">{dateStr}</div>
                        <h2 className="mt-1 text-xl md:text-2xl font-extrabold">{e.title}</h2>
                        {e.highlights.length > 0 && (
                          <ul className="mt-4 space-y-2 text-sm text-white/80">
                            {e.highlights.map((h, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-auto pt-5 flex gap-3">
                          <Link
                            href="/#discography"
                            className="px-3 py-2 text-xs rounded-lg bg-white text-black font-semibold"
                          >
                            Discography
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}
