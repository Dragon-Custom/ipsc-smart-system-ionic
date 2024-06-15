import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { defineCustomElements } from "@ionic/pwa-elements/loader";
import "./theme/variables.css";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

defineCustomElements(window);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
