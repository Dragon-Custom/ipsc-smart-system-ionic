import {
	homeOutline,
	homeSharp,
	peopleOutline,
	peopleSharp,
	settingsOutline,
	settingsSharp,
	timeSharp,
	timerOutline,
} from "ionicons/icons";

import { HomePage, SettingPage, ShooterPage, TimerPage } from "./pages";

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
		title: "Shooters",
		url: "/shooters",
		iosIcon: peopleOutline,
		mdIcon: peopleSharp,
		component: ShooterPage,
	},
	{
		title: "Settings",
		url: "/settings",
		iosIcon: settingsOutline,
		mdIcon: settingsSharp,
		component: SettingPage,
	},
];
