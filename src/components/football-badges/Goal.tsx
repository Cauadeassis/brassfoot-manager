import React from "react";

interface GoalAssetProps {
  x?: number;
  y?: number;
}

export const GoalAsset: React.FC<GoalAssetProps> = ({ x = 0, y = 0 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <g fill="url(#soccer-net-pattern)">
      <polygon points="48,50 152,50 152,115 48,115" />
      <polygon points="30,35 170,35 152,50 48,50" />
      <polygon points="30,35 48,50 48,115 30,115" />
      <polygon points="170,35 152,50 152,115 170,115" />
    </g>
    <g fill="none" stroke="#94a3b8" strokeWidth="1.8">
      <path d="M 48 115 L 48 50 L 152 50 L 152 115" />
      <path d="M 30 35 L 48 50 M 170 35 L 152 50 M 30 115 L 48 115 M 170 115 L 152 115" />
    </g>
    <path
      d="M 30 115 L 30 35 L 170 35 L 170 115"
      fill="none"
      stroke="#0f172a"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
);
