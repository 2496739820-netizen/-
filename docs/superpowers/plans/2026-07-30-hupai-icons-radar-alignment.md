# Hupai Icons, Radar, and Card Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate and QA a 16-icon editorial interaction preview while updating the live portfolio’s capability radar and aligning the three Hupai work cards.

**Architecture:** Keep the icon work isolated under `design/icon-previews/` so no preview raster is shipped into the website UI. Update the radar in its existing `CapabilityRadar` component and solve card alignment with CSS flex/grid rules, preserving the current component data and responsive structure.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Node test runner, built-in image generation, oil-icon slicing scripts, PNG alpha QA, Git/GitHub/Vercel.

---

## File map

- Create `design/icon-previews/hupai-interaction-style.json` — frozen custom icon style specification.
- Create `design/icon-previews/hupai-interaction-editorial-sheet.png` — generated 4×4 source sheet.
- Create `design/icon-previews/hupai-interaction-editorial/` — 16 transparent sliced PNGs.
- Create `design/icon-previews/hupai-interaction-editorial-selected/` — copies of the four selected third-column icons.
- Create `design/icon-previews/hupai-interaction-editorial-qa.png` — QA contact sheet on a contrasting background.
- Modify `app/page.tsx` — capability values, radar coordinates, labels, and accessible description.
- Modify `app/globals.css` — equal-height work-card rules.
- Modify `tests/rendered-html.test.mjs` — regression coverage for the radar values and card alignment.

### Task 1: Freeze the icon style and generate the 4×4 sheet

**Files:**
- Create: `design/icon-previews/hupai-interaction-style.json`
- Create: `design/icon-previews/hupai-interaction-editorial-sheet.png`

- [ ] **Step 1: Create the frozen brand style specification**

Create `design/icon-previews/hupai-interaction-style.json`:

```json
{
  "name": "hupai-interaction-editorial",
  "label": "虎派互动数据编辑线稿",
  "preamble": "Refined editorial line icons for a warm high-end eyewear portfolio. Uniform medium-thin outline, rounded caps and joins, no fill, no isolated circles or dot decorations, calm geometric construction, flat front-facing view.",
  "palette": ["#695538", "#8A7349"],
  "cutout": "floodfill",
  "thresh": 30,
  "construction": {
    "grid": "24-unit keyline; live area 72%; generous equal padding; optical sizing",
    "stroke": "uniform 1.75 units, rounded caps and joins",
    "corner_radius": "one restrained rounded-corner language",
    "angles": "45-degree increments",
    "detail_budget": "one interaction metaphor and no more than four elements",
    "fill_rule": "outline only, no fill",
    "color_rule": "deep brass primary line with optional shorter muted-brass secondary line",
    "shared_parts": "reuse one canonical heart, bookmark, speech-tail, and arrowhead geometry",
    "perspective": "flat front-facing",
    "shadow": "none",
    "motif": "a short echo line integrated into the main silhouette, never a detached circle",
    "forbidden": "isolated circles, small dots, labels, numbers, shadows, black fills"
  }
}
```

- [ ] **Step 2: Compose the exact generation prompt**

Use this prompt with the built-in image generator:

