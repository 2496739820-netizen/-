import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test, { after, before } from "node:test";

const projectDirectory = fileURLToPath(new URL("..", import.meta.url));
const port = 3400 + (process.pid % 1000);
const baseUrl = `http://127.0.0.1:${port}`;
let server;

before(async () => {
  const output = [];
  server = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)],
    {
      cwd: projectDirectory,
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout.on("data", (chunk) => output.push(chunk.toString()));
  server.stderr.on("data", (chunk) => output.push(chunk.toString()));

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js test server exited early:\n${output.join("")}`);
    }
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Next.js test server did not become ready:\n${output.join("")}`);
});

after(() => {
  server?.kill("SIGTERM");
});

async function render() {
  return fetch(baseUrl, { headers: { accept: "text/html" } });
}

test("server-renders the high-end eyewear new-media portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/i);
  assert.match(html, /庄澍凯｜高端眼镜门店新媒体运营作品集/);
  assert.match(html, /把线上内容/);
  assert.match(html, /接到门店成交/);
  assert.doesNotMatch(html, /把线上内容，|接到门店成交。/);
  assert.match(html, /能力处方/);
  assert.match(html, /内容策划/);
  assert.match(html, /账号运营/);
  assert.match(html, /到店转化/);
  assert.match(html, /影像制作/);
  assert.match(html, /数据复盘/);
  assert.match(html, /平台投流/);
  assert.match(html, /相对能力重心/);
  assert.match(html, /高端眼镜门店/);
  assert.match(html, /粤港澳大湾区/);
  assert.match(html, /求职中/);
  assert.match(html, /虎派眼镜/);

  assert.match(html, /3W\+/);
  assert.match(html, /月均到店新客 GMV/);
  assert.match(html, /8W\+/);
  assert.match(html, /月度最高 GMV/);
  assert.match(html, /60\+/);
  assert.match(html, /月均有效客资/);
  assert.match(html, /30%/);
  assert.match(html, /约贡献门店总业绩/);
  assert.match(html, /具体统计口径可在沟通中进一步说明/);

  assert.match(html, /种草、测评与门店探店/);
  assert.match(html, /员工账号矩阵/);
  assert.match(html, /大众点评、抖音小店与京东/);
  assert.match(html, /需求洞察/);
  assert.match(html, /内容生产/);
  assert.match(html, /投流测试/);
  assert.match(html, /咨询到店/);
  assert.match(html, /800\+/);
  assert.match(html, /CPC 稳定控制在 1 元以内/);

  assert.match(html, /2496739820@qq\.com/);
  assert.match(html, /<button[^>]*class="nav-cta"[^>]*aria-haspopup="dialog"/);
  assert.match(html, /aria-controls="contact-badge-modal"/);
  assert.doesNotMatch(html, /<a[^>]*class="nav-cta"[^>]*mailto:/);
  assert.match(html, /<a href="mailto:2496739820@qq\.com"/);
  assert.match(html, /href="\/zhuang-shukai-resume\.pdf"[^>]*download/);
  assert.match(html, /Zhuang Shukai/);
  assert.match(html, /class="brand-avatar"/);
  assert.match(html, /高端眼镜门店新媒体运营/);
  assert.match(html, /\/og-clean\.png/);

  assert.doesNotMatch(html, /15815347183/);
  assert.doesNotMatch(html, /把画面做成|把注意力变成增长/);
  assert.doesNotMatch(html, /Content operator \/ Visual storyteller/);
  assert.doesNotMatch(html, /src="\/zhuang-shukai-portrait\.jpg"/);
  assert.doesNotMatch(html, /class="brand-mark"[^>]*>ZS/);
  assert.doesNotMatch(html, /一条可验证的门店运营链路/);
  assert.doesNotMatch(html, /用户与产品洞察|账号与流量运营|客资与到店转化/);
  assert.doesNotMatch(html, /把眼镜内容做成信任|把线上流量带到门店/);
  assert.doesNotMatch(html, /既能做内容|也对结果负责/);
  assert.doesNotMatch(html, />既能做内容，</);
  assert.doesNotMatch(html, />也对结果负责。</);
  assert.doesNotMatch(html, /hero\.mp4|class="video-bg"/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);

  assert.ok(html.indexOf("能力处方") < html.indexOf('id="hupai"'));
});

