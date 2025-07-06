import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/api/index.ts"],
  outDir: "public",
  format: ["cjs"],
  target: "node18",
  platform: "node",
  sourcemap: true,
  clean: true,
});
