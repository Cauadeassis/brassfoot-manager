"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./loading.module.css";

export default function LoadingPage() {
  const router = useRouter();
  useEffect(() => {
    const saveGame = localStorage.getItem("bfmgr_save");
    if (saveGame) router.push("/dashboard");
    else {
      const timer = setTimeout(() => router.push("/new-game"), 2200);
      return () => clearTimeout(timer);
    }
  }, [router]);
  return (
    <section className={styles.loadingScreen}>
      <h1>
        BRASFOOT <strong>MGR</strong>
      </h1>
      <div className={styles.loadingBarWrap}>
        <span></span>
      </div>
      <p>CARREGANDO DADOS...</p>
    </section>
  );
}
