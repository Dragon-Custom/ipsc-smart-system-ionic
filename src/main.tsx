import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setupIonicReact } from "@ionic/react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import "./theme/variables.css";
import "./index.css";
import { App as KUIApp } from "konsta/react";

const container = document.getElementById("root");
const root = createRoot(container!);

defineCustomElements(window);

import { KonstaProvider } from "konsta/react";

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
