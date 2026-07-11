"use client";

import { useEffect, useMemo, useRef } from "react";

const manifesto =
  "我相信 真正有效的内容， 不只要在三秒内 让人停下来， 也要在离开屏幕后 继续发生作用。 镜头、 节奏、 平台语境与数据 不是分开的工种， 而是一条 从注意力走向信任， 再抵达行动的 完整叙事。 每一次发布， 都是下一次 创作的证据。";

const metrics = [
  ["3W", "+", "月均到店新客 GMV"],
  ["8W", "+", "月度最高 GMV"],
  ["60", "+", "月均有效客资"],
  ["30", "%", "约贡献门店总业绩"],
];

const roles = [
  {
    title: "把卖点翻译成内容",
    copy: "从用户需求、产品特征与平台趋势出发，策划种草、测评与门店探访内容，完成选题、脚本、拍摄、发布及复盘。",
  },
  {
    title: "把内容接入增长链路",
    copy: "覆盖投流测试、页面优化、活动配置与数据分析，让曝光不止停在观看，而是继续走向咨询、客资与 GMV。",
  },
  {
    title: "把单点扩展为矩阵",
    copy: "搭建员工账号内容方向与发布节奏，协同小红书、大众点评、抖音小店、京东等渠道，扩大自然曝光与客资来源。",
  },
  {
    title: "把 AI 变成制作伙伴",
    copy: "使用 AI 生成产品视觉、佩戴效果与短视频素材，在保持视觉判断的同时，提高内容生产效率与表达空间。",
  },
];

const process = [
  ["01", "Find the tension", "用户需求 × 产品卖点 × 平台趋势，找到值得被放大的核心冲突。"],
  ["02", "Build the frame", "脚本、拍摄、布光、剪辑、调色与声音，让信息获得准确的节奏。"],
  ["03", "Test the signal", "矩阵分发、投流测试与数据复盘，辨认真正有效的表达方向。"],
  ["04", "Move to action", "从曝光到咨询、客资与成交，用结果反向校准下一次创作。"],
];

const archive = [
  {
    date: "2023.11 — 2024.03",
    company: "氦心科技（深圳）有限公司",
    role: "视频剪辑 / 效果素材",
    result: "单月最高转化 800+",
    note: "CPC ≤ ¥1",
  },
  {
    date: "2023.07 — 2023.10",
    company: "深圳市欣睿网络传媒有限公司",
    role: "剪辑 / 产品视觉",
    result: "拍摄 · 外拍 · 剪辑 · 调色 · 声音",
    note: "",
  },
  {
    date: "2022.12 — 2023.06",
    company: "深圳市瓜皮传媒有限公司",
    role: "剪辑师 / 全流程制作",
    result: "口播 · 工厂 · 访谈 · 矩阵分发",
    note: "",
  },
];

