import {
	IonModal,
	IonRange,
	IonText,
	useIonLoading,
} from "@ionic/react";
import { FC, useEffect, useRef, useState } from "react";
import "./Setting.css";
import {
	BlockTitle,
	Button,
	List,
	ListItem,
	Page,
	Segmented,
	SegmentedButton,
	Toolbar,
} from "konsta/react";
import {
	BUZZER_WAVEFORM_OBJECT,
	BuzzerWaveformType,
	DragonCustomStopplate,
	beep,
} from "../../lib";
import { delay } from "../../lib/delay";

// Create a new component IndicatorDurationSelector.tsx

import React from "react";
import { useControl } from "../../lib/useControl";

interface SettingSliderBlockProps {
	value: number | number[];
	onChange: (value: number | number[]) => void;
	min: number;
	max: number;
	title: string;
	unit?: string;
	dual?: boolean;
	step?: number;
}

const SettingSliderBlock: React.FC<SettingSliderBlockProps> = (
	props: SettingSliderBlockProps
) => {
	return (
		<>
			<BlockTitle>
				{props.dual ? (
					<>
						{props.title}: {(props.value as number[])[0]}&#8198;
						{props.unit || ""} - {(props.value as number[])[1]}
						&#8198;
						{props.unit || ""}
					</>
				) : (
					<>
						{props.title}: {props.value}&#8198;
						{props.unit || ""}
					</>
				)}
			</BlockTitle>
			{/* <BlockHeader>From 0 to 100 with step 10</BlockHeader> */}
			<List strong insetMaterial outlineIos>
				<ListItem
					innerChildren={
						<div
							style={{
								width: "100%",
								height: "100%",
								alignItems: "center",
							}}
							className="flex space-x-4 rtl:space-x-reverse"
						>
							<span
								onClick={() =>
									props.dual
										? props.onChange([
												Math.max(
													props.min,
													(
														props.value as number[]
													)[0] - 1
												),
												(props.value as number[])[1],
										  ])
										: props.onChange(props.min)
								}
							>
								{props.min}
							</span>
							<div
								style={{
									width: "100%",
								}}
							>
								<IonRange
									style={{
										paddingTop: 0,
									}}
									max={props.max}
									min={props.min}
									value={
										props.dual
											? {
													lower: (
														props.value as number[]
													)[0],
													upper: (
														props.value as number[]
													)[1],
											  }
											: (props.value as number)
									}
									ticks={true}
									pin={true}
									snaps={true}
									step={props.step || 1}
									pinFormatter={(value) =>
										`${value}${props.unit || ""}`
									}
									onIonChange={(e) => {
										if (props.dual) {
											const range = e.detail.value as {
												lower: number;
												upper: number;
											};
											props.onChange([
												range.lower,
												range.upper,
											]);
										} else {
											props.onChange(e.detail.value as number);
										}
									}}
									dualKnobs={props.dual}
								/>
							</div>
							<span
								onClick={() =>
									props.dual
										? props.onChange([
												(props.value as number[])[0],
												Math.min(
													props.max,
													(
														props.value as number[]
													)[1] + 1
												),
										  ])
										: props.onChange(props.max)
								}
							>
								{props.max}
							</span>
						</div>
					}
				/>
			</List>
		</>
	);
};

export default SettingSliderBlock;

export interface TimerSettingProps {
	openTrigger: string;
}

let cb_id: number | null = null;

