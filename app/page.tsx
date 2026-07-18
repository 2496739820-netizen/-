"use client";

import { useEffect, useRef } from "react";

const metrics = [
  { value: "3W+", label: "月均到店新客 GMV" },
  { value: "8W+", label: "月度最高 GMV" },
  { value: "60+", label: "月均有效客资" },
  { value: "30%", label: "约贡献门店总业绩" },
];

const capabilitySteps = [
  {
    number: "01",
    title: "用户与产品洞察",
    note: "需求 × 卖点 × 平台趋势",
  },
  {
    number: "02",
    title: "内容生产",
    note: "选题脚本 · 拍摄剪辑发布",
  },
  {
    number: "03",
    title: "账号与流量运营",
    note: "主号矩阵 · 投流测试",
  },
  {
    number: "04",
    title: "客资与到店转化",
    note: "咨询承接 · 到店成交",
  },
];

const capabilityProofs = [
  { value: "60+", label: "月均有效客资" },
  { value: "3W+", label: "月均到店新客 GMV" },
  { value: "8W+", label: "月度最高 GMV" },
  { value: "30%", label: "约贡献门店总业绩" },
];

const caseStories = [
  {
    number: "01",
    kicker: "内容种草",
    title: "把眼镜卖点，翻译成用户愿意停留的内容。",
    copy: "围绕产品卖点、用户需求与平台趋势，策划种草、测评与门店探店内容；独立覆盖选题、脚本、拍摄、发布及复盘。",
    tags: ["选题策划", "脚本拍摄", "发布复盘"],
  },
  {
    number: "02",
    kicker: "账号矩阵",
    title: "从一个主账号，扩展为持续发生的品牌触点。",
    copy: "搭建并维护员工账号矩阵，制定账号内容方向与发布节奏，协同提升品牌内容覆盖率，扩大门店自然曝光与客资来源。",
    tags: ["账号定位", "员工矩阵", "自然获客"],
  },
  {
    number: "03",
    kicker: "到店转化",
    title: "让内容继续走向咨询、客资与门店成交。",
    copy: "独立负责大众点评、抖音小店与京东等线上平台运营及投流，通过页面优化、活动配置、广告测试和数据分析持续优化转化。",
    tags: ["平台投流", "数据分析", "到店转化"],
  },
];

