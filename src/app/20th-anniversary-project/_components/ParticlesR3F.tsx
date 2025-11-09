'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

type Pt = [number, number, number];

const PARTICLE_COUNT = 36000;         // ↑ to 48000–64000 on strong GPUs
const DOT_SIZE = 2.0;                 // screen pixels; shader softens edges
const CENTER_Y = 0.44;                // relative vertical center
const BAND_H = 0.52;                  // sampling band height (relative)
const MAX_W = 0.95;                   // max width ratio for glyph fit
const ALPHA = 150;                    // glyph alpha threshold
const JITTER = 0.25;                  // sub-pixel jitter
const CLOUD_PAD = 8;                  // keep “cloud” off the edges

function sampleGlyphPoints(text: string, w: number, h: number, n: number): Float32Array {
  const bandW = Math.floor(w * MAX_W);
  const bandH = Math.floor(h * BAND_H);
  const left = Math.floor((w - bandW) / 2);
  const top = Math.floor(h * (CENTER_Y - BAND_H / 2));

  const cvs = document.createElement('canvas');
  cvs.width = bandW;
  cvs.height = bandH;
  const ctx = cvs.getContext('2d', { willReadFrequently: true })!;

  // fit text to band
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';

  const SCALE_20 = 0.55;      // ↓ from 0.94
  const SCALE_INF = 0.8;     // unchanged
  const SCALE_DEFAULT = 0.90;

  let fs = Math.floor(
    bandH * (text === '∞' ? SCALE_INF : text === '20' ? SCALE_20 : SCALE_DEFAULT)
  );
  ctx.font = `${fs}px "Playfair Display", serif`;
  const mw = ctx.measureText(text).width;
  if (mw > bandW) {
    fs = Math.floor(fs * (bandW / mw));
    ctx.font = `${fs}px "Playfair Display", serif`;
  }
  ctx.clearRect(0, 0, bandW, bandH);
  ctx.fillText(text, bandW / 2, bandH / 2);

  const data = ctx.getImageData(0, 0, bandW, bandH).data;

  // collect all opaque pixels (dense)
  const pts: Pt[] = [];
  for (let y = 0; y < bandH; y++) {
    const row = y * bandW;
    for (let x = 0; x < bandW; x++) {
      const a = data[((row + x) << 2) + 3];
      if (a > ALPHA) {
        pts.push([
          left + x + (Math.random() - 0.5) * JITTER,
          top + y + (Math.random() - 0.5) * JITTER,
          0,
        ]);
      }
    }
  }

  // fit to exact N (downsample or densify)
  const out = new Float32Array(n * 3);
  if (pts.length >= n) {
    // linear-time downsample
    let need = n;
    for (let i = 0, k = 0; i < pts.length && need > 0; i++) {
      const leftCount = pts.length - i;
      if (Math.random() < need / leftCount) {
        const p = pts[i];
        out[k++] = p[0]; out[k++] = p[1]; out[k++] = 0;
        need--;
      }
    }
  } else {
    // copy all and densify with subpixel jitter
    let k = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]; out[k++] = p[0]; out[k++] = p[1]; out[k++] = 0;
    }
    while (k < out.length) {
      const b = pts[Math.floor(Math.random() * pts.length)] ?? [w / 2, h / 2, 0];
      const ang = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.7) * 1.4;
      out[k++] = b[0] + Math.cos(ang) * r;
      out[k++] = b[1] + Math.sin(ang) * r;
      out[k++] = 0;
    }
  }
  return out;
}

