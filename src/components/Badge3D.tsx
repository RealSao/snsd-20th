"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useFrame } from "@react-three/fiber";
import { Center, Environment, useGLTF } from "@react-three/drei";
import type { Group, WebGLRenderer } from "three";

// Client-only Canvas (prevents hydration races)
const R3FCanvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

function BadgeModel({ speed = 0.35, scale = 1.15 }: { speed?: number; scale?: number }) {
  const { scene } = useGLTF("/models/gg-badge.glb");
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return <primitive ref={ref} object={scene} scale={scale} />;
}
// Preload so we don't need <Suspense>
useGLTF.preload("/models/gg-badge.glb");

export function Badge3D({
  onClick,
  size = 36,
}: {
  onClick: () => void;
  size?: number;
}) {
  const [canvasKey, setCanvasKey] = useState(0);

  return (
    <div
      onClick={onClick}
      role="button"
      aria-label="Open 9-badge"
      className="ml-2 inline-flex items-center justify-center rounded-full overflow-hidden bg-transparent cursor-pointer"
      style={{ width: size, height: size }}
    >
      <R3FCanvas
        key={canvasKey}
        dpr={[1, 1]} // lighter than [1,2]
        gl={{
          alpha: true,
          antialias: false, // reduce GPU pressure
          powerPreference: "low-power",
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 1.9], fov: 40 }} // original framing
        onCreated={({ gl }) => {
          const r = gl as WebGLRenderer;
          // mild exposure bump to keep the "perfect light" look
          r.toneMappingExposure = 1.2;
          const c = r.domElement as HTMLCanvasElement;
          const onLost = (e: Event) => (e as WebGLContextEvent).preventDefault?.();
          const onRestored = () => setCanvasKey((k) => k + 1);
          c.addEventListener("webglcontextlost", onLost as EventListener, false);
          c.addEventListener("webglcontextrestored", onRestored as EventListener, false);
        }}
      >
        {/* Bright studio-ish lights, no HDR Environment, no <Suspense> */}
        <ambientLight intensity={6.0} />
        <spotLight position={[2.8, 3.6, 2.2]} angle={0.6} penumbra={0.9} intensity={6.0} />
        <directionalLight position={[-2.0, 0.8, -1.4]} intensity={6.0} />
        <pointLight position={[0, 0, 2.1]} intensity={6.0} distance={7} />
        <pointLight position={[0, -1.2, 1.0]} intensity={6.0} distance={6} />

        <Center disableZ>
          <BadgeModel />
        </Center>
      </R3FCanvas>
    </div>
  );
}
