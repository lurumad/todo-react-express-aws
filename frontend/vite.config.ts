import { defineConfig } from "vitest/config";
import checker from "vite-plugin-checker";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import typescript from "@rollup/plugin-typescript";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "path";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        checker({ typescript: true }),
        react(),
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            plugins: [typescript()],
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    test: {
        setupFiles: [
            path.resolve(__dirname, "./vitest.setup.ts"),
        ],
        coverage: {
            provider: "istanbul"
        },
        globals: true,
        environment: "jsdom",
        clearMocks: true,
        restoreMocks: true,
    },
});
