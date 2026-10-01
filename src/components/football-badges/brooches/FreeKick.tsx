import React from "react";
import { SharedSoccerDefs } from "../SharedSoccerDefs";
import { BackgroundAsset } from "../Background";
import { GoalAsset } from "../Goal";
import { TelstarBallAsset } from "../Ball";
import { PlayerAsset } from "../Player";

export const FreeKickBadge: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width="100%"
    height="100%"
  >
    <SharedSoccerDefs />

    {/* A "tesoura" agora corta tudo o que está aqui dentro, incluindo o fundo */}
    <g clipPath="url(#soccer-badge-clip)">
      <BackgroundAsset />
      <GoalAsset x={0} y={-10} />
      <g transform="translate(45, 105)">
        <PlayerAsset />
      </g>
      <g transform="translate(70, 105)">
        <PlayerAsset />
      </g>
      <g transform="translate(95, 105)">
        <PlayerAsset />
      </g>
      <ellipse cx="150" cy="148" rx="18" ry="4" fill="#0f172a" opacity="0.25" />
      <TelstarBallAsset x={150} y={135} scale={1.3} />
    </g>
    <circle
      cx="100"
      cy="100"
      r="95"
      fill="none"
      stroke="#cda434"
      strokeWidth="20"
    />
  </svg>
);
