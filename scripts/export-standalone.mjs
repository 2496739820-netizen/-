import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", `${Date.now()}`);

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) {
  throw new Error(`Unable to render portfolio: ${response.status}`);
}

const [rendered, stylesheet, avatar, resume] = await Promise.all([
  response.text(),
  readFile(new URL("app/globals.css", root), "utf8"),
  readFile(new URL("public/brand-avatar.png", root)),
  readFile(new URL("public/zhuang-shukai-resume.pdf", root)),
]);

const avatarData = `data:image/png;base64,${avatar.toString("base64")}`;
const resumeData = `data:application/pdf;base64,${resume.toString("base64")}`;
const inlineStyles = stylesheet.replace(
  'url("/brand-avatar.png")',
  `url("${avatarData}")`,
);

const standaloneScript = String.raw`
(() => {
  const root = document.querySelector('.site-root');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero-section');
  if (!root) return;

  root.dataset.ready = 'true';

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      reveal.unobserve(entry.target);
    });
  }, { rootMargin: '-48px 0px', threshold: 0.08 });

  document.querySelectorAll('[data-reveal]').forEach((node) => reveal.observe(node));

  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sections = navLinks
    .map((link) => ({ id: link.dataset.nav, node: document.getElementById(link.dataset.nav) }))
    .filter((item) => item.node);

  let frame = 0;
  const renderScroll = () => {
    frame = 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    root.style.setProperty('--scroll-progress', Math.min(100, Math.max(0, scrollY / maxScroll * 100)) + '%');
    header?.classList.toggle('is-scrolled', scrollY > 28);

    const readingLine = scrollY + innerHeight * 0.34;
    let active = 'top';
    sections.forEach(({ id, node }) => { if (readingLine >= node.offsetTop) active = id; });
    navLinks.forEach((link) => {
      const selected = link.dataset.nav === active;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(renderScroll);
  }, { passive: true });
  addEventListener('resize', renderScroll);

  hero?.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--spotlight-x', event.clientX - rect.left + 'px');
    hero.style.setProperty('--spotlight-y', event.clientY - rect.top + 'px');
  }, { passive: true });

  renderScroll();
})();`;

let html = rendered.slice(0, rendered.indexOf("</html>") + 7);
html = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
  .replace(/<link\b[^>]*(?:\/app\/globals\.css|modulepreload)[^>]*>/gi, "")
  .replace(/<meta\b[^>]*(?:property="og:image(?:[^\"]*)?"|name="twitter:image(?:[^\"]*)?")[^>]*>/gi, "")
  .replace(/<link\b[^>]*rel="canonical"[^>]*>/gi, "")
  .replace(/<meta\b[^>]*property="og:url"[^>]*>/gi, "")
  .replace(/<!--\s*-->/g, "")
  .replaceAll('href="/zhuang-shukai-resume.pdf"', `href="${resumeData}"`)
  .replace(
    "</head>",
    `<meta name="generator" content="Codex standalone portfolio export"><style>${inlineStyles}</style></head>`,
  )
  .replace("</body>", `<script>${standaloneScript}</script></body>`);

const outputUrl = new URL("../庄澍凯_高端眼镜新媒体运营作品集.html", root);
await writeFile(outputUrl, html, "utf8");

console.log(fileURLToPath(outputUrl));
