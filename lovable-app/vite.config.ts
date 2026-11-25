import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

// `npm run build:preview` makes one self-contained HTML file for showing the
// site to someone before it is hosted. Fonts are inlined so it works offline.
const inlineFonts = (): Plugin => ({
  name: "inline-fonts",
  enforce: "pre",
  transform(code, id) {
    if (id.endsWith("site.css")) return code.replaceAll('url("/assets/fonts/', 'url("../../public/assets/fonts/');
    return null;
  },
});

const dropFilePreloads = (): Plugin => ({
  name: "drop-file-preloads",
  transformIndexHtml: (html) => html.replace(/<link rel="(preload|icon)"[^>]*>\n?/g, ""),
});

// Port 8080 is what Lovable expects. LEAD_PROXY lets local tests send forms
// to the Python lead handler in ../server without CORS.
export default defineConfig(({ mode }) => {
  const clientPreview = mode === "clientpreview";
  return {
    server: {
      host: "::",
      port: 8080,
      proxy: process.env.LEAD_PROXY ? { "/api": process.env.LEAD_PROXY } : undefined,
    },
    preview: {
      proxy: process.env.LEAD_PROXY ? { "/api": process.env.LEAD_PROXY } : undefined,
    },
    plugins: clientPreview ? [inlineFonts(), dropFilePreloads(), react(), viteSingleFile()] : [react()],
    base: clientPreview ? "./" : "/",
    build: clientPreview ? { outDir: "dist-preview", assetsInlineLimit: 100_000_000 } : undefined,
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  };
});
