import type { Config } from "jest";

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  restoreMocks: true,
} as Config;
