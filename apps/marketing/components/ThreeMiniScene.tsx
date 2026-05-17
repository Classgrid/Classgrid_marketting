"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

import { cn } from "@/lib/utils";

function RotatingMesh() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += delta * 0.25;
    meshRef.current.rotation.y += delta * 0.35;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#67e8f9" emissive="#0ea5e9" emissiveIntensity={0.45} wireframe />
    </mesh>
  );
}

export default function ThreeMiniScene({ className }: { className?: string }) {
  return (
    <div className={cn("h-32 w-32", className)}>
      <Canvas camera={{ position: [0, 0, 3.4], fov: 40 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[2, 2, 3]} intensity={1.2} color="#a5f3fc" />
        <RotatingMesh />
      </Canvas>
    </div>
  );
}
