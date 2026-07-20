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
}: {
  anchor: React.RefObject<RapierRigidBody | null>;
  nodes: React.RefObject<RapierRigidBody | null>[];
}) {
  const { size } = useThree();
  const geometry = useMemo(() => new MeshLineGeometry(), []);
  const outerMaterial = useMemo(
    () => new MeshLineMaterial({
      color: new THREE.Color("#5f4b31"),
      lineWidth: 0.17,
      sizeAttenuation: 1,
      resolution: new THREE.Vector2(1, 1),
    }),
    [],
  );
  const innerMaterial = useMemo(
    () => new MeshLineMaterial({
      color: new THREE.Color("#c1a46d"),
      lineWidth: 0.058,
      sizeAttenuation: 1,
      resolution: new THREE.Vector2(1, 1),
    }),
    [],
  );
  const outerLine = useMemo(() => new THREE.Mesh(geometry, outerMaterial), [geometry, outerMaterial]);
  const innerLine = useMemo(() => new THREE.Mesh(geometry, innerMaterial), [geometry, innerMaterial]);
  const targets = useMemo(() => Array.from({ length: 4 }, () => new THREE.Vector3()), []);
  const smoothedPoints = useMemo(() => Array.from({ length: 4 }, () => new THREE.Vector3()), []);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(smoothedPoints, false, "chordal"),
    [smoothedPoints],
  );
  const initialized = useRef(false);

  useEffect(() => {
    outerMaterial.resolution.set(size.width, size.height);
    innerMaterial.resolution.set(size.width, size.height);
  }, [innerMaterial, outerMaterial, size.height, size.width]);

  useEffect(() => () => {
    geometry.dispose();
    outerMaterial.dispose();
    innerMaterial.dispose();
  }, [geometry, innerMaterial, outerMaterial]);

  useFrame((_, delta) => {
    const anchorBody = anchor.current;
    if (!anchorBody || nodes.length !== 3 || nodes.some((node) => !node.current)) return;
    const anchorTranslation = anchorBody.translation();
    targets[0].set(anchorTranslation.x, anchorTranslation.y, anchorTranslation.z);
    nodes.forEach((node, index) => {
      const translation = node.current?.translation();
      if (translation) targets[index + 1].set(translation.x, translation.y, translation.z);
    });

    if (!initialized.current) {
      smoothedPoints.forEach((point, index) => point.copy(targets[index]));
      initialized.current = true;
    } else {
      smoothedPoints[0].copy(targets[0]);
      smoothedPoints[3].copy(targets[3]);
      for (let index = 1; index < 3; index += 1) {
        const distance = THREE.MathUtils.clamp(
          smoothedPoints[index].distanceTo(targets[index]),
          0.1,
          1,
        );
        smoothedPoints[index].lerp(targets[index], delta * distance * 50);
      }
    }

    geometry.setPoints(curve.getPoints(size.width < 768 ? 16 : 32));
  });

  return (
    <group>
      <primitive object={outerLine} frustumCulled={false} />
      <primitive object={innerLine} position-z={0.004} frustumCulled={false} />
    </group>
  );
}

