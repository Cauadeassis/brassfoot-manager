"use client";
import Navigation from "./components/navigation";
import { useState, useEffect } from "react";
import MenuModal from "../../components/modals/menu";
import styles from "./game.module.css";
import MatchModal from "../../components/modals/match";
import Toast from "../../components/toast";
import { useIsMobile } from "../../hooks";
import TopBar from "./components/topBar";
export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const isMobile = useIsMobile(800);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    return <div className={styles.loading}>Carregando save do jogo...</div>;
  }
  return (
    <section className={styles.gameScreen}>
      <TopBar isMobile={isMobile} />

      <div className={styles.navAndMainContainer}>
        {!isMobile && (
          <aside>
            <Navigation styleMode="aside" />
          </aside>
        )}

        <main>{children}</main>
      </div>

      <Toast />
      <MatchModal />
      <MenuModal />
    </section>
  );
}
