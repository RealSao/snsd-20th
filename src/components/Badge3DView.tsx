"use client";

import React, { Suspense, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { OrbitControls, Stage, useGLTF, ContactShadows } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import type { ThreeElements } from "@react-three/fiber";

// Client-only Canvas
const R3FCanvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

type BadgeModelProps = ThreeElements["group"] & {
  speed?: number;
};

function BadgeModel({ speed = 0.6, ...props }: BadgeModelProps) {
  const { scene } = useGLTF("/models/gg-badge.glb");
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return <primitive ref={ref} object={scene} {...props} />;
}

// Preload the model so it appears instantly when the modal opens
useGLTF.preload("/models/gg-badge.glb");

export function Badge3DView() {
  const [canvasKey, setCanvasKey] = useState(0);

  return (
    <div className="h-48 w-full rounded-xl overflow-hidden border border-white/10 bg-black">
      <R3FCanvas
        key={canvasKey}
        dpr={[1, 1]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0.6, 0.5, 1.6], fov: 45 }}
        onCreated={({ gl }) => {
          const c = gl.domElement as HTMLCanvasElement;
          const onLost = (e: Event) =>
            (e as unknown as WebGLContextEvent).preventDefault?.();
          const onRestored = () => setCanvasKey((k) => k + 1); // remount if restored
          c.addEventListener("webglcontextlost", onLost as EventListener, false);
          c.addEventListener("webglcontextrestored", onRestored as EventListener, false);
        }}
      >
        <color attach="background" args={["#000"]} />
        <Suspense fallback={null}>
          <Stage intensity={1.2} environment="city">
            <BadgeModel />
          </Stage>
          {/* Soft ground shadow under the badge */}
          <ContactShadows opacity={0.45} scale={6} blur={2.5} far={4} resolution={512} frames={1} />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </R3FCanvas>
    </div>
  );
}

export default Badge3DView;