```text
Use case: logo-brand
Asset type: 4x4 interaction icon direction sheet for a warm editorial portfolio
Primary request: Create sixteen cohesive interaction icons in a refined editorial line style.
Style/medium: uniform medium-thin outline icons, flat front-facing, rounded caps and joins, no fill.
Construction: one 24-unit keyline system, 72% live area, generous equal padding, consistent rounded corners, 45-degree geometry, one clear metaphor per icon, no more than four elements. Reuse canonical heart, bookmark, speech-tail, and arrowhead shapes. A short echo line may be integrated into the silhouette, but never use detached circles or dot decorations.
Color palette: use only #695538 and #8A7349 for icon strokes. Do not use black. Keep #695538 visually dominant.
The 16 icons in row-major order:
1. simple heart outline;
2. heart outline with one short inner echo stroke;
3. heart outline with a small integrated downward echo chevron;
4. heart outline with one short horizontal accent stroke above it;
5. simple bookmark outline;
6. bookmark outline with one short horizontal detail;
7. bookmark outline with an integrated five-point star;
8. offset double-ribbon bookmark outline;
9. simple single speech bubble;
10. speech bubble with two short text strokes;
11. two overlapping speech bubbles;
12. editorial speech bubble with two short text strokes;
13. curved share arrow;
14. paper plane outline;
15. upward share arrow emerging from an open tray;
16. two interlocking chain links.
Each icon must be immediately recognizable as like, save, comment, or share according to its row.
Absolutely no isolated circles, circular badges, dots, ellipses used as decoration, text, labels, numbers, fills, shadows, gradients, or 3D effects.
A neat 4x4 grid on a perfectly uniform solid flat medium-grey background, exact hex #808080. The background must have no gradient, no vignette, no lighting, no texture, no paper grain, and no shadow. Even and generous equal gaps between every cell so icons never touch, each icon centered in its own cell, all icons the same size. No grid lines, no borders, no frames, no text, no labels, no numbers, and no drop shadow cast onto the grey background. Square image.
```

- [ ] **Step 3: Generate and save the sheet**

Use the built-in image-generation tool once. Copy the resulting PNG to:

```text
design/icon-previews/hupai-interaction-editorial-sheet.png
```

Expected: one square image containing exactly 16 icons on a uniform `#808080` background.

- [ ] **Step 4: Inspect the source sheet**

Verify:

- four icons per row and four rows;
- no missing or extra cells;
- no detached circles or dot decorations;
- line color stays within deep/muted brass;
- gutters are clear enough for slicing.

If the layout or forbidden-circle constraint fails, regenerate once with a targeted correction rather than editing the sheet manually.

- [ ] **Step 5: Commit the source assets**

```bash
git add design/icon-previews/hupai-interaction-style.json \
  design/icon-previews/hupai-interaction-editorial-sheet.png
git commit -m "Add Hupai interaction icon direction sheet"
```

### Task 2: Slice and QA the 16 icons

**Files:**
- Create: `design/icon-previews/hupai-interaction-editorial/*.png`
- Create: `design/icon-previews/hupai-interaction-editorial-selected/*.png`
- Create: `design/icon-previews/hupai-interaction-editorial-qa.png`

- [ ] **Step 1: Prepare the oil-icon runtime**

Run:

```bash
cd /Users/baiyexia/.codex/skills/oil-icon
./scripts/setup.sh
```

Expected: `.venv/bin/python3` and required slicing packages are available.

- [ ] **Step 2: Slice all 16 cells**

Run:

```bash
cd /Users/baiyexia/.codex/skills/oil-icon
.venv/bin/python3 scripts/slice_icons.py \
  "/Users/baiyexia/Documents/个人网站 2/site/design/icon-previews/hupai-interaction-editorial-sheet.png" \
  "/Users/baiyexia/Documents/个人网站 2/site/design/icon-previews/hupai-interaction-editorial" \
  --mode floodfill \
  --thresh 30 \
  --grid 4 \
  --count 16
```

Expected: 16 transparent PNGs, one per grid cell.

- [ ] **Step 3: Name and copy the selected third column**

The selected row-major indexes are 3, 7, 11, and 15. Copy them into:

```text
design/icon-previews/hupai-interaction-editorial-selected/like.png
design/icon-previews/hupai-interaction-editorial-selected/save.png
design/icon-previews/hupai-interaction-editorial-selected/comment.png
design/icon-previews/hupai-interaction-editorial-selected/share.png
```

Use the actual output filenames produced by `slice_icons.py`; do not assume zero-based numbering without checking the directory.

- [ ] **Step 4: Create a contrasting QA contact sheet**

Use Pillow to place the 16 transparent PNGs in a 4×4 layout on solid magenta `#FF00FF`, with equal gutters, and save:

```text
design/icon-previews/hupai-interaction-editorial-qa.png
```

The QA sheet must not change the individual transparent PNGs.

- [ ] **Step 5: Visually inspect all icons**

Check every cell for:

- neighbour bleed;
- residual `#808080`;
- clipped strokes;
- inconsistent line weights;
- small detached circles or dots;
- mismatched optical scale.

If only slicing fails, adjust `--thresh` or slicing; if icon construction fails, regenerate the full source sheet.

- [ ] **Step 6: Commit the sliced deliverables**

```bash
git add design/icon-previews/hupai-interaction-editorial \
  design/icon-previews/hupai-interaction-editorial-selected \
  design/icon-previews/hupai-interaction-editorial-qa.png
git commit -m "Slice and verify Hupai interaction icons"
```

### Task 3: Update the capability radar with regression tests

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/page.tsx`

- [ ] **Step 1: Update tests to require the new capability values**

Replace the old source assertions:

```js
assert.match(page, /内容策划.{0,30}score: 9/s);
assert.match(page, /平台投流.{0,30}score: 7/s);
```

with:

```js
assert.match(page, /内容策划.{0,30}score: 8/s);
assert.match(page, /账号运营.{0,30}score: 8/s);
assert.match(page, /到店转化.{0,30}score: 8/s);
assert.match(page, /影像制作.{0,30}score: 10/s);
assert.match(page, /数据复盘.{0,30}score: 8/s);
assert.match(page, /平台投流.{0,30}score: 9/s);
assert.match(page, /points="260,102 350\.1,153 350\.1,257 260,334 169\.9,257 158\.7,146\.5"/);
assert.match(page, /points="260,102 350\.1,153 350\.1,257 260,334 169\.9,257 158\.7,146\.5 260,102"/);
assert.match(page, /内容策划八分、账号运营八分、到店转化八分、影像制作十分、数据复盘八分、平台投流九分/);
```

- [ ] **Step 2: Run the test and verify failure**

Run:

```bash
pnpm test
```

Expected: the radar assertions fail because `app/page.tsx` still contains the old scores and coordinates.

- [ ] **Step 3: Update `capabilities`**

Change the array in `app/page.tsx` to:

```ts
const capabilities = [
  { label: "内容策划", score: 8 },
  { label: "账号运营", score: 8 },
  { label: "到店转化", score: 8 },
  { label: "影像制作", score: 10 },
  { label: "数据复盘", score: 8 },
  { label: "平台投流", score: 9 },
];
```

- [ ] **Step 4: Update the accessible radar description**

Use:

```tsx
<desc id="radar-svg-desc">
  内容策划八分、账号运营八分、到店转化八分、影像制作十分、数据复盘八分、平台投流九分。
</desc>
```

- [ ] **Step 5: Update the polygon, polyline, and point circles**

Use:

```tsx
<polygon
  className="radar-area"
  points="260,102 350.1,153 350.1,257 260,334 169.9,257 158.7,146.5"
/>
<polyline
  className="radar-stroke"
  points="260,102 350.1,153 350.1,257 260,334 169.9,257 158.7,146.5 260,102"
/>
```

Use matching circles:

```tsx
<circle cx="260" cy="102" r="5" />
<circle cx="350.1" cy="153" r="5" />
<circle cx="350.1" cy="257" r="5" />
<circle cx="260" cy="334" r="5" />
<circle cx="169.9" cy="257" r="5" />
<circle cx="158.7" cy="146.5" r="5" />
```

- [ ] **Step 6: Update the visible score labels**

Keep the existing label positions and change only the values to:

```text
内容策划 8
账号运营 8
到店转化 8
影像制作 10
数据复盘 8
平台投流 9
```

- [ ] **Step 7: Run the tests and verify pass**

Run:

```bash
pnpm test
```

Expected: all existing and new radar assertions pass.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx tests/rendered-html.test.mjs
git commit -m "Update portfolio capability radar"
```