function SuspendedBadge({
  isFlipped,
  onReady,
  onSceneError,
  anchorXRatio,
  anchorYRatio,
  onDragStart,
  onDragEnd,
}: {
  isFlipped: boolean;
  onReady: () => void;
  onSceneError: () => void;
  anchorXRatio: number;
  anchorYRatio: number;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const { viewport } = useThree();
  const anchor = useRef<RapierRigidBody>(null!);
  const node1 = useRef<RapierRigidBody>(null!);
  const node2 = useRef<RapierRigidBody>(null!);
  const node3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const dragOffset = useRef<THREE.Vector3 | null>(null);
  const pointerWorld = useMemo(() => new THREE.Vector3(), []);
  const pointerDirection = useMemo(() => new THREE.Vector3(), []);
  const cardPosition = useMemo(() => new THREE.Vector3(), []);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const anchorX = (anchorXRatio - 0.5) * viewport.width;
  const anchorY = viewport.height / 2 - anchorYRatio * viewport.height;
  const swingDirection = anchorX >= 0 ? -1 : 1;
  const initialCardX = THREE.MathUtils.clamp(
    anchorX + swingDirection * 1.6,
    -viewport.width / 2 + 1.48,
    viewport.width / 2 - 1.48,
  );

  useEffect(() => onReady(), [onReady]);

  const releaseCard = useCallback(() => {
    document.body.style.cursor = "";
    draggingRef.current = false;
    dragOffset.current = null;
    if (card.current) {
      card.current.setBodyType(0, true);
      card.current.wakeUp();
    }
    setDragging(false);
    onDragEnd();
  }, [onDragEnd]);

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

  useFrame((state) => {
    const body = card.current;
    if (!body) return;

    const offset = dragOffset.current;
    if (dragging && offset) {
      pointerWorld.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      pointerDirection.copy(pointerWorld).sub(state.camera.position).normalize();
      pointerWorld.add(pointerDirection.multiplyScalar(state.camera.position.length()));
      targetPosition.copy(pointerWorld).sub(offset);
      [anchor, node1, node2, node3, card].forEach((bodyRef) => bodyRef.current?.wakeUp());
      body.setNextKinematicTranslation(targetPosition);
      return;
    }

    const position = body.translation();
    if (
      Math.abs(position.x) > viewport.width * 1.5 ||
      position.y < -viewport.height * 1.5 ||
      position.y > viewport.height ||
      Math.abs(position.z) > 8
    ) {
      body.setTranslation(
        {
          x: initialCardX,
          y: anchorY,
          z: 0,
        },
        true,
      );
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const angularVelocity = body.angvel();
    const rotation = body.rotation();
    body.setAngvel(
      {
        x: angularVelocity.x,
        y: angularVelocity.y - rotation.y * 0.25,
        z: angularVelocity.z,
      },
      true,
    );
  });

  useRopeJoint(anchor, node1, [[0, 0, 0], [0, 0, 0], 0.8]);
  useRopeJoint(node1, node2, [[0, 0, 0], [0, 0, 0], 0.8]);
  useRopeJoint(node2, node3, [[0, 0, 0], [0, 0, 0], 0.8]);
  useSphericalJoint(node3, card, [[0, 0, 0], [0, 2.33, 0]]);

  useEffect(() => () => { document.body.style.cursor = ""; }, []);

  const moveCard = (event: ThreeEvent<PointerEvent>) => {
    if (dragging) event.stopPropagation();
  };

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!card.current) return;
    event.stopPropagation();
    if (supportsPointerCapture(event.target)) event.target.setPointerCapture(event.pointerId);
    const current = card.current.translation();
    cardPosition.set(current.x, current.y, current.z);
    dragOffset.current = event.point.clone().sub(cardPosition);
    card.current.setBodyType(2, true);
    card.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    card.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    draggingRef.current = true;
    setDragging(true);
    onDragStart();
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
    linearDamping: 4,
    angularDamping: 4,
    canSleep: true,
  };

  return (
    <>
      <RigidBody ref={anchor} type="fixed" colliders={false} position={[anchorX, anchorY, 0]} />
      <RigidBody ref={node1} {...nodeProps} position={[anchorX + swingDirection * 0.4, anchorY, 0]}><BallCollider args={[0.1]} /></RigidBody>
      <RigidBody ref={node2} {...nodeProps} position={[anchorX + swingDirection * 0.8, anchorY, 0]}><BallCollider args={[0.1]} /></RigidBody>
      <RigidBody ref={node3} {...nodeProps} position={[anchorX + swingDirection * 1.2, anchorY, 0]}><BallCollider args={[0.1]} /></RigidBody>
      <RigidBody
        ref={card}
        colliders={false}
        position={[initialCardX, anchorY, 0]}
        linearDamping={4}
        angularDamping={4}
        canSleep
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
      <LanyardLine anchor={anchor} nodes={[node1, node2, node3]} />
    </>
  );
}

function BadgeWorld({
  isFlipped,
  onReady,
  onSceneError,
  anchorXRatio,
  anchorYRatio,
  onDragStart,
  onDragEnd,
}: {
  isFlipped: boolean;
  onReady: () => void;
  onSceneError: () => void;
  anchorXRatio: number;
  anchorYRatio: number;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const { size } = useThree();
  const isMobile = size.width < 768;

  return (
    <>
      <ambientLight intensity={Math.PI} />
      <directionalLight position={[4, 6, 7]} intensity={1.85} color="#fff1d6" />
      <directionalLight position={[-5, 1, 4]} intensity={0.55} color="#e3e8de" />
      <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
        <SuspendedBadge
          isFlipped={isFlipped}
          onReady={onReady}
          onSceneError={onSceneError}
          anchorXRatio={anchorXRatio}
          anchorYRatio={anchorYRatio}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
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
  const [hasDragged, setHasDragged] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const lastDragAt = useRef(0);
  const markWorldReady = useCallback(() => setWorldReady(true), []);
  const markDragStart = useCallback(() => {
    lastDragAt.current = performance.now();
    setHasDragged(true);
  }, []);
  const markDragEnd = useCallback(() => {
    lastDragAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (worldReady) return;
    const timeout = window.setTimeout(onSceneError, 8000);
    return () => window.clearTimeout(timeout);
  }, [onSceneError, worldReady]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="contact-badge-canvas"
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 0, 30], fov: 20, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
        onPointerMissed={() => {
          if (performance.now() - lastDragAt.current > 450) onDismiss();
        }}
      >
        <WebGLContextGuard onSceneError={onSceneError} />
        <Suspense fallback={null}>
          <BadgeWorld
            isFlipped={isFlipped}
            onReady={markWorldReady}
            onSceneError={onSceneError}
            anchorXRatio={anchorXRatio}
            anchorYRatio={anchorYRatio}
            onDragStart={markDragStart}
            onDragEnd={markDragEnd}
          />
        </Suspense>
      </Canvas>
      <p className={`badge-drag-hint ${isFlipped || hasDragged ? "is-hidden" : ""}`}>抓住工牌轻轻拖动</p>
    </div>
  );
}
