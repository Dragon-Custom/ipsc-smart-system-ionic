import {
	Block,
	BlockTitle,
	Button,
	List,
	ListButton,
	ListItem,
	Navbar,
	Page,
	useTheme,
} from "konsta/react";
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import { time, timeOutline } from "ionicons/icons";
import { FC, useMemo, useState } from "react";
import { BLEStopplateService, beep } from "../../lib";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { ScreenReader } from "@capacitor/screen-reader";

let stopCountdown: () => void;
const Timer: FC = () => {
	const [countingDown, setCountingDown] = useState(false);
	const [displayTime, setDisplayTime] = useState(0);

	const buttonDisabled: {
		review: boolean;
		start: boolean;
		clear: boolean;
		setting: boolean;
	} = useMemo(() => {
		let result: typeof buttonDisabled = {
			review: false,
			start: false,
			clear: false,
			setting: false,
		};
		if (countingDown) {
			result.start = true;
			result.review = true;
		}
		return result;
	}, [countingDown]);

	function onStartButtonClick() {
		//todo: replace with the actual timer config
		let countdowntime = 1350;
		Haptics.impact({ style: ImpactStyle.Heavy });
		setCountingDown(true);
		let coundownFlag = true;
		let countdown = setInterval(() => {
			countdowntime -= 10;
			setDisplayTime(countdowntime / 1000);
		}, 10);
		setTimeout(() => {
			if (!coundownFlag)
				return;
			beep(1024, "sawtooth", 1000);
			Haptics.vibrate({duration: 1000});
			stopCountdown();
			setDisplayTime(0);
		}, countdowntime);
		stopCountdown = () => {
			coundownFlag = false;
			clearInterval(countdown);
			setCountingDown(false);
		};
	}

	function onClearButtonClick() {
		stopCountdown?.();
	}

	return (
		<Page>
			<IonGrid>
				<IonRow>
					<IonCol size="12">
						<IonText>
							<h1
								style={{
									textAlign: "center",
									width: "100%",
									fontSize: "15vw",
								}}
							>
								{displayTime.toFixed(2)}
							</h1>
						</IonText>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonGrid>
						<IonRow>
							<IonCol size="6">
								<Button disabled={buttonDisabled.review}>
									Review
								</Button>
							</IonCol>
							<IonCol size="6">
								<Button
									disabled={buttonDisabled.start}
									onClick={onStartButtonClick}
								>
									Start
								</Button>
							</IonCol>
						</IonRow>
						<IonRow>
							<IonCol size="6">
								<Button
									disabled={buttonDisabled.clear}
									onClick={onClearButtonClick}
								>
									Clear
								</Button>
							</IonCol>
							<IonCol size="6">
								<Button disabled={buttonDisabled.setting}>
									Setting
								</Button>
							</IonCol>
						</IonRow>
					</IonGrid>
				</IonRow>
				<IonRow>
					<IonCol size="12">
						<BlockTitle>Hit record</BlockTitle>
						<List strong inset>
							<ListItem
								link
								chevron={false}
								title="10.00"
								after="Shot #1"
								subtitle="Split: 00.10"
							/>
						</List>
					</IonCol>
				</IonRow>
			</IonGrid>
		</Page>
	);
};

export { Timer };
