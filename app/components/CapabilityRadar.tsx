"use client";

import { useEffect, useMemo, useState } from "react";

const capabilities = [
  { label: "内容策划", score: 8, point: [260, 102], labelPoint: [260, 42], anchor: "middle", axisEnd: [260, 76] },
  { label: "账号运营", score: 8, point: [350.1, 153], labelPoint: [392, 126], anchor: "start", axisEnd: [372.6, 140] },
  { label: "到店转化", score: 8, point: [350.1, 257], labelPoint: [392, 288], anchor: "start", axisEnd: [372.6, 270] },
  { label: "影像制作", score: 10, point: [260, 334], labelPoint: [260, 382], anchor: "middle", axisEnd: [260, 334] },
  { label: "数据复盘", score: 8, point: [169.9, 257], labelPoint: [128, 288], anchor: "end", axisEnd: [147.4, 270] },
  { label: "平台投流", score: 9, point: [158.7, 146.5], labelPoint: [128, 126], anchor: "end", axisEnd: [147.4, 140] },
] as const;

type CapabilityIndex = number | null;

function toggleIndex(current: CapabilityIndex, next: number) {
  return current === next ? null : next;
}

export function CapabilityRadar() {
  const [selectedIndex, setSelectedIndex] = useState<CapabilityIndex>(null);
  const [hoveredIndex, setHoveredIndex] = useState<CapabilityIndex>(null);
  const [focusedIndex, setFocusedIndex] = useState<CapabilityIndex>(null);
  const [pulseIndex, setPulseIndex] = useState<CapabilityIndex>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return undefined;

    const imagePulse = window.setTimeout(() => setPulseIndex(3), 1_700);
    const paidTrafficPulse = window.setTimeout(() => setPulseIndex(5), 2_350);
    const clearPulse = window.setTimeout(() => setPulseIndex(null), 2_920);

    return () => {
      window.clearTimeout(imagePulse);
      window.clearTimeout(paidTrafficPulse);
      window.clearTimeout(clearPulse);
    };
  }, []);

  const activeIndex = useMemo(
    () => focusedIndex ?? hoveredIndex ?? selectedIndex ?? pulseIndex,
    [focusedIndex, hoveredIndex, pulseIndex, selectedIndex],
  );

  const selectCapability = (index: number) => {
    setSelectedIndex((current) => toggleIndex(current, index));
  };

  return (
    <figure className="radar-card" aria-labelledby="radar-title">
      <figcaption className="radar-heading">
        <div>
          <span>Capability prescription</span>
          <h2 id="radar-title">能力处方</h2>
        </div>
      </figcaption>

      <div className="radar-visual">
        <svg
          className="radar-chart"
          viewBox="0 0 520 410"
          role="group"
          aria-label="庄澍凯新媒体运营能力雷达图，可聚焦或点击能力点查看对应能力。"
        >
          <title>庄澍凯新媒体运营能力雷达图</title>
          <desc>内容策划八分、账号运营八分、到店转化八分、影像制作十分、数据复盘八分、平台投流九分。</desc>
          <g className="radar-plot" aria-hidden="true">
            <g className="radar-grid">
              <polygon points="260,162 297,183.5 297,226.5 260,248 223,226.5 223,183.5" />
              <polygon points="260,119 334.5,162 334.5,248 260,291 185.5,248 185.5,162" />
              <polygon points="260,76 372.6,140 372.6,270 260,334 147.4,270 147.4,140" />
              <line x1="260" y1="205" x2="260" y2="76" />
              <line x1="260" y1="205" x2="372.6" y2="140" />
              <line x1="260" y1="205" x2="372.6" y2="270" />
              <line x1="260" y1="205" x2="260" y2="334" />
              <line x1="260" y1="205" x2="147.4" y2="270" />
              <line x1="260" y1="205" x2="147.4" y2="140" />
            </g>
            <polygon className="radar-area" points="260,102 350.1,153 350.1,257 260,334 169.9,257 158.7,146.5" />
            <polyline className="radar-stroke" points="260,102 350.1,153 350.1,257 260,334 169.9,257 158.7,146.5 260,102" />
          </g>
          <g className="radar-axes">
            {capabilities.map((capability, index) => {
              const isActive = activeIndex === index;
              const isDimmed = activeIndex !== null && !isActive;
              const isPulsing = pulseIndex === index;
              const [x, y] = capability.point;
              const [labelX, labelY] = capability.labelPoint;
              const [axisX, axisY] = capability.axisEnd;

              return (
                <g
                  className="radar-axis"
                  data-active={isActive || undefined}
                  data-dimmed={isDimmed || undefined}
                  data-pulsing={isPulsing || undefined}
                  key={capability.label}
                  onPointerEnter={() => setHoveredIndex(index)}
                  onPointerLeave={() => setHoveredIndex(null)}
                >
                  <line className="radar-axis-line" x1="260" y1="205" x2={axisX} y2={axisY} />
                  <circle className="radar-point" cx={x} cy={y} r="5" />
                  <circle className="radar-pulse-ring" cx={x} cy={y} r="8" aria-hidden="true" />
                  <text className="radar-axis-label" x={labelX} y={labelY} textAnchor={capability.anchor}>
                    <tspan>{capability.label}</tspan>
                    <tspan className="radar-score" dx="6">{capability.score}</tspan>
                  </text>
                  <circle
                    className="radar-axis-target"
                    cx={x}
                    cy={y}
                    r="26"
                    role="button"
                    tabIndex={0}
                    aria-label={`${capability.label} ${capability.score} 分`}
                    aria-pressed={selectedIndex === index}
                    onClick={() => selectCapability(index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      selectCapability(index);
                    }}
                  />
                </g>
              );
            })}
          </g>
        </svg>
        <span className="radar-seal" aria-hidden="true">ZSK</span>
      </div>

      <ul className="radar-accessible-list" aria-label="能力点选">
        {capabilities.map((capability, index) => (
          <li key={capability.label}>
            <button
              type="button"
              aria-pressed={selectedIndex === index}
              onClick={() => selectCapability(index)}
            >
              <span>{capability.label}</span>
              <strong>{capability.score}/10</strong>
            </button>
          </li>
        ))}
      </ul>
      <p className="radar-note">分值表示与目标岗位相关的相对能力重心，不代表标准化测评。</p>
    </figure>
  );
}
