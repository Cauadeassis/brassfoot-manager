"use client";
import { Icon } from "../../../app/components";
import { CompetitionId } from "../../../types/competition";
import useUIStore from "../../../stores/useUIStore";
import styles from "./style.module.css";
import { getCompetitionName } from "../../../filters/labels";

export default function CardModal() {
  const isCardModalOpen = useUIStore((state) => state.isCardModalOpen);
  const cardModalData = useUIStore((state) => state.cardModalData);
  const closeCardModal = useUIStore((state) => state.closeCardModal);
  if (!isCardModalOpen || !cardModalData) return null;
  const cards = Array.isArray(cardModalData) ? cardModalData : [cardModalData];
  return (
    <section className={styles.cardModal}>
      {cards.map((card, index) => (
        <article key={index} className={styles.modalBox}>
          <div>
            <h2>{card.name}</h2>
            {card.shield && (
              <Icon name={card.shield} className={styles.shieldIcon} />
            )}
            {card.icon && <span style={{ fontSize: "5rem" }}>{card.icon}</span>}
            <div>
              {card.trophies && (
                <p>
                  {Object.entries(card.trophies || {})
                    .map(([key, years]) => {
                      const count = years?.length ?? 0;
                      if (count === 0) return null;

                      return `${count} ${getCompetitionName({
                        key: key as CompetitionId,
                        length: count,
                      })}`;
                    })
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              <p>{card.description}</p>
            </div>
            <div className={styles.buttonsContainer}>
              {card.canCancel && (
                <button className="outline-button" onClick={closeCardModal}>
                  Voltar
                </button>
              )}

              <button
                className="green-button"
                onClick={() => {
                  card.onConfirm();
                  closeCardModal();
                }}
              >
                Selecionar
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
