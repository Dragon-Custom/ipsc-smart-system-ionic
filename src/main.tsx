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

setupIonicReact({
	rippleEffect: true,
	animated: true,
	mode: "md",
});
// if (localStorage.getItem("darkMode") === "true") {
// 	document.documentElement.classList.add("dark", "ion-palette-dark");
// } else {
// 	document.documentElement.classList.remove("dark", "ion-palette-dark");
// }
root.render(
	<React.StrictMode>
		<KonstaProvider theme="parent">
			<KUIApp theme="parent">
				<App />
			</KUIApp>
		</KonstaProvider>
	</React.StrictMode>
);
