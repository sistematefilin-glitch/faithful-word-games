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
// GEOMETRY - Classic jigsaw with PRONOUNCED head and NARROW neck
// ============================================================================
const TAB_DEPTH = 20;      // How far the tab protrudes
const NECK_WIDTH = 8;      // Very narrow neck for classic look
const HEAD_RADIUS = 14;    // Large rounded head
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
// CLASSIC JIGSAW TAB/SLOT - Pronounced circular head with narrow neck
// Uses quadratic and cubic bezier for smooth organic curves
// ============================================================================

/**
 * Creates a classic jigsaw tab/slot shape with:
 * - Gradual shoulder transition
 * - Very narrow neck (waist)
 * - Large circular head
 */
function createTabPath(
  sign: number,
  isHorizontal: boolean,
  isReversed: boolean
): string {
  if (sign === 0) {
    return isHorizontal 
      ? (isReversed ? `L 0 100` : `L 100 0`)
      : (isReversed ? `L 0 0` : `L 100 100`);
  }

  const d = sign * TAB_DEPTH;
  const neckHalf = NECK_WIDTH / 2;
  const headR = HEAD_RADIUS;

  // Key points along the edge (0 to 100)
  const shoulderStart = 32;   // Where shoulder curve begins
  const neckPoint = 50;       // Center/narrowest point
  const shoulderEnd = 68;     // Where shoulder curve ends

  if (isHorizontal) {
    // TOP edge: (0,0) → (100,0), or BOTTOM reversed: (100,100) → (0,100)
    const y = isReversed ? 100 : 0;
    const dir = isReversed ? 1 : 1;  // Tab direction relative to edge
    
    const tabY = y + d * dir;
    const headTopY = y + (d + headR * 0.4) * dir;

    if (isReversed) {
      // Bottom edge goes right to left
      return [
        `L ${shoulderEnd} ${y}`,
        // Right shoulder curve down/up to neck
        `Q ${shoulderEnd - 2} ${y + d * 0.25 * dir}, ${neckPoint + neckHalf} ${y + d * 0.5 * dir}`,
        // Right side of neck to head
        `Q ${neckPoint + neckHalf + 2} ${tabY - headR * 0.2 * dir}, ${neckPoint + headR} ${tabY}`,
        // Head arc (circular top)
        `A ${headR} ${headR * 0.9} 0 1 ${dir > 0 ? 1 : 0} ${neckPoint - headR} ${tabY}`,
        // Left side of head back to neck
        `Q ${neckPoint - neckHalf - 2} ${tabY - headR * 0.2 * dir}, ${neckPoint - neckHalf} ${y + d * 0.5 * dir}`,
        // Left neck back to shoulder
        `Q ${shoulderStart + 2} ${y + d * 0.25 * dir}, ${shoulderStart} ${y}`,
        `L 0 ${y}`,
      ].join(" ");
    } else {
      // Top edge goes left to right
      return [
        `L ${shoulderStart} ${y}`,
        // Left shoulder curve
        `Q ${shoulderStart + 2} ${y + d * 0.25}, ${neckPoint - neckHalf} ${y + d * 0.5}`,
        // Left neck to head
        `Q ${neckPoint - neckHalf - 2} ${tabY - headR * 0.2 * Math.sign(d)}, ${neckPoint - headR} ${tabY}`,
        // Head arc
        `A ${headR} ${headR * 0.9} 0 1 ${d < 0 ? 1 : 0} ${neckPoint + headR} ${tabY}`,
        // Right head back to neck
        `Q ${neckPoint + neckHalf + 2} ${tabY - headR * 0.2 * Math.sign(d)}, ${neckPoint + neckHalf} ${y + d * 0.5}`,
        // Right neck to shoulder
        `Q ${shoulderEnd - 2} ${y + d * 0.25}, ${shoulderEnd} ${y}`,
        `L 100 ${y}`,
      ].join(" ");
    }
  } else {
    // RIGHT edge: (100,0) → (100,100), or LEFT reversed: (0,100) → (0,0)
    const x = isReversed ? 0 : 100;
    const dir = isReversed ? -1 : 1;
    
    const tabX = x + d * dir;

    if (isReversed) {
      // Left edge goes bottom to top
      return [
        `L ${x} ${shoulderEnd}`,
        // Bottom shoulder
        `Q ${x + d * 0.25 * dir} ${shoulderEnd - 2}, ${x + d * 0.5 * dir} ${neckPoint + neckHalf}`,
        // Bottom neck to head
        `Q ${tabX - headR * 0.2 * dir} ${neckPoint + neckHalf + 2}, ${tabX} ${neckPoint + headR}`,
        // Head arc
        `A ${headR * 0.9} ${headR} 0 1 ${d > 0 ? 0 : 1} ${tabX} ${neckPoint - headR}`,
        // Top head to neck
        `Q ${tabX - headR * 0.2 * dir} ${neckPoint - neckHalf - 2}, ${x + d * 0.5 * dir} ${neckPoint - neckHalf}`,
        // Top neck to shoulder
        `Q ${x + d * 0.25 * dir} ${shoulderStart + 2}, ${x} ${shoulderStart}`,
        `L ${x} 0`,
      ].join(" ");
    } else {
      // Right edge goes top to bottom
      return [
        `L ${x} ${shoulderStart}`,
        // Top shoulder
        `Q ${x + d * 0.25} ${shoulderStart + 2}, ${x + d * 0.5} ${neckPoint - neckHalf}`,
        // Top neck to head
        `Q ${tabX - headR * 0.2 * Math.sign(d)} ${neckPoint - neckHalf - 2}, ${tabX} ${neckPoint - headR}`,
        // Head arc
        `A ${headR * 0.9} ${headR} 0 1 ${d > 0 ? 1 : 0} ${tabX} ${neckPoint + headR}`,
        // Bottom head to neck
        `Q ${tabX - headR * 0.2 * Math.sign(d)} ${neckPoint + neckHalf + 2}, ${x + d * 0.5} ${neckPoint + neckHalf}`,
        // Bottom neck to shoulder
        `Q ${x + d * 0.25} ${shoulderEnd - 2}, ${x} ${shoulderEnd}`,
        `L ${x} 100`,
      ].join(" ");
    }
  }
}

function edgeTop(sign: number): string {
  return createTabPath(sign, true, false);
}

function edgeRight(sign: number): string {
  return createTabPath(sign, false, false);
}

function edgeBottom(sign: number): string {
  return createTabPath(sign, true, true);
}

function edgeLeft(sign: number): string {
  return createTabPath(sign, false, true);
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
        {/* Strong shadow for cardboard depth */}
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

      {/* Thick cardboard-style border with shadow */}
      {!disableClip && (
        <path
          d={d}
          fill="none"
          stroke="#3d2817"
          strokeWidth={3}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
        />
      )}
    </svg>
  );
});
