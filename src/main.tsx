import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setupIonicReact } from "@ionic/react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import "./theme/variables.css";
import "./index.css";
import { App as KUIApp } from "konsta/react";
import { KonstaProvider } from "konsta/react";

const container = document.getElementById("root");
const root = createRoot(container!);

defineCustomElements(window);

window.addEventListener("beforeinstallprompt", (e) => {
	console.log("beforeinstallprompt Event fired");
	// Prevent Chrome 67 and earlier from automatically showing the prompt
	// e.preventDefault();
	// Stash the event so it can be triggered later.
	let deferredPrompt = e;
	let showInstallBtn = true;
	if (deferredPrompt !== undefined && deferredPrompt !== null) {
		// Show the prompt
		deferredPrompt.prompt();
		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
				console.log("User accepted the A2HS prompt");
			} else {
				console.log("User dismissed the A2HS prompt");
			}
			// We no longer need the prompt.  Clear it up.
			deferredPrompt = null;
		});
	}
});

setupIonicReact({
	rippleEffect: true,
	animated: true,
	mode: "md",
});
root.render(
	<React.StrictMode>
		<KonstaProvider theme="parent">
			<KUIApp theme="parent">
				<App />
			</KUIApp>
		</KonstaProvider>
	</React.StrictMode>
);
