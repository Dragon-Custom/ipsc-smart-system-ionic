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
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
	BUZZER_WAVEFORM_OBJECT,
	DragonCustomStopplate,
	StopplateSettingDTO,
	beep,
} from "../../lib";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { ScreenReader } from "@capacitor/screen-reader";
import { TimerSetting } from "./Setting";
import { useQueue, useToggle } from "@uidotdev/usehooks";

export interface HitRecord {
	time: number;
	shot: number;
	split: number;
}

let stopCountdown: () => void;
let startTimestamp: number;
const Timer: FC = () => {
	const [countingDown, setCountingDown] = useState(false);
	const [displayTime, setDisplayTime] = useState(0);
	const Stopplate = DragonCustomStopplate.getInstance();
	const [hitRecord, setHitRecord] = useState<HitRecord[]>([]);
	const [displayHitRecordIndex, setDisplayHitRecordIndex] = useState(0);
	const [hitCallbackID, setHitCallbackID] = useState<number>();

	const [buttonDisabled, setButtonDisabled] = useState({
		review: true,
		start: false,
		clear: true,
		setting: false,
	});

	async function onStartButtonClick() {
		let config = await Stopplate.retrieveConfig();
		if (config == false) {
			alert("Please connect to the stopplate first");
			return;
		}
		config = config as StopplateSettingDTO;
		let countdownTime =
			Math.random() *
				(config.countdown_random_time_max -
					config.countdown_random_time_min) +
			config.countdown_random_time_min;
		countdownTime *= 1000;

		Haptics.impact({ style: ImpactStyle.Heavy });
		setButtonDisabled({
			clear: false,
			review: true,
			start: true,
			setting: true,
		});
		let coundownFlag = true;
		let countdown = setInterval(() => {
			countdownTime -= 10;
			setDisplayTime(countdownTime / 1000);
		}, 10);
		setCountingDown(true);
		setTimeout(() => {
			if (!coundownFlag) return;
			beep(
				config.buzzer_frequency,
				BUZZER_WAVEFORM_OBJECT[config.buzzer_waveform],
				config.buzzer_duration * 1000
			);
			setHitCallbackID(Stopplate.registerHitCallback(onHit));
			startTimestamp = Stopplate.getPrecisionTime();
			Haptics.vibrate({ duration: 1000 });
			stopCountdown();
			setDisplayTime(0);
			setButtonDisabled({
				clear: true,
				review: false,
				start: true,
				setting: true,
			});
			setCountingDown(false);
		}, countdownTime);
		stopCountdown = () => {
			coundownFlag = false;
			clearInterval(countdown);
			setButtonDisabled({
				clear: false,
				review: true,
				start: false,
				setting: false,
			});
			setCountingDown(false);
		};
	}

	const onHit = useCallback(
		function (timestamp: number) {
			console.log("hit", timestamp);
			const time = timestamp - startTimestamp;
			console.log("delta time", time);
			let newHitRecord = hitRecord;
			newHitRecord.push({
				time,
				shot: hitRecord.length + 1,
				split: time - (hitRecord[hitRecord.length - 1]?.time || 0),
			});
			console.log(newHitRecord);
			setHitRecord(newHitRecord);
			setDisplayHitRecordIndex(hitRecord.length - 1);
			setDisplayTime(time);
		},
		[hitRecord, displayTime]
	);

	function onClearButtonClick() {
		stopCountdown?.();
		Stopplate.clearAllHitCallbacks();
		setDisplayHitRecordIndex(0);
		setDisplayTime(0);
		setHitRecord([]);
		setButtonDisabled({
			clear: true,
			review: true,
			start: false,
			setting: false,
		});
	}

	function onReviewButtonClick() {
		setButtonDisabled({
			clear: false,
			review: true,
			start: true,
			setting: true,
		});
	}

	function onRecordClick(index: number) {
		setDisplayHitRecordIndex(index);
		setDisplayTime(hitRecord[index].time);
	}

	useEffect(() => {
		return () => {
			Stopplate.clearAllHitCallbacks();
			setHitRecord([]);
			setDisplayHitRecordIndex(0);
			stopCountdown?.();
			setDisplayTime(0);
			setButtonDisabled({
				review: true,
				start: false,
				clear: true,
				setting: false,
			});
		};
	}, []);

	return (
		<>
			<TimerSetting
				key={"timer-setting-key"}
				openTrigger="timer-setting"
			/>
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
								Shot: #{displayHitRecordIndex + 1}/
								{hitRecord.length}
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
								Split:{" "}
								{(
									hitRecord[displayHitRecordIndex]?.split || 0
								).toFixed(2)}
								s
							</pre>
						</IonText>
					</IonCol>
				</IonRow>
				<IonRow>
					<IonGrid>
						<IonRow>
							<IonCol size="6">
								<Button
									disabled={buttonDisabled.review}
									onClick={onReviewButtonClick}
								>
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
									{countingDown ? "Stop" : "Clear"}
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
					<IonCol size="12" style={{ marginBottom: "50px" }}>
						<BlockTitle>Hit record</BlockTitle>
						<List strong inset>
							{hitRecord.toReversed().map((record, index) => (
								<ListItem
									key={index}
									link
									chevron={false}
									title={record.time.toFixed(5)}
									after={`ShotShot #${record.shot}`}
									subtitle={`Split ${record.split.toFixed(
										2
									)}s`}
									//because the list is reversed, we need to subtract the index from the length of the array to get the correct index of the record
									onClick={() =>
										onRecordClick(
											hitRecord.length - 1 - index
										)
									}
								/>
							))}
							{hitRecord.length === 0 && (
								<ListItem
									link
									chevron={false}
									title="No hit record"
								/>
							)}
						</List>
					</IonCol>
				</IonRow>
			</IonGrid>
		</>
	);
};

export { Timer };
