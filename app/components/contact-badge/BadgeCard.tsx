"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  CONTACT_AVATAR_SOURCE,
  CONTACT_CAPABILITIES,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_QR_SOURCE,
  createFallbackQrDataUrl,
} from "./contact-data";

type BadgeCardProps = {
  isFlipped: boolean;
  isMobile: boolean;
  onTextureReady: () => void;
  onTextureError: () => void;
  onPointerDown: (event: ThreeEvent<PointerEvent>) => void;
  onPointerMove: (event: ThreeEvent<PointerEvent>) => void;
  onPointerUp: (event: ThreeEvent<PointerEvent>) => void;
};

type CardModel = {
  nodes: {
    card: THREE.Mesh;
    clip: THREE.Mesh;
    clamp: THREE.Mesh;
  };
  materials: {
    base: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
  };
};

const CARD_MODEL_SOURCE = "/contact-card.glb";
const CARD_BASE_SOURCE = "/contact-card-base-dark.png";
const ATLAS_SIZE = 1376;
const ASSET_TIMEOUT_MS = 30000;
const FONT_WAIT_MS = 1200;

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

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`Timed out loading ${source}`));
    }, ASSET_TIMEOUT_MS);
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      callback();
    };
    image.decoding = "async";
    image.onload = () => finish(() => resolve(image));
    image.onerror = () => finish(() => reject(new Error(`Unable to load ${source}`)));
    image.src = source;
  });
}

async function waitForFontsWithoutBlockingTexture() {
  if (!document.fonts) return;
  await new Promise<void>((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve();
    };
    const timeout = window.setTimeout(finish, FONT_WAIT_MS);
    void document.fonts.ready.then(finish, finish);
  });
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const targetRatio = width / height;
  const sourceRatio = image.naturalWidth / image.naturalHeight;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (sourceRatio > targetRatio) {
    sourceWidth = image.naturalHeight * targetRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetRatio;
    sourceY = Math.max(0, (image.naturalHeight - sourceHeight) * 0.18);
  }

  context.save();
  roundedRect(context, x, y, width, height, radius);
  context.clip();
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
  context.restore();
}

function drawQrCrop(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  size: number,
) {
  const ratio = image.naturalWidth / image.naturalHeight;
  if (ratio > 0.9 && ratio < 1.1) {
    context.drawImage(image, x, y, size, size);
    return;
  }

  const sourceSize = Math.min(image.naturalWidth * 0.71, image.naturalHeight * 0.56);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = image.naturalHeight * 0.285;
  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, x, y, size, size);
}

function drawCapabilities(context: CanvasRenderingContext2D) {
  CONTACT_CAPABILITIES.forEach((label, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 48 + column * 294;
    const y = 650 + row * 80;
    roundedRect(context, x, y, 280, 52, 26);
    context.fillStyle = "rgba(255,255,255,.1)";
    context.fill();
    context.strokeStyle = "rgba(255,255,255,.1)";
    context.lineWidth = 1;
    context.stroke();
    context.fillStyle = "#eeeeee";
    context.font = "500 23px 'Noto Sans SC', sans-serif";
    context.textAlign = "center";
    context.fillText(label, x + 140, y + 34);
  });
}

