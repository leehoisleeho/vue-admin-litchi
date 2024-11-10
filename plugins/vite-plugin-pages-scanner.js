// plugins/vite-plugin-pages-scanner.js
import path from "path";
import fs from "fs";

export default function pagesScanner(options = {}) {
  const {
    dir = "src/pages", // 扫描的目录
    extensions = [".vue"], // 支持的文件扩展名
    exclude = [], // 排除的文件或目录
    output = "src/pages.json", // 输出文件路径
    generateMeta = false, // 是否生成元数据
  } = options;

  // 扫描目录下的所有文件
  function scanPages(pagesPath) {
    const pages = {};

    function isExcluded(file) {
      return exclude.some((pattern) => {
        if (typeof pattern === "string") {
          return file.includes(pattern);
        }
        return pattern.test(file);
      });
    }

    function readDirRecursive(dir) {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        // 检查是否被排除
        if (isExcluded(filePath)) {
          return;
        }

        if (stat.isDirectory()) {
          readDirRecursive(filePath);
        } else {
          const ext = path.extname(file);
          if (extensions.includes(ext)) {
            const relativePath = path.relative(pagesPath, filePath);
            const routePath = relativePath
              .replace(new RegExp(`(${extensions.join("|")})$`), "")
              .replace(/\\/g, "/")
              .replace(/\/index$/, ""); // index文件特殊处理

            pages[routePath] = {
              path: filePath,
              ...(generateMeta
                ? {
                    size: stat.size,
                    mtime: stat.mtime,
                    extension: ext,
                  }
                : {}),
            };
          }
        }
      });
    }

    readDirRecursive(pagesPath);
    return pages;
  }

  function updatePages(pagesPath, outputPath) {
    const pages = scanPages(pagesPath);
    fs.writeFileSync(outputPath, JSON.stringify(pages, null, 2));
    console.log("Pages updated:", Object.keys(pages).length, "files");
  }

  return {
    name: "vite-plugin-pages-scanner",
    configureServer(server) {
      const pagesPath = path.resolve(process.cwd(), dir);
      const outputPath = path.resolve(process.cwd(), output);

      // 确保输出目录存在
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 监听文件变化
      server.watcher.add(pagesPath);

      server.watcher.on("add", (file) => {
        if (file.includes(pagesPath)) {
          updatePages(pagesPath, outputPath);
        }
      });

      server.watcher.on("unlink", (file) => {
        if (file.includes(pagesPath)) {
          updatePages(pagesPath, outputPath);
        }
      });

      server.watcher.on("unlinkDir", (dir) => {
        if (dir.includes(pagesPath)) {
          updatePages(pagesPath, outputPath);
        }
      });

      server.watcher.on("change", (file) => {
        if (file.includes(pagesPath)) {
          updatePages(pagesPath, outputPath);
        }
      });

      // 初始扫描
      updatePages(pagesPath, outputPath);
    },
  };
}
