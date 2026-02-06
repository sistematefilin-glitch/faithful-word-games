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
// REALISTIC TAB - 7 Cubic Bézier curves per edge
// Template points define a tab centered at position 50 along a 0-100 edge.
// "along" = the axis parallel to the edge, "out" = perpendicular (tab direction)
// ============================================================================

// Template: along values (0-100 axis), out values (depth)
// Tab starts at along=35, ends at along=65
const TAB_POINTS = {
  // [along, out] for each key point, plus control points
  // C1: flat → shoulder
  c1: { cp1: [37, 0], cp2: [38, 3], end: [40, 8] },
  // C2: shoulder → neck
  c2: { cp1: [41, 11], cp2: [42, 15], end: [43, 16] },
  // C3: neck → head (expands wider than neck)
  c3: { cp1: [37, 18], cp2: [34, 22], end: [38, 25] },
  // C4: head arc (wide rounded top)
  c4: { cp1: [42, 28], cp2: [58, 28], end: [62, 25] },
  // C5: head → neck (contracts)
  c5: { cp1: [66, 22], cp2: [63, 18], end: [57, 16] },
  // C6: neck → shoulder
  c6: { cp1: [58, 15], cp2: [59, 11], end: [60, 8] },
  // C7: shoulder → flat
  c7: { cp1: [62, 3], cp2: [63, 0], end: [65, 0] },
};

/**
 * Generates the 7 cubic Bézier curves for a tab on any edge.
 * 
 * @param sign - 1 for tab (outward), -1 for slot (inward), 0 for flat
 * @param edge - which edge of the piece
 */
function createTabCurves(sign: number, edge: Edge): string {
  if (sign === 0) return "";

  const curves = [
    TAB_POINTS.c1, TAB_POINTS.c2, TAB_POINTS.c3, TAB_POINTS.c4,
    TAB_POINTS.c5, TAB_POINTS.c6, TAB_POINTS.c7,
  ];

  // Transform template [along, out] to actual [x, y] based on edge
  const transform = (along: number, out: number): [number, number] => {
    const depth = sign * out;
    switch (edge) {
      case "top":
        // along = X (left to right), out = -Y (upward)
        return [along, -depth];
      case "bottom":
        // along = X reversed (right to left), out = +Y (downward)
        return [100 - along, 100 + depth];
      case "right":
        // along = Y (top to bottom), out = +X (rightward)
        return [100 + depth, along];
      case "left":
        // along = Y reversed (bottom to top), out = -X (leftward)
        return [0 - depth, 100 - along];
    }
  };

  return curves.map(c => {
    const [x1, y1] = transform(c.cp1[0], c.cp1[1]);
    const [x2, y2] = transform(c.cp2[0], c.cp2[1]);
    const [ex, ey] = transform(c.end[0], c.end[1]);
    return `C ${x1},${y1} ${x2},${y2} ${ex},${ey}`;
  }).join(" ");
}

// ============================================================================
// EDGE PATH BUILDERS  
// ============================================================================

function edgeTop(sign: number): string {
  if (sign === 0) return "L 100,0";
  return `L 35,0 ${createTabCurves(sign, "top")} L 100,0`;
}

function edgeRight(sign: number): string {
  if (sign === 0) return "L 100,100";
  return `L 100,35 ${createTabCurves(sign, "right")} L 100,100`;
}

function edgeBottom(sign: number): string {
  if (sign === 0) return "L 0,100";
  return `L 65,100 ${createTabCurves(sign, "bottom")} L 0,100`;
}

function edgeLeft(sign: number): string {
  if (sign === 0) return "L 0,0";
  return `L 0,65 ${createTabCurves(sign, "left")} L 0,0`;
}

// ============================================================================
// PATH GENERATION
// ============================================================================
function getJigsawPathD(pieceId: number, gridSize: number): string {
  const row = Math.floor(pieceId / gridSize);
  const col = pieceId % gridSize;

  const top = getEdgeSign(row, col, gridSize, "top");
  const right = getEdgeSign(row, col, gridSize, "right");
  const bottom = getEdgeSign(row, col, gridSize, "bottom");
  const left = getEdgeSign(row, col, gridSize, "left");

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
