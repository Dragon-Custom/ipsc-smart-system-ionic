import { List, ListItem, Page, Toggle } from "konsta/react";
import { useControl } from "../../lib/useControl";
import { FC, useEffect } from "react";
import { Preferences } from "@capacitor/preferences";
import { delay } from "../../lib/delay";
import { useSetting } from "../../lib/useSetting";

const SettingPage: FC = () => {
	const {
		darkMode: [, DarkModeSwitch],
		useMd: [, ThemeToggle],
	} = useSetting();

	return (
		<>
			<Page>
				<List strong inset>
					{DarkModeSwitch}
					{ThemeToggle}
				</List>
			</Page>
		</>
	);
};

export { SettingPage };
