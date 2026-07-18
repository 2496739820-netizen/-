"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { BadgeCard } from "./BadgeCard";

type ContactBadgeSceneProps = {
  isFlipped: boolean;
  onSceneError: () => void;
};

type PointerCaptureTarget = EventTarget & {
  setPointerCapture: (pointerId: number) => void;
  hasPointerCapture: (pointerId: number) => boolean;
  releasePointerCapture: (pointerId: number) => void;
};

function supportsPointerCapture(target: EventTarget | null): target is PointerCaptureTarget {
  return Boolean(
    target &&
    "setPointerCapture" in target &&
    "hasPointerCapture" in target &&
    "releasePointerCapture" in target,
  );
}

function LanyardLine({
  anchor,
  nodes,
  card,
}: {
  anchor: React.RefObject<RapierRigidBody | null>;
  nodes: React.RefObject<RapierRigidBody | null>[];
  card: React.RefObject<RapierRigidBody | null>;
}) {
  const { size } = useThree();
  const geometry = useMemo(() => new MeshLineGeometry(), []);
  const material = useMemo(
    () => new MeshLineMaterial({
      color: new THREE.Color("#8a7349"),
      lineWidth: 0.055,
      sizeAttenuation: 1,
      resolution: new THREE.Vector2(1, 1),
    }),
    [],
  );
  const line = useMemo(() => new THREE.Mesh(geometry, material), [geometry, material]);
  const point = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    material.resolution.set(size.width, size.height);
  }, [material, size.height, size.width]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame(() => {
    const anchorBody = anchor.current;
    const cardBody = card.current;
    if (!anchorBody || !cardBody || nodes.some((node) => !node.current)) return;
    const points: THREE.Vector3[] = [];
    const anchorTranslation = anchorBody.translation();
    points.push(new THREE.Vector3(anchorTranslation.x, anchorTranslation.y, anchorTranslation.z));
    nodes.forEach((node) => {
      const translation = node.current?.translation();
      if (translation) points.push(new THREE.Vector3(translation.x, translation.y, translation.z));
    });
    const cardTranslation = cardBody.translation();
    const cardRotation = cardBody.rotation();
    point.set(0, 2.42, 0).applyQuaternion(
      new THREE.Quaternion(cardRotation.x, cardRotation.y, cardRotation.z, cardRotation.w),
    );
    points.push(new THREE.Vector3(cardTranslation.x, cardTranslation.y, cardTranslation.z).add(point));
    geometry.setPoints(points);
  });

  return <primitive object={line} frustumCulled={false} />;
}

