"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  hupaiAccount,
  hupaiWorks,
  personalAccount,
  personalResults,
  personalWorks,
  type HupaiWork,
  type PersonalWork,
  type PersonalWorkMetric,
  type WorkMetric,
} from "./hupai-data";

const metricIconSources = {
  "点赞": "/hupai/interaction-like.png",
  "收藏": "/hupai/interaction-save.png",
  "评论": "/hupai/interaction-comment.png",
  "分享": "/hupai/interaction-share.png",
} satisfies Record<WorkMetric["label"], string>;

type AccountId = "hupai" | "personal";

const accountTabs: readonly { id: AccountId; label: string; description: string }[] = [
  { id: "hupai", label: "虎.派.眼.镜", description: "工作账号 · 门店运营" },
  { id: "personal", label: "白夜下", description: "个人账号 · 视听语言" },
];

const personalNumberFormatter = new Intl.NumberFormat("en-US");

function WorkMetrics({ work }: { work: HupaiWork }) {
  return (
    <dl className="hupai-work-metrics" aria-label={`${work.title}互动数据`}>
      {work.metrics.map((metric) => (
        <div key={metric.label}>
          <dt>
            <span>{metric.label}</span>
            <Image
              className="hupai-work-metric-icon"
              src={metricIconSources[metric.label]}
              alt=""
              width={22}
              height={22}
              aria-hidden="true"
            />
          </dt>
          <dd>{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function HupaiPanel({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="account-panel"
      id="hupai-account-panel"
      role="tabpanel"
      aria-labelledby="hupai-account-tab"
      hidden={!isActive}
      inert={!isActive}
    >
      <div className="hupai-account-evidence" aria-label="虎派眼镜小红书账号公开数据">
        <a
          href={hupaiAccount.profileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`在小红书打开 ${hupaiAccount.name} 账号`}
        >
          <span>小红书账号</span>
          <strong>{hupaiAccount.name}</strong>
        </a>
        <div><span>粉丝</span><strong>{hupaiAccount.followers}</strong></div>
        <div><span>获赞与收藏</span><strong>{hupaiAccount.likesAndSaves}</strong></div>
        <div><span>负责范围</span><strong>{hupaiAccount.responsibility}</strong></div>
        <div><span>数据快照</span><strong>{hupaiAccount.snapshotDate}</strong></div>
      </div>

      <div className="account-results" aria-label="虎派眼镜门店业务结果">
        <div><strong>60+</strong><span>月均有效客资</span></div>
        <div><strong>3W+</strong><span>月均到店新客 GMV</span></div>
        <div><strong>8W+</strong><span>月度最高 GMV</span></div>
        <div><strong>≈30%</strong><span>贡献门店总业绩</span></div>
      </div>

      <div className="hupai-work-grid">
        {hupaiWorks.map((work) => (
          <article className="hupai-work-card" key={work.id}>
            {work.kind === "image" ? (
              <a
                className="hupai-work-image-link"
                href={work.noteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`在小红书打开《${work.title}》原笔记`}
              >
                <Image
                  src={work.image.src}
                  alt={work.image.alt}
                  width={work.image.width}
                  height={work.image.height}
                  sizes={work.image.sizes}
                  loading="lazy"
                />
              </a>
            ) : (
              <div className="hupai-work-video">
                <span className="hupai-work-format-tag">{work.format}</span>
                <video
                  controls
                  playsInline
                  preload="none"
                  poster={work.video.poster}
                  aria-label={work.video.label}
                >
                  <source src={work.video.src} type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
              </div>
            )}

            <div className="hupai-work-content">
              <p>{work.format} · {work.publishedAt}</p>
              <h4>{work.title}</h4>
              <p>原始标题：{work.originalTitle}</p>
              <p>{work.capability}</p>
              <WorkMetrics work={work} />
              <a
                href={work.noteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`查看《${work.title}》原笔记`}
              >
                查看原笔记
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="hupai-evidence-note">{`公开数据快照日期：${hupaiAccount.snapshotDate}。互动数据来自笔记公开页面。`}</p>
    </div>
  );
}

function ViewMetricIcon() {
  return (
    <svg className="personal-work-metric-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.3-5.2 9.5-5.2 9.5 5.2 9.5 5.2-3.3 5.2-9.5 5.2S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function PersonalMetricIcon({ label }: { label: PersonalWorkMetric["label"] }) {
  if (label === "观看") return <ViewMetricIcon />;

  return (
    <Image
      className="personal-work-metric-icon"
      src={metricIconSources[label]}
      alt=""
      width={14}
      height={14}
      aria-hidden="true"
    />
  );
}

function PersonalMetrics({ work }: { work: PersonalWork }) {
  const visibleMetrics = work.kind === "verified"
    ? work.metrics.filter((metric) => metric.label === "观看" || metric.label === "点赞")
    : work.metrics;

  if (visibleMetrics.length === 0) return null;

  return (
    <dl className="personal-work-metrics" aria-label={`${work.title}创作后台快照指标`}>
      {visibleMetrics.map((metric) => (
        <div key={metric.label}>
          <dt>
            <span>{metric.label}</span>
            <PersonalMetricIcon label={metric.label} />
          </dt>
          <dd>{personalNumberFormatter.format(metric.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function PersonalPanel({ isActive }: { isActive: boolean }) {
  return (
    <div
      className="account-panel"
      id="personal-account-panel"
      role="tabpanel"
      aria-labelledby="personal-account-tab"
      hidden={!isActive}
      inert={!isActive}
    >
      <div className="hupai-account-evidence" aria-label="白夜下小红书账号摘要">
        <a
          href={personalAccount.profileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`在小红书打开 ${personalAccount.name} 账号`}
        >
          <span>小红书账号</span>
          <strong>{personalAccount.name}</strong>
        </a>
        <div><span>粉丝</span><strong>{personalAccount.followers}</strong></div>
        <div><span>获赞与收藏</span><strong>{personalAccount.likesAndSaves}</strong></div>
        <div><span>内容定位</span><strong>{personalAccount.positioning}</strong></div>
        <div><span>数据快照</span><strong>{personalAccount.snapshotDate}</strong></div>
      </div>

      <div className="account-results" aria-label="白夜下个人账号内容结果">
        <div><strong>{personalAccount.publishedNotes}</strong><span>已发布笔记（创作后台）</span></div>
        <div><strong>{personalResults.maxViews}</strong><span>单篇最高观看</span></div>
        <div><strong>{personalResults.maxLikes}</strong><span>单篇最高点赞</span></div>
        <div><strong>{personalResults.maxSaves}</strong><span>单篇最高收藏</span></div>
      </div>

      <div className="personal-work-grid">
        {personalWorks.map((work) => (
          <article className="personal-work-card" key={work.id}>
            {work.kind === "verified" ? (
              <a
                className="personal-work-image"
                href={work.noteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`在小红书打开《${work.title}》原笔记`}
              >
                <span className="personal-work-format-tag">{work.format}</span>
                <Image
                  src={work.image.src}
                  alt={work.image.alt}
                  width={work.image.width}
                  height={work.image.height}
                  sizes={work.image.sizes}
                  loading="lazy"
                />
              </a>
            ) : (
              <div className="personal-work-image">
                <span className="personal-work-format-tag">{work.format}</span>
                <Image
                  src={work.image.src}
                  alt={work.image.alt}
                  width={work.image.width}
                  height={work.image.height}
                  sizes={work.image.sizes}
                  loading="lazy"
                />
              </div>
            )}
            <div className="personal-work-content">
              <p>{work.format}</p>
              <h4>{work.title}</h4>
              <p>{work.capability}</p>
              <PersonalMetrics work={work} />
              {work.kind === "verified" ? (
                <a
                  href={work.noteUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`查看《${work.title}》原笔记`}
                >
                  查看原笔记
                </a>
              ) : <p className="personal-series-status">{work.status}</p>}
            </div>
          </article>
        ))}
      </div>

      <p className="hupai-evidence-note">创作后台快照数据：{personalAccount.snapshotDate}。互动指标来自创作后台快照，作品链接指向可核验的小红书笔记。</p>
    </div>
  );
}

export function HupaiPortfolio() {
  const [activeAccount, setActiveAccount] = useState("hupai");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectTab = (index: number) => {
    setActiveAccount(accountTabs[index].id);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % accountTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + accountTabs.length) % accountTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = accountTabs.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      selectTab(nextIndex);
    }
  };

  return (
    <section className="hupai-evidence" aria-labelledby="hupai-evidence-title">
      <div className="hupai-evidence-heading">
        <div>
          <p className="eyebrow">Verified Xiaohongshu work</p>
          <h3 id="hupai-evidence-title">小红书内容作品</h3>
        </div>
        <div className="account-tabs" role="tablist" aria-label="切换运营账号">
          {accountTabs.map((tab, index) => {
            const isActive = activeAccount === tab.id;
            const isHupai = tab.id === "hupai";
            return (
              <button
                className="account-tab"
                key={tab.id}
                type="button"
                role="tab"
                id={isHupai ? "hupai-account-tab" : "personal-account-tab"}
                aria-controls={isHupai ? "hupai-account-panel" : "personal-account-panel"}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                ref={(node) => { tabRefs.current[index] = node; }}
                onClick={() => setActiveAccount(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <strong>{tab.label}</strong>
                <span>{tab.description}</span>
              </button>
            );
          })}
        </div>
      </div>

      <HupaiPanel isActive={activeAccount === "hupai"} />
      <PersonalPanel isActive={activeAccount === "personal"} />
    </section>
  );
}
