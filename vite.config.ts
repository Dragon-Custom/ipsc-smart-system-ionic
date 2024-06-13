/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import selfAssignCert from "@vitejs/plugin-basic-ssl";

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
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/setupTests.ts",
	},
	preview: {
		host: "0.0.0.0",
		https: {
			cert: "ssl/cert/_cert.pem",
		},
	},
});
