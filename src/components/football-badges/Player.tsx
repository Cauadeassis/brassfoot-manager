import React from "react";

interface PlayerProps {
  x?: number;
  y?: number;
}

export const Player: React.FC<PlayerProps> = ({ x = 0, y = 0 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <ellipse cx="0" cy="38" rx="12" ry="3" fill="#0f172a" opacity="0.2" />
    <path d="M -10 35 L -7 -5 C -7 -15 7 -15 7 -5 L 10 35 Z" fill="#3b82f6" />
    <circle cx="0" cy="-18" r="8" fill="#2563eb" />
  </g>
);
