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

// ============================================================================
// GEOMETRY CONSTANTS - Classic jigsaw "shoulders + neck + head" anatomy
// ============================================================================
const TAB_WIDTH = 40;      // Total width of the tab area
const TAB_DEPTH = 22;      // How far the tab protrudes
const NECK_WIDTH = 12;     // Narrow neck for classic contrast
const HEAD_WIDTH = 24;     // Wide rounded head
const CENTER = 50;         // Center point in 0-100 coordinate system

// Pre-calculated key points
const SHOULDER_L = CENTER - TAB_WIDTH / 2;  // 30
const NECK_L = CENTER - NECK_WIDTH / 2;     // 44
const NECK_R = CENTER + NECK_WIDTH / 2;     // 56
const SHOULDER_R = CENTER + TAB_WIDTH / 2;  // 70

// ============================================================================
// EDGE SIGN CALCULATION - Determines tab/slot direction for interlocking
// ============================================================================
function getEdgeSign(row: number, col: number, gridSize: number, edge: Edge): number {
  const isTop = row === 0;
  const isBottom = row === gridSize - 1;
  const isLeft = col === 0;
  const isRight = col === gridSize - 1;

  // Outer borders are flat
  if (edge === "top" && isTop) return 0;
  if (edge === "bottom" && isBottom) return 0;
  if (edge === "left" && isLeft) return 0;
  if (edge === "right" && isRight) return 0;

  // Deterministic interlock based on position parity
  const parity = (row + col) % 2 === 0;

  if (edge === "right") return parity ? 1 : -1;
  if (edge === "bottom") return parity ? -1 : 1;
  if (edge === "left") {
    const neighborParity = (row + (col - 1)) % 2 === 0;
    return neighborParity ? -1 : 1;
  }
  // top
  const neighborParity = ((row - 1) + col) % 2 === 0;
  return neighborParity ? 1 : -1;
}

// ============================================================================
// 6-CURVE BEZIER EDGE FUNCTIONS - Classic "Shoulders & Head" anatomy
// ============================================================================

/**
 * TOP edge: goes from (0,0) to (100,0)
 * sign: 0 = flat, positive = tab going up (negative Y), negative = slot going down
 */
function edgeTop(sign: number): string {
  if (sign === 0) return `L 100 0`;

  const d = sign * TAB_DEPTH;
  const headW = HEAD_WIDTH;

  return [
    // Line to left shoulder
    `L ${SHOULDER_L} 0`,
    // Curve 1: Left shoulder → left neck (smooth transition)
    `C ${SHOULDER_L + 4} 0, ${NECK_L - 2} ${d * 0.3}, ${NECK_L} ${d * 0.45}`,
    // Curve 2: Left neck → left head (narrowing into head)
    `C ${NECK_L + 2} ${d * 0.6}, ${CENTER - headW / 2} ${d * 0.95}, ${CENTER - headW / 2} ${d}`,
    // Curve 3: Left head → right head (rounded top)
    `C ${CENTER - headW / 4} ${d * 1.12}, ${CENTER + headW / 4} ${d * 1.12}, ${CENTER + headW / 2} ${d}`,
    // Curve 4: Right head → right neck
    `C ${CENTER + headW / 2} ${d * 0.95}, ${NECK_R - 2} ${d * 0.6}, ${NECK_R} ${d * 0.45}`,
    // Curve 5: Right neck → right shoulder
    `C ${NECK_R + 2} ${d * 0.3}, ${SHOULDER_R - 4} 0, ${SHOULDER_R} 0`,
    // Line to end
    `L 100 0`,
  ].join(" ");
}

/**
 * RIGHT edge: goes from (100,0) to (100,100)
 * sign: positive = tab going right (positive X), negative = slot going left
 */
function edgeRight(sign: number): string {
  if (sign === 0) return `L 100 100`;

  const d = sign * TAB_DEPTH;
  const headW = HEAD_WIDTH;

  // For right edge, we work with Y coordinates instead of X
  const shoulderT = SHOULDER_L;  // 30 (top shoulder)
  const neckT = NECK_L;          // 44
  const neckB = NECK_R;          // 56
  const shoulderB = SHOULDER_R;  // 70

  return [
    // Line to top shoulder
    `L 100 ${shoulderT}`,
    // Curve 1: Top shoulder → top neck
    `C 100 ${shoulderT + 4}, ${100 + d * 0.3} ${neckT - 2}, ${100 + d * 0.45} ${neckT}`,
    // Curve 2: Top neck → top head
    `C ${100 + d * 0.6} ${neckT + 2}, ${100 + d * 0.95} ${CENTER - headW / 2}, ${100 + d} ${CENTER - headW / 2}`,
    // Curve 3: Top head → bottom head (rounded)
    `C ${100 + d * 1.12} ${CENTER - headW / 4}, ${100 + d * 1.12} ${CENTER + headW / 4}, ${100 + d} ${CENTER + headW / 2}`,
    // Curve 4: Bottom head → bottom neck
    `C ${100 + d * 0.95} ${CENTER + headW / 2}, ${100 + d * 0.6} ${neckB - 2}, ${100 + d * 0.45} ${neckB}`,
    // Curve 5: Bottom neck → bottom shoulder
    `C ${100 + d * 0.3} ${neckB + 2}, 100 ${shoulderB - 4}, 100 ${shoulderB}`,
    // Line to end
    `L 100 100`,
  ].join(" ");
}

