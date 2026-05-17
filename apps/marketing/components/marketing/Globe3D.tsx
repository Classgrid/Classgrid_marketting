"use client";
import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

function GlobeMesh() {
  const meshRef = useRef<any>(null);
  const texture = useLoader(TextureLoader, "https://threejs.org/examples/textures/land_ocean_2048.jpg");

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial map={texture} metalness={0.1} roughness={0.7} />
    </mesh>
  );
}

export default function Globe3D({ className }) {
  return (
    <div className={`${className ?? ""} h-[420px] w-[420px]`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <GlobeMesh />
      </Canvas>
    </div>
  );
}
