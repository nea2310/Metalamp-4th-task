import {
	Idata, IConf
} from './interface';


class Observer {
	observers: Function[];

	constructor() {
		this.observers = [];
	}

	subscribe(observer: Function) {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
			return this.observers;
		}
		else return false;
	}

	unsubscribe(observer: Function) {
		this.observers = this.observers.filter(obs => obs !== observer);
		return this.observers;
	}

	fire(key: string, data: Idata, conf: IConf = {}) {
		for (let item of this.observers) {
			item(key, data, conf);
		}
	}
}






export { Observer };