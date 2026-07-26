import { EventLog, MatchEvent, MatchState } from "../../types/match";
import { Team } from "../../types/team";
import { createMatchState } from "./state";
import { generateEvents } from "./events/generator";
import { processEvent } from "./events/manager";
import { getMatchResult } from "./progression";
import useGameStore from "../../stores/useGameStore";

export default class MatchEngine {
  private state: MatchState;
  private events: MatchEvent[];
  private intervalId: NodeJS.Timeout | null = null;
  private isAccelerated = false;
  private isFinished = false;
  private baseHomePossession: number;

  constructor(
    private homeTeam: Team,
    private awayTeam: Team,
    private callbacks?: {
      onTick: (state: MatchState) => void;
      onLog: (log: EventLog) => void;
      onFinish: (
        state: MatchState,
        resultMessage: string,
        events: MatchEvent[],
      ) => void;
    },
  ) {
    this.state = createMatchState({
      homeTeam,
      awayTeam,
    });
    const possession = this.state.statistics.possession;
    this.baseHomePossession = possession.home;
    const playersMap = useGameStore.getState().players;
    this.events = generateEvents({
      homeTeam,
      awayTeam,
      possession,
      playersMap,
    });
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.tick(), 150);
  }

  accelerate() {
    this.isAccelerated = true;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  simulateBackground() {
    this.isFinished = true;

    for (let minute = 1; minute <= 90; minute++) {
      this.state.statistics.currentMinute = minute;
      const currentEvents = this.events.filter(
        (event) => event.minute === minute,
      );
      currentEvents.forEach((event) => {
        processEvent({
          event,
          state: this.state,
          homeShield: this.homeTeam.shield,
          awayShield: this.awayTeam.shield,
        });
      });
    }

    return {
      homeGoals: this.state.statistics.goals.home,
      awayGoals: this.state.statistics.goals.away,
      events: this.events,
    };
  }

  private tick() {
    if (this.isFinished || this.state.statistics.currentMinute >= 90)
      return this.finish();

    const tickStep = this.isAccelerated ? 5 : 1;

    for (
      let currentTick = 0;
      currentTick < tickStep && this.state.statistics.currentMinute < 90;
      currentTick++
    ) {
      this.state.statistics.currentMinute++;
      const currentEvents = this.events.filter(
        (event) => event.minute === this.state.statistics.currentMinute,
      );

      currentEvents.forEach((event) => {
        const eventData = processEvent({
          event,
          state: this.state,
          homeShield: this.homeTeam.shield,
          awayShield: this.awayTeam.shield,
        });
        if (eventData) this.callbacks?.onLog(eventData);
      });
    }

    const visualVariance = (Math.random() - 0.5) * 0.12;
    this.state.statistics.possession.home = Math.max(
      0,
      Math.min(1, this.baseHomePossession + visualVariance),
    );

    this.callbacks?.onTick({ ...this.state });

    if (this.state.statistics.currentMinute >= 90) this.finish();
  }

  private finish() {
    this.stop();
    this.isFinished = true;
    let message = "";
    const { home, away } = this.state.statistics.goals;
    const result = getMatchResult({
      scoredGoals: home,
      concededGoals: away,
    });
    if (result === "draw") message = `Empate, de ${home} a ${away}!`;
    if (result === "win")
      message = `${this.homeTeam.name} vence de ${home} a ${away}!`;
    if (result === "defeat")
      message = `${this.awayTeam.name} vence fora de casa!`;
    this.callbacks?.onFinish({ ...this.state }, message, this.events);
  }
}
