import { useId } from "react";
import type { Uniform } from "../../types/team";
import { OPPOSITE_COLORS } from "../../data/uniforms";

export type { Uniform } from "../../types/team";

interface ShirtIconProps {
  number: number;
  uniform: Uniform;
  size?: number;
}

const SHIRT_PATH =
  "M20 6 L8 16 L14 26 L20 22 L20 58 L44 58 L44 22 L50 26 L56 16 L44 6 Q38 12 32 12 Q26 12 20 6 Z";

export default function ShirtIcon({
  number,
  uniform,
  size = 32,
}: ShirtIconProps) {
  const clipId = `shirt-clip-${useId()}`;
  const { design, colors } = uniform;
  const { primary, number: numberColor } = colors;
  const numberOutlineColor = OPPOSITE_COLORS[numberColor] ?? "#000000";
  const secondaryColor = design !== "monoColor" ? colors.secondary : primary;
  const numberFontSize = number >= 10 ? 17 : 20;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={SHIRT_PATH} />
        </clipPath>
      </defs>

      <path d={SHIRT_PATH} fill={primary} stroke="#ffffff" strokeWidth="1.5" />

      {design !== "monoColor" && (
        <g clipPath={`url(#${clipId})`}>
          {design === "horizontalLines" &&
            [6, 22, 38, 54].map((y) => (
              <rect
                key={y}
                x="0"
                y={y}
                width="64"
                height="8"
                fill={secondaryColor}
              />
            ))}
          {design === "verticalLines" &&
            [8, 24, 40, 56].map((x) => (
              <rect
                key={x}
                x={x}
                y="0"
                width="8"
                height="64"
                fill={secondaryColor}
              />
            ))}
        </g>
      )}

      <path d={SHIRT_PATH} fill="none" stroke="#ffffff" strokeWidth="1.5" />

      <text
        x="32"
        y="40"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={numberFontSize}
        fontWeight="700"
        fontFamily="var(--font-mono, monospace)"
        fill="none"
        stroke={numberOutlineColor}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {number}
      </text>
      <text
        x="32"
        y="40"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={numberFontSize}
        fontWeight="700"
        fontFamily="var(--font-mono, monospace)"
        fill={numberColor}
      >
        {number}
      </text>
    </svg>
  );
}
