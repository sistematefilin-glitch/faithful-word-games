import React, { memo, useId } from "react";

type Edge = "top" | "right" | "bottom" | "left";

type Props = {
  pieceId: number;
  gridSize?: number;
  imageUrl?: string | null;
  /** column of this piece in the source image grid (0..gridSize-1) */
  pieceCol: number;
  /** row of this piece in the source image grid (0..gridSize-1) */
  pieceRow: number;
  /** when true, render as a plain square (used for the merge/reveal phase) */
  disableClip?: boolean;
  className?: string;
};

// Professional jigsaw path (0..100 viewBox). Uses smooth cubic Bézier curves.
// sign:  0 = flat edge,  1 = tab (outward), -1 = slot (inward)
function getEdgeSign(row: number, col: number, gridSize: number, edge: Edge): number {
  const isTop = row === 0;
  const isBottom = row === gridSize - 1;
  const isLeft = col === 0;
  const isRight = col === gridSize - 1;

  // Outer borders are flat.
  if (edge === "top" && isTop) return 0;
  if (edge === "bottom" && isBottom) return 0;
  if (edge === "left" && isLeft) return 0;
  if (edge === "right" && isRight) return 0;

  // Deterministic interlock:
  // - For a vertical connection (right/left), use (row+col) parity
  // - For a horizontal connection (bottom/top), use inverse parity to vary patterns
  const parity = (row + col) % 2 === 0;

  if (edge === "right") return parity ? 1 : -1;
  if (edge === "bottom") return parity ? -1 : 1;
  if (edge === "left") {
    // Must be opposite of the neighbor's right
    const neighborParity = (row + (col - 1)) % 2 === 0;
    return neighborParity ? -1 : 1;
  }
  // top
  const neighborParity = ((row - 1) + col) % 2 === 0;
  return neighborParity ? 1 : -1; // opposite of neighbor's bottom
}

function edgeTop(sign: number) {
  if (sign === 0) return `L 100 0`;

  // Geometry tuned for a classic jigsaw look.
  const tabW = 34;
  const tabD = 18;
  const neckW = 14;
  const cx = 50;
  const x1 = cx - tabW / 2;
  const x2 = cx - neckW / 2;
  const x3 = cx + neckW / 2;
  const x4 = cx + tabW / 2;
  const y = 0;
  const d = sign * tabD; // tab is negative (outwards), slot is positive (inwards)

  // Smooth shoulders + rounded head.
  return [
    `L ${x1} ${y}`,
    `C ${x1 + 6} ${y} ${x2 - 6} ${y + d * 0.55} ${x2} ${y + d * 0.62}`,
    `C ${x2 + 2} ${y + d * 1.05} ${x3 - 2} ${y + d * 1.05} ${x3} ${y + d * 0.62}`,
    `C ${x3 + 6} ${y + d * 0.55} ${x4 - 6} ${y} ${x4} ${y}`,
    `L 100 0`,
  ].join(" ");
}

function edgeRight(sign: number) {
  if (sign === 0) return `L 100 100`;

  const tabW = 34;
  const tabD = 18;
  const neckW = 14;
  const cy = 50;
  const y1 = cy - tabW / 2;
  const y2 = cy - neckW / 2;
  const y3 = cy + neckW / 2;
  const y4 = cy + tabW / 2;
  const x = 100;
  const d = sign * tabD; // outward is + for right edge

  return [
    `L ${x} ${y1}`,
    `C ${x} ${y1 + 6} ${x + d * 0.55} ${y2 - 6} ${x + d * 0.62} ${y2}`,
    `C ${x + d * 1.05} ${y2 + 2} ${x + d * 1.05} ${y3 - 2} ${x + d * 0.62} ${y3}`,
    `C ${x + d * 0.55} ${y3 + 6} ${x} ${y4 - 6} ${x} ${y4}`,
    `L 100 100`,
  ].join(" ");
}

