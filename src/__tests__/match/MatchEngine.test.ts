import { generateEvents } from "../../gameEngine/match/events/generator";
import { processEvent } from "../../gameEngine/match/events/manager";
import MatchEngine from "../../gameEngine/match/MatchEngine";
import { getMatchResult } from "../../gameEngine/match/progression";
import { createMatchState } from "../../gameEngine/match/state";
import useGameStore from "../../stores/useGameStore";

jest.mock("../../gameEngine/match/events/generator", () => ({
  generateEvents: jest.fn(),
}));

jest.mock("../../gameEngine/match/events/manager", () => ({
  processEvent: jest.fn(),
}));

jest.mock("../../gameEngine/match/state", () => ({
  createMatchState: jest.fn(),
}));

jest.mock("../../gameEngine/match/progression", () => ({
  getMatchResult: jest.fn(),
}));

jest.mock("../../stores/useGameStore", () => ({
  getState: jest.fn(),
}));

describe("MatchEngine", () => {
  let mockHomeTeam: any;
  let mockAwayTeam: any;
  let mockCallbacks: any;
  let mockState: any;
  let mathRandomSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mathRandomSpy = jest.spyOn(Math, "random").mockReturnValue(0.5);
    mockHomeTeam = { id: "home", name: "Home FC", shield: "shield-home" };
    mockAwayTeam = { id: "away", name: "Away FC", shield: "shield-away" };
    mockCallbacks = {
      onTick: jest.fn(),
      onLog: jest.fn(),
      onFinish: jest.fn(),
    };
    mockState = {
      statistics: {
        currentMinute: 0,
        possession: { home: 0.5, away: 0.5 },
        goals: { home: 0, away: 0 },
      },
    };

    (createMatchState as jest.Mock).mockReturnValue(mockState);
    (generateEvents as jest.Mock).mockReturnValue([]);
    (useGameStore.getState as jest.Mock).mockReturnValue({ players: {} });
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
    jest.useRealTimers();
  });

  describe("Inicialização", () => {
    it("deve inicializar o estado, gerar eventos e pegar jogadores da store", () => {
      new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      expect(createMatchState).toHaveBeenCalledWith({
        homeTeam: mockHomeTeam,
        awayTeam: mockAwayTeam,
      });
      expect(useGameStore.getState).toHaveBeenCalled();
      expect(generateEvents).toHaveBeenCalled();
    });
  });

  describe("start(), stop() e tick() em tempo real", () => {
    it("deve avançar 1 minuto a cada tick (150ms) e chamar onTick", () => {
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      engine.start();
      jest.advanceTimersByTime(150);
      expect(mockState.statistics.currentMinute).toBe(1);
      expect(mockCallbacks.onTick).toHaveBeenCalledWith(
        expect.objectContaining(mockState),
      );
      engine.stop();
    });

    it("não deve acumular múltiplos intervalos se start() for chamado várias vezes", () => {
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      engine.start();
      engine.start();
      jest.advanceTimersByTime(150);
      expect(mockState.statistics.currentMinute).toBe(1);
    });

    it("deve processar eventos e chamar onLog se houver eventos no minuto atual", () => {
      const mockEvent = { minute: 1, type: "goal" };
      (generateEvents as jest.Mock).mockReturnValue([mockEvent]);
      (processEvent as jest.Mock).mockReturnValue({ text: "Gooool!" });
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      engine.start();
      jest.advanceTimersByTime(150);
      expect(processEvent).toHaveBeenCalledWith({
        event: mockEvent,
        state: mockState,
        homeShield: mockHomeTeam.shield,
        awayShield: mockAwayTeam.shield,
      });
      expect(mockCallbacks.onLog).toHaveBeenCalledWith({ text: "Gooool!" });
    });
  });

  describe("accelerate()", () => {
    it("deve avançar 5 minutos por tick quando acelerado", () => {
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      engine.accelerate();
      engine.start();
      jest.advanceTimersByTime(150);
      expect(mockState.statistics.currentMinute).toBe(5);
    });
  });

  describe("finish() (Fim de jogo no minuto 90)", () => {
    it("deve parar o motor e emitir onFinish de VITÓRIA em casa corretamente aos 90 min", () => {
      (getMatchResult as jest.Mock).mockReturnValue("win");
      mockState.statistics.goals = { home: 2, away: 0 };
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      mockState.statistics.currentMinute = 89;
      engine.start();
      jest.advanceTimersByTime(150);
      expect(mockState.statistics.currentMinute).toBe(90);
      expect(mockCallbacks.onFinish).toHaveBeenCalledWith(
        expect.any(Object),
        "Home FC vence de 2 a 0!",
        [],
      );
    });

    it("deve parar o motor e emitir onFinish de EMPATE corretamente", () => {
      (getMatchResult as jest.Mock).mockReturnValue("draw");
      mockState.statistics.goals = { home: 1, away: 1 };
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      mockState.statistics.currentMinute = 89;
      engine.start();
      jest.advanceTimersByTime(150);
      expect(mockCallbacks.onFinish).toHaveBeenCalledWith(
        expect.any(Object),
        "Empate, de 1 a 1!",
        [],
      );
    });

    it("deve parar o motor e emitir onFinish de DERROTA corretamente", () => {
      (getMatchResult as jest.Mock).mockReturnValue("defeat");
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      mockState.statistics.currentMinute = 89;
      engine.start();
      jest.advanceTimersByTime(150);
      expect(mockCallbacks.onFinish).toHaveBeenCalledWith(
        expect.any(Object),
        "Away FC vence fora de casa!",
        [],
      );
    });
  });

  describe("simulateBackground()", () => {
    it("deve simular todos os 90 minutos de forma síncrona sem precisar do intervalo", () => {
      const mockEvent = { minute: 45, type: "foul" };
      (generateEvents as jest.Mock).mockReturnValue([mockEvent]);
      mockState.statistics.goals = { home: 3, away: 1 };
      const engine = new MatchEngine(mockHomeTeam, mockAwayTeam, mockCallbacks);
      const result = engine.simulateBackground();
      expect(mockState.statistics.currentMinute).toBe(90);
      expect(processEvent).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        homeGoals: 3,
        awayGoals: 1,
        events: [mockEvent],
      });
    });
  });
});
