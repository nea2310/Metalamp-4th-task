
// eslint-disable-next-line no-unused-vars
import { Observer } from '../observer';
import { Idata, IConf } from '../interface';

class TestOB extends Observer {
	constructor() {
		super();
	}

	// notifyTest(key: string, data: Idata, conf: IConf) {
	// 	this.fire(key, data, conf);
	// }
}

describe('Observer - subscribe, unsubscribe, fire', () => {

	//let ob: TestOB;
	// let сallback: Function;
	// let сallback2: Function;



	test('subscribe', () => {
		let ob = new TestOB();
		let cb1 = () => true;
		let cb2 = () => true;
		expect(ob.observers).toHaveLength(0);
		expect(ob.subscribe(cb1)).toEqual([cb1]);
		expect(ob.subscribe(cb2)).toEqual([cb1, cb2]);
		expect(ob.subscribe(cb2)).toBe(false);
		expect(ob.observers).toEqual([cb1, cb2]);
	});

	test('unsubscribe', () => {
		let ob = new TestOB();
		let cb1 = () => true;
		let cb2 = () => true;
		let cb3 = () => true;
		ob.subscribe(cb1);
		ob.subscribe(cb2);
		expect(ob.observers).toEqual([cb1, cb2]);
		expect(ob.unsubscribe(cb1)).toEqual([cb2]);
		expect(ob.unsubscribe(cb3)).toEqual([cb2]);
	});


	test('fire', () => {
		let ob = new TestOB();
		let cb1 = jest.fn();
		let cb2 = jest.fn();
		let arg1 = 'key';
		let arg2 = {};
		let arg3 = {};
		ob.subscribe(cb1);
		ob.subscribe(cb2);

		ob.fire(arg1, {});
		expect(cb1).toBeCalledTimes(1);
		expect(cb1.mock.calls[0][0]).toBe(arg1);
		expect(cb1.mock.calls[0][1]).toEqual(arg2);
		expect(cb1.mock.calls[0][2]).toEqual(arg3);

		expect(cb2).toBeCalledTimes(1);
		expect(cb2.mock.calls[0][0]).toBe(arg1);
		expect(cb2.mock.calls[0][1]).toEqual(arg2);
		expect(cb2.mock.calls[0][2]).toEqual(arg3);
	});
});