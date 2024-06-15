import { List, Page } from "konsta/react";
import { FC } from "react";
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
