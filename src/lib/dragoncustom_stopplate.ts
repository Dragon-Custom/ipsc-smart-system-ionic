import { BuzzerWaveformType } from "./buzzer";
import {
	BleClient,
	BleDevice,
	numbersToDataView,
	numberToUUID,
} from "@capacitor-community/bluetooth-le";
import {
	CallbackID,
	Singleton,
	StopPlate,
	StopPlateHitCallback,
	StopplateSettingDTO,
} from "./stopplate";
import { App } from "@capacitor/app";
import { Device } from "@capacitor/device";
import { delay } from "./delay";

const SERVICE_UUID = "7a0247e7-8e88-409b-a959-ab5092ddb03e";
const START_SIGNAL_CHARACTERISTIC_UUID = "3c224d84-566d-4f13-8b1c-2117021ff1a2";
const STOP_SIGNAL_CHARACTERISTIC_UUID = "57b92756-3df4-4038-b825-fc8e1c2fdb5b";
const TIME_SYNC_REQUEST_CHARACTERISTIC_UUID =
	"840a0941-55e9-44e4-bfff-1c3c27bf6af0";
const TIME_SYNC_WRITE_CHARACTERISTIC_UUID =
	"e0832e3e-f1e1-43b1-9569-109e2770e3ed";
const SETTING_CHARACTERISTIC_UUID = "798f2478-4c44-417f-bb6e-ee2a826cc17c";

export class DragonCustomStopplate extends StopPlate {
	private bleDevice: BleDevice | null = null;

	private static _instance: DragonCustomStopplate | null = null;
	public static getInstance(): DragonCustomStopplate {
		if (!DragonCustomStopplate._instance) {
			DragonCustomStopplate._instance = new DragonCustomStopplate();
		}
		return DragonCustomStopplate._instance;
	}

	async connect(): Promise<boolean> {
		await BleClient.initialize({
			androidNeverForLocation: false,
		});
		const bluetoothEnabled = await BleClient.isEnabled();
		console.log("bluetoothEnabled", bluetoothEnabled);
		const deviceInfo = await Device.getInfo();
		if (!bluetoothEnabled) {
			if (
				deviceInfo.operatingSystem == "android" &&
				deviceInfo.platform != "web"
			)
				await BleClient.requestEnable();
			else alert("Please turn on the bluetooth");
		}

		await BleClient.setDisplayStrings({
			availableDevices: "Select your stopplate",
			noDeviceFound: "No stopplate found",
			scanning: "Scanning for stopplates",
		});
		const device = await BleClient.requestDevice({
			services: [SERVICE_UUID],
		});
		try {
			await BleClient.disconnect(device.deviceId);
		} finally {
			await BleClient.connect(device.deviceId, this._onDisconnect);
		}
		this.bleDevice = device;
		console.log("connected to device", device);

		let services = await BleClient.getServices(this.bleDevice.deviceId);
		console.log("services", services);

		if (deviceInfo.platform != "web")
			await BleClient.discoverServices(this.bleDevice.deviceId);
		this.bleDevice = device;

		return true;
	}

	private getPrecisionTime() {
		return Date.now() * 0.001;
	}
	/**
	 * perform christian tme syncronization
	 */
	public async performTimeSync() {
		console.log("performTimeSync", this.bleDevice);
		if (!this.bleDevice?.deviceId) return;
		await new Promise((resolve) => {
			if (!this.bleDevice?.deviceId) return;
			let timeSyncDebouce = debounce(resolve, 500);
			timeSyncDebouce();
			BleClient.startNotifications(
				this.bleDevice.deviceId,
				SERVICE_UUID,
				TIME_SYNC_REQUEST_CHARACTERISTIC_UUID,
				(data) => {
					if (!this.bleDevice?.deviceId) return;
					console.log("time sync require", data);
					BleClient.write(
						this.bleDevice.deviceId,
						SERVICE_UUID,
						TIME_SYNC_WRITE_CHARACTERISTIC_UUID,
						new DataView(
							new TextEncoder().encode(
								this.getPrecisionTime().toString()
							).buffer
						)
					);
					timeSyncDebouce();
				}
			);
			BleClient.write(
				this.bleDevice.deviceId,
				SERVICE_UUID,
				TIME_SYNC_REQUEST_CHARACTERISTIC_UUID,
				new DataView(new TextEncoder().encode("INIT").buffer)
			);
		});
	}

	public get isConnected(): boolean {
		return this.bleDevice !== null;
	}

	private _onDisconnect = (deviceId: string) => {
		console.log("device disconnected", deviceId);
		this.bleDevice = null;
		this.onDisconnect();
	};

	async disconnect(): Promise<void> {
		if (!this.bleDevice?.deviceId) return;
		console.log("disconnecting device", this.bleDevice.deviceId);
		await BleClient.disconnect(this.bleDevice.deviceId);
		await BleClient.initialize();
		this.bleDevice = null;
		return;
	}

	async retrieveConfig(): Promise<StopplateSettingDTO | false> {
		if (!this.bleDevice?.deviceId) return false;
		const SETTING_CHAR: DataView | undefined = await BleClient.read(
			this.bleDevice.deviceId,
			SERVICE_UUID,
			SETTING_CHARACTERISTIC_UUID
		);
		return JSON.parse(
			new TextDecoder().decode(SETTING_CHAR)
		) as StopplateSettingDTO;
	}
	async setConfig(config: StopplateSettingDTO): Promise<void> {
		if (!this.bleDevice?.deviceId) return;
		config.buzzer_duration = Math.round(config.buzzer_duration);
		config.buzzer_frequency = Math.round(config.buzzer_frequency);
		config.indicator_light_up_duration = Math.round(
			config.indicator_light_up_duration
		);
		await BleClient.write(
			this.bleDevice.deviceId,
			SERVICE_UUID,
			SETTING_CHARACTERISTIC_UUID,
			new DataView(
				new TextEncoder().encode(JSON.stringify(config)).buffer
			)
		);
	}
}

//https://www.explainthis.io/en/swe/debounce
function debounce(fn: Function, delay = 500) {
	let timer: NodeJS.Timeout;

	return (...args: any[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}
