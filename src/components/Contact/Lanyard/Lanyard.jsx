/* eslint-disable react/no-unknown-property */
"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

// replace with your own imports, see the usage snippet for details
const cardGLB = "/assets/lanyard/card.glb";
const lanyard = "/assets/lanyard/lanyard.png";

import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({
  position = [0, 0, 13], // 🔥 SESUAIKAN DEFAULT POSITION
  gravity = [0, -40, 0],
  ty = [0, -80, 0], // 🔥 DEFAULT TY UNTUK GRAVITY
  fov = 20,
  transparent = true,
  startPhysics = false,
}) {
  // 🔥 Gunakan ty sebagai gravity utama, dengan smoothing yang lebih natural
  const finalGravity = [ty[0], Math.max(ty[1], -40), ty[2]]; // 🔥 LESS CAPPING untuk kecepatan normal

  return (
    <div className="relative z-0 w-full h-screen flex justify-center items-center transform scale-100 origin-center">
      <Canvas
        camera={{ position: position, fov: fov }}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={finalGravity} timeStep={1 / 60}>
          <Band startPhysics={startPhysics} /> {/* 🔥 PASS PROP */}
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({ maxSpeed = 50, minSpeed = 0, startPhysics = false }) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();

  // 🔥 PHYSICS STATE MANAGEMENT
  const [isPhysicsStarted, setIsPhysicsStarted] = useState(false);
  const [initialPositions, setInitialPositions] = useState(null);
  const [animationPhase, setAnimationPhase] = useState("idle"); // 'idle', 'dropping', 'settled'

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 6, // 🔥 REDUCED untuk gerakan yang lebih natural
    linearDamping: 4, // 🔥 NORMAL DAMPING untuk responsivitas drag
  };

  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyard);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);
  const [isSmall, setIsSmall] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024
  );

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  // 🔥 SMOOTH PHYSICS ANIMATION CONTROLLER
  useEffect(() => {
    if (startPhysics && !isPhysicsStarted) {
      setIsPhysicsStarted(true);
      setAnimationPhase("dropping");

      // Delay untuk memastikan physics bodies sudah siap
      setTimeout(() => {
        if (card.current && j1.current && j2.current && j3.current) {
          // Reset ke posisi awal dengan posisi yang disesuaikan dengan position prop
          const startHeight = 15; // Increased for stronger gravity
          const baseX = position[0] || 0; // Use position prop for X offset

          j1.current.setTranslation(
            { x: baseX + 0.5, y: startHeight, z: 0 },
            true
          );
          j2.current.setTranslation(
            { x: baseX + 1, y: startHeight, z: 0 },
            true
          );
          j3.current.setTranslation(
            { x: baseX + 1.5, y: startHeight, z: 0 },
            true
          );
          card.current.setTranslation(
            { x: baseX + 2, y: startHeight, z: 0 },
            true
          );

          // Reset velocity
          j1.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          j2.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          j3.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

          // Wake up physics bodies
          [card, j1, j2, j3].forEach((ref) => ref.current?.wakeUp());

          // Beri impulse normal untuk natural drop
          setTimeout(() => {
            card.current?.applyImpulse({ x: 0, y: -1, z: 0 }, true); // 🔥 IMPULSE NORMAL
          }, 150); // 🔥 DELAY NORMAL

          // Set animation phase to settled after normal timing
          setTimeout(() => {
            setAnimationPhase("settled");
          }, 2000); // 🔥 REDUCED dari 3000 ke 2000ms
        }
      }, 100);
    } else if (!startPhysics && isPhysicsStarted) {
      // Reset ketika keluar dari viewport
      setIsPhysicsStarted(false);
      setAnimationPhase("idle");

      if (card.current && j1.current && j2.current && j3.current) {
        // Kembali ke posisi awal dengan animasi halus
        const resetHeight = 8;
        j1.current.setTranslation({ x: 0.5, y: resetHeight, z: 0 }, true);
        j2.current.setTranslation({ x: 1, y: resetHeight, z: 0 }, true);
        j3.current.setTranslation({ x: 1.5, y: resetHeight, z: 0 }, true);
        card.current.setTranslation({ x: 2, y: resetHeight, z: 0 }, true);

        // Stop velocity
        j1.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        j2.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        j3.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
        card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

        // Sleep physics bodies
        [card, j1, j2, j3].forEach((ref) => ref.current?.sleep());
      }
    }
  }, [startPhysics, isPhysicsStarted]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current) {
      // 🔥 LERPING dengan kecepatan normal
      const adjustedMaxSpeed =
        animationPhase === "dropping" ? maxSpeed * 0.7 : maxSpeed; // 🔥 SPEED NORMAL
      const adjustedMinSpeed =
        animationPhase === "dropping" ? minSpeed * 0.9 : minSpeed;

      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta *
            (adjustedMinSpeed +
              clampedDistance * (adjustedMaxSpeed - adjustedMinSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));

      // 🔥 ANGULAR VELOCITY yang memungkinkan kartu flip saat drag
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());

      // 🔥 JIKA SEDANG DRAG, berikan lebih banyak kebebasan rotasi
      if (dragged) {
        card.current.setAngvel({
          x: ang.x * 0.9, // 🔥 LEBIH BEBAS saat drag
          y: ang.y * 0.9, // 🔥 MEMUNGKINKAN FLIP
          z: ang.z * 0.9,
        });
      } else {
        card.current.setAngvel({
          x: ang.x * 0.7,
          y: ang.y - rot.y * 0.2, // 🔥 SEDIKIT STABILISASI
          z: ang.z * 0.7,
        });
      }
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody
          position={[0.5, animationPhase === "dropping" ? 15 : 0, 0]} // 🔥 POSISI LEBIH TINGGI
          ref={j1}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, animationPhase === "dropping" ? 15 : 0, 0]}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, animationPhase === "dropping" ? 15 : 0, 0]}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, animationPhase === "dropping" ? 15 : 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (
              e.target.releasePointerCapture(e.pointerId), drag(false)
            )}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              )
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
