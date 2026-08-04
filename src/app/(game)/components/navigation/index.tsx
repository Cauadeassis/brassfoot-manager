import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navigation.module.css";
import React, { useState } from "react";
import CompetitionsModal from "../../../../components/modals/competitions";

export interface Link {
  href: string;
  label: string;
  icon: string;
}

export interface Section {
  title: string;
  items: Link[];
}
interface NavigationProps {
  onItemClick?: () => void;
  styleMode: "aside" | "modal";
}

export const NAVIGATION_MENU: Section[] = [
  {
    title: "Clube",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/squad", label: "Elenco", icon: "👥" },
      { href: "/lineup", label: "Escalação", icon: "⚙️" },
      { href: "/calendar", label: "Calendário", icon: "🗓️" },
    ],
  },
  {
    title: "Mundo",
    items: [{ href: "/transfers", label: "Transferências", icon: "💰" }, { href: "/ranking", label: "Ranking", icon: "🚀" }, { href: "/topScorers", label: "Artilharia", icon: "⚽" },],
  },
  {
    title: "Competição",
    items: [
      { href: "/standings", label: "Tabela", icon: "📋" },
      { href: "/matches", label: "Jogos", icon: "📅" },
    ],
  },
];

interface NavLinkProps {
  item: Link;
  onClick?: () => void;
}

const NavLink = ({ item, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isCurrent = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={isCurrent ? styles.ativo : ""}
      onClick={onClick}
    >
      {item.icon} <span>{item.label}</span>
    </Link>
  );
};

function Navigation({ onItemClick, styleMode }: NavigationProps) {
  const navClass = styleMode === "aside" ? styles.navAside : styles.navModal;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenCompetitionsModal = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <nav aria-label="Menu de navegação" className={navClass}>
        {NAVIGATION_MENU.map((section) => (
          <section key={section.title}>
            {section.title === "Competição" ? (
              <h3>
                <button
                  onClick={handleOpenCompetitionsModal}
                  className={styles.clickableTitle}
                  aria-label="Trocar competição"
                >
                  {section.title} <span className={styles.changeIcon}>🔄</span>
                </button>
              </h3>
            ) : (
              <h3>{section.title}</h3>
            )}

            {section.items.map((item) => (
              <NavLink key={item.href} item={item} onClick={onItemClick} />
            ))}
          </section>
        ))}
      </nav>
      <CompetitionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onItemClick={onItemClick}
      />
    </>
  );
}

export default React.memo(Navigation);
