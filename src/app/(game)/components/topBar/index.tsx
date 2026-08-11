import useGameStore from "../../../../stores/useGameStore";
import styles from "./topBar.module.css";
import useUIStore from "../../../../stores/useUIStore";
import React from "react";
import { formatMoney } from "../../../../utils";
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
        <MoneyDisplay money={userTeam.money} />
      </div>
    </header>
  );
};
export default React.memo(TopBar);

const DateDisplay = () => {
  const currentDate = useGameStore((state) => state.currentDate);
  return (
    <span>
      <strong>{formatDate(currentDate)}</strong>
    </span>
  );
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const formattedDay = day >= 10 ? day : `0${day}`;
  const formattedMonth = month >= 10 ? month : `0${month}`;
  return `${formattedDay}/${formattedMonth}/${year}`;
}

interface MoneyDisplayProps {
  money: number;
}

const MoneyDisplay = ({ money }: MoneyDisplayProps) => {
  return <p>R$ {formatMoney(money)}</p>;
};
