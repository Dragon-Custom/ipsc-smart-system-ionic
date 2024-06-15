import {
	homeOutline,
	homeSharp,
	timeSharp,
	timerOutline,
} from "ionicons/icons";

import {
	HomePage
} from "./pages"
import { TimerPage } from "./pages";

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
	}
];
