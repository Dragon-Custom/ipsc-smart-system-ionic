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
import {
	IonCol,
	IonGrid,
	IonIcon,
	IonRow,
	IonText,
	useIonToast,
} from "@ionic/react";
import { time, timeOutline } from "ionicons/icons";
import { FC, useMemo, useState } from "react";
import { DragonCustomStopplate, StopplateSettingDTO, beep } from "../../lib";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { ScreenReader } from "@capacitor/screen-reader";
import { TimerSetting } from "./Setting";
import { useToggle } from "@uidotdev/usehooks";

let stopCountdown: () => void;
const Timer: FC = () => {
	const [countingDown, setCountingDown] = useState(false);
	const [displayTime, setDisplayTime] = useState(0);
	const Stopplate = DragonCustomStopplate.getInstance();

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

	async function onStartButtonClick() {
		let config = await Stopplate.retrieveConfig();
		if (config == false) {
			alert("Please connect to the stopplate first");
		}
		config = config as StopplateSettingDTO;
		let countdownTime =
			Math.random() *
				(config.countdown_random_time_max -
					config.countdown_random_time_min) +
			config.countdown_random_time_min;
		countdownTime *= 1000;

		Haptics.impact({ style: ImpactStyle.Heavy });
		setCountingDown(true);
		let coundownFlag = true;
		let countdown = setInterval(() => {
			countdownTime -= 10;
			setDisplayTime(countdownTime / 1000);
		}, 10);
		setTimeout(() => {
			if (!coundownFlag) return;
			beep(1024, "sawtooth", 1000);
			Haptics.vibrate({ duration: 1000 });
			stopCountdown();
			setDisplayTime(0);
		}, countdownTime);
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
		<>
			<TimerSetting openTrigger="timer-setting" />
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
					<IonCol size="6">
						<IonText>
							<pre
								style={{
									textAlign: "center",
									width: "100%",
									fontSize: "3vw",
								}}
							>
								Shot: #10/10
							</pre>
						</IonText>
					</IonCol>
					<IonCol size="6">
						<IonText>
							<pre
								style={{
									textAlign: "center",
									width: "100%",
									fontSize: "3vw",
								}}
							>
								Split: 00.10
							</pre>
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
								<Button
									disabled={buttonDisabled.setting}
									id="timer-setting"
								>
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
		</>
	);
};

export { Timer };
