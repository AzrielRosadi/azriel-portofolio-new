import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

const StarBackground = (props) => {
  const ref = useRef();

  // Generate bintang secara manual
  const [sphere] = useState(() => {
    const positions = new Float32Array(10000 * 3);
    for (let i = 0; i < 5000 * 3; i += 3) {
      const radius = Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#8b5cf6" // Warna ungu
          size={0.003} // Ukuran lebih kecil
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6} // Transparansi untuk efek subtle
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  console.log("StarsCanvas rendering..."); // Debug log

  return (
    <div
      className="w-full h-full fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1, // Z-index lebih rendah
        background: "transparent",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
