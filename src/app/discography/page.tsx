// src/app/discography/page.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  DISCOGRAPHY,
  ALL_TYPES,
  DiscographyItem,
  Track,
  AlbumType,
} from "@/data/discography";

/* ───────────────────── Icons (minimal, monochrome) ───────────────────── */
function EraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden {...props}>
      <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18 8 12.6 4 8.7l5.4-.8L12 3z" fill="currentColor" />
    </svg>
  );
}
function SpotifyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 10.2c3.1-1 6.8-.8 9.9.5M7 13c2.6-.8 5.6-.6 8.1.4M7 15.5c2.1-.6 4.4-.5 6.4.3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden {...props}>
      <path d="M16.7 13.2c0-2.6 2.1-3.5 2.2-3.6-1.2-1.8-3-2-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.3-.8-1.7.1-3.2 1-4.1 2.6-1.8 3.1-.5 7.6 1.3 10.1.9 1.3 2 2.6 3.5 2.6 1.4-.1 1.9-.8 3.5-.8s2 .8 3.4.8c1.5 0 2.5-1.3 3.4-2.5 1.1-1.6 1.6-3.1 1.6-3.2-.1 0-3.1-1.2-3.2-3.9z" fill="currentColor" />
      <path d="M13.7 5.1c.7-.9 1.2-2 1.1-3.1-1.1.1-2.2.7-2.9 1.6-.6.7-1.2 1.9-1.1 3 1.2.1 2.2-.6 2.9-1.5z" fill="currentColor" />
    </svg>
  );
}
function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden {...props}>
      <rect x="3" y="7" width="18" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 10l4 2-4 2z" fill="currentColor" />
    </svg>
  );
}

/* ───────────────────── Reusable button for drawers ───────────────────── */
type WideButtonProps = {
  href: string;
  internal?: boolean;
  label: string;
  icon: React.ReactNode;
};
function WideButton({ href, internal = false, label, icon }: WideButtonProps) {
  const cls =
    "relative h-11 w-full rounded-xl border border-white/12 bg-white/[0.06] hover:bg-white/[0.10] backdrop-blur text-[13px] text-white/90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40";
  const inner = (
    <>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-90">{icon}</span>
      <span className="block text-center font-medium">{label}</span>
    </>
  );
  return internal ? (
    <Link href={href} aria-label={label} className={cls} title={label}>
      {inner}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls} title={label}>
      {inner}
    </a>
  );
}

// Detect/normalize embed links and render iframes
function isRawIframe(s: string) {
  return /^\s*<iframe[\s\S]*<\/iframe>\s*$/i.test(s);
}

function toSpotifyEmbed(url: string) {
  try {
    const u = new URL(url);
    // Accept both open.spotify.com/* and open.spotify.com/embed/*
    if (u.hostname.includes("open.spotify.com")) {
      if (!u.pathname.startsWith("/embed/")) {
        u.pathname = "/embed" + u.pathname; // /album/.. -> /embed/album/..
      }
      // dark theme; tweak height below
      if (!u.searchParams.has("theme")) u.searchParams.set("theme", "0");
      return u.toString();
    }
  } catch { }
  return null;
}

function toAppleEmbed(url: string) {
  try {
    const u = new URL(url);
    // music.apple.com -> embed.music.apple.com
    if (u.hostname.includes("music.apple.com")) {
      u.hostname = "embed.music.apple.com";
      return u.toString();
    }
    if (u.hostname.includes("embed.music.apple.com")) {
      return u.toString();
    }
  } catch { }
  return null;
}

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
      return u.toString();
    }
  } catch { }
  return null;
}

