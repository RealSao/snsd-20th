// scripts/generate-seed.ts
/* Run:  npx tsx scripts/generate-seed.ts */
import fs from "node:fs";
import path from "node:path";
import { ERAS } from "../src/data/eras";

const monthMap: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5,
  jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};
const toMonth = (m: unknown): number => {
  if (typeof m === "number") return m;
  const s = String(m ?? "").trim().toLowerCase();
  if (!s) return 1;
  if (/^\d+$/.test(s)) return Math.min(12, Math.max(1, parseInt(s, 10)));
  return monthMap[s] ?? 1;
};
const esc = (s: unknown) => JSON.stringify(String(s ?? ""));

function makeItem(era: any) {
  const title = era.label ?? era.title ?? "Untitled";
  const year = Number(era.year ?? era.date?.year ?? 2000);
  const month = toMonth(era.month ?? era.date?.month ?? 1);
  const day = era.day ?? era.date?.day;
  const cover = era.cover ?? era.image ?? "";

  const date = day != null
    ? `{ year: ${year}, month: ${month}, day: ${day} }`
    : `{ year: ${year}, month: ${month} }`;

  return `{
  title: ${esc(title)},
  type: "" as const, // ← fill manually later
  date: ${date},
  cover: ${esc(cover)},
  eraAnchor: ymdKey(${year}, ${month}, ${day ?? 1}, ${esc(title)}),
  links: {},
  tracks: [],
},`;
}

const items = (ERAS as any[]).map(makeItem).join("\n\n");

const out = `
import { ymdKey } from "@/lib/date";

export type Track = { no?: number; title: string; duration?: string; titleTrack?: boolean; note?: string };
export type RepackageMeta = { baseTitle: string; addedTracks: Track[] };

export type DiscographySeed = {
  title: string;
  type: ""; // intentionally empty; you will annotate per item
  date: { year: number; month: number; day?: number };
  cover: string;
  eraAnchor: string;
  links?: { spotify?: string; apple?: string; youtube?: string };
  tracks: Track[];
  repackage?: RepackageMeta;
  keywords?: string[];
};

export const SEED = [
${items}
] as const satisfies ReadonlyArray<DiscographySeed>;
`;

const target = path.join(process.cwd(), "src/data/discography.seed.ts");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out, "utf8");
console.log(`✔ Wrote ${target}`);
