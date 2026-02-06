import React, { memo, useId } from "react";

type Edge = "top" | "right" | "bottom" | "left";

type Props = {
  pieceId: number;
  gridSize?: number;
  imageUrl?: string | null;
  pieceCol: number;
  pieceRow: number;
  disableClip?: boolean;
  className?: string;
};

// ============================================================================
// GEOMETRY - Real jigsaw tab using only Cubic Bézier (C) curves
// ============================================================================
const TAB_SIZE = 20;
const CENTER = 50;

// ============================================================================
// EDGE SIGN CALCULATION
// ============================================================================
function getEdgeSign(row: number, col: number, gridSize: number, edge: Edge): number {
  const isTop = row === 0;
  const isBottom = row === gridSize - 1;
  const isLeft = col === 0;
  const isRight = col === gridSize - 1;

  if (edge === "top" && isTop) return 0;
  if (edge === "bottom" && isBottom) return 0;
  if (edge === "left" && isLeft) return 0;
  if (edge === "right" && isRight) return 0;

  const parity = (row + col) % 2 === 0;

  if (edge === "right") return parity ? 1 : -1;
  if (edge === "bottom") return parity ? -1 : 1;
  if (edge === "left") {
    const neighborParity = (row + (col - 1)) % 2 === 0;
    return neighborParity ? -1 : 1;
  }
  const neighborParity = ((row - 1) + col) % 2 === 0;
  return neighborParity ? 1 : -1;
}

// ============================================================================
// REALISTIC TAB using 7 Cubic Bézier curves
// Horizontal tab points (sign=1 means tab protrudes in -Y direction for top)
// ============================================================================

/**
 * Returns an array of [x, y] control points for a horizontal tab.
 * sign: 1 = tab goes outward (negative Y for top edge), -1 = slot (inward)
 * The path starts at (35, 0) and ends at (65, 0) relative to edge baseline.
 */
function horizontalTabCurves(sign: number): string {
  if (sign === 0) return "";

  const s = sign;
  const d = TAB_SIZE;

  // All Y values are multiplied by -sign*d/20 to scale and flip direction
  const sy = (v: number) => s * v * d / 20;

  return [
    // C1: Shoulder left - smooth transition from flat edge
    `C 37,${sy(0)} 38,${sy(3)} 40,${sy(8)}`,
    // C2: Neck left - tapers to narrowest point
    `C 41,${sy(11)} 42,${sy(15)} 43,${sy(16)}`,
    // C3: Head left - expands outward for mushroom shape
    `C 37,${sy(18)} 34,${sy(22)} 38,${sy(25)}`,
    // C4: Head top - wide rounded arc across the top
    `C 42,${sy(28)} 58,${sy(28)} 62,${sy(25)}`,
    // C5: Head right - contracts back
    `C 66,${sy(22)} 63,${sy(18)} 57,${sy(16)}`,
    // C6: Neck right - tapers back
    `C 58,${sy(15)} 59,${sy(11)} 60,${sy(8)}`,
    // C7: Shoulder right - smooth return to flat edge
    `C 62,${sy(3)} 63,${sy(0)} 65,0`,
  ].join(" ");
}

/**
 * Returns cubic Bézier curves for a vertical tab.
 * This is the horizontal tab rotated 90°: X↔Y swap.
 */
function verticalTabCurves(sign: number): string {
  if (sign === 0) return "";

  const s = sign;
  const d = TAB_SIZE;
  const sx = (v: number) => s * v * d / 20;

  return [
    // C1: Shoulder top
    `C ${sx(0)},37 ${sx(3)},38 ${sx(8)},40`,
    // C2: Neck top
    `C ${sx(11)},41 ${sx(15)},42 ${sx(16)},43`,
    // C3: Head top - expands
    `C ${sx(18)},37 ${sx(22)},34 ${sx(25)},38`,
    // C4: Head arc
    `C ${sx(28)},42 ${sx(28)},58 ${sx(25)},62`,
    // C5: Head bottom - contracts
    `C ${sx(22)},66 ${sx(18)},63 ${sx(16)},57`,
    // C6: Neck bottom
    `C ${sx(15)},58 ${sx(11)},59 ${sx(8)},60`,
    // C7: Shoulder bottom
    `C ${sx(3)},62 ${sx(0)},63 0,65`,
  ].join(" ");
}

// ============================================================================
// EDGE PATH BUILDERS
// ============================================================================

function edgeTop(sign: number): string {
  if (sign === 0) return "L 100,0";
  // Top edge: left to right, tab protrudes upward (negative Y)
  return `L 35,0 ${horizontalTabCurves(-sign)} L 100,0`;
}