function EmbedPlayer({ label, srcOrIframe }: { label: string; srcOrIframe: string }) {
  // If user pasted the whole <iframe ...>…</iframe> snippet:
  if (isRawIframe(srcOrIframe)) {
    return (
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wide text-white/50">{label}</div>
        <div
          className="rounded-xl overflow-hidden border border-white/12 bg-black/30"
          // You trust the source (Spotify/Apple/YouTube). If not, avoid this branch.
          dangerouslySetInnerHTML={{ __html: srcOrIframe }}
        />
      </div>
    );
  }

  // Otherwise, it’s a URL — choose player chrome and height by platform
  const src =
    toSpotifyEmbed(srcOrIframe) ??
    toAppleEmbed(srcOrIframe) ??
    toYouTubeEmbed(srcOrIframe) ??
    srcOrIframe; // already an embed URL

  const isSpotify = /open\.spotify\.com\/embed/.test(src);
  const isApple = /embed\.music\.apple\.com/.test(src);
  const isYouTube = /youtube\.com\/embed/.test(src);

  // Sensible default heights (tweak as you like)
  const height = isSpotify ? 352 : isApple ? 450 : isYouTube ? 315 : 360;

  const allow =
    isSpotify
      ? "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      : isApple
        ? "autoplay *; encrypted-media *; clipboard-write *; fullscreen *"
        : "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

  const sandbox = isApple ? "allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" : undefined;

  return (
    <div className="space-y-1">
      <div className="text-[11px] uppercase tracking-wide text-white/50">{label}</div>
      <div className="rounded-xl overflow-hidden border border-white/12 bg-black/30">
        <iframe
          title={`${label} embed`}
          src={src}
          width="100%"
          height={height}
          loading="lazy"
          allow={allow}
          sandbox={sandbox}
          frameBorder="0"
          allowFullScreen={isYouTube}
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}


/* ───────────────────── Listen drawer (unchanged behavior) ───────────────────── */
function ListenDrawer({
  album,
  open,
  onClose,
}: {
  album: DiscographyItem;
  open: boolean;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const hasLinks =
    !!album.links?.spotify || !!album.links?.apple || !!album.links?.youtube;

  return (
    <AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[120]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute right-0 top-0 h-full w-[min(92vw,380px)] bg-[#111]/95 border-l border-white/10 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            {/* Fixed header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">{album.title}</h3>
                <p className="text-[11px] text-white/60 truncate">Listen options</p>
              </div>
              <button
                onClick={onClose}
                className="text-[11px] rounded-lg px-2 py-1 border border-white/20 hover:bg-white/10"
                aria-label="Close listen panel"
              >
                Close
              </button>
            </div>

            {/* Scrollable content */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-5"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div>
                <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1.5">Era</div>
                {album.eraAnchor ? (
                  <WideButton
                    href={`/era#${album.eraAnchor}`}
                    internal
                    label="Open Era"
                    icon={<EraIcon />}
                  />
                ) : (
                  <div className="text-[12px] text-white/40 italic">No era link</div>
                )}
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1.5">Streaming</div>
                {hasLinks ? (
                  <div className="space-y-5">
                    {album.links?.spotify && (
                      (/embed/.test(String(album.links.spotify)) || isRawIframe(String(album.links.spotify))) ? (
                        <EmbedPlayer label="Spotify" srcOrIframe={String(album.links.spotify)} />
                      ) : (
                        <WideButton href={album.links.spotify} label="Listen on Spotify" icon={<SpotifyIcon />} />
                      )
                    )}

                    {album.links?.apple && (
                      (/embed/.test(String(album.links.apple)) || isRawIframe(String(album.links.apple))) ? (
                        <EmbedPlayer label="Apple Music" srcOrIframe={String(album.links.apple)} />
                      ) : (
                        <WideButton href={album.links.apple} label="Listen on Apple Music" icon={<AppleIcon />} />
                      )
                    )}

                    {album.links?.youtube && (
                      (/embed/.test(String(album.links.youtube)) || isRawIframe(String(album.links.youtube))) ? (
                        <EmbedPlayer label="YouTube" srcOrIframe={String(album.links.youtube)} />
                      ) : (
                        <WideButton href={album.links.youtube} label="Listen on YouTube" icon={<YouTubeIcon />} />
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-[12px] text-white/40 italic">No streaming links provided.</div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}


/* ───────────── Track drawer (new) — shows originals + “+” added ───────────── */
function TrackDrawer({
  album,
  open,
  onClose,
  onlyTitleTracks,
}: {
  album: DiscographyItem;
  open: boolean;
  onClose: () => void;
  onlyTitleTracks: boolean;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // originals (from this album, or base for repackages) + added at the end
  const { originals, added } = React.useMemo(() => {
    let baseTracks: Track[] = album.tracks ?? [];
    if ((album.type === "Repackage") && album.repackage && baseTracks.length === 0) {
      const base = DISCOGRAPHY.find(
        (d) => d.title.toLowerCase() === album.repackage!.baseTitle.toLowerCase()
      );
      baseTracks = base?.tracks ?? [];
    }
    const filter = (t: Track) => (onlyTitleTracks ? !!t.titleTrack : true);
    const originals = baseTracks.filter(filter);
    const added = (album.repackage?.addedTracks ?? []).filter(filter);
    return { originals, added };
  }, [album, onlyTitleTracks]);

  return (
    <AnimatePresence>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[120]">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="absolute right-0 top-0 h-full w-[min(92vw,520px)] bg-[#111]/95 border-l border-white/10 shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            {/* Fixed header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate">{album.title}</h3>
                <p className="text-[11px] text-white/60 truncate">Track list</p>
              </div>
              <button
                onClick={onClose}
                className="text-[11px] rounded-lg px-2 py-1 border border-white/20 hover:bg-white/10"
                aria-label="Close track panel"
              >
                Close
              </button>
            </div>

            {/* Scrollable list */}
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <ol className="space-y-2">
                {originals.map((t, idx) => (
                  <li
                    key={`o-${idx}-${t.title}`}
                    className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="text-xs tabular-nums text-white/60 w-5">{idx + 1}.</span>
                      <div className="truncate">
                        <div className="text-xs font-medium truncate">{t.title}</div>
                        {t.note && <div className="text-[11px] text-white/60 truncate">{t.note}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.titleTrack && (
                        <span className="rounded-full border border-white/20 px-1.5 py-0.5 text-[10px]">TITLE</span>
                      )}
                      {t.duration && <span className="text-[11px] text-white/60 tabular-nums">{t.duration}</span>}
                    </div>
                  </li>
                ))}

                {added.length > 0 && (
                  <li className="py-1">
                    <div className="text-[11px] uppercase tracking-wide text-white/50 px-1">Added tracks</div>
                  </li>
                )}

                {added.map((t, idx) => (
                  <li
                    key={`a-${idx}-${t.title}`}
                    className="flex items-center justify-between rounded-md border border-white/10 bg-black/20 px-3 py-2"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <span className="text-xs text-white/60 w-5">+</span>
                      <div className="truncate">
                        <div className="text-xs font-medium truncate">{t.title}</div>
                        {t.note && <div className="text-[11px] text-white/60 truncate">{t.note}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {t.titleTrack && (
                        <span className="rounded-full border border-white/20 px-1.5 py-0.5 text-[10px]">TITLE</span>
                      )}
                      {t.duration && <span className="text-[11px] text-white/60 tabular-nums">{t.duration}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}


/* ───────────── Smarter, scoped search (no false “igab”) ───────────── */
function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[’‘“”]/g, "'")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9가-힣\s\.]/g, " ")   // keep periods for "mr.mr."
    .replace(/\s+/g, " ")
    .trim();
}
function compact(s: string) {
  // remove spaces and punctuation for alias matches (e.g., "mr.mr." -> "mrmr")
  return s.replace(/[^a-z0-9가-힣]/g, "");
}
function buildIndex(a: DiscographyItem) {
  const titleNorm = normalize(a.title);
  const titleComp = compact(titleNorm);
  const kwNorm = (a.keywords ?? []).map(normalize);
  const kwComp = (a.keywords ?? []).map((k) => compact(normalize(k)));
  // optional: include tracks for title/track search, not used for alias matching
  const tracksNorm = a.tracks.map((t) => normalize(t.title)).join(" ");
  return { titleNorm, titleComp, kwNorm, kwComp, tracksNorm, year: String(a.date.year) };
}
function matchesQuery(a: DiscographyItem, q: string) {
  const nq = normalize(q);
  if (!nq) return true;

  const { titleNorm, titleComp, kwNorm, kwComp, tracksNorm, year } = buildIndex(a);

  // split tokens; ALL tokens must match somewhere
  const tokens = nq.split(/\s+/).filter(Boolean);

  return tokens.every((tok) => {
    const ctok = compact(tok);
    const isShort = tok.length <= 2;

    // For very short tokens ("mr") require word-boundary match on title or keywords
    const boundary = new RegExp(`\\b${tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

    const wordHit =
      boundary.test(titleNorm) || kwNorm.some((k) => boundary.test(k));

    const aliasHit =
      titleComp.includes(ctok) || kwComp.some((k) => k.includes(ctok));

    const textHit =
      (!isShort && (titleNorm.includes(tok) || tracksNorm.includes(tok))) ||
      year.includes(tok);

    return (isShort ? wordHit : false) || aliasHit || textHit;
  });
}

/* ───────────────────── Page ───────────────────── */
export default function DiscographyPage() {
  const [q, setQ] = React.useState("");
  // single-select filter (uses your AlbumType)
  const [selectedType, setSelectedType] = React.useState<AlbumType | null>(null);
  const [onlyTitleTracks, setOnlyTitleTracks] = React.useState(false);

  const [hash, setHash] = React.useState<string>("");
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace(/^#/, ""));
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const items = React.useMemo(() => {
    return DISCOGRAPHY.filter((it) => {
      const typeOk = !selectedType || it.type === selectedType;
      const searchOk = matchesQuery(it, q);
      return typeOk && searchOk;
    }).sort((a, b) => {
      if (a.date.year !== b.date.year) return b.date.year - a.date.year;
      if (a.date.month !== b.date.month) return b.date.month - a.date.month;
      return (b.date.day ?? 1) - (a.date.day ?? 1);
    });
  }, [q, selectedType]);

  const byYear = React.useMemo(() => {
    const m = new Map<number, DiscographyItem[]>();
    for (const it of items) {
      if (!m.has(it.date.year)) m.set(it.date.year, []);
      m.get(it.date.year)!.push(it);
    }
    return [...m.entries()].sort((a, b) => b[0] - a[0]);
  }, [items]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Discography</h1>
          <p className="mt-1 text-sm text-white/70">Filter by type, search, and open track lists.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* pills: single select */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide sm:flex-wrap sm:overflow-visible sm:whitespace-normal">
            {ALL_TYPES.map((t) => {
              const active = selectedType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType((prev) => (prev === t ? null : t))}
                  className={[
                    "px-3 py-1.5 rounded-xl border text-xs",
                    active ? "bg-white text-black border-white" : "border-white/20 hover:bg-white/10",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
            {selectedType && (
              <button
                onClick={() => setSelectedType(null)}
                className="text-xs opacity-80 hover:opacity-100 underline underline-offset-4 ml-1"
              >
                Reset
              </button>
            )}
          </div>

          <label className="relative block">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Search albums, tracks or years…'
              className="w-full sm:w-72 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-200/40"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/50">
              ⌘K
            </span>
          </label>

          <label className="flex items-center gap-2 text-xs select-none">
            <input
              type="checkbox"
              checked={onlyTitleTracks}
              onChange={(e) => setOnlyTitleTracks(e.target.checked)}
            />
            Show only title tracks
          </label>
        </div>
      </header>

      <div className="space-y-10">
        {byYear.map(([year, list]) => (
          <section key={year} className="scroll-mt-24" id={`y-${year}`}>
            <div className="sticky top-16 z-10 -mx-4 px-4 py-2 bg-[#0b0b0b]/70 backdrop-blur border-b border-white/10">
              <h2 className="text-sm font-semibold text-white/80">{year}</h2>
            </div>

            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onlyTitleTracks={onlyTitleTracks}
                  defaultOpen={hash === album.id}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

/* ───────────────────── Album Card ───────────────────── */
function AlbumCard({
  album,
  onlyTitleTracks,
  defaultOpen = false,
}: {
  album: DiscographyItem;
  onlyTitleTracks: boolean;
  defaultOpen?: boolean;
}) {
  const [openTracks, setOpenTracks] = React.useState(false);
  const [openListen, setOpenListen] = React.useState(false);

  React.useEffect(() => {
    if (defaultOpen) {
      document.getElementById(album.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [defaultOpen, album.id]);

  // Count originals + added for the pill label
  const trackCount = React.useMemo(() => {
    let base = album.tracks?.length ?? 0;
    if (album.type === "Repackage" && album.repackage && base === 0) {
      const found = DISCOGRAPHY.find(
        d => d.title.toLowerCase() === album.repackage!.baseTitle.toLowerCase()
      );
      base = found?.tracks.length ?? 0;
    }
    const added = album.repackage?.addedTracks.length ?? 0;
    return base + added;
  }, [album]);

  const pill =
    "text-[11px] rounded-full px-2.5 py-1 border border-white/20 bg-white/[0.04] hover:bg-white/[0.08]";

  const hasAnyLink =
    !!album.eraAnchor || !!album.links?.spotify || !!album.links?.apple || !!album.links?.youtube;

  return (
    <li id={album.id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="relative aspect-[16/10]">
        <Image
          src={album.cover}
          alt={`${album.title} cover`}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] border border-white/10">
            {album.type}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{album.title}</h3>
            <p className="text-xs text-white/60">
              {album.date.year}.{String(album.date.month).padStart(2, "0")}
              {album.date.day ? "." + String(album.date.day).padStart(2, "0") : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenTracks(true)}
              className={pill}
              aria-haspopup="dialog"
            >
              Tracks ({trackCount})
            </button>

            {album.eraAnchor && (
              <Link href={`/era#${album.eraAnchor}`} className={pill} aria-label={`Open era for ${album.title}`}>
                Era
              </Link>
            )}

            {hasAnyLink && (
              <button onClick={() => setOpenListen(true)} className={pill} aria-haspopup="dialog">
                Listen
              </button>
            )}
          </div>
        </div>

        {/* Drawers */}
        <TrackDrawer album={album} open={openTracks} onClose={() => setOpenTracks(false)} onlyTitleTracks={onlyTitleTracks} />
        <ListenDrawer album={album} open={openListen} onClose={() => setOpenListen(false)} />
      </div>
    </li>
  );
}
