import Image from "next/image";
import { hupaiAccount, hupaiWorks, type HupaiWork, type WorkMetric } from "./hupai-data";

const metricIconSources = {
  "点赞": "/hupai/interaction-like.png",
  "收藏": "/hupai/interaction-save.png",
  "评论": "/hupai/interaction-comment.png",
  "分享": "/hupai/interaction-share.png",
} satisfies Record<WorkMetric["label"], string>;

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

export function HupaiPortfolio() {
  return (
    <section className="hupai-evidence" aria-labelledby="hupai-evidence-title">
      <div className="hupai-evidence-heading">
        <div>
          <p className="eyebrow">Verified Xiaohongshu work</p>
          <h3 id="hupai-evidence-title">小红书内容作品</h3>
        </div>
      </div>

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
    </section>
  );
}
