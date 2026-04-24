import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Icosahedron, Stars } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function NeuralCore() {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.18;
      group.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.4;
      inner.current.rotation.z = t * 0.2;
    }
  });

  // Generate orbital nodes
  const nodes = Array.from({ length: 60 }, (_, i) => {
    const phi = Math.acos(-1 + (2 * i) / 60);
    const theta = Math.sqrt(60 * Math.PI) * phi;
    const r = 2.4;
    return [r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi)] as [number, number, number];
  });

  return (
    <group ref={group}>
      {/* Outer wireframe sphere */}
      <Sphere args={[2.4, 32, 32]}>
        <meshBasicMaterial color="#7aa8ff" wireframe transparent opacity={0.18} />
      </Sphere>

      {/* Mid icosahedron */}
      <Icosahedron args={[1.7, 1]}>
        <meshStandardMaterial
          color="#a855f7"
          wireframe
          emissive="#a855f7"
          emissiveIntensity={0.6}
          transparent
          opacity={0.45}
        />
      </Icosahedron>

      {/* Inner glowing core */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1.6}
          metalness={0.4}
          roughness={0.2}
        />
      </mesh>

      {/* Orbital nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#a855f7" : "#60a5fa"} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroGlobe() {
  return (
    <div className="relative h-[500px] w-full md:h-[600px]">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#a855f7" />
          <pointLight position={[-10, -5, -5]} intensity={1.2} color="#22d3ee" />
          <Stars radius={50} depth={50} count={1500} factor={3} saturation={0} fade speed={0.6} />
          <NeuralCore />
        </Suspense>
      </Canvas>
      {/* Glow halo */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.7_0.24_265/0.35),transparent_60%)]" />
    </div>
  );
}
