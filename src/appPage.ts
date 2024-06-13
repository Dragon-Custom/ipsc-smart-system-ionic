import {
	mailOutline,
	mailSharp,
} from "ionicons/icons";

import {
	HomePage
} from "./pages"

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
		iosIcon: mailOutline,
		mdIcon: mailSharp,
		component: HomePage,
	},
];
