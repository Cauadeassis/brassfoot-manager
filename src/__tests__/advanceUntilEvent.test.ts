import useGameStore from "../stores/useGameStore";
import { advanceCurrentDay } from "../gameEngine/calendar/advance";

describe("advanceUntilEventOrMatch", () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
    useGameStore.setState({
      currentDate: "2026-01-01",
      userTeamId: "user-team",
      teams: {
        "user-team": { id: "user-team", squad: { playerIds: [] } },
        opponent: {
          id: "opponent",
          type: "club",
          money: 5_000_000,
          squad: { playerIds: [] },
        },
      } as any,
      players: {},
      calendar: [
        {
          date: "2026-01-03",
          matches: [
            {
              id: "next-match",
              date: "2026-01-03",
              homeTeamId: "user-team",
              awayTeamId: "opponent",
              simulated: false,
            },
          ],
        },
      ] as any,
      notifications: [],
    });
  });

  it("avança os dias até a data da próxima partida", () => {
    const result = useGameStore.getState().advanceUntilEventOrMatch();

    expect(result).toEqual({
      stoppedAtDate: "2026-01-03",
      reason: "MATCH_DAY",
    });
    expect(useGameStore.getState().currentDate).toBe("2026-01-03");
  });

  it("interrupts before the next match when the AI makes a transfer offer", () => {
    useGameStore.setState({
      teams: {
        "user-team": {
          id: "user-team",
          type: "club",
          money: 5_000_000,
          squad: { playerIds: ["player"] },
        },
        opponent: {
          id: "opponent",
          type: "club",
          money: 5_000_000,
          squad: { playerIds: [] },
        },
      } as any,
      players: {
        player: {
          id: "player",
          name: "Player",
          currentTeamId: "user-team",
          age: 24,
          overall: 80,
          value: 2_000_000,
          market: { isTransferListed: true },
          stamina: 80,
          currentSkills: { physical: 80 },
        },
      } as any,
    });
    jest.spyOn(Math, "random").mockReturnValue(0);

    const result = useGameStore.getState().advanceUntilEventOrMatch();

    expect(result).toMatchObject({
      stoppedAtDate: "2026-01-02",
      reason: "TRANSFER_OFFER",
    });
    expect(result.eventPayload?.playerId).toBe("player");
    expect(useGameStore.getState().currentDate).toBe("2026-01-02");
    expect(useGameStore.getState().notifications).toHaveLength(1);
  });

  it("remove o modal legado ao carregar um save antigo", () => {
    useGameStore.getState().loadState({
      state: {
        currentDate: "2026-01-02",
        activeMatch: { id: "legacy-match" },
        players: { legacy: { id: "legacy" } },
      } as any,
    });

    expect(useGameStore.getState().currentDate).toBe("2026-01-02");
    expect("activeMatch" in useGameStore.getState()).toBe(false);
    expect(useGameStore.getState().players.legacy.contract).toBeNull();
    expect(useGameStore.getState().players.legacy.market).toEqual({
      isTransferListed: false,
    });
    expect(useGameStore.getState().payrollSalaryDays).toEqual({});
  });

  it("toggles transfer listing for the user's player", () => {
    useGameStore.setState({
      userTeamId: "user-team",
      teams: {
        "user-team": { id: "user-team", type: "club" },
      } as any,
      players: {
        player: { id: "player", currentTeamId: "user-team" },
      } as any,
    });

    useGameStore.getState().toggleTransferListing("player");

    expect(useGameStore.getState().players.player.market).toEqual({
      isTransferListed: true,
    });

    useGameStore.getState().toggleTransferListing("player");
    expect(useGameStore.getState().players.player.market).toEqual({
      isTransferListed: false,
    });
  });

  it("libera o jogador quando o contrato vence", () => {
    const state = {
      currentDate: "2026-02-01",
      calendar: [],
      userTeamId: null,
      teams: {
        club: {
          id: "club",
          name: "Club",
          money: 0,
          squad: { playerIds: ["player"], starterIds: ["player"] },
        },
      },
      players: {
        player: {
          id: "player",
          name: "Player",
          currentTeamId: "club",
          contract: {
            startDate: "2025-02-01",
            endDate: "2026-02-01",
            salary: 100,
            signingBonus: 0,
          },
          stamina: 80,
          currentSkills: { physical: 80 },
        },
      },
    } as any;

    advanceCurrentDay(state);

    expect(state.players.player.currentTeamId).toBeNull();
    expect(state.players.player.contract).toBeNull();
    expect(state.teams.club.squad.playerIds).toEqual([]);
  });

  it("paga a folha ao avançar para o primeiro dia do mês", () => {
    const state = {
      currentDate: "2026-01-31",
      calendar: [],
      userTeamId: null,
      payrollSalaryDays: { club: 30 * 31_000 },
      teams: {
        club: {
          id: "club",
          name: "Club",
          money: 100_000,
          squad: { playerIds: ["player"], starterIds: ["player"] },
        },
      },
      players: {
        player: {
          id: "player",
          name: "Player",
          currentTeamId: "club",
          age: 25,
          position: "CA",
          overall: 70,
          value: 1_000_000,
          contract: {
            startDate: "2026-01-01",
            endDate: "2027-01-01",
            salary: 31_000,
            signingBonus: 0,
          },
          stamina: 80,
          currentSkills: {
            shooting: 60,
            vision: 60,
            physical: 80,
            dribbling: 60,
          },
        },
      },
    } as any;

    advanceCurrentDay(state);

    expect(state.currentDate).toBe("2026-02-01");
    expect(state.teams.club.money).toBe(69_000);
    expect(state.payrollSalaryDays).toEqual({});
  });

  it("remove transfer offers after their window expires", () => {
    const state = {
      currentDate: "2026-02-28",
      calendar: [],
      teams: {},
      players: {},
      notifications: [
        {
          sellerTeamId: "club",
          playerId: "player",
          value: 1_000_000,
          buyerTeamId: "buyer",
          contractOffer: {
            durationInMonths: 36,
            salary: 10_000,
            signingBonus: 0,
          },
          expiresAt: "2026-02-28",
          text: "Oferta válida até o fim da janela",
        },
      ],
    } as any;

    advanceCurrentDay(state);

    expect(state.currentDate).toBe("2026-03-01");
    expect(state.notifications).toEqual([]);
  });

  it("does not generate duplicate offers for players with pending proposals", () => {
    useGameStore.setState({
      teams: {
        "user-team": {
          id: "user-team",
          type: "club",
          money: 5_000_000,
          squad: { playerIds: ["player"] },
        },
        opponent: {
          id: "opponent",
          type: "club",
          money: 5_000_000,
          squad: { playerIds: [] },
        },
      } as any,
      players: {
        player: {
          id: "player",
          name: "Player",
          currentTeamId: "user-team",
          age: 25,
          overall: 82,
          value: 1_000_000,
          market: { isTransferListed: false },
          stamina: 80,
          currentSkills: { physical: 80 },
        },
      } as any,
      notifications: [
        {
          sellerTeamId: "user-team",
          playerId: "player",
          value: 1_100_000,
          buyerTeamId: "opponent",
          contractOffer: {
            durationInMonths: 36,
            salary: 4_167,
            signingBonus: 0,
          },
          expiresAt: "2026-02-28",
          text: "Oferta pendente",
        },
      ],
    });
    jest.spyOn(Math, "random").mockReturnValue(0);

    const result = useGameStore.getState().advanceUntilEventOrMatch();

    expect(result.reason).toBe("MATCH_DAY");
    expect(result.stoppedAtDate).toBe("2026-01-03");
    expect(useGameStore.getState().currentDate).toBe("2026-01-03");
    expect(useGameStore.getState().notifications).toHaveLength(1);
  });
});