async function createPersonalAtlas(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create contact badge atlas");

  const [base, avatar] = await Promise.all([
    loadImage(CARD_BASE_SOURCE),
    loadImage(CONTACT_AVATAR_SOURCE),
  ]);

  let qr: HTMLImageElement;
  try {
    qr = await loadImage(CONTACT_QR_SOURCE);
  } catch {
    qr = await loadImage(await createFallbackQrDataUrl());
  }

  context.drawImage(base, 0, 0, ATLAS_SIZE, ATLAS_SIZE);

  // Front atlas: keep the reference card's monochrome identity while making
  // the portfolio owner's personal and contact information immediately legible.
  context.fillStyle = "#000000";
  context.fillRect(0, 0, 688, 1054);

  context.strokeStyle = "rgba(255,255,255,.055)";
  context.lineWidth = 1;
  for (let offset = -540; offset < 680; offset += 72) {
    context.beginPath();
    context.moveTo(offset, 560);
    context.lineTo(offset + 540, 1020);
    context.stroke();
  }

  context.textAlign = "left";
  context.fillStyle = "#8d8d8d";
  context.font = "600 16px Manrope, sans-serif";
  context.fillText("PERSONAL CONTACT / 2026", 48, 48);

  drawCoverImage(context, avatar, 48, 76, 168, 224, 14);

  context.fillStyle = "#d1b681";
  context.font = "600 21px 'Noto Sans SC', sans-serif";
  context.fillText("高端眼镜门店", 244, 104);
  context.fillText("新媒体运营", 244, 136);
  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  context.font = "600 52px 'Noto Serif SC', serif";
  context.fillText("庄澍凯", 244, 194);
  context.fillStyle = "#9a9a9a";
  context.font = "500 16px Manrope, sans-serif";
  context.fillText("ZHUANG SHUKAI", 244, 228);
  context.fillStyle = "#898989";
  context.font = "500 16px 'Noto Sans SC', sans-serif";
  context.fillText("求职区域  粤港澳大湾区", 244, 264);

  context.strokeStyle = "rgba(255,255,255,.14)";
  context.beginPath();
  context.moveTo(48, 332);
  context.lineTo(640, 332);
  context.stroke();

  context.fillStyle = "#7a7a7a";
  context.font = "600 15px Manrope, sans-serif";
  context.fillText("PHONE", 48, 372);
  context.fillStyle = "#ffffff";
  context.font = "600 37px Manrope, sans-serif";
  context.fillText(CONTACT_PHONE, 48, 418);

  context.fillStyle = "#7a7a7a";
  context.font = "600 15px Manrope, sans-serif";
  context.fillText("EMAIL", 48, 470);
  context.fillStyle = "#f2f2f2";
  context.font = "600 25px Manrope, sans-serif";
  context.fillText(CONTACT_EMAIL, 48, 509);

  context.strokeStyle = "rgba(255,255,255,.14)";
  context.beginPath();
  context.moveTo(48, 554);
  context.lineTo(640, 554);
  context.stroke();

  context.fillStyle = "#d1b681";
  context.font = "600 18px 'Noto Sans SC', sans-serif";
  context.fillText("职业技能", 48, 610);

  drawCapabilities(context);

  context.strokeStyle = "rgba(255,255,255,.12)";
  context.beginPath();
  context.moveTo(48, 930);
  context.lineTo(640, 930);
  context.stroke();
  context.fillStyle = "#727272";
  context.font = "600 14px Manrope, sans-serif";
  context.textAlign = "left";
  context.fillText("ZHUANG SHUKAI", 48, 970);
  context.textAlign = "right";
  context.fillText("NEW MEDIA OPERATOR · 求职中", 640, 970);

  // Back atlas: use the same reference panel geometry with the supplied
  // WeChat QR code and the portfolio contact details.
  roundedRect(context, 740, 248, 586, 654, 24);
  context.fillStyle = "#090909";
  context.fill();
  context.strokeStyle = "#232323";
  context.lineWidth = 2;
  context.stroke();

  roundedRect(context, 784, 292, 498, 498, 7);
  context.fillStyle = "#ffffff";
  context.fill();
  drawQrCrop(context, qr, 800, 308, 466);

  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  context.font = "600 28px 'Noto Sans SC', sans-serif";
  context.fillText("扫码添加微信", 784, 836);
  context.fillStyle = "#878787";
  context.font = "500 18px Manrope, sans-serif";
  context.fillText(CONTACT_EMAIL, 784, 871);
  context.textAlign = "right";
  context.fillText(CONTACT_PHONE, 1282, 871);
}

function usePersonalAtlas(onTextureReady: () => void, onTextureError: () => void) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: THREE.CanvasTexture | null = null;

    const create = async () => {
      await waitForFontsWithoutBlockingTexture();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = ATLAS_SIZE;
      await createPersonalAtlas(canvas);
      if (cancelled) return;

      created = new THREE.CanvasTexture(canvas);
      created.flipY = false;
      created.colorSpace = THREE.SRGBColorSpace;
      created.anisotropy = 16;
      created.needsUpdate = true;
      setTexture(created);
      onTextureReady();
    };

    void create().catch(() => {
      if (!cancelled) onTextureError();
    });

    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, [onTextureError, onTextureReady]);

  return texture;
}

export function BadgeCard({
  isFlipped,
  isMobile,
  onTextureReady,
  onTextureError,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: BadgeCardProps) {
  const visualRef = useRef<THREE.Group>(null);
  const texture = usePersonalAtlas(onTextureReady, onTextureError);
  const model = useGLTF(CARD_MODEL_SOURCE) as unknown as CardModel;
  const clipMaterial = useMemo(() => {
    const material = model.materials.metal.clone();
    material.roughness = 0.3;
    return material;
  }, [model.materials.metal]);
  const clampMaterial = useMemo(() => model.materials.metal.clone(), [model.materials.metal]);

  useEffect(() => () => {
    clipMaterial.dispose();
    clampMaterial.dispose();
  }, [clampMaterial, clipMaterial]);

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
      ref={visualRef}
      scale={isMobile ? 2.6 : 2.35}
      position={[0, -1.2, -0.05]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerOver={() => { document.body.style.cursor = "grab"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}
    >
      <mesh geometry={model.nodes.card.geometry}>
        <meshPhysicalMaterial
          key={texture?.uuid ?? "badge-texture-loading"}
          map={texture ?? undefined}
          color={texture ? "#ffffff" : "#050505"}
          clearcoat={isMobile ? 0 : 0.65}
          clearcoatRoughness={0.22}
          roughness={0.72}
          metalness={0.04}
        />
      </mesh>
      <mesh geometry={model.nodes.clip.geometry} material={clipMaterial} />
      <mesh geometry={model.nodes.clamp.geometry} material={clampMaterial} />
    </group>
  );
}

useGLTF.preload(CARD_MODEL_SOURCE);
