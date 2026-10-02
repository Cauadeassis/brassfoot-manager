import React from "react";
import { SharedSoccerDefs, Border } from "../SharedSoccerDefs";
import { Background } from "../Background";
import { Ball } from "../Ball";

export const CornerBadge: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width="100%"
    height="100%"
  >
    <SharedSoccerDefs />
    <g clipPath="url(#soccer-badge-clip)">
      <Background />
      <path
        d="M 15 160 A 60 60 0 0 0 75 220"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.6"
      />
      <ellipse cx="110" cy="152" rx="28" ry="6" fill="#0f172a" opacity="0.25" />
      <rect x="75" y="45" width="6" height="110" fill="#cbd5e1" rx="2" />
      <circle cx="78" cy="45" r="4" fill="#94a3b8" />
      <path d="M 81 50 Q 115 45 135 65 Q 115 85 81 85 Z" fill="#ef4444" />
      <Ball x={110} y={135} scale={1.2} />
    </g>
    <Border />
  </svg>
);

export default CornerBadge;
