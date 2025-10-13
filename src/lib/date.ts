// src/lib/date.ts
// Flexible month/day utilities: supports 1–12/1–31, "08", "Aug", "August", etc.

export type MonthLike = number | string;
export type DayLike = number | string;

const MONTHS: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

export function monthToNumber(m: MonthLike): number {
  if (typeof m === "number" && Number.isFinite(m)) {
    return clampInt(m, 1, 12);
  }
  const s = String(m).trim().toLowerCase().replace(/\./g, "");
  const asNum = Number(s);
  if (!Number.isNaN(asNum)) return clampInt(asNum, 1, 12);
  const mapped = MONTHS[s];
  if (mapped) return mapped;
  throw new Error(`Invalid month value: ${m}`);
}

export function dayToNumber(d: DayLike): number {
  if (typeof d === "number" && Number.isFinite(d)) {
    return clampInt(d, 1, 31);
  }
  const n = Number(String(d).trim());
  if (!Number.isNaN(n)) return clampInt(n, 1, 31);
  throw new Error(`Invalid day value: ${d}`);
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function ymdKey(
  year: number,
  month: MonthLike,
  day: DayLike,
  label?: string
) {
  const mm = pad2(monthToNumber(month));
  const dd = pad2(dayToNumber(day));
  const slug = (label ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${year}-${mm}-${dd}${slug ? `-${slug}` : ""}`;
}

function clampInt(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.trunc(v)));
}
