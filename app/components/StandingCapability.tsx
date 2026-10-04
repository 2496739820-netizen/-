"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { CapabilityRadar } from "./CapabilityRadar";
import { calculateStandingLayout, standingSource } from "./standing-capability-layout";

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
      const copy = document.querySelector(".hero-copy")?.getBoundingClientRect();
      const gutter = window.innerWidth > 900 && copy
        ? Math.max(0, baseline.left - copy.right - 24)
        : baseline.left;
      const placement = calculateStandingLayout({ width: baseline.width, height: baseline.height, compact, gutter });
      const values = {
        "flow-height": placement.flowHeight,
        "card-width": placement.cardWidth,
        "card-left": placement.cardLeft,
        "card-height": placement.cardHeight,
        "image-width": placement.imageWidth,
        "image-left": placement.imageLeft,
        "image-top": placement.imageTop,
      };
      Object.entries(values).forEach(([name, value]) => {
        stage.style.setProperty(`--standing-${name}`, `${value}px`);
      });
      stage.dataset.standingReady = "true";
      // The shoe baseline follows the rendered border box, never the card shadow.
      stage.style.setProperty("--standing-image-top", `${card.getBoundingClientRect().height - standingSource.soleY * placement.scale}px`);
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
    <div ref={stageRef} className="hero-capability-stage" data-character-layout="shoulder-left">
      <CapabilityRadar />
      <Image
        ref={imageRef}
        className="hero-standing-character"
        src="/zhuang-shukai-shoulder-left.png"
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
