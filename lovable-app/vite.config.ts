import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Port 8080 is what Lovable expects. LEAD_PROXY lets local tests send forms
// to the Python lead handler in ../server without CORS.
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: process.env.LEAD_PROXY ? { "/api": process.env.LEAD_PROXY } : undefined,
  },
  preview: {
    proxy: process.env.LEAD_PROXY ? { "/api": process.env.LEAD_PROXY } : undefined,
  },
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
}));
