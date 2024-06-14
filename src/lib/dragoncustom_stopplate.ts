import { BuzzerWaveformType } from "./buzzer";
import {
	BleClient,
	BleDevice,
	numbersToDataView,
	numberToUUID,
} from "@capacitor-community/bluetooth-le";
import { CallbackID, StopPlate, StopPlateHitCallback, StopplateSettingDTO } from "./stopplate";

const SERVICE_UUID = "7a0247e7-8e88-409b-a959-ab5092ddb03e";
const START_SIGNAL_CHARACTERISTIC_UUID = "3c224d84-566d-4f13-8b1c-2117021ff1a2";
const STOP_SIGNAL_CHARACTERISTIC_UUID = "57b92756-3df4-4038-b825-fc8e1c2fdb5b";
const TIME_SYNC_REQUEST_CHARACTERISTIC_UUID =
	"840a0941-55e9-44e4-bfff-1c3c27bf6af0";
const TIME_SYNC_WRITE_CHARACTERISTIC_UUID =
	"e0832e3e-f1e1-43b1-9569-109e2770e3ed";
const SETTING_CHARACTERISTIC_UUID = "798f2478-4c44-417f-bb6e-ee2a826cc17c";


export class DragonCustomStopplate extends StopPlate {
	async connect(): Promise<void> {
		
	}
	async disconnect(): Promise<void> {
		
	}
	async retriveConfig(): Promise<StopplateSettingDTO> {
		
	}
	async setConfig(config: StopplateSettingDTO): Promise<void> {
		
	}
}