# 虎派眼镜小红书作品证据 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有虎派经历中增加可核实的小红书账号证据、三件代表作品和一段按需加载的竖屏短视频预览，同时保持网站现有视觉、交互和移动端性能。

**Architecture:** 新增一个只负责展示虎派公开作品的 `HupaiPortfolio` 组件，并把所有账号、作品和互动数据集中在独立数据文件中。图片、裁切后的原始平台截图和视频都保存到 `public/hupai/`，页面不热链小红书资源；视频使用原生控件和 `preload="none"`，不引入新的客户端状态或第三方播放器。现有 `page.tsx` 只负责把组件插入虎派标题与方法论案例之间，样式继续集中在 `app/globals.css`。

**Tech Stack:** Next.js 16、React 19、TypeScript、原生 HTML5 Video、Next Image、Node test runner、ego-browser。

---

## 文件结构

- Create: `app/components/hupai-portfolio/hupai-data.ts`
  - 保存账号概览、数据截取日期、三件作品、互动数据、公开链接和本地资产路径。
- Create: `app/components/hupai-portfolio/HupaiPortfolio.tsx`
  - 渲染账号证据条、三张代表作品卡、可按需播放的视频和原笔记链接。
- Create: `public/hupai/lindberg-series-evidence.png`
  - 从公开笔记详情页裁切出的平台证据图，不含浏览器工具栏、通知和登录用户信息。
- Create: `public/hupai/eyewear-universe-cover.webp`
  - “日系 美系 欧系”图文作品封面。
- Create: `public/hupai/lindberg-6537-cover.webp`
  - 林德伯格 6537 客订短视频封面。
- Create: `public/hupai/lindberg-6537-preview.mp4`
  - 720×1280、约 19 秒的网页预览视频，只在用户主动播放时请求。
- Modify: `app/page.tsx`
  - 引入并插入 `HupaiPortfolio`，增加“作品证据 → 运营方法”的衔接文案。
- Modify: `app/globals.css`
  - 增加桌面、平板、手机端和减弱动画模式的作品证据样式。
- Modify: `tests/rendered-html.test.mjs`
  - 验证公开数据、作品顺序、视频按需加载语义、链接、资产格式、响应式样式及既有功能不回归。

### Task 1: 保存并验证公开作品资产

**Files:**
- Create: `public/hupai/lindberg-series-evidence.png`
- Create: `public/hupai/eyewear-universe-cover.webp`
- Create: `public/hupai/lindberg-6537-cover.webp`
- Create: `public/hupai/lindberg-6537-preview.mp4`

- [ ] **Step 1: 创建资产目录并生成裁切后的平台证据图**

Run:

```bash
mkdir -p public/hupai
sips -c 836 1068 --cropOffset 88 440 /tmp/hupai-top-note.png \
  --out public/hupai/lindberg-series-evidence.png
sips -Z 1400 public/hupai/lindberg-series-evidence.png
```

Expected:

- 输出图只包含笔记图片、虎派公开账号信息和互动数据；
- 不包含小红书左侧导航、通知数量、浏览器栏或当前登录用户头像；
- 文件最长边不超过 1400px。

- [ ] **Step 2: 下载两张作品封面和按需播放视频**

Run:

```bash
curl -L --fail \
  'http://sns-webpic-qc.xhscdn.com/202607272142/7f808161f06e452fa2bbbda29c6d4ce4/spectrum/1040g0k031t3aoaiele105nvdd3p097rnl09k588!nd_dft_wlteh_webp_3' \
  -o public/hupai/eyewear-universe-cover.webp

curl -L --fail \
  'http://sns-webpic-qc.xhscdn.com/202607272213/cf91840f7f8b1370e704a885ed136df5/spectrum/1040g34o3228076rjn2105nvdd3p097rnmdpej58!nd_dft_wlteh_webp_3' \
  -o public/hupai/lindberg-6537-cover.webp

curl -L --fail \
  'http://sns-bak-v1.xhscdn.com/stream/1/110/309/01ea4a0ea8341c58010370019f3149b47c_309.mp4' \
  -o public/hupai/lindberg-6537-preview.mp4
```

