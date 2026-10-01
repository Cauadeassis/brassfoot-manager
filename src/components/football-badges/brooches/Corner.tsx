import React from "react";
// Certifique-se de ajustar os imports conforme o caminho real dos seus assets
import { SharedSoccerDefs } from "../SharedSoccerDefs";
import { BackgroundAsset } from "../Background";
import { TelstarBallAsset } from "../Ball";

export const CornerBadge: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 200"
    width="100%"
    height="100%"
  >
    {/* Definições compartilhadas (máscara, gradientes) */}
    <SharedSoccerDefs />

    {/* Grupo principal restrito pelo recorte circular */}
    <g clipPath="url(#soccer-badge-clip)">
      {/* Fundo padronizado */}
      <BackgroundAsset />

      {/* Arco da linha de escanteio no gramado */}
      <path
        d="M 15 160 A 60 60 0 0 0 75 220"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        opacity="0.6"
      />

      {/* Sombra projetada da bandeira e da bola */}
      <ellipse cx="110" cy="152" rx="28" ry="6" fill="#0f172a" opacity="0.25" />

      {/* Mastro da bandeira */}
      <rect
        x="75"
        y="45"
        width="6"
        height="110"
        fill="#cbd5e1"
        rx="2"
      />

      {/* Topo do mastro (detalhe arredondado) */}
      <circle cx="78" cy="45" r="4" fill="#94a3b8" />

      {/* Tecido da bandeira vermelha simulando movimento */}
      <path
        d="M 81 50 Q 115 45 135 65 Q 115 85 81 85 Z"
        fill="#ef4444"
      />

      {/* Bola posicionada logo abaixo da bandeira */}
      <TelstarBallAsset x={110} y={135} scale={1.2} />
    </g>

    {/* Borda dourada espessa finalizada por cima da máscara */}
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

export default CornerBadge;
