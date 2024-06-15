import { useEffect } from "react";
import { useControl } from "./useControl";
import { ListItem, Toggle } from "konsta/react";
import { Preferences } from "@capacitor/preferences";
import { useIonAlert } from "@ionic/react";

let updateFn: Function[] = [];
export function useSetting() {
	const [presentAlert] = useIonAlert();

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
			updateUI();
		}
	);
	const themeControl = useControl(
		true,
		(value, set) => (
			<ListItem
				label
				innerChildren={
					<div className="flex space-x-4 items-center px-4 justify-around w-full">
						<p>Apple Design</p>
						<Toggle
							component="div"
							checked={value}
							onChange={() => set(!value)}
						/>
						<p>Material Design</p>
					</div>
				}
			/>
		),
		(value, previousValue, setValue) => {
			Preferences.set({ key: "useMd", value: value.toString() });
			updateUI();
			presentAlert({
				header: "The refresh is required to apply the changes",
				subHeader: "!! Important !!",
				message:
					"if you have connected to any stopplate, this might causing the disconnection.",
				buttons: ["Cancel", {
					text: "Refresh",
					handler: () => {
						window.location.reload();
					},
				}],
			});
		}
	);

	async function updateUI() {
		const darkMode = await Preferences.get({ key: "darkMode" });
		if (darkMode.value === "true")
			document.documentElement.classList.add("dark", "ion-palette-dark");
		else
			document.documentElement.classList.remove(
				"dark",
				"ion-palette-dark"
			);
		for (const fn of updateFn) {
			fn();
		}
	}

	function onUpdate(fn: Function) {
		updateFn.push(fn);
	}

	useEffect(() => {
		const initDarkMode = async () => {
			const darkMode = await Preferences.get({ key: "darkMode" });
			darkModeControl[0][1](darkMode.value === "true");
			const useMd = await Preferences.get({
				key: "useMd",
			});
			themeControl[0][1](useMd.value === "true");
			updateUI();
		};
		initDarkMode();
	}, []);

	return {
		darkMode: darkModeControl,
		useMd: themeControl,
		onUpdate: onUpdate,
	};
}
