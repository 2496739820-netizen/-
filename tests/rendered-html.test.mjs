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
  assert.match(html, /既能做内容/);
  assert.match(html, /也对/);
  assert.match(html, /结果/);
  assert.match(html, /负责/);
  assert.match(html, /把眼镜内容做成信任/);
  assert.match(html, /把线上流量带到门店/);
  assert.match(html, /我是庄澍凯/);
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
  assert.match(html, /数据说明/);
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
  assert.match(html, /href="\/zhuang-shukai-resume\.pdf"[^>]*download/);
  assert.match(html, /Profile \/ 01/);
  assert.match(html, /Zhuang Shukai/);
  assert.match(html, /class="brand-avatar"/);
  assert.match(html, /高端眼镜门店新媒体运营/);
  assert.match(html, /目标地区/);
  assert.match(html, /\/og\.png/);

  assert.doesNotMatch(html, /15815347183/);
  assert.doesNotMatch(html, /把画面做成|把注意力变成增长/);
  assert.doesNotMatch(html, /Content operator \/ Visual storyteller/);
  assert.doesNotMatch(html, /src="\/zhuang-shukai-portrait\.jpg"/);
  assert.doesNotMatch(html, /class="brand-mark"[^>]*>ZS/);
  assert.doesNotMatch(html, />既能做内容，</);
  assert.doesNotMatch(html, />也对结果负责。</);
  assert.doesNotMatch(html, /<video\b|hero\.mp4/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);

  assert.ok(html.indexOf("我是庄澍凯") < html.indexOf('id="hupai"'));
});

test("ships the verified portfolio assets and removes the unrelated video experience", async () => {
  const [page, layout, css, resume, portrait, avatar, og] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../public/zhuang-shukai-resume.pdf", import.meta.url)),
    readFile(new URL("../public/zhuang-shukai-portrait.jpg", import.meta.url)),
    readFile(new URL("../public/brand-avatar.png", import.meta.url)),
    readFile(new URL("../public/og.png", import.meta.url)),
  ]);

  assert.match(page, /高端眼镜门店 · 新媒体运营/);
  assert.match(page, /href="\/zhuang-shukai-resume\.pdf"/);
  assert.match(page, /className="hero-nameplate"/);
  assert.match(page, /className="brand-avatar"/);
  assert.doesNotMatch(page, /src="\/zhuang-shukai-portrait\.jpg"/);
  assert.match(page, /\{ id: "top", label: "关于我" \}/);
  assert.match(page, />\s*既能做内容\s*</);
  assert.match(page, /也对<strong>结果<\/strong>负责/);
  assert.match(page, /data-nav=/);
  assert.match(page, /数据说明/);
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
  assert.match(css, /\.hero-identity/);
  assert.match(css, /\.hero-nameplate/);
  assert.match(css, /\.brand-avatar/);
  assert.match(css, /url\("\/brand-avatar\.png"\)/);
  assert.match(css, /--text-body: 0\.94rem/);
  assert.doesNotMatch(css, /\.hero-portrait/);
  assert.match(css, /white-space: nowrap/);
  assert.match(css, /\.metrics-note/);
  assert.doesNotMatch(css, /\.video-bg|\.video-scrim|\.video-vignette/);

  assert.equal(resume.subarray(0, 5).toString("ascii"), "%PDF-");
  assert.deepEqual([...portrait.subarray(0, 3)], [255, 216, 255]);
  assert.deepEqual([...avatar.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.deepEqual([...og.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(og.readUInt32BE(16), 1200);
  assert.equal(og.readUInt32BE(20), 630);

  await access(new URL("../public/zhuang-shukai-resume.pdf", import.meta.url));
  await access(new URL("../public/zhuang-shukai-portrait.jpg", import.meta.url));
  await access(new URL("../public/brand-avatar.png", import.meta.url));
  await assert.rejects(access(new URL("../public/hero.mp4", import.meta.url)));
});
