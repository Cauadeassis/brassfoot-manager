import useUIStore from "../../../stores/useUIStore";
import styles from "./style.module.css";
import Navigation from "../../../app/(game)/components/navigation";

export default function MenuModal() {
  const isMenuModalOpen = useUIStore((state) => state.isMenuModalOpen);
  const closeMenuModal = useUIStore((state) => state.closeMenuModal);
  if (!isMenuModalOpen) return null;
  return (
    <div
      className={styles.modalOverlay}
      onClick={closeMenuModal}
      role="dialog"
      aria-modal="true"
    >
      <article className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Navegação</h2>
          <button
            onClick={closeMenuModal}
            aria-label="Fechar menu de navegação"
          >
            ❌
          </button>
        </header>
        <Navigation styleMode="modal" onItemClick={closeMenuModal} />
      </article>
    </div>
  );
}
