import React, { useState, useMemo, useEffect, useRef } from "react";
import styles from "./style.module.css";
import useFiltersStore, {
  CompetitionType,
} from "../../../stores/useFilterStore";
import { getCompetitionName } from "../../../filters/labels";
import COMPETITIONS from "../../../data/competitions";
import { FiltersContainer, FormSelect } from "../../../filters/components";
import { FormButton } from "../../../filters/components";
import { CompetitionId } from "../../../types/competition";
import { TeamType } from "../../../types/team";
import { SelectOption } from "../../../filters/selectOptions";

interface CompetitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick?: () => void;
}

const TEAMTYPES_NAMES: Record<TeamType, string> = {
  club: "clubes",
  national: "seleções",
};

const COMPETITIONTYPE_NAMES: Record<CompetitionType, string> = {
  national: "Nacionais",
  continental: "Continentais",
  world: "Mundiais",
};

const competitionTypes = Object.keys(
  COMPETITIONTYPE_NAMES,
) as CompetitionType[];

const COMPETITIONTYPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "Todas competições" },
  ...competitionTypes.map((competitionType) => ({
    value: competitionType,
    label: COMPETITIONTYPE_NAMES[competitionType],
  })),
];

const getCompetitionType = (id: string): CompetitionType => {
  if (id.toLowerCase().includes("world")) return "world";
  if (id.length > 5 && id.includes("_")) {
    if (id.split("_")[0].length === 2) return "national";
  }
  return "continental";
};

const isClubsCompetition = (id: string): boolean => {
  if (id.toLowerCase().includes("clubs")) return true;
  if (id.length > 5 && id.includes("_")) {
    if (id.split("_")[0].length === 2) return true;
  }
  return false;
};

export default function CompetitionsModal({
  isOpen,
  onClose,
  onItemClick,
}: CompetitionsModalProps) {
  const { competitionType, teamType } = useFiltersStore(
    (state) => state.competitionsModal,
  );
  const setFilter = useFiltersStore((state) => state.setFilter);

  const filteredCompetitions = useMemo(() => {
    return Object.values(COMPETITIONS)
      .map((comp) => ({
        ...comp,
        name: getCompetitionName({ length: 1, key: comp.id }),
        type: getCompetitionType(comp.id),
        isClub: isClubsCompetition(comp.id),
      }))
      .filter((comp) => {
        if (competitionType !== "all" && comp.type !== competitionType)
          return false;
        if (comp.isClub && teamType === "national") return false;
        if (!comp.isClub && teamType === "club") return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [competitionType, teamType]);
  const handleSelect = (competitionId: CompetitionId) => {
    setFilter("globalFilters", "generalCompetitionId", competitionId);
    if (onItemClick) onItemClick();
    onClose();
  };

  const handleChangeCompetitionType = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newCompetitionType = event.target.value as "all" | CompetitionType;
    setFilter("competitionsModal", "competitionType", newCompetitionType);
  };

  const handleChangeTeamType = () => {
    const nextTeamType = teamType === "club" ? "national" : "club";
    setFilter("competitionsModal", "teamType", nextTeamType);
  };

  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className={styles.modalHeader}>
          <h2>Selecionar Competição</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar"
          >
            ✕
          </button>
        </header>
        <FiltersContainer ariaLabel="Filtros de Categoria">
          <FormSelect
            value={competitionType}
            options={COMPETITIONTYPE_OPTIONS}
            onChange={handleChangeCompetitionType}
          />
          <FormButton isActive={true} onClick={handleChangeTeamType}>
            {TEAMTYPES_NAMES[teamType]}
          </FormButton>
        </FiltersContainer>
        <div className={styles.gridContainer}>
          {filteredCompetitions.length > 0 ? (
            <div className={styles.grid}>
              {filteredCompetitions.map((comp) => (
                <button
                  key={comp.id}
                  className={styles.competitionCard}
                  onClick={() => handleSelect(comp.id)}
                >
                  <div className={styles.cardIcon}>🏆</div>
                  <div className={styles.cardInfo}>
                    <strong>{comp.name}</strong>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.messageContainer}>
              <p>Nenhuma competição encontrada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