function edgeBottom(sign: number) {
  if (sign === 0) return `L 0 100`;

  const tabW = 34;
  const tabD = 18;
  const neckW = 14;
  const cx = 50;
  const x1 = cx + tabW / 2;
  const x2 = cx + neckW / 2;
  const x3 = cx - neckW / 2;
  const x4 = cx - tabW / 2;
  const y = 100;
  const d = sign * tabD; // outward is + for bottom edge

  return [
    `L ${x1} ${y}`,
    `C ${x1 - 6} ${y} ${x2 + 6} ${y + d * 0.55} ${x2} ${y + d * 0.62}`,
    `C ${x2 - 2} ${y + d * 1.05} ${x3 + 2} ${y + d * 1.05} ${x3} ${y + d * 0.62}`,
    `C ${x3 - 6} ${y + d * 0.55} ${x4 + 6} ${y} ${x4} ${y}`,
    `L 0 100`,
  ].join(" ");
}

function edgeLeft(sign: number) {
  if (sign === 0) return `L 0 0`;

  const tabW = 34;
  const tabD = 18;
  const neckW = 14;
  const cy = 50;
  const y1 = cy + tabW / 2;
  const y2 = cy + neckW / 2;
  const y3 = cy - neckW / 2;
  const y4 = cy - tabW / 2;
  const x = 0;
  const d = sign * tabD; // outward is - for left edge

  return [
    `L ${x} ${y1}`,
    `C ${x} ${y1 - 6} ${x + d * 0.55} ${y2 + 6} ${x + d * 0.62} ${y2}`,
    `C ${x + d * 1.05} ${y2 - 2} ${x + d * 1.05} ${y3 + 2} ${x + d * 0.62} ${y3}`,
    `C ${x + d * 0.55} ${y3 - 6} ${x} ${y4 + 6} ${x} ${y4}`,
    `L 0 0`,
  ].join(" ");
}

function getJigsawPathD(pieceId: number, gridSize: number) {
  const row = Math.floor(pieceId / gridSize);
  const col = pieceId % gridSize;

  // SVG coordinate system: y grows downward.
  // For "top" edge, outward means negative y; for right/bottom outward is positive; for left outward is negative x.
  // We bake this into the sign per-edge by flipping where needed.
  const top = -getEdgeSign(row, col, gridSize, "top");
  const right = getEdgeSign(row, col, gridSize, "right");
  const bottom = getEdgeSign(row, col, gridSize, "bottom");
  const left = -getEdgeSign(row, col, gridSize, "left");

  return [
    `M 0 0`,
    edgeTop(top),
    edgeRight(right),
    edgeBottom(bottom),
    edgeLeft(left),
    `Z`,
  ].join(" ");
}

export const PuzzlePieceSvg = memo(function PuzzlePieceSvg({
  pieceId,
  gridSize = 5,
  imageUrl,
  pieceCol,
  pieceRow,
  disableClip,
  className,
}: Props) {
  const uid = useId();
  const clipId = `jigsaw-clip-${uid}-${pieceId}`;

  const d = getJigsawPathD(pieceId, gridSize);

  // Render the full image in a 5x5 coordinate space (0..500), then shift to show the correct tile.
  const full = gridSize * 100;
  const x = -pieceCol * 100;
  const y = -pieceRow * 100;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-label={`Peça ${pieceId + 1}`}
      role="img"
      preserveAspectRatio="none"
    >
      {!disableClip && (
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={d} />
          </clipPath>
        </defs>
      )}

      {imageUrl ? (
        <image
          href={imageUrl}
          x={x}
          y={y}
          width={full}
          height={full}
          preserveAspectRatio="none"
          clipPath={disableClip ? undefined : `url(#${clipId})`}
        />
      ) : (
        <rect
          x={0}
          y={0}
          width={100}
          height={100}
          clipPath={disableClip ? undefined : `url(#${clipId})`}
          fill="hsl(var(--muted))"
        />
      )}

      {/* Subtle outline for a more "physical" feel */}
      {!disableClip && (
        <path
          d={d}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1.25}
          opacity={0.85}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
});
