import React from "react";
import { Result } from "../../types/match";
import styles from "./lastMatches.module.css";

interface LastMatchesProps {
  results: Result[];
  size?: "small" | "large";
  showLabels?: boolean;
}

const resultLabels: Record<Result, string> = {
  win: "V",
  draw: "E",
  defeat: "D",
};

const resultTitles: Record<Result, string> = {
  win: "Vitória",
  draw: "Empate",
  defeat: "Derrota",
};

export default function LastMatches({
  results,
  size = "small",
  showLabels = false,
}: LastMatchesProps) {
  const matches: (Result | undefined)[] = [
    ...results.slice(0, 5),
    ...Array(Math.max(0, 5 - results.length)).fill(undefined),
  ];

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      {matches.map((result, index) => (
        <span
          key={`${result ?? "empty"}-${index}`}
          className={result ? styles[result] : styles.empty}
          title={result ? resultTitles[result] : "Sem partida"}
          aria-label={result ? resultTitles[result] : "Sem partida"}
        >
          {showLabels && result ? resultLabels[result] : null}
        </span>
      ))}
    </div>
  );
}
