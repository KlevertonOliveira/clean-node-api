import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Configurações de cobertura dos testes.
    coverage: {
      // Utiliza o provider V8 para coletar a cobertura.
      provider: "v8",

      // Define quais arquivos devem participar da cobertura.
      include: ["src/**/*.ts"],

      // Exclui arquivos que não precisam ser contabilizados.
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts", "src/**/*.d.ts"],

      // Formatos dos relatórios gerados.
      reporter: ["text", "html", "lcov"],

      // Diretório onde os relatórios serão armazenados.
      reportsDirectory: "./coverage",

      // Define percentuais mínimos de cobertura.
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
