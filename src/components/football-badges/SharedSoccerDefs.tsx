import React from "react";

export const SharedSoccerDefs: React.FC = () => (
  <defs>
    <pattern
      id="soccer-net-pattern"
      width="8"
      height="8"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 8 0 L 0 8 M 0 0 L 8 8"
        stroke="#94a3b8"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </pattern>
    <clipPath id="soccer-badge-clip">
      <circle cx="100" cy="100" r="95" />
    </clipPath>
    <radialGradient id="soccer-ball-shading" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </radialGradient>
  </defs>
);

export const Border: React.FC = () => (
  <circle
    cx="100"
    cy="100"
    r="95"
    fill="none"
    stroke="#cda434"
    strokeWidth="20"
  />
);