Expected:

- 两张封面是 RIFF/WebP 文件；
- 视频是 MP4，约 2MB，分辨率 720×1280；
- 页面首屏不会因为文件存在而自动请求视频。

- [ ] **Step 3: 验证二进制格式和文件大小**

Run:

```bash
node --input-type=module <<'EOF'
import { readFile, stat } from "node:fs/promises";

const files = {
  evidence: "public/hupai/lindberg-series-evidence.png",
  universe: "public/hupai/eyewear-universe-cover.webp",
  videoCover: "public/hupai/lindberg-6537-cover.webp",
  video: "public/hupai/lindberg-6537-preview.mp4",
};

const [evidence, universe, videoCover, video] = await Promise.all(
  Object.values(files).map((path) => readFile(path)),
);

if (!evidence.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
  throw new Error("Evidence asset is not PNG");
}
for (const [name, file] of [["universe", universe], ["videoCover", videoCover]]) {
  if (file.subarray(0, 4).toString("ascii") !== "RIFF" || file.subarray(8, 12).toString("ascii") !== "WEBP") {
    throw new Error(`${name} is not WebP`);
  }
}
if (video.subarray(4, 8).toString("ascii") !== "ftyp") {
  throw new Error("Video asset is not MP4");
}

const sizes = await Promise.all(
  Object.entries(files).map(async ([name, path]) => [name, (await stat(path)).size]),
);
console.log(Object.fromEntries(sizes));
EOF
```

Expected: command exits with code 0 and prints four non-zero file sizes; the MP4 is below 3,500,000 bytes.

- [ ] **Step 4: 提交资产**

```bash
git add public/hupai
git commit -m "Add verified Hupai Xiaohongshu media"
```

### Task 2: 用测试锁定账号、作品和视频语义

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Create: `app/components/hupai-portfolio/hupai-data.ts`
- Create: `app/components/hupai-portfolio/HupaiPortfolio.tsx`
- Modify: `app/page.tsx:3-4`
- Modify: `app/page.tsx:318-333`

- [ ] **Step 1: 写入会失败的渲染与资产测试**

先把现有禁止所有视频的断言：

```js
  assert.doesNotMatch(html, /<video\b|hero\.mp4/i);
```

替换为只禁止旧首屏视频的断言：

```js
  assert.doesNotMatch(html, /hero\.mp4|class="video-bg"/i);
```

在 `server-renders the high-end eyewear new-media portfolio` 测试的虎派断言后加入：

```js
  assert.match(html, /小红书内容作品/);
  assert.match(html, /虎\.派\.眼\.镜/);
  assert.match(html, /3604/);
  assert.match(html, /1\.7 万/);
  assert.match(html, /公开页数据截取于 2026-07-27/);

  assert.match(html, /林德伯格 全系列干货讲解/);
  assert.match(html, /赞<\/dt><dd>127/);
  assert.match(html, /收藏<\/dt><dd>147/);
  assert.match(html, /评论<\/dt><dd>48/);
  assert.match(html, /分享<\/dt><dd>49/);

  assert.match(html, /日系 美系 欧系/);
  assert.match(html, /赞<\/dt><dd>81/);
  assert.match(html, /收藏<\/dt><dd>88/);

  assert.match(html, /林德伯格 6537/);
  assert.match(html, /19 秒竖屏短视频/);
  assert.match(html, /赞<\/dt><dd>22/);
  assert.match(html, /收藏<\/dt><dd>9/);
  assert.match(html, /评论<\/dt><dd>10/);
  assert.match(html, /分享<\/dt><dd>2/);
  assert.match(
    html,
    /<video[^>]*controls=""[^>]*playsinline=""[^>]*preload="none"[^>]*poster="\/hupai\/lindberg-6537-cover\.webp"/,
  );
  assert.match(html, /src="\/hupai\/lindberg-6537-preview\.mp4"/);
  assert.match(html, /href="https:\/\/www\.xiaohongshu\.com\/explore\/6a4a0ea7000000001702df31"/);
  assert.match(html, /上方是可核实的作品样本/);
  assert.match(html, /下方是可复用的运营方法/);
  assert.ok(html.indexOf("小红书内容作品") < html.indexOf('class="case-list"'));
```