/**
 * BOTTOM edge: goes from (100,100) to (0,100) - REVERSED direction
 * sign: positive = tab going down (positive Y), negative = slot going up
 */
function edgeBottom(sign: number): string {
  if (sign === 0) return `L 0 100`;

  const d = sign * TAB_DEPTH;
  const headW = HEAD_WIDTH;

  // Reversed: we go from right to left
  return [
    // Line to right shoulder
    `L ${SHOULDER_R} 100`,
    // Curve 1: Right shoulder → right neck
    `C ${SHOULDER_R - 4} 100, ${NECK_R + 2} ${100 + d * 0.3}, ${NECK_R} ${100 + d * 0.45}`,
    // Curve 2: Right neck → right head
    `C ${NECK_R - 2} ${100 + d * 0.6}, ${CENTER + headW / 2} ${100 + d * 0.95}, ${CENTER + headW / 2} ${100 + d}`,
    // Curve 3: Right head → left head (rounded)
    `C ${CENTER + headW / 4} ${100 + d * 1.12}, ${CENTER - headW / 4} ${100 + d * 1.12}, ${CENTER - headW / 2} ${100 + d}`,
    // Curve 4: Left head → left neck
    `C ${CENTER - headW / 2} ${100 + d * 0.95}, ${NECK_L + 2} ${100 + d * 0.6}, ${NECK_L} ${100 + d * 0.45}`,
    // Curve 5: Left neck → left shoulder
    `C ${NECK_L - 2} ${100 + d * 0.3}, ${SHOULDER_L + 4} 100, ${SHOULDER_L} 100`,
    // Line to end
    `L 0 100`,
  ].join(" ");
}

/**
 * LEFT edge: goes from (0,100) to (0,0) - REVERSED direction
 * sign: positive = tab going left (negative X), negative = slot going right
 */
function edgeLeft(sign: number): string {
  if (sign === 0) return `L 0 0`;

  const d = sign * TAB_DEPTH;
  const headW = HEAD_WIDTH;

  // Reversed: we go from bottom to top
  const shoulderB = SHOULDER_R;  // 70 (bottom shoulder)
  const neckB = NECK_R;          // 56
  const neckT = NECK_L;          // 44
  const shoulderT = SHOULDER_L;  // 30

  return [
    // Line to bottom shoulder
    `L 0 ${shoulderB}`,
    // Curve 1: Bottom shoulder → bottom neck
    `C 0 ${shoulderB - 4}, ${-d * 0.3} ${neckB + 2}, ${-d * 0.45} ${neckB}`,
    // Curve 2: Bottom neck → bottom head
    `C ${-d * 0.6} ${neckB - 2}, ${-d * 0.95} ${CENTER + headW / 2}, ${-d} ${CENTER + headW / 2}`,
    // Curve 3: Bottom head → top head (rounded)
    `C ${-d * 1.12} ${CENTER + headW / 4}, ${-d * 1.12} ${CENTER - headW / 4}, ${-d} ${CENTER - headW / 2}`,
    // Curve 4: Top head → top neck
    `C ${-d * 0.95} ${CENTER - headW / 2}, ${-d * 0.6} ${neckT + 2}, ${-d * 0.45} ${neckT}`,
    // Curve 5: Top neck → top shoulder
    `C ${-d * 0.3} ${neckT - 2}, 0 ${shoulderT + 4}, 0 ${shoulderT}`,
    // Line to end
    `L 0 0`,
  ].join(" ");
}

// ============================================================================
// PATH GENERATION
// ============================================================================
function getJigsawPathD(pieceId: number, gridSize: number): string {
  const row = Math.floor(pieceId / gridSize);
  const col = pieceId % gridSize;

  // SVG coordinate system: y grows downward
  // For "top" edge, outward means negative y; for right/bottom outward is positive; for left outward is negative x
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

  // Render the full image in a gridSize*100 coordinate space, then shift to show the correct tile
  const full = gridSize * 100;
  const x = -pieceCol * 100;
  const y = -pieceRow * 100;

  return (
    <svg
      viewBox="-5 -5 110 110"
      className={className}
      aria-label={`Peça ${pieceId + 1}`}
      role="img"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Shadow filter for 3D depth effect */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow 
            dx="1" 
            dy="2" 
            stdDeviation="1.5" 
            floodColor="hsl(30, 20%, 15%)"
            floodOpacity="0.35"
          />
        </filter>

        {/* Clip path for the jigsaw shape */}
        {!disableClip && (
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={d} />
          </clipPath>
        )}
      </defs>

      {/* Image or placeholder */}
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

      {/* Marked border with shadow - cardboard style */}
      {!disableClip && (
        <path
          d={d}
          fill="none"
          stroke="hsl(30, 25%, 30%)"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
      )}
    </svg>
  );
});
