


export type StopPlateHitCallback = (timestamp: number) => void;
export type CallbackID = number;

export interface StopplateSettingDTO {
	indicator_light_up_duration: number;
	countdown_random_time_min: number;
	countdown_random_time_max: number;
	buzzer_duration: number;
	buzzer_frequency: number;
	buzzer_waveform: number;
}

export abstract class StopPlate {
	private hit_cb: Function[] = [];

	abstract connect(): Promise<void>;
	abstract disconnect(): Promise<void>;
	abstract retriveConfig(): Promise<StopplateSettingDTO>;
	abstract setConfig(config: StopplateSettingDTO): Promise<void>;

	registerHitCallback(func: StopPlateHitCallback): CallbackID {
		const callback_id = Math.random();
		this.hit_cb[callback_id](func);
		return callback_id;
	}

	unregisterHitCallback(callback_id: CallbackID) {
		delete this.hit_cb[callback_id];
	}

	private onHit(timestamp: number) {
		this.hit_cb.forEach((cb) => cb(timestamp));
	}
}