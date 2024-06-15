import { List, ListItem, Page, Toggle } from "konsta/react";
import { useControl } from "../../lib/useControl";
import { FC, useEffect } from "react";

const SettingPage: FC = () => {
	const [[enableDarkMode, setEnableDarkMode], EnableDarkModeSwitch] =
		useControl(false, (value, set) => (
			<ListItem
				label
				title="Dark mode"
				after={
					<Toggle
						component="div"
						className="-my-1"
						checked={value}
						onChange={() => set(!value)}
					/>
				}
			/>
		));
	
	useEffect(() => {

	})

	return (
		<>
			<Page>
				<List strong inset>
					{EnableDarkModeSwitch}
				</List>
			</Page>
		</>
	);
};

export { SettingPage };
