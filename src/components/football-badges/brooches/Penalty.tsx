import React from "react";
import { SharedSoccerDefs, Border } from "../SharedSoccerDefs";
import { Background } from "../Background";
import { Goal } from "../Goal";
import { Ball } from "../Ball";

export const PenaltyBadge: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width="100%"
    height="100%"
  >
    <SharedSoccerDefs />

    <g clipPath="url(#soccer-badge-clip)">
      <Background />
      <Goal x={0} y={0} />
      <ellipse cx="100" cy="126" rx="18" ry="5" fill="#0f172a" opacity="0.2" />
      <ellipse cx="100" cy="126" rx="14" ry="4" fill="#e2e8f0" />
      <Ball x={100} y={100} scale={1} />
    </g>

    <Border />
  </svg>
);