const process = [
  {
    number: "01",
    title: "需求洞察",
    copy: "连接用户需求、眼镜产品卖点与平台内容趋势，找到值得被放大的表达角度。",
  },
  {
    number: "02",
    title: "内容生产",
    copy: "完成选题、脚本、拍摄、剪辑与发布，让产品专业度获得清晰而有审美的表达。",
  },
  {
    number: "03",
    title: "投流测试",
    copy: "围绕内容与页面进行测试，通过数据复盘筛选更有效的创意、渠道与承接方式。",
  },
  {
    number: "04",
    title: "咨询到店",
    copy: "把曝光继续引向咨询、有效客资、到店与 GMV，并用业务结果校准下一轮内容。",
  },
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
  { id: "top", label: "关于我" },
  { id: "hupai", label: "虎派经历" },
  { id: "method", label: "运营方法" },
  { id: "experience", label: "过往经历" },
];

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const header = headerRef.current;
    const hero = root?.querySelector<HTMLElement>(".hero-section");
    if (!root) return;

    root.dataset.ready = "true";

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "-48px 0px", threshold: 0.08 },
    );

    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      revealObserver.observe(element);
    });

    const navLinks = root.querySelectorAll<HTMLAnchorElement>("[data-nav]");
    const navSections = navigation
      .map(({ id }) => ({ id, element: document.getElementById(id) }))
      .filter(
        (section): section is { id: string; element: HTMLElement } =>
          section.element !== null,
      );

    let frame = 0;
    let pointerFrame = 0;
    const renderScroll = () => {
      frame = 0;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      root.style.setProperty("--scroll-progress", `${progress * 100}%`);
      header?.classList.toggle("is-scrolled", window.scrollY > 28);

      const readingLine = window.scrollY + window.innerHeight * 0.34;
      let activeSection = "";
      navSections.forEach(({ id, element }) => {
        if (readingLine >= element.offsetTop) activeSection = id;
      });

      navLinks.forEach((link) => {
        const isActive = link.dataset.nav === activeSection;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(renderScroll);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!hero || event.pointerType === "touch") return;
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      pointerFrame = window.requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
        hero.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
      });
    };

    renderScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    hero?.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      hero?.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="site-root">
      <a className="skip-link" href="#main">
        跳至主要内容
      </a>

      <div className="progress-track" aria-hidden="true">
        <span />
      </div>

      <header ref={headerRef} className="site-header">
        <nav className="nav-inner" aria-label="主导航">
          <a href="#top" className="brand" aria-label="庄澍凯，返回首页">
            <span className="brand-avatar" aria-hidden="true" />
            <span className="brand-name">庄澍凯</span>
          </a>
          <div className="desktop-nav">
            {navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`} data-nav={item.id}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="nav-cta" href="mailto:2496739820@qq.com">
            <i aria-hidden="true" /> 联系我
          </a>
        </nav>
      </header>

      <main id="main">
        <section id="top" className="hero-section">
          <div className="lens-stage" aria-hidden="true">
            <span className="lens lens-left" />
            <span className="lens lens-right" />
            <span className="lens-bridge" />
          </div>

          <div className="hero-inner container-wide">
            <div className="hero-kicker intro" style={{ "--delay": ".04s" } as React.CSSProperties}>
              <span>Portfolio / 2026</span>
              <span>High-end eyewear / New media</span>
            </div>

            <div className="hero-main">
              <aside
                className="hero-identity intro"
                style={{ "--delay": ".1s" } as React.CSSProperties}
                aria-label="庄澍凯个人简介"
              >
                <div className="hero-nameplate">
                  <div className="hero-nameplate-top">
                    <span>Profile / 01</span>
                    <span>New media operator</span>
                  </div>
                  <h2>庄澍凯</h2>
                  <p>Zhuang Shukai</p>
                </div>

                <div className="hero-identity-copy">
                  <p className="hero-role">小红书运营 / 新媒体运营</p>
                  <p className="hero-intro">
                    我是庄澍凯，具备小红书账号运营、内容策划、拍摄剪辑、平台投流与到店转化经验。
                  </p>
                  <dl className="hero-facts">
                    <div>
                      <dt>求职方向</dt>
                      <dd>高端眼镜门店新媒体运营</dd>
                    </div>
                    <div>
                      <dt>目标地区</dt>
                      <dd>粤港澳大湾区</dd>
                    </div>
                  </dl>
                </div>
              </aside>

              <div className="hero-message">
                <p className="eyebrow gold intro" style={{ "--delay": ".16s" } as React.CSSProperties}>
                  高端眼镜门店 · 新媒体运营
                </p>

                <div className="hero-capability intro" style={{ "--delay": ".22s" } as React.CSSProperties}>
                  <h1 className="hero-system-title">一条可验证的门店运营链路</h1>

                  <div className="capability-map" aria-label="高端眼镜门店新媒体运营能力结构与结果证明">
                    <ol className="capability-steps">
                      {capabilitySteps.map((step, index) => (
                        <li className="capability-step" key={step.number}>
                          <div className="capability-step-head">
                            <span>{step.number}</span>
                            {index < capabilitySteps.length - 1 && (
                              <i aria-hidden="true">→</i>
                            )}
                          </div>
                          <p className="capability-step-title">{step.title}</p>
                          <p className="capability-step-note">{step.note}</p>
                        </li>
                      ))}
                    </ol>

                    <div className="capability-proof" aria-label="虎派眼镜核心结果">
                      {capabilityProofs.map((proof) => (
                        <div className="capability-proof-item" key={proof.label}>
                          <strong>{proof.value}</strong>
                          <span>{proof.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hero-message-footer intro" style={{ "--delay": ".36s" } as React.CSSProperties}>
                  <div className="hero-support-copy">
                    <p className="hero-principle">
                      <span>把眼镜内容做成信任</span>
                      <span>把线上流量带到门店</span>
                    </p>
                    <p>
                      从用户需求与产品卖点出发，完成内容生产、账号矩阵、投流测试与到店转化。
                    </p>
                  </div>
                  <div className="hero-actions">
                    <a className="button button-primary" href="#hupai">
                      查看虎派经历 <span aria-hidden="true">↘</span>
                    </a>
                    <a
                      className="button button-quiet"
                      href="/zhuang-shukai-resume.pdf"
                      download
                    >
                      下载简历 <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-footline intro" style={{ "--delay": ".42s" } as React.CSSProperties}>
              <span className="hero-status">
                <i aria-hidden="true" /> 粤港澳大湾区 · 求职中
              </span>
              <a href="#hupai">
                向下了解我的经历 <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section id="hupai" className="flagship-section section-shell">
          <div className="container-wide">
            <div className="section-heading flagship-heading" data-reveal>
              <div>
                <p className="eyebrow gold">01 / Flagship experience</p>
                <p className="section-index">2024.05 - 至今</p>
              </div>
              <div>
                <p className="role-label">小红书运营 / 新媒体运营</p>
                <h2>虎派眼镜</h2>
              </div>
              <p className="section-summary">
                负责小红书主账号全链路运营，并协同员工矩阵与多平台投流，把内容种草延伸到咨询、客资与到店成交。
              </p>
            </div>

            <div className="metrics-grid" aria-label="虎派眼镜核心成果">
              {metrics.map((metric, index) => (
                <article
                  className="metric-card"
                  data-reveal
                  key={metric.label}
                  style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}
                >
                  <span className="metric-index">0{index + 1}</span>
                  <p>{metric.value}</p>
                  <h3>{metric.label}</h3>
                </article>
              ))}
            </div>
            <p className="metrics-note" data-reveal>
              <span>数据说明</span>
              以上为简历中的工作成果汇总，具体统计口径可在沟通中进一步说明。
            </p>

            <div className="case-intro" data-reveal>
              <p className="eyebrow muted">Role / Scope</p>
              <h3>一份工作，三条彼此连接的运营链路。</h3>
              <p>
                不是把内容、平台和成交拆成孤立任务，而是让它们在同一条用户路径上持续发生作用。
              </p>
            </div>

            <div className="case-list">
              {caseStories.map((story, index) => (
                <article
                  className="case-card"
                  data-reveal
                  key={story.number}
                  style={{ "--delay": `${index * 0.07}s` } as React.CSSProperties}
                >
                  <div className="case-card-top">
                    <span>{story.number}</span>
                    <p>{story.kicker}</p>
                  </div>
                  <h3>{story.title}</h3>
                  <p className="case-copy">{story.copy}</p>
                  <div className="case-tags" aria-label={`${story.kicker}能力标签`}>
                    {story.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="method" className="method-section section-shell">
          <div className="container-wide">
            <div className="method-heading" data-reveal>
              <p className="eyebrow gold">02 / Operating system</p>
              <h2>
                从第一条内容
                <br />
                一直想到最后一次到店
              </h2>
              <p>
                高客单门店需要的不只是曝光，而是用专业表达建立信任，再用运营承接每一次行动。
              </p>
            </div>
            <div className="process-grid">
              {process.map((item, index) => (
                <article
                  className="process-card"
                  data-reveal
                  key={item.number}
                  style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}
                >
                  <div>
                    <span>{item.number}</span>
                    {index < process.length - 1 && <i aria-hidden="true">→</i>}
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="experience-section section-shell">
          <div className="container-wide">
            <div className="experience-layout">
              <div className="experience-side" data-reveal>
                <p className="eyebrow gold">03 / Foundation</p>
                <h2>影像制作与效果素材 构成运营之前的基本功</h2>
                <p>
                  从完整影像制作，到效果素材测试，再到门店内容增长。过往经历让内容审美、制作效率与数据意识成为同一套能力。
                </p>
              </div>

              <div className="experience-list">
                {experience.map((item, index) => (
                  <article
                    data-reveal
                    key={item.company}
                    style={{ "--delay": `${index * 0.06}s` } as React.CSSProperties}
                  >
                    <div className="experience-meta">
                      <time>{item.date}</time>
                      <span>{item.role}</span>
                    </div>
                    <h3>{item.company}</h3>
                    <p>{item.copy}</p>
                    <strong>{item.proof}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-section section-shell">
          <div className="container-wide">
            <div className="about-heading" data-reveal>
              <p className="eyebrow gold">04 / Capabilities</p>
              <h2>能力与教育背景</h2>
              <p>
                内容制作是基本功，数据复盘和到店转化是判断内容价值的方式。
              </p>
            </div>

            <div className="about-details">
              <div className="skills-block" data-reveal>
                <p className="eyebrow muted">Capabilities</p>
                <div className="skill-list">
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
              <div className="education-block" data-reveal>
                <p className="eyebrow muted">Education</p>
                <h3>深圳信息职业技术学院</h3>
                <p>计算机应用技术 · 大专 · 2020 - 2023</p>
                <small>专业前 20% · 英语四级 · 学院三等奖学金</small>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container-wide">
          <div className="footer-main" data-reveal>
            <p className="eyebrow gold">Open to opportunities</p>
            <h2>
              让下一副好眼镜
              <br />
              被更多合适的人看见
            </h2>
            <div className="footer-actions">
              <a href="mailto:2496739820@qq.com">
                2496739820@qq.com <span aria-hidden="true">↗</span>
              </a>
              <a href="/zhuang-shukai-resume.pdf" download>
                下载完整简历 <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              <strong>庄澍凯</strong>
              <p>高端眼镜门店 / 新媒体运营</p>
            </div>
            <p>目标地区：粤港澳大湾区</p>
            <p>© {new Date().getFullYear()} Zhuang Shukai</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