test("server-renders verifiable Hupai Xiaohongshu work evidence", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  const noteUrls = [
    "https://www.xiaohongshu.com/explore/66ab4132000000002701f16e",
    "https://www.xiaohongshu.com/explore/69a16f6f0000000015038c2e",
    "https://www.xiaohongshu.com/explore/6a4a0ea7000000001702df31",
  ];

  assert.match(html, /小红书内容作品/);
  assert.match(html, /虎\.派\.眼\.镜/);
  assert.match(html, /https:\/\/www\.xiaohongshu\.com\/user\/profile\/5fed68f20000000001009f77/);
  assert.match(html, /<span>粉丝<\/span><strong>3604粉丝<\/strong>/);
  assert.doesNotMatch(html, /<span>关注<\/span><strong>3604粉丝<\/strong>/);
  assert.match(html, /3604\s*粉丝/);
  assert.match(html, /1\.7\s*万获赞与收藏/);
  assert.match(html, /公开数据快照日期：2026-07-27/);
  assert.match(html, /林德伯格 全系列干货讲解/);
  assert.match(html, /日系 美系 欧系/);
  assert.match(html, /林德伯格 6537/);
  assert.match(html, /林德伯格 \| 最新全系列干货讲解🔥/);
  assert.match(html, /日系 - 美系 - 欧系，一个多元的眼镜宇宙！/);
  assert.match(html, /客订分享！林德伯格6537\+蔡司鎏金膜~/);
  for (const metric of ["127", "147", "48", "49", "81", "88", "11", "21", "22", "9", "10", "2"]) {
    assert.match(html, new RegExp(`>${metric}<`));
  }
  for (const url of noteUrls) assert.match(html, new RegExp(url));

  assert.match(html, /<video\b[^>]*\bcontrols(?:="")?[^>]*>/i);
  assert.match(html, /<video\b[^>]*\bplaysinline(?:="")?[^>]*>/i);
  assert.match(html, /<video\b[^>]*\bpreload="none"[^>]*>/i);
  assert.match(html, /<video\b[^>]*\bposter="\/hupai\/lindberg-6537-cover\.webp"[^>]*>/i);
  assert.match(html, /<source[^>]*src="\/hupai\/lindberg-6537-preview\.mp4"[^>]*>/i);

  const imageLinks = [...html.matchAll(/<a[^>]*class="hupai-work-image-link"[^>]*href="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(imageLinks, noteUrls.slice(0, 2));
  assert.doesNotMatch(html, new RegExp(`class="hupai-work-image-link"[^>]*href="${noteUrls[2]}"`));
  assert.ok(html.indexOf("上方是可核实的作品样本") < html.indexOf('class="case-list"'));
  assert.ok(html.indexOf("小红书内容作品") < html.indexOf('class="case-list"'));
});

test("ships the verified portfolio assets and removes the unrelated video experience", async () => {
  const [page, layout, css, resume, portrait, avatar, og, contactQr, cardModel, lanyardTexture, cardBase] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/zhuang-shukai-resume.pdf", import.meta.url)),
    readFile(new URL("../public/zhuang-shukai-portrait.jpg", import.meta.url)),
    readFile(new URL("../public/brand-avatar.png", import.meta.url)),
    readFile(new URL("../public/og-clean.png", import.meta.url)),
    readFile(new URL("../public/contact-qr.png", import.meta.url)),
    readFile(new URL("../public/contact-card.glb", import.meta.url)),
    readFile(new URL("../public/contact-lanyard.png", import.meta.url)),
    readFile(new URL("../public/contact-card-base-dark.png", import.meta.url)),
  ]);

  assert.match(page, /高端眼镜门店　新媒体运营/);
  assert.doesNotMatch(page, /高端眼镜门店 · 新媒体运营/);
  assert.match(page, /href="\/zhuang-shukai-resume\.pdf"/);
  assert.match(page, /function CapabilityRadar/);
  assert.match(page, /className="radar-chart"/);
  assert.match(page, /className="hero-proof/);
  assert.match(page, /className="brand-avatar"/);
  assert.doesNotMatch(page, /src="\/zhuang-shukai-portrait\.jpg"/);
  assert.match(page, /\{ id: "top", label: "能力概览" \}/);
  assert.match(page, /内容策划.{0,30}score: 9/s);
  assert.match(page, /平台投流.{0,30}score: 7/s);
  assert.match(page, /data-nav=/);
  assert.match(page, /相对能力重心/);
  assert.doesNotMatch(page, /loading="lazy"/);
  assert.doesNotMatch(page, /hero\.mp4|<video\b|currentTime|\.play\(/i);
  assert.doesNotMatch(page, /15815347183/);

  assert.match(layout, /高端眼镜/);
  assert.match(layout, /眼镜店新媒体运营/);
  assert.match(layout, /小红书运营/);
  assert.match(layout, /到店转化/);
  assert.match(layout, /庄澍凯｜高端眼镜门店新媒体运营/);

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /scroll-behavior: auto/);
  assert.match(css, /\[data-reveal\]/);
  assert.match(css, /aria-current="location"/);
  assert.match(css, /\.hero-main/);
  assert.match(css, /\.radar-card/);
  assert.match(css, /\.radar-chart/);
  assert.match(css, /max-width: 480px/);
  assert.match(css, /@keyframes radar-open/);
  assert.match(css, /\.hero-proof/);
  assert.match(css, /\.brand-avatar/);
  assert.match(css, /url\("\/brand-avatar\.png"\)/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /\.radar-accessible-list \{[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.case-card \{ min-height: 0; border-radius: 22px/);
  assert.match(css, /\.proof-item \{ min-height: 84px/);
  assert.match(css, /\.experience-list article > strong \{[\s\S]*?border-top: 1px solid var\(--line\)/);
  assert.match(css, /--paper: #f4f0e7/);
  assert.match(css, /--surface: #fffdf8/);
  assert.match(css, /--gold: #8a7349/);
  assert.match(css, /\.site-footer \{ background: var\(--paper-deep\)/);
  assert.doesNotMatch(css, /#dfd7c9/);
  assert.match(css, /color-scheme: light/);
  assert.match(css, /Warm optical editorial theme/);
  assert.doesNotMatch(css, /\.hero-portrait/);
  assert.doesNotMatch(css, /linear-gradient\(145deg, #090908/);
  assert.doesNotMatch(css, /\.video-bg|\.video-scrim|\.video-vignette/);

  assert.equal(resume.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.deepEqual([...portrait.subarray(0, 3)], [255, 216, 255]);
  assert.deepEqual([...avatar.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([...og.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([...contactQr.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(cardModel.subarray(0, 4).toString("ascii"), "glTF");
  assert.deepEqual([...lanyardTexture.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([...cardBase.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(og.readUInt32BE(16), 1200);
  assert.equal(og.readUInt32BE(20), 630);

  await access(new URL("../public/zhuang-shukai-resume.pdf", import.meta.url));
  await access(new URL("../public/zhuang-shukai-portrait.jpg", import.meta.url));
  await access(new URL("../public/brand-avatar.png", import.meta.url));
  await access(new URL("../public/contact-qr.png", import.meta.url));
  await access(new URL("../public/contact-card.glb", import.meta.url));
  await access(new URL("../public/contact-lanyard.png", import.meta.url));
  await access(new URL("../public/contact-card-base-dark.png", import.meta.url));
  await assert.rejects(access(new URL("../public/hero.mp4", import.meta.url)));
});

test("ships typed Hupai evidence data and browser-playable source assets", async () => {
  const [data, component, lindbergSeries, universeCover, videoCover, preview] = await Promise.all([
    readFile(new URL("../app/components/hupai-portfolio/hupai-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/hupai-portfolio/HupaiPortfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/hupai/lindberg-series-evidence.png", import.meta.url)),
    readFile(new URL("../public/hupai/eyewear-universe-cover.webp", import.meta.url)),
    readFile(new URL("../public/hupai/lindberg-6537-cover.webp", import.meta.url)),
    readFile(new URL("../public/hupai/lindberg-6537-preview.mp4", import.meta.url)),
  ]);

  assert.match(data, /snapshotDate: "2026-07-27"/);
  assert.match(data, /id: "6a4a0ea7000000001702df31"/);
  assert.match(data, /https:\/\/www\.xiaohongshu\.com\/explore\/66ab4132000000002701f16e/);
  assert.match(component, /preload="none"/);
  assert.match(component, /controls/);
  assert.match(component, /playsInline/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /sizes=\{work\.image\.sizes\}/);
  assert.match(component, /<dl/);
  assert.match(component, /hupai-work-image-link/);
  assert.match(data, /\(max-width: 620px\) calc\(100vw - 24px\)/);

  assert.deepEqual([...lindbergSeries.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(universeCover.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(universeCover.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(videoCover.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(videoCover.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(preview.subarray(4, 8).toString("ascii"), "ftyp");
});

test("styles Hupai work evidence as a responsive editorial proof module", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /\.hupai-evidence\s*\{[\s\S]*?margin-top:\s*clamp\(52px,\s*6vw,\s*88px\)/);
  assert.match(css, /\.hupai-account-evidence\s*\{[\s\S]*?grid-template-columns:/);
  assert.match(css, /\.hupai-work-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1\.35fr\)\s+repeat\(2,\s*minmax\(0,\s*0\.825fr\)\)/);
  assert.match(css, /\.hupai-work-card:first-child\s+\.hupai-work-image-link\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(css, /\.hupai-work-video\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(css, /\.hupai-work-video video\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?aspect-ratio:\s*4\s*\/\s*5;[\s\S]*?object-fit:\s*cover/);
  assert.doesNotMatch(css, /\.hupai-work-card:last-child\s+(?:video|\.hupai-work-video)/);
  assert.match(css, /@media \(max-width: 900px\)\s*\{[\s\S]*?\.hupai-work-card:first-child\s*\{[\s\S]*?grid-column:\s*1\s*\/\s*-1/);
  assert.match(css, /@media \(max-width: 900px\)\s*\{[\s\S]*?\.hupai-work-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media \(max-width: 900px\)\s*\{[\s\S]*?\.hupai-work-card:first-child\s+\.hupai-work-image-link\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(css, /@media \(max-width: 620px\)\s*\{[\s\S]*?\.hupai-work-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width: 620px\)\s*\{[\s\S]*?\.hupai-work-video\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(css, /@media \(max-width: 620px\)\s*\{[\s\S]*?\.hupai-account-evidence\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /@media \(max-width: 620px\)\s*\{[\s\S]*?\.hupai-account-evidence\s*>\s\*:nth-child\(2\)\s*\{[\s\S]*?border-left:\s*0/);
  assert.match(css, /@media \(max-width: 620px\)\s*\{[\s\S]*?\.hupai-account-evidence\s*>\s\*:nth-child\(3\)\s*\{[\s\S]*?border-left:\s*1px\s+solid\s+var\(--line\)/);
  assert.match(css, /@media \(max-width: 620px\)\s*\{[\s\S]*?\.hupai-account-evidence\s*>\s\*:nth-child\(n \+ 2\)\s*\{[\s\S]*?border-top:\s*1px\s+solid\s+var\(--line\)/);
  assert.match(css, /\.hupai-evidence\s+a\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(css, /\.hupai-account-evidence span\s*\{[\s\S]*?(?:font(?:-size)?:[^;}]*?)0\.75rem/);
  assert.match(css, /\.hupai-work-format-tag\s*\{[\s\S]*?font:[^;}]*?0\.75rem/);
  assert.match(css, /\.hupai-work-content\s*>\s*p:first-child\s*\{[\s\S]*?font:[^;}]*?0\.75rem/);
  assert.match(css, /\.hupai-work-metrics dt\s*\{[\s\S]*?font-size:\s*0\.75rem/);
  assert.match(css, /\.hupai-evidence-note\s*\{[\s\S]*?font-size:\s*0\.75rem/);
  assert.match(css, /\.hupai-case-bridge\s*\{[\s\S]*?font-size:\s*0\.75rem/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.hupai-work-image-link:hover\s+img\s*\{[\s\S]*?transform:\s*none/);
  assert.doesNotMatch(css, /#ff2442/i);
});

test("implements the accessible, lazy-loaded physical contact badge", async () => {
  const [page, modal, scene, card, fallback, focusTrap, data, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/contact-badge/ContactBadgeModal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/contact-badge/ContactBadgeScene.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/contact-badge/BadgeCard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/contact-badge/StaticBadgeFallback.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/contact-badge/useFocusTrap.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/contact-badge/contact-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<button[\s\S]*?className="nav-cta"/);
  assert.match(page, /aria-haspopup="dialog"/);
  assert.match(page, /<ContactBadgeModal/);
  assert.match(page, /<a href="mailto:2496739820@qq\.com"/);

  assert.match(modal, /role="dialog"/);
  assert.match(modal, /aria-modal="true"/);
  assert.match(modal, /aria-pressed=\{isFlipped\}/);
  assert.match(modal, /查看联系方式/);
  assert.match(modal, /返回个人简介/);
  assert.match(modal, /import\("\.\/ContactBadgeScene"\)/);
  assert.doesNotMatch(modal, /from "\.\/ContactBadgeScene"/);
  assert.match(modal, /prefers-reduced-motion: reduce/);
  assert.match(modal, /supportsWebGL/);
  assert.match(modal, /isLowPerformanceMobile/);
  assert.doesNotMatch(modal, /getBoundingClientRect\(\)/);
  assert.match(modal, /viewportWidth < 768 \? 0\.5 : 0\.68/);
  assert.match(modal, /const y = -Math\.max\(18, viewportHeight \* 0\.025\)/);
  assert.match(modal, /--contact-anchor-x/);
  assert.match(modal, /anchorXRatio/);
  assert.match(modal, /markSceneReady/);
  assert.match(modal, /工牌内容已显示　拖拽交互加载中/);
  assert.doesNotMatch(modal, /disabled=\{mode === "checking"/);
  assert.match(modal, /onDismiss=\{handleClose\}/);

  assert.match(scene, /useRopeJoint/);
  assert.match(scene, /useSphericalJoint/);
  assert.match(scene, /<RigidBody/);
  assert.equal(scene.match(/useRopeJoint\(/g)?.length, 3);
  assert.doesNotMatch(scene, /node4/);
  assert.match(scene, /angularDamping: 4/);
  assert.match(scene, /linearDamping: 4/);
  assert.match(scene, /canSleep: true/);
  assert.match(scene, /dpr=\{\[1, isMobile \? 1\.5 : 2\]\}/);
  assert.match(scene, /camera=\{\{ position: \[0, 0, 20\], fov: 20/);
  assert.match(scene, /gravity=\{\[0, -22, 0\]\}/);
  assert.match(scene, /timeStep=\{isMobile \? 1 \/ 30 : 1 \/ 60\}/);
  assert.match(scene, /MeshLineGeometry/);
  assert.match(scene, /setPointerCapture/);
  assert.match(scene, /setNextKinematicTranslation/);
  assert.match(scene, /state\.pointer\.x/);
  assert.match(scene, /unproject\(state\.camera\)/);
  assert.match(scene, /state\.camera\.position\.length\(\)/);
  assert.match(scene, /performance\.now\(\) - lastDragAt\.current > 450/);
  assert.match(scene, /window\.setTimeout\(onSceneError, 45000\)/);
  assert.match(scene, /onReady\(\)/);
  assert.match(scene, /anchorXRatio/);
  assert.match(scene, /CatmullRomCurve3/);
  assert.match(scene, /curve\.getPoints/);
  assert.match(scene, /cardQuaternion\.set\(cardRotation\.x, cardRotation\.y, cardRotation\.z, cardRotation\.w\)/);
  assert.match(scene, /attachmentOffset\.set\(0, 1\.45, 0\)\.applyQuaternion\(cardQuaternion\)/);
  assert.match(scene, /\.add\(attachmentOffset\)/);
  assert.match(scene, /targets\[1\]\.lerpVectors\(targets\[0\], targets\[3\], 0\.34\)/);
  assert.match(scene, /<LanyardLine anchor=\{anchor\} card=\{card\} \/>/);
  assert.match(scene, /lineWidth: 0\.48/);
  assert.match(scene, /createPersonalBandTexture/);
  assert.match(scene, /ZHUANG SHUKAI/);
  assert.doesNotMatch(scene, /useTexture\("\/contact-lanyard\.png"\)/);
  assert.match(scene, /THREE\.RepeatWrapping/);
  assert.match(scene, /useMap: bandTexture \? 1 : 0/);
  assert.match(scene, /repeat: new THREE\.Vector2\(-2\.8, 1\)/);
  assert.equal(scene.match(/\[0, 0, 0\], 1\]\);/g)?.length, 3);
  assert.match(scene, /useSphericalJoint\(node3, card, \[\[0, 0, 0\], \[0, 1\.45, 0\]\]\)/);
  assert.match(scene, /rotation\.y \* 0\.25/);
  assert.match(scene, /swingDirection \* 0\.04/);
  assert.match(scene, /swingDirection \* 0\.2/);
  assert.match(scene, /swingDirection \* 0\.32/);
  assert.match(scene, /const initialCardY = anchorY - 4/);
  assert.match(scene, /position=\{\[initialCardX, initialCardY, 0\]\}/);
  assert.match(scene, /<Physics gravity=\{\[0, -22, 0\]\}/);
  assert.match(scene, /curve\.getPoints\(size\.width < 768 \? 16 : 32\)/);
  assert.match(scene, /CuboidCollider args=\{\[0\.8, 1\.125, 0\.01\]\}/);
  assert.match(scene, /<Environment blur=\{0\.75\}>/);
  assert.equal(scene.match(/<Lightformer/g)?.length, 4);

  assert.match(card, /waitForFontsWithoutBlockingTexture/);
  assert.match(card, /FONT_WAIT_MS = 1200/);
  assert.match(card, /ASSET_TIMEOUT_MS = 30000/);
  assert.match(card, /onTextureReady/);
  assert.match(card, /key=\{texture\?\.uuid \?\? "badge-texture-loading"\}/);
  assert.match(card, /map=\{texture \?\? undefined\}/);
  assert.match(card, /CanvasTexture/);
  assert.match(card, /rotation\.y/);
  assert.match(card, /dispose\(\)/);
  assert.match(card, /CONTACT_AVATAR_SOURCE/);
  assert.match(card, /drawCoverImage/);
  assert.match(card, /useGLTF\(CARD_MODEL_SOURCE\)/);
  assert.match(card, /CARD_MODEL_SOURCE = "\/contact-card\.glb"/);
  assert.match(card, /CARD_BASE_SOURCE = "\/contact-card-base-dark\.png"/);
  assert.match(card, /scale=\{isMobile \? 2\.6 : 2\.35\}/);
  assert.match(card, /position=\{\[0, -1\.2, -0\.05\]\}/);
  assert.match(card, /model\.nodes\.card\.geometry/);
  assert.match(card, /model\.nodes\.clip\.geometry/);
  assert.match(card, /model\.nodes\.clamp\.geometry/);
  assert.match(card, /clearcoat=\{isMobile \? 0 : 0\.65\}/);
  assert.match(card, /clearcoatRoughness=\{0\.22\}/);
  assert.match(card, /roughness=\{0\.72\}/);
  assert.match(card, /metalness=\{0\.04\}/);
  assert.match(card, /created\.anisotropy = 16/);
  assert.match(card, /CONTACT_PHONE/);
  assert.match(card, /CONTACT_QR_SOURCE/);
  assert.match(card, /Reserve the top-center attachment zone/);
  assert.match(card, /drawCoverImage\(context, avatar, 48, 142, 168, 224, 14\)/);
  assert.match(card, /context\.fillText\("高端眼镜门店", 244, 170\)/);
  assert.match(card, /context\.fillText\("新媒体运营", 244, 202\)/);
  assert.match(card, /context\.fillText\("庄澍凯", 244, 260\)/);
  assert.doesNotMatch(card, /RoundedBox|ringTarget|boxGeometry|torusGeometry|map-anisotropy/);
  assert.doesNotMatch(card, /CONTACT_RESULTS|虎派结果/);

  assert.match(fallback, /data-contact-badge="static"/);
  assert.match(fallback, /className="badge-avatar"/);
  assert.match(fallback, /alt="庄澍凯个人照片"/);
  assert.match(fallback, /className="badge-role"/);
  assert.match(fallback, /高端眼镜门店<br \/>新媒体运营/);
  assert.match(fallback, /className="badge-name"/);
  assert.match(fallback, /className="badge-name-en"/);
  assert.match(fallback, /className="badge-region"/);
  assert.match(fallback, /className="badge-divider"/);
  assert.match(fallback, /CONTACT_PHONE/);
  assert.match(fallback, /CONTACT_TEL/);
  assert.match(fallback, /ZHUANG SHUKAI · ZHUANG SHUKAI/);
  assert.doesNotMatch(fallback, /CONTACT_RESULTS|badge-results|虎派结果/);
  assert.match(data, /CONTACT_QR_SOURCE = "\/contact-qr\.png"/);
  assert.match(data, /CONTACT_AVATAR_SOURCE = "\/zhuang-shukai-portrait\.jpg"/);
  assert.match(data, /CONTACT_PHONE = "158 1534 7183"/);
  assert.match(data, /CONTACT_TEL = "tel:15815347183"/);
  assert.match(data, /CONTACT_QR_FALLBACK_VALUE = CONTACT_MAILTO/);
  assert.match(data, /width: 768/);
  assert.doesNotMatch(data, /CONTACT_RESULTS|月均有效客资|月均到店新客 GMV|月度最高 GMV|约贡献门店总业绩/);
  assert.match(`${data}${card}${fallback}`, /15815347183/);

  assert.match(focusTrap, /event\.key === "Escape"/);
  assert.match(focusTrap, /event\.key !== "Tab"/);
  assert.match(focusTrap, /document\.body\.style\.overflow = "hidden"/);
  assert.match(focusTrap, /returnFocusElement\?\.focus\(\)/);
  assert.match(css, /\.contact-modal-backdrop/);
  assert.match(css, /min-height: 50px/);
  assert.match(css, /background: rgba\(38, 35, 30, 0\.48\)/);
  assert.match(css, /\.badge-flip-button \{ min-width: min\(220px, 100%\); min-height: 52px/);
  assert.match(css, /\.badge-capabilities \{ grid-template-columns: repeat\(2, 1fr\)/);
  assert.match(css, /touch-action: none/);
  assert.match(css, /background: rgba\(46, 42, 35, 0\.1\)/);
  assert.match(css, /left: var\(--contact-card-x\)/);
  assert.match(css, /var\(--contact-anchor-x\) - var\(--contact-card-x\)/);
  assert.match(css, /\.static-lanyard em/);
  assert.match(css, /writing-mode: vertical-rl/);
  assert.doesNotMatch(css, /url\("\/contact-lanyard\.png"\)/);
  assert.match(css, /\.badge-contact-grid/);
  assert.match(css, /width: min\(28vw, 330px, 48vh\)/);
  assert.match(css, /\.badge-contact-grid \{[^}]*grid-template-columns: 1fr/);
  assert.match(css, /\.badge-avatar \{[^}]*aspect-ratio: 3 \/ 4/);
  assert.match(css, /\.badge-role \{[^}]*color: #d1b681/);
  assert.match(css, /\.badge-contact-grid strong \{[^}]*font: 600 1\.18rem/);
  assert.match(css, /\.badge-capabilities \{[^}]*grid-template-columns: repeat\(2, 1fr\)/);
  assert.match(css, /\.badge-capabilities span \{[^}]*font-size: 0\.68rem/);
  assert.match(css, /\.badge-face \{[^}]*background: #050505/);
  assert.match(css, /@keyframes static-badge-drop/);
  assert.match(css, /\.badge-drag-hint\.is-hidden/);

  const dependencies = JSON.parse(packageJson).dependencies;
  for (const dependency of ["three", "@react-three/fiber", "@react-three/drei", "@react-three/rapier", "meshline", "qrcode"]) {
    assert.ok(dependencies[dependency], `${dependency} should be installed`);
  }
  const packageData = JSON.parse(packageJson);
  assert.equal(packageData.scripts.build, "next build");
  assert.equal(packageData.scripts.dev, "next dev");
  assert.equal(packageData.scripts.start, "next start");
  assert.equal(packageData.devDependencies.vinext, undefined);
  assert.equal(packageData.devDependencies.wrangler, undefined);
});
