import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setupIonicReact } from "@ionic/react";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import "./index.css"
const container = document.getElementById("root");
const root = createRoot(container!);
defineCustomElements(window);

import { KonstaProvider } from "konsta/react";

setupIonicReact({
	rippleEffect: false,
	mode: "md",
});
root.render(
	<React.StrictMode>
		<KonstaProvider theme="parent">
			<App />
		</KonstaProvider>
	</React.StrictMode>
);
