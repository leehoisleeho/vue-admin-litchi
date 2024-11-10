import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import pagesScanner from "./plugins/vite-plugin-pages-scanner";

export default defineConfig({
  plugins: [
    vue(),
    pagesScanner({
      dir: "src/pages", // 扫描的目录
      output: "src/auto-pages.json", // 输出到这个文件
      exclude: ["components"], // 排除components目录
      generateMeta: true, // 生成文件元信息
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "@/style.less";`,
      },
    },
  },
  resolve: {
    // 设置别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@api": path.resolve(__dirname, "./src/http/api"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
