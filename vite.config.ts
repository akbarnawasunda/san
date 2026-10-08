import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Allow the sandbox preview hosts (e2b + legacy host) to reach the dev/preview servers.
const allowedHosts = [".e2b.app", "4174-in0ww25acxus0f6mbx0f2-4d4de58f.sg1.manus.computer"];

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4174,
    allowedHosts,
  },
  preview: {
    host: "0.0.0.0",
    port: 4175,
    allowedHosts,
  },
});
