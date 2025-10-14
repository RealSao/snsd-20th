"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEgg } from "@/egg/EggContext";
import { monthToNumber, dayToNumber, pad2, ymdKey } from "@/lib/date";
import Link from "next/link";
import { DISCOGRAPHY, DiscographyItem } from "@/data/discography";

// helper to be robust to case/spacing
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

// which three to feature
const PICKS = ["Into the New World", "The Boys", "Forever 1"];

// find the albums from your data (by title, case-insensitive; falls back if missing)
const FEATURED: DiscographyItem[] = PICKS.map((name) => {
  const n = norm(name);
  return (
    DISCOGRAPHY.find((a) => norm(a.title) === n) ||
    // if you maintain keywords, this also works:
    DISCOGRAPHY.find((a) => (a.keywords ?? []).some((k) => norm(k) === n))
  );
}).filter(Boolean) as DiscographyItem[];


/* =======================
   HOMEPAGE SIDE NAV
======================= */
const HOME_SECTIONS = [
  { id: "timeline",     label: "Era" },
  { id: "members",      label: "Members" },
  { id: "discography",  label: "Discography" },
];

function useActiveSection() {
  const [active, setActive] = React.useState(HOME_SECTIONS[0].id);
  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topMost?.target) setActive(topMost.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    HOME_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function SideNav() {
  const active = useActiveSection();
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80; // sticky header offset
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <aside className="fixed right-4 top-24 hidden lg:flex flex-col gap-2 z-30">
      {HOME_SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className={`px-3 py-1.5 rounded-lg text-xs border transition
            ${active === s.id ? "bg-white text-black border-white" : "border-white/20 text-white/80 hover:bg-white/10"}`}
          aria-current={active === s.id ? "true" : undefined}
        >
          {s.label}
        </button>
      ))}
    </aside>
  );
}

/* =======================
   THEME + COUNTDOWN
======================= */
const colors = {
  pink: "#FFCCE5",
  lavender: "#C4A1FF",
  charcoal: "#1E1E1E",
  ivory: "#FEFDFB",
};

// 00:00 on Aug 5, 2027 KST = 2027-08-04 15:00:00Z
const ANNIVERSARY_DATE_KST = Date.parse("2027-08-04T15:00:00Z");

