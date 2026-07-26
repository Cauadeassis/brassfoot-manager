import { Team } from "../types/team";
import React from "react";
import { OverallBadge, SerieBadge } from "../components/badges";
import styles from "./new-game/selector.module.css";
import { getSpriteId } from "../utils";

interface TeamCardProps {
  team: Team;
  onClick: (team: Team) => void;
}

const TeamCard = ({ team, onClick }: TeamCardProps) => {
  const handleClick = () => onClick(team);
  return (
    <button className={styles.card} onClick={handleClick}>
      <Icon name={team.shield} className={styles.shieldIcon} />
      <h2>{team.name}</h2>
      <OverallBadge overall={team.overall} />
      {team.type === "club" && <SerieBadge serie={team.division} />}
    </button>
  );
};

interface IconProps {
  name: string; // Ex: 'gb-liverpool'
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  const spriteId = getSpriteId(name);
  return (
    <svg className={className} aria-hidden="true">
      <use href={`/sprite.svg#${spriteId.toLowerCase()}`} />
    </svg>
  );
}

export default React.memo(TeamCard);
