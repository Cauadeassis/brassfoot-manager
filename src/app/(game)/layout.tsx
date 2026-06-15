"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./game.module.css";
import MatchModal from "../../components/modals/match";
import Toast from "../../components/toast";
import useGameStore from "../../stores/useGameStore";
import type { GameState } from "../../types";
export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const season = useGameStore((state: GameState) => state.season);
  const currentRound = useGameStore((state: GameState) => state.currentRound);
  const userTeam = useGameStore((state: GameState) =>
    state.teams.find((t) => t.id === state.userTeamId),
  );
  const teamName = userTeam?.name || "Sem Time";
  const teamShield = userTeam?.shield || "/escudo-placeholder.svg";
  const teamMoney = userTeam?.money
    ? `R$ ${userTeam.money.toLocaleString("pt-BR")}`
    : "R$ 0";
  const isActive = (path: string) => (pathname === path ? styles.ativo : "");
  return (
    <section className={styles.gameScreen}>
      <header>
        <h1>
          BF<strong>MGR</strong>
        </h1>
        <div className={styles.userTeam}>
          <img src={teamShield} alt={`Escudo do ${teamName}`} />
          <p>{teamName}</p>
        </div>
        <div className={styles.info}>
          <span>
            &nbsp;TEMPORADA DE <strong>{season}</strong>
          </span>
          <span>
            &nbsp;RODADA <strong>{currentRound}</strong>
          </span>
          <p>{teamMoney}</p>
        </div>
      </header>
      <div className={styles.navAndMainContainer}>
        <nav aria-label="Menu Principal">
          <section>
            <h3>Clube</h3>
            <Link href="/dashboard" className={isActive("/dashboard")}>
              📊 Dashboard
            </Link>
            <Link href="/squad" className={isActive("/squad")}>
              👥 Elenco
            </Link>
            <Link href="/lineup" className={isActive("/lineup")}>
              ⚙️ Escalação
            </Link>
          </section>
          <section>
            <h3>Competições</h3>
            <Link href="/standings" className={isActive("/standings")}>
              📋 Tabela
            </Link>
            <Link href="/calendar" className={isActive("/calendar")}>
              📅 Calendário
            </Link>
            <Link href="/topScorers" className={isActive("/topScorers")}>
              ⚽ Artilharia
            </Link>
          </section>
          <section>
            <h3>Mercado</h3>
            <Link href="/transfers" className={isActive("/transfers")}>
              💰 Transferências
            </Link>
          </section>
        </nav>
        <main>{children}</main>
      </div>
      <Toast />
      <MatchModal />
    </section>
  );
}
