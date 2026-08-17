"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CapabilityRadar } from "./components/CapabilityRadar";
import { ContactBadgeModal } from "./components/contact-badge/ContactBadgeModal";
import { HupaiPortfolio } from "./components/hupai-portfolio/HupaiPortfolio";

const metrics = [
  { value: "3W+", label: "月均到店新客 GMV" },
  { value: "8W+", label: "月度最高 GMV" },
  { value: "60+", label: "月均有效客资" },
  { value: "30%", label: "约贡献门店总业绩" },
];

const caseStories = [
  {
    number: "01",
    kicker: "内容种草",
    title: "把专业卖点翻译成用户愿意停留的内容",
    copy: "围绕产品卖点、用户需求与平台趋势，策划种草、测评与门店探店内容；独立覆盖选题、脚本、拍摄、发布及复盘。",
    tags: ["选题策划", "脚本拍摄", "发布复盘"],
  },
  {
    number: "02",
    kicker: "账号矩阵",
    title: "让一个主账号扩展为持续发生的品牌触点",
    copy: "搭建并维护员工账号矩阵，制定账号内容方向与发布节奏，协同提升品牌内容覆盖率，扩大门店自然曝光与客资来源。",
    tags: ["账号定位", "员工矩阵", "自然获客"],
  },
  {
    number: "03",
    kicker: "到店转化",
    title: "让线上内容继续走向咨询与门店成交",
    copy: "独立负责大众点评、抖音小店与京东等线上平台运营及投流，通过页面优化、活动配置、广告测试和数据分析持续优化转化。",
    tags: ["平台投流", "数据分析", "到店转化"],
  },
];

const process = [
  { number: "01", title: "需求洞察", copy: "用户需求 × 产品卖点 × 平台趋势" },
  { number: "02", title: "内容生产", copy: "选题、脚本、拍摄、剪辑与发布" },
  { number: "03", title: "投流测试", copy: "素材测试、页面优化与数据复盘" },
  { number: "04", title: "咨询到店", copy: "承接客资，并以成交校准内容" },
];

const experience = [
  {
    date: "2023.11 - 2024.03",
    company: "氦心科技（深圳）有限公司",
    role: "视频剪辑",
    copy: "追踪热点与热门人物话题，基于现有素材开展多维度测试，筛选优质脚本与剪辑方向。",
    proof: "单月优质素材最高转化 800+ / CPC 稳定控制在 1 元以内",
  },
  {
    date: "2023.07 - 2023.10",
    company: "深圳市欣睿网络传媒有限公司",
    role: "剪辑",
    copy: "负责产品纯展、模特外拍、视频剪辑、调色、音乐音效与基础包装，并通过数据复盘持续优化内容表现。",
    proof: "产品视觉 / 外拍 / 剪辑包装 / 数据复盘",
  },
  {
    date: "2022.12 - 2023.06",
    company: "深圳市瓜皮传媒有限公司",
    role: "剪辑师",
    copy: "独立完成拍摄、布光、素材管理、剪辑、基础调色及声音设计，并参与账号运营与多平台矩阵分发。",
    proof: "完整制作流程 / 口播 / 工厂 / 访谈",
  },
];

const skills = [
  "小红书运营",
  "内容策划",
  "账号矩阵",
  "拍摄剪辑",
  "数据复盘",
  "平台投流",
  "到店转化",
  "AI 辅助创作",
];