在 `ships the verified portfolio assets...` 测试中的 `Promise.all` 后增加以下读取和断言：

```js
  const [hupaiData, hupaiComponent, hupaiEvidence, universeCover, videoCover, videoPreview] =
    await Promise.all([
      readFile(new URL("../app/components/hupai-portfolio/hupai-data.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/components/hupai-portfolio/HupaiPortfolio.tsx", import.meta.url), "utf8"),
      readFile(new URL("../public/hupai/lindberg-series-evidence.png", import.meta.url)),
      readFile(new URL("../public/hupai/eyewear-universe-cover.webp", import.meta.url)),
      readFile(new URL("../public/hupai/lindberg-6537-cover.webp", import.meta.url)),
      readFile(new URL("../public/hupai/lindberg-6537-preview.mp4", import.meta.url)),
    ]);

  assert.match(hupaiData, /snapshotDate: "2026-07-27"/);
  assert.match(hupaiData, /6a4a0ea7000000001702df31/);
  assert.match(hupaiComponent, /preload="none"/);
  assert.match(hupaiComponent, /controls/);
  assert.match(hupaiComponent, /playsInline/);
  assert.match(hupaiComponent, /loading="lazy"/);
  assert.deepEqual([...hupaiEvidence.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(universeCover.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(universeCover.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(videoCover.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(videoCover.subarray(8, 12).toString("ascii"), "WEBP");
  assert.equal(videoPreview.subarray(4, 8).toString("ascii"), "ftyp");
```

- [ ] **Step 2: 运行测试确认失败原因正确**

Run:

```bash
pnpm run build && node --test tests/rendered-html.test.mjs
```

Expected: FAIL，错误首先指向页面缺少“小红书内容作品”或组件文件不存在，而不是现有工牌、简历或能力雷达测试失败。

- [ ] **Step 3: 创建强类型作品数据文件**

创建 `app/components/hupai-portfolio/hupai-data.ts`：

