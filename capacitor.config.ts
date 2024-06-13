import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "io.ionic.starter",
	appName: "ipsc-smart-system-ionic",
	webDir: "dist",
	plugins: {
		BluetoothLe: {
			displayStrings: {
				scanning: "Scanning...",
				cancel: "Cancel",
				availableDevices: "Available devices",
				noDeviceFound: "No device found",
			},
		},
	},
};

export default config;
