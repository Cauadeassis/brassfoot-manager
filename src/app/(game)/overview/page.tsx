"use client";
import useFiltersStore from "../../../stores/useFilterStore";
import COMPETITIONS from "../../../data/competitions";
import Standings from "./_components/Standings";
import KnockoutBracket from "./_components/KnockoutBracket";
export default function CompetitionOverview() {
  const competitionId = useFiltersStore(
    (state) => state.globalFilters.generalCompetitionId
  );
  const competition = COMPETITIONS.find((c) => c.id === competitionId);
  if (!competitionId || !competition) {
    return (<p>Selecione uma competição no menu superior para ver os detalhes.</p>);
  }
  if (competition.rules.format === "league") {
    return (
      <Standings />
    );
  }
  if (competition.rules.format === "cup") {
    return (
      <KnockoutBracket />
    );
  }
  return (<p>O formato desta competição ainda não possui uma visualização definida.</p>);
}
