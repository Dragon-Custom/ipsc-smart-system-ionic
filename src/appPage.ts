import {
	homeOutline,
	homeSharp,
	settingsOutline,
	settingsSharp,
	timeSharp,
	timerOutline,
} from "ionicons/icons";

import { HomePage, SettingPage, TimerPage } from "./pages";

interface AppPage {
	url: string;
	iosIcon: string;
	mdIcon: string;
	title: string;
	component: React.FC;
}
export const appPages: AppPage[] = [
	{
		title: "Home",
		url: "/",
		iosIcon: homeOutline,
		mdIcon: homeSharp,
		component: HomePage,
	},
	{
		title: "Timer",
		url: "/timer",
		iosIcon: timerOutline,
		mdIcon: timeSharp,
		component: TimerPage,
	},
	{
		title: "Settings",
		url: "/settings",
		iosIcon: settingsOutline,
		mdIcon: settingsSharp,
		component: SettingPage,
	},
];
