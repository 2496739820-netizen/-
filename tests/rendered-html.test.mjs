import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
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
  assert.doesNotMatch(html, /<video\b|hero\.mp4/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);

  assert.ok(html.indexOf("能力处方") < html.indexOf('id="hupai"'));
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
  assert.match(modal, /getBoundingClientRect\(\)/);
  assert.match(modal, /--contact-anchor-x/);
  assert.match(modal, /anchorXRatio/);
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
  assert.match(scene, /gravity=\{\[0, -40, 0\]\}/);
  assert.match(scene, /timeStep=\{isMobile \? 1 \/ 30 : 1 \/ 60\}/);
  assert.match(scene, /MeshLineGeometry/);
  assert.match(scene, /setPointerCapture/);
  assert.match(scene, /setNextKinematicTranslation/);
  assert.match(scene, /state\.pointer\.x/);
  assert.match(scene, /unproject\(state\.camera\)/);
  assert.match(scene, /state\.camera\.position\.length\(\)/);
  assert.match(scene, /performance\.now\(\) - lastDragAt\.current > 450/);
  assert.match(scene, /window\.setTimeout\(onSceneError, 45000\)/);
  assert.match(scene, /!worldReady &&/);
  assert.match(scene, /anchorXRatio/);
  assert.match(scene, /CatmullRomCurve3/);
  assert.match(scene, /curve\.getPoints/);
  assert.match(scene, /lineWidth: 1/);
  assert.match(scene, /useTexture\("\/contact-lanyard\.png"\)/);
  assert.doesNotMatch(scene, /createBandTexture/);
  assert.match(scene, /THREE\.RepeatWrapping/);
  assert.match(scene, /useMap: 1/);
  assert.match(scene, /repeat: new THREE\.Vector2\(-4, 1\)/);
  assert.equal(scene.match(/\[0, 0, 0\], 1\]\);/g)?.length, 3);
  assert.match(scene, /useSphericalJoint\(node3, card, \[\[0, 0, 0\], \[0, 1\.45, 0\]\]\)/);
  assert.match(scene, /rotation\.y \* 0\.25/);
  assert.match(scene, /swingDirection \* 0\.5/);
  assert.match(scene, /swingDirection \* 1\.5/);
  assert.match(scene, /swingDirection \* 2/);
  assert.match(scene, /position=\{\[initialCardX, anchorY, 0\]\}/);
  assert.match(scene, /curve\.getPoints\(size\.width < 768 \? 16 : 32\)/);
  assert.match(scene, /CuboidCollider args=\{\[0\.8, 1\.125, 0\.01\]\}/);
  assert.match(scene, /<Environment blur=\{0\.75\}>/);
  assert.equal(scene.match(/<Lightformer/g)?.length, 4);

  assert.match(card, /document\.fonts\.ready/);
  assert.match(card, /CanvasTexture/);
  assert.match(card, /rotation\.y/);
  assert.match(card, /dispose\(\)/);
  assert.match(card, /CONTACT_AVATAR_SOURCE/);
  assert.match(card, /drawCoverImage/);
  assert.match(card, /useGLTF\(CARD_MODEL_SOURCE\)/);
  assert.match(card, /CARD_MODEL_SOURCE = "\/contact-card\.glb"/);
  assert.match(card, /CARD_BASE_SOURCE = "\/contact-card-base-dark\.png"/);
  assert.match(card, /scale=\{2\.25\}/);
  assert.match(card, /position=\{\[0, -1\.2, -0\.05\]\}/);
  assert.match(card, /model\.nodes\.card\.geometry/);
  assert.match(card, /model\.nodes\.clip\.geometry/);
  assert.match(card, /model\.nodes\.clamp\.geometry/);
  assert.match(card, /clearcoat=\{isMobile \? 0 : 1\}/);
  assert.match(card, /clearcoatRoughness=\{0\.15\}/);
  assert.match(card, /roughness=\{0\.9\}/);
  assert.match(card, /metalness=\{0\.8\}/);
  assert.match(card, /created\.anisotropy = 16/);
  assert.match(card, /CONTACT_PHONE/);
  assert.match(card, /CONTACT_QR_SOURCE/);
  assert.doesNotMatch(card, /RoundedBox|ringTarget|boxGeometry|torusGeometry|map-anisotropy/);
  assert.doesNotMatch(card, /CONTACT_RESULTS|虎派结果/);

  assert.match(fallback, /data-contact-badge="static"/);
  assert.match(fallback, /className="badge-avatar"/);
  assert.match(fallback, /alt="庄澍凯个人照片"/);
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
  assert.match(css, /touch-action: none/);
  assert.match(css, /background: rgba\(46, 42, 35, 0\.1\)/);
  assert.match(css, /left: var\(--contact-card-x\)/);
  assert.match(css, /var\(--contact-anchor-x\) - var\(--contact-card-x\)/);
  assert.match(css, /\.static-lanyard em/);
  assert.match(css, /url\("\/contact-lanyard\.png"\)/);
  assert.match(css, /\.badge-contact-grid/);
  assert.match(css, /width: min\(28vw, 330px, 48vh\)/);
  assert.match(css, /\.badge-contact-grid \{[^}]*grid-template-columns: 1fr/);
  assert.match(css, /\.badge-capabilities span \{[^}]*font-size: 0\.7rem/);
  assert.match(css, /\.badge-face \{[^}]*background: #050505/);
  assert.match(css, /@keyframes static-badge-drop/);
  assert.match(css, /\.badge-drag-hint\.is-hidden/);

  const dependencies = JSON.parse(packageJson).dependencies;
  for (const dependency of ["three", "@react-three/fiber", "@react-three/drei", "@react-three/rapier", "meshline", "qrcode"]) {
    assert.ok(dependencies[dependency], `${dependency} should be installed`);
  }
});
