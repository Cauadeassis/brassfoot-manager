import useGameStore from "../../../../stores/useGameStore";
import styles from "./topBar.module.css";
import useUIStore from "../../../../stores/useUIStore";
import React from "react";
interface TopBarProps {
  isMobile: boolean;
}

const TopBar = ({ isMobile }: TopBarProps) => {
  const userTeam = useGameStore((state) => state.teams[state.userTeamId!]);
  const openSectionsModal = useUIStore((state) => state.openMenuModal);
  if (!userTeam) return;
  return (
    <header className={styles.topBar}>
      {isMobile && (
        <button
          onClick={openSectionsModal}
          aria-label="Abrir menu de navegação"
        >
          ☰
        </button>
      )}

      <h1>
        BF<strong>MGR</strong>
      </h1>
      <div className={styles.userTeam}>
        <img src={userTeam.shield} alt="" />
        <p>{userTeam.name}</p>
      </div>
      <div className={styles.info}>
        <DateDisplay />
        <MoneyDisplay />
      </div>
    </header>
  );
};
export default React.memo(TopBar);

const DateDisplay = () => {
  const currentDate = useGameStore((state) => state.currentDate);
  return (
    <span>
      <strong>{currentDate}</strong>
    </span>
  );
};

const MoneyDisplay = () => {
  const money = useGameStore((state) => {
    const userTeam = state.teams[state.userTeamId!];
    return userTeam?.money || 0;
  });

  return <p>R$ {money.toLocaleString("pt-BR")}</p>;
};