function edgeRight(sign: number): string {
  if (sign === 0) return "L 100,100";
  // Right edge: top to bottom, tab protrudes rightward (positive X)
  return `L 100,35 ${verticalTabCurves(sign)} L 100,100`;
}

function edgeBottom(sign: number): string {
  if (sign === 0) return "L 0,100";
  // Bottom edge: right to left, tab protrudes downward (positive Y)
  // We need to reverse the horizontal tab and offset to Y=100
  return `L 65,100 ${horizontalTabReversed(sign)} L 0,100`;
}

function edgeLeft(sign: number): string {
  if (sign === 0) return "L 0,0";
  // Left edge: bottom to top, tab protrudes leftward (negative X)
  return `L 0,65 ${verticalTabReversed(-sign)} L 0,0`;
}

/**
 * Bottom edge goes right-to-left, so we mirror the horizontal tab.
 * Points are reflected: x → (100 - x), and traverse in reverse order.
 * Y baseline is 100.
 */
function horizontalTabReversed(sign: number): string {
  if (sign === 0) return "";

  const s = sign;
  const d = TAB_SIZE;
  const sy = (v: number) => 100 + s * v * d / 20;

  return [
    `C ${63},${sy(0)} ${62},${sy(3)} ${60},${sy(8)}`,
    `C ${59},${sy(11)} ${58},${sy(15)} ${57},${sy(16)}`,
    `C ${63},${sy(18)} ${66},${sy(22)} ${62},${sy(25)}`,
    `C ${58},${sy(28)} ${42},${sy(28)} ${38},${sy(25)}`,
    `C ${34},${sy(22)} ${37},${sy(18)} ${43},${sy(16)}`,
    `C ${42},${sy(15)} ${41},${sy(11)} ${40},${sy(8)}`,
    `C ${38},${sy(3)} ${37},${sy(0)} ${35},100`,
  ].join(" ");
}

/**
 * Left edge goes bottom-to-top, so we mirror the vertical tab.
 * Points are reflected: y → (100 - y), traverse in reverse order.
 * X baseline is 0.
 */
function verticalTabReversed(sign: number): string {
  if (sign === 0) return "";

  const s = sign;
  const d = TAB_SIZE;
  const sx = (v: number) => s * v * d / 20;

  return [
    `C ${sx(0)},63 ${sx(3)},62 ${sx(8)},60`,
    `C ${sx(11)},59 ${sx(15)},58 ${sx(16)},57`,
    `C ${sx(18)},63 ${sx(22)},66 ${sx(25)},62`,
    `C ${sx(28)},58 ${sx(28)},42 ${sx(25)},38`,
    `C ${sx(22)},34 ${sx(18)},37 ${sx(16)},43`,
    `C ${sx(15)},42 ${sx(11)},41 ${sx(8)},40`,
    `C ${sx(3)},38 ${sx(0)},37 0,35`,
  ].join(" ");
}

// ============================================================================
// PATH GENERATION
// ============================================================================
function getJigsawPathD(pieceId: number, gridSize: number): string {
  const row = Math.floor(pieceId / gridSize);
  const col = pieceId % gridSize;

  const top = -getEdgeSign(row, col, gridSize, "top");
  const right = getEdgeSign(row, col, gridSize, "right");
  const bottom = getEdgeSign(row, col, gridSize, "bottom");
  const left = -getEdgeSign(row, col, gridSize, "left");

  return [
    `M 0,0`,
    edgeTop(top),
    edgeRight(right),
    edgeBottom(bottom),
    edgeLeft(left),
    `Z`,
  ].join(" ");
}

// ============================================================================
// COMPONENT
// ============================================================================
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
  const filterId = `piece-shadow-${uid}-${pieceId}`;

  const d = getJigsawPathD(pieceId, gridSize);

  const full = gridSize * 100;
  const x = -pieceCol * 100;
  const y = -pieceRow * 100;

  return (
    <svg
      viewBox="-25 -25 150 150"
      className={className}
      aria-label={`Peça ${pieceId + 1}`}
      role="img"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="2"
            dy="3"
            stdDeviation="2"
            floodColor="#2a1810"
            floodOpacity="0.5"
          />
        </filter>

        {!disableClip && (
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={d} />
          </clipPath>
        )}
      </defs>

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

      {!disableClip && (
        <path
          d={d}
          fill="none"
          stroke="#3d2817"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
      )}
    </svg>
  );
});