```ts
export type HupaiMetric = {
  label: "赞" | "收藏" | "评论" | "分享";
  value: string;
};

export type HupaiWork = {
  id: string;
  title: string;
  originalTitle: string;
  date: string;
  format: string;
  capability: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  metrics: HupaiMetric[];
  noteUrl: string;
  video?: {
    src: string;
    poster: string;
    label: string;
  };
};

export const hupaiAccount = {
  name: "虎.派.眼.镜",
  profileUrl: "https://www.xiaohongshu.com/user/profile/5fed68f20000000001009f77",
  followerCount: "3604",
  engagementCount: "1.7 万",
  responsibility: "2024.05 至今负责拍摄与运营",
  snapshotDate: "2026-07-27",
} as const;

export const hupaiWorks: HupaiWork[] = [
  {
    id: "66ab4132000000002701f16e",
    title: "林德伯格 全系列干货讲解",
    originalTitle: "林德伯格｜最新全系列干货讲解",
    date: "2024-08-01",
    format: "图文干货",
    capability: "把复杂产品线拆解成消费者能理解的选购知识，并承接评论区咨询。",
    image: "/hupai/lindberg-series-evidence.png",
    imageAlt: "虎派眼镜林德伯格全系列图文笔记及公开互动数据截图",
    imageWidth: 1068,
    imageHeight: 836,
    metrics: [
      { label: "赞", value: "127" },
      { label: "收藏", value: "147" },
      { label: "评论", value: "48" },
      { label: "分享", value: "49" },
    ],
    noteUrl: "https://www.xiaohongshu.com/explore/66ab4132000000002701f16e",
  },
  {
    id: "69a16f6f0000000015038c2e",
    title: "日系 美系 欧系",
    originalTitle: "日系 - 美系 - 欧系，一个多元的眼镜宇宙",
    date: "2026-02-27",
    format: "品牌策划图文",
    capability: "用地区审美与品牌文化建立高端眼镜的内容主题和认知框架。",
    image: "/hupai/eyewear-universe-cover.webp",
    imageAlt: "虎派眼镜日系美系欧系品牌策划图文封面",
    imageWidth: 1080,
    imageHeight: 1440,
    metrics: [
      { label: "赞", value: "81" },
      { label: "收藏", value: "88" },
      { label: "评论", value: "11" },
      { label: "分享", value: "21" },
    ],
    noteUrl: "https://www.xiaohongshu.com/explore/69a16f6f0000000015038c2e",
  },
  {
    id: "6a4a0ea7000000001702df31",
    title: "林德伯格 6537",
    originalTitle: "客订分享！林德伯格6537+蔡司鎏金膜",
    date: "2026-07-05",
    format: "19 秒竖屏短视频",
    capability: "用动态近景呈现镜框、镜片镀膜与光线变化，完成客订内容包装。",
    image: "/hupai/lindberg-6537-cover.webp",
    imageAlt: "虎派眼镜林德伯格6537与蔡司鎏金膜短视频封面",
    imageWidth: 1080,
    imageHeight: 1440,
    metrics: [
      { label: "赞", value: "22" },
      { label: "收藏", value: "9" },
      { label: "评论", value: "10" },
      { label: "分享", value: "2" },
    ],
    noteUrl: "https://www.xiaohongshu.com/explore/6a4a0ea7000000001702df31",
    video: {
      src: "/hupai/lindberg-6537-preview.mp4",
      poster: "/hupai/lindberg-6537-cover.webp",
      label: "林德伯格 6537 客订短视频预览",
    },
  },
];
```

- [ ] **Step 4: 创建作品证据组件**

创建 `app/components/hupai-portfolio/HupaiPortfolio.tsx`：

```tsx
import Image from "next/image";
import { hupaiAccount, hupaiWorks } from "./hupai-data";

export function HupaiPortfolio() {
  return (
    <section className="hupai-evidence" aria-labelledby="hupai-evidence-title">
      <div className="hupai-evidence-heading" data-reveal>
        <div>
          <p className="eyebrow">Public account proof</p>
          <h3 id="hupai-evidence-title">小红书内容作品</h3>
          <p>从公开账号与真实作品出发，展示内容策划、图文表达和竖屏视频拍摄能力。</p>
        </div>
        <a
          href={hupaiAccount.profileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="在小红书查看虎派眼镜公开账号"
        >
          查看虎派眼镜账号 <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="hupai-account-proof" data-reveal>
        <div className="hupai-account-name">
          <span>账号实操</span>
          <strong>{hupaiAccount.name}</strong>
        </div>
        <dl className="hupai-account-stats">
          <div><dt>粉丝</dt><dd>{hupaiAccount.followerCount}</dd></div>
          <div><dt>获赞与收藏</dt><dd>{hupaiAccount.engagementCount}</dd></div>
          <div><dt>负责范围</dt><dd>{hupaiAccount.responsibility}</dd></div>
        </dl>
        <p>公开页数据截取于 {hupaiAccount.snapshotDate}</p>
      </div>

      <div className="hupai-work-grid">
        {hupaiWorks.map((work, index) => (
          <article
            className={`hupai-work-card${index === 0 ? " is-featured" : ""}${work.video ? " is-video" : ""}`}
            data-reveal
            key={work.id}
          >
            <div className="hupai-work-media">
              {work.video ? (
                <video
                  aria-label={work.video.label}
                  controls
                  playsInline
                  preload="none"
                  poster={work.video.poster}
                >
                  <source src={work.video.src} type="video/mp4" />
                  您的浏览器不支持视频播放，请使用下方链接查看原笔记。
                </video>
              ) : (
                <Image
                  className="hupai-work-image"
                  src={work.image}
                  alt={work.imageAlt}
                  width={work.imageWidth}
                  height={work.imageHeight}
                  sizes={index === 0 ? "(max-width: 900px) 100vw, 46vw" : "(max-width: 620px) 100vw, 26vw"}
                  loading="lazy"
                />
              )}
              <span>{work.format}</span>
            </div>

            <div className="hupai-work-body">
              <div className="hupai-work-meta">
                <span>{work.originalTitle}</span>
                <time dateTime={work.date}>{work.date}</time>
              </div>
              <h4>{work.title}</h4>
              <p>{work.capability}</p>
              <dl className="hupai-work-metrics" aria-label={`${work.title}公开互动数据`}>
                {work.metrics.map((metric) => (
                  <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>
                ))}
              </dl>
              <a
                href={work.noteUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`在小红书查看${work.originalTitle}`}
              >
                查看原笔记 <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className="hupai-evidence-note" data-reveal>
        公开互动数据会随平台变化　当前展示截取于 {hupaiAccount.snapshotDate}
      </p>
    </section>
  );
}
```