function makeCloudPoints(w: number, h: number, n: number): Float32Array {
  // ellipse centered at (w/2, h*CENTER_Y), uniform by area
  const cx = w / 2, cy = h * CENTER_Y;
  const rx = Math.max(10, Math.min(cx - CLOUD_PAD, w * 0.46));
  const ry = Math.max(10, Math.min(h * 0.48 - CLOUD_PAD, h * 0.36));
  const out = new Float32Array(n * 3);
  for (let i = 0, k = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random());
    out[k++] = cx + rx * r * Math.cos(t);
    out[k++] = cy + ry * r * Math.sin(t);
    out[k++] = 0;
  }
  return out;
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const phase = useRef({ t: 0 }); // 0..1 within current segment

  const { geom, mat, drive } = useMemo(() => {
    // Create geometry with 3 target attributes: A=“20”, B=“∞”, C=cloud
    const w = window.innerWidth * window.devicePixelRatio;
    const h = window.innerHeight * window.devicePixelRatio;

    const A = sampleGlyphPoints('20', w, h, PARTICLE_COUNT);
    const B = sampleGlyphPoints('∞', w, h, PARTICLE_COUNT);
    const C = makeCloudPoints(w, h, PARTICLE_COUNT);

    const geom = new THREE.BufferGeometry();
    // position is computed in the vertex shader; still need a dummy attribute
    geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
    geom.setAttribute('targetA', new THREE.BufferAttribute(A, 3));
    geom.setAttribute('targetB', new THREE.BufferAttribute(B, 3));
    geom.setAttribute('targetC', new THREE.BufferAttribute(C, 3));

    const vert = `
      attribute vec3 targetA;
      attribute vec3 targetB;
      attribute vec3 targetC;
      uniform float uStage;   // 0:A hold, 1: disperse to C, 2: assemble B, 3: hold B, 4: disperse to C, 5: assemble A
      uniform float uT;       // 0..1 progress within current stage
      uniform float uSize;    // pixel size
      uniform vec2 uRes;      // viewport size (px)
      varying float vAlpha;

      vec3 mix2(vec3 a, vec3 b, float t) {
        float tt = smoothstep(0.0, 1.0, t);
        return mix(a, b, tt);
      }

      void main() {
        vec3 p;
        if (uStage < 0.5) {               // Stage 0: HOLD A (20)
          p = targetA;
        } else if (uStage < 1.5) {        // Stage 1: A -> C (disperse)
          p = mix2(targetA, targetC, uT);
        } else if (uStage < 2.5) {        // Stage 2: C -> B (assemble)
          p = mix2(targetC, targetB, uT);
        } else if (uStage < 3.5) {        // Stage 3: HOLD B (∞)
          p = targetB;
        } else if (uStage < 4.5) {        // Stage 4: B -> C (disperse)
          p = mix2(targetB, targetC, uT);
        } else {                           // Stage 5: C -> A (assemble)
          p = mix2(targetC, targetA, uT);
        }

        // convert from pixel space to NDC (-1..1)
        vec2 ndc = vec2(
          (p.x / uRes.x) * 2.0 - 1.0,
          1.0 - (p.y / uRes.y) * 2.0
        );
        gl_Position = vec4(ndc, 0.0, 1.0);
        gl_PointSize = uSize;
        vAlpha = 1.0;
      }
    `;

    const frag = `
      precision highp float;
      varying float vAlpha;
      void main() {
        // soft disc
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float d = dot(uv, uv);
        float a = smoothstep(1.0, 0.6, d) * vAlpha;
        gl_FragColor = vec4(1.0, 0.97, 0.98, a);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending, // try AdditiveBlending for glow
      uniforms: {
        uStage: { value: 0 },
        uT: { value: 0 },
        uSize: { value: DOT_SIZE * window.devicePixelRatio },
        uRes: { value: new THREE.Vector2(w, h) },
      },
    });

    // Timeline driver (GSAP): 0 hold → 1 disperse → 2 assemble → 3 hold → 4 disperse → 5 assemble → loop
    const drive = () => {
      const u = mat.uniforms as any;
      const set = (stage: number, dur: number) =>
        gsap.fromTo(u.uT, { value: 0 }, { value: 1, duration: dur, ease: stage % 2 === 0 ? 'none' : 'power3.inOut', onUpdate: () => { u.uStage.value = stage; } });

      const tl = gsap.timeline({ repeat: -1 });
      tl.call(() => { u.uStage.value = 0; u.uT.value = 0; }).to({}, { duration: 2.0 }); // hold A
      tl.add(set(1, 1.1)); // A->C
      tl.add(set(2, 1.9)); // C->B
      tl.call(() => { u.uStage.value = 3; u.uT.value = 0; }).to({}, { duration: 2.0 }); // hold B
      tl.add(set(4, 1.1)); // B->C
      tl.add(set(5, 1.9)); // C->A
      return tl;
    };

    return { geom, mat, drive };
  }, []);

  // kick timeline once mounted
  useMemo(() => { const tl = drive(); return () => tl.kill(); }, [drive]);

  // keep resolution uniform in sync on resize
  useFrame(({ size }) => {
    const u = (pointsRef.current.material as THREE.ShaderMaterial).uniforms as any;
    u.uRes.value.set(size.width * window.devicePixelRatio, size.height * window.devicePixelRatio);
    u.uSize.value = DOT_SIZE * window.devicePixelRatio;
  });

  return <points ref={pointsRef} geometry={geom} material={mat} />;
}

export default function ParticlesR3F() {
  return (
    <Canvas
      orthographic // we work in screen-space; NDC transform in shader
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      className="w-full h-full"
    >
      <Particles />
    </Canvas>
  );
}
