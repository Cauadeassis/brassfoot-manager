import React, { useState, useMemo, useEffect, useRef } from "react";
import styles from "./style.module.css";
import useFiltersStore, {
  CompetitionScope,
  CompetitionType,
} from "../../../stores/useFilterStore";
import { getCompetitionName, TEAMTYPES_NAMES } from "../../../filters/labels";
import COMPETITIONS from "../../../data/competitions";
import { FiltersContainer, FormSelect } from "../../../filters/components";
import { FormButton } from "../../../filters/components";
import { CompetitionId } from "../../../types/competition";
import {
  COMPETITION_SCOPE_OPTIONS,
  COMPETITION_TYPE_OPTIONS,
  competitionTypes,
} from "../../../filters/selectOptions";
import { Icon } from "../../../app/components";
import NATIONALITIES_DATA, { Nationality } from "../../../data/nationalities";

interface CompetitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick?: () => void;
}

const getCompetitionScope = (id: CompetitionId): CompetitionScope => {
  if (id.toLowerCase().includes("world")) return "world";
  if (id.length > 5 && id.includes("_")) {
    if (id.split("_")[0].length === 2) return "national";
  }
  return "continental";
};

function getCompetitionFlag(id: CompetitionId): string {
  const [nationality, _] = id.split("_");
  return NATIONALITIES_DATA[nationality as Nationality].flag;
}

const isClubsCompetition = (id: CompetitionId): boolean => {
  if (id.toLowerCase().includes("clubs")) return true;
  if (id.length > 5 && id.includes("_")) {
    if (id.split("_")[0].length === 2) return true;
  }
  return false;
};

const getCompetitionType = (id: CompetitionId): CompetitionType | null => {
  const [_, suffix] = id.split("_");
  return competitionTypes.includes(suffix) ? (suffix as CompetitionType) : null;
};
export default function CompetitionsModal({
  isOpen,
  onClose,
  onItemClick,
}: CompetitionsModalProps) {
  const { competitionType, teamType, competitionScope } = useFiltersStore(
    (state) => state.competitionsModal,
  );
  const setFilter = useFiltersStore((state) => state.setFilter);
  console.log(`Escopo atual: ${competitionScope}`);

  const filteredCompetitions = useMemo(() => {
    return Object.values(COMPETITIONS)
      .map((comp) => ({
        ...comp,
        name: getCompetitionName({ length: 1, key: comp.id }),
        scope: getCompetitionScope(comp.id),
        isClub: isClubsCompetition(comp.id),
        type: getCompetitionType(comp.id),
      }))
      .filter((comp) => {
        console.log(`Escopo de ${comp.id}: ${comp.scope}`);
        if (competitionScope !== "all" && comp.scope !== competitionScope)
          return false;
        if (comp.isClub && teamType === "national") return false;
        if (!comp.isClub && teamType === "club") return false;
        if (competitionType !== "all" && comp.type !== competitionType)
          return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [competitionType, competitionScope, teamType]);
  const handleSelect = (competitionId: CompetitionId) => {
    setFilter("globalFilters", "generalCompetitionId", competitionId);
    if (onItemClick) onItemClick();
    onClose();
  };

  const handleChangeCompetitionScope = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newCompetitionScope = event.target.value as "all" | CompetitionScope;
    setFilter("competitionsModal", "competitionScope", newCompetitionScope);
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
          {1 + 1 === 3 && (
            <FormButton isActive={true} onClick={handleChangeTeamType}>
              {TEAMTYPES_NAMES[teamType]}
            </FormButton>
          )}
          <FormSelect
            value={competitionScope}
            options={COMPETITION_SCOPE_OPTIONS}
            onChange={handleChangeCompetitionScope}
          />
          <FormSelect
            value={competitionType}
            options={COMPETITION_TYPE_OPTIONS}
            onChange={handleChangeCompetitionType}
          />
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
                  {comp.scope === "national" && (
                    <Icon
                      name={getCompetitionFlag(comp.id)}
                      className={styles.flag}
                    />
                  )}
                  {comp.scope !== "national" && (
                    <div className={styles.cardIcon}>🏆</div>
                  )}

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