const navigation = [
  { id: "top", label: "能力概览" },
  { id: "hupai", label: "虎派经历" },
  { id: "method", label: "运营方法" },
  { id: "experience", label: "过往经历" },
];

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const closeContact = useCallback(() => setContactOpen(false), []);

  useEffect(() => {
    const root = rootRef.current;
    const header = headerRef.current;
    if (!root) return;

    root.dataset.ready = "true";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "-40px 0px", threshold: 0.08 },
    );

    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      if (reduceMotion) element.classList.add("is-visible");
      else revealObserver.observe(element);
    });

    const navLinks = root.querySelectorAll<HTMLAnchorElement>("[data-nav]");
    const navSections = navigation
      .map(({ id }) => ({ id, element: document.getElementById(id) }))
      .filter(
        (section): section is { id: string; element: HTMLElement } =>
          section.element !== null,
      );

    let frame = 0;
    const renderScroll = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--scroll-progress", `${Math.min(1, window.scrollY / maxScroll) * 100}%`);
      header?.classList.toggle("is-scrolled", window.scrollY > 20);

      const readingLine = window.scrollY + window.innerHeight * 0.3;
      let activeSection = "top";
      navSections.forEach(({ id, element }) => {
        if (readingLine >= element.offsetTop) activeSection = id;
      });
      navLinks.forEach((link) => {
        const active = link.dataset.nav === activeSection;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(renderScroll);
    };

    renderScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-root">
      <a className="skip-link" href="#main">跳至主要内容</a>
      <div className="progress-track" aria-hidden="true"><span /></div>

      <header ref={headerRef} className="site-header">
        <nav className="nav-inner" aria-label="主导航">
          <a href="#top" className="brand" aria-label="庄澍凯，返回首页">
            <span className="brand-avatar" aria-hidden="true" />
            <span className="brand-copy"><strong>庄澍凯</strong><small>New Media Operator</small></span>
          </a>
          <div className="desktop-nav">
            {navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`} data-nav={item.id}>{item.label}</a>
            ))}
          </div>
          <button
            ref={contactTriggerRef}
            className="nav-cta"
            type="button"
            aria-haspopup="dialog"
            aria-controls="contact-badge-modal"
            aria-expanded={contactOpen}
            onClick={() => { if (!contactOpen) setContactOpen(true); }}
          >
            <i aria-hidden="true" />联系我
          </button>
        </nav>
      </header>

      <main id="main">
        <section id="top" className="hero-section">
          <div className="hero-inner container-wide">
            <div className="hero-main">
              <div className="hero-copy intro" style={{ "--delay": ".04s" } as React.CSSProperties}>
                <p className="eyebrow">高端眼镜门店　新媒体运营</p>
                <p className="hero-name">庄澍凯 <span>Zhuang Shukai</span></p>
                <h1>把线上内容<br />接到门店成交</h1>
                <p className="hero-summary">
                  从内容策划、拍摄剪辑到账号运营与投流复盘，让每一次曝光都更接近有效咨询与到店。
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#hupai">查看虎派经历 <span aria-hidden="true">↘</span></a>
                  <a className="button button-secondary" href="/zhuang-shukai-resume.pdf" download>下载简历 <span aria-hidden="true">↓</span></a>
                </div>
                <p className="hero-status"><i aria-hidden="true" />粤港澳大湾区　求职中</p>
              </div>

              <div className="intro" style={{ "--delay": ".12s" } as React.CSSProperties}>
                <CapabilityRadar />
              </div>
            </div>

            <div className="hero-proof intro" style={{ "--delay": ".2s" } as React.CSSProperties} aria-label="虎派眼镜核心成果">
              <div className="proof-intro"><span>虎派眼镜</span><p>真实业务结果</p></div>
              {metrics.map((metric) => (
                <div className="proof-item" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section id="hupai" className="flagship-section section-shell">
          <div className="container-wide">
            <HupaiPortfolio />
            <div className="hupai-case-bridge" data-reveal>
              <p>上方是可核实的作品样本</p>
              <p>下方是可复用的运营方法</p>
            </div>

            <div className="case-list">
              {caseStories.map((story, index) => (
                <article className="case-card" data-reveal key={story.number} style={{ "--delay": `${index * 0.07}s` } as React.CSSProperties}>
                  <div className="case-card-top"><span>{story.number}</span><p>{story.kicker}</p></div>
                  <h3>{story.title}</h3>
                  <p className="case-copy">{story.copy}</p>
                  <div className="case-tags" aria-label={`${story.kicker}能力标签`}>
                    {story.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </article>
              ))}
            </div>
            <p className="data-note" data-reveal>页面数据来自简历工作成果汇总，具体统计口径可在沟通中进一步说明。</p>
          </div>
        </section>

        <section id="method" className="method-section section-shell">
          <div className="container-wide method-layout">
            <div className="method-heading" data-reveal>
              <p className="eyebrow">02 / Operating method</p>
              <h2>内容不是终点<br />到店才是闭环</h2>
              <p>高客单门店需要用专业表达建立信任，再用运营承接用户的下一步行动。</p>
            </div>
            <ol className="process-list">
              {process.map((item, index) => (
                <li data-reveal key={item.number} style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}>
                  <span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div><i aria-hidden="true">↗</i>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="experience" className="experience-section section-shell">
          <div className="container-wide">
            <div className="experience-heading" data-reveal>
              <div><p className="eyebrow">03 / Foundation</p><h2>运营之前<br />先把内容做好</h2></div>
              <p>三段影像与效果素材经历，让内容审美、制作效率和数据意识成为同一套基本功。</p>
            </div>
            <div className="experience-list">
              {experience.map((item, index) => (
                <article data-reveal key={item.company} style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}>
                  <time>{item.date}</time>
                  <div className="experience-company"><span>{item.role}</span><h3>{item.company}</h3></div>
                  <p>{item.copy}</p>
                  <strong>{item.proof}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section section-shell">
          <div className="container-wide about-layout">
            <div className="about-heading" data-reveal><p className="eyebrow">04 / Profile</p><h2>能力与背景</h2></div>
            <div className="skills-block" data-reveal>
              <p className="block-label">能力关键词</p>
              <div className="skill-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </div>
            <div className="education-block" data-reveal>
              <p className="block-label">教育经历</p>
              <h3>深圳信息职业技术学院</h3>
              <p>计算机应用技术 · 大专 · 2020 — 2023</p>
              <small>专业前 20% · 英语四级 · 学院三等奖学金</small>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container-wide footer-layout">
          <div data-reveal><p className="eyebrow">Open to opportunities</p><h2>期待下一次<br />把好内容做成好生意</h2></div>
          <div className="footer-contact" data-reveal>
            <p>高端眼镜门店　新媒体运营</p>
            <a href="mailto:2496739820@qq.com">2496739820@qq.com <span aria-hidden="true">↗</span></a>
            <a href="/zhuang-shukai-resume.pdf" download>下载完整简历 <span aria-hidden="true">↓</span></a>
          </div>
          <div className="footer-bottom"><strong>庄澍凯</strong><span>目标地区：粤港澳大湾区</span><span>© {new Date().getFullYear()} Zhuang Shukai</span></div>
        </div>
      </footer>
      <ContactBadgeModal open={contactOpen} onClose={closeContact} triggerRef={contactTriggerRef} />
    </div>
  );
}
