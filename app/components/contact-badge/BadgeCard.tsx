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
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${source}`));
    image.src = source;
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
  const labels = CONTACT_CAPABILITIES.map((item) => item.replace("平台", ""));
  labels.forEach((label, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 54 + column * 205;
    const y = 838 + row * 43;
    roundedRect(context, x, y, 176, 31, 15.5);
    context.fillStyle = "rgba(255,255,255,.085)";
    context.fill();
    context.fillStyle = "#d6d6d6";
    context.font = "500 17px 'Noto Sans SC', sans-serif";
    context.textAlign = "center";
    context.fillText(label, x + 88, y + 21);
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

  // Front atlas: preserve the reference card's black field and geometric X,
  // while replacing its event identity with the portfolio owner's details.
  context.fillStyle = "#000000";
  context.fillRect(0, 54, 688, 290);
  context.fillRect(0, 820, 688, 230);

  drawCoverImage(context, avatar, 54, 72, 150, 150, 18);

  context.textAlign = "left";
  context.fillStyle = "#ffffff";
  context.font = "600 48px 'Noto Sans SC', sans-serif";
  context.fillText("庄澍凯", 232, 120);
  context.fillStyle = "#a0a0a0";
  context.font = "500 22px 'Noto Sans SC', sans-serif";
  context.fillText("高端眼镜门店新媒体运营", 232, 164);
  context.font = "500 19px Manrope, 'Noto Sans SC', sans-serif";
  context.fillText("粤港澳大湾区  ·  CONTACT 2026", 232, 204);

  context.fillStyle = "#ffffff";
  context.font = "500 44px Manrope, 'Noto Sans SC', sans-serif";
  context.fillText("CONTENT TO CONVERSION", 54, 304);

  drawCapabilities(context);

  context.textAlign = "right";
  context.fillStyle = "#ffffff";
  context.font = "500 43px Manrope, sans-serif";
  context.fillText("ZHUANG SHUKAI", 634, 956);
  context.fillStyle = "#878787";
  context.font = "500 18px Manrope, sans-serif";
  context.fillText(`${CONTACT_PHONE}  ·  ${CONTACT_EMAIL}`, 634, 996);

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

function usePersonalAtlas(onTextureError: () => void) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: THREE.CanvasTexture | null = null;

    const create = async () => {
      await document.fonts.ready;
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
    };

    void create().catch(() => {
      if (!cancelled) onTextureError();
    });

    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, [onTextureError]);

  return texture;
}

export function BadgeCard({
  isFlipped,
  isMobile,
  onTextureError,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: BadgeCardProps) {
  const visualRef = useRef<THREE.Group>(null);
  const texture = usePersonalAtlas(onTextureError);
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
      scale={2.25}
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
          map={texture}
          color={texture ? "#ffffff" : "#050505"}
          map-anisotropy={16}
          clearcoat={isMobile ? 0 : 1}
          clearcoatRoughness={0.15}
          roughness={0.9}
          metalness={0.8}
        />
      </mesh>
      <mesh geometry={model.nodes.clip.geometry} material={clipMaterial} />
      <mesh geometry={model.nodes.clamp.geometry} material={clampMaterial} />
    </group>
  );
}

useGLTF.preload(CARD_MODEL_SOURCE);
