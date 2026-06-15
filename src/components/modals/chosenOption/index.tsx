"use client";
import { useModalStore } from "../../../stores/useModalStore";
import styles from "./style.module.css";
export default function ChosenOptionModal() {
    const { isOpen, name, shield, description, onConfirm, closeModal } =
        useModalStore();
    if (!isOpen) return null;
    return (
        <section className={styles.chosenOptionModal}>
            <article className={styles.modalBox}>
                <div>
                    <h2>{name}</h2>
                    <img src={shield} alt={`Escudo do ${name}`} />
                    <p>{description}</p>
                    <div className={styles.buttonsContainer}>
                        <button className="outline-button" onClick={closeModal}>
                            Voltar
                        </button>
                        <button
                            className="green-button"
                            onClick={() => {
                                onConfirm();
                                closeModal();
                            }}
                        >
                            Selecionar
                        </button>
                    </div>
                </div>
            </article>
        </section>
    );
}
