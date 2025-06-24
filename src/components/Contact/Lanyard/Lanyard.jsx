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
  position = [0, 0, 13],
  gravity = [0, -40, 0], // Kembali ke nilai normal untuk gravitasi yang natural
  ty = [0, -80, 0], // Kembali ke nilai normal
  fov = 20,
  transparent = true,
  startPhysics = false,
}) {
  // Gravitasi yang lebih natural dan stabil
  const finalGravity = [ty[0], Math.max(ty[1], -50), ty[2]]; // Maksimal -50 untuk mencegah gravitasi terlalu kencang

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
          <Band startPhysics={startPhysics} />
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

function Band({ maxSpeed = 40, minSpeed = 0, startPhysics = false }) {
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

  // State management yang lebih stabil
  const [isPhysicsStarted, setIsPhysicsStarted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Segment properties yang lebih stabil
  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 8, // Ditingkatkan untuk stabilitas
    linearDamping: 4, // Ditingkatkan untuk mengurangi oscillation
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

  // Rope joints dengan konfigurasi yang lebih stabil
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  // Deteksi mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice =
        /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );
      const isTouchScreen =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchScreen);
    };

    checkIsMobile();
  }, []);

  // Physics animation controller yang lebih natural
  useEffect(() => {
    if (startPhysics && !isPhysicsStarted) {
      setIsPhysicsStarted(true);
      setAnimationPhase("dropping");

      setTimeout(() => {
        if (card.current && j1.current && j2.current && j3.current) {
          const startHeight = 12; // Tinggi yang lebih moderat
          const baseX = 0;

          // Set posisi awal dengan lebih natural
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

          // Reset velocity untuk start yang bersih
          [j1, j2, j3, card].forEach((ref) => {
            ref.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
            ref.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
            ref.current?.wakeUp();
          });

          // Impulse yang lebih gentle untuk gerakan natural
          setTimeout(() => {
            card.current?.applyImpulse({ x: 0, y: -0.8, z: 0 }, true);
          }, 150);

          // Waktu settling yang lebih realistis
          setTimeout(() => {
            setAnimationPhase("settled");
          }, 2500);
        }
      }, 100);
    } else if (!startPhysics && isPhysicsStarted) {
      setIsPhysicsStarted(false);
      setAnimationPhase("idle");

      if (card.current && j1.current && j2.current && j3.current) {
        const resetHeight = 8;

        // Reset posisi dengan smooth
        [j1, j2, j3, card].forEach((ref, index) => {
          const positions = [
            { x: 0.5, y: resetHeight, z: 0 },
            { x: 1, y: resetHeight, z: 0 },
            { x: 1.5, y: resetHeight, z: 0 },
            { x: 2, y: resetHeight, z: 0 },
          ];

          ref.current.setTranslation(positions[index], true);
          ref.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
          ref.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
          ref.current?.sleep();
        });
      }
    }
  }, [startPhysics, isPhysicsStarted]);

  // Enhanced cursor management
  useEffect(() => {
    if (hovered && !isMobile) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Touch event handlers yang lebih responsif
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    setTouchStart({ x, y });
    setIsDragging(true);

    vec.set(x, y, 0.5);
    const dragOffset = new THREE.Vector3()
      .copy(vec)
      .sub(vec.copy(card.current.translation()));
    drag(dragOffset);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging || !touchStart) return;

    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

    vec.set(x, y, 0.5);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setTouchStart(null);
    drag(false);
  };

  // Mouse event handlers
  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (e.pointerType === "touch") {
      handleTouchStart(e);
    } else {
      e.target.setPointerCapture(e.pointerId);
      drag(
        new THREE.Vector3()
          .copy(e.point)
          .sub(vec.copy(card.current.translation()))
      );
    }
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    if (e.pointerType === "touch") {
      handleTouchEnd(e);
    } else {
      e.target.releasePointerCapture(e.pointerId);
      drag(false);
    }
  };

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
      // Lerping yang lebih smooth dan stabil
      const speedMultiplier = animationPhase === "dropping" ? 0.6 : 1;
      const adjustedMaxSpeed = maxSpeed * speedMultiplier;
      const adjustedMinSpeed = minSpeed * speedMultiplier;

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

      // Update curve untuk lanyard (hanya jika tidak mobile)
      if (!isMobile) {
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2.current.lerped);
        curve.points[2].copy(j1.current.lerped);
        curve.points[3].copy(fixed.current.translation());
        band.current.geometry.setPoints(curve.getPoints(32));
      }

      // Angular velocity yang lebih stabil
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());

      if (dragged || isDragging) {
        card.current.setAngvel({
          x: ang.x * 0.9,
          y: ang.y * 0.9,
          z: ang.z * 0.9,
        });
      } else {
        card.current.setAngvel({
          x: ang.x * 0.7,
          y: ang.y - rot.y * 0.15,
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
          position={[0.5, animationPhase === "dropping" ? 12 : 0, 0]}
          ref={j1}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, animationPhase === "dropping" ? 12 : 0, 0]}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, animationPhase === "dropping" ? 12 : 0, 0]}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, animationPhase === "dropping" ? 12 : 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged || isDragging ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              touchAction: "none",
              userSelect: "none",
            }}
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
      {/* Lanyard hanya ditampilkan jika bukan mobile */}
      {!isMobile && (
        <mesh ref={band}>
          <meshLineGeometry />
          <meshLineMaterial
            color="white"
            depthTest={false}
            resolution={[1000, 1000]}
            useMap
            map={texture}
            repeat={[-4, 1]}
            lineWidth={1}
          />
        </mesh>
      )}
    </>
  );
}
