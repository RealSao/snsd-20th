'use client';

import { useEffect, useRef } from 'react';

type Props = {
  className?: string;
  split?: number;                       // 0..1 boundary: top (star) / bottom (silhouette)
  containerSelector?: string;           // e.g. '#hero' to match the hero size exactly
  starMinPx?: number;
  starMaxPx?: number;

  silhouetteSrc?: string;               // e.g. '/silhouette.png' in /public
  silhouetteMaxWidthRatio?: number;     // portion of width inside bottom band (0..1)
  silhouetteMaxHeightRatio?: number;    // portion of height inside bottom band (0..1)
  silhouetteBottomMarginRatio?: number; // how far above bottom (ratio of bottom band)

  // NEW: smooth fade controls (time constants)
  silhouetteFadeInMs?: number;          // slower = larger number; default 900ms
  silhouetteFadeOutMs?: number;         // default 1200ms (even slower)
};

export default function GlowSilhouetteCanvas({
  className = 'w-full h-full',
  split = 0.58,
  containerSelector,
  starMinPx = 14,
  starMaxPx = 28,

  silhouetteSrc = '/silhouette.png',
  silhouetteMaxWidthRatio = 0.90,
  silhouetteMaxHeightRatio = 0.88,
  silhouetteBottomMarginRatio = 0.06,

  silhouetteFadeInMs = 900,
  silhouetteFadeOutMs = 1200,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const cleanup = init(canvas, {
      split,
      containerSelector,
      starMinPx,
      starMaxPx,
      silhouetteSrc,
      silhouetteMaxWidthRatio,
      silhouetteMaxHeightRatio,
      silhouetteBottomMarginRatio,
      silhouetteFadeInMs,
      silhouetteFadeOutMs,
    });
    return cleanup;
  }, [
    split,
    containerSelector,
    starMinPx,
    starMaxPx,
    silhouetteSrc,
    silhouetteMaxWidthRatio,
    silhouetteMaxHeightRatio,
    silhouetteBottomMarginRatio,
    silhouetteFadeInMs,
    silhouetteFadeOutMs,
  ]);

  return (
    <canvas
      ref={ref}
      className={`${className} block touch-none bg-transparent`}
      aria-label="SNSD overlay star & silhouettes"
      role="img"
    />
  );
}

