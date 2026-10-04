import assert from "node:assert/strict";
import test from "node:test";
import { calculateStandingLayout, standingSource } from "../app/components/standing-capability-layout.ts";

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
