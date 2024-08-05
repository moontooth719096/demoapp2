import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // server: {
    //   proxy: {
    //     "/api": {
    //       target: "dasdasdad", // 後端 API 進入點
    //       changeOrigin: true,
    //       secure: false,
    //       ws: true,
    //       rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //     "/socket.io": {
    //       target: "ws://localhost:5174",
    //       ws: true,
    //     },
    //   },
    // },
  };
});
