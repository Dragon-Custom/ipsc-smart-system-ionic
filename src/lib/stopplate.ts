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

export function Singleton<T>() {
	return class Singleton {
		static instance: T; // must be public

		protected constructor() {}

		public static getInstance(): T {
			if (!this.instance) this.instance = new this() as T;

			return this.instance;
		}
	};
}
export abstract class StopPlate {
	private hit_cb: StopPlateHitCallback[] = [];
	private disconnect_cb: Function[] = [];
	public abstract get isConnected(): boolean;

	/**
	 * if success, return true, else return false
	 */
	abstract connect(): Promise<boolean>;
	abstract disconnect(): Promise<void>;
	/**
	 * if success, return the config, else return false
	 */
	abstract retrieveConfig(): Promise<StopplateSettingDTO | false>;
	abstract setConfig(config: StopplateSettingDTO): Promise<void>;
	abstract performTimeSync(): Promise<void>;

	registerDisconnectCallback(func: Function): number {
		const callback_id = Math.random();
		this.disconnect_cb[callback_id] = func;
		return callback_id;
	}
	unregisterDisconnectCallback(callback_id: number) {
		delete this.disconnect_cb[callback_id];
	}

	registerHitCallback(func: StopPlateHitCallback): CallbackID {
		const callback_id = Math.random();
		this.hit_cb[callback_id] = func;
		return callback_id;
	}

	unregisterHitCallback(callback_id: CallbackID) {
		delete this.hit_cb[callback_id];
	}

	private onHit(timestamp: number) {
		this.hit_cb.forEach((cb) => cb(timestamp));
	}
	protected onDisconnect() {
		this.disconnect_cb.forEach((cb) => cb());
	}
}
