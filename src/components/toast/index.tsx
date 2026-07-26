"use client";
import styles from "./toast.module.css";
import useToastStore from "../../stores/useToastStore";
import { ToastState } from "../../stores/useToastStore";

export default function Toast() {
  const toasts = useToastStore((state: ToastState) => state.toasts);
  return (
    <div className={styles.toast}>
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`${styles.toastItem} ${styles[item.type]}`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
