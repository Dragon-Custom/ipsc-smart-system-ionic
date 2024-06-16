import React from "react";
import {
	IonApp,
	IonContent,
	IonRouterOutlet,
	IonSplitPane,
	setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import { Menu, Toolbar } from "./components";
import { App as KUIApp } from "konsta/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
//!!! THIS CSS WILL BREAK THE KUI !!!
// import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css';
import "@ionic/react/css/palettes/dark.class.css";
// import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import { appPages } from "./appPage";
import { KonstaProvider, Page } from "konsta/react";
import { useSetting } from "./hooks";

function AppView() {
	return (
		<IonSplitPane when="md" contentId="main">
			<Menu />
			<div className="ion-page" id="main">
				<Toolbar />
				<IonContent className="ion-padding">
					<IonRouterOutlet id="main" style={{ padding: 10 }}>
						{/*
							Use the render method to reduce the number of renders your component will have due to a route change.
							Use the component prop when your component depends on the RouterComponentProps passed in automatically.
						*/}
						{appPages.map((appPage, index) => (
							<Route
								key={index}
								path={appPage.url}
								component={appPage.component}
								exact={true}
							/>
						))}
					</IonRouterOutlet>
				</IonContent>
			</div>
		</IonSplitPane>
	);
}

const App: React.FC = () => {
	const {
		useMd: [[useMd]],
	} = useSetting();
	setupIonicReact({
		rippleEffect: true,
		animated: true,
		mode:
			localStorage.getItem("CapacitorStorage.useMd") === "true"
				? "md"
				: "ios",
		sanitizerEnabled: true,
	});
	return (
		<KonstaProvider theme={useMd ? "material" : "ios"}>
			<KUIApp theme={useMd ? "material" : "ios"}>
				<Page>
					<IonApp>
						<IonReactRouter>
							<AppView />
						</IonReactRouter>
					</IonApp>
				</Page>
			</KUIApp>
		</KonstaProvider>
	);
};

export default App;
