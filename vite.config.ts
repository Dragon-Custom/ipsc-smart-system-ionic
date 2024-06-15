/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import selfAssignCert from "@vitejs/plugin-basic-ssl";
import { VitePWA } from "vite-plugin-pwa";
import {
	ServerOptions as HttpsServerOptions,
} from "node:https";

const https: HttpsServerOptions = {
	key: "ssl/mTls/key.key",
	ca: "ssl/origin/cert.pem",
	cert: "ssl/mTls/cert.pem",
};

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		legacy(),
		VitePWA({
			registerType: "prompt",
			devOptions: {
				enabled: true,
			},
			mode: "development",
		}),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
	server: {
		port: 8443,
		https,
	},
});