function init(
  canvas: HTMLCanvasElement,
  opts: {
    split: number;
    containerSelector?: string;
    starMinPx: number; starMaxPx: number;
    silhouetteSrc: string;
    silhouetteMaxWidthRatio: number;
    silhouetteMaxHeightRatio: number;
    silhouetteBottomMarginRatio: number;
    silhouetteFadeInMs: number;
    silhouetteFadeOutMs: number;
  }
) {
  const {
    split,
    containerSelector,
    starMinPx,
    starMaxPx,
    silhouetteSrc,
    silhouetteMaxWidthRatio,
    silhouetteMaxHeightRatio,
    silhouetteBottomMarginRatio,
    silhouetteFadeInMs,
    silhouetteFadeOutMs,
  } = opts;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  canvas.style.width = '100%';
  canvas.style.height = '100%';

  // find the host (hero) whose size we mirror
  const host =
    (containerSelector ? (document.querySelector(containerSelector) as HTMLElement | null) : null) ??
    findNearestSizedAncestor(canvas) ??
    canvas.parentElement ??
    document.body;

  // load the silhouette image
  const img = new Image();
  img.decoding = 'async';
  img.src = silhouetteSrc;
  let imgReady = false;
  img.onload = () => { imgReady = true; };
  img.onerror = () => { imgReady = false; };

  let raf = 0;
  let hostRO: ResizeObserver | null = null;
  let cvRO: ResizeObserver | null = null;

  const resizeToHost = () => {
    const r = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); // draw 1:1 in CSS pixels
  };

  resizeToHost();
  requestAnimationFrame(resizeToHost);
  setTimeout(resizeToHost, 0);

  if (typeof ResizeObserver !== 'undefined') {
    hostRO = new ResizeObserver(resizeToHost);
    hostRO.observe(host);
    cvRO = new ResizeObserver(resizeToHost);
    cvRO.observe(canvas);
  } else {
    window.addEventListener('resize', resizeToHost);
  }

  // --- state ---
  const state = {
    hasPointer: false,
    x: 0, y: 0,
    sx: 0, sy: 0,
    px: 0, py: 0,
    starAlpha: 0,
    silhouettesAlpha: 0,
  };

  {
    const r = host.getBoundingClientRect();
    state.sx = r.width / 2;
    state.sy = r.height * (split * 0.45);
    state.px = state.sx; state.py = state.sy;
  }

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // cute five-point star
  const drawStar = (x: number, y: number, alpha: number, w: number, h: number) => {
    const base = clamp(Math.min(w, h) * 0.035, starMinPx, starMaxPx);

    const t = performance.now() * 0.002;
    const pulse = 1 + Math.sin(t) * 0.06;
    const vx = state.sx - state.px;
    const vy = state.sy - state.py;
    const rot = Math.atan2(vy, vx) - Math.PI / 2;

    const outerR = base * pulse;
    const innerR = outerR * 0.62;

    ctx.save();
    ctx.globalAlpha = alpha * 0.7;
    ctx.filter = 'blur(8px)';
    ctx.fillStyle = 'rgba(255,145,180,0.95)';
    pathStar(ctx, x, y, 5, outerR * 1.25, innerR * 1.25, rot);
    ctx.fill();
    ctx.restore();

    const grad = ctx.createRadialGradient(x, y, 0, x, y, outerR);
    grad.addColorStop(0, '#FFF0F6');
    grad.addColorStop(0.55, '#FF9EBB');
    grad.addColorStop(1, '#FF6C9A');

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.filter = 'blur(0.8px)';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.fillStyle = grad;
    ctx.strokeStyle = 'rgba(255,214,230,0.95)';
    ctx.lineWidth = 1.4;
    pathStar(ctx, x, y, 5, outerR, innerR, rot);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = alpha * 0.9;
    ctx.beginPath();
    ctx.arc(x, y, outerR * 0.16, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF7FB';
    ctx.fill();
    ctx.restore();
  };

  function pathStar(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    spikes: number, outerR: number, innerR: number, rotation = -Math.PI / 2
  ) {
    const step = Math.PI / spikes;
    ctx.beginPath();
    let a = rotation;
    ctx.moveTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
    for (let i = 0; i < spikes; i++) {
      a += step;
      ctx.lineTo(cx + Math.cos(a) * innerR, cy + Math.sin(a) * innerR);
      a += step;
      ctx.lineTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
    }
    ctx.closePath();
  }

  // draw the silhouette PNG, bottom-anchored
  const drawSilhouetteImage = (alpha: number, w: number, h: number, splitY: number) => {
    if (!imgReady) return;

    const bandH = Math.max(1, h - splitY);
    const maxW = w * silhouetteMaxWidthRatio;
    const maxH = bandH * silhouetteMaxHeightRatio;

    const scale = Math.min(maxW / img.width, maxH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const x = (w - drawW) / 2;
    const y = splitY + (bandH - drawH) - bandH * silhouetteBottomMarginRatio;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.filter = 'drop-shadow(0px 12px 16px rgba(0,0,0,0.35)) blur(0.3px)';
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x, y, drawW - 50, drawH);
    ctx.restore();
  };

  // pointer
  const setPoint = (clientX: number, clientY: number) => {
    const r = host.getBoundingClientRect();
    state.hasPointer = true;
    state.x = clientX - r.left;
    state.y = clientY - r.top;
  };
  const onPointerMove = (e: PointerEvent) => setPoint(e.clientX, e.clientY);
  const onPointerDown = (e: PointerEvent) => setPoint(e.clientX, e.clientY);
  const onPointerEnter = (e: PointerEvent) => setPoint(e.clientX, e.clientY);
  const onLeave = () => { state.hasPointer = false; };

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
  canvas.addEventListener('pointerenter', onPointerEnter, { passive: true });
  canvas.addEventListener('pointerleave', onLeave, { passive: true });

  // --- main loop with time-constant fades ---
  let last = performance.now();

  const loop = () => {
    const now = performance.now();
    const dt = Math.max(0, Math.min(100, now - last)); // clamp dt to avoid jumps
    last = now;

    const w = canvas.width;
    const h = canvas.height;
    const splitY = h * split;

    ctx.clearRect(0, 0, w, h);

    // smooth pointer & keep previous for star orientation
    state.px = state.sx; state.py = state.sy;
    state.sx = state.hasPointer ? lerp(state.sx, state.x, 0.22) : state.sx;
    state.sy = state.hasPointer ? lerp(state.sy, state.y, 0.22) : state.sy;

    const inTop = state.sy <= splitY;

    // targets
    const targetStar = state.hasPointer && inTop ? 1 : 0;
    const targetSil  = state.hasPointer && !inTop ? 1 : 0;

    // star fade (keep snappy)
    const kStar = 1 - Math.exp(-dt / 160); // ~160ms time constant
    state.starAlpha += (targetStar - state.starAlpha) * kStar;

    // silhouettes fade — SLOW in/out via separate time constants
    const tau = targetSil > state.silhouettesAlpha ? silhouetteFadeInMs : silhouetteFadeOutMs;
    const kSil = 1 - Math.exp(-dt / Math.max(1, tau));
    state.silhouettesAlpha += (targetSil - state.silhouettesAlpha) * kSil;

    // draw star (top)
    if (state.starAlpha > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, splitY);
      ctx.clip();
      drawStar(state.sx, state.sy, state.starAlpha, w, h);
      ctx.restore();
    }

    // draw silhouettes (bottom)
    if (state.silhouettesAlpha > 0.02) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, splitY, w, h - splitY);
      ctx.clip();
      drawSilhouetteImage(state.silhouettesAlpha, w, h, splitY);
      ctx.restore();
    }

    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    if (hostRO) hostRO.disconnect();
    if (cvRO) cvRO.disconnect(); else window.removeEventListener('resize', resizeToHost);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointerenter', onPointerEnter);
    canvas.removeEventListener('pointerleave', onLeave);
  };
}

function findNearestSizedAncestor(el: HTMLElement): HTMLElement | null {
  let cur: HTMLElement | null = el.parentElement;
  while (cur) {
    const r = cur.getBoundingClientRect();
    if (r.width > 1 && r.height > 1) return cur;
    cur = cur.parentElement;
  }
  return null;
}
