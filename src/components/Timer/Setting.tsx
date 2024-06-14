import {
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonModal,
	IonText,
	useIonLoading,
	useIonToast,
} from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { FC, useEffect, useRef, useState } from "react";
import "./Setting.css";
import { Button, Page, Toolbar } from "konsta/react";
import { DragonCustomStopplate, StopplateSettingDTO } from "../../lib";
import { l } from "vite/dist/node/types.d-aGj9QkWt";
import { delay } from "../../lib/delay";

export interface TimerSettingProps {
	openTrigger: string;
}

let cb_id: number | null = null;

const TimerSetting: FC<TimerSettingProps> = (props: TimerSettingProps) => {
	const modal = useRef<HTMLIonModalElement>(null);
	const [connected, setConnected] = useState(false);
	const [stopplateConfig, setStopplateConfig] =
		useState<StopplateSettingDTO>();
	const BLEInstance = DragonCustomStopplate.getInstance();
	const [loading, loaded] = useIonLoading();

	function dismiss() {
		modal.current?.dismiss();
	}

	async function onConnectButtonClicked() {
		loading("Connecting...");
		try {
			if (await BLEInstance.connect()) {
				console.log("Connected");
				await BLEInstance.performTimeSync();
				console.log("Time synced");
				loaded();
				setConnected(true);
			}
		} finally {
			loaded();
		}
	}

	async function onDisconnectButtonClicked() {
		try {
			await BLEInstance.disconnect();
			setConnected(BLEInstance.isConnected);
		} finally {
		}
	}

	useEffect(() => {
		(async () => {
			await delay(100);
			const stopplateConfig = await BLEInstance.retrieveConfig();
			if (!stopplateConfig) return;
		})();
	}, [connected]);

	useEffect(() => {
		cb_id = BLEInstance.registerDisconnectCallback(() => {
			setConnected(BLEInstance.isConnected);
		});
	}, []);

	useEffect(() => {
		return () => {
			if (typeof cb_id === "number")
				BLEInstance.unregisterDisconnectCallback(cb_id);
		};
	}, []);

	return (
		<>
			<IonModal
				id="setting-modal"
				ref={modal}
				trigger={props.openTrigger}
			>
				<div className="wrapper">
					<Page style={{ padding: "10px" }}>
						<Toolbar>
							<IonText>
								<h1>Timer setting</h1>
							</IonText>
						</Toolbar>
						<Button
							tonal={connected}
							onClick={
								connected
									? onDisconnectButtonClicked
									: onConnectButtonClicked
							}
						>
							{connected ? "Disconnect" : "Connect"}
						</Button>
					</Page>
				</div>
			</IonModal>
		</>
	);
};

export { TimerSetting };
