import React from "react";

export const Background: React.FC = () => (
  <g>
    <circle cx="100" cy="100" r="95" fill="#e0f2fe" />
    <g clipPath="url(#soccer-badge-clip)">
      <path d="M 0 100 Q 100 85 200 100 L 200 200 L 0 200 Z" fill="#86efac" />
      <path
        d="M -20 115 Q 100 100 220 115 L 230 135 Q 100 115 -30 135 Z"
        fill="#4ade80"
        opacity="0.5"
      />
      <path
        d="M -40 155 Q 100 135 240 155 L 260 185 Q 100 160 -60 185 Z"
        fill="#4ade80"
        opacity="0.5"
      />
    </g>
  </g>
);
