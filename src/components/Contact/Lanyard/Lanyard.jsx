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
  gravity = [0, -10, 0],
  ty = [0, -18, 0], // 🔥 NATURAL GRAVITY
  fov = 20,
  transparent = true,
  startPhysics = false,
}) {
  // 🔥 Natural gravity for smooth but not too slow drop
  const finalGravity = [ty[0], Math.max(ty[1], -20), ty[2]]; // 🔥 NATURAL GRAVITY

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
          {" "}
          {/* 🔥 Standard precision for natural feel */}
          <Band startPhysics={startPhysics} position={position} />
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

function Band({
  maxSpeed = 45, // 🔥 Natural speed
  minSpeed = 0.2, // 🔥 Natural min speed
  startPhysics = false,
  position = [0, 0, 13],
}) {
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

  // 🔥 ENHANCED PHYSICS STATE MANAGEMENT
  const [isPhysicsStarted, setIsPhysicsStarted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState("idle");
  const [dropStartTime, setDropStartTime] = useState(0);

  const segmentProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 8, // 🔥 Natural damping
    linearDamping: 5, // 🔥 Natural damping
    restitution: 0.1, // 🔥 Less bouncy
    friction: 0.8, // 🔥 More friction for natural settling
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

  // 🔥 NATURAL PHYSICS ANIMATION with GENTLE EASING
  useEffect(() => {
    if (startPhysics && !isPhysicsStarted) {
      setIsPhysicsStarted(true);
      setAnimationPhase("preparing");
      setDropStartTime(Date.now());

      // 🔥 Gradual animation start with delay
      setTimeout(() => {
        setAnimationPhase("dropping");

        if (card.current && j1.current && j2.current && j3.current) {
          const startHeight = 6; // 🔥 Lower starting height for less dramatic drop
          const baseX = position[0] || 0;

          // 🔥 Set positions with gentle offset
          j1.current.setTranslation(
            { x: baseX + 0.3, y: startHeight - 0.5, z: 0 },
            true
          );
          j2.current.setTranslation(
            { x: baseX + 0.6, y: startHeight - 1, z: 0 },
            true
          );
          j3.current.setTranslation(
            { x: baseX + 0.9, y: startHeight - 1.5, z: 0 },
            true
          );
          card.current.setTranslation(
            { x: baseX + 1.2, y: startHeight - 2, z: 0 },
            true
          );

          // 🔥 Natural initial velocity
          const gentleVel = { x: 0, y: -0.15, z: 0 }; // Natural drop speed
          j1.current.setLinvel(gentleVel, true);
          j2.current.setLinvel(gentleVel, true);
          j3.current.setLinvel(gentleVel, true);
          card.current.setLinvel(gentleVel, true);

          // Wake up physics bodies gradually
          [j1, j2, j3, card].forEach((ref, index) => {
            setTimeout(() => {
              if (ref.current) ref.current.wakeUp();
            }, index * 100); // Staggered wake up
          });

          // 🔥 Natural impulse after delay
          setTimeout(() => {
            if (card.current && animationPhase === "dropping") {
              card.current.applyImpulse({ x: 0, y: -0.1, z: 0 }, true); // Natural impulse
            }
          }, 400); // Natural delay

          // 🔥 Natural settling phases
          setTimeout(() => {
            setAnimationPhase("settling");
          }, 1500);

          setTimeout(() => {
            setAnimationPhase("settled");
          }, 3000); // Natural settling time
        }
      }, 200); // Natural delay for start
    } else if (!startPhysics && isPhysicsStarted) {
      // 🔥 Smooth reset animation
      setIsPhysicsStarted(false);
      setAnimationPhase("resetting");

      if (card.current && j1.current && j2.current && j3.current) {
        const resetHeight = 6;
        const baseX = position[0] || 0;

        // 🔥 Gentle reset positions
        j1.current.setTranslation(
          { x: baseX + 0.3, y: resetHeight, z: 0 },
          true
        );
        j2.current.setTranslation(
          { x: baseX + 0.6, y: resetHeight, z: 0 },
          true
        );
        j3.current.setTranslation(
          { x: baseX + 0.9, y: resetHeight, z: 0 },
          true
        );
        card.current.setTranslation(
          { x: baseX + 1.2, y: resetHeight, z: 0 },
          true
        );

        // Stop all velocities smoothly
        const stopVel = { x: 0, y: 0, z: 0 };
        [j1, j2, j3, card].forEach((ref) => {
          if (ref.current) {
            ref.current.setLinvel(stopVel, true);
            ref.current.setAngvel(stopVel, true);
          }
        });

        // Gradual sleep
        setTimeout(() => {
          [j1, j2, j3, card].forEach((ref) => {
            if (ref.current) ref.current.sleep();
          });
          setAnimationPhase("idle");
        }, 500);
      }
    }
  }, [startPhysics, isPhysicsStarted, position, animationPhase]);

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

      [card, j1, j2, j3, fixed].forEach((ref) => {
        if (ref.current) ref.current.wakeUp();
      });

      if (card.current) {
        card.current.setNextKinematicTranslation({
          x: vec.x - dragged.x,
          y: vec.y - dragged.y,
          z: vec.z - dragged.z,
        });
      }
    }

    if (fixed.current) {
      // 🔥 PHASE-BASED SPEED CONTROL for natural animation
      let adjustedMaxSpeed, adjustedMinSpeed;

      switch (animationPhase) {
        case "preparing":
          adjustedMaxSpeed = maxSpeed * 0.1;
          adjustedMinSpeed = minSpeed * 0.1;
          break;
        case "dropping":
          // 🔥 Natural speed progression
          const timeSinceDrop = Date.now() - dropStartTime;
          const progressFactor = Math.min(timeSinceDrop / 1500, 1); // 1.5 second ramp up
          adjustedMaxSpeed = maxSpeed * (0.4 + progressFactor * 0.4); // Max 80% of original speed
          adjustedMinSpeed = minSpeed * (0.5 + progressFactor * 0.4);
          break;
        case "settling":
          adjustedMaxSpeed = maxSpeed * 0.6;
          adjustedMinSpeed = minSpeed * 0.7;
          break;
        case "settled":
          adjustedMaxSpeed = maxSpeed * 0.8;
          adjustedMinSpeed = minSpeed * 0.9;
          break;
        default:
          adjustedMaxSpeed = maxSpeed;
          adjustedMinSpeed = minSpeed;
      }

      [j1, j2].forEach((ref) => {
        if (ref.current) {
          if (!ref.current.lerped) {
            ref.current.lerped = new THREE.Vector3().copy(
              ref.current.translation()
            );
          }
          const clampedDistance = Math.max(
            0.05, // 🔥 Smaller minimum for smoother interpolation
            Math.min(
              1,
              ref.current.lerped.distanceTo(ref.current.translation())
            )
          );

          // 🔥 Natural lerping
          const lerpFactor =
            delta *
            (adjustedMinSpeed +
              clampedDistance * (adjustedMaxSpeed - adjustedMinSpeed));
          ref.current.lerped.lerp(ref.current.translation(), lerpFactor * 0.9); // Natural speed
        }
      });

      // Update curve with smoother interpolation
      if (
        j3.current &&
        j2.current &&
        j1.current &&
        fixed.current &&
        band.current
      ) {
        curve.points[0].copy(j3.current.translation());
        curve.points[1].copy(j2.current.lerped || j2.current.translation());
        curve.points[2].copy(j1.current.lerped || j1.current.translation());
        curve.points[3].copy(fixed.current.translation());
        band.current.geometry.setPoints(curve.getPoints(36)); // 🔥 Natural curve smoothness
      }

      // 🔥 ENHANCED ANGULAR VELOCITY CONTROL with phase awareness
      if (card.current) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());

        const dampingFactor = animationPhase === "dropping" ? 0.95 : 0.85;
        const stabilizationFactor = animationPhase === "settling" ? 0.2 : 0.1;

        if (dragged) {
          card.current.setAngvel({
            x: ang.x * 0.92,
            y: ang.y * 0.92,
            z: ang.z * 0.92,
          });
        } else {
          card.current.setAngvel({
            x: ang.x * dampingFactor,
            y: ang.y - rot.y * stabilizationFactor,
            z: ang.z * dampingFactor,
          });
        }
      }
    }
  });

  curve.curveType = "chordal";
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  // 🔥 Dynamic initial positions based on animation phase
  const getInitialY = () => {
    switch (animationPhase) {
      case "preparing":
      case "dropping":
        return 6;
      case "settling":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody
          position={[0.3, getInitialY(), 0]}
          ref={j1}
          {...segmentProps}
        >
          <BallCollider args={[0.08]} /> {/* 🔥 Slightly smaller colliders */}
        </RigidBody>
        <RigidBody
          position={[0.6, getInitialY(), 0]}
          ref={j2}
          {...segmentProps}
        >
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody
          position={[0.9, getInitialY(), 0]}
          ref={j3}
          {...segmentProps}
        >
          <BallCollider args={[0.08]} />
        </RigidBody>
        <RigidBody
          position={[1.2, getInitialY(), 0]}
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
            onPointerUp={(e) => {
              if (e.target.releasePointerCapture) {
                e.target.releasePointerCapture(e.pointerId);
              }
              drag(false);
            }}
            onPointerDown={(e) => {
              if (e.target.setPointerCapture) {
                e.target.setPointerCapture(e.pointerId);
              }
              if (card.current) {
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(vec.copy(card.current.translation()))
                );
              }
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
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1200, 2400] : [1200, 1200]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
