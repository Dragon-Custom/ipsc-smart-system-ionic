/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { ServerOptions as HttpsServerOptions } from "node:https";
import "dotenv/config";

const https: HttpsServerOptions = {
	key: "ssl/mTls/key.key",
	ca: "ssl/origin/cert.pem",
	cert: "ssl/mTls/cert.pem",
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		// legacy(),
		VitePWA({
			registerType: "autoUpdate",
			// devOptions: {
			// 	enabled: true,
			// },
			// mode: "development",
		}),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
	server: {
		port: 8443,
		https: process.env.USE_HTTPS ? https : undefined,
	},
});
