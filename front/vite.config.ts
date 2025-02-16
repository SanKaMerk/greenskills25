import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tsconfigPaths(), svgr({ include: "**/*.svg" })],
    server: {
      host: "0.0.0.0",
      port: parseInt(env.FRONT_PORT_DEV) ?? 8080,
      proxy: {
        "/api/v1": env.BACK
      },
      strictPort: false
    },
    build: {
      chunkSizeWarningLimit: 300,
      rollupOptions: {
        output: {
          minifyInternalExports: false,
          manualChunks: {
            react: ["react"],
            "react-dom-client": ["react-dom/client"],
            vendors: [
              "axios",
              "mobx",
              "mobx-react",
              "mobx-react-lite",
              "mobx-utils"
            ],
            "styled-components": ["styled-components"]
          }
        }
      }
    }
  };
});
