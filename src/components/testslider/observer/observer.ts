
import {
	$Idata,
} from './../interface';


class Observer {
	observers: Function[];

	constructor() {
		this.observers = [];
	}

	subscribe(observer: Function) {
		this.observers.push(observer);
	}

	unsubscribe(observer: Function) {
		this.observers = this.observers.filter(obs => obs !== observer);
	}

	fire(key: string, conf: $Idata) {

		for (let item of this.observers)
			item(key, conf);
	}
}






export { Observer };