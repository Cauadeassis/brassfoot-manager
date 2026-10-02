import React from "react";
import { Border, SharedSoccerDefs } from "../SharedSoccerDefs";
import { Background } from "../Background";
import { Goal } from "../Goal";
import { Ball } from "../Ball";
import { Player } from "../Player";

export const FreeKickBadge: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width="100%"
    height="100%"
  >
    <SharedSoccerDefs />
    <g clipPath="url(#soccer-badge-clip)">
      <Background />
      <Goal x={0} y={-10} />
      <Player x={45} y={105} />
      <Player x={70} y={105} />
      <Player x={95} y={105} />
      <ellipse cx="150" cy="148" rx="18" ry="4" fill="#0f172a" opacity="0.25" />
      <Ball x={150} y={135} scale={1.3} />
    </g>
    <Border />
  </svg>
);
