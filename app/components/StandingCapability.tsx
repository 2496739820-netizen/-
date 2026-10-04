"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CapabilityRadar } from "./CapabilityRadar";

export function StandingCapability() {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const image = imageRef.current;
    const card = stage?.querySelector<HTMLElement>(".radar-card");
    if (!stage || !image || !card) return;

    let disposed = false;
    let frame = 0;
    function layout() {
      if (disposed || !stage || !card) return;
      // Measure the original card before narrowing; its flow height stays intact.
      delete stage.dataset.standingReady;
      const baseline = card.getBoundingClientRect();
      const compact = window.innerWidth <= 620;
      const cardWidth = baseline.width * (compact ? 0.8 : 0.75);
      const copy = document.querySelector(".hero-copy")?.getBoundingClientRect();
      const gutter = window.innerWidth > 900 && copy
        ? Math.max(0, baseline.left - copy.right - 24)
        : baseline.left;
      const extra = Math.max(0, Math.min(30, gutter - 8));
      const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 86;
      // Measured alpha bounds and forearm contact in the 1024 × 1536 source.
      const scale = Math.max(0, Math.min(
        (baseline.width - cardWidth + extra) / (610 - 122),
        (baseline.height - 12) / (1519 - 314),
        (baseline.top + window.scrollY - headerHeight - 8) / (314 - 24),
      ));
      const cardLeft = baseline.width - cardWidth;
      const values = {
        "flow-height": baseline.height,
        "card-width": cardWidth,
        "card-left": cardLeft,
        "card-height": compact ? baseline.height : Math.min(baseline.height, Math.max(baseline.height * 0.88, 1205 * scale + 12)),
        "image-width": 1024 * scale,
        "image-left": cardLeft - 610 * scale,
        "image-top": -314 * scale,
      };
      Object.entries(values).forEach(([name, value]) => {
        stage.style.setProperty(`--standing-${name}`, `${value}px`);
      });
      stage.dataset.standingReady = "true";
      const chartWidth = card.querySelector(".radar-chart")?.getBoundingClientRect().width;
      if (chartWidth) {
        stage.style.setProperty("--standing-label-size", `${12 * 520 / chartWidth}px`);
        stage.style.setProperty("--standing-score-size", `${9 * 520 / chartWidth}px`);
      }
    }
    const scheduleLayout = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    };
    const imageFailure = () => { delete stage.dataset.standingReady; };
    async function initialize() {
      try {
        await Promise.all([document.fonts.ready, image!.decode()]);
        // Anchor only after the existing hero entrance has reached its final position.
        await Promise.all(stage!.parentElement!.getAnimations().map(animation => animation.finished.catch(() => {})));
        if (disposed) return;
        layout();
        window.addEventListener("resize", scheduleLayout);
      } catch {
        // A failed image keeps the existing full-width, interactive radar card.
      }
    }
    image.addEventListener("error", imageFailure);
    void initialize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleLayout);
      image.removeEventListener("error", imageFailure);
    };
  }, []);

  return (
    <div ref={stageRef} className="hero-capability-stage" data-character-layout="standing-left">
      <CapabilityRadar />
      <Image
        ref={imageRef}
        className="hero-standing-character"
        src="/zhuang-shukai-standing-left.png"
        width={1024}
        height={1536}
        alt=""
        aria-hidden="true"
        draggable={false}
        preload
        unoptimized
      />
    </div>
  );
}
