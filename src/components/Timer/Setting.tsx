import { IonIcon, IonItem, IonLabel, IonList, IonModal, IonText } from "@ionic/react";
import { personCircle } from "ionicons/icons";
import { FC, useRef, useState } from "react";
import "./Setting.css";
import { Button, Page, Toolbar } from "konsta/react";
import { BLEStopplateService } from "../../lib";

export interface TimerSettingProps {
	openTrigger: string;
}

const TimerSetting: FC<TimerSettingProps> = (props: TimerSettingProps) => {
	const modal = useRef<HTMLIonModalElement>(null);
	const [connected, setConnected] = useState(false);
	const BLEInstance = BLEStopplateService.GetInstance()

	function dismiss() {
		modal.current?.dismiss();
	}

	function onConnectButtonClick() {
		BLEInstance.scanAndConnectToStopplate();
	}

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
						{connected ? (
							<Button tonal>Disconnect</Button>
						) : (
							<Button onClick={onConnectButtonClick}>Connect</Button>
						)}
					</Page>
				</div>
			</IonModal>
		</>
	);
};

export { TimerSetting };