const TimerSetting: FC<TimerSettingProps> = (props: TimerSettingProps) => {
	const modal = useRef<HTMLIonModalElement>(null);
	const [connected, setConnected] = useState(false);
	const BLEInstance = DragonCustomStopplate.getInstance();
	const [loading, loaded] = useIonLoading();

	// #region config
	const [wave, setWave] = useState(BuzzerWaveformType.SINE);
	const [
		[indicatorDuration, setIndicatorDuration],
		IndicatorLightSettingElement,
	] = useControl(0, (value, onChange) => (
		<SettingSliderBlock
			max={30}
			min={0}
			unit="s"
			title="Indicator light duration"
			value={value}
			onChange={(newValue) => {
				onChange(newValue as number);
			}}
		/>
	));
	const [
		[buzzerFrequency, setBuzzerFrequency],
		BuzzerFrequencySettingElement,
	] = useControl(10, (value, onChange) => (
		<SettingSliderBlock
			max={4096}
			min={10}
			unit="Hz"
			title="Buzzer frequency"
			value={value}
			onChange={(newValue) => {
				onChange(newValue as number);
			}}
		/>
	));
	const [[buzzerDuration, setBuzzerDuration], BuzzerDurationSettingElement] =
		useControl(1, (value, onChange) => (
			<SettingSliderBlock
				max={10}
				min={1}
				unit="s"
				title="Buzzer duration"
				value={value}
				onChange={(newValue) => {
					onChange(newValue as number);
				}}
			/>
		));
	const [
		[coutdownRandomTime, setCoutdownRandomTime],
		CoutdownRandomTimeSettingElement,
	] = useControl([0, 0], (value, onChange) => (
		<SettingSliderBlock
			max={10}
			min={0}
			unit="s"
			step={0.1}
			title="Buzzer duration"
			value={value}
			dual={true}
			onChange={(newValue) => {
				onChange(newValue as number[]);
			}}
		/>
	));
	// #endregion

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

	async function onApplyConfigButtonClicked() {
		// this beep is for trigger the ios buzzer enable, without this, the buzzer will not beep on ios
		beep(0, "sine", 1);
		await BLEInstance.setConfig({
			buzzer_duration: buzzerDuration,
			buzzer_frequency: buzzerFrequency,
			indicator_light_up_duration: indicatorDuration,
			countdown_random_time_max: coutdownRandomTime[1],
			countdown_random_time_min: coutdownRandomTime[0],
			buzzer_waveform: wave,
		});
	}

	function onTestBuzzerButtonClicked() {
		beep(
			buzzerFrequency,
			BUZZER_WAVEFORM_OBJECT[wave],
			buzzerDuration * 1000
		);
	}

	useEffect(() => {
		(async () => {
			await delay(100);
			const stopplateConfig = await BLEInstance.retrieveConfig();
			if (!stopplateConfig) return;
			setIndicatorDuration(stopplateConfig.indicator_light_up_duration);
			setBuzzerFrequency(stopplateConfig.buzzer_frequency);
			setBuzzerDuration(stopplateConfig.buzzer_duration);
			setCoutdownRandomTime([
				stopplateConfig.countdown_random_time_min,
				stopplateConfig.countdown_random_time_max,
			]);
		})();
	}, [connected]);

	useEffect(() => {
		if (!cb_id)
			cb_id = BLEInstance.registerDisconnectCallback(() => {
				setConnected(BLEInstance.isConnected);
			});
	}, []);

	// useEffect(() => {
	// 	return () => {
	// 		if (typeof cb_id === "number")
	// 			BLEInstance.unregisterDisconnectCallback(cb_id);
	// 	};
	// }, []);

	return (
		<>
			<IonModal
				id="setting-modal"
				ref={modal}
				onIonModalDidPresent={() =>
					setConnected(BLEInstance.isConnected)
				}
				onIonModalWillDismiss={() => {
					// this beep is for trigger the ios buzzer enable, without this, the buzzer will not beep on ios
					beep(0, "sine", 1);
				}}
				trigger={props.openTrigger}
			>
				<div className="wrapper">
					<Page>
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
							largeIos
						>
							{connected ? "Disconnect" : "Connect"}
						</Button>
						<List hidden={!connected}>
							<Button
								outline
								raised
								onClick={onApplyConfigButtonClicked}
								largeIos
							>
								Apply change
							</Button>
							{IndicatorLightSettingElement}
							{BuzzerFrequencySettingElement}
							{BuzzerDurationSettingElement}
							{CoutdownRandomTimeSettingElement}
							<Segmented outline raised>
								{BUZZER_WAVEFORM_OBJECT.map((item, index) => (
									<SegmentedButton
										key={index}
										active={wave === index}
										onClick={() => setWave(index)}
									>
										{item}
									</SegmentedButton>
								))}
							</Segmented>
							<Button
								tonal
								raised
								onClick={onTestBuzzerButtonClicked}
								largeIos
							>
								Test buzzer
							</Button>
						</List>
					</Page>
				</div>
			</IonModal>
		</>
	);
};

export { TimerSetting };
