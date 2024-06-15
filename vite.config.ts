/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import selfAssignCert from "@vitejs/plugin-basic-ssl";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		legacy(),
		selfAssignCert({
			/** name of certification */
			name: "test",
			/** custom trust domains */
			domains: ["*.custom.com"],
			/** custom certification directory */
			certDir: "ssl/cert/",
		}),
		VitePWA({
			registerType: "prompt",
			devOptions: {
				enabled: true,
			},
		}),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
	preview: {
		port: 3001,
		host: "0.0.0.0",
		https: {
			cert: "ssl/cert/_cert.pem",
		},
	},
});