### Task 4: Align the three Hupai work cards with regression tests

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/globals.css`

- [ ] **Step 1: Add CSS regression assertions**

In the Hupai style test, add:

```js
assert.match(css, /\.hupai-work-grid\s*\{[\s\S]*?align-items:\s*stretch/);
assert.match(css, /\.hupai-work-card\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*column/);
assert.match(css, /\.hupai-work-content\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex:\s*1;[\s\S]*?flex-direction:\s*column/);
assert.match(css, /\.hupai-work-content\s*>\s*a\s*\{[\s\S]*?margin-top:\s*auto/);
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
pnpm test
```

Expected: the four new CSS assertions fail against the current `align-items: start` and non-flex card content.

- [ ] **Step 3: Implement the minimal desktop equal-height rules**

Change the relevant rules in `app/globals.css` to:

```css
.hupai-work-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) repeat(2, minmax(0, 0.825fr));
  gap: clamp(14px, 1.6vw, 22px);
  align-items: stretch;
  margin-top: 22px;
}

.hupai-work-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--paper);
}

.hupai-work-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: clamp(19px, 2vw, 27px);
}

.hupai-work-content > a {
  display: inline-flex;
  width: fit-content;
  min-height: 44px;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  color: var(--gold-deep);
  font-size: 0.84rem;
  font-weight: 600;
}
```

- [ ] **Step 4: Preserve natural stacking on mobile**

Inside `@media (max-width: 620px)`, add:

```css
.hupai-work-card { min-height: 0; }
```

No fixed card height may be introduced.

- [ ] **Step 5: Run tests and verify pass**

Run:

```bash
pnpm test
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css tests/rendered-html.test.mjs
git commit -m "Align Hupai portfolio cards"
```

### Task 5: Browser and production verification

**Files:**
- No source changes expected.

- [ ] **Step 1: Run the full verification suite**

Run:

```bash
pnpm test
pnpm lint
git diff --check
```

Expected:

- production build succeeds;
- all Node tests pass;
- ESLint reports zero errors;
- any pre-existing font warning is recorded but not expanded into unrelated work;
- `git diff --check` is clean.

- [ ] **Step 2: Start the production server**

Run:

```bash
pnpm start --port 3100
```

- [ ] **Step 3: Verify desktop**

At 1440×1000:

- all three work-card bottoms align;
- all three “查看原笔记” links align;
- first card remains wider;
- radar shows 8, 8, 8, 10, 8, 9;
- radar polygon’s bottom point reaches the outer grid and the upper-left point represents platform advertising at 9.

- [ ] **Step 4: Verify tablet and mobile**

At 900×900 and 390×844:

- no horizontal overflow;
- the first card’s tablet row does not create excessive blank space;
- mobile cards retain natural height;
- radar remains contained and accessible values show `/10`.

- [ ] **Step 5: Stop the local server**

Terminate the server process cleanly.

### Task 6: Publish and verify the existing site

**Files:**
- No additional source changes expected.

- [ ] **Step 1: Confirm the final repository state**

Run:

```bash
git status --short
git log --oneline -6
```

Expected: clean tree; the icon, radar, and alignment commits are present.

- [ ] **Step 2: Push `main`**

Use the repository’s existing SSH key:

```bash
GIT_SSH_COMMAND="ssh -i /Users/baiyexia/.ssh/codex_github_2496739820_netizen -o IdentitiesOnly=yes" \
  git push origin main
```

- [ ] **Step 3: Verify deployment**

Poll:

```bash
curl -L --max-time 20 -sS https://baiyexia.top/
```

Confirm the returned HTML contains the new capability description:

```text
内容策划八分、账号运营八分、到店转化八分、影像制作十分、数据复盘八分、平台投流九分
```

- [ ] **Step 4: Report deliverables**

Report:

- full icon sheet and selected icon paths;
- that the icons were not applied to the UI;
- radar values and card alignment result;
- test/build/lint result;
- commit SHA and live URL.