const skills = [
  "Xiaohongshu",
  "Content strategy",
  "Scriptwriting",
  "Shooting",
  "Lighting",
  "Premiere Pro",
  "DaVinci Resolve",
  "Media buying",
  "AI creation",
];

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const manifestoRef = useRef<HTMLHeadingElement>(null);
  const words = useMemo(() => manifesto.split(/(\s+)/).filter(Boolean), []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const header = headerRef.current;
    const statement = manifestoRef.current;
    if (!root) return;

    let unlocked = false;
    let frame = 0;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      root.dataset.loaded = "true";
    };

    const videoEvents = ["loadeddata", "canplay", "canplaythrough"] as const;
    videoEvents.forEach((event) => video?.addEventListener(event, unlock));
    video?.load();
    const fallbackTimer = window.setTimeout(unlock, 3000);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "-50px" },
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => revealObserver.observe(el));

    const renderScroll = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      root.style.setProperty("--scroll-progress", `${progress * 100}%`);
      header?.classList.toggle("is-scrolled", window.scrollY > 24);

      if (unlocked && video?.duration && !video.seeking) {
        video.currentTime = progress * video.duration;
      }

      if (statement) {
        const rect = statement.getBoundingClientRect();
        const raw = Math.max(0, Math.min(1, (window.innerHeight * 0.82 - rect.top) / (window.innerHeight * 0.7 + rect.height)));
        const wordNodes = statement.querySelectorAll<HTMLElement>("[data-word]");
        wordNodes.forEach((word, index) => {
          const local = Math.max(0.08, Math.min(1, raw * 1.65 - (index / wordNodes.length) * 0.62));
          word.style.opacity = String(local);
          word.style.filter = `blur(${(1 - local) * 4}px)`;
        });
        statement.style.transform = `rotate(${(1 - raw) * 3}deg)`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(renderScroll);
    };

    renderScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.clearTimeout(fallbackTimer);
      if (frame) window.cancelAnimationFrame(frame);
      videoEvents.forEach((event) => video?.removeEventListener(event, unlock));
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-root">
      <a className="skip-link pointer-on" href="#main">跳至主要内容</a>

      <div className="video-bg" aria-hidden="true">
        <video ref={videoRef} muted playsInline preload="auto" tabIndex={-1}>
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="video-scrim" />
        <div className="video-vignette" />
      </div>
      <div className="editorial-grid" aria-hidden="true" />

      <div id="loading" role="status" aria-live="polite">
        <div className="loading-top"><span>庄澍凯 / Portfolio</span><span>Loading motion</span></div>
        <div>
          <div className="loading-lockup">
            <p>Attention<br />into action.</p><span>00 — 01</span>
          </div>
          <div className="loading-line" />
        </div>
      </div>

      <div className="progress-track" aria-hidden="true"><span /></div>

      <header ref={headerRef} className="site-header pointer-on">
        <nav className="nav-inner" aria-label="主导航">
          <a href="#top" className="brand" aria-label="庄澍凯，返回首页"><span className="brand-mark">ZS</span><span className="brand-name">庄澍凯</span></a>
          <div className="desktop-nav">
            <a href="#work">Work</a><a href="#process">Process</a><a href="#archive">Archive</a><a href="#about">About</a>
          </div>
          <a className="contact-link" href="mailto:2496739820@qq.com"><i />联系我</a>
        </nav>
      </header>

      <main id="main" className="main-layer">
        <section id="top" className="hero-section">
          <div className="hero-top container-wide">
            <div className="hero-meta intro" style={{ "--delay": ".05s" } as React.CSSProperties}>
              <span>Content operator / Visual storyteller</span><span>Shenzhen · CN</span>
            </div>
            <h1 className="display-title" aria-label="把画面做成注意力。把注意力变成增长。">
              <span className="intro" style={{ "--delay": ".12s" } as React.CSSProperties}>把画面做成<span className="acid">注意力。</span></span>
              <span className="intro outline-type" style={{ "--delay": ".2s" } as React.CSSProperties}>把注意力变成增长。</span>
            </h1>
          </div>
          <div className="hero-bottom container-wide">
            <p className="hero-description intro" style={{ "--delay": ".31s" } as React.CSSProperties}>庄澍凯，内容运营与视频创作者。从选题、拍摄到投流复盘，让每一帧既有审美，也有结果。</p>
            <a className="hero-cta pointer-on intro" style={{ "--delay": ".39s" } as React.CSSProperties} href="#work"><span>看作品</span><span>↘</span></a>
            <div className="scroll-note intro" style={{ "--delay": ".46s" } as React.CSSProperties}><span>Scroll</span><strong>01 / 05</strong></div>
          </div>
        </section>

        <section id="philosophy" className="philosophy-section">
          <div className="philosophy-grid container-wide">
            <p className="eyebrow acid">02 / Point of view</p>
            <h2 ref={manifestoRef} className="manifesto-copy">
              {words.map((word, index) => <span data-word key={`${word}-${index}`}>{word}</span>)}
            </h2>
          </div>
        </section>

        <section id="work" className="content-section">
          <div className="container-wide">
            <div className="work-heading" data-reveal>
              <p className="eyebrow acid">03 / Selected work</p>
              <div><p className="meta-line">虎派眼镜 · 2024.05 — Now</p><h2>Content<br /><span className="outline-type">→ Conversion</span></h2></div>
              <p className="work-intro">负责小红书主账号全链路运营，并协同员工矩阵与多平台投流，把内容种草延伸到咨询、客资与到店成交。</p>
            </div>
            <div className="metrics" aria-label="核心成果">
              {metrics.map(([value, suffix, note], index) => (
                <div className="metric" data-reveal key={note} style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}>
                  <p>{value}<span>{suffix}</span></p><small>{note}</small>
                </div>
              ))}
            </div>
            <div className="role-grid">
              <p className="eyebrow muted" data-reveal>Role / Scope</p>
              <div className="role-list">
                {roles.map((role, index) => <article data-reveal key={role.title} style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}><h3>{role.title}</h3><p>{role.copy}</p></article>)}
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="content-section no-top-border">
          <div className="container-wide">
            <div className="process-heading" data-reveal>
              <p className="eyebrow acid">04 / The system</p>
              <h2>从第一帧，<br />一直想到最后一步。</h2>
              <p>创意不是增长的对立面。好的流程让二者在同一条时间线上发生。</p>
            </div>
            <div className="process-list">
              {process.map(([number, title, copy], index) => (
                <article className="process-row" data-reveal key={number} style={{ "--delay": `${index * 0.05}s` } as React.CSSProperties}>
                  <span>{number}</span><h3>{title}</h3><p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="archive" className="content-section no-top-border">
          <div className="archive-grid container-wide">
            <div data-reveal><p className="eyebrow acid">Archive / 2022—Now</p><p className="archive-intro">从完整影像制作，到效果素材测试，再到内容增长与门店转化。</p></div>
            <div className="archive-list">
              {archive.map((item, index) => (
                <article data-reveal key={item.company} style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}>
                  <time>{item.date}</time><div><h3>{item.company}</h3><p>{item.role}</p></div><div className="archive-result"><strong>{item.result}</strong>{item.note && <span>{item.note}</span>}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="content-section no-top-border">
          <div className="container-wide">
            <div className="about-grid">
              <div data-reveal><p className="eyebrow acid">05 / About</p><h2>在审美与结果之间，保持判断。</h2></div>
              <div className="about-copy" data-reveal><p>我是庄澍凯，一名在深圳工作的内容运营与影像创作者。计算机应用技术的训练让我习惯结构化思考，影像制作的经历则让我持续关注画面、节奏与人的感受。</p><p>熟悉小红书、抖音与 B 站内容语境，能独立完成从账号定位、脚本策划、拍摄剪辑到投流复盘的完整工作；也在探索 AI 如何拓展内容生产的边界。</p></div>
            </div>
            <div className="capability-grid">
              <p className="eyebrow muted" data-reveal>Capabilities</p>
              <div className="skill-list" data-reveal>{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <div className="education" data-reveal><p className="eyebrow muted">Education</p><h3>深圳信息职业技术学院</h3><p>计算机应用技术 · 2020—2023</p><small>Top 20% · CET-4 · Scholarship</small></div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="container-wide">
          <div className="footer-hero" data-reveal>
            <p className="eyebrow acid">Let&apos;s make it matter</p>
            <div><h2>一起做出<br /><span className="outline-type">值得停下来的内容。</span></h2><a className="pointer-on" href="mailto:2496739820@qq.com">2496739820@qq.com <span>↗</span></a></div>
          </div>
          <div className="footer-links">
            <div className="footer-brand"><h3>庄澍凯</h3><p>内容运营 / 新媒体运营 / 视频剪辑<br />Shenzhen, China</p></div>
            <div><p className="eyebrow muted">Explore</p><a href="#work">Selected work</a><a href="#process">Process</a><a href="#archive">Archive</a></div>
            <div><p className="eyebrow muted">Practice</p><a href="#work">Content</a><a href="#work">Film</a><a href="#process">Growth</a></div>
            <div><p className="eyebrow muted">Focus</p><a href="#work">小红书运营</a><a href="#archive">视频剪辑</a><a href="#about">AI 创作</a></div>
            <div><p className="eyebrow muted">Contact</p><a href="mailto:2496739820@qq.com">Email</a><a href="#top">Back to top ↗</a></div>
          </div>
          <div className="copyright"><p>© {new Date().getFullYear()} Zhuang Shukai. All rights reserved.</p><p>Attention → Trust → Action</p></div>
        </div>
      </footer>
    </div>
  );
}