function SuspendedBadge({
  isFlipped,
  onReady,
  onSceneError,
}: {
  isFlipped: boolean;
  onReady: () => void;
  onSceneError: () => void;
}) {
  const anchor = useRef<RapierRigidBody>(null!);
  const node1 = useRef<RapierRigidBody>(null!);
  const node2 = useRef<RapierRigidBody>(null!);
  const node3 = useRef<RapierRigidBody>(null!);
  const node4 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef(new THREE.Vector3());

  useEffect(() => onReady(), [onReady]);

  const releaseCard = useCallback(() => {
    if (!card.current) return;
    card.current.setBodyType(0, true);
    card.current.wakeUp();
    setDragging(false);
    document.body.style.cursor = "";
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const release = () => releaseCard();
    window.addEventListener("pointerup", release, { once: true });
    window.addEventListener("pointercancel", release, { once: true });
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [dragging, releaseCard]);

  useFrame(() => {
    const body = card.current;
    if (!body || dragging) return;
    const position = body.translation();
    if (
      Math.abs(position.x) > 3.25 ||
      position.y < -1.05 ||
      position.y > 1.65 ||
      Math.abs(position.z) > 0.05
    ) {
      body.setTranslation(
        {
          x: THREE.MathUtils.clamp(position.x, -2.7, 2.7),
          y: THREE.MathUtils.clamp(position.y, -0.8, 1.25),
          z: 0,
        },
        true,
      );
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  useRopeJoint(anchor, node1, [[0, 0, 0], [0, 0, 0], 0.72]);
  useRopeJoint(node1, node2, [[0, 0, 0], [0, 0, 0], 0.72]);
  useRopeJoint(node2, node3, [[0, 0, 0], [0, 0, 0], 0.72]);
  useRopeJoint(node3, node4, [[0, 0, 0], [0, 0, 0], 0.72]);
  useSphericalJoint(node4, card, [[0, 0, 0], [0, 2.42, 0]]);
  useRopeJoint(anchor, card, [[0, 0, 0], [0, 2.42, 0], 3.06]);

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  const moveCard = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !card.current) return;
    event.stopPropagation();
    const target = event.point.clone().add(dragOffset.current);
    target.x = THREE.MathUtils.clamp(target.x, -3.25, 3.25);
    target.y = THREE.MathUtils.clamp(target.y, -2.4, 2.6);
    target.z = THREE.MathUtils.clamp(target.z, -0.55, 0.55);
    card.current.setNextKinematicTranslation(target);
  };

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!card.current) return;
    event.stopPropagation();
    if (supportsPointerCapture(event.target)) event.target.setPointerCapture(event.pointerId);
    const current = card.current.translation();
    dragOffset.current.set(current.x - event.point.x, current.y - event.point.y, current.z - event.point.z);
    card.current.setBodyType(2, true);
    card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    card.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    setDragging(true);
    document.body.style.cursor = "grabbing";
  };

  const stopDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !card.current) return;
    event.stopPropagation();
    if (supportsPointerCapture(event.target) && event.target.hasPointerCapture(event.pointerId)) {
      event.target.releasePointerCapture(event.pointerId);
    }
    releaseCard();
  };

  const nodeProps = {
    colliders: false as const,
    linearDamping: 3.2,
    angularDamping: 4,
    canSleep: false,
    mass: 0.12,
    additionalSolverIterations: 20,
    enabledTranslations: [true, true, false] as [boolean, boolean, boolean],
    lockRotations: true,
  };

  return (
    <>
      <RigidBody ref={anchor} type="fixed" colliders={false} position={[0, 4.65, 0]} />
      <RigidBody ref={node1} {...nodeProps} position={[0, 4.05, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody ref={node2} {...nodeProps} position={[0.02, 3.45, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody ref={node3} {...nodeProps} position={[-0.02, 2.85, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody ref={node4} {...nodeProps} position={[0, 2.25, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody
        ref={card}
        colliders={false}
        position={[0.18, -0.12, 0]}
        rotation={[0, 0, -0.05]}
        linearDamping={4.8}
        angularDamping={5.6}
        canSleep={false}
        mass={0.52}
        additionalSolverIterations={24}
        enabledTranslations={[true, true, false]}
        enabledRotations={[false, false, true]}
      >
        <CuboidCollider args={[1.32, 2.13, 0.11]} />
        <BadgeCard
          isFlipped={isFlipped}
          onTextureError={onSceneError}
          onPointerDown={startDrag}
          onPointerMove={moveCard}
          onPointerUp={stopDrag}
        />
      </RigidBody>
      <LanyardLine anchor={anchor} nodes={[node1, node2, node3, node4]} card={card} />
    </>
  );
}

function BadgeWorld({
  isFlipped,
  onReady,
  onSceneError,
}: {
  isFlipped: boolean;
  onReady: () => void;
  onSceneError: () => void;
}) {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 7]} intensity={2.2} color="#fff8e9" />
      <directionalLight position={[-5, 1, 4]} intensity={0.7} color="#dce0d3" />
      <Physics
        gravity={[0, -8.6, 0]}
        interpolate
        timeStep={1 / 60}
        numSolverIterations={12}
        numInternalPgsIterations={4}
      >
        <SuspendedBadge isFlipped={isFlipped} onReady={onReady} onSceneError={onSceneError} />
      </Physics>
    </>
  );
}

function WebGLContextGuard({ onSceneError }: { onSceneError: () => void }) {
  const { gl } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onSceneError();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLost);
  }, [gl, onSceneError]);
  return null;
}

export default function ContactBadgeScene({ isFlipped, onSceneError }: ContactBadgeSceneProps) {
  const [worldReady, setWorldReady] = useState(false);
  const markWorldReady = useCallback(() => setWorldReady(true), []);

  useEffect(() => {
    if (worldReady) return;
    const timeout = window.setTimeout(onSceneError, 8000);
    return () => window.clearTimeout(timeout);
  }, [onSceneError, worldReady]);

  return (
    <div
      className="contact-badge-canvas"
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 12.4], fov: 36, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <WebGLContextGuard onSceneError={onSceneError} />
        <Suspense fallback={null}>
          <BadgeWorld isFlipped={isFlipped} onReady={markWorldReady} onSceneError={onSceneError} />
        </Suspense>
      </Canvas>
      <p className="badge-drag-hint">抓住工牌轻轻拖动</p>
    </div>
  );
}
