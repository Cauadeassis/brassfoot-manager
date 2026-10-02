import React from "react";

interface BallProps {
  x: number;
  y: number;
  scale?: number;
}

export const Ball: React.FC<BallProps> = ({ x, y, scale = 1 }) => {
  const uniqueClipId = `ball-clip-${x}-${y}`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <clipPath id={uniqueClipId}>
          <circle cx="0" cy="0" r="25" />
        </clipPath>
      </defs>
      <circle cx="0" cy="0" r="25" fill="url(#soccer-shading)" />
      <g clipPath={`url(#${uniqueClipId})`}>
        <g stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round">
          <line x1="0" y1="-7.5" x2="0" y2="-12.5" />
          <line x1="7.13" y1="-2.32" x2="11.89" y2="-3.86" />
          <line x1="4.41" y1="6.07" x2="7.35" y2="10.11" />
          <line x1="-4.41" y1="6.07" x2="-7.35" y2="10.11" />
          <line x1="-7.13" y1="-2.32" x2="-11.89" y2="-3.86" />
        </g>
        <polygon
          points="0.0,-7.5 7.13,-2.32 4.41,6.07 -4.41,6.07 -7.13,-2.32"
          fill="#0f172a"
        />
        <polygon
          points="0.0,-12.5 -7.13,-17.68 -4.41,-26.07 4.41,-26.07 7.13,-17.68"
          fill="#0f172a"
        />
        <polygon
          points="11.89,-3.86 14.61,-12.25 23.43,-12.25 26.15,-3.86 19.02,1.32"
          fill="#0f172a"
        />
        <polygon
          points="7.35,10.11 16.16,10.11 18.89,18.5 11.76,23.68 4.62,18.5"
          fill="#0f172a"
        />
        <polygon
          points="-7.35,10.11 -4.62,18.5 -11.76,23.68 -18.89,18.5 -16.16,10.11"
          fill="#0f172a"
        />
        <polygon
          points="-11.89,-3.86 -19.02,1.32 -26.15,-3.86 -23.43,-12.25 -14.61,-12.25"
          fill="#0f172a"
        />
      </g>
      <circle
        cx="0"
        cy="0"
        r="25"
        fill="none"
        stroke="#0f172a"
        strokeWidth="2"
      />
    </g>
  );
};
