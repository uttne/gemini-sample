import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setupTests.ts',
  reporters: ['default', 'junit'],
    outputFile: {
      junit: `./test-results/junit-${new Date().toISOString().replace(/:/g, '-')}.xml`,
    },
  },
});
