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
  onDismiss: () => void;
  anchorXRatio: number;
  anchorYRatio: number;
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
  const outerMaterial = useMemo(
    () => new MeshLineMaterial({
      color: new THREE.Color("#6f5938"),
      lineWidth: 0.105,
      sizeAttenuation: 1,
      resolution: new THREE.Vector2(1, 1),
    }),
    [],
  );
  const innerMaterial = useMemo(
    () => new MeshLineMaterial({
      color: new THREE.Color("#b59a67"),
      lineWidth: 0.038,
      sizeAttenuation: 1,
      resolution: new THREE.Vector2(1, 1),
    }),
    [],
  );
  const outerLine = useMemo(() => new THREE.Mesh(geometry, outerMaterial), [geometry, outerMaterial]);
  const innerLine = useMemo(() => new THREE.Mesh(geometry, innerMaterial), [geometry, innerMaterial]);
  const point = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    outerMaterial.resolution.set(size.width, size.height);
    innerMaterial.resolution.set(size.width, size.height);
  }, [innerMaterial, outerMaterial, size.height, size.width]);

  useEffect(() => () => {
    geometry.dispose();
    outerMaterial.dispose();
    innerMaterial.dispose();
  }, [geometry, innerMaterial, outerMaterial]);

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
    point.set(0, 2.33, 0).applyQuaternion(
      new THREE.Quaternion(cardRotation.x, cardRotation.y, cardRotation.z, cardRotation.w),
    );
    points.push(new THREE.Vector3(cardTranslation.x, cardTranslation.y, cardTranslation.z).add(point));
    geometry.setPoints(points);
  });

  return (
    <group>
      <primitive object={outerLine} frustumCulled={false} />
      <primitive object={innerLine} position-z={0.003} frustumCulled={false} />
    </group>
  );
}

function SuspendedBadge({
  isFlipped,
  onReady,
  onSceneError,
  anchorXRatio,
  anchorYRatio,
}: {
  isFlipped: boolean;
  onReady: () => void;
  onSceneError: () => void;
  anchorXRatio: number;
  anchorYRatio: number;
}) {
  const { viewport } = useThree();
  const anchor = useRef<RapierRigidBody>(null!);
  const node1 = useRef<RapierRigidBody>(null!);
  const node2 = useRef<RapierRigidBody>(null!);
  const node3 = useRef<RapierRigidBody>(null!);
  const node4 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const dragOffset = useRef(new THREE.Vector3());
  const anchorX = (anchorXRatio - 0.5) * viewport.width;
  const anchorY = viewport.height / 2 - anchorYRatio * viewport.height;
  const cardX = THREE.MathUtils.clamp(
    anchorX,
    -viewport.width / 2 + 1.48,
    viewport.width / 2 - 1.48,
  );
  const minCardX = -viewport.width / 2 + 1.42;
  const maxCardX = viewport.width / 2 - 1.42;

  useEffect(() => onReady(), [onReady]);

  const releaseCard = useCallback(() => {
    document.body.style.cursor = "";
    draggingRef.current = false;
    if (card.current) {
      card.current.setBodyType(0, true);
      card.current.wakeUp();
    }
    setDragging(false);
  }, []);

  useEffect(() => {
    const release = () => {
      if (draggingRef.current) releaseCard();
    };
    window.addEventListener("pointerup", release, true);
    window.addEventListener("pointercancel", release, true);
    window.addEventListener("mouseup", release, true);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release, true);
      window.removeEventListener("pointercancel", release, true);
      window.removeEventListener("mouseup", release, true);
      window.removeEventListener("blur", release);
    };
  }, [releaseCard]);

  useFrame(() => {
    const body = card.current;
    if (!body || dragging) return;
    const position = body.translation();
    if (
      position.x < minCardX - 0.45 ||
      position.x > maxCardX + 0.45 ||
      position.y < -viewport.height / 2 + 1.82 ||
      position.y > anchorY + 0.5 ||
      Math.abs(position.z) > 0.05
    ) {
      body.setTranslation(
        {
          x: THREE.MathUtils.clamp(position.x, minCardX, maxCardX),
          y: THREE.MathUtils.clamp(position.y, -viewport.height / 2 + 1.92, anchorY - 1.95),
          z: 0,
        },
        true,
      );
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  useRopeJoint(anchor, node1, [[0, 0, 0], [0, 0, 0], 0.46]);
  useRopeJoint(node1, node2, [[0, 0, 0], [0, 0, 0], 0.46]);
  useRopeJoint(node2, node3, [[0, 0, 0], [0, 0, 0], 0.46]);
  useRopeJoint(node3, node4, [[0, 0, 0], [0, 0, 0], 0.46]);
  useSphericalJoint(node4, card, [[0, 0, 0], [0, 2.33, 0]]);
  useRopeJoint(anchor, card, [[0, 0, 0], [0, 2.33, 0], 1.96]);

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  const moveCard = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !card.current) return;
    event.stopPropagation();
    const target = event.point.clone().add(dragOffset.current);
    target.x = THREE.MathUtils.clamp(target.x, minCardX, maxCardX);
    target.y = THREE.MathUtils.clamp(target.y, -viewport.height / 2 + 1.9, anchorY - 1.6);
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
    draggingRef.current = true;
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
      <RigidBody ref={anchor} type="fixed" colliders={false} position={[anchorX, anchorY, 0]} />
      <RigidBody ref={node1} {...nodeProps} position={[THREE.MathUtils.lerp(anchorX, cardX, 0.25), anchorY - 0.08, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody ref={node2} {...nodeProps} position={[THREE.MathUtils.lerp(anchorX, cardX, 0.5), anchorY - 0.16, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody ref={node3} {...nodeProps} position={[THREE.MathUtils.lerp(anchorX, cardX, 0.75), anchorY - 0.24, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody ref={node4} {...nodeProps} position={[cardX, anchorY - 0.32, 0]}><BallCollider args={[0.075]} /></RigidBody>
      <RigidBody
        ref={card}
        colliders={false}
        position={[cardX - 0.08, anchorY - 2.55, 0]}
        rotation={[0, 0, -0.075]}
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
  anchorXRatio,
  anchorYRatio,
}: {
  isFlipped: boolean;
  onReady: () => void;
  onSceneError: () => void;
  anchorXRatio: number;
  anchorYRatio: number;
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
        <SuspendedBadge
          isFlipped={isFlipped}
          onReady={onReady}
          onSceneError={onSceneError}
          anchorXRatio={anchorXRatio}
          anchorYRatio={anchorYRatio}
        />
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

export default function ContactBadgeScene({ isFlipped, onSceneError, onDismiss, anchorXRatio, anchorYRatio }: ContactBadgeSceneProps) {
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
        onPointerMissed={onDismiss}
      >
        <WebGLContextGuard onSceneError={onSceneError} />
        <Suspense fallback={null}>
          <BadgeWorld
            isFlipped={isFlipped}
            onReady={markWorldReady}
            onSceneError={onSceneError}
            anchorXRatio={anchorXRatio}
            anchorYRatio={anchorYRatio}
          />
        </Suspense>
      </Canvas>
      <p className="badge-drag-hint">抓住工牌轻轻拖动</p>
    </div>
  );
}
