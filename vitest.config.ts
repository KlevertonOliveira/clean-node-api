import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["**/*.spec.ts"],
        },
      },
      {
        test: {
          name: "integration",
          include: ["**/*.test.ts"],
          globalSetup: ["./src/infra/tests/setup/mongodb.global.ts"],
        },
      },
    ],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/**/*.d.ts",
        "src/infra/tests/**",
      ],
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
