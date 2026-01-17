"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei"; // Added Stars
import React, { useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface DotGlobeHeroProps {
  rotationSpeed?: number;
  globeRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

const Globe: React.FC<{ rotationSpeed: number; radius: number }> = ({ rotationSpeed, radius }) => {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(() => { if (groupRef.current) groupRef.current.rotation.y += rotationSpeed; });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        {/* Neon Green Wireframe */}
        <meshBasicMaterial color="#00E500" transparent opacity={0.15} wireframe />
      </mesh>
      {/* Inner Black Sphere to block stars behind it */}
      <mesh scale={[0.99, 0.99, 0.99]}>
         <sphereGeometry args={[radius, 64, 64]} />
         <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};

const DotGlobeHero = React.forwardRef<HTMLDivElement, DotGlobeHeroProps>(({
  rotationSpeed = 0.001,
  globeRadius = 1.6, // Increased Size
  className,
  children,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn("relative w-full min-h-screen overflow-hidden bg-black", className)} {...props}>
      
      {/* 3D SCENE */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#00E500" />
          
          {/* STAR FIELD to fill empty space */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          <Globe rotationSpeed={rotationSpeed} radius={globeRadius} />
        </Canvas>
      </div>

      {/* CONTENT LAYER */}
      <div className="relative z-10 w-full h-full pointer-events-none">
         {/* Allow clicking on children (buttons/inputs) */}
         <div className="pointer-events-auto w-full h-full">
            {children}
         </div>
      </div>
      
      {/* BOTTOM FADE (Seamless transition) */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />
    </div>
  );
});

DotGlobeHero.displayName = "DotGlobeHero";
export { DotGlobeHero };