- [ ] **Step 5: 将组件插入虎派标题与原有案例之间**

在 `app/page.tsx` 顶部加入：

```tsx
import { HupaiPortfolio } from "./components/hupai-portfolio/HupaiPortfolio";
```

在 `section-heading` 结束后、现有 `<div className="case-list">` 之前加入：

```tsx
            <HupaiPortfolio />

            <p className="hupai-case-bridge" data-reveal>
              <span>上方是可核实的作品样本</span>
              <strong>下方是可复用的运营方法</strong>
            </p>
```

- [ ] **Step 6: 运行构建与渲染测试**

Run:

```bash
pnpm run build && node --test tests/rendered-html.test.mjs
```

Expected: 新增 HTML、资产和视频语义断言 PASS；如果视频布尔属性序列化顺序不同，只调整正则为不依赖属性顺序，不删除语义断言。

- [ ] **Step 7: 提交内容结构**

```bash
git add app/components/hupai-portfolio app/page.tsx tests/rendered-html.test.mjs
git commit -m "Add Hupai Xiaohongshu portfolio evidence"
```

### Task 3: 完成高级编辑式布局与响应式样式

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/globals.css:289`
- Modify: `app/globals.css:610-715`
- Modify: `app/globals.css:774-782`

- [ ] **Step 1: 添加会失败的 CSS 契约测试**

在 `ships the verified portfolio assets...` 的 CSS 断言中加入：

```js
  assert.match(css, /\.hupai-evidence \{/);
  assert.match(css, /\.hupai-account-proof \{/);
  assert.match(css, /\.hupai-work-grid \{[\s\S]*?grid-template-columns: minmax\(0, 1\.35fr\) repeat\(2, minmax\(0, 0\.825fr\)\)/);
  assert.match(css, /\.hupai-work-card\.is-video \.hupai-work-media/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*?\.hupai-work-card\.is-featured \{ grid-column: 1 \/ -1/);
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*?\.hupai-work-grid \{ grid-template-columns: 1fr/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.hupai-work-card:hover \.hupai-work-image \{ transform: none/);
  assert.doesNotMatch(css, /\.hupai-[^{]+\{[^}]*#ff2442/);
```

- [ ] **Step 2: 运行测试确认只因样式缺失而失败**

Run:

```bash
pnpm run build && node --test tests/rendered-html.test.mjs
```

Expected: FAIL at `.hupai-evidence` CSS assertion；Task 2 的内容和资产断言仍然 PASS。

- [ ] **Step 3: 添加桌面端作品证据样式**

在 `app/globals.css` 的 `.section-summary` 与 `.case-list` 之间加入：

```css
.hupai-evidence { margin-top: clamp(52px, 6vw, 88px); }
.hupai-evidence-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
}
.hupai-evidence-heading h3 {
  margin: 18px 0 0;
  font-family: "Noto Serif SC", serif;
  font-size: clamp(2rem, 2.8vw, 3rem);
  font-weight: var(--display-weight);
  letter-spacing: 0.04em;
}
.hupai-evidence-heading > div > p:last-child {
  max-width: 42rem;
  margin: 16px 0 0;
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.85;
}
.hupai-evidence-heading > a,
.hupai-work-body > a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid var(--line-strong);
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 600;
}
.hupai-account-proof {
  display: grid;
  grid-template-columns: minmax(150px, 1.2fr) minmax(0, 5fr) auto;
  gap: 28px;
  align-items: center;
  margin-top: 28px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: rgba(244, 240, 231, 0.54);
  padding: 20px 24px;
}
.hupai-account-name { display: grid; gap: 7px; }
.hupai-account-name span,
.hupai-account-proof > p {
  color: var(--muted);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
}
.hupai-account-name strong {
  font-family: "Noto Serif SC", serif;
  font-size: 1.18rem;
  letter-spacing: 0.08em;
}
.hupai-account-stats,
.hupai-work-metrics { display: flex; flex-wrap: wrap; margin: 0; }
.hupai-account-stats { gap: 12px 34px; }
.hupai-account-stats div,
.hupai-work-metrics div { display: flex; align-items: baseline; gap: 7px; }
.hupai-account-stats dt,
.hupai-work-metrics dt { color: var(--muted); font-size: 0.68rem; }
.hupai-account-stats dd,
.hupai-work-metrics dd { margin: 0; color: var(--ink); font: 600 0.85rem/1 "Manrope", sans-serif; }
.hupai-account-proof > p { margin: 0; text-align: right; }
.hupai-work-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) repeat(2, minmax(0, 0.825fr));
  gap: 14px;
  margin-top: 14px;
}
.hupai-work-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--paper);
}
.hupai-work-card:nth-child(2) { background: var(--sage); }
.hupai-work-card:nth-child(3) { background: var(--paper-deep); }
.hupai-work-media {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  background: var(--paper-deep);
}
.hupai-work-card.is-featured .hupai-work-media { aspect-ratio: 4 / 3; }
.hupai-work-card.is-video .hupai-work-media { aspect-ratio: 4 / 5; }
.hupai-work-image,
.hupai-work-media video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hupai-work-image { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.hupai-work-card:hover .hupai-work-image { transform: scale(1.018); }
.hupai-work-media > span {
  position: absolute;
  right: 12px;
  bottom: 12px;
  border-radius: 999px;
  background: rgba(255, 253, 248, 0.9);
  padding: 7px 10px;
  color: var(--ink);
  font-size: 0.68rem;
  font-weight: 600;
  pointer-events: none;
}
.hupai-work-card.is-video .hupai-work-media > span { top: 12px; bottom: auto; }
.hupai-work-body { display: grid; gap: 18px; padding: clamp(20px, 2.2vw, 30px); }
.hupai-work-meta {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: var(--muted);
  font-size: 0.68rem;
}
.hupai-work-meta span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hupai-work-meta time { flex: none; font-family: "Manrope", sans-serif; }
.hupai-work-body h4 {
  margin: 0;
  font-family: "Noto Serif SC", serif;
  font-size: clamp(1.45rem, 2vw, 2.25rem);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: 0.015em;
}
.hupai-work-body > p { min-height: 3.7em; margin: 0; color: var(--ink-soft); font-size: 0.84rem; line-height: 1.85; }
.hupai-work-metrics { gap: 9px 16px; border-top: 1px solid var(--line); padding-top: 16px; }
.hupai-work-body > a { width: fit-content; margin-top: 2px; }
.hupai-evidence-note { margin: 18px 0 0; color: var(--muted); font-size: 0.72rem; text-align: right; }
.hupai-case-bridge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin: clamp(52px, 6vw, 84px) 0 0;
  border-top: 1px solid var(--line);
  padding-top: 22px;
  color: var(--muted);
  font-size: 0.78rem;
}
.hupai-case-bridge strong { color: var(--gold-deep); font-weight: 600; }
```

- [ ] **Step 4: 添加平板和手机端布局**

在现有 `@media (max-width: 900px)` 中、`.case-list` 之前加入：

```css
  .hupai-work-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hupai-work-card.is-featured { grid-column: 1 / -1; }
  .hupai-work-card.is-featured .hupai-work-media { aspect-ratio: 16 / 9; }
  .hupai-account-proof { grid-template-columns: 1fr 2.5fr; }
  .hupai-account-proof > p { grid-column: 1 / -1; text-align: left; }
```

在现有 `@media (max-width: 620px)` 中、`.case-list` 之前加入：

```css
  .hupai-evidence { margin-top: 46px; }
  .hupai-evidence-heading { align-items: flex-start; flex-direction: column; gap: 20px; }
  .hupai-evidence-heading h3 { font-size: clamp(1.85rem, 8vw, 2.3rem); }
  .hupai-evidence-heading > a { width: 100%; }
  .hupai-account-proof { grid-template-columns: 1fr; gap: 18px; padding: 18px; }
  .hupai-account-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .hupai-account-stats div:last-child { grid-column: 1 / -1; }
  .hupai-account-proof > p { grid-column: 1; }
  .hupai-work-grid { grid-template-columns: 1fr; gap: 12px; }
  .hupai-work-card.is-featured { grid-column: auto; }
  .hupai-work-card.is-featured .hupai-work-media { aspect-ratio: 4 / 3; }
  .hupai-work-card.is-video .hupai-work-media { aspect-ratio: 4 / 5; }
  .hupai-work-body { gap: 14px; padding: 20px 18px; }
  .hupai-work-body h4 { font-size: 1.55rem; }
  .hupai-work-body > p { min-height: 0; }
  .hupai-work-body > a { width: 100%; min-height: 48px; }
  .hupai-evidence-note { text-align: left; }
  .hupai-case-bridge { align-items: flex-start; flex-direction: column; gap: 7px; margin-top: 52px; }
```

在 `@media (prefers-reduced-motion: reduce)` 中加入：

```css
  .hupai-work-card:hover .hupai-work-image { transform: none !important; }
```

- [ ] **Step 5: 运行测试并提交样式**

Run:

```bash
pnpm run build && node --test tests/rendered-html.test.mjs
```

Expected: all tests PASS。

Commit:

```bash
git add app/globals.css tests/rendered-html.test.mjs
git commit -m "Style responsive Hupai work evidence"
```

### Task 4: 浏览器验证与针对性修复

**Files:**
- Modify only if QA finds a concrete issue:
  - `app/components/hupai-portfolio/HupaiPortfolio.tsx`
  - `app/globals.css`
  - `tests/rendered-html.test.mjs`

- [ ] **Step 1: 启动本地生产预览**

Run:

```bash
pnpm run build
pnpm start -H 127.0.0.1 -p 3000
```

Expected: production server reports `http://127.0.0.1:3000` ready。

- [ ] **Step 2: 使用 ego-browser 检查桌面端**

Run:

```bash
ego-browser nodejs <<'EOF'
const task = await useOrCreateTaskSpace(1)
await openOrReuseTab('http://127.0.0.1:3000/#hupai', { wait: true, timeout: 20 })
await wait(2)
await cdp('Emulation.setDeviceMetricsOverride', {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
})
await gotoAndWait('http://127.0.0.1:3000/#hupai', { timeout: 20, settle: 1 })
const info = await js(String.raw`(() => ({
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  evidenceBeforeCases:
    document.querySelector('.hupai-evidence')?.compareDocumentPosition(
      document.querySelector('.case-list')
    ) === Node.DOCUMENT_POSITION_FOLLOWING,
  videos: [...document.querySelectorAll('.hupai-evidence video')].map((video) => ({
    preload: video.preload,
    paused: video.paused,
    currentSrc: video.currentSrc,
  })),
  links: document.querySelectorAll('.hupai-evidence a[href*="xiaohongshu.com"]').length,
}))()`)
await captureScreenshot('/tmp/hupai-portfolio-desktop.png')
cliLog(JSON.stringify({ info, screenshot: '/tmp/hupai-portfolio-desktop.png' }, null, 2))
EOF
```

Expected:

- `horizontalOverflow: false`
- `evidenceBeforeCases: true`
- exactly one video with `preload: "none"` and `paused: true`
- four Xiaohongshu links（账号 + 三篇笔记）
- screenshot shows one dominant work card and two supporting cards without clipped text。

- [ ] **Step 3: 使用 ego-browser 检查手机端**

Run:

```bash
ego-browser nodejs <<'EOF'
const task = await useOrCreateTaskSpace(1)
await cdp('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 2,
  mobile: true,
})
await gotoAndWait('http://127.0.0.1:3000/#hupai', { timeout: 20, settle: 1 })
const info = await js(String.raw`(() => ({
  horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  columns: getComputedStyle(document.querySelector('.hupai-work-grid')).gridTemplateColumns,
  videoWidth: document.querySelector('.hupai-evidence video')?.getBoundingClientRect().width,
  viewportWidth: innerWidth,
  minLinkHeight: Math.min(
    ...[...document.querySelectorAll('.hupai-evidence a')].map((link) =>
      link.getBoundingClientRect().height
    )
  ),
}))()`)
await captureScreenshot('/tmp/hupai-portfolio-mobile.png')
cliLog(JSON.stringify({ info, screenshot: '/tmp/hupai-portfolio-mobile.png' }, null, 2))
EOF
```

Expected:

- `horizontalOverflow: false`
- one grid column
- video width is less than or equal to viewport width
- interactive links are at least 44px high
- screenshot shows readable metrics and no tiny text or cropped controls。

- [ ] **Step 4: 验证视频是用户触发后才加载**

在手机或桌面预览中，先观察 Network；未点击播放时不应下载 `lindberg-6537-preview.mp4`。点击视频原生播放键后，确认：

- 视频能播放；
- 画面比例为竖屏；
- 暂停与拖动进度可用；
- 播放不会导致页面横向溢出；
- 点击视频不会跳转小红书，只有“查看原笔记”链接跳转。

- [ ] **Step 5: 只对发现的问题写回归测试并修复**

如果 QA 发现具体问题，先在 `tests/rendered-html.test.mjs` 写对应断言并确认失败，再修改组件或 CSS，最后运行：

```bash
pnpm run build && node --test tests/rendered-html.test.mjs
```

Expected: regression test and full suite PASS。

- [ ] **Step 6: 如有修复则提交**

```bash
git add app/components/hupai-portfolio/HupaiPortfolio.tsx app/globals.css tests/rendered-html.test.mjs
git diff --cached --quiet || git commit -m "Fix Hupai portfolio responsive QA issues"
```

### Task 5: 最终验证与发布

**Files:**
- Verify all changed files

- [ ] **Step 1: 运行完整质量检查**

Run:

```bash
pnpm lint
pnpm test
git diff --check
git status --short
```

Expected:

- ESLint exits 0；
- production build succeeds；
- all Node tests pass；
- `git diff --check` has no output；
- worktree has no uncommitted changes。

- [ ] **Step 2: 检查既有功能没有回归**

使用本地生产预览确认：

- 首页能力雷达正常；
- 虎派原有 3W+、8W+、60+、30% 仍显示；
- 3D 联系工牌仍能打开、拖拽、翻面和关闭；
- 页脚邮箱仍为 `mailto:2496739820@qq.com`；
- 简历仍可下载；
- 新增模块不显示手机号或评论区用户信息；
- 减弱动画模式下作品图片不缩放。

- [ ] **Step 3: 推送当前 main 分支**

Run:

```bash
git push origin main
```

Expected: GitHub 接受推送，Vercel 对最新 `main` 提交触发部署。

- [ ] **Step 4: 验证公开站点**

在部署完成后打开：

```text
https://www.baiyexia.top/#hupai
```

确认线上页面包含三件代表作品，第三件可以按需播放，公开数据和本地预览一致，手机端无横向溢出。
