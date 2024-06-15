import { useEffect } from "react";
import { useControl } from "./useControl";
import { ListItem, Toggle } from "konsta/react";
import { Preferences } from "@capacitor/preferences";

export function useSetting() {
	const darkModeControl = useControl(
		false,
		(value, set) => (
			<ListItem
				label
				title="Dark mode"
				after={
					<Toggle
						component="div"
						checked={value}
						onChange={() => set(!value)}
					/>
				}
			/>
		),
		(value, previousValue, setValue) => {
			Preferences.set({ key: "darkMode", value: value.toString() });
			updateUI(value);
		}
	);

	function updateUI(darkMode: boolean) {
		if (darkMode)
			document.documentElement.classList.add("dark", "ion-palette-dark");
		else
			document.documentElement.classList.remove(
				"dark",
				"ion-palette-dark"
			);
	}

	useEffect(() => {
		const initDarkMode = async () => {
			const darkMode = await Preferences.get({ key: "darkMode" });
			darkModeControl[0][1](darkMode.value === "true");
			updateUI(darkMode.value === "true");
		};
		initDarkMode();
	}, []);

	return {
		darkMode: darkModeControl,
	};
}
