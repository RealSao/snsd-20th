"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const colors = {
  pink: "#FFCCE5",
  lavender: "#C4A1FF",
  charcoal: "#1E1E1E",
  ivory: "#FEFDFB",
};

const ANNIVERSARY_DATE_KST = Date.parse("2027-08-04T15:00:00Z");

const FIRST_CODE = "20070805";
const SECOND_CODE = "3458912256";

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

const eras = [
  { year: 2007, label: "Into the New World", img: "/images/eras/2007-itnw.jpg" },
  { year: 2009, label: "Gee", img: "/images/eras/2009-gee.jpg" },
  { year: 2011, label: "The Boys", img: "/images/eras/2011-theboys.jpg" },
  { year: 2013, label: "I Got a Boy", img: "/images/eras/2013-igab.jpg" },
  { year: 2015, label: "Lion Heart", img: "/images/eras/2015-lionheart.jpg" },
  { year: 2017, label: "Holiday Night", img: "/images/eras/2017-holidaynight.jpg" },
  { year: 2022, label: "Forever 1", img: "/images/eras/2022-forever1.jpg" },
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

export default function AnniversaryLanding() {
  const { days, hours, minutes, seconds } = useCountdown(ANNIVERSARY_DATE_KST);
  const [egg, setEgg] = useState(false);
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [clickSeq, setClickSeq] = useState("");

  // Keypad state
  const [keypadStage, setKeypadStage] = useState<1 | 2>(2);
  const [firstSeq, setFirstSeq] = useState("");
  const [secondSeq, setSecondSeq] = useState("");

  const openKeypad = (stage: 1 | 2) => {
    setKeypadStage(stage);
    setKeypadOpen(true);
    setFirstSeq("");
    setSecondSeq("");
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // only digits matter
      if (!/[0-9]/.test(e.key)) return;
      const next = (typed + e.key).slice(-FIRST_CODE.length); // keep last N
      setTyped(next);
      if (next === FIRST_CODE) {
        setKeypadOpen(true);
        setClickSeq(""); // reset second-stage buffer
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [typed]);

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startLongPress = () => {
    if (egg) return; // already unlocked
    pressTimer.current = setTimeout(() => openKeypad(1), 700);
  };
  const endLongPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const members = egg ? allMembersOrdered : allMembersOrdered.filter((m) => m.name !== "Jessica");


  const onKeypadDigit = (d: string) => {
    const next = (clickSeq + d).slice(0, SECOND_CODE.length);
    setClickSeq(next);
    if (SECOND_CODE.startsWith(next)) {
      if (next === SECOND_CODE) {
        setEgg(true);
        setKeypadOpen(false); // close keypad when solved
      }
    } else {
      // wrong step → reset just the second stage
      setClickSeq("");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(196,161,255,0.25),transparent),linear-gradient(180deg,#0b0b0b,#141414)] text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-pink-300" style={{ background: colors.pink }} />
            <span className="font-bold tracking-widest">GIRLS&#39; GENERATION</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="hover:text-pink-200" href="#timeline">Timeline</a>
            <a className="hover:text-pink-200" href="#members">Members</a>
            <a className="hover:text-pink-200" href="#discography">Discography</a>
            <a className="hover:text-pink-200" href="#fan">Fan Space</a>
          </nav>
          <a href="#fan" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-xs">Leave a Message</a>
        </div>
      </header>

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

                  // pick image for each tile (your existing logic)
                  const data = memberForGridIndex(i, egg); // from your previous step
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
      <section id="timeline" className="scroll-mt-24 py-14 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">Era Ribbon</h2>
          <div className="relative overflow-x-auto">
            <div className="min-w-[800px] grid grid-cols-8 gap-3">
              {eras.map((e) => (
                <motion.div
                  key={e.year}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10">
                    <Image
                      src={e.img}
                      alt={`${e.year} · ${e.label}`}
                      fill
                      sizes="(min-width:1024px) 12rem, 60vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-2 text-sm font-semibold">{e.year}</div>
                  <div className="text-xs text-white/70">{e.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERS MOSAIC */}
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

      {/* DISCOGRAPHY PREVIEW */}
      <section id="discography" className="scroll-mt-24 py-14 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-xl font-bold">Discography</h2>
            <a href="#discography" className="text-xs hover:text-pink-200">See all albums →</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Into the New World", "The Boys", "Forever 1"].map((title, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="aspect-video w-full rounded-xl bg-white/10 border border-white/10" />
                <div className="mt-3 text-sm font-semibold">{title}</div>
                <div className="text-xs text-white/70">Album · Tracklist · Listen</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAN SPACE CTA */}
      <section id="fan" className="scroll-mt-24 py-16 border-t border-white/10">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-extrabold">Write Your 20th Anniversary Message</h2>
          <p className="mt-2 text-sm text-white/70">Share a memory, a lyric that changed you, or a simple “소녀시대 영원히!”</p>
          <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-3">
            <input
              placeholder="Type your message…"
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-pink-200/50"
            />
            <button className="rounded-2xl px-5 py-3 bg-white text-black text-sm font-semibold hover:opacity-90">Post</button>
          </div>
          <p className="mt-3 text-xs text-white/60">(Local-only prototype. Backend can be added later.)</p>
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

      <BackToTop />

      {keypadOpen && (
        <SecretKeypad
          title={keypadStage === 1 ? "Enter Code (1/2)" : "Enter Code (2/2)"}
          expected={keypadStage === 1 ? FIRST_CODE : SECOND_CODE}
          progress={
            keypadStage === 1 ? firstSeq.length : secondSeq.length
          }
          total={
            keypadStage === 1 ? FIRST_CODE.length : SECOND_CODE.length
          }
          onDigit={(d) => {
            if (keypadStage === 1) {
              const next = (firstSeq + d).slice(0, FIRST_CODE.length);
              if (FIRST_CODE.startsWith(next)) {
                setFirstSeq(next);
                if (next === FIRST_CODE) {
                  // transition to stage 2
                  setKeypadStage(2);
                  setSecondSeq("");
                }
              } else {
                setFirstSeq(""); // reset on wrong step
              }
            } else {
              const next = (secondSeq + d).slice(0, SECOND_CODE.length);
              if (SECOND_CODE.startsWith(next)) {
                setSecondSeq(next);
                if (next === SECOND_CODE) {
                  setEgg(true);
                  setKeypadOpen(false);
                }
              } else {
                setSecondSeq(""); // reset on wrong step
              }
            }
          }}
          onClose={() => setKeypadOpen(false)}
        />
      )}

    </div>
  );
}

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

function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
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

function SecretKeypad({
  title,
  expected,
  progress,
  total,
  onDigit,
  onClose,
}: {
  title: string;
  expected: string;
  progress: number;
  total: number;
  onDigit: (d: string) => void;
  onClose: () => void;
}) {
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
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
        <div className="mt-2 text-[11px] text-white/60">
          Tap the tiles in order
        </div>

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