function useCountdown(targetUtcMs: number) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = useMemo(() => {
    const total = Math.max(0, targetUtcMs - now);
    const days = Math.floor(total / (24 * 60 * 60 * 1000));
    const hours = Math.floor((total % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((total % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((total % (60 * 1000)) / 1000);
    return { days, hours, minutes, seconds };
  }, [now, targetUtcMs]);

  return diff;
}

/* =======================
   DATA (HOMEPAGE PREVIEW)
======================= */
type Era = { year: number; month: number | string; day?: number | string; label: string; img: string };


const eras: Era[] = [
  { year: 2007, month: 8, day: 5, label: "Into the New World", img: "/images/eras/2007-itnw.jpg" },
  { year: 2007, month: 11, day: 1, label: "Girls' Generation",   img: "/images/eras/2007-gg.jpg" },
  { year: 2008, month: 3, day: 13, label: "Baby Baby",          img: "/images/eras/2008-bb.jpg" },
  { year: 2009, month: 1, day: 5, label: "Gee",                 img: "/images/eras/2009-gee.jpg" },
  { year: 2009, month: 6, day: 25, label: "Genie",               img: "/images/eras/2009-genie.jpg" },
  { year: 2010, month: 1, day: 28, label: "Oh!",               img: "/images/eras/2010-oh.jpg" },
  { year: 2010, month: 3, day: 22, label: "Run Devil Run",               img: "/images/eras/2010-rdr.jpg" },
  { year: 2010, month: 9, day: 5, label: "Genie (Japanese)",               img: "/images/eras/2010-genie.jpg" },
  { year: 2010, month: 10, day: 17, label: "Gee (Japanese)",               img: "/images/eras/2010-gee.jpg" },
  { year: 2010, month: 10, day: 27, label: "Hoot",               img: "/images/eras/2010-hoot.jpg" },
  { year: 2011, month: 1, day: 25, label: "Run Devil Run (Japanese)",               img: "/images/eras/2011-rdr.jpg" },
  { year: 2011, month: 4, day: 23, label: "Mr. Taxi (Japanese)",               img: "/images/eras/2011-mrtaxi.jpg" },
  { year: 2011, month: 6, day: 1, label: "Girls' Generation (Japanese)",               img: "/images/eras/2011-gg.jpg" },
  { year: 2011, month: 10, day: 19, label: "The Boys",            img: "/images/eras/2011-theboys.jpg" },
  { year: 2011, month: 12, day: 9, label: "Mr. Taxi (Repackage)",            img: "/images/eras/2011-mrtaxir.jpg" },
  { year: 2011, month: 12, day: 18, label: "Girls’ Generation ~The Boys~ (Japanese)",            img: "/images/eras/2011-ggtb.jpg" },
  { year: 2012, month: 6, day: 20, label: "Paparazzi (Japanese)",            img: "/images/eras/2012-paparazzi.jpg" },
  { year: 2012, month: 9, day: 3, label: "All My Love is for You (Japanese)",            img: "/images/eras/2012-amlify.jpg" },
  { year: 2012, month: 9, day: 14, label: "Oh! (Japanese)",            img: "/images/eras/2012-oh.jpg" },
  { year: 2012, month: 11, day: 7, label: "Flower Power (Japanese)",            img: "/images/eras/2012-fp.jpg" },
  { year: 2012, month: 11, day: 28, label: "Girls & Peace (Japanese)",            img: "/images/eras/2012-gp.jpg" },
  { year: 2012, month: 12, day: 21, label: "Dancing Queen",         img: "/images/eras/2012-dq.jpg" },
  { year: 2013, month: 1, day: 1, label: "I Got a Boy",         img: "/images/eras/2013-igab.jpg" },
  { year: 2013, month: 6, day: 12, label: "Love & Girls (Japanese)",            img: "/images/eras/2013-lg.jpg" },
  { year: 2013, month: 9, day: 11, label: "Galaxy Supernova (Japanese)",            img: "/images/eras/2013-gs.jpg" },
  { year: 2013, month: 11, day: 5, label: "My Oh My (Japanese)",            img: "/images/eras/2013-mom.jpg" },
  { year: 2013, month: 12, day: 10, label: "Love & Peace (Japanese)",            img: "/images/eras/2013-lp.jpg" },
  { year: 2014, month: 2, day: 24, label: "Mr.Mr.",          img: "/images/eras/2014-mrmr.jpg" },
  { year: 2014, month: 7, day: 23, label: "The Best (Japanese)",          img: "/images/eras/2014-tb.jpg" },
  { year: 2015, month: 4, day: 22, label: "Catch Me If You Can (Japanese)",          img: "/images/eras/2015-cmiyc.jpg" },
  { year: 2015, month: 7, day: 7, label: "Party",          img: "/images/eras/2015-party.jpg" },
  { year: 2015, month: 8, day: 19, label: "Lion Heart",          img: "/images/eras/2015-lionheart.jpg" },
  { year: 2016, month: 8, day: 5, label: "Sailing (0805)",          img: "/images/eras/2016-0805.jpg" },
  { year: 2017, month: 8, day: 4, label: "Holiday Night",       img: "/images/eras/2017-holidaynight.jpg" },
  { year: 2022, month: 8, day: 5, label: "Forever 1",          img: "/images/eras/2022-forever1.jpg" },
  { year: 2025, month: 2, day: 14, label: "2025 SMTOWN : THE CULTURE, THE FUTURE - My Everything",          img: "/images/eras/2025-myeverything.jpg" },
];

const allMembersOrdered = [
  { name: "Taeyeon", img: "/images/members/taeyeon.jpg" },
  { name: "Jessica", img: "/images/members/jessica.jpg" },
  { name: "Sunny", img: "/images/members/sunny.jpg" },
  { name: "Tiffany", img: "/images/members/tiffany.jpg" },
  { name: "Hyoyeon", img: "/images/members/hyoyeon.jpg" },
  { name: "Yuri", img: "/images/members/yuri.jpg" },
  { name: "Sooyoung", img: "/images/members/sooyoung.jpg" },
  { name: "Yoona", img: "/images/members/yoona.jpg" },
  { name: "Seohyun", img: "/images/members/seohyun.jpg" },
];

const membersNoJessica = allMembersOrdered.filter(m => m.name !== "Jessica");

function memberForGridIndex(i: number, egg: boolean) {
  if (egg) return allMembersOrdered[i];      // 0..8 map directly
  if (i === 4) return null;                  // center → logo
  const idx = i < 4 ? i : i - 1;             // pack 8 members around center
  return membersNoJessica[idx];
}

/* =======================
   PAGE
======================= */
export default function AnniversaryLanding() {
  const { days, hours, minutes, seconds } = useCountdown(ANNIVERSARY_DATE_KST);

  // Use GLOBAL egg state & keypad trigger
  const { eggActive, openEggPad } = useEgg();
  const egg = eggActive;

  // Center tile long-press → open global keypad (stage 2 UI is handled globally)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startLongPress = () => {
    pressTimer.current = setTimeout(() => openEggPad(1), 700); // Stage 1 keypad
  };
  const endLongPress = () => {
    if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; }
  };

  // Optional celebration when unlock happens (from anywhere)
  useEffect(() => {
    function onUnlocked() {
      (async () => {
        const confetti = (await import("canvas-confetti")).default;
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.6 } }), 250);
      })();
    }
    window.addEventListener("egg:unlocked", onUnlocked as EventListener);
    return () => window.removeEventListener("egg:unlocked", onUnlocked as EventListener);
  }, []);

  const members = egg ? allMembersOrdered : allMembersOrdered.filter((m) => m.name !== "Jessica");

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(196,161,255,0.25),transparent),linear-gradient(180deg,#0b0b0b,#141414)] text-white">
      {/* Homepage side navigator */}
      <SideNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl/tight sm:text-5xl/tight lg:text-6xl/tight font-extrabold"
              >
                20 YEARS OF
                <span className="block bg-gradient-to-r from-pink-200 to-purple-300 bg-clip-text text-transparent">
                  GIRLS&#39; GENERATION
                </span>
              </motion.h1>
              <p className="mt-5 text-sm/relaxed text-white/80 max-w-prose">
                2007 → 2027. A journey of friendship, growth, and music that shaped a generation.
                Join us as we celebrate two decades of SNSD — from <em>Into the New World</em> to
                <em> Forever 1</em> and beyond.
              </p>

              {/* Countdown (KST) */}
              <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-xs tracking-widest text-white/70">COUNTDOWN TO 20TH (KST)</span>
                <div className="flex items-baseline gap-3 font-mono">
                  <TimeBlock label="DAYS" value={days} />
                  <Divider />
                  <TimeBlock label="HRS" value={hours} />
                  <Divider />
                  <TimeBlock label="MIN" value={minutes} />
                  <Divider />
                  <TimeBlock label="SEC" value={seconds} />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#timeline" className="px-5 py-2.5 rounded-2xl bg-white text-black text-sm font-semibold hover:opacity-90">Explore Timeline</a>
                <a href="#discography" className="px-5 py-2.5 rounded-2xl border border-white/20 text-sm hover:bg-white/10">Discography</a>
              </div>

              <p className="mt-4 text-xs text-white/60">Official anniversary date: Aug 5, 2027 (KST)</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative aspect-[4/3] w-full rounded-3xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10 overflow-hidden shadow-2xl"
            >
              <BGOrbs />
              <div className="absolute inset-0 grid grid-cols-3 gap-2 p-2">
                {Array.from({ length: 9 }).map((_, i) => {
                  const isCenter = i === 4;
                  const data = memberForGridIndex(i, egg);
                  const src = data ? data.img : "/images/logo/gg-logo.jpg";

                  return (
                    <div
                      key={i}
                      className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5"
                      {...(isCenter
                        ? {
                            onMouseDown: startLongPress,
                            onMouseUp: endLongPress,
                            onMouseLeave: endLongPress,
                            onTouchStart: startLongPress,
                            onTouchEnd: endLongPress,
                          }
                        : {})}
                    >
                      <Image
                        src={src}
                        alt={data ? `${data.name} portrait` : "Girls' Generation logo"}
                        fill
                        sizes="(min-width:1024px) 33vw, 50vw"
                        className="object-cover"
                        priority={isCenter}
                      />
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ERA RIBBON */}
      <section id="timeline" className="py-14 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Timeline</h3>
          </div>

          {/* Mobile: vertical wave timeline (alternating left/right) */}
          <div className="md:hidden relative mt-6">
            {/* center vertical line */}
            <div className="pointer-events-none absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />

            <ol className="relative space-y-10 px-4">
              {[...eras]
                .sort((a, b) =>
                  (a.year - b.year) ||
                  (monthToNumber(a.month) - monthToNumber(b.month)) ||
                  (dayToNumber(a.day ?? 1) - dayToNumber(b.day ?? 1))
                )
                .map((e, idx) => {
                  const leftSide = idx % 2 === 0; // alternate sides
                  const key = ymdKey(e.year, e.month, e.day ?? 1, e.label);
                  const anchor = key;
                  const mm = pad2(monthToNumber(e.month));
                  const dd = pad2(dayToNumber(e.day ?? 1));

                  return (
                    <li key={key} className="relative">
                      {/* baseline dot */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white" />

                      {/* connector from center line to card */}
                      <div
                        className="absolute top-1/2 h-px bg-white/30"
                        style={{ width: 18, [leftSide ? "left" : "right"]: "50%", transform: "translateX(0)" }}
                      />

                      {/* card */}
                      <a
                        href={`/era#${anchor}`}
                        className={[
                          "block rounded-xl overflow-hidden border border-white/10 bg-[#111] shadow-[0_4px_16px_rgba(0,0,0,0.35)]",
                          "transition-transform duration-200",
                          leftSide ? "mr-auto origin-left translate-x-2" : "ml-auto origin-right -translate-x-2",
                        ].join(" ")}
                        style={{ width: "min(78vw, 320px)" }}
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={e.img}
                            alt={`${e.year}.${mm}.${dd} · ${e.label}`}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3 text-xs">
                          <div className="text-white/60">{e.year}.{mm}.{dd}</div>
                          <div className="font-semibold">{e.label}</div>
                        </div>
                      </a>
                    </li>
                  );
                })}
            </ol>
          </div>



          {/* Desktop: horizontal ribbon with center line + wave pattern */}
          <HorizontalRibbon eras={eras} />
        </div>
      </section>

      {/* MEMBERS */}
      <section id="members" className="scroll-mt-24 py-14 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold">Members</h2>
            <a href="#members" className="text-xs hover:text-pink-200">View all profiles →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {members.map((m) => (
              <motion.div key={m.name} whileHover={{ scale: 1.02 }} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={m.img}
                    alt={`${m.name} portrait`}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 text-sm font-semibold">{m.name}</div>
                <div className="text-xs text-white/70">Profile · Solo works · Facts</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DISCOGRAPHY */}
      <section id="discography" className="scroll-mt-24 py-14 border-top border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold">Discography</h2>
            <Link href="/discography" className="text-xs hover:text-pink-200">
              View full discography →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(FEATURED.length ? FEATURED : DISCOGRAPHY.slice(0, 3)).map((album) => (
              <motion.div
                key={album.id}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <Link href={`/discography#${album.slug}`} className="block">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={album.cover}
                      alt={`${album.title} cover`}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="mt-3 text-sm font-semibold">{album.title}</div>
                  <div className="text-xs text-white/70">Album · Tracklist · Listen</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-xs text-white/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div>© 2007–2027 GIRLS&#39; GENERATION · Fan-made tribute</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-pink-200" href="#">Official</a>
            <a className="hover:text-pink-200" href="#">Credits</a>
            <a className="hover:text-pink-200" href="#">Contact</a>
          </div>
        </div>
      </footer>

      
    </div>
  );
}

/* =======================
   SMALL REUSABLES
======================= */
function Divider() {
  return <span className="h-5 w-px bg-white/20" />;
}

function TimeBlock({ label, value }: { label: string; value: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <span
        className="text-2xl font-extrabold tabular-nums"
        suppressHydrationWarning
      >
        {mounted ? pad(value) : "— —"}
      </span>
      <span className="text-[10px] tracking-widest text-white/60">{label}</span>
    </div>
  );
}

function BGOrbs() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full blur-3xl opacity-40" style={{ background: colors.pink }} />
      <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full blur-3xl opacity-40" style={{ background: colors.lavender }} />
    </div>
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

/* =======================
   DESKTOP RIBBON
======================= */
function HorizontalRibbon({
  eras,
}: {
  eras: { year: number; month: number | string; day?: number | string; label: string; img: string }[];
}) {
  const localRef = React.useRef<HTMLDivElement | null>(null);

  const items = React.useMemo(
    () =>
      [...eras].sort(
        (a, b) =>
          (a.year - b.year) ||
          (monthToNumber(a.month) - monthToNumber(b.month)) ||
          (dayToNumber(a.day ?? 1) - dayToNumber(b.day ?? 1))
      ),
    [eras]
  );

  return (
    <div className="hidden md:block relative mt-6">
      {/* Baseline behind everything */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-white/20 z-0" />

      {/* Edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex">
        <span className="w-10 bg-gradient-to-r from-[#0b0b0b] to-transparent" />
        <span className="flex-1" />
        <span className="w-10 bg-gradient-to-l from-[#0b0b0b] to-transparent" />
      </div>

      {/* Side arrows */}
      <button
        onClick={() => localRef.current?.scrollBy({ left: -420, behavior: "smooth" })}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-40 rounded-full border border-white/15 bg-black/40 backdrop-blur px-2 py-1 text-xs hover:bg-white/15"
        aria-label="Scroll left"
      >
        ←
      </button>
      <button
        onClick={() => localRef.current?.scrollBy({ left: 420, behavior: "smooth" })}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-40 rounded-full border border-white/15 bg-black/40 backdrop-blur px-2 py-1 text-xs hover:bg-white/15"
        aria-label="Scroll right"
      >
        →
      </button>

      {/* Scroll area */}
      <div ref={localRef} className="relative z-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <ul className="flex min-w-max gap-6 py-10 pr-6">
          {items.map((e, idx) => {
            const above = idx % 2 === 0; // alternate up/down
            const key = ymdKey(e.year, e.month, e.day ?? 1, e.label);
            const anchor = key;
            const mm = pad2(monthToNumber(e.month));
            const dd = pad2(dayToNumber(e.day ?? 1));

            return (
              <li key={key} className="relative snap-start">
                {/* connector from baseline to card */}
                <div
                  className={`
                    absolute left-1/2 -translate-x-1/2 w-px bg-white/30 z-20
                    ${above ? "bottom-1/2" : "top-1/2"}
                  `}
                  style={{ height: 40 }}
                />
                {/* baseline dot */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-white z-20" />

                {/* CARD — opaque bg so baseline doesn't show through */}
                <a
                  href={`/era#${anchor}`}
                  className={`
                    relative block w-[220px] rounded-xl overflow-hidden
                    border border-white/10 bg-[#111]
                    shadow-[0_4px_16px_rgba(0,0,0,0.35)]
                    transition-transform hover:-translate-y-1 z-30
                    ${above ? "-translate-y-10" : "translate-y-10"}
                  `}
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={e.img}
                      alt={`${e.year}.${mm}.${dd} · ${e.label}`}
                      fill
                      sizes="(min-width:1024px) 220px, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2 text-xs">
                    <div className="text-white/60">{e.year}.{mm}.{dd}</div>
                    <div className="font-semibold truncate">{e.label}</div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
