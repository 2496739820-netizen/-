"use client";

import { RoundedBox } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  CONTACT_CAPABILITIES,
  CONTACT_EMAIL,
  CONTACT_QR_SOURCE,
  CONTACT_RESULTS,
  createFallbackQrDataUrl,
} from "./contact-data";

type BadgeCardProps = {
  isFlipped: boolean;
  onTextureError: () => void;
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
  onPointerUp: (event: ThreeEvent<PointerEvent>) => void;
};

type BadgeTextures = {
  front: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
};

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1458;
const INK = "#26231e";
const MUTED = "#756e62";
const GOLD = "#8a7349";
const SAGE = "#e7e9e1";
const SURFACE = "#fffdf8";

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function drawFront(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = SURFACE;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = SAGE;
  context.beginPath();
  context.arc(880, 92, 230, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = GOLD;
  roundedRect(context, 72, 70, 72, 72, 36);
  context.fill();
  context.fillStyle = SURFACE;
  context.font = "600 25px Manrope, sans-serif";
  context.textAlign = "center";
  context.fillText("ZS", 108, 116);
  context.textAlign = "right";
  context.fillStyle = MUTED;
  context.font = "600 18px Manrope, sans-serif";
  context.fillText("CONTACT / 2026", 940, 112);

  context.textAlign = "left";
  context.fillStyle = GOLD;
  context.font = "600 25px 'Noto Sans SC', sans-serif";
  context.fillText("高端眼镜门店新媒体运营", 72, 236);
  context.fillStyle = INK;
  context.font = "600 92px 'Noto Serif SC', 'Songti SC', serif";
  context.fillText("庄澍凯", 66, 350);
  context.fillStyle = MUTED;
  context.font = "500 26px 'Noto Sans SC', sans-serif";
  context.fillText("粤港澳大湾区", 72, 415);
  context.textAlign = "right";
  context.fillText("虎派眼镜 2024.05 至今", 940, 415);

  context.strokeStyle = "rgba(38,35,30,.13)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(72, 468);
  context.lineTo(952, 468);
  context.stroke();

  context.textAlign = "left";
  context.fillStyle = MUTED;
  context.font = "600 19px Manrope, 'Noto Sans SC', sans-serif";
  context.fillText("CORE RESULTS", 72, 520);

  CONTACT_RESULTS.forEach((result, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 72 + column * 446;
    const y = 560 + row * 190;
    roundedRect(context, x, y, 410, 160, 30);
    context.fillStyle = index === 0 ? "#e7e9e1" : "#f3eee4";
    context.fill();
    context.fillStyle = INK;
    context.font = "600 60px Manrope, sans-serif";
    context.fillText(result.value, x + 28, y + 69);
    context.fillStyle = MUTED;
    context.font = "500 22px 'Noto Sans SC', sans-serif";
    context.fillText(result.label, x + 28, y + 119);
  });

  context.fillStyle = MUTED;
  context.font = "600 19px Manrope, 'Noto Sans SC', sans-serif";
  context.fillText("CORE CAPABILITIES", 72, 982);
  CONTACT_CAPABILITIES.forEach((capability, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 72 + column * 294;
    const y = 1022 + row * 84;
    roundedRect(context, x, y, 266, 62, 31);
    context.fillStyle = "rgba(138,115,73,.095)";
    context.fill();
    context.fillStyle = INK;
    context.font = "500 24px 'Noto Sans SC', sans-serif";
    context.textAlign = "center";
    context.fillText(capability, x + 133, y + 40);
  });

  context.textAlign = "left";
  context.strokeStyle = "rgba(38,35,30,.13)";
  context.beginPath();
  context.moveTo(72, 1246);
  context.lineTo(952, 1246);
  context.stroke();
  context.fillStyle = GOLD;
  context.font = "600 18px Manrope, sans-serif";
  context.fillText("EMAIL", 72, 1310);
  context.fillStyle = INK;
  context.font = "500 28px Manrope, sans-serif";
  context.fillText(CONTACT_EMAIL, 72, 1360);
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${source}`));
    image.src = source;
  });
}

async function drawBack(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.fillStyle = SURFACE;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = SAGE;
  context.beginPath();
  context.arc(130, 1340, 260, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = GOLD;
  context.font = "600 21px Manrope, sans-serif";
  context.fillText("CONTACT", 72, 110);
  context.fillStyle = "#6f8c67";
  context.beginPath();
  context.arc(925, 102, 9, 0, Math.PI * 2);
  context.fill();

  let qrImage: HTMLImageElement;
  try {
    qrImage = await loadImage(CONTACT_QR_SOURCE);
  } catch {
    qrImage = await loadImage(await createFallbackQrDataUrl());
  }

  const qrSize = 720;
  const qrX = (CANVAS_WIDTH - qrSize) / 2;
  const qrY = 222;
  roundedRect(context, qrX - 25, qrY - 25, qrSize + 50, qrSize + 50, 38);
  context.fillStyle = "#ffffff";
  context.fill();

  const ratio = qrImage.naturalWidth / qrImage.naturalHeight;
  if (ratio > 0.9 && ratio < 1.1) {
    context.drawImage(qrImage, qrX, qrY, qrSize, qrSize);
  } else {
    const sourceSize = Math.min(qrImage.naturalWidth * 0.71, qrImage.naturalHeight * 0.56);
    const sourceX = (qrImage.naturalWidth - sourceSize) / 2;
    const sourceY = qrImage.naturalHeight * 0.285;
    context.drawImage(qrImage, sourceX, sourceY, sourceSize, sourceSize, qrX, qrY, qrSize, qrSize);
  }

  context.textAlign = "center";
  context.fillStyle = INK;
  context.font = "600 48px 'Noto Serif SC', serif";
  context.fillText("扫码联系我", CANVAS_WIDTH / 2, 1075);
  context.fillStyle = MUTED;
  context.font = "500 27px Manrope, sans-serif";
  context.fillText(CONTACT_EMAIL, CANVAS_WIDTH / 2, 1132);
  context.fillStyle = GOLD;
  context.font = "500 23px 'Noto Sans SC', sans-serif";
  context.fillText("高端眼镜门店新媒体运营", CANVAS_WIDTH / 2, 1322);
}

function useBadgeTextures(onTextureError: () => void) {
  const [textures, setTextures] = useState<BadgeTextures | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: BadgeTextures | null = null;

    const create = async () => {
      await document.fonts.ready;
      const frontCanvas = document.createElement("canvas");
      const backCanvas = document.createElement("canvas");
      frontCanvas.width = backCanvas.width = CANVAS_WIDTH;
      frontCanvas.height = backCanvas.height = CANVAS_HEIGHT;
      drawFront(frontCanvas);
      await drawBack(backCanvas);
      if (cancelled) return;

      const front = new THREE.CanvasTexture(frontCanvas);
      const back = new THREE.CanvasTexture(backCanvas);
      front.colorSpace = back.colorSpace = THREE.SRGBColorSpace;
      front.anisotropy = back.anisotropy = 4;
      front.needsUpdate = back.needsUpdate = true;
      created = { front, back };
      setTextures(created);
    };

    void create().catch(() => { if (!cancelled) onTextureError(); });
    return () => {
      cancelled = true;
      created?.front.dispose();
      created?.back.dispose();
    };
  }, [onTextureError]);

  return textures;
}

export function BadgeCard({ isFlipped, onTextureError, onPointerDown, onPointerMove, onPointerUp }: BadgeCardProps) {
  const visualRef = useRef<THREE.Group>(null);
  const textures = useBadgeTextures(onTextureError);
  const brass = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#9c8153", metalness: 0.72, roughness: 0.28 }),
    [],
  );

  useEffect(() => () => brass.dispose(), [brass]);
  useFrame((_, delta) => {
    if (!visualRef.current) return;
    visualRef.current.rotation.y = THREE.MathUtils.damp(
      visualRef.current.rotation.y,
      isFlipped ? Math.PI : 0,
      7,
      delta,
    );
  });

  return (
    <group
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerOver={() => { document.body.style.cursor = "grab"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}
    >
      <group ref={visualRef}>
        <RoundedBox args={[2.6, 3.7, 0.13]} radius={0.16} smoothness={6}>
          <meshStandardMaterial color="#f8f3e9" roughness={0.66} metalness={0.02} />
        </RoundedBox>
        <mesh position={[0, 0, 0.082]} renderOrder={2}>
          <planeGeometry args={[2.52, 3.62]} />
          <meshBasicMaterial
            key={textures ? "front-textured" : "front-placeholder"}
            map={textures?.front ?? null}
            color={textures ? "#ffffff" : "#f3eee4"}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
        <mesh position={[0, 0, -0.082]} rotation={[0, Math.PI, 0]} renderOrder={2}>
          <planeGeometry args={[2.52, 3.62]} />
          <meshBasicMaterial
            key={textures ? "back-textured" : "back-placeholder"}
            map={textures?.back ?? null}
            color={textures ? "#ffffff" : "#e7e9e1"}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      </group>
      <mesh position={[0, 2.03, 0]} material={brass}>
        <boxGeometry args={[0.62, 0.28, 0.24]} />
      </mesh>
      <mesh position={[0, 2.24, 0]} rotation={[Math.PI / 2, 0, 0]} material={brass}>
        <torusGeometry args={[0.18, 0.055, 16, 32]} />
      </mesh>
    </group>
  );
}
