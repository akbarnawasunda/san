import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4174,
    allowedHosts: ["4174-in0ww25acxus0f6mbx0f2-4d4de58f.sg1.manus.computer"],
  },
  preview: {
    host: "0.0.0.0",
    port: 4175,
    allowedHosts: ["4174-in0ww25acxus0f6mbx0f2-4d4de58f.sg1.manus.computer"],
  },
});
