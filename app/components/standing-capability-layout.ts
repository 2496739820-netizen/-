// Measured opaque silhouette and shoulder anchor in the transparent production PNG.
export const standingSource = {
  width: 1024, height: 1536, left: 264, top: 36,
  shoulderX: 718, shoulderY: 320, soleY: 1420,
};

export function calculateStandingLayout({ width, height, compact, gutter }: {
  width: number; height: number; compact: boolean; gutter: number;
}) {
  const cardWidth = width * (compact ? 0.8 : 0.75);
  const cardLeft = width - cardWidth;
  const cardHeight = compact ? height : height * 0.88;
  const extra = Math.max(0, Math.min(30, gutter - 8));
  const scale = Math.max(0, Math.min(
    (cardLeft + extra) / (standingSource.shoulderX - standingSource.left),
    cardHeight * 0.82 / (standingSource.soleY - standingSource.top),
  ));
  return {
    flowHeight: height, cardWidth, cardLeft, cardHeight, scale,
    imageWidth: standingSource.width * scale,
    imageLeft: cardLeft - standingSource.shoulderX * scale,
    imageTop: cardHeight - standingSource.soleY * scale,
  };
}
