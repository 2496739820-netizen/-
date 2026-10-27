import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { calculateStandingLayout, standingSource } from "../app/components/standing-capability-layout.ts";

test("small-feet production asset keeps the calibrated transparent canvas", async () => {
  const png = await readFile(new URL("../public/zhuang-shukai-shoulder-small-feet.png", import.meta.url));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), standingSource.width);
  assert.equal(png.readUInt32BE(20), standingSource.height);
  assert.equal(png[25], 6, "RGBA color type must retain transparency");
});

for (const [width, height, compact, gutter] of [[600, 530.4, false, 58], [460, 470, false, 34], [660, 550, false, 24], [487, 525, true, 24], [351, 730, true, 19], [281, 700, true, 19]]) {
  test(`shoulder and soles remain anchored at width ${width}`, () => {
    const layout = calculateStandingLayout({ width, height, compact, gutter });
    assert.ok(layout.scale > 0);
    assert.ok(Math.abs(layout.imageTop + standingSource.soleY * layout.scale - layout.cardHeight) < 1e-7);
    assert.ok(Math.abs(layout.imageLeft + standingSource.shoulderX * layout.scale - layout.cardLeft) < 1e-7);
    assert.ok(layout.imageTop + standingSource.top * layout.scale >= 0);
    assert.ok(layout.imageLeft + standingSource.left * layout.scale >= -Math.max(0, Math.min(30, gutter - 8)) - 1e-7);
    assert.ok((standingSource.soleY - standingSource.top) * layout.scale <= layout.cardHeight * 0.82 + 1e-7);
    assert.equal(layout.flowHeight, height);
    assert.equal(layout.cardLeft + layout.cardWidth, width);
  });
}
